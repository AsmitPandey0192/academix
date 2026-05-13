// Mock Data for Student Result Prediction Platform

export interface Student {
  id: string
  name: string
  email: string
  password: string
  enrollmentId: string
  currentGrade: number
  predictedGrade: number
  subjects: SubjectPerformance[]
  overallAttendance: number
  lastUpdated: string
  goals: StudentGoal[]
  classRank: number
  totalStudents: number
}

export interface SubjectPerformance {
  id: string
  name: string
  currentScore: number
  predictedScore: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  assignments: number
  tests: number
  participation: number
}

export interface StudentGoal {
  id: string
  title: string
  targetGrade: number
  currentProgress: number
  deadline: string
  status: 'on-track' | 'at-risk' | 'completed'
}

export interface Educator {
  id: string
  name: string
  email: string
  password: string
  department: string
  studentsCount: number
  classes: ClassInfo[]
}

export interface ClassInfo {
  id: string
  name: string
  enrolledStudents: number
  averagePerformance: number
  datasetStatus: 'uploaded' | 'pending'
}

export interface AnalyticsOverview {
  totalStudents: number
  averagePerformance: number
  performanceDistribution: {
    excellent: number
    good: number
    average: number
    needsImprovement: number
  }
  topPerformers: Student[]
  atRiskStudents: Student[]
}

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: 'STU001',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    password: 'password123',
    enrollmentId: 'EN2024001',
    currentGrade: 87,
    predictedGrade: 89,
    classRank: 3,
    totalStudents: 45,
    overallAttendance: 94,
    lastUpdated: '2024-03-18',
    subjects: [
      {
        id: 'MATH101',
        name: 'Mathematics',
        currentScore: 88,
        predictedScore: 91,
        trend: 'up',
        trendPercent: 3,
        assignments: 45,
        tests: 8,
        participation: 92,
      },
      {
        id: 'ENG101',
        name: 'English Literature',
        currentScore: 85,
        predictedScore: 87,
        trend: 'stable',
        trendPercent: 0,
        assignments: 43,
        tests: 7,
        participation: 88,
      },
      {
        id: 'SCI101',
        name: 'Physics',
        currentScore: 89,
        predictedScore: 92,
        trend: 'up',
        trendPercent: 5,
        assignments: 47,
        tests: 9,
        participation: 95,
      },
      {
        id: 'HIS101',
        name: 'History',
        currentScore: 84,
        predictedScore: 85,
        trend: 'stable',
        trendPercent: 1,
        assignments: 42,
        tests: 8,
        participation: 86,
      },
    ],
    goals: [
      {
        id: 'GOAL001',
        title: 'Achieve 90+ in Mathematics',
        targetGrade: 90,
        currentProgress: 88,
        deadline: '2024-05-30',
        status: 'on-track',
      },
      {
        id: 'GOAL002',
        title: 'Improve Writing Skills',
        targetGrade: 88,
        currentProgress: 85,
        deadline: '2024-06-15',
        status: 'on-track',
      },
    ],
  },
  {
    id: 'STU002',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edu',
    password: 'password123',
    enrollmentId: 'EN2024002',
    currentGrade: 92,
    predictedGrade: 94,
    classRank: 1,
    totalStudents: 45,
    overallAttendance: 98,
    lastUpdated: '2024-03-18',
    subjects: [
      {
        id: 'MATH101',
        name: 'Mathematics',
        currentScore: 95,
        predictedScore: 97,
        trend: 'up',
        trendPercent: 4,
        assignments: 48,
        tests: 9,
        participation: 98,
      },
      {
        id: 'ENG101',
        name: 'English Literature',
        currentScore: 91,
        predictedScore: 93,
        trend: 'up',
        trendPercent: 2,
        assignments: 46,
        tests: 9,
        participation: 94,
      },
      {
        id: 'SCI101',
        name: 'Physics',
        currentScore: 93,
        predictedScore: 95,
        trend: 'up',
        trendPercent: 3,
        assignments: 48,
        tests: 10,
        participation: 97,
      },
      {
        id: 'HIS101',
        name: 'History',
        currentScore: 89,
        predictedScore: 91,
        trend: 'up',
        trendPercent: 2,
        assignments: 45,
        tests: 9,
        participation: 92,
      },
    ],
    goals: [
      {
        id: 'GOAL001',
        title: 'Maintain 95+ Average',
        targetGrade: 95,
        currentProgress: 92,
        deadline: '2024-05-30',
        status: 'on-track',
      },
    ],
  },
  {
    id: 'STU003',
    name: 'James Wilson',
    email: 'james.wilson@student.edu',
    password: 'password123',
    enrollmentId: 'EN2024003',
    currentGrade: 72,
    predictedGrade: 75,
    classRank: 38,
    totalStudents: 45,
    overallAttendance: 76,
    lastUpdated: '2024-03-18',
    subjects: [
      {
        id: 'MATH101',
        name: 'Mathematics',
        currentScore: 68,
        predictedScore: 72,
        trend: 'up',
        trendPercent: 6,
        assignments: 35,
        tests: 5,
        participation: 65,
      },
      {
        id: 'ENG101',
        name: 'English Literature',
        currentScore: 75,
        predictedScore: 77,
        trend: 'up',
        trendPercent: 3,
        assignments: 38,
        tests: 6,
        participation: 72,
      },
      {
        id: 'SCI101',
        name: 'Physics',
        currentScore: 70,
        predictedScore: 73,
        trend: 'up',
        trendPercent: 4,
        assignments: 36,
        tests: 5,
        participation: 68,
      },
      {
        id: 'HIS101',
        name: 'History',
        currentScore: 74,
        predictedScore: 76,
        trend: 'stable',
        trendPercent: 0,
        assignments: 37,
        tests: 6,
        participation: 70,
      },
    ],
    goals: [
      {
        id: 'GOAL001',
        title: 'Pass Mathematics with 75+',
        targetGrade: 75,
        currentProgress: 68,
        deadline: '2024-05-30',
        status: 'at-risk',
      },
      {
        id: 'GOAL002',
        title: 'Improve Class Attendance',
        targetGrade: 85,
        currentProgress: 76,
        deadline: '2024-06-01',
        status: 'at-risk',
      },
    ],
  },
  {
    id: 'STU004',
    name: 'Sarah Chen',
    email: 'sarah.chen@student.edu',
    password: 'password123',
    enrollmentId: 'EN2024004',
    currentGrade: 81,
    predictedGrade: 83,
    classRank: 8,
    totalStudents: 45,
    overallAttendance: 91,
    lastUpdated: '2024-03-18',
    subjects: [
      {
        id: 'MATH101',
        name: 'Mathematics',
        currentScore: 82,
        predictedScore: 85,
        trend: 'up',
        trendPercent: 4,
        assignments: 44,
        tests: 8,
        participation: 89,
      },
      {
        id: 'ENG101',
        name: 'English Literature',
        currentScore: 79,
        predictedScore: 81,
        trend: 'stable',
        trendPercent: 0,
        assignments: 41,
        tests: 7,
        participation: 83,
      },
      {
        id: 'SCI101',
        name: 'Physics',
        currentScore: 83,
        predictedScore: 85,
        trend: 'up',
        trendPercent: 3,
        assignments: 45,
        tests: 8,
        participation: 91,
      },
      {
        id: 'HIS101',
        name: 'History',
        currentScore: 81,
        predictedScore: 82,
        trend: 'stable',
        trendPercent: 0,
        assignments: 42,
        tests: 8,
        participation: 87,
      },
    ],
    goals: [
      {
        id: 'GOAL001',
        title: 'Reach 85+ in All Subjects',
        targetGrade: 85,
        currentProgress: 81,
        deadline: '2024-06-01',
        status: 'on-track',
      },
    ],
  },
  {
    id: 'STU005',
    name: 'David Kumar',
    email: 'david.kumar@student.edu',
    password: 'password123',
    enrollmentId: 'EN2024005',
    currentGrade: 78,
    predictedGrade: 80,
    classRank: 18,
    totalStudents: 45,
    overallAttendance: 88,
    lastUpdated: '2024-03-18',
    subjects: [
      {
        id: 'MATH101',
        name: 'Mathematics',
        currentScore: 76,
        predictedScore: 79,
        trend: 'up',
        trendPercent: 4,
        assignments: 40,
        tests: 7,
        participation: 82,
      },
      {
        id: 'ENG101',
        name: 'English Literature',
        currentScore: 81,
        predictedScore: 82,
        trend: 'stable',
        trendPercent: 0,
        assignments: 42,
        tests: 8,
        participation: 84,
      },
      {
        id: 'SCI101',
        name: 'Physics',
        currentScore: 78,
        predictedScore: 80,
        trend: 'up',
        trendPercent: 3,
        assignments: 40,
        tests: 7,
        participation: 85,
      },
      {
        id: 'HIS101',
        name: 'History',
        currentScore: 77,
        predictedScore: 79,
        trend: 'up',
        trendPercent: 3,
        assignments: 39,
        tests: 7,
        participation: 80,
      },
    ],
    goals: [
      {
        id: 'GOAL001',
        title: 'Improve Mathematics Score',
        targetGrade: 80,
        currentProgress: 76,
        deadline: '2024-05-30',
        status: 'on-track',
      },
    ],
  },
]

// Mock Educators Data
export const mockEducators: Educator[] = [
  {
    id: 'EDU001',
    name: 'Dr. Robert Anderson',
    email: 'robert.anderson@edu.school',
    password: 'password123',
    department: 'Mathematics',
    studentsCount: 45,
    classes: [
      {
        id: 'CLASS001',
        name: 'Grade 10 - Section A',
        enrolledStudents: 45,
        averagePerformance: 82.4,
        datasetStatus: 'uploaded',
      },
      {
        id: 'CLASS002',
        name: 'Grade 10 - Section B',
        enrolledStudents: 43,
        averagePerformance: 79.8,
        datasetStatus: 'uploaded',
      },
    ],
  },
  {
    id: 'EDU002',
    name: 'Prof. Emily Watson',
    email: 'emily.watson@edu.school',
    password: 'password123',
    department: 'English',
    studentsCount: 88,
    classes: [
      {
        id: 'CLASS003',
        name: 'Grade 11 - Literature',
        enrolledStudents: 44,
        averagePerformance: 81.2,
        datasetStatus: 'uploaded',
      },
      {
        id: 'CLASS004',
        name: 'Grade 11 - Communication',
        enrolledStudents: 44,
        averagePerformance: 80.5,
        datasetStatus: 'pending',
      },
    ],
  },
]

// Analytics Overview Data
export const getAnalyticsOverview = (): AnalyticsOverview => {
  const averagePerformance =
    mockStudents.reduce((sum, s) => sum + s.currentGrade, 0) / mockStudents.length

  return {
    totalStudents: mockStudents.length,
    averagePerformance: Math.round(averagePerformance * 10) / 10,
    performanceDistribution: {
      excellent: mockStudents.filter(s => s.currentGrade >= 90).length,
      good: mockStudents.filter(s => s.currentGrade >= 80 && s.currentGrade < 90).length,
      average: mockStudents.filter(s => s.currentGrade >= 70 && s.currentGrade < 80).length,
      needsImprovement: mockStudents.filter(s => s.currentGrade < 70).length,
    },
    topPerformers: mockStudents
      .sort((a, b) => b.currentGrade - a.currentGrade)
      .slice(0, 3),
    atRiskStudents: mockStudents
      .filter(s => s.currentGrade < 75)
      .sort((a, b) => a.currentGrade - b.currentGrade),
  }
}
