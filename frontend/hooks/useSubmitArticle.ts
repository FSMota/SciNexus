import { useState } from 'react';
import { submitArticleToAPI } from '@/services/submission-api';
import { ArticleSubmissionFormData } from '@/lib/schemas';

export function useSubmitArticle(eventoId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitArticle = async (data: ArticleSubmissionFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('resumo', data.resumo);
      
      console.log("Tags recebidas para submissão:", data.tags); // Log para depuração
      if (data.tags && data.tags.length > 0) {
        formData.append('palavras_chave', data.tags.join(','));
      } else {
        formData.append('palavras_chave', '');
      }

      // Adiciona o arquivo PDF
      if (data.arquivo_pdf && data.arquivo_pdf.length > 0) {
         formData.append('arquivo_pdf', data.arquivo_pdf[0]);
      }

      const result = await submitArticleToAPI(eventoId, formData);
      return result;
      
    } catch (err: any) {
      setError(err.message || 'Erro ao submeter o artigo.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitArticle, isLoading, error };
}