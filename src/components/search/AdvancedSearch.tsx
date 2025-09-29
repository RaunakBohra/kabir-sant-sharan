'use client';

import { useState, useEffect } from 'react';

interface SearchFilters {
  query: string;
  type: 'all' | 'teachings' | 'events' | 'media';
  category: string;
  language: 'all' | 'en' | 'hi' | 'ne';
  dateRange: 'all' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'date' | 'title';
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'teaching' | 'event' | 'media';
  category: string;
  language: string;
  date: string;
  url: string;
  highlights: string[];
}

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    category: '',
    language: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (filters.query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [filters]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in production this would be a real search endpoint
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Path of Divine Love - Kabir\'s Teaching',
          excerpt: 'Sant Kabir teaches us that love is the most direct path to the Divine. Through devotion and surrender...',
          type: 'teaching',
          category: 'doha',
          language: 'en',
          date: '2024-09-15',
          url: '/teachings/path-of-divine-love',
          highlights: ['love', 'Divine', 'path']
        },
        {
          id: '2',
          title: 'प्रेम की राह - कबीर की शिक्षा',
          excerpt: 'संत कबीर हमें सिखाते हैं कि प्रेम ही परमात्मा तक पहुंचने का सबसे सीधा रास्ता है...',
          type: 'teaching',
          category: 'doha',
          language: 'hi',
          date: '2024-09-15',
          url: '/hi/teachings/path-of-divine-love',
          highlights: ['प्रेम', 'परमात्मा', 'रास्ता']
        },
        {
          id: '3',
          title: 'Weekly Satsang: Community Gathering',
          excerpt: 'Join us for our weekly spiritual gathering where we explore Kabir\'s teachings together...',
          type: 'event',
          category: 'satsang',
          language: 'en',
          date: '2024-10-01',
          url: '/events/weekly-satsang',
          highlights: ['Satsang', 'community', 'spiritual']
        },
        {
          id: '4',
          title: 'Divine Meditation Audio',
          excerpt: 'A guided meditation inspired by Kabir\'s teachings on inner peace and divine connection...',
          type: 'media',
          category: 'audio',
          language: 'en',
          date: '2024-08-20',
          url: '/media/divine-meditation',
          highlights: ['meditation', 'divine', 'peace']
        }
      ];

      // Filter results based on search criteria
      let filteredResults = mockResults.filter(result => {
        const matchesQuery = !filters.query.trim() ||
          result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.excerpt.toLowerCase().includes(filters.query.toLowerCase());

        const matchesType = filters.type === 'all' ||
          (filters.type === 'teachings' && result.type === 'teaching') ||
          (filters.type === 'events' && result.type === 'event') ||
          (filters.type === 'media' && result.type === 'media');

        const matchesLanguage = filters.language === 'all' || result.language === filters.language;

        const matchesCategory = !filters.category || result.category === filters.category;

        return matchesQuery && matchesType && matchesLanguage && matchesCategory;
      });

      // Sort results
      filteredResults.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'relevance':
          default:
            return 0; // In real implementation, would use search relevance score
        }
      });

      setResults(filteredResults);
      setTotalResults(filteredResults.length);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      category: '',
      language: 'all',
      dateRange: 'all',
      sortBy: 'relevance'
    });
  };

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });
    return highlightedText;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teaching':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'event':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'media':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Spiritual Content</h1>
        <p className="text-gray-600">Discover teachings, events, and media from Sant Kabir's wisdom</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search teachings, events, media..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="teachings">Teachings</option>
                  <option value="events">Events</option>
                  <option value="media">Media</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilter('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Languages</option>
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ne">नेपाली</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Results Header */}
        {(filters.query.trim() || results.length > 0) && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Search Results
                  {totalResults > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({totalResults} result{totalResults !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
              </div>
              {isLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              )}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="divide-y divide-gray-200">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} data-testid="search-result" className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-medium text-gray-900 hover:text-primary-600">
                        <a href={result.url}>{result.title}</a>
                      </h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {result.type}
                      </span>
                      {result.language !== 'en' && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {result.language}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-gray-600 text-sm mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.excerpt, result.highlights)
                      }}
                    />
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{new Date(result.date).toLocaleDateString()}</span>
                      <span className="capitalize">{result.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : filters.query.trim() && !isLoading ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : !filters.query.trim() ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start your spiritual search</h3>
              <p className="text-gray-600">Enter a search term to explore teachings, events, and media</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}