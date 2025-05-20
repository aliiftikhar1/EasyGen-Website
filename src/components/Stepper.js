"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { logout, selectAccessToken } from "@/lib/features/authSlice"
import { getApiUrl } from "@/utils/config"
import { isTokenError } from "@/utils/auth-utils"

const steps = [
  { label: "Content Types", endpoint: "content-types", field: "content_types" },
  { label: "Posting Goals", endpoint: "posting-goals", field: "posting_goals" },
  { label: "Writing Styles", endpoint: "writing-styles", field: "writing_styles" },
  { label: "Industries", endpoint: "industries", field: "industries" },
  { label: "Job Descriptions", endpoint: "job-descriptions", field: "job_descriptions" },
  { label: "Custom User Preferences", endpoint: "custom", field: "custom" }, // New step
]

// Create a function to check if user has set preferences
export const checkUserPreferences = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }

    const selectionRes = await axios.get(getApiUrl("/api/user-preference-selections/mine/"), { headers })

    // Check if any selections exist for any step
    for (const step of steps.slice(0, 5)) {
      // Only check the first 5 steps (excluding custom)
      const values = selectionRes.data[step.field]
      if (values && values.length > 0) {
        return true
      }
    }
    return false
  } catch (err) {
    console.warn("Preference check error:", err)
    return false
  }
}

export default function PreferenceStepper({ open, onOpenChange, onComplete }) {
  const dispatch = useDispatch()
  const token = useSelector(selectAccessToken)
  const [currentStep, setCurrentStep] = useState(0)
  const [options, setOptions] = useState({})
  const [selections, setSelections] = useState({})
  const [fineTuneDescription, setFineTuneDescription] = useState("")
  const [modifyPostCTA, setModifyPostCTA] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const getHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token])

  const handleTokenExpiration = useCallback(() => {
    dispatch(logout())
    toast.error("Your session has expired. Please log in again.")
    onOpenChange(false)
  }, [dispatch, onOpenChange])

  const fetchPreferences = useCallback(async () => {
    try {
      const headers = getHeaders()
      const selectionRes = await axios.get(getApiUrl("/api/user-preference-selections/mine/"), { headers })
      const prefRes = await axios.get(getApiUrl("/api/user-preferences/"), { headers })

      if (selectionRes.data.length > 0) {
        const selections = selectionRes.data[0]
        setSelections({
          content_types: selections.content_types || [],
          platforms: selections.platforms || [],
          tones: selections.tones || [],
          target_audiences: selections.target_audiences || [],
          languages: selections.languages || [],
          lengths: selections.lengths || [],
        })
      }

      if (prefRes.data.length > 0) {
        const preferences = prefRes.data[0]
        setFineTuneDescription(preferences.fine_tune_description || "")
        setModifyPostCTA(preferences.modify_post_cta || "")
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
      if (isTokenError(error)) {
        handleTokenExpiration()
      }
    } finally {
      if (currentStep === 0) setIsLoading(false)
    }
  }, [getHeaders, handleTokenExpiration, currentStep])

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  // Load options for the first step when dialog opens
  useEffect(() => {
    if (open && currentStep === 0) {
      loadOptionsForStep(0)
    }
  }, [open, currentStep])

  const loadOptionsForStep = async (stepIndex) => {
    const { endpoint } = steps[stepIndex]

    // Skip loading for the custom step
    if (endpoint === "custom") {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      if (options[endpoint]?.length > 0) {
        setIsLoading(false)
        return // Already loaded
      }

      const headers = getHeaders()
      const res = await axios.get(getApiUrl(`/api/${endpoint}/`), { headers })
      setOptions((prev) => ({ ...prev, [endpoint]: res.data }))
    } catch (err) {
      console.error(`Failed loading ${endpoint}:`, err)

      // Check if the error is due to token expiration
      if (
        err.response?.data?.code === "token_not_valid" ||
        err.response?.data?.detail?.includes("token") ||
        err.response?.status === 401
      ) {
        handleTokenExpiration()
        return
      }

      setError(`Could not load ${steps[stepIndex].label}`)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSelection = (endpoint, id) => {
    setSelections((prev) => {
      const current = prev[endpoint] || []
      return {
        ...prev,
        [endpoint]: current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
      }
    })
  }

  const handleNext = async () => {
    const next = currentStep + 1
    setCurrentStep(next)
    setIsLoading(true)
    if (next < steps.length && !options[steps[next]?.endpoint]) {
      await loadOptionsForStep(next)
    } else {
      setIsLoading(false)
    }
  }

  const handleBack = () => setCurrentStep((prev) => prev - 1)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const headers = getHeaders()

      await axios.patch(
        getApiUrl("/api/user-preferences/"),
        {
          fine_tune_description: fineTuneDescription,
          modify_post_cta: modifyPostCTA,
        },
        { headers },
      )

      const body = {}
      steps.slice(0, 5).forEach(({ endpoint, field }) => {
        // Only process the first 5 steps (excluding custom)
        body[field] = selections[endpoint] || []
      })

      await axios.put(getApiUrl("/api/user-preference-selections/"), body, { headers })
      toast.success("Preferences saved successfully!")
      onOpenChange(false)
      if (onComplete) onComplete()
    } catch (err) {
      console.error("Submission error:", err)

      // Check if the error is due to token expiration
      if (
        err.response?.data?.code === "token_not_valid" ||
        err.response?.data?.detail?.includes("token") ||
        err.response?.status === 401
      ) {
        handleTokenExpiration()
        return
      }

      setError("Failed to save preferences")
    } finally {
      setIsLoading(false)
    }
  }

  const current = steps[currentStep]
  const items = options[current?.endpoint] || []
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  // Render the custom preferences step
  const renderCustomPreferencesStep = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4 mb-6 bg-gradient-to-r from-blue-50/80 to-blue-50/80 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Personalize Your Content</h3>
          <p className="text-gray-600 text-sm mb-4">
            These custom preferences help us tailor your content to your specific needs and style.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fine-tune-description" className="text-blue-700 font-medium">
                Fine Tune Description
              </Label>
              <Textarea
                id="fine-tune-description"
                value={fineTuneDescription}
                onChange={(e) => setFineTuneDescription(e.target.value)}
                placeholder="Describe your personal writing style or specific preferences..."
                className="mt-1 bg-white resize-y min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: &quot;I prefer a conversational tone with occasional humor. I work in tech marketing and want to
                sound knowledgeable but approachable.&quot;
              </p>
            </div>

            <div>
              <Label htmlFor="modify-post-cta" className="text-blue-700 font-medium">
                Modify Post CTA
              </Label>
              <Textarea
                id="modify-post-cta"
                value={modifyPostCTA}
                onChange={(e) => setModifyPostCTA(e.target.value)}
                placeholder="Specify how you want your call-to-actions to be structured..."
                className="mt-1 bg-white resize-y"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: &quot;End posts with a question to encourage comments. Occasionally ask for shares if the content is
                valuable.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[50vw] max-w-[60vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
            {isEditMode ? "Update Your Preferences" : "Set Your Preferences"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Modify your content generation settings" : "Customize your content generation experience"}
            (Step {currentStep + 1} of {steps.length})
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <Progress value={progressPercentage} className="h-2 mb-6" />

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Custom preferences step */}
        {currentStep === steps.length - 1 ? (
          renderCustomPreferencesStep()
        ) : (
          <>
            <div className="mb-2 flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">{current?.label}</h2>
              <div className="ml-auto text-sm text-gray-500">Select all that apply</div>
            </div>

            <div className="space-y-2  max-h-[300px] overflow-y-auto p-2 grid grid-cols-2 ">
              {isLoading ? (
                <div className="flex justify-center items-center py-8 min-h-[120px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : items.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No options available</div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Checkbox
                      id={`${current.endpoint}-${item.id}`}
                      checked={selections[current.endpoint]?.includes(item.id) || false}
                      onCheckedChange={() => toggleSelection(current.endpoint, item.id)}
                      className="text-blue-600 border-gray-300 w-5 h-5"
                    />
                    <Label htmlFor={`${current.endpoint}-${item.id}`} className="text-lg cursor-pointer w-full">
                      {item.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <div className="flex justify-between border-t border-gray-100">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={handleBack} disabled={isLoading} className="px-6">
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 px-6"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 px-6"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
