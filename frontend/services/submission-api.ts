export type Submission = {
  id: number
  evento_id: number
  autor_principal_id: number
  titulo: string
  resumo: string
  palavras_chave: string[] // Na API pode vir como array, tratamos isso no componente
  arquivo_pdf_path: string
  status: 'SUBMETIDO' | 'EM_REVISAO' | 'APROVADO' | 'REJEITADO'
  created_at: string
  updated_at: string
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

// ... código existente do arquivo ...

export async function submitArticleToAPI(eventoId: number, formData: FormData): Promise<Submission> {
  const response = await fetch(`${SUBMISSION_SERVICE_URL}/eventos/${eventoId}/submissoes`, {
    method: 'POST',
    headers: getAuthHeaders(), // Usa a mesma função que você já criou nesse arquivo
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Falha ao submeter o artigo. Verifique os dados.'))
  }

  return response.json()
}