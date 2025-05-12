"use client"

import { useState } from "react"
import { Users, PenLine, ArrowRight } from "lucide-react"

export default function ImpactBanner() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative overflow-hidden py-20 px-6">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/30 to-blue-200/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-200/30 to-blue-200/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-blue-600 font-medium text-xs sm:text-sm mb-6 shadow-sm">
            Trusted by professionals worldwide
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
               EasyGen has generated
            </span>
            <div className="relative inline-block mx-2">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 font-extrabold">
                245,000+
              </span>
              <div className="absolute -inset-1 bg-blue-100/50 blur-sm rounded-lg -z-0"></div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">posts</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">for</span>
            <div className="relative inline-block mx-2">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 font-extrabold">
                16,000+
              </span>
              <div className="absolute -inset-1 bg-blue-100/50 blur-sm rounded-lg -z-0"></div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              professionals
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mt-4 mb-10 max-w-2xl mx-auto">
            Trusted by coaches, founders, and creators building influence on LinkedIn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-100/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <PenLine className="h-6 w-6" />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Posts Generated</p>
                <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
                  245,000+
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-100/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Happy Users</p>
                <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
                  16,000+
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start for Free
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>

          <p className="mt-4 text-gray-500 text-sm">No credit card required</p>
        </div>
      </div>
    </section>
  )
}
