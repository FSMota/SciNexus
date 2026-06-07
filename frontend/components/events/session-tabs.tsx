'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { slugify } from '@/lib/events'
import { useEvents } from '@/hooks/useEvents'
import { getMySubmissions } from '@/services/submission-api'
// 👇 Importação hipotética: você precisará criar essa função no event-api.ts
import { getMyReviewerRequests } from '@/services/event-api' 

export function SessionTabs() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { events } = useEvents()
  
  // Estado do mock de RBAC local
  const [data, setData] = useState<any>({})
  
  // Estados para os dados reais do backend
  const [realSubmissions, setRealSubmissions] = useState<any[]>([])
  const [reviewerRequests, setReviewerRequests] = useState<any[]>([]) // <-- Novo estado

  useEffect(() => {
    // Adicionamos a checagem do 'user' aqui para garantir que temos o ID
    if (isAuthenticated && user) {
      const key = 'scinexus:rbac'
      const parsed = JSON.parse(localStorage.getItem(key) || '{}')
      setData(parsed)

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
    }
  }, [isAuthenticated, user]) // <-- Adicione 'user' no array de dependências

  const myRegistrations = useMemo(() => {
    if (!user) return []
    const slugs = data.registrations?.[user.id] || []
    return slugs.map((s: string) => events.find((e) => e.slug === s || slugify(e.title) === s)).filter(Boolean)
  }, [data, events, user])

  const myEvents = useMemo(() => {
    if (!user) return []
    const slugs = data.ownedEvents?.[user.id] || []
    return slugs.map((s: string) => events.find((e) => e.slug === s || slugify(e.title) === s)).filter(Boolean)
  }, [data, events, user])

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
        return (
          <li key={`sub-${sub.id}`} className="flex items-center justify-between border-b pb-3">
            <div className="text-left">
              <div className="font-medium text-foreground">{sub.titulo}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {sub.status}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-50 sm:max-w-xs">
                  {eventoRelacionado?.title || `Evento #${sub.evento_id}`}
                </span>
              </div>
            </div>
            <Link href={`/submissions/${sub.id}`} className="text-sm font-medium text-primary hover:underline">
              Ver Artigo
            </Link>
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
        
        // Estilização dinâmica do badge baseada no status
        let badgeColor = "bg-yellow-500/10 text-yellow-600" // pendente
        if (req.status === 'ativo') badgeColor = "bg-green-500/10 text-green-600"
        if (req.status === 'rejeitado') badgeColor = "bg-destructive/10 text-destructive"

        return (
          <li key={`rev-${req.id}`} className="flex items-center justify-between border-b pb-3">
            <div className="text-left">
              <div className="font-medium text-foreground">
                {eventoRelacionado?.title || `Evento #${req.event_id}`}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {req.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  Solicitado em {new Date(req.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            {req.status === 'ativo' && (
               <span className="text-sm font-medium text-muted-foreground">
                 Aprovado
               </span>
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