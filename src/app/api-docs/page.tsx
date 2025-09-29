'use client';

import React, { useEffect, useState } from 'react';

/**
 * Interactive API Documentation Page
 * Displays Swagger UI for the Kabir Sant Sharan API
 */
export default function ApiDocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically load Swagger UI
    const loadSwaggerUI = async () => {
      try {
        // Load Swagger UI CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css';
        document.head.appendChild(cssLink);

        // Load Swagger UI JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js';
        script.onload = () => {
          // Initialize Swagger UI
          (window as any).SwaggerUIBundle({
            url: '/api/docs',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              (window as any).SwaggerUIBundle.presets.apis,
              (window as any).SwaggerUIBundle.presets.standalone
            ],
            plugins: [
              (window as any).SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: 'StandaloneLayout',
            defaultModelsExpandDepth: 1,
            defaultModelExpandDepth: 1,
            docExpansion: 'list',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            tryItOutEnabled: true,
            requestInterceptor: (request: any) => {
              // Add custom headers or modify requests if needed
              console.log('API Request:', request);
              return request;
            },
            responseInterceptor: (response: any) => {
              // Log responses for debugging
              console.log('API Response:', response);
              return response;
            },
            onComplete: () => {
              setIsLoading(false);
              console.log('Swagger UI loaded successfully');
            },
            onFailure: (error: any) => {
              console.error('Swagger UI failed to load:', error);
              setError('Failed to load API documentation');
              setIsLoading(false);
            }
          });
        };
        script.onerror = () => {
          setError('Failed to load Swagger UI resources');
          setIsLoading(false);
        };
        document.head.appendChild(script);

      } catch (err) {
        console.error('Error loading Swagger UI:', err);
        setError('Failed to initialize API documentation');
        setIsLoading(false);
      }
    };

    loadSwaggerUI();

    // Cleanup function
    return () => {
      // Remove dynamically added elements when component unmounts
      const existingLinks = document.querySelectorAll('link[href*="swagger-ui"]');
      const existingScripts = document.querySelectorAll('script[src*="swagger-ui"]');

      existingLinks.forEach(link => link.remove());
      existingScripts.forEach(script => script.remove());
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Documentation Error</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              View Raw
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2 text-primary-700">
                <div className="w-8 h-8">
                  <img
                    src="/kabir-saheb-logo.webp"
                    alt="Kabir Saheb Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-semibold text-lg">Kabir Sant Sharan</span>
              </a>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">API Documentation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">v1.0.0</span>
              <a
                href="/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Raw Spec
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">Loading API Documentation...</span>
          </div>
        </div>
      )}

      {/* Swagger UI Container */}
      <div id="swagger-ui" className={isLoading ? 'hidden' : ''}></div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Kabir Sant Sharan API Documentation
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a href="/" className="text-primary-600 hover:text-primary-700">
                Back to Site
              </a>
              <a href="/admin" className="text-primary-600 hover:text-primary-700">
                Admin Panel
              </a>
              <span className="text-gray-600">
                Generated with OpenAPI 3.1.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}