'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEventBySlug } from '@/hooks/useEvents'
import { updateEvent, deleteEvent } from '@/services/event-api'
import { TopNav } from '@/components/navigation/top-nav'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { EventForm } from '@/components/forms/EventForm'
import { EventFormValues } from '@/lib/schemas' // Importe o tipo EventFormValues
import { toast } from 'sonner'

export default function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { event, isLoading, error } = useEventBySlug(slug)
  const [isDeleting, setIsDeleting] = useState(false)

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando evento...</div>
  if (error || !event) return <div className="p-8 text-center text-destructive">Evento não encontrado.</div>

  const handleDelete = async () => {
    const confirmou = window.confirm('Tem certeza que deseja excluir este evento? Todas as inscrições e submissões vinculadas a ele serão apagadas.')
    if (!confirmou) return

    setIsDeleting(true)
    try {
      await deleteEvent(event.id)
      toast.success("Evento excluído", {
        description: "O evento foi removido permanentemente com sucesso.",
      })
      router.push('/dashboard')
    } catch (err: any) {
      toast.error("Erro ao excluir", {
        description: err.message || 'Falha ao excluir o evento.',
      })
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (data: EventFormValues) => {
    try {
      // Processa a conversão de array de tags se necessário (baseado em como o updateEvent espera receber)
      const payload = {
        ...data,
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : data.tags,
        data_fim: data.data_fim && data.data_fim.trim() !== "" ? data.data_fim : null,
      }
      
      await updateEvent(event.id, payload as any) // O "as any" aqui evita atritos com o CreateEventPayload, já tratamos a tipagem no payload
      toast.success("Evento atualizado", {
        description: "As informações do evento foram atualizadas com sucesso.",
      })
      router.push('/dashboard')
    } catch (err: any) {
      toast.error("Erro ao atualizar", {
        description: err.message || 'Falha ao atualizar o evento.',
      })
    }
  }

  // Função para garantir que a data fique no formato YYYY-MM-DD
  const formatForDateInput = (dateString?: string | null) => {
    if (!dateString) return '';
    // Pega apenas os 10 primeiros caracteres: "2026-10-15" de "2026-10-15T00:00:00"
    return dateString.substring(0, 10);
  }

  // Mapeamos os dados do CatalogEvent para o formato esperado pelo formulário
  const formattedInitialData: Partial<EventFormValues> = {
    titulo: event.title,
    categoria: event.category as any,
    
    // APLIQUE A FORMATAÇÃO AQUI:
    // Se data_inicio não existir (por cache antigo), usamos sortDate como fallback
    data_inicio: formatForDateInput((event as any).data_inicio || event.sortDate), 
    data_fim: formatForDateInput((event as any).data_fim),
    
    local: event.location,
    status: (event.status === 'inscrições abertas' || event.status === 'inscrições encerradas') 
             ? event.status 
             : 'inscrições abertas',
    submissoes_abertas: (event as any).submissionsOpen ?? true, // Atenção: no catalogSchema o nome é submissionsOpen!
    resumo: event.summary,
    tags: Array.isArray(event.tags) ? event.tags.join(', ') : event.tags,
    // Tratando a conversão de attendees (string no catalog) para numero (no form)
    numero_participantes: parseInt(event.attendees) || 0,
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Meus Dados
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gerenciar Evento</h1>
              <p className="text-muted-foreground mt-1">
                Atualize as informações ou encerre as inscrições do evento <strong className="text-foreground">{event.title}</strong>.
              </p>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="shrink-0"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Excluindo...' : 'Excluir Evento'}
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
           {/* Repare que removi a prop isEditing={true} pois ela não existe na interface EventFormProps */}
           <EventForm initialData={formattedInitialData} onSubmit={handleUpdate} submitLabel="Atualizar Evento" />
        </div>
      </main>
    </div>
  )
}