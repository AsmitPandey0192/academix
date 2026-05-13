'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { StudentHeader } from '@/components/student/student-header'
import { StudentOverviewCards } from '@/components/student/student-overview-cards'
import { SubjectPerformance } from '@/components/student/subject-performance'
import { GrowthChart } from '@/components/student/growth-chart'
import { GoalsSection } from '@/components/student/goals-section'
import { InsightsCard } from '@/components/student/insights-card'
import { PerformanceComparison } from '@/components/student/performance-comparison'
import { ExportInsights } from '@/components/student/export-insights'
import { PersonalizedSuggestions } from '@/components/student/personalized-suggestions'
import { EducatorRequests } from '@/components/student/educator-requests'

export default function StudentDashboard() {
  const router = useRouter()
  const { user, student } = useAuth()

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.replace('/auth')
    }
  }, [user, router])

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader student={student} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <EducatorRequests />

        {/* Overview Cards */}
        <StudentOverviewCards student={student} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GrowthChart student={student} />
          </div>
          <div>
            <InsightsCard student={student} />
          </div>
        </div>

        {/* Performance Comparison & Export */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceComparison student={student} />
          </div>
          <div>
            <ExportInsights student={student} />
          </div>
        </div>

        {/* Subject Performance */}
        <SubjectPerformance student={student} />

        {/* Personalized Suggestions */}
        <PersonalizedSuggestions student={student} />

        {/* Goals Section */}
        <GoalsSection student={student} />
      </main>
    </div>
  )
}
6