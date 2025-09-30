'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user?.isAuthenticated) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 to-cream-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center p-2">
              <img
                src="/kabir-saheb-logo.webp"
                alt="Kabir Saheb Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-dark-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-dark-600">
            Sign in to access the content management system
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-cream-300 placeholder-dark-500 text-dark-900 rounded-t-md focus:outline-none focus:ring-dark-500 focus:border-dark-900 focus:z-10 sm:text-sm bg-white"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-cream-300 placeholder-dark-500 text-dark-900 rounded-b-md focus:outline-none focus:ring-dark-500 focus:border-dark-900 focus:z-10 sm:text-sm bg-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-cream-50 bg-dark-900 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream-50"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="bg-cream-100 border border-cream-300 rounded-md p-3 text-sm">
              <p className="text-dark-800">
                <strong>Demo Credentials:</strong><br />
                Email: admin@kabirsantsharan.com<br />
                Password: admin123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}