import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from '@/lib/auth-constants'
import { signSession } from '@/lib/jwt'
import { sessionToAuthUser, userToSessionPayload } from '@/lib/session'
import { findUserByEmail, verifyPassword } from '@/lib/user-store'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['student', 'educator']),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const { email, password, role } = parsed.data

    const user = await findUserByEmail(email)
    if (!user || user.role !== role) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const ok = await verifyPassword(user, password)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signSession(userToSessionPayload(user))
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SEC,
    })

    const payload = userToSessionPayload(user)
    return NextResponse.json({ user: sessionToAuthUser(payload) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
