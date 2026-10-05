import { Platform } from 'react-native';
import Constants from 'expo-constants';
import {
  ApiResponse,
  ApiError,
  RequestOptions,
  HealthCheckData,
} from './types';

/**
 * Extracts the dev machine's host IP (e.g. 192.168.1.35) from Expo Constants.
 */
const getDevServerHostIp = (): string | null => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).experienceUrl;

  if (typeof hostUri === 'string') {
    const cleanHost = hostUri.replace(/^[a-zA-Z]+:\/\//, '');
    const ip = cleanHost.split(':')[0]?.trim();
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  return null;
};

/**
 * Resolves the backend API base URL.
 * Automatically adapts:
 * - Physical Android/iOS mobile devices over Wi-Fi (replaces localhost with dev machine's LAN IP)
 * - Android Emulator (10.0.2.2)
 * - Web and Localhost
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\s+/g, '');
  const devHostIp = getDevServerHostIp();

  let resolvedUrl = envUrl || '';

  if (resolvedUrl) {
    if (Platform.OS !== 'web' && (resolvedUrl.includes('localhost') || resolvedUrl.includes('127.0.0.1'))) {
      if (devHostIp) {
        resolvedUrl = resolvedUrl.replace(/localhost|127\.0\.0\.1/g, devHostIp);
      } else if (Platform.OS === 'android') {
        resolvedUrl = resolvedUrl.replace(/localhost|127\.0\.0\.1/g, '10.0.2.2');
      }
    }
  } else {
    if (Platform.OS === 'web') {
      resolvedUrl = 'http://localhost:5000';
    } else if (devHostIp) {
      resolvedUrl = `http://${devHostIp}:5000`;
    } else if (Platform.OS === 'android') {
      resolvedUrl = 'http://10.0.2.2:5000';
    } else {
      resolvedUrl = 'http://localhost:5000';
    }
  }

  const cleanUrl = resolvedUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Centralized HTTP request function for the Haul360 mobile app.
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const baseUrl = getApiBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${normalizedEndpoint}`;

  const method = options.method || 'GET';
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options.timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      ...(options.body !== undefined
        ? { body: typeof options.body === 'string' ? options.body : JSON.stringify(options.body) }
        : {}),
    };

    const response = await fetch(fullUrl, fetchOptions);
    clearTimeout(timeoutId);

    let parsedData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      parsedData = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      parsedData = text ? { message: text } : null;
    }

    if (!response.ok) {
      const errorMessage =
        parsedData?.message ||
        `Request failed with status code ${response.status} (${response.statusText || 'Error'})`;
      throw new ApiError(errorMessage, response.status, parsedData);
    }

    return {
      success: true,
      statusCode: response.status,
      message: parsedData?.message,
      data: parsedData?.data !== undefined ? parsedData.data : (parsedData as T),
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your internet connection.', 408);
    }

    // Network level error (server unreachable / DNS / offline)
    const fallbackMessage = error.message || 'Unable to connect to the Haul360 server. Please try again.';
    throw new ApiError(fallbackMessage, 0);
  }
};

/**
 * Convenient API Client Wrapper
 */
export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Health Check Helper
   */
  checkHealth: async (): Promise<ApiResponse<HealthCheckData>> => {
    return apiRequest<HealthCheckData>('/health', { method: 'GET' });
  },
};

export default apiClient;
