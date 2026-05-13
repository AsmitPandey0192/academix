import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'
import { createEducatorInvite, listEducatorInvites } from '@/lib/user-store'

const createSchema = z.object({
  studentEmail: z.string().email(),
})

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await verifySession(token)
  if (!session || session.role !== 'educator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const invites = await listEducatorInvites(session.sub)
  return NextResponse.json({ invites })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const session = await verifySession(token)
  if (!session || session.role !== 'educator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const json = await request.json().catch(() => null)
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Valid studentEmail is required' }, { status: 400 })
  }

  try {
    const invite = await createEducatorInvite({
      educatorId: session.sub,
      studentEmail: parsed.data.studentEmail,
    })
    return NextResponse.json({ invite })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create invite'
    const status = message.includes('not found') ? 404 : 409
    return NextResponse.json({ error: message }, { status })
  }
}
