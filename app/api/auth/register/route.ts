import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from '@/lib/auth-constants'
import { signSession } from '@/lib/jwt'
import { sessionToAuthUser, userToSessionPayload } from '@/lib/session'
import { createUser } from '@/lib/user-store'

const bodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'educator']),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors
      const first = Object.values(msg).flat()[0]
      return NextResponse.json({ error: first ?? 'Invalid request body' }, { status: 400 })
    }
    const { name, email, password, role } = parsed.data

    const user = await createUser({ name, email, password, role })
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
    const message = e instanceof Error ? e.message : 'Registration failed'
    if (message === 'Email already registered') {
      return NextResponse.json({ error: message }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
