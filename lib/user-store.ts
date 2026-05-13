import bcrypt from 'bcryptjs'
import { getPool } from './db'

export type StoredUser = {
  id: string
  email: string
  name: string
  passwordHash: string
  role: 'student' | 'educator'
  enrollmentId?: string
  subject?: string // For educators
}

export type GroupInvite = {
  id: string
  educatorId: string
  educatorName: string
  studentId: string
  studentEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export type StudentEducator = {
  educatorId: string
  educatorName: string
  educatorEmail: string
}

let seedDone = false
let schemaDone = false
let groupSchemaDone = false

async function ensureAuthSchema() {
  if (schemaDone) return
  const pool = getPool()
  await pool.query(`
    create table if not exists users (
      id text primary key,
      email text not null unique,
      name text not null,
      password_hash text not null,
      role text not null check (role in ('student', 'educator')),
      enrollment_id text,
      subject text,
      created_at timestamptz not null default now()
    );
  `)
  await pool.query(`
    create table if not exists educator_student_credentials (
      id text primary key,
      educator_id text not null references users(id) on delete cascade,
      student_id text references users(id) on delete set null,
      student_name text not null,
      student_email text not null,
      enrollment_number text,
      password text not null,
      created_at timestamptz not null default now()
    );
  `)
  schemaDone = true
}

async function ensureGroupSchema() {
  if (groupSchemaDone) return
  await ensureAuthSchema()
  const pool = getPool()
  await pool.query(`
    create table if not exists educator_student_invites (
      id text primary key,
      educator_id text not null references users(id) on delete cascade,
      student_id text not null references users(id) on delete cascade,
      status text not null check (status in ('pending', 'accepted', 'rejected')) default 'pending',
      created_at timestamptz not null default now()
    );
  `)
  await pool.query(`
    create table if not exists educator_student_memberships (
      educator_id text not null references users(id) on delete cascade,
      student_id text not null references users(id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (educator_id, student_id)
    );
  `)
  groupSchemaDone = true
}

function rowToUser(row: any): StoredUser {
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
    role: row.role === 'educator' ? 'educator' : 'student',
    enrollmentId: row.enrollment_id ? String(row.enrollment_id) : undefined,
    subject: row.subject ? String(row.subject) : undefined,
  }
}

export async function ensureSeedUsers(): Promise<void> {
  if (seedDone) return
  await ensureAuthSchema()
  const pool = getPool()

  const existing = await pool.query<{ c: string }>('select count(*)::text as c from users')
  const count = Number(existing.rows[0]?.c ?? 0)
  if (count > 0) {
    seedDone = true
    return
  }

  const hash = await bcrypt.hash('password123', 10)
  await pool.query(
    `
      insert into users (id, email, name, password_hash, role, enrollment_id)
      values
        ($1, $2, $3, $4, 'student', $5),
        ($6, $7, $8, $9, 'educator', null)
    `,
    [
      'STU001',
      'alex.johnson@student.edu',
      'Alex Johnson',
      hash,
      'EN2024001',
      'EDU001',
      'robert.anderson@edu.school',
      'Dr. Robert Anderson',
      hash,
    ]
  )
  seedDone = true
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  await ensureSeedUsers()
  const lower = email.toLowerCase()
  const pool = getPool()
  const res = await pool.query('select * from users where lower(email) = $1 limit 1', [lower])
  const row = res.rows[0]
  return row ? rowToUser(row) : undefined
}

export async function createUser(input: {
  email: string
  name: string
  password: string
  role: 'student' | 'educator'
  subject?: string
}): Promise<StoredUser> {
  await ensureSeedUsers()
  const pool = getPool()
  const lower = input.email.toLowerCase()

  const exists = await pool.query('select 1 from users where lower(email) = $1 limit 1', [lower])
  if (exists.rowCount) throw new Error('Email already registered')

  const id =
    input.role === 'student'
      ? `STU-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
      : `EDU-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

  const passwordHash = await bcrypt.hash(input.password, 10)

  const enrollmentId =
    input.role === 'student' ? `EN-${Date.now().toString(36).toUpperCase()}` : null

  const inserted = await pool.query(
    `
      insert into users (id, email, name, password_hash, role, enrollment_id, subject)
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *
    `,
    [id, lower, input.name.trim(), passwordHash, input.role, enrollmentId, input.subject || null]
  )

  return rowToUser(inserted.rows[0])
}

function generateRandomPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}

export type StudentCredential = {
  id: string
  educatorId: string
  studentId: string | null
  studentName: string
  studentEmail: string
  enrollmentNumber: string
  password: string
  createdAt: string
}

export async function createStudentCredentials(educatorId: string, students: {
  name: string
  email: string
  enrollmentNumber?: string
}[]): Promise<StudentCredential[]> {
  await ensureSeedUsers()
  const pool = getPool()
  const credentials: StudentCredential[] = []

  for (const student of students) {
    const lowerEmail = student.email.toLowerCase()
    const password = generateRandomPassword()
    const passwordHash = await bcrypt.hash(password, 10)

    // Check if student user already exists
    let existingUser = await pool.query('select id from users where lower(email) = $1', [lowerEmail])
    let studentId: string

    if (existingUser.rowCount > 0) {
      studentId = existingUser.rows[0].id
      // Update existing user's password
      await pool.query('update users set password_hash = $1 where id = $2', [passwordHash, studentId])
    } else {
      // Create new student user
      const id = `STU-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
      const enrollmentId = student.enrollmentNumber || `EN-${Date.now().toString(36).toUpperCase()}`
      await pool.query(
        `insert into users (id, email, name, password_hash, role, enrollment_id) values ($1, $2, $3, $4, 'student', $5)`,
        [id, lowerEmail, student.name.trim(), passwordHash, enrollmentId]
      )
      studentId = id
    }

    // Save credential record
    const credId = `CRED-${crypto.randomUUID().slice(0, 12).toUpperCase()}`
    await pool.query(
      `insert into educator_student_credentials (id, educator_id, student_id, student_name, student_email, enrollment_number, password)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [credId, educatorId, studentId, student.name, lowerEmail, student.enrollmentNumber || '', password]
    )

    credentials.push({
      id: credId,
      educatorId,
      studentId,
      studentName: student.name,
      studentEmail: lowerEmail,
      enrollmentNumber: student.enrollmentNumber || '',
      password,
      createdAt: new Date().toISOString(),
    })
  }

  return credentials
}

export async function getEducatorCredentials(educatorId: string): Promise<StudentCredential[]> {
  await ensureSeedUsers()
  const pool = getPool()
  const res = await pool.query(
    'select * from educator_student_credentials where educator_id = $1 order by created_at desc',
    [educatorId]
  )
  return res.rows.map((row: any) => ({
    id: String(row.id),
    educatorId: String(row.educator_id),
    studentId: row.student_id ? String(row.student_id) : null,
    studentName: String(row.student_name),
    studentEmail: String(row.student_email),
    enrollmentNumber: String(row.enrollment_number),
    password: String(row.password),
    createdAt: new Date(row.created_at).toISOString(),
  }))
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  await ensureSeedUsers()
  const pool = getPool()
  const passwordHash = await bcrypt.hash(newPassword, 10)
  await pool.query('update users set password_hash = $1 where id = $2', [passwordHash, userId])
}

export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}

function rowToInvite(row: any): GroupInvite {
  return {
    id: String(row.id),
    educatorId: String(row.educator_id),
    educatorName: String(row.educator_name),
    studentId: String(row.student_id),
    studentEmail: String(row.student_email),
    status: row.status === 'accepted' ? 'accepted' : row.status === 'rejected' ? 'rejected' : 'pending',
    createdAt: new Date(row.created_at).toISOString(),
  }
}

export async function createEducatorInvite(input: {
  educatorId: string
  studentEmail: string
}): Promise<GroupInvite> {
  await ensureSeedUsers()
  await ensureGroupSchema()
  const pool = getPool()
  const studentEmail = input.studentEmail.trim().toLowerCase()
  const studentRes = await pool.query(
    `select id, email, role from users where lower(email) = $1 limit 1`,
    [studentEmail]
  )
  const student = studentRes.rows[0]
  if (!student || student.role !== 'student') {
    throw new Error('Student account not found for this email')
  }

  const membership = await pool.query(
    `select 1 from educator_student_memberships where educator_id = $1 and student_id = $2 limit 1`,
    [input.educatorId, student.id]
  )
  if (membership.rowCount) throw new Error('Student is already in your group')

  const pendingInvite = await pool.query(
    `select 1 from educator_student_invites where educator_id = $1 and student_id = $2 and status = 'pending' limit 1`,
    [input.educatorId, student.id]
  )
  if (pendingInvite.rowCount) throw new Error('Invite already pending for this student')

  const id = `INV-${crypto.randomUUID().slice(0, 12).toUpperCase()}`
  await pool.query(
    `insert into educator_student_invites (id, educator_id, student_id, status) values ($1, $2, $3, 'pending')`,
    [id, input.educatorId, student.id]
  )

  const created = await pool.query(
    `
      select i.*, e.name as educator_name, s.email as student_email
      from educator_student_invites i
      join users e on e.id = i.educator_id
      join users s on s.id = i.student_id
      where i.id = $1
      limit 1
    `,
    [id]
  )
  return rowToInvite(created.rows[0])
}

export async function listEducatorInvites(educatorId: string): Promise<GroupInvite[]> {
  await ensureSeedUsers()
  await ensureGroupSchema()
  const pool = getPool()
  const res = await pool.query(
    `
      select i.*, e.name as educator_name, s.email as student_email
      from educator_student_invites i
      join users e on e.id = i.educator_id
      join users s on s.id = i.student_id
      where i.educator_id = $1
      order by i.created_at desc
    `,
    [educatorId]
  )
  return res.rows.map(rowToInvite)
}

export async function listStudentInvites(studentId: string): Promise<GroupInvite[]> {
  await ensureSeedUsers()
  await ensureGroupSchema()
  const pool = getPool()
  const res = await pool.query(
    `
      select i.*, e.name as educator_name, s.email as student_email
      from educator_student_invites i
      join users e on e.id = i.educator_id
      join users s on s.id = i.student_id
      where i.student_id = $1 and i.status = 'pending'
      order by i.created_at desc
    `,
    [studentId]
  )
  return res.rows.map(rowToInvite)
}

export async function acceptStudentInvite(input: {
  inviteId: string
  studentId: string
}): Promise<void> {
  await ensureSeedUsers()
  await ensureGroupSchema()
  const pool = getPool()
  const update = await pool.query(
    `
      update educator_student_invites
      set status = 'accepted'
      where id = $1 and student_id = $2 and status = 'pending'
      returning educator_id, student_id
    `,
    [input.inviteId, input.studentId]
  )
  if (!update.rowCount) throw new Error('Invite not found or already handled')

  const row = update.rows[0]
  await pool.query(
    `
      insert into educator_student_memberships (educator_id, student_id)
      values ($1, $2)
      on conflict (educator_id, student_id) do nothing
    `,
    [row.educator_id, row.student_id]
  )
}

export async function listStudentEducators(studentId: string): Promise<StudentEducator[]> {
  await ensureSeedUsers()
  await ensureGroupSchema()
  const pool = getPool()
  const res = await pool.query(
    `
      select e.id as educator_id, e.name as educator_name, e.email as educator_email
      from educator_student_memberships m
      join users e on e.id = m.educator_id
      where m.student_id = $1
      order by m.created_at desc
    `,
    [studentId]
  )
  return res.rows.map((row: any) => ({
    educatorId: String(row.educator_id),
    educatorName: String(row.educator_name),
    educatorEmail: String(row.educator_email),
  }))
}
