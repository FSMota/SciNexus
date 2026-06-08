'use client'

import { useCallback, useState } from 'react'

import { createEvent, subscribeToEvent, type CreateEventPayload, type EventRelation } from '@/services/event-api'

export function useCreateEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitEvent = useCallback(async (payload: CreateEventPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      return await createEvent(payload)
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Falha ao criar evento'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { createEvent: submitEvent, isSubmitting, error, setError }
}

export function useSubscribeToEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribe = useCallback(async (slug: string, userId: number): Promise<EventRelation> => {
    setIsSubmitting(true)
    setError(null)

    try {
      return await subscribeToEvent(slug, userId)
    } catch (subscriptionError) {
      const message = subscriptionError instanceof Error ? subscriptionError.message : 'Falha ao realizar inscrição'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { subscribe, isSubmitting, error, setError }
}