'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  addOwnedEvent,
  addRegisteredEvent,
  addSubmittedEvent,
  getEventParticipationStore,
  isEventRegistered,
  isEventSubmitted,
  setEventParticipationStore,
  type EventParticipationStore,
} from '@/lib/event-participation'

export function useEventParticipation(userId: number | null) {
  const [store, setStore] = useState<EventParticipationStore>({})

  useEffect(() => {
    setStore(getEventParticipationStore())
  }, [userId])

  const isRegistered = useCallback(
    (slug: string) => {
      if (!userId) {
        return false
      }

      return isEventRegistered(store, userId, slug)
    },
    [store, userId],
  )

  const isSubmitted = useCallback(
    (slug: string) => {
      if (!userId) {
        return false
      }

      return isEventSubmitted(store, userId, slug)
    },
    [store, userId],
  )

  const updateStore = useCallback(
    (nextStore: EventParticipationStore) => {
      setStore(nextStore)
      setEventParticipationStore(nextStore)
    },
    [],
  )

  const markRegistered = useCallback(
    (slug: string) => {
      if (!userId) {
        return
      }

      updateStore(addRegisteredEvent(store, userId, slug))
    },
    [store, updateStore, userId],
  )

  const markSubmitted = useCallback(
    (slug: string) => {
      if (!userId) {
        return
      }

      updateStore(addSubmittedEvent(store, userId, slug))
    },
    [store, updateStore, userId],
  )

  const markOwnedEvent = useCallback(
    (slug: string) => {
      if (!userId) {
        return
      }

      updateStore(addOwnedEvent(store, userId, slug))
    },
    [store, updateStore, userId],
  )

  const counts = useMemo(() => {
    if (!userId) {
      return { registrations: 0, submissions: 0, ownedEvents: 0 }
    }

    return {
      registrations: store.registrations?.[userId]?.length || 0,
      submissions: store.submissions?.[userId]?.length || 0,
      ownedEvents: store.ownedEvents?.[userId]?.length || 0,
    }
  }, [store, userId])

  return {
    isRegistered,
    isSubmitted,
    markRegistered,
    markSubmitted,
    markOwnedEvent,
    counts,
  }
}