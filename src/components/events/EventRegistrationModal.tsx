'use client'

import { useState } from 'react'
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-cream-50 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-cream-50 border-b border-cream-200 p-6 rounded-t-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark-900 mb-2">Register for Event</h2>
                <h3 className="text-lg font-semibold text-dark-700 mb-4">{event.title}</h3>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-dark-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {spotsRemaining !== null && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={cn(
                        spotsRemaining <= 5 ? 'text-amber-600 font-medium' : 'text-dark-600'
                      )}>
                        {spotsRemaining} spots remaining
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-dark-500 hover:text-dark-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {isFull && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-amber-700 font-medium">This event is currently full. You can still register to be added to the waiting list.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-dark-900">Personal Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-dark-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-dark-900">Emergency Contact</h4>

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
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-dark-900">Additional Information</h4>

              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-dark-700 mb-1">
                  Dietary Restrictions or Allergies
                </label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  rows={3}
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Please list any dietary restrictions, allergies, or special meal requirements..."
                />
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-dark-700 mb-1">
                  Special Requests or Accommodations
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Any accessibility needs, special accommodations, or other requests..."
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-cream-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-dark-700">
                I agree to the event terms and conditions, and understand that registration is subject to confirmation. I acknowledge that participation in spiritual activities is voluntary and at my own responsibility. *
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-cream-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-dark-600 bg-cream-200 hover:bg-cream-300 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.agreeToTerms}
                className={cn(
                  "px-6 py-2 text-white font-medium rounded-md transition-colors duration-200",
                  isSubmitting || !formData.agreeToTerms
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
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