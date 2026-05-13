'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Student, Educator } from './mock-data'
import type { AuthUser, UserRole } from './auth-types'
import { resolveEducatorProfile, resolveStudentProfile } from './profile-resolver'

export type { UserRole, AuthUser }

interface AuthContextType {
  user: AuthUser | null
  student: Student | null
  educator: Educator | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function applyProfiles(u: AuthUser): { student: Student | null; educator: Educator | null } {
  if (u.role === 'student') {
    return { student: resolveStudentProfile(u), educator: null }
  }
  return { student: null, educator: resolveEducatorProfile(u) }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [educator, setEducator] = useState<Educator | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setFromUser = useCallback((u: AuthUser | null) => {
    setUser(u)
    if (!u) {
      setStudent(null)
      setEducator(null)
      return
    }
    const p = applyProfiles(u)
    setStudent(p.student)
    setEducator(p.educator)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (!res.ok) return
        const data = (await res.json()) as { user: AuthUser | null }
        if (!cancelled && data.user) setFromUser(data.user)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setFromUser])

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, role }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(typeof data.error === 'string' ? data.error : 'Login failed')
        }
        setFromUser(data.user as AuthUser)
      } finally {
        setIsLoading(false)
      }
    },
    [setFromUser]
  )

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password, role }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(typeof data.error === 'string' ? data.error : 'Registration failed')
        }
        setFromUser(data.user as AuthUser)
      } finally {
        setIsLoading(false)
      }
    },
    [setFromUser]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      setFromUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [setFromUser])

  return (
    <AuthContext.Provider value={{ user, student, educator, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      student: null,
      educator: null,
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
    }
  }
  return context
}
