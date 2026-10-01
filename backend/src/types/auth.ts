import { Request } from 'express';
import { UserRole } from '../models/users';

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface RegisterDTO {
  firstName: string;
  lastName?: string;
  mobile: string;
  email?: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  mobile: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface UserResponseData {
  id: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  mobile: string;
  email?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
