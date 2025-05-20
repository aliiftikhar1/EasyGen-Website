"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "@/lib/features/authSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, RefreshCw, Copy, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { handleTokenExpiration, isTokenError } from "@/utils/auth-utils"
import { getApiUrl } from "@/utils/config"

// Example title suggestions
const EXAMPLE_TITLES = [
  "How I Increased My LinkedIn Engagement by 400% in Just 30 Days",
  "The One LinkedIn Strategy Most People Miss (And It's Costing Them Opportunities)",
  "3 Counter-Intuitive LinkedIn Tips That Helped Me Land My Dream Job",
  "Why Most LinkedIn Posts Fail (And How to Make Yours Stand Out)",
  "The 5-Minute LinkedIn Routine That Transformed My Professional Network",
]

export default function PostTitleDialog({ open, onOpenChange, onGenerate }) {
  const [title, setTitle] = useState("")
  const [suggestedTitles, setSuggestedTitles] = useState(EXAMPLE_TITLES)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [generatedPost, setGeneratedPost] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [step, setStep] = useState("title") // "title" or "post"
  const token = useSelector(selectAccessToken)

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title or select a suggestion")
      return
    }

    try {
      setIsGenerating(true)

      if (!token) {
        toast.error("Please log in to generate posts")
        return
      }

      const response = await fetch(getApiUrl("/api/generate-linkedin-post/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle token expiration
        if (isTokenError(errorData)) {
          handleTokenExpiration()
          return
        }

        throw new Error(errorData.detail || "Failed to generate post")
      }

      const data = await response.json()
      setGeneratedPost(data.post)
      setStep("post")

      // Call the onGenerate callback if needed
      if (onGenerate) {
        onGenerate(title, data.post)
      }
    } catch (error) {
      console.error("Error generating post:", error)

      // Check if it's a token error
      if (isTokenError(error)) {
        handleTokenExpiration()
        return
      }

      toast.error("Failed to generate post. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegeneratePost = async () => {
    try {
      setIsRegenerating(true)

      if (!token) {
        toast.error("Please log in to generate posts")
        return
      }

      const response = await fetch(getApiUrl("/api/generate-linkedin-post/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle token expiration
        if (isTokenError(errorData)) {
          handleTokenExpiration()
          return
        }

        throw new Error(errorData.detail || "Failed to regenerate post")
      }

      const data = await response.json()
      setGeneratedPost(data.post)
      toast.success("Generated a new post variation")

      // Call the onGenerate callback if needed
      if (onGenerate) {
        onGenerate(title, data.post)
      }
    } catch (error) {
      console.error("Error regenerating post:", error)

      // Check if it's a token error
      if (isTokenError(error)) {
        handleTokenExpiration()
        return
      }

      toast.error("Failed to regenerate post. Please try again.")
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setTitle(suggestion)
  }

  const generateNewSuggestions = async () => {
    try {
      setIsLoadingSuggestions(true)

      // Here you would normally call your API to get new title suggestions
      // For now, we'll just shuffle the existing ones

      if (!token) {
        toast.error("Please log in to generate suggestions")
        return
      }

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Shuffle the existing titles for demonstration
      const shuffled = [...EXAMPLE_TITLES].sort(() => 0.5 - Math.random())
      setSuggestedTitles(shuffled)

      toast.success("Generated new title suggestions")
    } catch (error) {
      console.error("Error generating suggestions:", error)

      // Check if it's a token error
      if (isTokenError(error)) {
        handleTokenExpiration()
        return
      }

      toast.error("Failed to generate suggestions")
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost)
      setIsCopied(true)
      toast.success("Post copied to clipboard")

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleClose = () => {
    // Reset the state when closing the dialog
    setStep("title")
    setGeneratedPost("")
    onOpenChange(false)
  }

  const handleBackToTitle = () => {
    setStep("title")
  }

  // Format the post with proper line breaks
  const formatPost = (post) => {
    return post.split("\n").map((line, index) => (
      <p key={index} className={line.trim() === "" ? "h-4" : "mb-2"}>
        {line}
      </p>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[80vw] max-w-[90vw]">
        {step === "title" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Create Your Viral LinkedIn Post
              </DialogTitle>
              <DialogDescription>
                Enter a title for your post or select one of our high-performing suggestions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="post-title" className="text-gray-700 font-medium">
                  Post Title
                </Label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title for your post"
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 font-medium">Suggested Titles</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateNewSuggestions}
                    disabled={isLoadingSuggestions}
                    className="flex items-center gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    {isLoadingSuggestions ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Refresh</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                  {suggestedTitles.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        title === suggestion
                          ? "bg-indigo-100 border border-indigo-200"
                          : "hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <p className="text-gray-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!title.trim() || isGenerating}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Post
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Your Generated LinkedIn Post
              </DialogTitle>
              <DialogDescription>
                Here&apos;s your AI-generated post based on the title: <span className="font-medium">{title}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-6 max-h-[400px] overflow-y-auto">
                <div className="prose prose-sm max-w-none text-gray-800">{formatPost(generatedPost)}</div>
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                <Button variant="outline" onClick={handleBackToTitle} className="border-gray-300">
                  Back to Title
                </Button>

                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleRegeneratePost}
                  disabled={isRegenerating}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate New Variation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
