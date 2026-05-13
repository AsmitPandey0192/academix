export type RiskLevel = 'low' | 'medium' | 'high'

export interface ProcessedStudent {
  studentId: string
  enrollmentNumber: string
  name: string
  attendance: number
  mst1Score: number
  mst2Score: number
  previousSemester: string
  overallCgpa: number
  previousSemesterScgpa: number
  skillAssignments: number
  assignmentSubmissions: number
  backlogCount: number
  currentGrade: number
  predictedGrade: number
  riskLevel: RiskLevel
  subjects: Record<string, number>
}

export interface PerformanceDistribution {
  excellent: number
  good: number
  average: number
  needsImprovement: number
}

export interface SubjectAverage {
  subject: string
  average: number
}

export interface EducatorOverviewStats {
  totalStudents: number
  averagePerformance: number
  averageAttendance: number
  averageCgpa: number
  totalBacklogs: number
  topPerformers: number
  atRiskStudents: number
}

export interface AiInsights {
  classSummary: string
  keyInsights: string[]
  recommendations: string[]
}

export interface EducatorAnalyticsPayload {
  overview: EducatorOverviewStats
  distribution: PerformanceDistribution
  subjectAverages: SubjectAverage[]
  students: ProcessedStudent[]
  ai: AiInsights
  generatedAt: string
}

const NON_SUBJECT_HEADERS = new Set([
  'student_id',
  'studentid',
  'id',
  'name',
  'attendance',
  'enrollment_number',
  'enrollment_no',
  'enrollment',
  'enrolment_number',
  'enrolment_no',
  'enrolment',
  'mst_1',
  'mst1',
  'mst_2',
  'mst2',
  'previous_semester',
  'previous_sem',
  'overall_cgpa',
  'cgpa',
  'previous_sem_scgpa',
  'scgpa',
  'skill_assignments',
  'assignment_submissions',
  'assignments_submission',
  'backlog',
  'backlogs',
  'backlog_count',
])

function findColumnIndex(headers: string[], aliases: string[]): number {
  return headers.findIndex(header => aliases.includes(header))
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  result.push(current.trim())
  return result
}

function toNumber(value: string | undefined, fallback = 0): number {
  if (!value) return fallback
  const cleaned = value.replace('%', '').trim()
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : fallback
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n))
}

export function buildAnalyticsFromCsv(csvRaw: string): EducatorAnalyticsPayload {
  const lines = csvRaw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error('CSV must include a header row and at least one student row.')
  }

  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'))
  const originalHeaders = parseCsvLine(lines[0]).map(h => h.trim())
  const nameIndex = headers.indexOf('name')
  const attendanceIndex = findColumnIndex(headers, ['attendance'])

  if (nameIndex === -1) {
    throw new Error('CSV header must include "name" column.')
  }

  const studentIdIndex = headers.findIndex(h => h === 'student_id' || h === 'studentid' || h === 'id')
  const enrollmentNumberIndex = findColumnIndex(headers, [
    'enrollment_number',
    'enrollment_no',
    'enrollment',
    'enrolment_number',
    'enrolment_no',
    'enrolment',
  ])
  const mst1Index = findColumnIndex(headers, ['mst_1', 'mst1', 'mst-1', 'mst1_score', 'mst_1_score'])
  const mst2Index = findColumnIndex(headers, ['mst_2', 'mst2', 'mst-2', 'mst2_score', 'mst_2_score'])
  const previousSemesterIndex = findColumnIndex(headers, ['previous_semester', 'previous_sem'])
  const overallCgpaIndex = findColumnIndex(headers, ['overall_cgpa', 'cgpa'])
  const previousSemesterScgpaIndex = findColumnIndex(headers, ['previous_sem_scgpa', 'scgpa'])
  const skillAssignmentsIndex = findColumnIndex(headers, ['skill_assignments', 'skills_assignments'])
  const assignmentSubmissionsIndex = findColumnIndex(headers, [
    'assignment_submissions',
    'assignments_submission',
  ])
  const backlogCountIndex = findColumnIndex(headers, ['backlog', 'backlogs', 'backlog_count'])

  const subjectIndexes = headers
    .map((h, idx) => ({ h, idx }))
    .filter(({ h }) => !NON_SUBJECT_HEADERS.has(h))

  if (subjectIndexes.length === 0 && mst1Index === -1 && mst2Index === -1) {
    throw new Error(
      'CSV must include subject score columns or MST columns (mst1/mst2) in addition to name.'
    )
  }

  const students: ProcessedStudent[] = lines.slice(1).map((line, rowIndex) => {
    const cells = parseCsvLine(line)
    const subjects: Record<string, number> = {}
    let total = 0

    for (const { idx } of subjectIndexes) {
      const value = clamp(toNumber(cells[idx]))
      subjects[originalHeaders[idx] ?? headers[idx]] = value
      total += value
    }

    const mst1Score = mst1Index === -1 ? 0 : clamp(toNumber(cells[mst1Index]), 0, 20)
    const mst2Score = mst2Index === -1 ? 0 : clamp(toNumber(cells[mst2Index]), 0, 20)
    const overallCgpa =
      overallCgpaIndex === -1 ? 0 : Math.max(0, Math.min(10, toNumber(cells[overallCgpaIndex])))
    const previousSemesterScgpa =
      previousSemesterScgpaIndex === -1
        ? 0
        : Math.max(0, Math.min(10, toNumber(cells[previousSemesterScgpaIndex])))
    const skillAssignments = skillAssignmentsIndex === -1 ? 0 : Math.max(0, toNumber(cells[skillAssignmentsIndex]))
    const assignmentSubmissions =
      assignmentSubmissionsIndex === -1 ? 0 : Math.max(0, toNumber(cells[assignmentSubmissionsIndex]))
    const backlogCount = backlogCountIndex === -1 ? 0 : Math.max(0, toNumber(cells[backlogCountIndex]))
    const mstScores: number[] = []
    if (mst1Index !== -1) mstScores.push(mst1Score)
    if (mst2Index !== -1) mstScores.push(mst2Score)
    const mstPercentage =
      mstScores.length > 0 ? mstScores.reduce((sum, score) => sum + score, 0) / mstScores.length * 5 : 0
    const derivedScorePool = subjectIndexes.length > 0 ? total / subjectIndexes.length : mstPercentage
    const currentGrade = Number(derivedScorePool.toFixed(1))
    const attendance = attendanceIndex === -1 ? 0 : clamp(toNumber(cells[attendanceIndex]))

    // Lightweight prediction heuristic; Gemini gives narrative insights.
    const predictedGrade = clamp(
      Number((currentGrade * 0.85 + attendance * 0.15 + (attendance > 90 ? 2 : 0)).toFixed(1))
    )

    let riskLevel: RiskLevel = 'low'
    if (predictedGrade < 45 || attendance < 45) riskLevel = 'high'
    else if (predictedGrade <= 75 || attendance <= 75) riskLevel = 'medium'

    return {
      studentId: cells[studentIdIndex] || `ROW-${rowIndex + 1}`,
      enrollmentNumber:
        cells[enrollmentNumberIndex] || cells[studentIdIndex] || `ENR-${String(rowIndex + 1).padStart(3, '0')}`,
      name: cells[nameIndex] || `Student ${rowIndex + 1}`,
      attendance,
      mst1Score,
      mst2Score,
      previousSemester: cells[previousSemesterIndex] || 'NA',
      overallCgpa,
      previousSemesterScgpa,
      skillAssignments,
      assignmentSubmissions,
      backlogCount,
      currentGrade,
      predictedGrade,
      riskLevel,
      subjects,
    }
  })

  const totalStudents = students.length
  const averagePerformance =
    totalStudents === 0
      ? 0
      : Number(
          (students.reduce((sum, student) => sum + student.currentGrade, 0) / totalStudents).toFixed(1)
        )
  const averageAttendance =
    totalStudents === 0
      ? 0
      : Number((students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents).toFixed(1))
  const averageCgpa =
    totalStudents === 0
      ? 0
      : Number((students.reduce((sum, student) => sum + student.overallCgpa, 0) / totalStudents).toFixed(2))
  const totalBacklogs = students.reduce((sum, student) => sum + student.backlogCount, 0)
  const topPerformers = students.filter(student => student.currentGrade > 75).length
  const atRiskStudents = students.filter(student => student.riskLevel === 'high').length

  const distribution: PerformanceDistribution = {
    excellent: students.filter(student => student.currentGrade > 75).length,
    good: students.filter(student => student.currentGrade >= 60 && student.currentGrade <= 75).length,
    average: students.filter(student => student.currentGrade >= 45 && student.currentGrade < 60).length,
    needsImprovement: students.filter(student => student.currentGrade < 45).length,
  }

  const subjectAverages: SubjectAverage[] = subjectIndexes.map(({ idx }) => {
    const label = originalHeaders[idx] ?? headers[idx]
    const average =
      students.reduce((sum, student) => sum + (student.subjects[label] ?? 0), 0) / totalStudents
    return { subject: label, average: Number(average.toFixed(1)) }
  })

  const ai: AiInsights = {
    classSummary: 'Upload complete. Gemini insights pending.',
    keyInsights: [],
    recommendations: [],
  }

  return {
    overview: {
      totalStudents,
      averagePerformance,
      averageAttendance,
      averageCgpa,
      totalBacklogs,
      topPerformers,
      atRiskStudents,
    },
    distribution,
    subjectAverages,
    students,
    ai,
    generatedAt: new Date().toISOString(),
  }
}

