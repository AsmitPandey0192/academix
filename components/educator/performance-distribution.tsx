'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import type { PerformanceDistribution as Distribution, SubjectAverage } from '@/lib/educator-analytics'

export function PerformanceDistribution({
  distribution,
  subjectAverages,
}: {
  distribution: Distribution
  subjectAverages: SubjectAverage[]
}) {
  if (!subjectAverages.length) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Performance Charts</CardTitle>
          <CardDescription>Charts appear after CSV processing.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const data = [
    { name: 'Excellent', value: distribution.excellent, fill: 'hsl(var(--accent))' },
    { name: 'Good', value: distribution.good, fill: 'hsl(var(--primary))' },
    { name: 'Average', value: distribution.average, fill: 'hsl(var(--chart-4))' },
    { name: 'Needs Improvement', value: distribution.needsImprovement, fill: 'hsl(var(--destructive))' },
  ]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>Students grouped by performance level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-35} textAnchor="end" height={70} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Subject Averages</CardTitle>
          <CardDescription>Average score by subject from uploaded CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={subjectAverages} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
