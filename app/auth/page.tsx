"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Home,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Star,
  Shield,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { EmailSuggestion } from "@/components/email-suggestion"

function AuthContent() {
  const { login, signup, isLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"
  const [activeTab, setActiveTab] = useState(defaultTab)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "tenant" as const,
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user && !showSuccessMessage) {
      router.push("/dashboard")
    }
  }, [user, mounted, router, showSuccessMessage])

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    // Validation
    if (!loginForm.email || !loginForm.password) {
      setErrors({ general: "Please fill in all fields" })
      setIsSubmitting(false)
      return
    }

    if (!validateEmail(loginForm.email)) {
      setErrors({ email: "Please enter a valid email address" })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await login(loginForm.email, loginForm.password)
      if (result.success) {
        // Success will be handled by the useEffect when user state updates
      } else {
        setErrors({ general: result.error || "Login failed" })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "An error occurred. Please try again." })
    }

    setIsSubmitting(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    // Validation
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setErrors({ general: "Please fill in all fields" })
      setIsSubmitting(false)
      return
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!validateEmail(signupForm.email) || !emailRegex.test(signupForm.email)) {
      setErrors({
        email: "Please enter a valid email address (e.g., yourname@gmail.com)",
      })
      setIsSubmitting(false)
      return
    }

    // Check for invalid test domains that Supabase rejects
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
    ]
    const emailDomain = signupForm.email.split("@")[1]?.toLowerCase()
    if (invalidDomains.includes(emailDomain)) {
      setErrors({
        email:
          "Please use a real email address from Gmail, Yahoo, Outlook, or another valid email provider. Test domains are not allowed.",
      })
      setIsSubmitting(false)
      return
    }

    // Check for test patterns in email
    if (signupForm.email.toLowerCase().includes("test@test")) {
      setErrors({
        email: "Please use your real email address. Test emails like 'test@test.com' are not allowed.",
      })
      setIsSubmitting(false)
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      setIsSubmitting(false)
      return
    }

    if (signupForm.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters long" })
      setIsSubmitting(false)
      return
    }

    // Enhanced password validation
    const hasLetter = /[a-zA-Z]/.test(signupForm.password)
    const hasNumber = /\d/.test(signupForm.password)
    if (!hasLetter || !hasNumber) {
      setErrors({ password: "Password must contain at least one letter and one number" })
      setIsSubmitting(false)
      return
    }

    if (!signupForm.agreeToTerms) {
      setErrors({ terms: "Please agree to the Terms of Service and Privacy Policy" })
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Attempting signup...")
      const result = await signup(signupForm.name, signupForm.email, signupForm.password, signupForm.type)

      if (result.success) {
        console.log("Signup successful")

        // Check if it's an email confirmation message
        if (result.error && result.error.includes("email")) {
          setSuccessMessage(result.error)
          setShowSuccessMessage(true)

          // Clear form
          setSignupForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            type: "tenant",
            agreeToTerms: false,
          })
        } else {
          setSuccessMessage("Account created successfully! Redirecting to dashboard...")
          setShowSuccessMessage(true)

          // Clear form
          setSignupForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            type: "tenant",
            agreeToTerms: false,
          })

          // Redirect after a short delay to show success message
          setTimeout(() => {
            setShowSuccessMessage(false)
            router.push("/dashboard")
          }, 2000)
        }
      } else {
        console.error("Signup failed:", result.error)
        setErrors({ general: result.error || "Failed to create account" })
      }
    } catch (error) {
      console.error("Signup error:", error)
      setErrors({ general: "An error occurred. Please try again." })
    }

    setIsSubmitting(false)
  }

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    setErrors({ general: `${provider} login coming soon!` })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showSuccessMessage) {
    const isEmailConfirmation = successMessage.includes("email")

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div
              className={`w-16 h-16 ${isEmailConfirmation ? "bg-blue-100" : "bg-green-100"} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {isEmailConfirmation ? (
                <Mail className="w-8 h-8 text-blue-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isEmailConfirmation ? "Check Your Email" : "Welcome to RateMyRental!"}
            </h2>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            {!isEmailConfirmation && (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
              </>
            )}
            {isEmailConfirmation && (
              <Button onClick={() => setShowSuccessMessage(false)} className="mt-4">
                Back to Login
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <Home className="h-6 w-6 mr-2 text-blue-600" />
              <span className="font-semibold">Back to RateMyRental</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-16">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <Home className="h-10 w-10 mr-3" />
              <span className="text-2xl font-bold">RateMyRental</span>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">Join the community making rental decisions safer</h1>

            <p className="text-xl text-blue-100 mb-8">
              Connect with thousands of renters, landlords, and agents sharing honest reviews and experiences.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2 mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Verified Reviews</h3>
                  <p className="text-blue-100 text-sm">All reviews are from real users</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2 mr-4">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Growing Community</h3>
                  <p className="text-blue-100 text-sm">Join 50,000+ active members</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2 mr-4">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Trusted Platform</h3>
                  <p className="text-blue-100 text-sm">4.8/5 rating from our users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <div className="lg:hidden flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">RateMyRental</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {activeTab === "login" ? "Welcome back" : "Create your account"}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {activeTab === "login"
                    ? "Sign in to your account to continue"
                    : "Join our community of renters and landlords"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="text-sm">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full h-11 bg-transparent"
                        onClick={() => handleSocialLogin("Google")}
                        disabled={isSubmitting}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full h-11 bg-transparent"
                        onClick={() => handleSocialLogin("Facebook")}
                        disabled={isSubmitting}
                      >
                        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Continue with Facebook
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            disabled={isSubmitting}
                            className={`pl-10 h-11 ${errors.email ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            disabled={isSubmitting}
                            className={`pl-10 pr-10 h-11 ${errors.password ? "border-red-500" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            id="remember-me"
                            type="checkbox"
                            checked={loginForm.rememberMe}
                            onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <Label htmlFor="remember-me" className="text-sm text-gray-600">
                            Remember me
                          </Label>
                        </div>
                        <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                          Forgot password?
                        </Link>
                      </div>

                      {errors.general && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signup-name"
                            placeholder="Enter your full name"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            disabled={isSubmitting}
                            className={`pl-10 h-11 ${errors.name ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            disabled={isSubmitting}
                            className={`pl-10 h-11 ${errors.email ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                        {!signupForm.email && (
                          <EmailSuggestion onEmailSelect={(email) => setSignupForm({ ...signupForm, email })} />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="user-type">I am a</Label>
                        <Select
                          value={signupForm.type}
                          onValueChange={(value) => setSignupForm({ ...signupForm, type: value as any })}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tenant">Tenant</SelectItem>
                            <SelectItem value="landlord">Landlord</SelectItem>
                            <SelectItem value="agent">Real Estate Agent</SelectItem>
                            <SelectItem value="property_manager">Property Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            disabled={isSubmitting}
                            className={`pl-10 pr-10 h-11 ${errors.password ? "border-red-500" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                        <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signup-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                            disabled={isSubmitting}
                            className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                      </div>

                      <div className="flex items-start space-x-2">
                        <input
                          id="agree-terms"
                          type="checkbox"
                          checked={signupForm.agreeToTerms}
                          onChange={(e) => setSignupForm({ ...signupForm, agreeToTerms: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        <Label htmlFor="agree-terms" className="text-sm text-gray-600 leading-5">
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

                      {errors.general && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-gray-600">
                  {activeTab === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setActiveTab("signup")}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  )
}
