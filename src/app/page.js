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
import FooterSection from "@/components/FooterSection"
import { toast } from "sonner"
import { handleTokenExpiration, isTokenError } from "@/utils/auth-utils"
import { ArrowRight } from "lucide-react"

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
          <h1 className="text-4xl md:text-[56px] font-black tracking-tight mb-4">
            Find High-Potential <br /> Customers with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">EasyGen.</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-[16px]">
            We provide sales teams and professionals with the knowledge, skill and discipline they need to be 10x more
            successful.
          </p>
          <Button
            variant="secondary"
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="flex capitalize p-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-[20rem] text-[18px] border border-gray-600 items-center mx-auto"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Loading...
              </>
            ) : (
              <>
                Generate viral post
                <ArrowRight className="ml-2 size-6" />
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
