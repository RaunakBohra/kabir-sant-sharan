'use client'

import { useEffect, useState } from 'react'

interface Quote {
  text: string
  author: string
  language: string
}

const sampleQuotes: Quote[] = [
  {
    text: "जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।।",
    author: "Sant Kabir Das",
    language: "ne"
  },
  {
    text: "माला फेरत जुग भया, फिरा न मन का फेर। कर का मन का डार दे, मन का मन का फेर।।",
    author: "Sant Kabir Das",
    language: "ne"
  },
  {
    text: "The truth is one, but the wise call it by many names. Seek within yourself, for that is where the divine resides.",
    author: "Sant Kabir Das",
    language: "en"
  },
  {
    text: "Love is the bridge between two hearts, and the divine is the river that flows beneath.",
    author: "Sant Kabir Das",
    language: "en"
  }
]

export function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(sampleQuotes[0])

  useEffect(() => {
    // Rotate quotes daily (or for demo, every few seconds)
    const today = new Date().getDate()
    const quoteIndex = today % sampleQuotes.length
    setCurrentQuote(sampleQuotes[quoteIndex])
  }, [])

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