import { Request } from 'express';
import { UserRole } from '../models/users';

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  userId: string;
  id?: string;
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
  workshopName?: string;
  workshopAddress?: string;
  address?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  yearsOfExperience?: number;
  experienceYears?: number;
  specializations?: string[];
  vehicleTypes?: string[];
  serviceRadiusKm?: number;
  coverageRadius?: string;
  support247?: boolean;
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
