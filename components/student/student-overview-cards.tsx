'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Calendar, Users } from 'lucide-react'
import type { Student } from '@/lib/mock-data'

export function StudentOverviewCards({ student }: { student: Student }) {
  const improvementPercent = ((student.predictedGrade - student.currentGrade) / student.currentGrade) * 100

  const cards = [
    {
      title: 'Current Grade',
      value: `${student.currentGrade}%`,
      description: 'Your overall score',
      icon: Target,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Predicted Grade',
      value: `${student.predictedGrade}%`,
      description: 'Estimated final score',
      icon: TrendingUp,
      color: 'bg-accent/10 text-accent',
      trend: `+${improvementPercent.toFixed(1)}%`,
    },
    {
      title: 'Class Rank',
      value: `#${student.classRank}`,
      description: `Out of ${student.totalStudents} students`,
      icon: Users,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      title: 'Attendance',
      value: `${student.overallAttendance}%`,
      description: 'Class participation rate',
      icon: Calendar,
      color: 'bg-chart-4/10 text-chart-4',
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
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                {card.trend && <span className="text-xs text-accent font-semibold">{card.trend}</span>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
