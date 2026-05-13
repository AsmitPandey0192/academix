'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  GraduationCap,
  LineChart,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {user ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={user.role === 'student' ? '/dashboard/student' : '/dashboard/educator'}
            >
              Dashboard
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link href="/auth">Sign in</Link>
          </Button>
        )}
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[min(100vw,42rem)] h-[min(100vw,42rem)] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[min(100vw,36rem)] h-[min(100vw,36rem)] bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Student result prediction, built for clarity
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl">
            Predict performance.{' '}
            <span className="text-primary">Act early.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            AcademiX helps students and educators understand trends, spot risks, and focus on what
            improves outcomes—without drowning in spreadsheets.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth">
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Explore features</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="border-t border-border/60 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
              Everything you need in one place
            </h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-14">
              Role-based dashboards, clear visuals, and a secure sign-in flow—ready for demos and
              classroom pilots.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: LineChart,
                  title: 'Trends & forecasts',
                  body: 'See predicted grades and subject momentum at a glance.',
                },
                {
                  icon: Users,
                  title: 'Student & educator views',
                  body: 'Tailored layouts for learners and instructors.',
                },
                {
                  icon: Shield,
                  title: 'Session-based auth',
                  body: 'HTTP-only cookies and middleware-protected dashboards.',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics overview',
                  body: 'Distribution and roster insights for educators.',
                },
                {
                  icon: BookOpen,
                  title: 'Goals & subjects',
                  body: 'Track goals and performance across courses.',
                },
                {
                  icon: GraduationCap,
                  title: 'AcademiX identity',
                  body: 'Consistent branding and theme support across the app.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-sm"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to try it?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Use the demo accounts on the sign-in page or create a new account.
            </p>
            <Button asChild size="lg">
              <Link href="/auth">Go to sign in</Link>
            </Button>
          </div>
        </section>

        <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
          AcademiX · Student result prediction
        </footer>
      </main>
    </div>
  )
}
