'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerFormSchema, type RegisterFormValues } from '../../../lib/schemas'
import { useRegisterMutation } from '@/hooks/useAuthMutations'

const fieldClassName = 'h-11 border-border bg-background/70 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isSubmitting, error, setError } = useRegisterMutation()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null)

    try {
      await register(values)
      form.reset()
      router.push('/login')
    } catch {
      return
    }
  })

  return (
    <AuthShell title="SciNexus" description="The repository for collaborative scientific discovery.">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Full Name</label>
          <Input
            type="text"
            placeholder="Your full name"
            className={fieldClassName}
            aria-invalid={Boolean(form.formState.errors.full_name)}
            {...form.register('full_name')}
          />
          {form.formState.errors.full_name?.message ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.full_name.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Username</label>
          <Input
            type="text"
            placeholder="Your username"
            className={fieldClassName}
            aria-invalid={Boolean(form.formState.errors.username)}
            {...form.register('username')}
          />
          {form.formState.errors.username?.message ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.username.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Institutional Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
            <Input
              type="email"
              placeholder="name@institution.edu"
              className={`${fieldClassName} pl-10`}
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email?.message ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
            <Input
              type="password"
              placeholder="••••••••"
              className={`${fieldClassName} pl-10`}
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register('password')}
            />
          </div>
          {form.formState.errors.password?.message ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p> : null}
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>

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
    </AuthShell>
  )
}