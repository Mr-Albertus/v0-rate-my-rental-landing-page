"use client"

import type React from "react"

import { useState } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Star, CheckCircle, Facebook, Twitter, Instagram, Linkedin, Home, MessageSquare } from "lucide-react"
import Link from "next/link"

function RateMyRentalContent() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RateMyRental</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
                    <Link href="/auth">Login</Link>
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/auth?tab=signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Know Who You're Dealing With</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Rate and review landlords, sellers, agents, and tenants before you sign.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search for people or properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-14 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Making safer property decisions in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Search</h3>
              <p className="text-gray-600">Find landlords, agents, sellers, or tenants by name or property address</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Review</h3>
              <p className="text-gray-600">Read honest reviews and ratings from real tenants and buyers</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Decide</h3>
              <p className="text-gray-600">Make informed decisions with confidence based on community feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Ratings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
            <p className="text-xl text-gray-600">See what our community is saying</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                type: "Landlord",
                rating: 5,
                review: "Excellent landlord! Always responsive to maintenance requests and very professional.",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "Mike Chen",
                type: "Real Estate Agent",
                rating: 4,
                review: "Great agent who helped us find our dream home. Very knowledgeable about the area.",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "Lisa Rodriguez",
                type: "Property Manager",
                rating: 5,
                review: "Professional and fair. Made the rental process smooth and stress-free.",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "David Kim",
                type: "Landlord",
                rating: 3,
                review: "Decent landlord but slow to respond to issues. Property is well-maintained though.",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "Emma Wilson",
                type: "Tenant",
                rating: 5,
                review: "Excellent tenant! Always paid rent on time and kept the property in great condition.",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "James Brown",
                type: "Real Estate Agent",
                rating: 4,
                review: "Very helpful during the buying process. Negotiated a great deal for us.",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ].map((review, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {review.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6">
                  "RateMyRental saved me from a terrible landlord! The reviews warned me about unresponsive maintenance
                  and hidden fees. Found a much better place instead."
                </blockquote>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Alex Thompson" />
                    <AvatarFallback>AT</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Alex Thompson</div>
                    <div className="text-gray-600">Renter, Chicago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6">
                  "As a property manager, this platform helps me maintain transparency with tenants. The feedback helps
                  me improve my services and build trust."
                </blockquote>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Maria Garcia" />
                    <AvatarFallback>MG</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Maria Garcia</div>
                    <div className="text-gray-600">Property Manager, Austin</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join thousands making safer property decisions
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start rating and reviewing today to help build a more transparent rental market for everyone.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            onClick={() => {
              if (user) {
                window.location.href = "/dashboard"
              } else {
                window.location.href = "/auth?tab=signup"
              }
            }}
          >
            {user ? "Go to Dashboard" : "Get Started"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Home className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">RateMyRental</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Building transparency in the rental market through community-driven reviews and ratings.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Report Content
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RateMyRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function RateMyRentalLanding() {
  return (
    <AuthProvider>
      <RateMyRentalContent />
    </AuthProvider>
  )
}
