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
      alert('Evento excluído com sucesso!')
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message || 'Falha ao excluir o evento.')
      setIsDeleting(false)
    }
  }

  // Função passada como prop para o seu formulário
  const handleUpdate = async (data: any) => {
    try {
      await updateEvent(event.id, data)
      alert('Evento atualizado com sucesso!')
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message || 'Falha ao atualizar o evento.')
    }
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
           {/* Substitua o texto abaixo pela chamada do seu formulário adaptado */}
           {/* <EventForm initialData={event} onSubmit={handleUpdate} isEditing={true} /> */}
           
           <p className="text-center text-muted-foreground py-10">
             <EventForm initialData={event} onSubmit={handleUpdate} isEditing={true} />
           </p>
        </div>
      </main>
    </div>
  )
}