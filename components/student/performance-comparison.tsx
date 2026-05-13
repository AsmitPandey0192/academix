'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { mockStudents } from '@/lib/mock-data'
import type { Student } from '@/lib/mock-data'

export function PerformanceComparison({ student }: { student: Student }) {
  const [showComparison, setShowComparison] = useState(false)

  const classAverage = Math.round(
    mockStudents.reduce((sum, s) => sum + s.currentGrade, 0) / mockStudents.length
  )

  const topPerformer = mockStudents.reduce((best, current) =>
    current.currentGrade > best.currentGrade ? current : best
  )

  const data = [
    {
      name: 'You',
      score: student.currentGrade,
      predicted: student.predictedGrade,
    },
    {
      name: 'Class Average',
      score: classAverage,
      predicted: classAverage + 2,
    },
    {
      name: 'Top Performer',
      score: topPerformer.currentGrade,
      predicted: topPerformer.predictedGrade,
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>See how you compare to your peers</CardDescription>
        </div>
        <Button
          size="sm"
          variant={showComparison ? 'default' : 'outline'}
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'}
        </Button>
      </CardHeader>

      {showComparison && (
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar dataKey="score" fill="hsl(var(--primary))" name="Current Score" radius={[8, 8, 0, 0]} />
              <Bar dataKey="predicted" fill="hsl(var(--accent))" name="Predicted Score" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Position</p>
              <p className="text-lg font-bold text-primary">#{student.classRank}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Ahead of</p>
              <p className="text-lg font-bold text-accent">
                {((student.totalStudents - student.classRank) / student.totalStudents * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Gap to Top</p>
              <p className="text-lg font-bold text-secondary">
                {(topPerformer.currentGrade - student.currentGrade).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
