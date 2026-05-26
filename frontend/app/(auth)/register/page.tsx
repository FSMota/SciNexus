'use client'

import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header com logo */}
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

        {/* Card com formulário */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="Your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="border-gray-300"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border-gray-300"
                  required
                  minLength={3}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@institution.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 border-gray-300"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 h-10"
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-xs text-gray-600 text-center mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to SciNexus{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
