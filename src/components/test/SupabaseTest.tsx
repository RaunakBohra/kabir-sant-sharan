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

        // Test basic connection
        const { data, error } = await supabase
          .from('quotes')
          .select('count(*)')
          .single()

        if (error) {
          setStatus({
            connected: false,
            message: 'Connection failed',
            error: error.message
          })
        } else {
          setStatus({
            connected: true,
            message: 'Successfully connected to Supabase!'
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
    <div className="bg-white rounded-lg p-6 shadow-lg border">
      <h3 className="text-lg font-semibold mb-4">Database Connection Test</h3>
      <div className={`flex items-center gap-2 ${
        status.connected ? 'text-green-600' : 'text-red-600'
      }`}>
        <div className={`w-3 h-3 rounded-full ${
          status.connected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="font-medium">{status.message}</span>
      </div>
      {status.error && (
        <div className="mt-2 p-3 bg-red-50 rounded text-red-700 text-sm">
          <strong>Error:</strong> {status.error}
        </div>
      )}
      {status.connected && (
        <div className="mt-2 p-3 bg-green-50 rounded text-green-700 text-sm">
          ✅ Ready to create database tables and start building features!
        </div>
      )}
    </div>
  )
}