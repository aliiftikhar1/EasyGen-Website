"use client"

import { useState } from "react"
import {
  Copyright,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  MessageSquare,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"

const footerLinks = {
  Tools: ["LinkedIn Post Generator", "Hashtag Recommender", "Engagement Booster"],
  Resources: ["50 LinkedIn Hooks", "Viral Post Templates", "Growth Tips"],
  Navigation: ["Pricing", "Login", "Sign Up"],
  Legal: ["Terms of Service", "Privacy Policy"],
}

const socialLinks = [
  { name: "Twitter", icon: Twitter, url: "#" },
  { name: "LinkedIn", icon: Linkedin, url: "#" },
  { name: "Instagram", icon: Instagram, url: "#" },
  { name: "YouTube", icon: Youtube, url: "#" },
]

export default function FooterSection() {
  const [email, setEmail] = useState("")
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    alert(`Thanks for subscribing with ${email}!`)
    setEmail("")
  }

  const scrollToTop = () => {
    // window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-3xl transform translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto pt-20 pb-12 px-6 md:px-10 lg:px-8">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-gray-700/50">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <h3 className="text-white text-xl font-bold">EasyGen</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                EasyGen helps professionals create engaging LinkedIn content that drives growth, builds influence, and
                generates opportunities—all powered by AI.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h4 className="text-white font-semibold text-lg mb-2">Subscribe to our newsletter</h4>
              <p className="text-gray-400 mb-6">
                Get the latest LinkedIn growth tips and strategies delivered to your inbox weekly.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <button
                className="text-white font-semibold text-lg mb-4 flex items-center justify-between w-full sm:pointer-events-none"
                onClick={() => toggleSection(section)}
              >
                {section}
                <ChevronUp
                  className={`h-5 w-5 transition-transform duration-300 sm:hidden ${
                    expandedSection === section ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>
              <ul
                className={`space-y-3 transition-all duration-300 overflow-hidden ${
                  expandedSection === section || window.innerWidth >= 640
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 sm:max-h-96 sm:opacity-100"
                }`}
              >
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 inline-block py-1 border-b border-transparent hover:border-indigo-500"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 pb-16 border-b border-gray-700/50">
          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Email Us</h4>
                <p className="text-gray-400 mb-3">For general inquiries and support</p>
                <a
                  href="mailto:hello@easygenai.com"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                >
                  hello@easygenai.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Live Chat</h4>
                <p className="text-gray-400 mb-3">We're online Monday to Friday, 9am-5pm ET</p>
                <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Start a conversation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} EasyGen. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-gray-500">Built with 💡 and AI to help you grow faster on LinkedIn.</p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
