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
import { ReviewerRequestsManager } from '@/components/events/reviewer-request-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
        tags: data.tags,
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
    tags: Array.isArray(event.tags) ? event.tags : [],
    // Tratando a conversão de attendees (string no catalog) para numero (no form)
    numero_participantes: parseInt(event.attendees) || 0,
  }

return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        
        {/* Cabeçalho com o botão de voltar e título (mantenha o que você já tem) */}
        <div className="mb-8 space-y-4">
           {/* ... */}
          <h1 className="text-2xl font-bold">Editar Evento</h1>
           {/* alinhar o botão de excluir na ponta direita */}
            <div className="flex justify-end">
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="shrink-0"
            >
              <Trash2 className="mr-2 h-4 w-4 " />
              {isDeleting ? 'Excluindo...' : 'Excluir Evento'}
            </Button>
          </div>
        </div>

        

        {/* 2. Substitua o formulário direto pelo container de Tabs */}
        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-100 mb-6">
            <TabsTrigger value="detalhes">Configurações</TabsTrigger>
            <TabsTrigger value="revisores">Candidatos a Revisor</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="focus-visible:outline-none">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
               <EventForm initialData={formattedInitialData} onSubmit={handleUpdate} submitLabel="Atualizar Evento" />
            </div>
          </TabsContent>

          <TabsContent value="revisores" className="focus-visible:outline-none">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
               {/* Injetamos o gerenciador de aprovações aqui */}
               <ReviewerRequestsManager eventId={event.id} />
            </div>
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}