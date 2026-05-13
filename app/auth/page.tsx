import { Suspense } from 'react'
import { AuthPageContent } from './auth-page-content'

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  )
}
