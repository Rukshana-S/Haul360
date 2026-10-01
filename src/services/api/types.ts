export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  timeoutMs?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiErrorDetails {
  message: string;
  statusCode?: number;
  data?: unknown;
}

export class ApiError extends Error {
  public statusCode?: number;
  public data?: unknown;

  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export interface HealthCheckData {
  success: boolean;
  message: string;
  database: 'connected' | 'disconnected' | string;
}
