export type Submission = {
  id: number
  evento_id: number
  autor_principal_id: number
  titulo: string
  resumo: string
  palavras_chave: string[] 
  arquivo_pdf_path: string
  status: 'pendente' | 'em revisão' | 'aprovado' | 'rejeitado' | 'SUBMETIDO' | 'EM_REVISAO' | 'APROVADO' | 'REJEITADO'
  created_at: string
  updated_at: string
  feedback?: string | null
}

const SUBMISSION_SERVICE_URL = process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URL || 'http://localhost:8003'

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string; detail?: string } | null
    return payload?.message || payload?.detail || fallback
  } catch {
    return fallback
  }
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  return {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

// 1. Busca todas as submissões do usuário logado
export async function getMySubmissions(): Promise<Submission[]> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/minhas-submissoes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao carregar suas submissões'))
  }

  return response.json()
}

// 2. Busca os detalhes de um artigo específico para a tela de visualização
export async function getSubmissionById(id: string | number): Promise<Submission> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/submissoes/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao carregar detalhes da submissão'))
  }

  return response.json()
}

// 3. Submeter Artigo - O SEU HOOK CONTINUA FUNCIONANDO AQUI!
export async function submitArticleToAPI(eventoId: number, formData: FormData): Promise<Submission> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/${eventoId}/submissoes`, {
    method: 'POST',
    headers: getAuthHeaders(), // O navegador calcula o multipart/form-data sozinho. Perfeito!
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao submeter o artigo. Verifique os dados.'))
  }

  return response.json()
}

// 4. Busca artigos do evento - URL CORRIGIDA PARA COMBINAR COM O FASTAPI
export async function getSubmissionsByEvent(eventId: number): Promise<Submission[]> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/${eventId}/submissoes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Falha ao carregar artigos do evento')
  return response.json()
}

// 5. Iniciar Revisão
export async function startSubmissionReview(submissionId: number): Promise<Submission> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/${submissionId}/iniciar-revisao`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error('Falha ao iniciar revisão.')
  return response.json()
}

// 6. Enviar Feedback - CABEÇALHO CONTENT-TYPE ADICIONADO PARA O JSON
export async function submitReviewFeedback(
  submissionId: number, 
  status: 'APROVADO' | 'REJEITADO', 
  feedback: string
): Promise<Submission> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/${submissionId}/avaliar`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json' // Avisa o FastAPI que isso é um payload JSON
    },
    body: JSON.stringify({ status, feedback }),
  })

  if (!response.ok) throw new Error('Falha ao enviar avaliação.')
  return response.json()
}