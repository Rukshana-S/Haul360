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

export interface RegisteredUser {
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

export interface RegisterResponseData {
  user: RegisteredUser;
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
};

export default authApi;
