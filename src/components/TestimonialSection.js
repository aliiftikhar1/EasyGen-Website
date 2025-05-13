"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { MessageCircle, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Career Coach",
    message: "EasyGen helped me go from silent to standout on LinkedIn. I now post twice a week and get real engagement!",
    avatar: "/image/user-image.jpg",
  },
  {
    name: "Amit Verma",
    role: "Startup Founder",
    message: "It's like having a content strategist in my pocket. I just tweak and post!",
    avatar: "/image/user-image.jpg",
  },
  {
    name: "Nina Patel",
    role: "Marketing Manager",
    message: "The hooks EasyGen generates are 🔥. My last post got 3x more impressions than usual.",
    avatar: "/image/user-image.jpg",
  },
  {
    name: "Liam Garcia",
    role: "Freelancer",
    message: "I never knew what to post before. Now I have a content calendar filled for weeks.",
    avatar: "/image/user-image.jpg",
  },
  {
    name: "Emily Chen",
    role: "Product Manager",
    message: "Professional, concise, and on-brand — EasyGen nails my tone every time.",
    avatar: "/image/user-image.jpg",
  },
  {
    name: "Omar Khan",
    role: "Tech Influencer",
    message: "I've grown 5k followers in 2 months. EasyGen is a must-have for serious creators.",
    avatar: "/image/user-image.jpg",
  },
]

export default function TestimonialSection() {
  const carouselRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Determine how many items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize() // Initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const itemsPerView = isMobile ? 1 : 3
  const maxIndex = Math.max(0, testimonials.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0))
    scrollToIndex(currentIndex - 1)
  }

  const scrollToIndex = useCallback((index) => {
    if (carouselRef.current && index >= 0 && index <= maxIndex) {
      const scrollAmount = (carouselRef.current.scrollWidth / testimonials.length) * index
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [maxIndex])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex))
    scrollToIndex(currentIndex + 1)
  }, [currentIndex, maxIndex, scrollToIndex])

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(handleNext, 5000)
    return () => clearInterval(interval)
  }, [handleNext])

  const handleDotClick = (index) => {
    setCurrentIndex(index)
    scrollToIndex(index)
  }

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Quote className="h-24 w-24 text-blue-300 transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Quote className="h-16 w-16 text-blue-300 transform rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-indigo-50 rounded-full text-indigo-600 font-medium text-xs sm:text-sm mb-6">
            Customer Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6 p-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            What creators love about EasyGen
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from professionals who post smarter with AI.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Carousel container */}
          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Carousel track */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)] snap-start"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                        <MessageCircle className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 flex-grow">&quot;{testimonial.message}&quot;</p>
                    <div className="mt-6 flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            {testimonials.length > itemsPerView && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                    currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"
                  }`}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-6 w-6 text-indigo-600" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className={`absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                    currentIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"
                  }`}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-6 w-6 text-indigo-600" />
                </button>
              </>
            )}

            {/* Pagination dots */}
            {testimonials.length > itemsPerView && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: maxIndex + 1 }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "bg-indigo-600 w-8" : "bg-gray-300 hover:bg-indigo-300"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
