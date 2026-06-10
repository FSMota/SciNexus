'use client'

import { useState } from 'react'
import { DICIONARIO_TAGS } from '@/constants/tags'

interface SeletorDeTagsFormularioProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function SeletorDeTagsFormulario({ value = [], onChange }: SeletorDeTagsFormularioProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<keyof typeof DICIONARIO_TAGS | ''>('')

  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter(t => t !== tag)) // Remove
    } else {
      onChange([...value, tag]) // Adiciona
    }
  }

  return (
    <div className="p-4 border rounded-md bg-muted/10">
      {/* 1. Área das tags já selecionadas (Vitrine do Formulário) */}
      {value.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {value.map(tag => (
            <span key={`selected-${tag}`} className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20 flex items-center">
              {tag} 
              <button 
                type="button" 
                onClick={() => toggleTag(tag)} 
                className="ml-2 text-primary hover:text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 2. Filtro de Categoria */}
      <select
        className="w-full p-2 mb-4 border rounded-md text-sm bg-background"
        value={categoriaSelecionada}
        onChange={(e) => setCategoriaSelecionada(e.target.value as any)}
      >
        <option value="">Buscar tags na categoria...</option>
        <option value="tecnologia">Tecnologia & Computação</option>
        <option value="saude">Saúde & Ciências Biológicas</option>
        <option value="engenharia">Engenharia & Arquitetura</option>
        <option value="direito">Direito & Sistemas Jurídicos</option>
        <option value="educacao">Educação & Metodologias</option>
      </select>

      {/* 3. Botões clicáveis */}
      {categoriaSelecionada && (
        <div className="flex flex-wrap gap-2">
          {DICIONARIO_TAGS[categoriaSelecionada].map((tag) => {
            const isSelecionada = value.includes(tag)
            return (
              <button
                key={`option-${tag}`}
                type="button" // MUITO IMPORTANTE: previne que o botão envie o formulário inteiro
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full transition-all border ${
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
      )}
    </div>
  )
}