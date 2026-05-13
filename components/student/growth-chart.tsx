'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Student } from '@/lib/mock-data'

export function GrowthChart({ student }: { student: Student }) {
  // Generate mock progress data over time
  const data = [
    { month: 'Jan', score: student.currentGrade - 8 },
    { month: 'Feb', score: student.currentGrade - 5 },
    { month: 'Mar', score: student.currentGrade - 2 },
    { month: 'Apr', score: student.currentGrade },
    { month: 'May', score: student.predictedGrade - 1 },
    { month: 'Jun', score: student.predictedGrade },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Grade Progression</CardTitle>
        <CardDescription>Your performance trend over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" domain={[60, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Grade Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
