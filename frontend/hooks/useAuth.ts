import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

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
      const response = await fetch('http://localhost:8001/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const logout = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        await fetch('http://localhost:8001/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
