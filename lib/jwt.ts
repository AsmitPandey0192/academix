import { SignJWT, jwtVerify } from 'jose'
import { SESSION_MAX_AGE_SEC } from './auth-constants'

export type SessionPayload = {
  sub: string
  email: string
  name: string
  role: 'student' | 'educator'
  enrollmentId?: string
}

function getSecretKey() {
  const s = process.env.AUTH_SECRET
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set to at least 16 characters in production')
    }
    return new TextEncoder().encode('dev-academix-secret-min-32-chars!!')
  }
  return new TextEncoder().encode(s)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const jwt = await new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
    enrollmentId: payload.enrollmentId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(getSecretKey())

  return jwt
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    const sub = String(payload.sub ?? '')
    const email = String(payload.email ?? '')
    const name = String(payload.name ?? '')
    const role = payload.role
    if (!sub || !email || (role !== 'student' && role !== 'educator')) {
      return null
    }
    return {
      sub,
      email,
      name,
      role,
      enrollmentId: payload.enrollmentId ? String(payload.enrollmentId) : undefined,
    }
  } catch {
    return null
  }
}
