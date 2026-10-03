import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type MechanicAvailability =
  | 'AVAILABLE'
  | 'BUSY'
  | 'OFFLINE';

export type MechanicAvailabilityStatus = MechanicAvailability;

export type MechanicVerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED';

export interface IWorkshopDetails {
  workshopName: string;
  address?: string;
  workshopAddress?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IServiceDetails {
  vehicleTypes: string[];
  serviceCategories?: string[];
  services?: string[];
  specializations?: string[];
  availableFrom?: string;
  availableTo?: string;
  mechanicType?: string;
  coverageRadius?: string;
  serviceRadiusKm?: number;
  workshopName?: string;
  workshopAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IMechanic {
  _id?: ObjectId;
  userId: ObjectId;
  fullName?: string;
  mobile?: string;
  email?: string;
  profilePhoto?: string;
  experienceYears?: number;
  experienceCertificate?: string;
  workshopDetails?: IWorkshopDetails;
  serviceDetails?: IServiceDetails;
  availability?: MechanicAvailability;
  sosMode?: boolean;
  verificationStatus?: MechanicVerificationStatus;
  verification?: {
    status: string;
  };
  rating?: number | { average: number; count: number };
  totalReviews?: number;
  totalCompletedRepairs?: number;
  stats?: {
    totalRepairsCompleted: number;
    totalRequestsReceived: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const MECHANICS_COLLECTION = 'mechanics';

export const getMechanicsCollection = (): Collection<IMechanic> => {
  return getDatabase().collection<IMechanic>(MECHANICS_COLLECTION);
};
