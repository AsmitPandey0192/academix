'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import type { ProcessedStudent } from '@/lib/educator-analytics'

export function StudentRosterTable({ students }: { students: ProcessedStudent[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-accent bg-accent/10'
    if (grade >= 80) return 'text-primary bg-primary/10'
    if (grade >= 70) return 'text-chart-4 bg-chart-4/10'
    return 'text-destructive bg-destructive/10'
  }

  const getRiskVariant = (risk: ProcessedStudent['riskLevel']) => {
    if (risk === 'high') return 'destructive'
    if (risk === 'medium') return 'secondary'
    return 'default'
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Processed Student Roster</CardTitle>
        <CardDescription>Live results from uploaded CSV + model-assisted analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, student ID, or enrollment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Enrollment No</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Attendance</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">MST 1 (/20)</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">MST 2 (/20)</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Prev Sem</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">CGPA</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Sem SCGPA</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Skill Assignments</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Assignment Submissions</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Backlogs</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Current Grade</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Predicted Grade</th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                return (
                  <tr
                    key={student.studentId}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{student.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{student.enrollmentNumber}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.attendance}%</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.mst1Score}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.mst2Score}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.previousSemester}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.overallCgpa.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.previousSemesterScgpa.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.skillAssignments}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.assignmentSubmissions}</td>
                    <td className="py-3 px-4 text-center text-foreground">{student.backlogCount}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${getGradeColor(student.currentGrade)}`}>
                      {student.currentGrade}%
                    </td>
                    <td className={`py-3 px-4 text-center font-semibold ${getGradeColor(student.predictedGrade)}`}>
                      {student.predictedGrade}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={getRiskVariant(student.riskLevel)}>{student.riskLevel}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
