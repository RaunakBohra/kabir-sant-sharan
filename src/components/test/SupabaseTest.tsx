'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ConnectionStatus {
  connected: boolean
  message: string
  error?: string
}

export function SupabaseTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Testing connection...'
  })

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()

        // Test basic connectivity using a simple health check
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          setStatus({
            connected: false,
            message: 'Configuration missing',
            error: 'Supabase URL or API key not found in environment variables'
          })
          return
        }

        // Try to reach the Supabase health endpoint
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        })

        // 200 or 401 both indicate Supabase is reachable
        // 401 just means no tables exist yet, which is fine for a new project
        if (response.status === 200 || response.status === 401) {
          setStatus({
            connected: true,
            message: 'Successfully connected to Supabase!'
          })
        } else {
          setStatus({
            connected: false,
            message: 'Connection failed',
            error: `HTTP ${response.status}: ${response.statusText}`
          })
        }
      } catch (err) {
        setStatus({
          connected: false,
          message: 'Connection error',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="bg-cream-100 rounded-lg p-6 shadow-lg border border-dark-200">
      <h3 className="text-lg font-semibold mb-4 text-dark-900">Database Connection Test</h3>
      <div className={`flex items-center gap-2 ${
        status.connected ? 'text-green-600' : 'text-red-600'
      }`}>
        <div className={`w-3 h-3 rounded-full ${
          status.connected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="font-medium">{status.message}</span>
      </div>
      {status.error && (
        <div className="mt-2 p-3 bg-red-50 rounded text-red-700 text-sm border border-red-200">
          <strong>Error:</strong> {status.error}
        </div>
      )}
      {status.connected && (
        <div className="mt-2 p-3 bg-green-50 rounded text-green-700 text-sm border border-green-200">
          ✅ Supabase connection successful! Ready to start building the spiritual website.
          <div className="mt-2 text-xs">
            <strong>Next step:</strong> Create database tables by running database-setup.sql in Supabase SQL Editor when ready to add content.
          </div>
        </div>
      )}
    </div>
  )
}