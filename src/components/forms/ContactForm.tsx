'use client'

import { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  category: string
  language: string
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>
  className?: string
}

const categories = [
  { value: 'general', label: 'General Inquiry', labelNp: 'सामान्य सोधपुछ' },
  { value: 'spiritual', label: 'Spiritual Guidance', labelNp: 'आध्यात्मिक मार्गदर्शन' },
  { value: 'events', label: 'Events & Satsang', labelNp: 'कार्यक्रम र सत्संग' },
  { value: 'media', label: 'Media & Teachings', labelNp: 'मिडिया र शिक्षा' },
  { value: 'volunteer', label: 'Volunteer Opportunities', labelNp: 'स्वयंसेवक अवसर' },
  { value: 'technical', label: 'Technical Support', labelNp: 'प्राविधिक सहायता' }
]

export function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
    language: 'en'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address')
      return false
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Subject is required')
      return false
    }
    if (!formData.message.trim()) {
      setErrorMessage('Message is required')
      return false
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long')
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
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
        language: 'en'
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-cream-50 rounded-xl p-8 shadow-lg border border-cream-200 ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">
          Connect with Our Spiritual Community
        </h2>
        <p className="text-dark-700 leading-relaxed">
          Reach out for spiritual guidance, event inquiries, or to join our community of seekers following Sant Kabir's teachings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-dark-800 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>

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
        </div>

        {/* Phone and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-dark-800 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
              placeholder="+977 1234567890"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-dark-800 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-dark-800 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200"
            placeholder="Brief description of your inquiry"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-dark-800 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 border border-cream-300 rounded-lg bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:border-transparent transition-colors duration-200 resize-vertical"
            placeholder="Please share your question, request, or how we can assist you on your spiritual journey..."
            required
          />
          <div className="text-xs text-dark-600 mt-1">
            Minimum 10 characters ({formData.message.length}/10)
          </div>
        </div>

        {/* Language Preference */}
        <div>
          <label htmlFor="language" className="block text-sm font-semibold text-dark-800 mb-2">
            Preferred Response Language
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

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">{errorMessage || 'Failed to send message. Please try again.'}</span>
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
                Thank you for reaching out! We'll respond to your message within 24 hours.
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
                Sending Message...
              </>
            ) : (
              <>
                Send Message
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-dark-600">
          <p>
            Your information will be kept confidential and used only to respond to your inquiry.
            <br />
            By submitting this form, you agree to our privacy policy.
          </p>
        </div>
      </form>

      {/* Contact Information */}
      <div className="mt-12 pt-8 border-t border-cream-300">
        <div className="text-center">
          <h3 className="text-lg font-bold text-dark-900 mb-4">Other Ways to Connect</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-dark-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium text-dark-800">Phone</span>
              <span className="text-dark-600">+977 1 234 5678</span>
            </div>

            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-dark-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-dark-800">Email</span>
              <span className="text-dark-600">info@kabirsantsharan.org</span>
            </div>

            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-dark-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-dark-800">Visit Us</span>
              <span className="text-dark-600">Spiritual Center, Varanasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}