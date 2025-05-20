// export const API_URL = "https://easygen-backend.onrender.com"
// export const API_URL = "http://localhost:8000"
// export const API_URL = "http://trylenoxinstruments.com"
export const API_URL = "http://45.139.227.241"
export const getApiUrl = (endpoint) => {
  console.log(API_URL)
  return `${API_URL}${endpoint}`
} 