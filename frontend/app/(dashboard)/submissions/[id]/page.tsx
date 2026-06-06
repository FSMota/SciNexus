'use client'

import { useEffect, useState, use } from 'react';
import { getSubmissionById, Submission } from '@/services/submission-api'; // Usando o service que criamos!
import ArticleSubmissionForm from '@/components/forms/ArticleSubmissionForm';
import { TopNav } from '@/components/navigation/top-nav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Dicionário de cores e textos para cada status
const statusConfig: Record<string, { label: string; colorClass: string }> = {
  SUBMETIDO: { label: 'Submetido', colorClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  EM_REVISAO: { label: 'Em Revisão', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  APROVADO: { label: 'Aprovado', colorClass: 'bg-green-100 text-green-800 border-green-200' },
  REJEITADO: { label: 'Rejeitado', colorClass: 'bg-red-100 text-red-800 border-red-200' },
};

export default function SubmissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [submissao, setSubmissao] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getSubmissionById(id);
        
        // Converte a lista de palavras-chave de volta para string para o formulário ler corretamente
        if (Array.isArray(data.palavras_chave)) {
          data.palavras_chave = data.palavras_chave.join(', ') as any;
        }
        
        setSubmissao(data);
      } catch (error) {
        console.error("Erro ao carregar submissão", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando detalhes...</div>;
  if (!submissao) return <div className="p-8 text-center text-destructive">Submissão não encontrada.</div>;

  const statusInfo = statusConfig[submissao.status] || { label: submissao.status, colorClass: 'bg-gray-100 text-gray-800' };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        
        <div className="mb-8 space-y-4">
          <Link href="/dashboard">
            <Button variant="link" className="pl-0 text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Meus Dados
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalhes do Artigo</h1>
              <p className="text-muted-foreground mt-1">
                Visualização de dados submetidos para avaliação.
              </p>
            </div>
            
            {/* O Badge de Status Dinâmico */}
            <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide uppercase ${statusInfo.colorClass}`}>
              {statusInfo.label}
            </div>
          </div>
        </div>

        {/* Instancia o formulário em modo leitura com os dados injetados */}
        <ArticleSubmissionForm readOnly={true} initialData={submissao as any} />
        
      </main>
    </div>
  );
}