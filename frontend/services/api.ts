const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

    // Start with default headers for JSON
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Determine the final body and headers
    let finalBody: BodyInit | undefined = body ? JSON.stringify(body) : undefined;
    let finalHeaders = { ...defaultHeaders, ...options?.headers };

    // Special handling for FormData
    if (body instanceof FormData) {
      // Don't stringify the body
      finalBody = body;
      // Let the browser set the Content-Type for multipart/form-data
      // by deleting the one we set by default.
      delete (finalHeaders as any)['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: finalHeaders,
      body: finalBody,
    });

    // The native Response object doesn't have a `.data` property.
    // You need to parse the JSON body first.
    if (!response.ok) {
        // You might want to throw an error for bad responses
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Return the parsed JSON data instead of the whole response
    return response.json();
  },

  async put(endpoint: string, body?: unknown) {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
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
