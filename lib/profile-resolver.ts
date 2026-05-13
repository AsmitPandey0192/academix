import { mockEducators, mockStudents, type Educator, type Student } from './mock-data'
import type { AuthUser } from './auth-types'

function stripStudent(s: Student): Student {
  return { ...s, password: '' }
}

function stripEducator(e: Educator): Educator {
  return { ...e, password: '' }
}

function templateStudent(user: AuthUser): Student {
  const t = mockStudents[0]
  return stripStudent({
    ...t,
    id: user.id,
    name: user.name,
    email: user.email,
    enrollmentId: user.enrollmentId ?? t.enrollmentId,
  })
}

function templateEducator(user: AuthUser): Educator {
  const t = mockEducators[0]
  return stripEducator({
    ...t,
    id: user.id,
    name: user.name,
    email: user.email,
  })
}

export function resolveStudentProfile(user: AuthUser): Student {
  const fromMock = mockStudents.find(s => s.email.toLowerCase() === user.email.toLowerCase())
  if (fromMock) return stripStudent(fromMock)
  return templateStudent(user)
}

export function resolveEducatorProfile(user: AuthUser): Educator {
  const fromMock = mockEducators.find(e => e.email.toLowerCase() === user.email.toLowerCase())
  if (fromMock) return stripEducator(fromMock)
  return templateEducator(user)
}
