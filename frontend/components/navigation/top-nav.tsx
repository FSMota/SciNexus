'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/dashboard', label: 'Meus dados' },
  { href: '/events', label: 'Catálogo de eventos' },
]

export function TopNav() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <header className="border-b border-white/10 bg-white/95 text-slate-900 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 self-start">
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
              Eventos científicos, simplificados
            </div>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  className={`rounded-full px-5 ${isActive ? 'shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )
            })}
          </nav>

          {user ? (
            <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 lg:block">
              {user.full_name || user.username}
            </div>
          ) : null}

          <Button variant="outline" onClick={logout} className="rounded-full">
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}