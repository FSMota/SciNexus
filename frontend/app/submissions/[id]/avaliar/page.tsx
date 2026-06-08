'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check, X, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { TopNav } from '@/components/navigation/top-nav'
import { getSubmissionById, startSubmissionReview, submitReviewFeedback } from '@/services/submission-api'

const SUBMISSION_SERVICE_URL = process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URL || 'http://localhost:8003'

export default function ReviewArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const submissionId = parseInt(id)
  
  const [submission, setSubmission] = useState<any>(null)
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    getSubmissionById(submissionId)
      .then(data => {
        setSubmission(data)
        if (data.feedback) setFeedback(data.feedback)
      })
      .catch(() => toast.error('Erro ao carregar artigo'))
      .finally(() => setIsLoading(false))
  }, [submissionId])

  const handleStartReview = async () => {
    setIsProcessing(true)
    try {
      await startSubmissionReview(submissionId)
      setSubmission({ ...submission, status: 'EM_REVISAO' })
      toast.success('Revisão iniciada!')
    } catch (error) {
      toast.error('Erro ao iniciar revisão')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFinishReview = async (status: 'APROVADO' | 'REJEITADO') => {
    if (feedback.trim().length < 20) {
      toast.error('O feedback deve ter pelo menos 20 caracteres.')
      return
    }

    setIsProcessing(true)
    try {
      await submitReviewFeedback(submissionId, status, feedback)
      setSubmission({ ...submission, status, feedback })
      toast.success(`Artigo avaliado com sucesso!`)
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao salvar avaliação')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center mt-20">Carregando dados do artigo...</div>
  if (!submission) return <div className="p-8 text-center text-destructive mt-20">Artigo não encontrado.</div>

  const isCompleted = submission.status === 'APROVADO' || submission.status === 'REJEITADO'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Avaliação Científica</h1>
          <p className="text-muted-foreground mt-2">Analise o artigo e forneça seu parecer técnico.</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
                {submission?.status ? submission.status.replace('_', ' ') : ''}
              </div>
              <h2 className="text-2xl font-semibold">{submission.titulo}</h2>
              <p className="text-sm text-muted-foreground mt-2">ID da Submissão: #{submission.id}</p>
            </div>
            
            <Button asChild={!!submission.arquivo_pdf_path} variant="outline" className="shrink-0" disabled={!submission.arquivo_pdf_path}>
              {submission.arquivo_pdf_path ? (
                <a 
                  href={`${SUBMISSION_SERVICE_URL}/${submission.arquivo_pdf_path}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" /> Ler PDF
                </a>
              ) : (
                <span><FileText className="mr-2 h-4 w-4" /> Sem PDF</span>
              )}
            </Button>
          </div>
        </div>

        {submission.status === 'SUBMETIDO' ? (
          <div className="bg-muted/50 border rounded-2xl p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Pronto para avaliar?</h3>
            <p className="text-sm text-muted-foreground mb-6">Ao iniciar, o autor saberá que o artigo entrou na fase de análise de comitê.</p>
            <Button onClick={handleStartReview} disabled={isProcessing} size="lg">
              Iniciar Revisão
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Parecer do Revisor (Feedback)</label>
              <Textarea 
                placeholder="Descreva a metodologia, pontos fortes, pontos de melhoria..." 
                className="min-h-50"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isCompleted || isProcessing}
              />
            </div>

            {!isCompleted && (
              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                  onClick={() => handleFinishReview('REJEITADO')}
                  disabled={isProcessing}
                >
                  <X className="mr-2 h-4 w-4" /> Rejeitar Artigo
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleFinishReview('APROVADO')}
                  disabled={isProcessing}
                >
                  <Check className="mr-2 h-4 w-4" /> Aprovar Artigo
                </Button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}