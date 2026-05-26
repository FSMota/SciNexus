'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { catalogEvents } from '@/components/catalog/catalog-data'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export function SessionTabs() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const key = 'scinexus:rbac'
    const parsed = JSON.parse(localStorage.getItem(key) || '{}')
    setData(parsed)
  }, [isAuthenticated])

  const myRegistrations = useMemo(() => {
    if (!user) return []
    const slugs = data.registrations?.[user.id] || []
    return slugs.map((s: string) => catalogEvents.find((e) => slugify(e.title) === s)).filter(Boolean)
  }, [data, user])

  const mySubmissions = useMemo(() => {
    if (!user) return []
    const slugs = data.submissions?.[user.id] || []
    return slugs.map((s: string) => catalogEvents.find((e) => slugify(e.title) === s)).filter(Boolean)
  }, [data, user])

  const myEvents = useMemo(() => {
    if (!user) return []
    const slugs = data.ownedEvents?.[user.id] || []
    return slugs.map((s: string) => catalogEvents.find((e) => slugify(e.title) === s)).filter(Boolean)
  }, [data, user])

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

  const tabs = [
    { key: 'registrations', title: 'Minhas inscrições', items: myRegistrations, emptyText: 'Nenhuma inscrição encontrada.' },
    { key: 'submissions', title: 'Minhas submissões', items: mySubmissions, emptyText: 'Nenhuma submissão encontrada.' },
    { key: 'events', title: 'Meus eventos', items: myEvents, emptyText: 'Nenhum evento publicado por você.' },
  ]

  return (
    <div className="rounded-lg bg-card p-6 shadow mb-6">
      <Tabs defaultValue={tabs[0].key}>
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>{`${t.title} (${t.items.length})`}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="p-6 text-center">
            {t.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.emptyText}</p>
            ) : (
              <ul className="space-y-2">
                {t.items.map((e: any) => (
                  <li key={e.title} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-xs text-muted-foreground">{e.date} · {e.location}</div>
                    </div>
                    <Link href={`/events/${slugify(e.title)}`} className="text-sm text-primary">Ver</Link>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
