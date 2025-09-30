/**
 * API Client utility for making HTTP requests
 * Handles protocol detection and ensures correct base URL
 */

function getApiBaseUrl(): string {
  // In development, always use HTTP localhost:5002
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5002';
  }

  // In production, use the configured app URL
  return process.env.NEXT_PUBLIC_APP_URL || 'https://kabirsantsharan.com';
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // If the endpoint is already a full URL, use it as-is
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return fetch(endpoint, options);
  }

  // For relative endpoints, prepend the correct base URL
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  return fetch(url, options);
}

export { getApiBaseUrl };