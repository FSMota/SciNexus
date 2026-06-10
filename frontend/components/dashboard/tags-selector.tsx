'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DICIONARIO_TAGS } from '@/constants/tags'

export function SeletorDeTagsExpertise({ tagsSalvas = [], onSalvar }: { tagsSalvas?: string[]; onSalvar: (tags: string[]) => void }) {
  // Garante que sempre seja um array, mesmo se o backend mandar null
  const tagsDoBanco = Array.isArray(tagsSalvas) ? tagsSalvas : []
  
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<keyof typeof DICIONARIO_TAGS | ''>('')
  const [minhasTags, setMinhasTags] = useState<string[]>(tagsDoBanco)

  // Sincroniza caso o hook useAuth demore a carregar
  useEffect(() => {
    if (tagsDoBanco.length > 0) {
      setMinhasTags(tagsDoBanco)
    }
  }, [tagsSalvas])

  const toggleTag = (tag: string) => {
    if (minhasTags.includes(tag)) {
      setMinhasTags(minhasTags.filter(t => t !== tag))
    } else {
      setMinhasTags([...minhasTags, tag])
    }
  }

  return (
    <div className="p-6 border rounded-xl bg-card">
      <h3 className="text-lg font-bold mb-4">Minhas Áreas de Expertise</h3>
      
      {/* NOVO: A VITRINE DO BANCO DE DADOS */}
      <div className="mb-6 pb-6 border-b border-border">
        <p className="text-sm font-medium text-muted-foreground mb-3">Atualmente salvas no seu perfil:</p>
        {minhasTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {minhasTags.map(tag => (
              <span key={`db-${tag}`} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-amber-600 italic bg-amber-50 p-2 rounded border border-amber-200">
            Você ainda não definiu suas áreas de expertise.
          </p>
        )}
      </div>

      {/* ÁREA DE EDIÇÃO */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-foreground">
          Adicionar ou remover expertises:
        </label>
        <select 
          className="w-full p-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value as any)}
        >
          <option value="">Selecione uma área para ver as opções...</option>
          <option value="tecnologia">Tecnologia & Computação</option>
          <option value="saude">Saúde & Ciências Biológicas</option>
          <option value="engenharia">Engenharia & Arquitetura</option>
          <option value="direito">Direito & Sistemas Jurídicos</option>
          <option value="educacao">Educação & Metodologias</option>
        </select>
      </div>

      {categoriaSelecionada && (
        <div className="mb-6 p-4 border rounded-md bg-muted/30">
          <div className="flex flex-wrap gap-2">
            {DICIONARIO_TAGS[categoriaSelecionada].map((tag) => {
              const isSelecionada = minhasTags.includes(tag)
              return (
                <button
                  key={`edit-${tag}`}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-all border ${
                    isSelecionada 
                      ? 'bg-primary text-primary-foreground border-primary font-medium scale-105'
                      : 'bg-background text-foreground border-input hover:bg-accent'
                  }`}
                >
                  {tag} {isSelecionada && '✓'}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Botão de Salvar */}
      <Button 
        onClick={() => onSalvar(minhasTags)} 
        className="w-full font-bold"
      >
        Atualizar Expertises
      </Button>
    </div>
  )
}