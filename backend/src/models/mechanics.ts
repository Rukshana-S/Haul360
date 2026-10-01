import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type MechanicAvailabilityStatus = 'available' | 'busy' | 'offline';
export type MechanicVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IWorkshopDetails {
  workshopName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IServiceDetails {
  vehicleTypes: string[];
  availableFrom: string;
  availableTo: string;
  mechanicType: string;
}

export interface IMechanic {
  _id?: ObjectId;
  userId: ObjectId;
  fullName: string;
  mobile: string;
  email: string;
  profilePhoto?: string;
  experienceYears: number;
  experienceCertificate?: string;
  workshopDetails: IWorkshopDetails;
  serviceDetails: IServiceDetails;
  availabilityStatus: MechanicAvailabilityStatus;
  verificationStatus: MechanicVerificationStatus;
  rating: number;
  totalReviews: number;
  totalCompletedRepairs: number;
  createdAt: Date;
  updatedAt: Date;
}

export const MECHANICS_COLLECTION = 'mechanics';

export const getMechanicsCollection = (): Collection<IMechanic> => {
  return getDatabase().collection<IMechanic>(MECHANICS_COLLECTION);
};
