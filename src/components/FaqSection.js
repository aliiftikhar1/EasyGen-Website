"use client"

import { useState } from "react"
import { ChevronDown, MessageSquareQuote, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "How does EasyGen work?",
    answer:
      "EasyGen uses AI to understand your preferences, industry, and writing style, and generates LinkedIn posts tailored to you in seconds.",
  },
  {
    question: "What makes EasyGen different from ChatGPT?",
    answer:
      "Unlike general AI, EasyGen is trained specifically for LinkedIn content strategy and includes structure, tone, and CTA optimization.",
  },
  {
    question: "Can EasyGen help me create viral posts?",
    answer:
      "Yes! EasyGen includes viral hook templates and storytelling frameworks used by top creators to maximize reach and engagement.",
  },
  {
    question: "Is AI content allowed on LinkedIn?",
    answer:
      "Yes. As long as your content follows LinkedIn's guidelines, AI-assisted writing is completely acceptable.",
  },
  {
    question: "How do I cancel or upgrade my subscription?",
    answer:
      "You can manage your subscription anytime via your account dashboard—cancel, upgrade, or change billing cycle instantly.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50/50 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50/50 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <MessageSquareQuote className="h-24 w-24 text-indigo-300 transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <HelpCircle className="h-16 w-16 text-purple-300 transform rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left column - Heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="inline-block px-4 py-1 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6">
              Got Questions?
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Still curious? We've got you covered with answers to the most common questions.
            </p>
            
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-50">
              <h3 className="text-lg font-black text-gray-900 mb-2">Need more help?</h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Reach out to our support team.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right column - FAQs */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full px-6 py-5 flex justify-between items-center focus:outline-none"
                    aria-expanded={openIndex === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="text-gray-900 font-semibold text-left">{faq.question}</span>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                        openIndex === idx
                          ? "bg-indigo-100 text-indigo-600 rotate-180"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* <div className="mt-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
              <p className="text-gray-700 text-center">
                Have a question that's not listed here?{" "}
                <a href="#" className="text-indigo-600 font-medium hover:underline">
                  Check our knowledge base
                </a>{" "}
                or{" "}
                <a href="#" className="text-indigo-600 font-medium hover:underline">
                  send us an email
                </a>
                .
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
