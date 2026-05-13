import type { StoredUser } from './user-store'
import type { SessionPayload } from './jwt'

export function userToSessionPayload(user: StoredUser): SessionPayload {
  return {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    enrollmentId: user.enrollmentId,
  }
}

export function sessionToAuthUser(payload: SessionPayload) {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    enrollmentId: payload.enrollmentId,
  }
}
