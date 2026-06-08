import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { articleSubmissionFormSchema, ArticleSubmissionFormData } from '../../lib/schemas';
import { useSubmitArticle } from '../../hooks/useSubmitArticle';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Props {
  eventoId?: number;
  readOnly?: boolean;
  initialData?: Partial<ArticleSubmissionFormData>;
}

export default function ArticleSubmissionForm({ eventoId, readOnly = false, initialData }: Props) {
  const { submitArticle, isLoading, error } = useSubmitArticle(eventoId || 0);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ArticleSubmissionFormData>({
    resolver: zodResolver(articleSubmissionFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ArticleSubmissionFormData) => {
    if (readOnly) return;
    
    try {
      await submitArticle(data);
      // O redirect ou alerta de sucesso é tratado no componente pai
      alert('Artigo submetido com sucesso!'); 
      // Coloque a rota exata da sua tela de "Meus Dados" aqui (ex: '/dashboard' ou '/profile')
      router.push('/dashboard');
    } catch (err) {
      console.error('Falha na submissão', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-4">
      {error && (
        <div className="text-destructive text-sm font-medium p-3 bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Artigo</Label>
        <Input
          id="titulo"
          {...register('titulo')}
          disabled={readOnly}
          className={readOnly ? 'bg-muted text-muted-foreground' : ''}
          placeholder="Ex: Análise de Algoritmos Genéticos..."
        />
        {errors.titulo && (
          <p className="text-sm text-destructive">{errors.titulo.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumo">Resumo do Artigo (Abstract)</Label>
        <Textarea
          id="resumo"
          {...register('resumo')}
          disabled={readOnly}
          className={`min-h-30 ${readOnly ? 'bg-muted text-muted-foreground' : ''}`}
          placeholder="Descreva brevemente o objetivo e resultados da pesquisa."
        />
        {errors.resumo && (
          <p className="text-sm text-destructive">{errors.resumo.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="palavras_chave">Palavras-chave</Label>
        <Input
          id="palavras_chave"
          {...register('palavras_chave')}
          disabled={readOnly}
          className={readOnly ? 'bg-muted text-muted-foreground' : ''}
          placeholder="Ex: IA, Machine Learning, Otimização (separadas por vírgula)"
        />
        {errors.palavras_chave && (
          <p className="text-sm text-destructive">{errors.palavras_chave.message as string}</p>
        )}
      </div>

      {/* Oculta os campos de envio de arquivo e termos se estiver apenas visualizando */}
      {!readOnly && (
        <>
          <div className="space-y-2">
            <Label htmlFor="arquivo_pdf">Arquivo do Artigo (PDF)</Label>
            <Input
              id="arquivo_pdf"
              type="file"
              accept="application/pdf"
              {...register('arquivo_pdf')}
              disabled={isLoading}
              className="cursor-pointer file:text-primary file:font-medium hover:bg-muted/50"
            />
            {errors.arquivo_pdf && (
              <p className="text-sm text-destructive">{errors.arquivo_pdf.message as string}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1 pt-2">
            <div className="flex items-center space-x-2">
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agreeTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                )}
              />
              <Label
                htmlFor="agreeTerms"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Declaro que este trabalho é original e concordo com os termos de submissão cega.
              </Label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-destructive block ml-6">
                {errors.agreeTerms.message as string}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Enviando...' : 'Submeter Artigo'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}