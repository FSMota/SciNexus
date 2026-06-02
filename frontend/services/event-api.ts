import type { CatalogEvent } from '@/lib/events'
import { catalogEventSchema, eventRelationSchema } from '../lib/schemas'

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

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string; detail?: string } | null
    return payload?.message || payload?.detail || fallback
  } catch {
    return fallback
  }
}

export async function createEvent(payload: CreateEventPayload): Promise<CatalogEvent> {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao criar evento'))
  }

  return catalogEventSchema.parse(await response.json())
}

export async function subscribeToEvent(slug: string, userId: number): Promise<EventRelation> {
  const response = await fetch(`/api/events/${slug}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao realizar inscrição'))
  }

  return eventRelationSchema.parse(await response.json())
}