'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react'
import type { Student } from '@/lib/mock-data'

export function GoalsSection({ student }: { student: Student }) {
  const [showAddGoal, setShowAddGoal] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-accent" />
      case 'at-risk':
        return <AlertCircle className="w-5 h-5 text-destructive" />
      default:
        return <Clock className="w-5 h-5 text-primary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent/10 border-accent/20'
      case 'at-risk':
        return 'bg-destructive/10 border-destructive/20'
      default:
        return 'bg-primary/10 border-primary/20'
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Academic Goals</CardTitle>
          <CardDescription>Track your learning objectives</CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Goal</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Goal Form - Placeholder */}
        {showAddGoal && (
          <div className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3">
            <Input placeholder="Goal title (e.g., Achieve 90+ in Math)" />
            <Input type="number" placeholder="Target grade" min="0" max="100" />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Create Goal
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {student.goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border ${getStatusColor(goal.status)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getStatusIcon(goal.status)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{goal.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: {goal.targetGrade}% • Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-sm font-semibold text-foreground">
                        {goal.currentProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          goal.status === 'completed'
                            ? 'bg-accent'
                            : goal.status === 'at-risk'
                              ? 'bg-destructive'
                              : 'bg-primary'
                        }`}
                        style={{ width: `${goal.currentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {student.goals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No goals yet. Create one to track your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
