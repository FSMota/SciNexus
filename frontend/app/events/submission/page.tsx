'use client'

import { useSearchParams } from 'next/navigation'
import ArticleSubmissionForm from '@/components/forms/ArticleSubmissionForm' // Ajuste o caminho conforme sua estrutura
import { TopNav } from '@/components/navigation/top-nav'

export default function SubmissionPage() {
  const searchParams = useSearchParams()
  const eventoId = searchParams.get('eventoId')

  if (!eventoId) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum evento selecionado para submissão. Volte ao catálogo.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submeter Artigo</h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo e envie seu arquivo PDF para avaliação cega.
          </p>
        </div>

        {/* Passa o ID convertido para número para o seu formulário */}
        <ArticleSubmissionForm eventoId={Number(eventoId)} />
      </main>
    </div>
  )
}