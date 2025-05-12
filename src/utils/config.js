export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`
} 