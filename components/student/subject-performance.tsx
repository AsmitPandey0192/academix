'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Student } from '@/lib/mock-data'

export function SubjectPerformance({ student }: { student: Student }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Current vs. Predicted scores across all subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {student.subjects.map((subject) => {
            const trendIcon =
              subject.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-accent" />
              ) : subject.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-destructive" />
              ) : (
                <Minus className="w-4 h-4 text-muted-foreground" />
              )

            const improvement = subject.predictedScore - subject.currentScore

            return (
              <div key={subject.id} className="p-4 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{subject.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.assignments} assignments • {subject.tests} tests
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {trendIcon}
                    <span className="text-xs font-semibold text-muted-foreground">
                      {subject.trendPercent > 0 ? '+' : ''}{subject.trendPercent}%
                    </span>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Current Score</span>
                      <span className="text-sm font-semibold text-foreground">{subject.currentScore}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${subject.currentScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Predicted Score</span>
                      <span className="text-sm font-semibold text-accent">{subject.predictedScore}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all"
                        style={{ width: `${subject.predictedScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground">Participation</p>
                    <p className="text-lg font-bold text-foreground">{subject.participation}%</p>
                  </div>
                  <div className="text-center flex-1 border-l border-border/50">
                    <p className="text-xs text-muted-foreground">Improvement</p>
                    <p className={`text-lg font-bold ${improvement >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {improvement > 0 ? '+' : ''}{improvement}%
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
