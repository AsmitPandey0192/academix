'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Invite = {
  id: string
  studentEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export function StudentGroupManager() {
  const [studentEmail, setStudentEmail] = useState('')
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadInvites = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/educator/invites', { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not load invites')
      setInvites((data.invites ?? []) as Invite[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load invites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadInvites()
  }, [])

  const sendInvite = async () => {
    if (!studentEmail.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/educator/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ studentEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not send invite')
      setStudentEmail('')
      await loadInvites()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send invite')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Student Group Requests</CardTitle>
        <CardDescription>Add student by email and send join request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="student@email.com"
            value={studentEmail}
            onChange={e => setStudentEmail(e.target.value)}
          />
          <Button onClick={sendInvite} disabled={submitting || !studentEmail.trim()}>
            {submitting ? 'Adding...' : 'Add Student'}
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Requests</p>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          ) : invites.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests sent yet.</p>
          ) : (
            invites.slice(0, 8).map(invite => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-foreground">{invite.studentEmail}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(invite.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant={invite.status === 'accepted' ? 'default' : 'secondary'}>
                  {invite.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
