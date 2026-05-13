'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrendingUp, Users, AlertTriangle } from 'lucide-react'
import type { AiInsights, EducatorOverviewStats } from '@/lib/educator-analytics'

export function ClassInsights({
  overview,
  ai,
}: {
  overview: EducatorOverviewStats
  ai: AiInsights
}) {
  if (!overview.totalStudents) {
    return null
  }

  const improvementRate = Math.round((overview.topPerformers / overview.totalStudents) * 100)

  const atRiskPercentage = Math.round((overview.atRiskStudents / overview.totalStudents) * 100)

  const insights = [
    {
      icon: TrendingUp,
      title: 'Strong Performers',
      value: `${improvementRate}%`,
      description: `${overview.topPerformers} students scoring above 75`,
      color: 'text-accent',
    },
    {
      icon: Users,
      title: 'Average Class Performance',
      value: `${overview.averagePerformance}%`,
      description: 'Overall class grade average',
      color: 'text-primary',
    },
    {
      icon: AlertTriangle,
      title: 'At-Risk Students',
      value: `${atRiskPercentage}%`,
      description: `${overview.atRiskStudents} students below threshold`,
      color: 'text-destructive',
    },
  ]

  return (
    <>
      <Card className="border-border/50 mb-6">
        <CardHeader>
          <CardTitle>Gemini Insights</CardTitle>
          <CardDescription>{ai.classSummary}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Key Insights</p>
            <ul className="space-y-2 text-muted-foreground">
              {ai.keyInsights.map((insight, idx) => (
                <li key={idx}>- {insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Recommendations</p>
            <ul className="space-y-2 text-muted-foreground">
              {ai.recommendations.map((item, idx) => (
                <li key={idx}>- {item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{insight.title}</p>
                    <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${insight.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actionable Alerts */}
      {atRiskPercentage > 15 && (
        <Alert className="border-destructive/50 bg-destructive/5 mb-6">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {overview.atRiskStudents} students are at risk. Consider personalized intervention strategies.
          </AlertDescription>
        </Alert>
      )}

      {improvementRate > 50 && (
        <Alert className="border-accent/50 bg-accent/5">
          <TrendingUp className="h-4 w-4 text-accent" />
          <AlertDescription className="text-accent">
            Your class is showing strong performance with {improvementRate}% achieving excellent grades!
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
