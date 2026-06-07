import type { CatalogEvent } from '@/lib/events'
import { catalogEventSchema, eventRelationSchema } from '../lib/schemas'

// 1. Aponta diretamente para o Microserviço de Eventos
const EVENT_SERVICE_URL = process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8001'

export type CreateEventPayload = {
  titulo: string
  categoria: CatalogEvent['category']
  data_inicio: string
  data_fim: string | null
  local: string
  status: string
  submissoes_abertas: boolean
  resumo: string
  tags: string[]
  numero_participantes: number
}

export type EventRelation = {
  id: number
  event_id: number
  user_id: number
  role: 'ouvinte' | 'pesquisador' | 'revisor' | 'organizador'
  status: 'pendente' | 'ativo' | 'cancelado' | 'rejeitado'
  approved_by_user_id: number | null
  created_at: string
  updated_at: string
}

// 2. Função padronizada para injetar o Token JWT
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string; detail?: string } | null
    return payload?.message || payload?.detail || fallback
  } catch {
    return fallback
  }
}

export async function updateEvent(eventId: number, payload: CreateEventPayload) {
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao atualizar o evento'))
  }

  // MUDANÇA AQUI: Retorne apenas o JSON bruto ou ignore o parse do Zod para essa rota
  return response.json() 
}

// Faça o mesmo para a função de criar:
export async function createEvent(payload: CreateEventPayload) {
  const response = await fetch(`${EVENT_SERVICE_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao criar evento'))
  }

  // MUDANÇA AQUI: Retorne apenas o JSON bruto
  return response.json() 
}


export async function subscribeToEvent(slug: string, userId: number): Promise<EventRelation> {
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${slug}/subscriptions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao realizar inscrição'))
  }

  return eventRelationSchema.parse(await response.json())
}


export async function deleteEvent(eventId: number): Promise<void> {
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao excluir o evento'))
  }
}