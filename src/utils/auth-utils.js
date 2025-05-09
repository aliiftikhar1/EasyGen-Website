/**
 * Utility functions for handling authentication and token-related operations
 */

import { toast } from "sonner"

/**
 * Handles token expiration by clearing user data and showing a notification
 */
export const handleTokenExpiration = () => {
  // Clear user data from localStorage
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")

  // Show toast notification
  toast.error("Your session has expired. Please log in again.")

  // Force page reload to update UI state
  setTimeout(() => {
    window.location.reload()
  }, 1500)
}

/**
 * Checks if an error is related to token expiration or authentication issues
 */
export const isTokenError = (error) => {
  return (
    error?.code === "token_not_valid" ||
    error?.messages?.[0]?.message === "Token is expired" ||
    error?.detail?.includes("token") ||
    error?.response?.status === 401 ||
    error?.response?.data?.code === "token_not_valid" ||
    error?.response?.data?.messages?.[0]?.message === "Token is expired" ||
    error?.response?.data?.detail?.includes("token")
  )
}

/**
 * Creates an axios interceptor to handle token expiration globally
 * @param axiosInstance - The axios instance to add the interceptor to
 */
export const setupAxiosInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isTokenError(error)) {
        handleTokenExpiration()
      }
      return Promise.reject(error)
    },
  )
}

/**
 * Gets the authorization headers for API requests
 */
export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  "Content-Type": "application/json",
})
