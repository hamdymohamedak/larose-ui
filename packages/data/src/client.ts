import { classifyHttpError, type ApiError } from '@larose/core';

export interface ApiFetchOptions extends RequestInit {
  baseUrl?: string;
}

export class ApiRequestError extends Error {
  constructor(public readonly apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiRequestError';
  }
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { baseUrl = '', ...init } = options;
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      headers: { 'Content-Type': 'application/json', ...init.headers },
      ...init,
    });
  } catch {
    throw new ApiRequestError({
      code: 503,
      message: 'Network request failed. Check your connection.',
      retryable: true,
    });
  }

  if (!response.ok) {
    let message: string | undefined;
    try {
      const body = (await response.json()) as { message?: string };
      message = body.message;
    } catch {
      // ignore parse errors
    }
    const apiError = classifyHttpError(response.status, message);
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('larose:session-expired', { detail: { code: 401 } }),
      );
    }
    throw new ApiRequestError(apiError);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function isApiError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export function getRetryDelay(retryCount: number, baseMs = 1000): number {
  return Math.min(baseMs * 2 ** retryCount, 30000);
}
