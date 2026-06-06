import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { articleSubmissionFormSchema, ArticleSubmissionFormData } from '../../../../lib/schemas'; // Ajuste o caminho
import { useSubmitArticle } from '../../../../hooks/useSubmitArticle'; // Ajuste o caminho

interface Props {
  eventoId: number;
}

export default function ArticleSubmissionForm({ eventoId }: Props) {
  const router = useRouter();
  const { submitArticle, isLoading, error } = useSubmitArticle(eventoId);

  // Inicialização do React Hook Form com Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleSubmissionFormData>({
    resolver: zodResolver(articleSubmissionFormSchema),
  });

  // Função disparada apenas se o Zod validar tudo com sucesso
  const onSubmit = async (data: ArticleSubmissionFormData) => {
    try {
      await submitArticle(data);
      alert('Artigo submetido com sucesso!');
      router.push('/dashboard/autor/submissoes'); // Redireciona o usuário
    } catch (err) {
      console.error('Falha na submissão', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto p-4">
      {/* Exibe erro geral da API, se houver */}
      {error && <div className="text-red-500 font-semibold p-2 bg-red-50 rounded">{error}</div>}

      <div>
        <label className="block font-medium">Título do Artigo:</label>
        <input
          type="text"
          {...register('titulo')}
          className="w-full border p-2 rounded"
          placeholder="Ex: Análise de Algoritmos Genéticos..."
        />
        {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo.message}</span>}
      </div>

      <div>
        <label className="block font-medium">Resumo do Artigo (Abstract):</label>
        <textarea
          {...register('resumo')}
          className="w-full border p-2 rounded h-32"
          placeholder="Descreva brevemente o objetivo e resultados da pesquisa."
        />
        {errors.resumo && <span className="text-red-500 text-sm">{errors.resumo.message}</span>}
      </div>

      <div>
        <label className="block font-medium">Palavras-chave:</label>
        <input
          type="text"
          {...register('palavras_chave')}
          className="w-full border p-2 rounded"
          placeholder="IA, Machine Learning, Otimização (separadas por vírgula)"
        />
        {errors.palavras_chave && <span className="text-red-500 text-sm">{errors.palavras_chave.message}</span>}
      </div>

      <div>
        <label className="block font-medium">Arquivo do Artigo (PDF):</label>
        <input
          type="file"
          accept="application/pdf"
          {...register('arquivo_pdf')}
          className="w-full border p-2 rounded"
        />
        {errors.arquivo_pdf && (
          <span className="text-red-500 text-sm">{errors.arquivo_pdf.message as string}</span>
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register('agreeTerms')} className="w-4 h-4" />
          <span>Declaro que este trabalho é original e concordo com os termos de submissão cega.</span>
        </label>
        {errors.agreeTerms && <span className="text-red-500 text-sm block">{errors.agreeTerms.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Enviando...' : 'Submeter Artigo'}
      </button>
    </form>
  );
}