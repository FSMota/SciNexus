'use client'

import { useCallback, useState } from 'react'

import { loginUser, registerUser, type LoginPayload, type RegisterPayload } from '@/services/auth-api'

export function useLoginMutation() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const data = await loginUser(payload)

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('token_type', data.token_type)
      }

      return data
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Erro ao conectar ao servidor'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { login, isSubmitting, error, setError }
}

export function useRegisterMutation() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await registerUser(payload)
    } catch (registerError) {
      const message = registerError instanceof Error ? registerError.message : 'Erro ao conectar ao servidor'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { register, isSubmitting, error, setError }
}