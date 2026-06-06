'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import ArticleSubmissionForm from '@/components/forms/ArticleSubmissionForm'; // Ajuste o caminho
import { TopNav } from '@/components/navigation/top-nav';

export default function SubmissionDetailsPage() {
  const params = useParams();
  const [submissao, setSubmissao] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await api.get(`/eventos/submissoes/${params.id}`);
        const data = await response.json();
        
        // Converte as palavras-chave de array para string pro form entender
        data.palavras_chave = data.palavras_chave?.join(', ') || '';
        setSubmissao(data);
      } catch (error) {
        console.error("Erro ao carregar submissão", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchDetails();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!submissao) return <div className="p-8 text-center text-red-500">Submissão não encontrada.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Submissão</h1>
            <p className="text-muted-foreground mt-1">
              Status atual: <strong className="uppercase text-primary">{submissao.status}</strong>
            </p>
          </div>
          
          {/* Se quiser baixar o PDF salvo */}
          {submissao.arquivo_pdf_path && (
            <a 
              href={`http://localhost:8003/${submissao.arquivo_pdf_path}`}
              target="_blank"
              rel="noreferrer"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium"
            >
              Baixar PDF
            </a>
          )}
        </div>

        {/* Instancia o formulário em modo leitura com os dados injetados */}
        <ArticleSubmissionForm readOnly={true} initialData={submissao} />
        
        {/* Futuramente, você pode colocar os comentários do Revisor logo aqui abaixo! */}
      </main>
    </div>
  );
}