/**
 * Lightweight API helper using fetch.
 * - Reads access token from sessionStorage (default key: 'accessToken')
 * - Supports dynamic URL params (:id or {id}), query params, body, headers
 * - Exposes convenience methods: get, post, put, del
 */

export type RequestOptions = {
  method?: string;
  query?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  tokenKey?: string; // sessionStorage key for access token (default: 'accessToken')
  credentials?: RequestCredentials;
  responseType?: 'json' | 'text' | 'blob';
};

export const getAccessToken = (tokenKey = 'accessToken'): string | null => {
  try {
    const token = sessionStorage.getItem(tokenKey);
    return token;
  } catch (err) {
    // If sessionStorage is unavailable (SSR), return null
    // eslint-disable-next-line no-console
    console.warn('sessionStorage not available', err);
    return null;
  }
};

export const buildUrl = (
  url: string,
  query?: Record<string, any>,
  params?: Record<string, any>
): string => {
  let finalUrl = url;

  // Replace path params - supports :id and {id}
  if (params) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      const encoded = encodeURIComponent(String(value));
      finalUrl = finalUrl.replace(new RegExp(`:${key}\\b`, 'g'), encoded);
      finalUrl = finalUrl.replace(new RegExp(`\\{${key}\\}`, 'g'), encoded);
    });
  }

  // Append query string
  if (query && Object.keys(query).length) {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach((item) => searchParams.append(k, String(item)));
      } else if (typeof v === 'object') {
        // JSON-encode objects
        searchParams.append(k, JSON.stringify(v));
      } else {
        searchParams.append(k, String(v));
      }
    });
    const qs = searchParams.toString();
    finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
  }

  return finalUrl;
};

export async function request<T = any>(
  url: string,
  opts: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    query,
    params,
    body,
    headers: customHeaders = {},
    tokenKey = 'accessToken',
    credentials,
    responseType = 'json',
  } = opts;

  const finalUrl = buildUrl(url, query, params);

  const headers: Record<string, string> = { ...customHeaders };

  let bodyToSend: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      bodyToSend = body;
      // Let browser set Content-Type for FormData
    } else if (typeof body === 'object' && !(typeof body === 'string')) {
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
      bodyToSend = headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : (body as any);
    } else {
      bodyToSend = String(body);
    }
  }

  const token = getAccessToken(tokenKey);
  const sessionId = sessionStorage.getItem('sessionId');

  if (token) {
    if (sessionId) {
      headers['Authorization'] = `Bearer ${sessionId} ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(finalUrl, {
    method,
    headers,
    body: method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD' ? undefined : bodyToSend,
    credentials,
  });

  const text = await response.text();
  let data: any = text;

  try {
    if (responseType === 'json' && text) data = JSON.parse(text);
    else if (responseType === 'blob') data = await response.blob();
  } catch (err) {
    // ignore JSON parse errors
  }

  if (!response.ok) {
    const error: any = new Error(response.statusText || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

// Convenience methods
export const get = <T = any>(url: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
  request<T>(url, { ...opts, method: 'GET' });

export const post = <T = any>(url: string, body?: any, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
  request<T>(url, { ...opts, method: 'POST', body });

export const put = <T = any>(url: string, body?: any, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
  request<T>(url, { ...opts, method: 'PUT', body });

export const del = <T = any>(url: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
  request<T>(url, { ...opts, method: 'DELETE' });
