import { apiClient } from './client';
import { ApiResponse } from './types';

export type UserRole = 'driver' | 'mechanic' | 'organization' | 'transport_office';

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  mobile: string;
  email?: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  mobile: string;
  email?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type RegisteredUser = UserProfile;

export interface RegisterResponseData {
  user: UserProfile;
}

export interface LoginResponseData {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface MeResponseData {
  user: UserProfile;
}

export interface RefreshResponseData {
  accessToken: string;
}

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Register a new user account.
   */
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponseData>> => {
    return apiClient.post<RegisterResponseData>('/auth/register', {
      firstName: data.firstName.trim(),
      lastName: data.lastName ? data.lastName.trim() : undefined,
      mobile: data.mobile.trim().replace(/\D/g, ''),
      email: data.email ? data.email.trim().toLowerCase() : undefined,
      password: data.password,
      role: data.role,
    });
  },

  /**
   * Authenticate user with mobile and password.
   */
  login: async (
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponseData>> => {
    return apiClient.post<LoginResponseData>('/auth/login', {
      mobile: data.mobile.trim().replace(/\D/g, ''),
      password: data.password,
    });
  },

  /**
   * Retrieve currently authenticated user profile using Bearer token.
   */
  me: async (token: string): Promise<ApiResponse<MeResponseData>> => {
    return apiClient.get<MeResponseData>('/auth/me', { token });
  },

  /**
   * Refresh expired access token using refresh token.
   */
  refresh: async (refreshToken: string): Promise<ApiResponse<RefreshResponseData>> => {
    return apiClient.post<RefreshResponseData>('/auth/refresh', { refreshToken });
  },
};

export default authApi;
