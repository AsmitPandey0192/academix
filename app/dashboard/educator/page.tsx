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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Users } from 'lucide-react'
import type { EducatorAnalyticsPayload, StudentCredential } from '@/lib/educator-analytics'
import type { StudentCredential as UserStoreCredential } from '@/lib/user-store'

type CombinedCredential = StudentCredential | UserStoreCredential

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

interface CredentialDownloadProps {
  credentials: CombinedCredential[]
}

function CredentialDownload({ credentials }: CredentialDownloadProps) {
  const downloadCsv = async () => {
    try {
      const response = await fetch('/api/educator/credentials')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `student-credentials-${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download credentials:', error)
    }
  }

  if (credentials.length === 0) {
    return null
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Student Credentials
        </CardTitle>
        <CardDescription>
          {credentials.length} student account(s) generated from CSV upload
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {credentials.slice(0, 5).map((cred, i) => (
            <div key={i} className="flex justify-between text-sm bg-background/50 rounded-lg px-3 py-2">
              <span className="font-medium">{cred.studentName}</span>
              <span className="text-muted-foreground">{cred.studentEmail}</span>
            </div>
          ))}
          {credentials.length > 5 && (
            <p className="text-sm text-muted-foreground text-center">
              +{credentials.length - 5} more students
            </p>
          )}
        </div>
        <Button onClick={downloadCsv} className="w-full gap-2">
          <Download className="w-4 h-4" />
          Download All Credentials (CSV)
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Save this file securely - these are one-time passwords for your students
        </p>
      </CardContent>
    </Card>
  )
}

export default function EducatorDashboard() {
  const router = useRouter()
  const { user, educator } = useAuth()
  const [analytics, setAnalytics] = useState<EducatorAnalyticsPayload>(EMPTY_ANALYTICS)
  const [credentials, setCredentials] = useState<CombinedCredential[]>([])

  useEffect(() => {
    if (!user || user.role !== 'educator') {
      router.replace('/auth')
    }
  }, [user, router])

  const handleAnalyticsComplete = (data: EducatorAnalyticsPayload & { credentials?: CombinedCredential[] }) => {
    setAnalytics(data)
    if (data.credentials && Array.isArray(data.credentials)) {
      setCredentials(prev => [...prev, ...data.credentials!])
    }
  }

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

        {/* Credentials Section */}
        {credentials.length > 0 && <CredentialDownload credentials={credentials} />}

        {/* Analytics Overview */}
        <AnalyticsOverview overview={analytics.overview} />

        {/* Class Insights */}
        <ClassInsights overview={analytics.overview} ai={analytics.ai} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6">
          <DatasetUpload onComplete={handleAnalyticsComplete} />
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