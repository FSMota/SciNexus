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
  status: string
  submissionsOpen: boolean
  attendees: string
  highlight: boolean
  summary: string
  tags: string[]
}

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
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

export async function fetchCatalogEvents(): Promise<CatalogEvent[]> {
  const response = await fetch('/api/events', { cache: 'no-store' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os eventos')
  }

  return (await response.json()) as CatalogEvent[]
}

export async function fetchCatalogEventBySlug(slug: string): Promise<CatalogEvent | null> {
  const response = await fetch(`/api/events/${slug}`, { cache: 'no-store' })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Não foi possível carregar o evento')
  }

  return (await response.json()) as CatalogEvent
}