'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Invite = {
  id: string
  educatorName: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

type Educator = {
  educatorId: string
  educatorName: string
  educatorEmail: string
}

export function EducatorRequests() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [educators, setEducators] = useState<Educator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/student/invites', { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not load educator requests')
      setInvites((data.invites ?? []) as Invite[])
      setEducators((data.educators ?? []) as Educator[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load educator requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const acceptInvite = async (inviteId: string) => {
    setAcceptingId(inviteId)
    setError(null)
    try {
      const res = await fetch(`/api/student/invites/${inviteId}/accept`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not accept request')
      await loadData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not accept request')
    } finally {
      setAcceptingId(null)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Educator Group Requests</CardTitle>
        <CardDescription>Accept educator requests to join their group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-2">
          <p className="text-sm font-medium">Pending Requests</p>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          ) : invites.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            invites.map(invite => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-foreground">{invite.educatorName}</p>
                  <p className="text-xs text-muted-foreground">
                    Requested on {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => acceptInvite(invite.id)}
                  disabled={acceptingId === invite.id}
                >
                  {acceptingId === invite.id ? 'Accepting...' : 'Accept'}
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Joined Educators</p>
          {educators.length === 0 ? (
            <p className="text-sm text-muted-foreground">No educator groups joined yet.</p>
          ) : (
            educators.map(educator => (
              <div
                key={educator.educatorId}
                className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-foreground">{educator.educatorName}</p>
                  <p className="text-xs text-muted-foreground">{educator.educatorEmail}</p>
                </div>
                <Badge>Joined</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
