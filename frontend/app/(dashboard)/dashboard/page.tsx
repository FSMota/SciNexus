'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { SessionTabs } from '@/components/events/session-tabs'
import { TopNav } from '@/components/navigation/top-nav'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SeletorDeTagsExpertise } from '@/components/dashboard/tags-selector'
import { toast } from 'sonner'
import { updateProfile } from '@/services/auth-api'

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-black animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="rounded-4xl border border-border/80 bg-card p-6 shadow-elegant sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Meus dados</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {user.full_name || user.username}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Gerencie suas inscrições, submissões e eventos publicados aqui.
              </p>
            </div>

            <Button asChild className="rounded-full px-5">
              <Link href="/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar evento
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-background p-5">
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="mt-2 text-lg font-medium text-foreground">{user.full_name || 'Não informado'}</p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-background p-5">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="mt-2 text-lg font-medium text-foreground">{user.email}</p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-background p-5">
              <p className="text-sm text-muted-foreground">Usuário</p>
              <p className="mt-2 text-lg font-medium text-foreground">{user.username}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div>{user.tags}</div>
          <SeletorDeTagsExpertise
            tagsSalvas={user.tags}
            onSalvar={async (tags) => {
              try {
                await updateProfile({ tags });

                toast.success('Áreas de expertise salvas com sucesso!');
                router.refresh();

              } catch (error: any) {
                toast.error('Erro ao salvar tags', { description: error.message });
              }
            }}
          />
        </div>

        <div className="mt-8">
          <SessionTabs />
        </div>
      </main>
    </div>
  )
}
