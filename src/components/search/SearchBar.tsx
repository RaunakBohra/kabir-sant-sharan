'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
// Simple debounce function to avoid lodash dependency
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'teaching' | 'event' | 'media';
  slug?: string;
  url: string;
}

interface SearchBarProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search teachings, events, and media...",
  onResultSelect,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use the actual search API
        const response = await fetch(`/api/search/?q=${encodeURIComponent(searchQuery)}&limit=10`);

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = await response.json() as { results: any[] };

        // Transform API results to SearchResult format
        const transformedResults: SearchResult[] = data.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          type: item.type,
          slug: item.slug,
          url: item.url
        }));

        setResults(transformedResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setIsModalOpen(false);
    setQuery('');
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      window.location.href = result.url;
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'teaching':
        return (
          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'event':
        return (
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'media':
        return (
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9l3 3-3 3" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={openModal}
        className={`p-2 text-dark-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
        aria-label="Search"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6 md:p-20">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transform transition-all">
              {/* Search Input */}
              <div className="relative border-b border-gray-200">
                <label htmlFor="search-input" className="sr-only">
                  Search teachings, events, and media
                </label>
                <input
                  ref={inputRef}
                  id="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-6 py-5 pl-14 pr-14 text-lg text-dark-900 bg-transparent focus:outline-none"
                  aria-describedby="search-status"
                  aria-expanded={isOpen}
                  aria-autocomplete="list"
                  role="combobox"
                  aria-owns={isOpen ? "search-results" : undefined}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-5">
                  {isLoading ? (
                    <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 hover:text-dark-900"
                  aria-label="Close search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                <div id="search-status" className="sr-only" aria-live="polite">
                  {isLoading ? 'Searching...' : isOpen && results.length > 0 ? `${results.length} results found` : isOpen && query && results.length === 0 ? 'No results found' : ''}
                </div>
                {isOpen && results.length > 0 && (
                  <div className="py-2" id="search-results" role="listbox" aria-label="Search results">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                        role="option"
                        aria-label={`${result.title} - ${result.type}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-dark-900 truncate">
                              {result.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {result.content}
                            </p>
                            <span className="inline-block px-2 py-1 mt-2 text-xs font-medium text-primary-700 bg-primary-100 rounded">
                              {result.type}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {isOpen && query && results.length === 0 && !isLoading && (
                  <div className="py-12 px-6 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                    </svg>
                    <p className="text-base text-gray-600">
                      No results found for <span className="font-medium">"{query}"</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!query && (
                  <div className="py-12 px-6 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-base text-gray-600">
                      Search for teachings, events, and media
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start typing to see results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}