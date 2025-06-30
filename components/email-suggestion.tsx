"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, Mail } from "lucide-react"

interface EmailSuggestionProps {
  onEmailSelect: (email: string) => void
}

export function EmailSuggestion({ onEmailSelect }: EmailSuggestionProps) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  const suggestedEmails = ["yourname@gmail.com", "yourname@yahoo.com", "yourname@outlook.com", "yourname@hotmail.com"]

  if (!showSuggestions) return null

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="mb-2">
          <strong>Need a valid email?</strong> Test domains like "test.com" are not allowed. Try one of these formats:
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestedEmails.map((email) => (
            <Button
              key={email}
              variant="outline"
              size="sm"
              className="h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
              onClick={() => {
                onEmailSelect(email)
                setShowSuggestions(false)
              }}
            >
              <Mail className="h-3 w-3 mr-1" />
              {email}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-blue-600 p-0"
          onClick={() => setShowSuggestions(false)}
        >
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  )
}
