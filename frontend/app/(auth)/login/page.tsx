'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-black mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">SciNexus</h1>
          <p className="text-sm text-gray-500">
            The repository for collaborative scientific discovery.
          </p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="name@institution.edu"
                        className="pl-10 border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="••••••••"
                        className="pl-10 border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-gray-800 h-10"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-white text-gray-500">
                      OR CONTINUE WITH
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700"
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

                <p className="text-xs text-gray-500 text-center mt-6">
                  By continuing, you agree to SciNexus{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="full_name"
                      value={signupData.full_name}
                      onChange={handleSignupChange}
                      placeholder="Your name"
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Username
                    </label>
                    <Input
                      type="text"
                      name="username"
                      value={signupData.username}
                      onChange={handleSignupChange}
                      placeholder="Your username"
                      className="border-gray-300"
                      required
                      minLength={3}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="name@institution.edu"
                        className="pl-10 border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="••••••••"
                        className="pl-10 border-gray-300"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-gray-800 h-10"
                  >
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
