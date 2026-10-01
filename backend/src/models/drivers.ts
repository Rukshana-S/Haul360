import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type DriverVerificationStatus = 'pending' | 'verified' | 'rejected';
export type DriverAvailabilityStatus = 'available' | 'unavailable' | 'on_trip' | 'inactive';

export interface IDriverAddress {
  city: string;
  state: string;
  pincode: string;
}

export interface IDriver {
  _id?: ObjectId;
  userId: ObjectId;
  fullName: string;
  age: number;
  mobile: string;
  email: string;
  address: IDriverAddress;
  profilePhoto?: string;
  verificationStatus: DriverVerificationStatus;
  availabilityStatus: DriverAvailabilityStatus;
  rating: number;
  totalTrips: number;
  createdAt: Date;
  updatedAt: Date;
}

export const DRIVERS_COLLECTION = 'drivers';

export const getDriversCollection = (): Collection<IDriver> => {
  return getDatabase().collection<IDriver>(DRIVERS_COLLECTION);
};
