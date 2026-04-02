/**
 * apiClient.ts — Cliente HTTP centralizado do Dycore
 * ====================================================
 * Injeta automaticamente o token JWT em todas as requisições à API.
 * Em caso de 401 (token expirado), faz logout automático.
 *
 * Uso:
 *   import { api } from '@/lib/apiClient';
 *
 *   const clientes = await api.get('/clientes');
 *   await api.post('/vendas', { ... });
 */

const BASE_URL = '/api';

/** Recupera o token JWT armazenado na sessão */
function getToken(): string | null {
  return sessionStorage.getItem('dycore_token');
}

/** Armazena o token JWT na sessão */
export function setToken(token: string): void {
  sessionStorage.setItem('dycore_token', token);
}

/** Remove o token JWT da sessão */
export function clearToken(): void {
  sessionStorage.removeItem('dycore_token');
}

/** Callback opcional para logout automático ao receber 401 */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedCallback(cb: () => void): void {
  onUnauthorized = cb;
}

/** Função principal de fetch com JWT injetado automaticamente */
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token expirado ou inválido: logout automático
  if (response.status === 401) {
    clearToken();
    if (onUnauthorized) {
      onUnauthorized();
    }
  }

  return response;
}

/** Processa a resposta e lança erro legível se necessário */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type') || '';

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;
    if (contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => ({}));
      errorMessage = errorData.erro || errorData.message || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  // Para respostas binárias (ex: PDF)
  return response as unknown as T;
}

/** API client com métodos HTTP tipados */
export const api = {
  /** GET /api/{endpoint} */
  async get<T = unknown>(endpoint: string): Promise<T> {
    const response = await fetchWithAuth(endpoint, { method: 'GET' });
    return handleResponse<T>(response);
  },

  /** POST /api/{endpoint} */
  async post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  /** PUT /api/{endpoint} */
  async put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  /** DELETE /api/{endpoint} */
  async delete<T = unknown>(endpoint: string): Promise<T> {
    const response = await fetchWithAuth(endpoint, { method: 'DELETE' });
    return handleResponse<T>(response);
  },

  /** Baixar arquivo binário (PDF) */
  async download(endpoint: string): Promise<Blob> {
    const response = await fetchWithAuth(endpoint, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Erro ao baixar arquivo: ${response.status}`);
    }
    return response.blob();
  },
};
