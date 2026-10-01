import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type UserRole = 'driver' | 'mechanic' | 'organization' | 'transport_office';

export interface IUser {
  _id?: ObjectId;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  mobile: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export const USERS_COLLECTION = 'users';

export const getUsersCollection = (): Collection<IUser> => {
  return getDatabase().collection<IUser>(USERS_COLLECTION);
};
