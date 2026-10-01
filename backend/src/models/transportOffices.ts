import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type TransportOfficeVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface ITransportOfficeAddress {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ITransportOffice {
  _id?: ObjectId;
  userId: ObjectId;
  officeName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: ITransportOfficeAddress;
  verificationStatus: TransportOfficeVerificationStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export const TRANSPORT_OFFICES_COLLECTION = 'transportOffices';

export const getTransportOfficesCollection = (): Collection<ITransportOffice> => {
  return getDatabase().collection<ITransportOffice>(TRANSPORT_OFFICES_COLLECTION);
};
