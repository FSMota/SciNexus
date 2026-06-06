'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2} from 'lucide-react'

import { categoryLabels, type CategoryName } from '@/components/catalog/catalog-data'
import { TopNav } from '@/components/navigation/top-nav'
import { useAuth } from '@/hooks/useAuth'
import { useCreateEvent } from '@/hooks/useEventMutations'
import { useEventParticipation } from '@/hooks/useEventParticipation'
import { eventFormSchema, type EventFormValues } from '../../../lib/schemas'
import { EventForm } from '@/components/forms/EventForm'

type EventStatus = 'inscrições abertas' | 'inscrições encerradas'

const defaultCategory = Object.keys(categoryLabels)[0] as CategoryName

const defaultValues: EventFormValues = {
  titulo: '',
  categoria: defaultCategory,
  data_inicio: '',
  data_fim: '',
  local: '',
  status: 'inscrições abertas',
  submissoes_abertas: true,
  resumo: '',
  tags: '',
  numero_participantes: 0,
}

const fieldClassName = 'h-11'

export default function NewEventPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { createEvent, isSubmitting, error: apiError, setError: setApiError } = useCreateEvent()
  const { markOwnedEvent } = useEventParticipation(user?.id ?? null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleCreate = async (values: EventFormValues) => {
  // Aqui você chama a lógica de criação do evento com os 'values' já validados
  await createEvent({
    ...values,
    tags: typeof values.tags === 'string' ? values.tags.split(',').map(t => t.trim()) : values.tags,
    data_fim: values.data_fim && values.data_fim.trim() !== "" ? values.data_fim : null,
  });
  router.push('/dashboard');
};

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <TopNav />
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-4xl border bg-card p-8">
           <h1 className="text-3xl font-semibold">Novo evento</h1>
           {apiError && <p className="text-destructive">{apiError}</p>}
           
           <EventForm 
             onSubmit={handleCreate} 
             isSubmitting={isSubmitting} 
             submitLabel="Criar evento" 
           />
        </div>
      </section>
    </main>
  )
}