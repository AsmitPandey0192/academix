'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText } from 'lucide-react'
import type { Student } from '@/lib/mock-data'

export function ExportInsights({ student }: { student: Student }) {
  const handleExportPDF = () => {
    // Mock export functionality
    const content = `
STUDENT PERFORMANCE REPORT
==========================================

Student Name: ${student.name}
Enrollment ID: ${student.enrollmentId}
Class Rank: #${student.classRank} out of ${student.totalStudents}

PERFORMANCE METRICS
Current Overall Grade: ${student.currentGrade}%
Predicted Overall Grade: ${student.predictedGrade}%
Attendance Rate: ${student.overallAttendance}%

SUBJECT BREAKDOWN
${student.subjects.map(s => `- ${s.name}: ${s.currentScore}% → ${s.predictedScore}% (${s.trend === 'up' ? '+' : ''}${s.trendPercent}%)`).join('\n')}

ACTIVE GOALS
${student.goals.map(g => `- ${g.title} (${g.currentProgress}% progress)`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `${student.name}_performance_report.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Export Report
        </CardTitle>
        <CardDescription>Download your comprehensive performance report</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground">
          Your complete academic insights including grades, trends, goals, and personalized recommendations.
        </p>
        <Button onClick={handleExportPDF} className="w-full gap-2">
          <Download className="w-4 h-4" />
          Export as Report
        </Button>
      </CardContent>
    </Card>
  )
}
