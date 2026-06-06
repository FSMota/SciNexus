export type EventParticipationStore = {
  registrations?: Record<number, string[]>
  submissions?: Record<number, string[]>
  ownedEvents?: Record<number, string[]>
}

const STORAGE_KEY = 'scinexus:rbac'

function isClient() {
  return typeof window !== 'undefined'
}

function readRawStore(): EventParticipationStore {
  if (!isClient()) {
    return {}
  }

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as EventParticipationStore
  } catch {
    return {}
  }
}

function writeRawStore(store: EventParticipationStore) {
  if (!isClient()) {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function ensureUserList(store: EventParticipationStore, key: keyof EventParticipationStore, userId: number) {
  const nextStore = { ...store }
  const currentList = nextStore[key]?.[userId] || []

  nextStore[key] = {
    ...(nextStore[key] || {}),
    [userId]: currentList,
  }

  return nextStore
}

function appendUniqueSlug(store: EventParticipationStore, key: keyof EventParticipationStore, userId: number, slug: string) {
  const nextStore = ensureUserList(store, key, userId)
  const currentList = nextStore[key]?.[userId] || []

  nextStore[key] = {
    ...(nextStore[key] || {}),
    [userId]: Array.from(new Set([...currentList, slug])),
  }

  return nextStore
}

export function getEventParticipationStore(): EventParticipationStore {
  return readRawStore()
}

export function setEventParticipationStore(store: EventParticipationStore) {
  writeRawStore(store)
}

export function isEventRegistered(store: EventParticipationStore, userId: number, slug: string) {
  return (store.registrations?.[userId] || []).includes(slug)
}

export function isEventSubmitted(store: EventParticipationStore, userId: number, slug: string) {
  return (store.submissions?.[userId] || []).includes(slug)
}

export function addRegisteredEvent(store: EventParticipationStore, userId: number, slug: string) {
  return appendUniqueSlug(store, 'registrations', userId, slug)
}

export function addSubmittedEvent(store: EventParticipationStore, userId: number, slug: string) {
  return appendUniqueSlug(store, 'submissions', userId, slug)
}

export function addOwnedEvent(store: EventParticipationStore, userId: number, slug: string) {
  return appendUniqueSlug(store, 'ownedEvents', userId, slug)
}