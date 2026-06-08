'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loginFormSchema, registerFormSchema, type LoginFormValues, type RegisterFormValues } from '../../../lib/schemas'
import { useLoginMutation, useRegisterMutation } from '@/hooks/useAuthMutations'

const fieldClassName = 'h-11 border-border bg-background/70 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null)

  const { login, isSubmitting: isLoginLoading, error: loginError, setError: setLoginError } = useLoginMutation()
  const { register: registerUser, isSubmitting: isSignupLoading, error: signupError, setError: setSignupError } = useRegisterMutation()

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const handleLoginSubmit = loginForm.handleSubmit(async (values) => {
    setLoginError(null)

    try {
      await login(values)
      router.push('/dashboard')
    } catch {
      return
    }
  })

  const handleSignupSubmit = signupForm.handleSubmit(async (values) => {
    setSignupError(null)
    setSignupSuccess(null)

    try {
      await registerUser(values)
      signupForm.reset()
      setSignupSuccess('Conta criada com sucesso. Faça login para continuar.')
      setActiveTab('login')
    } catch {
      return
    }
  })

  return (
    <AuthShell title="SciNexus" description="The repository for collaborative scientific discovery.">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
        <TabsList className="mb-6 grid h-12 w-full grid-cols-2 rounded-2xl bg-muted p-1">
          <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{loginError}</div>
            ) : null}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                <Input
                  type="email"
                  placeholder="name@institution.edu"
                  className={`${fieldClassName} pl-10`}
                  aria-invalid={Boolean(loginForm.formState.errors.email)}
                  {...loginForm.register('email')}
                />
              </div>
              {loginForm.formState.errors.email?.message ? <p className="mt-1 text-xs text-destructive">{loginForm.formState.errors.email.message}</p> : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Password</label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`${fieldClassName} pl-10`}
                  aria-invalid={Boolean(loginForm.formState.errors.password)}
                  {...loginForm.register('password')}
                />
              </div>
              {loginForm.formState.errors.password?.message ? <p className="mt-1 text-xs text-destructive">{loginForm.formState.errors.password.message}</p> : null}
            </div>

            <Button type="submit" disabled={isLoginLoading} className="h-11 w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              {isLoginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">OR CONTINUE WITH</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="h-11 w-full rounded-xl border-border bg-background/70 text-foreground hover:bg-muted hover:text-foreground">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Single Sign-On (SSO)
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to SciNexus{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {signupError || signupSuccess ? (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${signupError ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
                {signupError || signupSuccess}
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Full Name</label>
              <Input
                type="text"
                placeholder="Your full name"
                className={fieldClassName}
                aria-invalid={Boolean(signupForm.formState.errors.full_name)}
                {...signupForm.register('full_name')}
              />
              {signupForm.formState.errors.full_name?.message ? <p className="mt-1 text-xs text-destructive">{signupForm.formState.errors.full_name.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Username</label>
              <Input
                type="text"
                placeholder="Your username"
                className={fieldClassName}
                aria-invalid={Boolean(signupForm.formState.errors.username)}
                {...signupForm.register('username')}
              />
              {signupForm.formState.errors.username?.message ? <p className="mt-1 text-xs text-destructive">{signupForm.formState.errors.username.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                <Input
                  type="email"
                  placeholder="name@institution.edu"
                  className={`${fieldClassName} pl-10`}
                  aria-invalid={Boolean(signupForm.formState.errors.email)}
                  {...signupForm.register('email')}
                />
              </div>
              {signupForm.formState.errors.email?.message ? <p className="mt-1 text-xs text-destructive">{signupForm.formState.errors.email.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`${fieldClassName} pl-10`}
                  aria-invalid={Boolean(signupForm.formState.errors.password)}
                  {...signupForm.register('password')}
                />
              </div>
              {signupForm.formState.errors.password?.message ? <p className="mt-1 text-xs text-destructive">{signupForm.formState.errors.password.message}</p> : null}
            </div>

            <Button type="submit" disabled={isSignupLoading} className="h-11 w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              {isSignupLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </TabsContent>
      </Tabs>
    </AuthShell>
  )
}
