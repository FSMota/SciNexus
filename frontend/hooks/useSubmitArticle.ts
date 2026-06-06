import { useState } from 'react';
import { api } from '@/services/api'; // Sua instância do Axios (deve injetar o JWT automaticamente)
import { ArticleSubmissionFormData } from '../lib/schemas';

export function useSubmitArticle(eventoId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitArticle = async (data: ArticleSubmissionFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Criação do FormData para suportar envio de arquivos
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('resumo', data.resumo);
      formData.append('palavras_chave', data.palavras_chave);
      // Pega o primeiro arquivo do FileList
      formData.append('arquivo_pdf', data.arquivo_pdf[0]); 

      // 2. Chamada à API
      // O interceptor do axios deve colocar o 'Authorization: Bearer <token>'
      const response = await api.post(`/eventos/${eventoId}/submissoes`, formData, {
        headers: {
          // O navegador define o boundary do multipart automaticamente
          'Content-Type': 'multipart/form-data', 
        },
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ocorreu um erro ao submeter o artigo.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitArticle, isLoading, error };
}