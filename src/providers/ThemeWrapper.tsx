// components/ThemeWrapper.tsx
'use client'
import { ThemeProvider } from 'next-themes'
import { useState, useEffect, ReactNode } from 'react'

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Option A: return null → white flash possible (fastest)
  if (!mounted) return null

  // Option B: return skeleton / forced light mode placeholder
  // if (!mounted) {
  //   return <div className="min-h-screen bg-white">{children}</div>
  // }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"    // or "light" / "dark"
      enableSystem
      // disableTransitionOnChange // optional – reduces flash during toggle
    >
      {children}
    </ThemeProvider>
  )
}