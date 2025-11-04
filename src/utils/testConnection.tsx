// Quick connection test component
// Import this in any page to test Supabase connection

import { useEffect, useState } from 'react'
import { testSupabaseConnection, testAllTables } from '../services/db.test'

/**
 * TestConnection Component
 * Use this in your Dashboard or any page to verify Supabase is working
 */
export function TestConnection() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [message, setMessage] = useState('Testing connection...')
  const [tableResults, setTableResults] = useState<{ [key: string]: boolean } | null>(null)

  useEffect(() => {
    async function runTests() {
      // Test basic connection
      const connectionOk = await testSupabaseConnection()
      
      if (connectionOk) {
        setStatus('success')
        setMessage('✅ Supabase connection successful!')
        
        // Test all tables
        const results = await testAllTables()
        setTableResults(results)
      } else {
        setStatus('error')
        setMessage('❌ Supabase connection failed. Check your .env file and Supabase project status.')
      }
    }

    runTests()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <p className={`
            font-medium
            ${status === 'success' ? 'text-green-700' : status === 'error' ? 'text-red-700' : 'text-gray-700'}
          `}>
            {message}
          </p>
        </div>

        {tableResults && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Table Accessibility:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(tableResults).map(([table, accessible]) => (
                <div
                  key={table}
                  className={`p-2 rounded text-sm ${
                    accessible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {accessible ? '✅' : '❌'} {table}
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'success' && (
          <p className="text-sm text-gray-600 mt-4">
            🎉 Your Supabase setup is complete! You can now start using the database in your application.
          </p>
        )}

        {status === 'error' && (
          <div className="text-sm text-red-600 mt-4">
            <p className="font-medium mb-2">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check that your .env file exists and has correct values</li>
              <li>Verify your Supabase project is active</li>
              <li>Ensure you ran the schema.sql and seed.sql scripts</li>
              <li>Check browser console for detailed error messages</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

