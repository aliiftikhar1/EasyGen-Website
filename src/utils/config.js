export const API_URL = "https://easygen-backend.onrender.com"

export const getApiUrl = (endpoint) => {
  console.log(API_URL)
  return `${API_URL}${endpoint}`
} 