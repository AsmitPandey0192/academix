import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'
import { getEducatorCredentials } from '@/lib/user-store'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const session = await verifySession(token)
    if (!session || session.role !== 'educator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const credentials = await getEducatorCredentials(session.sub)

    // Generate CSV content
    const csvHeader = 'Name,Email,Enrollment Number,Password\n'
    const csvRows = credentials.map(c =>
      `${c.studentName},${c.studentEmail},${c.enrollmentNumber},${c.password}`
    ).join('\n')

    const csvContent = csvHeader + csvRows

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="student-credentials-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not fetch credentials'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}