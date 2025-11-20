'use client'

import { useEffect } from 'react'

export default function GlobalError() {
  useEffect(() => {
    // Redirect to home page on error
    window.location.href = '/'
  }, [])

  return (
    <html lang="en">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Redirecting...</h1>
        </div>
      </body>
    </html>
  )
}
