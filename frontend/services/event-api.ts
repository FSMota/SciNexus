import type { CatalogEvent } from '@/lib/events'

// 1. Aponta diretamente para o Microserviço de Eventos
const EVENT_SERVICE_URL = process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8001'

export type CreateEventPayload = {
  titulo: string
  categoria: CatalogEvent['category']
  data_inicio: string
  data_fim: string | null,
  criador_id: number,
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


// Adicione isto no seu services/event-api.ts
export async function subscribeToEvent(eventId: number, userId: number): Promise<void> {
  // Bate na rota de subscrição do seu FastAPI (definida no event_relation.py)
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${eventId}/subscriptions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }), // O payload SubscriptionCreate espera isso
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao realizar inscrição'))
  }
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

// Atualize ou adicione no seu event-api.ts
export async function getMyReviewerRequests(userId: number): Promise<EventRelation[]> {
  // Chamamos a nova rota: /events/user/{user_id}?role=revisor
  const response = await fetch(`${EVENT_SERVICE_URL}/events/user/${userId}?role=revisor`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao carregar histórico de revisor'))
  }

  return response.json()
}

// 1. Solicitar vaga de revisor (Usa a sua rota POST /review-applications)
export async function requestReviewerRole(eventId: number, userId: number, tags: string[]): Promise<EventRelation> {
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${eventId}/review-applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    // O seu Pydantic (ReviewerApplicationCreate) espera o user_id no corpo
    body: JSON.stringify({ user_id: userId, tags }), 
  })

  if (!response.ok) throw new Error(await readErrorMessage(response, 'Falha ao solicitar vaga'))
  return response.json()
}

// 2. Checar se já solicitou (Usa a sua rota GET de listagem com filtros na query string!)
export async function checkReviewerStatus(eventId: number, userId: number): Promise<boolean> {
  // A sua rota list_event_relations aceita query params, perfeito para isso:
  const response = await fetch(
    `${EVENT_SERVICE_URL}/events/${eventId}/relations?user_id=${userId}&role=revisor`, 
    { headers: getAuthHeaders() }
  )
  
  if (!response.ok) return false
  const data = await response.json()
  
  // Se o array voltar com algum item, significa que a relação existe!
  return data.length > 0 
}

// 3. (Para a tela do Organizador) Buscar todos os candidatos de um evento
export async function getEventReviewerCandidates(eventId: number): Promise<EventRelation[]> {
  const response = await fetch(
    `${EVENT_SERVICE_URL}/events/${eventId}/relations?role=revisor`, // Traz todos, independente do user_id
    { headers: getAuthHeaders() }
  )
  if (!response.ok) throw new Error('Falha ao buscar candidatos')
  return response.json()
}

// 4. (Para a tela do Organizador) Aprovar ou Rejeitar
export async function decideReviewerRole(
  eventId: number, 
  candidateUserId: number, 
  organizerUserId: number, 
  decision: 'approve' | 'reject'
): Promise<EventRelation> {
  // Bate nas suas rotas /{user_id}/approve ou /{user_id}/reject
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${eventId}/review-applications/${candidateUserId}/${decision}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    // O seu schema ReviewerDecisionCreate espera quem está aprovando
    body: JSON.stringify({ organizer_user_id: organizerUserId }), 
  })

  if (!response.ok) throw new Error(await readErrorMessage(response, `Falha ao ${decision === 'approve' ? 'aprovar' : 'rejeitar'} candidato`))
  return response.json()
}

export async function getMyOrganizedEvents(userId: number): Promise<EventRelation[]> {
  // Busca todas as relações do usuário onde o cargo é 'organizador'
  const response = await fetch(`${EVENT_SERVICE_URL}/events/user/${userId}?role=organizador`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Falha ao carregar eventos organizados')
  }

  return response.json()
}

export async function getMyRegistrations(userId: number): Promise<EventRelation[]> {
  // Busca todas as relações do usuário onde o cargo é 'ouvinte'
  const response = await fetch(`${EVENT_SERVICE_URL}/events/user/${userId}?role=ouvinte`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Falha ao carregar inscrições')
  }

  return response.json()
}