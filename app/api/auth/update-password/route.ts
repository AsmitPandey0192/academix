import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'
import { updateUserPassword, findUserByEmail } from '@/lib/user-store'

const bodySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await verifySession(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors
      const first = Object.values(msg).flat()[0]
      return NextResponse.json({ error: first ?? 'Invalid request' }, { status: 400 })
    }

    const { currentPassword, newPassword } = parsed.data

    // Find user by email from session
    const user = await findUserByEmail(session.email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const bcrypt = await import('bcryptjs')
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Update password
    await updateUserPassword(user.id, newPassword)

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update password'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}