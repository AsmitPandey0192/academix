'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth, type UserRole } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { AlertCircle, ArrowLeft, GraduationCap, Users } from 'lucide-react'

export function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, isLoading } = useAuth()

  const [tab, setTab] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState('')

  const redirectAfterAuth = (r: UserRole) => {
    const next = searchParams.get('next')
    if (next && next.startsWith('/')) {
      router.push(next)
      return
    }
    router.push(r === 'student' ? '/dashboard/student' : '/dashboard/educator')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password, role)
      redirectAfterAuth(role)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(name.trim(), email, password, role)
      redirectAfterAuth(role)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </Button>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-balance">AcademiX</h1>
          <p className="text-muted-foreground mt-2">Predict. Track. Improve.</p>
        </div>

        <Card className="border border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Account</CardTitle>
            <CardDescription>Sign in or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={tab}
              onValueChange={v => {
                setTab(v as 'signin' | 'register')
                setError('')
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    role === 'student'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <GraduationCap className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Student</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('educator')}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    role === 'educator'
                      ? 'border-secondary bg-secondary/10'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="text-sm font-medium">Educator</p>
                </button>
              </div>

              <TabsContent value="signin" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@school.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  {error && tab === 'signin' && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full h-11 font-medium"
                    variant={role === 'student' ? 'default' : 'secondary'}
                  >
                    {isLoading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Alex Johnson"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@school.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  {role === 'educator' && (
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="e.g. Mathematics, Physics"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="reg-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  {error && tab === 'register' && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading || !name.trim() || !email || password.length < 8}
                    className="w-full h-11 font-medium"
                    variant={role === 'student' ? 'default' : 'secondary'}
                  >
                    {isLoading ? 'Creating account…' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Demo accounts</p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <p className="font-medium text-primary mb-1">Student</p>
                  <p className="text-muted-foreground">alex.johnson@student.edu · password123</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <p className="font-medium text-secondary mb-1">Educator</p>
                  <p className="text-muted-foreground">robert.anderson@edu.school · password123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Secured with JWT session cookie ·{' '}
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">
            Back to landing
          </Link>
        </p>
      </div>
    </div>
  )
}
