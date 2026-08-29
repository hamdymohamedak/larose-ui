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
  const method = init.method ?? 'GET';
  notifyApiRequest(fullUrl, method);
  try {
    response = await fetch(fullUrl, {
      headers: { 'Content-Type': 'application/json', ...init.headers },
      ...init,
    });
  } catch {
    notifyNetworkFailure();
    notifyApiResponse(fullUrl, method, 0, false);
    throw new ApiRequestError({
      code: 503,
      message: 'Network request failed. Check your connection.',
      retryable: true,
    });
  }

  notifyApiResponse(fullUrl, method, response.status, response.ok);

  if (!response.ok) {
    notifyNetworkFailure();
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
    notifyNetworkSuccess();
    return undefined as T;
  }

  notifyNetworkSuccess();
  return response.json() as Promise<T>;
}

function notifyNetworkFailure(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('larose:network-failure'));
  }
}

function notifyNetworkSuccess(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('larose:network-success'));
  }
}

function notifyApiRequest(url: string, method: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('larose:api-request', { detail: { url, method } }),
    );
  }
}

function notifyApiResponse(url: string, method: string, status: number, ok: boolean): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('larose:api-response', { detail: { url, method, status, ok } }),
    );
  }
}

export function isApiError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export function getRetryDelay(retryCount: number, baseMs = 1000): number {
  return Math.min(baseMs * 2 ** retryCount, 30000);
}
