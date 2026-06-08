'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TopNav } from '@/components/navigation/top-nav'
import { getSubmissionsByEvent } from '@/services/submission-api'
import { ArrowLeft, FileSignature } from 'lucide-react'
import { toast } from 'sonner'

export default function ReviewerPanelPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Busca TODOS os artigos submetidos no evento clicado
    getSubmissionsByEvent(parseInt(eventId))
      .then(data => setSubmissions(data))
      .catch(err => {
        console.error(err)
        toast.error("Erro ao carregar os artigos do evento.")
      })
      .finally(() => setIsLoading(false))
  }, [eventId])

  if (isLoading) return <div className="p-8 text-center text-muted-foreground mt-10">Carregando artigos do evento...</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">

        <div className="mb-8 space-y-4">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Artigos para Revisão</h1>
          <p className="text-muted-foreground">Escolha um artigo da lista abaixo para avaliar.</p>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum artigo foi submetido para este evento ainda.
            </div>
          ) : (
            <ul className="divide-y">
              {submissions.map(sub => (
                <li key={sub.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-lg">{sub.titulo}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${sub.status === 'SUBMETIDO' ? 'bg-primary/10 text-primary' :
                        sub.status === 'EM_REVISAO' ? 'bg-yellow-500/10 text-yellow-600' :
                          sub.status === 'APROVADO' ? 'bg-green-500/10 text-green-600' :
                            'bg-destructive/10 text-destructive'
                        }`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* ESSE BOTÃO LEVA PARA A TELA DE AVALIAR O ARTIGO INDIVIDUAL */}
                  <Link href={`/submissions/${sub.id}/avaliar`}>
                    <Button variant={sub.status === 'SUBMETIDO' ? 'default' : 'secondary'}>
                      <FileSignature className="mr-2 h-4 w-4" />
                      {sub.status === 'SUBMETIDO' ? 'Iniciar Avaliação' : 'Ver Avaliação'}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}