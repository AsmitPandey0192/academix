import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'
import { acceptStudentInvite } from '@/lib/user-store'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await verifySession(token)
  if (!session || session.role !== 'student') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { inviteId } = await params
  try {
    await acceptStudentInvite({ inviteId, studentId: session.sub })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not accept invite'
    return NextResponse.json({ error: message }, { status: 409 })
  }
}
