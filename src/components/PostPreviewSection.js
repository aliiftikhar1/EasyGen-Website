"use client"
import { Eye, Sparkles, ArrowRight } from "lucide-react"
import { useState } from "react"

export default function PostPreviewSection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 p-3 bg-clip-text text-transparent bg-gradient-to-t from-blue-600 to-blue-700">
            See how EasyGen upgrades your posts
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">From rough idea to polished content in seconds.</p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl border border-gray-400/50 bg-white backdrop-blur-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/50 to-blue-50/50 opacity-70"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 relative">
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200/70 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-3">
                  <Eye className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Your Original Draft</h3>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 opacity-70"></div>

              <div className="bg-gray-50/80 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-left text-sm sm:text-base text-gray-700 leading-relaxed">
                  Launching our new tool today. It helps with LinkedIn writing. Give it a try and let us know what you
                  think!
                </p>
              </div>
            </div>

            <div
              className={`p-8 md:p-10 transition-all duration-500 ${isHovered ? "bg-gradient-to-br from-blue-50/50 to-blue-50/50" : ""}`}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-50 mr-3">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Enhanced with EasyGen</h3>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 opacity-70"></div>

              <div
                className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 ${isHovered ? "shadow-md -translate-y-1" : ""}`}
              >
                <p className="text-left text-sm sm:text-base text-gray-800 leading-relaxed">
                  <span className="text-blue-600 font-bold">🚀</span> Just launched a tool that helps you write viral
                  LinkedIn posts in seconds.
                  <br />
                  <br />
                  <span className="text-blue-600 font-bold">👉</span> Say goodbye to writer's block
                  <br />
                  <span className="text-blue-600 font-bold">💡</span> Create engaging, authentic content that connects
                  <br />
                  <br />
                  <span className="font-medium">Curious? Try it out and tell us what you think!</span>{" "}
                  <span className="text-blue-500">#EasyGenAI</span>
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <div
              className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-500 ${isHovered ? "scale-110" : ""}`}
            >
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
            Try EasyGen Now
          </button>
        </div>
      </div>
    </section>
  )
}
