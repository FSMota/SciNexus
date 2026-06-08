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

// 1. Função de erro turbinada para entender o FastAPI
async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = await response.json();
    
    // Se o FastAPI retornar um erro 422 de validação (detail como array)
    if (payload?.detail && Array.isArray(payload.detail)) {
      // Extrai apenas a mensagem de erro da API e junta com vírgula
      return payload.detail.map((err: any) => err.msg).join(', ');
    }
    
    // Erros normais (400, 401, 403, 409) onde detail é string
    return payload?.message || payload?.detail || fallback;
  } catch {
    return fallback;
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthTokenResponse> {
  // 2. Voltamos a enviar o payload bruto (JSON) exatamente como o seu Pydantic espera
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