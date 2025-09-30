'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string | null
  virtualLink: string | null
  maxAttendees: number | null
  currentAttendees: number
  registrationRequired: boolean
  registrationDeadline: string | null
}

interface EventRegistrationModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface RegistrationForm {
  fullName: string
  email: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  dietaryRestrictions: string
  specialRequests: string
  agreeToTerms: boolean
}

export function EventRegistrationModal({ event, isOpen, onClose, onSuccess }: EventRegistrationModalProps) {
  const [formData, setFormData] = useState<RegistrationForm>({
    fullName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRestrictions: '',
    specialRequests: '',
    agreeToTerms: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLInputElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  // Focus management and keyboard navigation
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return []

    const focusableSelectors = [
      'input:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(modalRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    // Handle Escape key
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }

    // Handle Tab key for focus trapping
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // If Shift+Tab on first element, focus last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
      // If Tab on last element, focus first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    // Handle Enter key on buttons
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON') {
        e.preventDefault()
        target.click()
      }
    }
  }, [isOpen, onClose, getFocusableElements])

  // Focus management effects
  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element when modal opens
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements()
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        } else if (firstFocusableRef.current) {
          firstFocusableRef.current.focus()
        }
      }, 100) // Small delay to ensure modal is rendered

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown)

      // Prevent background scrolling
      document.body.style.overflow = 'hidden'

      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, getFocusableElements, handleKeyDown])

  // Return focus to trigger element when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Store the element that was focused before modal opened
      const previouslyFocusedElement = document.activeElement as HTMLElement

      return () => {
        // Return focus to the button that opened the modal
        if (previouslyFocusedElement && previouslyFocusedElement.focus) {
          previouslyFocusedElement.focus()
        }
      }
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const spotsRemaining = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
  const isFull = spotsRemaining !== null && spotsRemaining <= 0

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-label="Close registration modal"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative bg-cream-50 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-cream-50 border-b border-cream-200 p-6 rounded-t-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold text-dark-900 mb-2">Register for Event</h2>
                <h3 id="modal-description" className="text-lg font-semibold text-dark-700 mb-4">{event.title}</h3>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-dark-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span aria-label={`Event date: ${formatDate(event.startDate)}`}>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span aria-label={`Event time: ${formatTime(event.startTime)} to ${formatTime(event.endTime)}`}>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span aria-label={`Event location: ${event.location}`}>{event.location}</span>
                    </div>
                  )}
                  {spotsRemaining !== null && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span
                        className={cn(
                          spotsRemaining <= 5 ? 'text-amber-600 font-medium' : 'text-dark-600'
                        )}
                        aria-label={`${spotsRemaining} spots remaining for this event`}
                        role={spotsRemaining <= 5 ? 'alert' : undefined}
                      >
                        {spotsRemaining} spots remaining
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-dark-500 hover:text-dark-700 transition-colors"
                aria-label="Close registration modal"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            {isFull && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4" role="alert" aria-live="polite">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-amber-700 font-medium">This event is currently full. You can still register to be added to the waiting list.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert" aria-live="assertive" id="error-message">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Personal Information */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-dark-900">Personal Information</legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-dark-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    ref={firstFocusableRef}
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                    aria-describedby={error ? 'error-message' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                    aria-describedby={error ? 'error-message' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                  aria-describedby={error ? 'error-message' : undefined}
                  aria-invalid={error ? 'true' : 'false'}
                  autoComplete="tel"
                />
              </div>
            </fieldset>

            {/* Emergency Contact */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-dark-900">Emergency Contact</legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-dark-700 mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    required
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                    aria-describedby={error ? 'error-message' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-dark-700 mb-1">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    required
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                    aria-describedby={error ? 'error-message' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </fieldset>

            {/* Additional Information */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-dark-900">Additional Information</legend>

              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-dark-700 mb-1">
                  Dietary Restrictions or Allergies
                </label>
                <div id="dietary-help" className="sr-only">Optional field for listing any food allergies, dietary restrictions, or special meal requirements</div>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  rows={3}
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                  placeholder="Please list any dietary restrictions, allergies, or special meal requirements..."
                  aria-describedby="dietary-help"
                />
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-dark-700 mb-1">
                  Special Requests or Accommodations
                </label>
                <div id="requests-help" className="sr-only">Optional field for accessibility needs, special accommodations, or other requests</div>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
                  placeholder="Any accessibility needs, special accommodations, or other requests..."
                  aria-describedby="requests-help"
                />
              </div>
            </fieldset>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-dark-900 focus:ring-dark-900 border-cream-300 rounded"
                aria-describedby="terms-description"
                aria-invalid={error ? 'true' : 'false'}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-dark-700">
                <span id="terms-description">
                  I agree to the event terms and conditions, and understand that registration is subject to confirmation. I acknowledge that participation in spiritual activities is voluntary and at my own responsibility. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-cream-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-dark-600 bg-cream-200 hover:bg-cream-300 rounded-md transition-colors duration-200"
                aria-label="Cancel registration and close modal"
              >
                Cancel
              </button>
              <button
                ref={lastFocusableRef}
                type="submit"
                disabled={isSubmitting || !formData.agreeToTerms}
                className={cn(
                  "px-6 py-2 text-white font-medium rounded-md transition-colors duration-200",
                  isSubmitting || !formData.agreeToTerms
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-dark-900 hover:bg-dark-800"
                )}
                aria-label={isSubmitting ? 'Submitting registration' : (isFull ? 'Join waiting list for this event' : 'Submit registration for this event')}
                aria-describedby={!formData.agreeToTerms ? 'terms-description' : undefined}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span aria-live="polite">Registering...</span>
                  </div>
                ) : (
                  isFull ? 'Join Waiting List' : 'Register for Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}