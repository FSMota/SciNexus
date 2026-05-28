'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { categoryLabels, categoryStyles } from '@/components/catalog/catalog-data'
import { useAuth } from '@/hooks/useAuth'
import { useEventBySlug } from '@/hooks/useEvents'

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()
  const { event, isLoading: isEventLoading, error } = useEventBySlug(slug)
  const [registering, setRegistering] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const userId = user?.id?.toString() ?? 'anonymous'

  const isRegistered = useMemo(() => {
    if (!user) return false
    const data = JSON.parse(localStorage.getItem('scinexus:rbac') || '{}')
    return (data.registrations?.[user.id] || []).includes(slug)
  }, [user, slug])

  const isSubmitted = useMemo(() => {
    if (!user) return false
    const data = JSON.parse(localStorage.getItem('scinexus:rbac') || '{}')
    return (data.submissions?.[user.id] || []).includes(slug)
  }, [user, slug])

  const ensureAuthOrRedirect = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  const handleRegister = async () => {
    if (!ensureAuthOrRedirect()) return
    if (!event || !user) return
    setRegistering(true)

    const key = 'scinexus:rbac'
    const data = JSON.parse(localStorage.getItem(key) || '{}')
    data.registrations = data.registrations || {}
    data.registrations[user.id] = Array.from(new Set([...(data.registrations[user.id] || []), slug]))
    localStorage.setItem(key, JSON.stringify(data))
    setRegistering(false)
    alert('Inscrição realizada!')
  }

  const handleSubmit = async () => {
    if (!ensureAuthOrRedirect()) return
    if (!event || !user) return
    setSubmitting(true)

    const key = 'scinexus:rbac'
    const data = JSON.parse(localStorage.getItem(key) || '{}')
    data.submissions = data.submissions || {}
    data.submissions[user.id] = Array.from(new Set([...(data.submissions[user.id] || []), slug]))
    localStorage.setItem(key, JSON.stringify(data))
    setSubmitting(false)
    alert('Submissão iniciada!')
  }

  if (isEventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">Carregando detalhes do evento...</div>
      </div>
    )
  }

  if (!event || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{error || 'Evento não encontrado.'}</p>
          <div className="mt-4">
            <Link href="/events">
              <Button variant="ghost">Voltar ao catálogo</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl space-y-6 px-4">
        <div className="rounded-2xl bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] ${categoryStyles[event.category]}`}>
                {categoryLabels[event.category]}
              </div>
              <h1 className="mt-3 text-2xl font-bold">{event.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{event.date} · {event.location}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleRegister} disabled={isRegistered || registering}>
                {isRegistered ? 'Inscrito' : registering ? 'Inscrevendo...' : 'Inscrever-se (ouvinte)'}
              </Button>
              <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitted || submitting}>
                {isSubmitted ? 'Submetido' : submitting ? 'Enviando...' : 'Submeter pesquisa (pesquisador)'}
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{event.status}</p>
            <p className="text-base text-foreground">{event.summary}</p>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">Participantes estimados: {event.attendees}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/events">
            <Button variant="link">Voltar ao catálogo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
