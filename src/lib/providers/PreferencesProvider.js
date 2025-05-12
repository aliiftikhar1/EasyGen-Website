"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken, selectIsAuthenticated } from "@/lib/features/authSlice"
import { checkUserPreferences } from "@/utils/preferences"

const PreferencesContext = createContext()

export function PreferencesProvider({ children }) {
  const [showPreferences, setShowPreferences] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const token = useSelector(selectAccessToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    const checkPreferences = async () => {
      if (!isAuthenticated) {
        setIsChecking(false)
        return
      }

      try {
        const hasPreferences = await checkUserPreferences(token)
        if (!hasPreferences) {
          setShowPreferences(true)
        }
      } catch (error) {
        console.error("Error checking preferences:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkPreferences()
  }, [isAuthenticated, token])

  return (
    <PreferencesContext.Provider value={{ showPreferences, setShowPreferences, isChecking }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
} 