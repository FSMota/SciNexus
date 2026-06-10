'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useEvents'
import { getMySubmissions } from '@/services/submission-api'
import { Download, FileSignature } from 'lucide-react'
// 👇 Importação hipotética: você precisará criar essa função no event-api.ts
import { getMyReviewerRequests, getMyOrganizedEvents, getMyRegistrations } from '@/services/event-api'

export function SessionTabs() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { events } = useEvents()

  // Estados para os dados reais do backend
  const [realSubmissions, setRealSubmissions] = useState<any[]>([])
  const [reviewerRequests, setReviewerRequests] = useState<any[]>([])
  const [organizedRelations, setOrganizedRelations] = useState<any[]>([])
  const [listenerRelations, setListenerRelations] = useState<any[]>([])


  useEffect(() => {
    // Adicionamos a checagem do 'user' aqui para garantir que temos o ID
    if (isAuthenticated && user) {
      // Busca Submissões
      getMySubmissions()
        .then(dados => setRealSubmissions(dados))
        .catch(err => {
          console.error('Erro ao buscar submissões:', err.message)
          setRealSubmissions([])
        })

      // 👇 Busca Solicitações de Revisor passando o ID real do usuário
      getMyReviewerRequests(user.id)
        .then(dados => setReviewerRequests(dados))
        .catch(err => {
          console.error('Erro ao buscar solicitações de revisor:', err.message)
          setReviewerRequests([])
        })

      getMyOrganizedEvents(user.id)
        .then(dados => setOrganizedRelations(dados))
        .catch(err => {
          console.error('Erro ao buscar eventos organizados:', err.message)
          setOrganizedRelations([])
        })

      getMyRegistrations(user.id)
        .then(dados => setListenerRelations(dados))
        .catch(err => console.error(err.message))
    }
  }, [isAuthenticated, user]) // <-- Adicione 'user' no array de dependências

  const myRegistrations = useMemo(() => {
    if (!user || listenerRelations.length === 0) return []
    return listenerRelations
      .map(relation => events.find(e => e.id === relation.event_id))
      .filter(Boolean)
  }, [listenerRelations, events, user])

  const myEvents = useMemo(() => {
    if (!user || organizedRelations.length === 0) return []

    return organizedRelations
      .map(relation => events.find(e => e.id === relation.event_id))
      .filter(Boolean) // Remove nulos caso o catálogo ainda esteja carregando
  }, [organizedRelations, events, user])

  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-lg bg-card p-4 shadow mb-6">
        <p className="text-sm text-muted-foreground">Entre para ver suas inscrições, submissões e eventos.</p>
        <div className="mt-3">
          <Link href="/login"><Button>Entrar</Button></Link>
        </div>
      </div>
    )
  }

  // 💡 ESTRATÉGIA: Array de abas com o novo item "revisor"
  const tabs = [
    {
      key: 'registrations',
      title: 'Minhas inscrições',
      items: myRegistrations,
      emptyText: 'Nenhuma inscrição encontrada.',
      renderItem: (e: any) => (
        <li key={`reg-${e.id}`} className="flex items-center justify-between border-b pb-3">
          <div className="text-left">
            <div className="font-medium text-foreground">{e.title}</div>
            <div className="text-xs text-muted-foreground">{e.date} · {e.location}</div>
          </div>
          <Link href={`/events/${e.slug}`} className="text-sm font-medium text-primary hover:underline">Ver Evento</Link>
        </li>
      )
    },
    {
      key: 'submissions',
      title: 'Minhas submissões',
      items: realSubmissions,
      emptyText: 'Nenhuma submissão encontrada.',
      renderItem: (sub: any) => {
        const eventoRelacionado = events.find(e => e.id === sub.evento_id)

        let statusColor = "bg-primary/10 text-primary"
        if (sub.status === 'EM_REVISAO') statusColor = "bg-yellow-500/10 text-yellow-600"
        if (sub.status === 'APROVADO') statusColor = "bg-green-500/10 text-green-600"
        if (sub.status === 'REJEITADO') statusColor = "bg-destructive/10 text-destructive"

        return (
          <li key={`sub-${sub.id}`} className="flex flex-col border-b pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-start justify-between w-full">
              <div className="text-left">
                <div className="font-medium text-foreground">{sub.titulo}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`${statusColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                    {sub.status}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-50 sm:max-w-xs">
                    {eventoRelacionado?.title || `Evento #${sub.evento_id}`}
                  </span>
                </div>
              </div>
            </div>

            {sub.feedback && (
              <div className={`mt-3 p-4 rounded-lg border text-left text-sm ${sub.status === 'APROVADO' ? 'bg-green-500/5 border-green-500/20' : 'bg-destructive/5 border-destructive/20'}`}>
                <p className="font-semibold mb-1 text-foreground">Parecer do Revisor:</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{sub.feedback}</p>
              </div>
            )}
          </li>
        )
      }
    },
    // 👇 NOVA ABA: Histórico de Revisor
    {
      key: 'revisor',
      title: 'Histórico de Revisor',
      items: reviewerRequests,
      emptyText: 'Você ainda não enviou solicitações para ser revisor.',
      renderItem: (req: any) => {
        const eventoRelacionado = events.find(e => e.id === req.event_id)

        let badgeColor = "bg-yellow-500/10 text-yellow-600"
        if (req.status === 'ativo') badgeColor = "bg-green-500/10 text-green-600"
        if (req.status === 'rejeitado') badgeColor = "bg-destructive/10 text-destructive"

        return (
          <li key={`rev-${req.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-4 gap-3 last:border-0 last:mb-0 last:pb-0">
            <div className="text-left">
              <div className="font-medium text-foreground">
                {eventoRelacionado?.title || `Evento #${req.event_id}`}
              </div>
              <div className="flex items-center gap-2 mt-1">
                
                <span className="text-xs text-muted-foreground">
                  Status como revisor:
                </span>
                <span className={`${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {req.status}
                </span>
              </div>
            </div>

            {/* O BOTÃO AGORA DIZ "VER ARTIGOS" E APONTA PARA A LISTA DO EVENTO */}
            {req.status === 'ativo' && (
              <Link href={`/reviewer/${req.event_id}`}>
                <Button size="sm">Ver Artigos</Button>
              </Link>
            )}
          </li>
        )
      }
    },
    {
      key: 'events',
      title: 'Meus eventos',
      items: myEvents,
      emptyText: 'Nenhum evento publicado por você.',
      renderItem: (e: any) => (
        <li key={`evt-${e.id}`} className="flex items-center justify-between border-b pb-3">
          <div className="text-left">
            <div className="font-medium text-foreground">{e.title}</div>
            <div className="text-xs text-muted-foreground">{e.date} · {e.location}</div>
          </div>
          <Link href={`/events/${e.slug}/edit`} className="text-sm font-medium text-primary hover:underline">
            Gerenciar
          </Link>
        </li>
      )
    },
  ]

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border/50 mb-6 overflow-hidden">
      <Tabs defaultValue={tabs[0].key}>
        {/* Scroll horizontal permite que as abas não quebrem em telas pequenas */}
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="mb-2 min-w-max">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>{`${t.title} (${t.items.length})`}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="text-center focus-visible:outline-none">
            {Array.isArray(t.items) && t.items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8">{t.emptyText}</p>
            ) : (
              <ul className="space-y-4 mt-4">
                {Array.isArray(t.items) && t.items.map((item: any) => t.renderItem(item))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}