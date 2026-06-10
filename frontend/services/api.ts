const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8000'

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export const api = {
  async get(endpoint: string) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    return response
  },

  async post(endpoint: string, body?: any, options?: RequestInit) {
    const token = getToken();

    let finalBody: BodyInit | undefined;
    
    // Inicia os headers baseados no options ou vazios
    const finalHeaders: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers as Record<string, string>),
    };

    // Estratégia de Body e Headers dinâmicos
    if (body instanceof FormData) {
      finalBody = body;
      // O navegador deve definir o Content-Type automaticamente para FormData
      delete finalHeaders['Content-Type'];
    } else if (body instanceof URLSearchParams) {
      // Usado para a rota de Login do FastAPI (OAuth2PasswordRequestForm)
      finalBody = body;
      finalHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (body) {
      // Padrão para rotas normais de cadastro e atualização
      finalBody = JSON.stringify(body);
      if (!finalHeaders['Content-Type']) {
        finalHeaders['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: finalHeaders,
      body: finalBody,
    });

    // Retorna o objeto Response nativo, delegando o .json() e o .ok para os hooks
    return response;
  },

  async patch(endpoint: string, body?: unknown) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    return response
  },

  async delete(endpoint: string) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    return response
  },
}
