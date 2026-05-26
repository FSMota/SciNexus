'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/login')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.detail || 'Falha ao registrar'}`)
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="SciNexus"
      description="The repository for collaborative scientific discovery."
    >
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">Create Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="Your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="h-11 border-border bg-background/70 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-11 border-border bg-background/70 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-primary/60" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@institution.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 border-border bg-background/70 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-primary/60" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 border-border bg-background/70 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                {isLoading ? 'Creating...' : 'Create Account'}
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
