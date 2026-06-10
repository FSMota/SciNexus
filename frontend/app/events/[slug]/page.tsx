'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, CalendarDays, Sparkles } from 'lucide-react'
import { categoryLabels, categoryStyles, type CategoryName } from '@/components/catalog/catalog-data'
import { useAuth } from '@/hooks/useAuth'
import { useEventBySlug } from '@/hooks/useEvents'
import { useEventParticipation } from '@/hooks/useEventParticipation'
import { ReviewerCTA } from '@/components/events/reviewer-cta'
import { toast } from 'sonner'
import { subscribeToEvent, getMyRegistrations } from '@/services/event-api'

const bannerGradients: Record<CategoryName, string> = {
  tecnologia: 'from-sky-600 via-blue-600 to-cyan-400',
  saúde: 'from-emerald-600 via-teal-600 to-lime-400',
  engenharia: 'from-amber-500 via-orange-500 to-rose-400',
  educação: 'from-rose-600 via-fuchsia-600 to-pink-400',
  direito: 'from-violet-600 via-indigo-600 to-slate-500',
}

function buildGoogleMapsEmbedUrl(location: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()
  const { event, isLoading: isEventLoading, error } = useEventBySlug(slug)
  const { isSubmitted, markSubmitted } = useEventParticipation(user?.id ?? null)

  const [submitting, setSubmitting] = useState(false)
  const [isRegisteredListener, setIsRegisteredListener] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || !event) {
      setIsCheckingStatus(false)
      return
    }

    async function checkRegistration() {
      try {
        const minhasInscricoes = await getMyRegistrations(user!.id)
        const jaInscrito = minhasInscricoes.some(rel => rel.event_id === event!.id)
        setIsRegisteredListener(jaInscrito)
      } catch (err) {
        console.error("Erro ao verificar inscrição", err)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkRegistration()
  }, [isAuthenticated, user, event])

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

    setIsRegistering(true)
    try {
      await subscribeToEvent(event.id, user.id)
      setIsRegisteredListener(true)
      toast.success('Inscrição confirmada!', {
        description: `Você agora é um ouvinte do evento ${event.title}.`
      })
    } catch (error: any) {
      toast.error('Falha na inscrição', {
        description: error.message || 'Ocorreu um erro ao tentar se inscrever.'
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleSubmit = async () => {
    if (!ensureAuthOrRedirect()) return
    if (!event || !user) return

    // Redireciona para a página do formulário passando o ID do evento na URL
    router.push(`/events/submission?eventoId=${event.id}`)
  }

  const submitted = isSubmitted(slug)

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
        <div className={`relative overflow-hidden rounded-4xl bg-linear-to-br ${bannerGradients[event.category as CategoryName]} text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -left-14 bottom-0 h-44 w-44 rounded-full bg-black/10 blur-3xl" />
          <div className="relative grid gap-8 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em]">
                {categoryLabels[event.category as CategoryName]}
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{event.title}</h1>
                <p className="max-w-2xl text-sm leading-6 text-white/85 md:text-base">{event.summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  <Sparkles className="h-4 w-4" />
                  Banner genérico
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Ações do evento</p>
                <p className="text-sm text-white/80">Inscrição para ouvintes e submissão para pesquisadores.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleRegister}
                  disabled={isRegisteredListener || isRegistering || isCheckingStatus}
                >
                  {isCheckingStatus ? 'Verificando...' : isRegisteredListener ? 'Inscrito' : isRegistering ? 'Inscrevendo...' : 'Inscrever-se (ouvinte)'}
                </Button>
                <Button variant="secondary" onClick={handleSubmit} disabled={submitted || submitting}>
                  {submitted ? 'Submetido' : submitting ? 'Enviando...' : 'Submeter pesquisa (pesquisador)'}
                </Button>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-black/10 px-6 py-4 text-sm text-white/85">
            <div className="flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Detalhes</p>
                <h2 className="mt-2 text-xl font-semibold">Resumo do evento</h2>
              </div>
              <p className="text-sm text-muted-foreground">{event.status}</p>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-base text-foreground">{event.summary}</p>
              <div className="text-sm text-muted-foreground">Participantes estimados: {event.attendees}</div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Localização</p>
                <h2 className="mt-2 text-xl font-semibold">Google Maps</h2>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                Abrir no Maps
              </a>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{event.location}</p>

            <div className="mt-4 overflow-hidden rounded-2xl border bg-muted">
              <iframe
                title={`Mapa do evento ${event.title}`}
                src={buildGoogleMapsEmbedUrl(event.location)}
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] ${categoryStyles[event.category as CategoryName]}`}>
              {categoryLabels[event.category as CategoryName]}
            </div>
            <h2 className="text-lg font-semibold">Informações adicionais</h2>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.map((t) => (
              <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>

        <ReviewerCTA eventId={event.id} />

        <div className="flex items-center gap-3">
          <Link href="/events">
            <Button variant="link">Voltar ao catálogo <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </main>
  )
}