import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'
import { sessionToAuthUser } from '@/lib/session'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ user: null })
  }
  const payload = await verifySession(token)
  if (!payload) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({ user: sessionToAuthUser(payload) })
}
