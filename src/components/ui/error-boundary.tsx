'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, level = 'component' } = this.props;

    // Log error with context
    console.error(`Error Boundary (${level}) caught an error:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey)) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real application, you would send this to your error tracking service
    // e.g., Sentry, LogRocket, Bugsnag, etc.
    try {
      // Example error reporting structure
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId,
        level: this.props.level
      };

      // You would replace this with your actual error reporting service
      console.warn('Error reported:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorId: ''
      });
    }, 100);
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, isolate, level = 'component' } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          level={level}
          isolate={isolate}
        />
      );
    }

    return children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
  level: 'page' | 'section' | 'component';
  isolate?: boolean;
}

function ErrorFallback({ error, resetErrorBoundary, level, isolate }: ErrorFallbackProps) {
  const getErrorIcon = () => (
    <svg className="w-8 h-8 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  // Different UI based on error boundary level
  if (level === 'page') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          {getErrorIcon()}
          <h1 className="text-2xl font-bold text-dark-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-dark-600 mb-6">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full px-4 py-2 bg-dark-900 text-cream-50 rounded-lg hover:bg-dark-800 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 border border-cream-300 text-dark-700 rounded-lg hover:bg-cream-100 transition-colors"
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-dark-500 hover:text-dark-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 overflow-auto">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  if (level === 'section') {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          {getErrorIcon()}
          <h3 className="text-lg font-semibold text-dark-900 mb-2">
            Section Error
          </h3>
          <p className="text-dark-600 mb-4">
            This section encountered an error and couldn't load properly.
          </p>
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-dark-900 text-cream-50 rounded hover:bg-dark-800 transition-colors"
          >
            Retry
          </button>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-dark-500">
                Error Details
              </summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Component level - minimal UI
  if (isolate) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <div className="flex items-center space-x-2 text-red-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm">Component error</span>
          <button
            onClick={resetErrorBoundary}
            className="text-xs underline hover:no-underline"
          >
            retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="text-center">
        <svg className="w-6 h-6 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm text-dark-600 mb-3">
          Something went wrong with this component
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-3 py-1 text-sm bg-dark-900 text-cream-50 rounded hover:bg-dark-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Convenience wrapper components for different use cases
export function PageErrorBoundary({ children, onError }: { children: ReactNode; onError?: (error: Error, errorInfo: React.ErrorInfo) => void }) {
  return (
    <ErrorBoundary level="page" onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

export function SectionErrorBoundary({ children, onError }: { children: ReactNode; onError?: (error: Error, errorInfo: React.ErrorInfo) => void }) {
  return (
    <ErrorBoundary level="section" onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ children, isolate = false, onError }: { children: ReactNode; isolate?: boolean; onError?: (error: Error, errorInfo: React.ErrorInfo) => void }) {
  return (
    <ErrorBoundary level="component" isolate={isolate} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}