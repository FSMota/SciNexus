'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventFormValues } from '@/lib/schemas'
import { categoryLabels, CategoryName } from '@/components/catalog/catalog-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

// 1. IMPORTAMOS O NOSSO NOVO COMPONENTE AQUI
// (Ajuste o caminho de importação se você salvou em outra pasta)
import { SeletorDeTagsFormulario } from '@/components/dashboard/tags-form-selector' 

interface EventFormProps {
  initialData?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function EventForm({ initialData, onSubmit, isSubmitting, submitLabel = "Salvar" }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData || {
        titulo: '',
        categoria: Object.keys(categoryLabels)[0] as CategoryName,
        data_inicio: '',
        data_fim: '',
        local: '',
        status: 'inscrições abertas',
        submissoes_abertas: true,
        resumo: '',
        tags: [], // 2. CORRIGIDO: Agora inicializa como um array vazio para satisfazer o Zod e o TypeScript
        numero_participantes: 0,
    },
  })

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título *</Label>
          <Input id="titulo" {...form.register('titulo')} />
          {form.formState.errors.titulo && <p className="text-xs text-destructive">{form.formState.errors.titulo.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Controller
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_inicio">Data de início *</Label>
          <Input id="data_inicio" type="date" {...form.register('data_inicio')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_fim">Data de fim</Label>
          <Input id="data_fim" type="date" {...form.register('data_fim')} />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="local">Local completo *</Label>
          <Input id="local" {...form.register('local')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inscrições abertas">Inscrições abertas</SelectItem>
                  <SelectItem value="inscrições encerradas">Inscrições encerradas</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero_participantes">Número de participantes</Label>
          <Input id="numero_participantes" type="number" {...form.register('numero_participantes', { valueAsNumber: true })} />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="resumo">Resumo *</Label>
          <Textarea id="resumo" className="min-h-32" {...form.register('resumo')} />
        </div>

        {/* 3. A MÁGICA ACONTECE AQUI: Substituímos o Input antigo pelo nosso Seletor */}
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="tags">Tags do Evento *</Label>
          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <SeletorDeTagsFormulario 
                value={field.value || []} 
                onChange={field.onChange} 
              />
            )}
          />
          {form.formState.errors.tags && (
            <p className="text-sm text-destructive">{form.formState.errors.tags.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border p-4 lg:col-span-2">
          <Label htmlFor="submissoes_abertas">Submissões abertas</Label>
          <Controller
            control={form.control}
            name="submissoes_abertas"
            render={({ field }) => <Switch id="submissoes_abertas" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : submitLabel}</Button>
    </form>
  )
}