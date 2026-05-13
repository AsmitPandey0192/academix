'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle2, FileText } from 'lucide-react'
import type { EducatorAnalyticsPayload } from '@/lib/educator-analytics'

export function DatasetUpload({
  onComplete,
}: {
  onComplete: (payload: EducatorAnalyticsPayload) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setSuccessMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/educator/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed')
      }
      onComplete(data as EducatorAnalyticsPayload)
      setSuccessMessage('Dataset processed successfully. Dashboard updated.')
      setSelectedFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Dataset Management</CardTitle>
        <CardDescription>Upload student performance data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-3">
          <label htmlFor="file-upload" className="block">
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
              <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-1">Drop your CSV file</p>
              <p className="text-xs text-muted-foreground">Or click to browse from your computer</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-sm text-foreground">{selectedFile.name}</span>
            </div>
          )}

          <Button
            className="w-full gap-2"
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading & analyzing...' : 'Upload Dataset'}
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {successMessage}
          </div>
        )}

        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
          <p className="text-xs text-foreground">
            Expected CSV columns: <span className="font-medium">name, enrollment_number, attendance, mst1, mst2, previous_semester, overall_cgpa, previous_sem_scgpa, skill_assignments, assignment_submissions, backlog_count</span> (MST marks are out of 20; supports common header aliases) + optional subject score columns.
          </p>
          <p className="text-xs text-muted-foreground">Set <span className="font-medium">GEMINI_API_KEY</span> in your <span className="font-medium">.env</span> to enable AI narrative insights.</p>
        </div>
      </CardContent>
    </Card>
  )
}
