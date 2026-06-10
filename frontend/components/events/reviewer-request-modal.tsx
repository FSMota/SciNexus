'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { requestReviewerRole } from '@/services/event-api'

interface ModalCandidaturaRevisorProps {
  eventId: number
  userId: number
  onClose: () => void
  onSuccess: () => void
}

export function ModalCandidaturaRevisor({ eventId, userId, onClose, onSuccess }: ModalCandidaturaRevisorProps) {
  const [tags, setTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault()
      const newTag = inputValue.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (tags.length === 0) {
      toast.error('Adicione pelo menos uma área de expertise.')
      return
    }

    setIsSubmitting(true)
    try {
      // ATENÇÃO: Você precisará atualizar essa função no event-api.ts para aceitar o 3º parâmetro (tags)
      await requestReviewerRole(eventId, userId, tags) 
      toast.success('Solicitação enviada com sucesso!')
      onSuccess() // Avisa o ReviewerCTA que deu certo
      onClose()   // Fecha o modal
    } catch (error: any) {
      toast.error('Erro na solicitação', { description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-lg border">
        <h2 className="text-xl font-bold mb-2 text-foreground">Suas áreas de expertise</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Digite suas áreas de domínio (ex: python, inteligência artificial) e pressione <strong>Enter</strong> para adicionar. O sistema usará isso para te recomendar os melhores artigos.
        </p>

        {/* Input de Tags (Chips) */}
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-card focus-within:ring-2 focus-within:ring-ring">
          {tags.map((tag, index) => (
            <span key={index} className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-2 font-bold hover:text-red-500">
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-30 p-1 text-foreground"
            placeholder={tags.length === 0 ? "Digite e aperte Enter..." : ""}
          />
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Confirmar Candidatura'}
          </Button>
        </div>
      </div>
    </div>
  )
}