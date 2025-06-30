import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_type: "tenant" | "landlord" | "agent" | "property_manager"
  bio: string | null
  location: string | null
  phone: string | null
  website: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  title: string | null
  content: string
  property_address: string | null
  review_type: "landlord" | "tenant" | "agent" | "property_manager"
  is_anonymous: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  reviewer?: Profile
  reviewee?: Profile
}

export interface ReviewVote {
  id: string
  review_id: string
  user_id: string
  is_helpful: boolean
  created_at: string
}

// Helper function to check if user is authenticated
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}
