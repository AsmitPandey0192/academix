'use client'

import React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '@/lib/auth-context'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
