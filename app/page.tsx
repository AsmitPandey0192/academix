'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent } from '@/components/ui/card'
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

const features = [
  {
    icon: LineChart,
    title: 'Performance Trends',
    description: 'Track student progress with visual charts and predictive analytics.',
  },
  {
    icon: Users,
    title: 'Dual Dashboard',
    description: 'Separate views for students to track goals and educators to manage cohorts.',
  },
  {
    icon: Shield,
    title: 'Secure Auth',
    description: 'JWT sessions with HTTP-only cookies and protected routes.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Overview',
    description: 'Performance distribution, at-risk alerts, and class insights.',
  },
  {
    icon: BookOpen,
    title: 'Goals & Subjects',
    description: 'Students track goals and performance across multiple courses.',
  },
  {
    icon: GraduationCap,
    title: 'AI Insights',
    description: 'Gemini-powered narrative analysis of student data.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="AcademiX Logo" width={40} height={40} className="object-contain rounded-sm" />
            <span className="text-xl font-semibold tracking-tight">AcademiX</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild variant="ghost" size="sm">
                <Link href={user.role === 'student' ? '/dashboard/student' : '/dashboard/educator'}>
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
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Student Result Prediction</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              Predict student{' '}
              <span className="text-primary">performance</span>
              <br />
              before it matters
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered insights help educators identify at-risk students early.
              Transform raw data into actionable intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 gap-2">
                <Link href="/auth">
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="#features">Learn more</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-muted/30 border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful features</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to track, predict, and improve student outcomes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="transition-colors hover:bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '94%', label: 'Prediction Accuracy' },
                { value: '2.5x', label: 'Faster Identification' },
                { value: '500+', label: 'Students Tracked' },
                { value: '50+', label: 'Institutes Piloting' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 md:py-28 bg-muted/30 border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built by</h2>
              <p className="text-muted-foreground">Meet the team behind AcademiX</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { name: 'Asmit Panday', role: 'Lead Developer' },
                { name: 'Anmol Jain', role: 'Backend Engineer' },
                { name: 'Aditya Yaduvanshi', role: 'ML Engineer' },
                { name: 'Ansuman Partidar', role: 'Frontend Developer' },
              ].map((member) => (
                <Card key={member.name} className="text-center hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/10">
              <CardContent className="pt-10 pb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Create an account or use demo credentials to explore AcademiX.
                </p>
                <Button asChild size="lg" className="h-12 px-8 gap-2">
                  <Link href="/auth">
                    Start for free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-medium">AcademiX</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Student Result Prediction Platform
          </p>
        </div>
      </footer>
    </div>
  )
}