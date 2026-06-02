import { api } from '@/services/api'
import { authTokenSchema } from '../lib/schemas'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  full_name: string
  username: string
  email: string
  password: string
}

export type AuthTokenResponse = {
  access_token: string
  token_type: string
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string; detail?: string } | null
    return payload?.message || payload?.detail || fallback
  } catch {
    return fallback
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthTokenResponse> {
  const response = await api.post('/auth/login', payload)

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Email ou senha inválidos'))
  }

  return authTokenSchema.parse(await response.json())
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  const response = await api.post('/auth/register', payload)

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao registrar'))
  }
}