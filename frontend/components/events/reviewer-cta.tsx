'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner' // Opcional: para dar o feedback de sucesso na tela
// IMPORTANTE: Traga a sua função de solicitar a vaga para cá (substitua pelo nome real se for diferente)
import { checkReviewerStatus, requestReviewerRole } from '@/services/event-api'

interface ReviewerCTAProps {
  eventId: number
}

export function ReviewerCTA({ eventId }: ReviewerCTAProps) {
  const { user, isAuthenticated } = useAuth()
  
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false) // Estado para o loading do botão

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoadingStatus(false)
      return
    }

    async function verifyStatus() {
      try {
        if (!user || !user.id) {
          throw new Error("Usuário não autenticado")
        }
        const hasRequested = await checkReviewerStatus(eventId, user.id) 
        setAlreadyRequested(hasRequested)
      } catch (error) {
        console.error("Erro ao verificar status:", error)
      } finally {
        setIsLoadingStatus(false)
      }
    }
    verifyStatus()
  }, [eventId, isAuthenticated, user])

  // Função que dispara quando o usuário clica no botão
  const handleRequestReviewer = async () => {
    if (!user) return

    try {
      setIsSubmitting(true)
      
      // Faça a chamada direta para o seu backend aqui
      await requestReviewerRole(eventId, user.id) 
      
      setAlreadyRequested(true)
      toast.success('Sua solicitação para revisor foi enviada com sucesso!')
      
    } catch (error: any) {
      toast.error('Erro ao enviar solicitação', { description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingStatus || !isAuthenticated || !user) return null

  return (
    <div className="mt-12 rounded-2xl border bg-card/50 p-6 text-center shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-foreground">Quer fazer parte da comissão científica?</h3>
      <p className="text-muted-foreground mt-2 mb-6 text-sm max-w-md mx-auto">
        Ajude a avaliar os artigos submetidos, contribua para a qualidade deste evento e receba certificado como avaliador.
      </p>
      
      <Button 
        size="lg"
        onClick={handleRequestReviewer} 
        disabled={alreadyRequested || isSubmitting}
        variant={alreadyRequested ? "secondary" : "default"}
        className="w-full sm:w-auto"
      >
        {isSubmitting 
          ? 'Enviando solicitação...' 
          : alreadyRequested 
            ? 'Solicitação em Análise' 
            : 'Solicitar vaga de Revisor'}
      </Button>
    </div>
  )
}