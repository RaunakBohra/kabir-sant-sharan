'use client'

import { useEffect, useState } from 'react'

interface Quote {
  text: string
  author: string
  language: string
  category?: string
}

export function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDailyQuote = async () => {
      try {
        const response = await fetch('/api/quotes/daily')
        const data = await response.json() as { quote: Quote }
        setCurrentQuote(data.quote)
      } catch (error) {
        console.error('Failed to load daily quote:', error)
        // Fallback quote
        setCurrentQuote({
          text: "The truth is one, but the wise call it by many names.",
          author: "Sant Kabir Das",
          language: "en"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDailyQuote()
  }, [])

  if (isLoading || !currentQuote) {
    return (
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-cream-300 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-24 bg-cream-300 rounded mb-6"></div>
              <div className="h-4 bg-cream-300 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-cream-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8">
            Daily Wisdom
          </h2>
          <div className="bg-cream-50 rounded-xl p-8 md:p-12 shadow-lg border border-cream-200">
            <blockquote className="text-xl md:text-2xl italic text-dark-800 mb-6 leading-relaxed">
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>
            <cite className="text-lg text-dark-700 font-medium">
              - {currentQuote.author}
            </cite>
            <div className="mt-8 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-dark-900 text-cream-50 rounded-md hover:bg-dark-800 transition-colors duration-200 text-sm">
                Share Quote
              </button>
              <button className="px-6 py-2 border border-dark-300 text-dark-800 rounded-md hover:bg-cream-200 transition-colors duration-200 text-sm">
                More Quotes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}