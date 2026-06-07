import type { CategoryName } from '@/components/catalog/catalog-data'

export type BackendEvent = {
  id: number
  titulo: string
  categoria: CategoryName
  data_inicio: string
  data_fim: string | null
  local: string
  status: string
  submissoes_abertas: boolean
  numero_participantes: number
  destaque: boolean
  resumo: string
  tags: string[]
  created_at: string
  updated_at: string
}

export type CatalogEvent = {
  id: number
  slug: string
  title: string
  category: CategoryName
  date: string
  sortDate: string
  location: string
  data_inicio?: string; // Opcional para não quebrar o catálogo
  data_fim?: string | null;
  status: string
  submissionsOpen: boolean
  attendees: string
  highlight: boolean
  summary: string
  tags: string[]
}

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function slugify(text?: string) {
  // Se o texto vier vazio ou undefined, retorna uma string vazia e evita o erro
  if (!text) return '' 

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // ... restante da sua função (provavelmente replace de espaços por hifens)
}

function formatDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = monthLabels[date.getMonth()] ?? ''
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

function formatDateRange(startDate: string, endDate: string | null) {
  if (!endDate || endDate === startDate) {
    return formatDate(startDate)
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export function mapBackendEvent(event: BackendEvent): CatalogEvent {
  return {
    id: event.id,
    slug: slugify(event.titulo),
    title: event.titulo,
    category: event.categoria,
    date: formatDateRange(event.data_inicio, event.data_fim),
    sortDate: event.created_at,
    location: event.local,
    status: event.status,
    submissionsOpen: event.submissoes_abertas,
    attendees: `${event.numero_participantes} participante${event.numero_participantes === 1 ? '' : 's'}`,
    highlight: event.destaque,
    summary: event.resumo,
    tags: event.tags,
  }
}

// Importe ou defina a URL do serviço e a função de headers no topo do arquivo
const EVENT_SERVICE_URL = process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8001'

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

export async function fetchCatalogEvents(): Promise<CatalogEvent[]> {
  const response = await fetch(`${EVENT_SERVICE_URL}/events`, { 
    headers: getAuthHeaders(),
    cache: 'no-store' 
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os eventos')
  }

  const rawEvents = await response.json()

  // Fazemos o map para traduzir a lista toda
  return rawEvents.map((rawData: any) => ({
    id: rawData.id,
    // ATENÇÃO AQUI: Passamos rawData.titulo para o slugify, pois é o nome do campo no Python!
    slug: rawData.slug || slugify(rawData.titulo), 
    title: rawData.titulo,
    category: rawData.categoria,
    date: new Date(rawData.data_inicio).toLocaleDateString('pt-BR'),
    sortDate: rawData.data_inicio,
    location: rawData.local,
    status: rawData.status,
    submissionsOpen: rawData.submissoes_abertas,
    attendees: String(rawData.numero_participantes || 0),
    highlight: rawData.destaque || false,
    summary: rawData.resumo,
    tags: rawData.tags,
  }))
}


export async function fetchCatalogEventBySlug(slug: string): Promise<CatalogEvent | null> {
  // 1. Bate direto no FastAPI
  const response = await fetch(`${EVENT_SERVICE_URL}/events/${slug}`, { 
    headers: getAuthHeaders(),
    cache: 'no-store' 
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Não foi possível carregar o evento')
  }

  // Pegamos a resposta crua em português gerada pelo seu modelo Pydantic
  const rawData = await response.json()

  // 2. Traduzimos os campos para os cards do catálogo E preservamos as datas brutas!
  return {
    id: rawData.id,
    slug: rawData.slug || slug, // Fallback de segurança
    title: rawData.titulo,
    category: rawData.categoria,
    
    // Para exibição no catálogo (Ex: 15/10/2026). Adapte caso use outra formatação.
    date: new Date(rawData.data_inicio).toLocaleDateString('pt-BR'), 
    sortDate: rawData.data_inicio,
    
    location: rawData.local,
    status: rawData.status,
    submissionsOpen: rawData.submissoes_abertas,
    attendees: String(rawData.numero_participantes || 0), // CatalogEvent espera string aqui
    highlight: rawData.destaque || false,
    summary: rawData.resumo,
    tags: rawData.tags,

    // === A MÁGICA PARA O FORMULÁRIO DE EDIÇÃO ===
    // Esses campos não são exigidos pelo catálogo, mas viajam "de carona" no objeto 
    // para que a sua página de edição possa ler os valores exatos!
    data_inicio: rawData.data_inicio,
    data_fim: rawData.data_fim,

  } as CatalogEvent
}