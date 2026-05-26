'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { CatalogSection } from '@/components/catalog/catalog-section'

export default function EventsPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando catálogo...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <main className="min-h-screen bg-hero text-white">
      <header className="border-b border-white/10 bg-white/95 text-slate-900 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-slate-900 via-primary to-sky-700 shadow-elegant">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M7.5 12h9M12 7.5v9M8.7 8.7l6.6 6.6M16.3 8.7l-6.6 6.6" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-2xl font-semibold tracking-tight">SciNexus</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">
                Catálogo completo
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Button asChild variant="ghost" className="rounded-full px-4 text-slate-700 hover:bg-slate-100 hover:text-slate-950">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="rounded-full px-5 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.55)]" onClick={logout}>
              <span>Sair</span>
            </Button>
          </nav>
        </div>
      </header>

      <CatalogSection variant="full" />
    </main>
  )
}
