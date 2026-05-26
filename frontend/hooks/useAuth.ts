import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { api } from '@/services/api'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await api.get('/auth/me')

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('token_type')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCurrentUser()
    })
  }, [fetchCurrentUser])

  const logout = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('token_type')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }, [router])

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refetch: fetchCurrentUser,
  }
}
