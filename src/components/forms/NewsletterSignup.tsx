'use client'

import { useState } from 'react'

interface NewsletterSignupData {
  email: string
  name: string
  language: string
  interests: string[]
}

interface NewsletterSignupProps {
  onSubmit?: (data: NewsletterSignupData) => Promise<void>
  variant?: 'inline' | 'card' | 'minimal'
  className?: string
}

const interestOptions = [
  { value: 'teachings', label: 'Spiritual Teachings', labelNp: 'आध्यात्मिक शिक्षा' },
  { value: 'events', label: 'Events & Satsang', labelNp: 'कार्यक्रम र सत्संग' },
  { value: 'quotes', label: 'Daily Wisdom Quotes', labelNp: 'दैनिक ज्ञान' },
  { value: 'media', label: 'Audio/Video Content', labelNp: 'अडियो/भिडियो सामग्री' },
  { value: 'community', label: 'Community Updates', labelNp: 'समुदायिक अपडेट' }
]

export function NewsletterSignup({ onSubmit, variant = 'card', className = '' }: NewsletterSignupProps) {
  const [formData, setFormData] = useState<NewsletterSignupData>({
    email: '',
    name: '',
    language: 'en',
    interests: ['teachings', 'events']
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showInterests, setShowInterests] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setErrorMessage('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        const preferences = {
          teachings: formData.interests.includes('teachings'),
          events: formData.interests.includes('events'),
          meditation: formData.interests.includes('meditation') || formData.interests.includes('media')
        }

        const response = await fetch('/api/newsletter/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name || undefined,
            preferences
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to subscribe to newsletter')
        }
      }

      setSubmitStatus('success')
      setFormData({
        email: '',
        name: '',
        language: 'en',
        interests: ['teachings', 'events']
      })
      setShowInterests(false)
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your email address"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-dark-900 text-cream-50 font-semibold rounded-lg hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {submitStatus === 'success' && (
          <div className="mt-3 text-green-700 text-sm font-medium">
            Thank you for subscribing! Please check your email to confirm.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-3 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-dark-900 to-dark-800 rounded-xl p-6 text-cream-50 ${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-2">Stay Connected with Kabir's Wisdom</h3>
          <p className="text-cream-200 text-sm">
            Receive daily quotes, spiritual teachings, and updates from our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-3 border border-dark-600 rounded-lg bg-dark-800 text-cream-50 placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-colors duration-200"
              placeholder="Your name (optional)"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="px-4 py-3 border border-dark-600 rounded-lg bg-dark-800 text-cream-50 placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-cream-100 text-dark-900 font-semibold rounded-lg hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-dark-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="text-green-400 text-sm font-medium text-center">
              Welcome to our spiritual community! Please check your email to confirm your subscription.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="text-red-400 text-sm font-medium text-center">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className={`bg-cream-50 rounded-xl p-8 shadow-lg border border-cream-200 ${className}`}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">
          Join Our Spiritual Community
        </h2>
        <p className="text-dark-700 leading-relaxed">
          Subscribe to receive daily wisdom from Sant Kabir Das, spiritual teachings,
          event updates, and insights from our global community of seekers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email and Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-dark-800 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-dark-800 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
              placeholder="Your full name"
            />
          </div>
        </div>

        {/* Language Preference */}
        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-dark-800 mb-2">
            Preferred Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
          >
            <option value="en">English</option>
            <option value="ne">नेपाली (Nepali)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>

        {/* Interests Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowInterests(!showInterests)}
            className="flex items-center justify-between w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 font-medium hover:bg-cream-200 transition-colors duration-200"
          >
            <span>Customize Your Interests ({formData.interests.length} selected)</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${showInterests ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showInterests && (
            <div className="mt-4 p-4 border border-cream-300 rounded-lg bg-cream-100">
              <p className="text-sm text-dark-700 mb-4">
                Select the topics you're most interested in receiving updates about:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interestOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(option.value)}
                      onChange={() => handleInterestChange(option.value)}
                      className="w-4 h-4 text-dark-600 bg-cream-50 border-cream-400 rounded focus:ring-dark-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-dark-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700 font-medium">
                Welcome to our spiritual community! Please check your email to confirm your subscription.
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-8 py-4 bg-dark-900 text-cream-50 font-semibold rounded-lg hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:ring-offset-2 focus:ring-offset-cream-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cream-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </>
            ) : (
              <>
                Subscribe to Newsletter
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-xs text-dark-600">
          <p>
            We respect your privacy. You can unsubscribe at any time.
            <br />
            We'll never share your information with third parties.
          </p>
        </div>
      </form>

      {/* Benefits */}
      <div className="mt-8 pt-6 border-t border-cream-300">
        <h4 className="text-sm font-bold text-dark-900 mb-4 text-center">What You'll Receive:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-medium text-dark-800">Daily Wisdom</span>
            <p className="text-dark-600 mt-1">Inspiring quotes and teachings from Sant Kabir</p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium text-dark-800">Event Updates</span>
            <p className="text-dark-600 mt-1">Early access to satsang and spiritual events</p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-medium text-dark-800">Community</span>
            <p className="text-dark-600 mt-1">Connect with fellow seekers worldwide</p>
          </div>
        </div>
      </div>
    </div>
  )
}