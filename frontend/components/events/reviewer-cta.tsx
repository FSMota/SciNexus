'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { requestReviewerRole, checkReviewerStatus } from '@/services/event-api'

interface ReviewerCTAProps {
  eventId: number
}

export function ReviewerCTA({ eventId }: ReviewerCTAProps) {
  const { user, isAuthenticated } = useAuth()
  
  // Nossos estados de controle
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  // Assim que o componente aparece, verificamos se ele já enviou a solicitação
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoadingStatus(false)
      return
    }

    async function verifyStatus() {
      try {
        // Passamos o user.id real
        if (!user) {
          setIsLoadingStatus(false)
          return
        }
        const hasRequested = await checkReviewerStatus(eventId, user.id) 
        setAlreadyRequested(hasRequested)
      } catch (error) {
        console.error("Erro", error)
      } finally {
        setIsLoadingStatus(false)
      }
    }
    verifyStatus()
  }, [eventId, isAuthenticated, user])

  const handleRequestReviewer = async () => {
    if (!isAuthenticated || !user) return

    setIsSubmitting(true)
    try {
      // Passamos o user.id na hora de criar
      await requestReviewerRole(eventId, user.id) 
      setAlreadyRequested(true)
      toast.success('Solicitação enviada!')
    } catch (error: any) {
      toast.error('Erro na solicitação', { description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Se estiver carregando o status inicial, não mostramos nada para evitar "piscos" na tela
  if (isLoadingStatus) return null

  // Se o usuário não estiver logado, podemos esconder o bloco ou mostrar desabilitado
  if (!isAuthenticated) return null

  return (
    <div className="mt-12 rounded-2xl border bg-card/50 p-6 text-center shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-foreground">Quer fazer parte da comissão científica?</h3>
      <p className="text-muted-foreground mt-2 mb-6 text-sm max-w-md mx-auto">
        Ajude a avaliar os artigos submetidos, contribua para a qualidade deste evento e receba certificado como avaliador.
      </p>
      <Button 
        size="lg"
        onClick={handleRequestReviewer} 
        disabled={isSubmitting || alreadyRequested}
        variant={alreadyRequested ? "secondary" : "default"}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? 'Enviando...' : alreadyRequested ? 'Solicitação em Análise' : 'Solicitar vaga de Revisor'}
      </Button>
    </div>
  )
}