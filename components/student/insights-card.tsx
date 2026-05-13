'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, ArrowUpRight } from 'lucide-react'
import type { Student } from '@/lib/mock-data'

export function InsightsCard({ student }: { student: Student }) {
  const bestSubject = student.subjects.reduce((best, current) =>
    current.predictedScore > best.predictedScore ? current : best
  )
  
  const needsWork = student.subjects.reduce((worst, current) =>
    current.predictedScore < worst.predictedScore ? current : worst
  )

  const avgParticipation = Math.round(
    student.subjects.reduce((sum, s) => sum + s.participation, 0) / student.subjects.length
  )

  const insights = [
    {
      label: 'Strongest Subject',
      value: bestSubject.name,
      stat: `${bestSubject.predictedScore}%`,
    },
    {
      label: 'Focus Area',
      value: needsWork.name,
      stat: `${needsWork.predictedScore}%`,
    },
    {
      label: 'Participation',
      value: 'Excellent',
      stat: `${avgParticipation}%`,
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-chart-4" />
          <div>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-between justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
            <div>
              <p className="text-xs text-muted-foreground">{insight.label}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{insight.value}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{insight.stat}</p>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex gap-3">
            <ArrowUpRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Focus on {needsWork.name} to maximize your predicted grade improvement.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
