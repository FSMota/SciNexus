'use client'

import { useEffect, useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { getEventReviewerCandidates, decideReviewerRole, type EventRelation } from '@/services/event-api'

interface ReviewerRequestsManagerProps {
  eventId: number
}

export function ReviewerRequestsManager({ eventId }: ReviewerRequestsManagerProps) {
  const { user, isAuthenticated } = useAuth()
  const [requests, setRequests] = useState<EventRelation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    async function loadRequests() {
      try {
        const candidates = await getEventReviewerCandidates(eventId)
        // Opcional: Se quiser mostrar apenas os pendentes, descomente a linha abaixo
        // const pendingOnly = candidates.filter(c => c.status === 'pendente')
        setRequests(candidates)
      } catch (error: any) {
        toast.error('Erro ao carregar candidatos', { description: error.message })
      } finally {
        setIsLoading(false)
      }
    }

    loadRequests()
  }, [eventId, isAuthenticated])

  const handleDecision = async (candidateUserId: number, decision: 'approve' | 'reject') => {
    if (!user) return
    
    setProcessingId(candidateUserId)
    try {
      await decideReviewerRole(eventId, candidateUserId, user.id, decision)
      
      // Atualiza a lista localmente para refletir a mudança sem precisar recarregar
      setRequests(prev => prev.map(req => 
        req.user_id === candidateUserId 
          ? { ...req, status: decision === 'approve' ? 'ativo' : 'rejeitado' } 
          : req
      ))
      
      toast.success(decision === 'approve' ? 'Revisor aprovado!' : 'Solicitação rejeitada.')
    } catch (error: any) {
      toast.error('Erro ao processar decisão', { description: error.message })
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground flex justify-center"><Loader2 className="animate-spin" /></div>
  }

  const pendingRequests = requests.filter(req => req.status === 'pendente')
  const processedRequests = requests.filter(req => req.status !== 'pendente')

  return (
    <div className="space-y-6">
      {/* SEÇÃO 1: Solicitações Pendentes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Aguardando Avaliação ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground border rounded-lg p-6 text-center bg-muted/50">
            Não há solicitações pendentes no momento.
          </p>
        ) : (
          <ul className="space-y-3">
            {pendingRequests.map(req => (
              <li key={req.id} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                <div>
                  <p className="font-medium">Usuário #{req.user_id}</p>
                  <p className="text-xs text-muted-foreground">
                    Solicitado em {new Date(req.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                    disabled={processingId === req.user_id}
                    onClick={() => handleDecision(req.user_id, 'reject')}
                  >
                    {processingId === req.user_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                    Não
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={processingId === req.user_id}
                    onClick={() => handleDecision(req.user_id, 'approve')}
                  >
                    {processingId === req.user_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    Sim
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SEÇÃO 2: Histórico (Opcional, para o organizador ver quem ele já aprovou) */}
      {processedRequests.length > 0 && (
        <div className="pt-6 border-t">
          <h3 className="text-md font-medium text-muted-foreground mb-4">Processados ({processedRequests.length})</h3>
          <ul className="space-y-2 opacity-70">
            {processedRequests.map(req => (
              <li key={req.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                <span className="text-sm">Usuário #{req.user_id}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${req.status === 'ativo' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                  {req.status === 'ativo' ? 'Aprovado' : 'Rejeitado'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}