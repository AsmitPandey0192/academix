'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, BookOpen, Users, Clock } from 'lucide-react'
import type { Student } from '@/lib/mock-data'

export function PersonalizedSuggestions({ student }: { student?: Student | null }) {
  // Handle undefined student
  if (!student) {
    return null
  }

  // Generate suggestions based on student data
  const suggestions = []

  // Check performance in each subject
  const lowestSubject = student.subjects.reduce((lowest, current) =>
    current.predictedScore < lowest.predictedScore ? current : lowest
  )

  if (lowestSubject.predictedScore < 80) {
    suggestions.push({
      icon: BookOpen,
      title: `Focus on ${lowestSubject.name}`,
      description: `Your predicted score in ${lowestSubject.name} is ${lowestSubject.predictedScore}%. Consider dedicating more study time to this subject.`,
      type: 'focus',
    })
  }

  // Check attendance
  if (student.overallAttendance < 90) {
    suggestions.push({
      icon: Clock,
      title: 'Improve Your Attendance',
      description: `Your attendance rate is ${student.overallAttendance}%. Regular attendance can significantly boost your grades.`,
      type: 'attendance',
    })
  }

  // Check participation
  const avgParticipation = Math.round(
    student.subjects.reduce((sum, s) => sum + s.participation, 0) / student.subjects.length
  )

  if (avgParticipation < 85) {
    suggestions.push({
      icon: Users,
      title: 'Increase Class Participation',
      description: `Your average participation is ${avgParticipation}%. Active engagement helps reinforce learning.`,
      type: 'participation',
    })
  }

  // Top performer suggestion
  const bestSubject = student.subjects.reduce((best, current) =>
    current.predictedScore > best.predictedScore ? current : best
  )

  if (bestSubject.predictedScore >= 90) {
    suggestions.push({
      icon: Lightbulb,
      title: `You Excel in ${bestSubject.name}`,
      description: `Great work! Your strength in ${bestSubject.name} shows your potential. Help peers in this subject.`,
      type: 'achievement',
    })
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'focus':
        return 'bg-primary/20 text-primary'
      case 'attendance':
        return 'bg-destructive/20 text-destructive'
      case 'participation':
        return 'bg-secondary/20 text-secondary'
      case 'achievement':
        return 'bg-accent/20 text-accent'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-chart-4" />
          Personalized Insights
        </CardTitle>
        <CardDescription>Smart recommendations to improve your performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <div key={index} className="p-4 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                      <Badge className={`${getBadgeColor(suggestion.type)} text-xs`}>
                        {suggestion.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {suggestions.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm">
                You're doing great! No specific improvements needed at this time.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
