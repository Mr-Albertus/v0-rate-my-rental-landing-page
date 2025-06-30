"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase, type Profile } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  type: "tenant" | "landlord" | "agent" | "property_manager"
  joinDate: string
  reviewsCount: number
  averageRating: number
  profile?: Profile
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
    type: User["type"],
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        if (session?.user) {
          console.log("Initial session found:", session.user.id)
          setSupabaseUser(session.user)
          await loadUserProfile(session.user)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session?.user?.id)

      try {
        if (session?.user) {
          setSupabaseUser(session.user)

          // For new signups, wait a bit for the trigger to create the profile
          if (event === "SIGNED_UP") {
            console.log("New signup detected, waiting for profile creation...")
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }

          await loadUserProfile(session.user)
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const loadUserProfile = async (supabaseUser: SupabaseUser, retries = 5) => {
    try {
      console.log("Loading profile for user:", supabaseUser.id)

      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()

      if (error) {
        console.error("Error loading profile:", error)

        // If profile doesn't exist and we have retries left, wait and try again
        if (error.code === "PGRST116" && retries > 0) {
          console.log(`Profile not found, retrying... (${retries} retries left)`)
          await new Promise((resolve) => setTimeout(resolve, 1500))
          return loadUserProfile(supabaseUser, retries - 1)
        }

        // If still no profile after retries, create one manually
        if (error.code === "PGRST116" && retries === 0) {
          console.log("Creating profile manually...")
          const { error: insertError } = await supabase.from("profiles").insert({
            id: supabaseUser.id,
            email: supabaseUser.email!,
            full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            user_type: supabaseUser.user_metadata?.user_type || "tenant",
          })

          if (insertError) {
            console.error("Error creating profile manually:", insertError)
            return
          }

          // Try loading again after manual creation
          return loadUserProfile(supabaseUser, 0)
        }

        return
      }

      console.log("Profile loaded successfully:", profile)

      // Get review count and average rating
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("reviewee_id", supabaseUser.id)

      if (reviewsError) {
        console.error("Error loading reviews:", reviewsError)
      }

      const reviewsCount = reviews?.length || 0
      const averageRating =
        reviewsCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount : 0

      const userData: User = {
        id: supabaseUser.id,
        name: profile.full_name || profile.email,
        email: profile.email,
        avatar: profile.avatar_url || undefined,
        type: profile.user_type,
        joinDate: profile.created_at,
        reviewsCount,
        averageRating,
        profile,
      }

      setUser(userData)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log("Login successful:", data.user.id)
        setSupabaseUser(data.user)
        await loadUserProfile(data.user)
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    type: User["type"],
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      console.log("Signing up user:", { name, email, type })

      // Enhanced email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      // Check for invalid domains that Supabase typically rejects
      const invalidDomains = [
        "test.com",
        "example.com",
        "temp.com",
        "fake.com",
        "invalid.com",
        "dummy.com",
        "sample.com",
        "demo.com",
        "localhost",
        "127.0.0.1",
      ]

      const emailDomain = email.split("@")[1]?.toLowerCase()
      if (invalidDomains.includes(emailDomain)) {
        return {
          success: false,
          error:
            "Please use a real email address from a valid provider like Gmail, Yahoo, Outlook, or your organization's domain.",
        }
      }

      // Additional validation for common patterns that might be rejected
      if (email.includes("test") && emailDomain === "test.com") {
        return {
          success: false,
          error: "Test email addresses are not allowed. Please use your real email address.",
        }
      }

      // Trim and lowercase email
      const cleanEmail = email.trim().toLowerCase()

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: name,
            user_type: type,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Signup error:", error)

        // Handle specific error cases with better messages
        if (error.message.includes("invalid") || error.message.includes("Invalid")) {
          return {
            success: false,
            error:
              "The email address format is invalid. Please use a real email from Gmail, Yahoo, Outlook, or another valid provider.",
          }
        }

        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          return { success: false, error: "An account with this email already exists. Please try logging in instead." }
        }

        if (error.message.includes("weak password") || error.message.includes("password")) {
          return {
            success: false,
            error: "Password must be at least 8 characters long and contain a mix of letters and numbers",
          }
        }

        if (error.message.includes("rate limit") || error.message.includes("too many")) {
          return {
            success: false,
            error: "Too many signup attempts. Please wait a few minutes before trying again.",
          }
        }

        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id)
        setSupabaseUser(data.user)

        // Check if email confirmation is required
        if (!data.session) {
          console.log("Email confirmation required")
          return {
            success: true,
            error: "Please check your email and click the confirmation link to complete your registration.",
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, error: "An unexpected error occurred. Please try again with a different email address." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
      }
      setUser(null)
      setSupabaseUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!supabaseUser) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      const { error } = await supabase.from("profiles").update(updates).eq("id", supabaseUser.id)

      if (error) {
        console.error("Profile update error:", error)
        return { success: false, error: error.message }
      }

      // Reload user profile
      await loadUserProfile(supabaseUser)
      return { success: true }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        login,
        signup,
        logout,
        isLoading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
