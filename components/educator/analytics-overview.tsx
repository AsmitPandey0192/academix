'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, AlertTriangle, Award, CalendarCheck, GraduationCap, BookX } from 'lucide-react'
import type { EducatorOverviewStats } from '@/lib/educator-analytics'

export function AnalyticsOverview({ overview }: { overview: EducatorOverviewStats }) {
  if (!overview.totalStudents) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Upload a CSV to generate class analytics.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const cards = [
    {
      title: 'Total Students',
      value: overview.totalStudents,
      description: 'Active learners tracked',
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Average Performance',
      value: `${overview.averagePerformance}%`,
      description: 'Class average score',
      icon: TrendingUp,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Average Attendance',
      value: `${overview.averageAttendance}%`,
      description: 'Student attendance average',
      icon: CalendarCheck,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Average CGPA',
      value: overview.averageCgpa.toFixed(2),
      description: 'Previous result CGPA',
      icon: GraduationCap,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      title: 'Top Performers',
      value: overview.topPerformers,
      description: 'Greater than 75 score',
      icon: Award,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      title: 'Total Backlogs',
      value: overview.totalBacklogs,
      description: 'Across uploaded records',
      icon: BookX,
      color: 'bg-chart-4/10 text-chart-4',
    },
    {
      title: 'At-Risk Students',
      value: overview.atRiskStudents,
      description: 'Below 45 threshold',
      icon: AlertTriangle,
      color: 'bg-destructive/10 text-destructive',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">{card.description}</CardDescription>
                </div>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
