import { getApiUrl } from "./config"

export const checkUserPreferences = async (token) => {
  try {
    if (!token) return false

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }

    const response = await fetch(getApiUrl("/api/user-preference-selections/mine/"), { headers })
    if (!response.ok) return false

    const data = await response.json()
    
    // Check if any preferences are selected
    const hasPreferences = Object.values(data).some(value => 
      Array.isArray(value) && value.length > 0
    )

    return hasPreferences
  } catch (error) {
    console.error("Error checking preferences:", error)
    return false
  }
} 