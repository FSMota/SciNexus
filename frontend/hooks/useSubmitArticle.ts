import { useState } from 'react';
import { ArticleSubmissionFormData } from '../lib/schemas';
import { submitArticleToAPI } from '@/services/submission-api'; // <-- Nova importação

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
      formData.append('palavras_chave', data.palavras_chave);
      // Pega o primeiro arquivo do input de PDF
      formData.append('arquivo_pdf', data.arquivo_pdf[0]); 

      // Chama a função isolada que aponta para a porta 8003
      const responseData = await submitArticleToAPI(eventoId, formData);

      return responseData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitArticle, isLoading, error };
}