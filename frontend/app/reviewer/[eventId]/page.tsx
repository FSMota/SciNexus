'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TopNav } from '@/components/navigation/top-nav'
import { getSubmissionsByEvent } from '@/services/submission-api'
import { ArrowLeft, FileSignature, Percent } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth' // <-- IMPORTADO O HOOK
import { Badge } from '@/components/ui/badge' // <-- IMPORTADO O BADGE

export default function ReviewerPanelPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Pegamos o usuário logado e garantimos que as tags sejam um array
  const { user } = useAuth()
  const reviewerTags = user?.tags || []

  useEffect(() => {
    // Busca TODOS os artigos submetidos no evento clicado
    getSubmissionsByEvent(parseInt(eventId))
      .then(data => {
        console.log("Artigos carregados:", data);
        setSubmissions(data);
      })
      .catch(err => {
        console.error(err)
        toast.error("Erro ao carregar os artigos do evento.")
      })
      .finally(() => setIsLoading(false))
  }, [eventId])

  console.log("Submissions carregadas:", submissions)

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
          <p className="text-muted-foreground">Escolha um artigo da lista abaixo para avaliar. Os artigos estão ordenados por afinidade com o seu perfil.</p>
        </div>

        {/* Legenda visual para a banca */}
        {submissions.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border">
            <span className="font-semibold text-foreground">Legenda de Afinidade:</span>
            <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300">
              ✓ Tag em comum com seu perfil
            </Badge>
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              Tag fora do perfil
            </Badge>
          </div>
        )}

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum artigo foi submetido para este evento ainda.
            </div>
          ) : (
            <ul className="divide-y">
              {submissions
                .map(sub => {
                  // 1. LÊ A VARIÁVEL CORRETA DO BACKEND (palavras_chave)
                  const rawTags = sub.palavras_chave || sub.tags || [];
                  let tagsDoArtigo: string[] = [];
                  
                  if (Array.isArray(rawTags)) {
                    tagsDoArtigo = rawTags;
                  } else if (typeof rawTags === 'string' && rawTags.trim() !== '') {
                    try { 
                      tagsDoArtigo = JSON.parse(rawTags);
                    } catch (e) {
                      tagsDoArtigo = rawTags.split(',').map((t: string) => t.trim());
                    }
                  }

                  // 2. FILTRA A "SUJEIRA" (Remove as strings 'undefined' geradas por erro no FormData)
                  tagsDoArtigo = tagsDoArtigo.filter(tag => 
                    tag && tag.toLowerCase() !== 'undefined'
                  );

                  // 3. CALCULA O JACCARD COM AS TAGS LIMPAS
                  let score = sub.jaccard_score;
                  if (score === undefined) {
                    if (tagsDoArtigo.length === 0 || reviewerTags.length === 0) {
                      score = 0;
                    } else {
                      const intersecao = tagsDoArtigo.filter(t => reviewerTags.includes(t)).length;
                      const uniao = new Set([...tagsDoArtigo, ...reviewerTags]).size;
                      score = intersecao / uniao;
                    }
                  }

                  return { ...sub, tagsTratadas: tagsDoArtigo, scoreCalculado: score };
                })
                .sort((a, b) => b.scoreCalculado - a.scoreCalculado)
                .map(sub => {
                  const temMatch = sub.tagsTratadas.some((tag: string) => reviewerTags.includes(tag));
                  
                  return (
                    <li 
                      key={sub.id} 
                      className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors ${
                        temMatch ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex-1">
                        {/* 1. Título isolado em cima */}
                        <h3 className="font-semibold text-lg mb-2">{sub.titulo}</h3>
                        
                        {/* 2. Status e Match lado a lado */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            sub.status === 'SUBMETIDO' ? 'bg-primary/10 text-primary' :
                            sub.status === 'EM_REVISAO' ? 'bg-yellow-500/10 text-yellow-600' :
                            sub.status === 'APROVADO' ? 'bg-green-500/10 text-green-600' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {sub.status.replace('_', ' ')}
                          </span>

                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                            sub.scoreCalculado > 0 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-muted text-muted-foreground border-border'
                          }`}>
                            <Percent className="w-3 h-3 mr-1" />
                            {(sub.scoreCalculado * 100).toFixed(0)}% Match
                          </span>
                        </div>

                        {/* 3. Renderização das Tags (com aviso caso venha vazio do backend) */}
                        {sub.tagsTratadas.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {sub.tagsTratadas.map((tag: string) => {
                              const isMatch = reviewerTags.includes(tag);
                              return isMatch ? (
                                <Badge key={`match-${tag}`} variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 font-bold px-2 py-0.5 shadow-sm">
                                  ✓ {tag}
                                </Badge>
                              ) : (
                                <Badge key={`miss-${tag}`} variant="outline" className="bg-muted text-muted-foreground font-normal px-2 py-0.5">
                                  {tag}
                                </Badge>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-amber-600 italic mt-1">
                            ⚠️ O backend não enviou tags para este artigo.
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 mt-4 sm:mt-0">
                        <Link href={`/submissions/${sub.id}/avaliar`}>
                          <Button variant={sub.status === 'SUBMETIDO' ? 'default' : 'secondary'} className="w-full sm:w-auto">
                            <FileSignature className="mr-2 h-4 w-4" />
                            {sub.status === 'SUBMETIDO' ? 'Iniciar Avaliação' : 'Ver Avaliação'}
                          </Button>
                        </Link>
                      </div>
                    </li>
                  )
                })}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}