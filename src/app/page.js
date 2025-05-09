"use client"
import { useState } from "react"
import PostTitleDialog from "@/components/PostTitleDialog"
import PreferenceStepper from "@/components/Stepper"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import PostPreviewSection from "@/components/PostPreviewSection"
import ImpactBanner from "@/components/ImpactBanner"
import TestimonialsSection from "@/components/TestimonialSection"
import FAQSection from "@/components/FaqSection"
import FooterSection from "@/components/FeaturesSection"
import { toast } from "sonner"
import { handleTokenExpiration, isTokenError } from "@/utils/auth-utils"

export default function Home() {
  const [showStepper, setShowStepper] = useState(false)
  const [showTitleDialog, setShowTitleDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateClick = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("access_token")

      // Check if user is logged in
      if (!token) {
        toast.error("Please log in to generate posts")
        return
      }

      const res = await fetch("http://localhost:8000/api/user-preference-selections/mine/", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Check for token expiration or other errors
      if (!res.ok) {
        const errorData = await res.json()

        // Handle token expiration
        if (isTokenError(errorData)) {
          handleTokenExpiration()
          return
        }

        // Handle other errors
        throw new Error(errorData.detail || "Failed to fetch preferences")
      }

      const data = await res.json()

      const hasPrefs = Object.values(data).some((arr) => Array.isArray(arr) && arr.length > 0)
      if (hasPrefs) {
        setShowTitleDialog(true)
      } else {
        setShowStepper(true)
      }
    } catch (err) {
      console.error("Error checking preferences:", err)

      // Check if it's a token error
      if (isTokenError(err)) {
        handleTokenExpiration()
        return
      }

      // If it's not a token error, show the stepper anyway
      setShowStepper(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostGenerate = (title, generatedPost) => {
    console.log("Generated post for title:", title)
    console.log("Post content:", generatedPost)
    // You can add additional logic here if needed
  }

  return (
    <div>
      <Header />
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find High-Potential <br /> Customers with <span className="text-teal-800">Trustco.</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We provide sales teams and professionals with the knowledge, skill and discipline they need to be 10x more
            successful.
          </p>
          <Button
            variant="secondary"
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="flex capitalize text-lg border border-gray-600 items-center mx-auto"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Loading...
              </>
            ) : (
              <>
                Generate viral post
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </Button>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <Image
            src="/Landingpage/hero.webp"
            alt="Trustco Dashboard"
            width={1000}
            height={600}
            className="rounded-lg shadow-xl"
          />
        </div>
      </section>

      <PreferenceStepper
        open={showStepper}
        onOpenChange={setShowStepper}
        onComplete={() => {
          setShowStepper(false)
          setShowTitleDialog(true)
        }}
      />

      <PostTitleDialog open={showTitleDialog} onOpenChange={setShowTitleDialog} onGenerate={handlePostGenerate} />

      <PostPreviewSection />
      <ImpactBanner />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </div>
  )
}
