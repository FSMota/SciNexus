'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'

import { categoryLabels, type CategoryName } from '@/components/catalog/catalog-data'
import { TopNav } from '@/components/navigation/top-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useCreateEvent } from '@/hooks/useEventMutations'
import { useEventParticipation } from '@/hooks/useEventParticipation'
import { eventFormSchema, type EventFormValues } from '../../../../lib/schemas'

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

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null)
    setApiError(null)

    if (!user) {
      setError('Você precisa estar autenticado para criar um evento.')
      return
    }

    try {
      const createdEvent = await createEvent({
        titulo: values.titulo.trim(),
        categoria: values.categoria,
        data_inicio: values.data_inicio,
        data_fim: values.data_fim?.trim() ? values.data_fim.trim() : null,
        local: values.local.trim(),
        status: values.status,
        submissoes_abertas: values.submissoes_abertas,
        resumo: values.resumo.trim(),
        tags: values.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean),
        numero_participantes: values.numero_participantes,
      })

      markOwnedEvent(createdEvent.slug)
      router.push('/dashboard')
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Falha ao criar evento')
    }
  })

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
    <main className="min-h-screen bg-background text-foreground">
      <TopNav />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="rounded-4xl border border-border/80 bg-card p-6 shadow-elegant sm:p-8">
          <div className="flex flex-col gap-5 border-b border-border/70 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Criar evento</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Novo evento científico</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                O formulário abaixo cobre exatamente os campos do schema do backend, respeitando obrigatoriedade e defaults.
              </p>
            </div>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {error || apiError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error || apiError}
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  className={fieldClassName}
                  placeholder="Ex.: Congresso Brasileiro de IA"
                  aria-invalid={Boolean(form.formState.errors.titulo)}
                  {...form.register('titulo')}
                />
                {form.formState.errors.titulo?.message ? <p className="text-xs text-destructive">{form.formState.errors.titulo.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Controller
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="categoria" aria-invalid={Boolean(form.formState.errors.categoria)}>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.categoria?.message ? <p className="text-xs text-destructive">{form.formState.errors.categoria.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  className={fieldClassName}
                  aria-invalid={Boolean(form.formState.errors.data_inicio)}
                  {...form.register('data_inicio')}
                />
                {form.formState.errors.data_inicio?.message ? <p className="text-xs text-destructive">{form.formState.errors.data_inicio.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de fim</Label>
                <Input id="data_fim" type="date" className={fieldClassName} {...form.register('data_fim')} />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="local">Local completo *</Label>
                <Input
                  id="local"
                  className={fieldClassName}
                  placeholder="Ex.: Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
                  aria-invalid={Boolean(form.formState.errors.local)}
                  {...form.register('local')}
                />
                {form.formState.errors.local?.message ? <p className="text-xs text-destructive">{form.formState.errors.local.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status" aria-invalid={Boolean(form.formState.errors.status)}>
                        <SelectValue placeholder="Escolha o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inscrições abertas">Inscrições abertas</SelectItem>
                        <SelectItem value="inscrições encerradas">Inscrições encerradas</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.status?.message ? <p className="text-xs text-destructive">{form.formState.errors.status.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_participantes">Número de participantes</Label>
                <Input
                  id="numero_participantes"
                  type="number"
                  min={0}
                  className={fieldClassName}
                  aria-invalid={Boolean(form.formState.errors.numero_participantes)}
                  {...form.register('numero_participantes', { valueAsNumber: true })}
                />
                {form.formState.errors.numero_participantes?.message ? <p className="text-xs text-destructive">{form.formState.errors.numero_participantes.message}</p> : null}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="resumo">Resumo *</Label>
                <Textarea
                  id="resumo"
                  className="min-h-32"
                  placeholder="Descreva o objetivo, público e proposta do evento"
                  aria-invalid={Boolean(form.formState.errors.resumo)}
                  {...form.register('resumo')}
                />
                {form.formState.errors.resumo?.message ? <p className="text-xs text-destructive">{form.formState.errors.resumo.message}</p> : null}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  className={fieldClassName}
                  placeholder="Ex.: ciência, inovação, pesquisa"
                  {...form.register('tags')}
                />
                <p className="text-xs text-muted-foreground">Separe as tags por vírgula.</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-4 lg:col-span-2">
                <div>
                  <Label htmlFor="submissoes_abertas" className="text-base">
                    Submissões abertas
                  </Label>
                  <p className="text-sm text-muted-foreground">Campo opcional com padrão true no backend.</p>
                </div>
                <Controller
                  control={form.control}
                  name="submissoes_abertas"
                  render={({ field }) => <Switch id="submissoes_abertas" checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5 text-sm text-sky-900">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Resumo do payload</p>
                  <p className="mt-1">
                    Obrigatórios: título, categoria, data de início, local e resumo. O restante segue os defaults do schema.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" asChild className="rounded-full">
                <Link href="/dashboard">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-full px-6">
                {isSubmitting ? 'Criando...' : 'Criar evento'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}