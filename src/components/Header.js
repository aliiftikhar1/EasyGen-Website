"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, ArrowRight, UserPlus, LogIn, CheckCircle2, X, Sparkles, Settings } from 'lucide-react'
import Link from "next/link"
import PreferenceStepper from "./Stepper"
import { checkUserPreferences } from "@/utils/preferences"
import { getApiUrl } from "@/utils/config"
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, logout, selectCurrentUser, selectIsAuthenticated, selectAccessToken, selectRefreshToken } from '@/lib/features/authSlice'

export default function Header() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectAccessToken)
  const refreshToken = useSelector(selectRefreshToken)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupZipCode, setSignupZipCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeDialog, setActiveDialog] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPreferences, setShowPreferences] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  useEffect(() => {
    if (token) {
      checkPreferencesOnLogin()
    }
  }, [token, checkPreferencesOnLogin])

  const checkPreferencesOnLogin = async () => {
    try {
      const hasPreferences = await checkUserPreferences(token)
      if (!hasPreferences) {
        // If user doesn't have preferences, show the preferences dialog
        setShowPreferences(true)
      }
    } catch (error) {
      console.error("Error checking preferences:", error)
    }
  }

  const handleTokenExpiration = () => {
    dispatch(logout())
    toast.error("Your session has expired. Please log in again.")
    setActiveDialog(null)
    setProfileDialogOpen(false)
    setShowPreferences(false)
  }

  const handlePasswordChange = (value) => {
    setSignupPassword(value)
    let strength = 0

    if (value.length >= 8) strength++
    if (/[A-Z]/.test(value)) strength++
    if (/[a-z]/.test(value)) strength++
    if (/\d/.test(value)) strength++
    if (/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) strength++

    setPasswordStrength(strength)
  }

  const handleAuth = async (type) => {
    try {
      if (type === "signup") {
        setIsSignupLoading(true)
        if (signupPassword !== signupConfirmPassword) {
          return toast.error("Passwords do not match")
        }

        const res = await fetch(getApiUrl("/auth/signup/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: signupName,
            email: signupEmail,
            phone_number: signupPhone,
            zip_code: signupZipCode,
            password: signupPassword,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          return toast.error(data?.detail || data?.message|| data?.phone_number || "Signup failed")
        }

        const data = await res.json()
        toast.success(data?.message || "Account created successfully")
        setActiveDialog("login")
      }

      if (type === "login") {
        setIsLoginLoading(true)
        const res = await fetch(getApiUrl("/auth/login/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          return toast.error(data?.detail || data?.message || "Login failed")
        }

        // Dispatch login action
        dispatch(setCredentials(data))

        toast.success("Logged in successfully")
        setActiveDialog(null)

        // Check if user has preferences after login
        setTimeout(() => {
          checkPreferencesOnLogin()
        }, 500)
      }

      // Reset form fields
      setLoginEmail("")
      setLoginPassword("")
      setSignupName("")
      setSignupEmail("")
      setSignupPassword("")
      setSignupConfirmPassword("")
      setSignupPhone("")
      setSignupZipCode("")
    } catch (error) {
      console.error("Auth error:", error)

      if (isTokenError(error)) {
        handleTokenExpiration()
        return
      }

      toast.error("Something went wrong")
    } finally {
      setIsLoginLoading(false)
      setIsSignupLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true)
      await fetch(getApiUrl("/auth/logout/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })
    } catch (err) {
      console.error("Logout failed", err)
    } finally {
      dispatch(logout())
      toast.success("Logged out successfully")
      setIsLogoutLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-md px-6 py-3 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
          EasyGen
        </h1>
      </div>

      <div className="hidden md:flex gap-10 font-semibold text-gray-500">
        <Link href="#" className="group relative">
          Community Flows
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="#" className="group relative">
          Hints & Tips
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="#" className="group relative">
          Discord
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      <div className="flex gap-3 relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold text-sm flex items-center justify-center hover:bg-blue-700"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user.full_name?.[0] || "U"}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setProfileDialogOpen(true)
                    setDropdownOpen(false)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setShowPreferences(true)
                    setDropdownOpen(false)
                  }}
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  Preferences
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                >
                  {isLogoutLoading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Profile Dialog */}
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DialogContent className="bg-white rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                    User Profile
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user.full_name?.[0] || "U"}
                    </div>
                  </div>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-xs text-gray-500">Full Name</Label>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Phone</Label>
                      <p className="font-medium text-gray-900">{user.phone_number || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">ZIP Code</Label>
                      <p className="font-medium text-gray-900">{user.zip_code || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex gap-3">
            {/* Login Dialog */}
            <Dialog open={activeDialog === "login"} onOpenChange={(open) => setActiveDialog(open ? "login" : null)} >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="group flex items-center gap-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Login</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-white/90 border border-gray-200/80 shadow-2xl rounded-2xl overflow-hidden p-0 md:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/50 -z-10" />

                {/* Close button */}
                <button
                  onClick={() => setActiveDialog(null)}
                  className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>

                <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-3 relative overflow-hidden">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-0">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <LogIn className="w-5 h-5 text-white" />
                      </div>
                      <DialogTitle className="text-white text-2xl font-black">Login</DialogTitle>
                    </div>
                  </DialogHeader>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAuth("login")
                  }}
                  className="space-y-6 p-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="login-password" className="text-gray-700 font-medium">
                        Password
                      </Label>
                      <button type="button" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all rounded-xl text-base font-medium"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="relative flex items-center gap-3 my-2">
                    <div className="h-px flex-grow bg-gray-200"></div>
                    <span className="text-sm text-gray-500 font-medium">OR</span>
                    <div className="h-px flex-grow bg-gray-200"></div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div> */}

                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveDialog("signup")}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Signup Dialog */}
            <Dialog open={activeDialog === "signup"} onOpenChange={(open) => setActiveDialog(open ? "signup" : null)}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-blue-500/20 transition-all rounded-xl group">
                  <UserPlus className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                  <span>Sign Up</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-white/90 border border-gray-200/80 shadow-2xl rounded-2xl overflow-hidden p-0 md:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/50 -z-10" />

                {/* Close button */}
                <button
                  onClick={() => setActiveDialog(null)}
                  className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>

                <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-3 relative overflow-hidden">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-0">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <DialogTitle className="text-white text-2xl font-semibold">Create an account</DialogTitle>
                    </div>
                  </DialogHeader>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAuth("signup")
                  }}
                  className="space-y-2 p-6 grid grid-cols-2 gap-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-zipcode" className="text-gray-700 font-medium">
                      ZIP Code
                    </Label>
                    <Input
                      id="signup-zipcode"
                      type="text"
                      value={signupZipCode}
                      onChange={(e) => setSignupZipCode(e.target.value)}
                      required
                      className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl"
                      placeholder="12345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        className="bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {signupPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1 h-1.5 mt-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                                level <= passwordStrength
                                  ? level <= 2
                                    ? "bg-red-400"
                                    : level <= 3
                                      ? "bg-yellow-400"
                                      : "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {passwordStrength <= 2 && "Weak password - add numbers and special characters"}
                          {passwordStrength === 3 && "Medium password - add more variety"}
                          {passwordStrength >= 4 && "Strong password"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-gray-700 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                        className={`bg-white/90 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 h-12 rounded-xl pr-10 ${
                          signupConfirmPassword && signupPassword !== signupConfirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
                            : signupConfirmPassword
                              ? "border-green-300 focus:border-green-500 focus:ring-green-500/30"
                              : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>

                      {signupConfirmPassword && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                          {signupPassword === signupConfirmPassword ? (
                            <CheckCircle2 size={18} className="text-green-500" />
                          ) : (
                            <X size={18} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 mt-4 col-span-2">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <Label htmlFor="terms" className="flex flex-wrap text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 col-span-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all rounded-xl text-base font-medium group"
                    disabled={isSignupLoading}
                  >
                    {isSignupLoading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="relative flex items-center gap-3 my-2 col-span-2">
                    <div className="h-px flex-grow bg-gray-200"></div>
                    <span className="text-sm text-gray-500 font-medium">OR</span>
                    <div className="h-px flex-grow bg-gray-200"></div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4 col-span-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div> */}

                  <div className="text-center text-sm text-gray-600 col-span-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveDialog("login")}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Preference Stepper Dialog */}
      <PreferenceStepper
        open={showPreferences}
        onOpenChange={setShowPreferences}
        onComplete={() => toast.success("Preferences updated successfully!")}
      />
    </header>
  )
}
