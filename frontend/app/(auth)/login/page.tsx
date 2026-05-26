'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AuthShell } from '@/components/auth/auth-shell'
import { api } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [signupData, setSignupData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await api.post('/auth/login', loginData)

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('token_type', data.token_type)
        router.push('/dashboard')
      } else {
        alert('Email ou senha inválidos')
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await api.post('/auth/register', signupData)

      if (response.ok) {
        alert('Conta criada com sucesso! Faça login para continuar.')
        setSignupData({ full_name: '', username: '', email: '', password: '' })
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
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-muted p-1 mb-6">
                <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-primary/60" />
                      <Input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="name@institution.edu"
                        className="h-11 border-border bg-background/70 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-xs font-medium text-primary hover:text-primary/80"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-primary/60" />
                      <Input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="••••••••"
                        className="h-11 border-border bg-background/70 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      OR CONTINUE WITH
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-xl border-border bg-background/70 text-foreground hover:bg-muted hover:text-foreground"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  Single Sign-On (SSO)
                </Button>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  By continuing, you agree to SciNexus{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="full_name"
                      value={signupData.full_name}
                      onChange={handleSignupChange}
                      placeholder="Your name"
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
                      value={signupData.username}
                      onChange={handleSignupChange}
                      placeholder="Your username"
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
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="name@institution.edu"
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
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="••••••••"
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
