"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: string
  name: string
  type: "landlord" | "agent" | "property_manager" | "tenant"
  avatar?: string
  rating: number
  reviewCount: number
  location: string
  joinDate: string
  recentReview?: string
  verified: boolean
}

interface SearchResultsProps {
  query: string
  onClose?: () => void
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchUsers = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          type: "landlord",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
          reviewCount: 24,
          location: "Chicago, IL",
          joinDate: "2022-03-15",
          recentReview: "Very responsive and professional landlord",
          verified: true,
        },
        {
          id: "2",
          name: "Mike Chen",
          type: "agent",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.6,
          reviewCount: 18,
          location: "Austin, TX",
          joinDate: "2021-11-08",
          recentReview: "Helped us find the perfect home",
          verified: true,
        },
        {
          id: "3",
          name: "Lisa Rodriguez",
          type: "property_manager",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.9,
          reviewCount: 31,
          location: "Denver, CO",
          joinDate: "2020-07-22",
          recentReview: "Excellent property management services",
          verified: false,
        },
        {
          id: "4",
          name: "David Kim",
          type: "landlord",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 3.8,
          reviewCount: 12,
          location: "Seattle, WA",
          joinDate: "2023-01-10",
          recentReview: "Decent landlord but slow to respond",
          verified: true,
        },
      ].filter(
        (result) =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.location.toLowerCase().includes(query.toLowerCase()),
      )

      setResults(mockResults)
      setIsLoading(false)
    }

    if (query) {
      searchUsers()
    }
  }, [query])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "landlord":
        return "Landlord"
      case "agent":
        return "Real Estate Agent"
      case "property_manager":
        return "Property Manager"
      case "tenant":
        return "Tenant"
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "landlord":
        return "bg-blue-100 text-blue-800"
      case "agent":
        return "bg-green-100 text-green-800"
      case "property_manager":
        return "bg-purple-100 text-purple-800"
      case "tenant":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No results found for "{query}"</p>
        <p className="text-sm text-gray-400 mt-2">Try searching with a different name or location</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Found {results.length} results for "{query}"
      </p>

      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.name} />
                <AvatarFallback>
                  {result.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{result.name}</h3>
                  {result.verified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <Badge className={`text-xs ${getTypeColor(result.type)}`}>{getTypeLabel(result.type)}</Badge>

                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{result.rating}</span>
                    <span className="text-gray-500">({result.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{result.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(result.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {result.recentReview && <p className="text-sm text-gray-600 italic mb-4">"{result.recentReview}"</p>}

                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/profile/${result.id}`}>View Profile</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/review/${result.id}`}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Write Review
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
