'use client'

import { useEffect, useState } from 'react'

import { CatalogEvent, fetchCatalogEventBySlug, fetchCatalogEvents } from '@/lib/events'

type EventsState = {
  events: CatalogEvent[]
  isLoading: boolean
  error: string | null
}

type EventState = {
  event: CatalogEvent | null
  isLoading: boolean
  error: string | null
}

export function useEvents(): EventsState {
  const [events, setEvents] = useState<CatalogEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      setIsLoading(true)
      setError(null)

      try {
        const nextEvents = await fetchCatalogEvents()

        if (isMounted) {
          setEvents(nextEvents)
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Erro ao carregar eventos')
          setEvents([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadEvents()

    return () => {
      isMounted = false
    }
  }, [])

  return { events, isLoading, error }
}

export function useEventBySlug(slug: string): EventState {
  const [event, setEvent] = useState<CatalogEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadEvent() {
      setIsLoading(true)
      setError(null)

      try {
        const nextEvent = await fetchCatalogEventBySlug(slug)

        if (isMounted) {
          setEvent(nextEvent)
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Erro ao carregar evento')
          setEvent(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (slug) {
      void loadEvent()
    }

    return () => {
      isMounted = false
    }
  }, [slug])

  return { event, isLoading, error }
}