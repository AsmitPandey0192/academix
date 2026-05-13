import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const payload = token ? await verifySession(token) : null

  if (pathname.startsWith('/auth')) {
    if (payload) {
      const dest =
        payload.role === 'student' ? '/dashboard/student' : '/dashboard/educator'
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/dashboard')) {
    if (!payload) {
      const signIn = new URL('/auth', request.url)
      signIn.searchParams.set('next', pathname)
      return NextResponse.redirect(signIn)
    }

    if (pathname === '/dashboard') {
      return NextResponse.redirect(
        new URL(
          payload.role === 'student' ? '/dashboard/student' : '/dashboard/educator',
          request.url
        )
      )
    }

    if (pathname.startsWith('/dashboard/student') && payload.role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard/educator', request.url))
    }
    if (pathname.startsWith('/dashboard/educator') && payload.role !== 'educator') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}
