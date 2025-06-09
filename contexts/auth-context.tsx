"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  type: "tenant" | "landlord" | "agent" | "property_manager"
  joinDate: string
  reviewsCount: number
  averageRating: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, type: User["type"]) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check for stored user session
    try {
      const storedUser = localStorage.getItem("ratemyrental_user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    }
    setIsLoading(false)
  }, [mounted])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
      type: "tenant",
      joinDate: "2024-01-15",
      reviewsCount: 12,
      averageRating: 4.8,
    }

    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("ratemyrental_user", JSON.stringify(mockUser))
    }
    setIsLoading(false)
    return true
  }

  const signup = async (name: string, email: string, password: string, type: User["type"]): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful signup
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      type,
      joinDate: new Date().toISOString().split("T")[0],
      reviewsCount: 0,
      averageRating: 0,
    }

    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("ratemyrental_user", JSON.stringify(mockUser))
    }
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("ratemyrental_user")
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
