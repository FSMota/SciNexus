'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { checkReviewerStatus } from '@/services/event-api'
// Importe o modal que acabamos de criar
import { ModalCandidaturaRevisor } from './reviewer-request-modal' 

interface ReviewerCTAProps {
  eventId: number
}

export function ReviewerCTA({ eventId }: ReviewerCTAProps) {
  const { user, isAuthenticated } = useAuth()
  
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  
  // NOVO: Estado que controla o modal
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        console.error("Erro", error)
      } finally {
        setIsLoadingStatus(false)
      }
    }
    verifyStatus()
  }, [eventId, isAuthenticated, user])

  if (isLoadingStatus || !isAuthenticated || !user) return null

  return (
    <div className="mt-12 rounded-2xl border bg-card/50 p-6 text-center shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-foreground">Quer fazer parte da comissão científica?</h3>
      <p className="text-muted-foreground mt-2 mb-6 text-sm max-w-md mx-auto">
        Ajude a avaliar os artigos submetidos, contribua para a qualidade deste evento e receba certificado como avaliador.
      </p>
      
      <Button 
        size="lg"
        // Em vez de fazer a API call direto, apenas abre o modal
        onClick={() => setIsModalOpen(true)} 
        disabled={alreadyRequested}
        variant={alreadyRequested ? "secondary" : "default"}
        className="w-full sm:w-auto"
      >
        {alreadyRequested ? 'Solicitação em Análise' : 'Solicitar vaga de Revisor'}
      </Button>

      {/* Renderização condicional do Modal */}
      {isModalOpen && (
        <ModalCandidaturaRevisor
          eventId={eventId}
          userId={user.id}
          onClose={() => setIsModalOpen(false)}
          // O Modal avisa quando o POST deu 200 OK, aí trancamos o botão
          onSuccess={() => setAlreadyRequested(true)} 
        />
      )}
    </div>
  )
}