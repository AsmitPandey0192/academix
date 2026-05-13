'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { EducatorHeader } from '@/components/educator/educator-header'
import { AnalyticsOverview } from '@/components/educator/analytics-overview'
import { StudentRosterTable } from '@/components/educator/student-roster-table'
import { DatasetUpload } from '@/components/educator/dataset-upload'
import { PerformanceDistribution } from '@/components/educator/performance-distribution'
import { ClassInsights } from '@/components/educator/class-insights'
import { StudentGroupManager } from '@/components/educator/student-group-manager'
import type { EducatorAnalyticsPayload } from '@/lib/educator-analytics'

const EMPTY_ANALYTICS: EducatorAnalyticsPayload = {
  overview: {
    totalStudents: 0,
    averagePerformance: 0,
    averageAttendance: 0,
    averageCgpa: 0,
    totalBacklogs: 0,
    topPerformers: 0,
    atRiskStudents: 0,
  },
  distribution: {
    excellent: 0,
    good: 0,
    average: 0,
    needsImprovement: 0,
  },
  subjectAverages: [],
  students: [],
  ai: {
    classSummary: '',
    keyInsights: [],
    recommendations: [],
  },
  generatedAt: '',
}

export default function EducatorDashboard() {
  const router = useRouter()
  const { user, educator } = useAuth()
  const [analytics, setAnalytics] = useState<EducatorAnalyticsPayload>(EMPTY_ANALYTICS)

  useEffect(() => {
    if (!user || user.role !== 'educator') {
      router.replace('/auth')
    }
  }, [user, router])

  if (!educator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <EducatorHeader educator={educator} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StudentGroupManager />

        {/* Analytics Overview */}
        <AnalyticsOverview overview={analytics.overview} />

        {/* Class Insights */}
        <ClassInsights overview={analytics.overview} ai={analytics.ai} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6">
          <DatasetUpload onComplete={setAnalytics} />
          <PerformanceDistribution
            distribution={analytics.distribution}
            subjectAverages={analytics.subjectAverages}
          />
        </div>

        {/* Student Roster */}
        <StudentRosterTable students={analytics.students} />
      </main>
    </div>
  )
}
