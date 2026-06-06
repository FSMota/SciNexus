'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { slugify } from '@/lib/events'
import { useEvents } from '@/hooks/useEvents'
import { getMySubmissions } from '@/services/submission-api'

export function SessionTabs() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { events } = useEvents()
  
  // Estado do mock de RBAC local
  const [data, setData] = useState<any>({})
  // Novo estado para as submissões reais do backend
  const [realSubmissions, setRealSubmissions] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      const key = 'scinexus:rbac'
      const parsed = JSON.parse(localStorage.getItem(key) || '{}')
      setData(parsed)

      // Uso limpo do novo serviço isolado
      getMySubmissions()
        .then(dados => setRealSubmissions(dados))
        .catch(err => {
          console.error(err.message)
          setRealSubmissions([])
        })
    }
  }, [isAuthenticated])

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

  // 💡 ESTRATÉGIA: Adicionamos o `renderItem` para customizar cada lista!
  const tabs = [
    { 
      key: 'registrations', 
      title: 'Minhas inscrições', 
      items: myRegistrations, 
      emptyText: 'Nenhuma inscrição encontrada.',
      renderItem: (e: any) => (
        <li key={e.id} className="flex items-center justify-between border-b pb-3">
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
      items: realSubmissions, // <-- Usando os dados reais do backend!
      emptyText: 'Nenhuma submissão encontrada.',
      renderItem: (sub: any) => {
        // Busca o evento associado para exibir o nome
        const eventoRelacionado = events.find(e => e.id === sub.evento_id)
        
        return (
          <li key={sub.id} className="flex items-center justify-between border-b pb-3">
            <div className="text-left">
              <div className="font-medium text-foreground">{sub.titulo}</div>
              <div className="flex items-center gap-2 mt-1">
                {/* Badge de Status */}
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {sub.status}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-50 sm:max-w-xs">
                  {eventoRelacionado?.title || `Evento #${sub.evento_id}`}
                </span>
              </div>
            </div>
            {/* O link aponta para a nova tela de visualização do artigo */}
            <Link href={`/submissions/${sub.id}`} className="text-sm font-medium text-primary hover:underline">
              Ver Artigo
            </Link>
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
        <li key={e.id} className="flex items-center justify-between border-b pb-3">
          <div className="text-left">
            <div className="font-medium text-foreground">{e.title}</div>
            <div className="text-xs text-muted-foreground">{e.date} · {e.location}</div>
          </div>
          <Link href={`/events/${e.slug}`} className="text-sm font-medium text-primary hover:underline">Gerenciar</Link>
        </li>
      )
    },
  ]

  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border/50 mb-6">
      <Tabs defaultValue={tabs[0].key}>
        <TabsList className="mb-4">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>{`${t.title} (${t.items.length})`}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="text-center">
            {/* Verifica com segurança se é um array e se está vazio */}
            {Array.isArray(t.items) && t.items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">{t.emptyText}</p>
            ) : (
              <ul className="space-y-4 mt-2">
                {/* Se for array de verdade, aí sim executa o map */}
                {Array.isArray(t.items) && t.items.map((item: any) => t.renderItem(item))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}