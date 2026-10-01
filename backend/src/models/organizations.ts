import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type OrganizationVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IBusinessAddress {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrganization {
  _id?: ObjectId;
  userId: ObjectId;
  organizationName: string;
  ownerName: string;
  mobile: string;
  email: string;
  gstNumber: string;
  businessAddress: IBusinessAddress;
  organizationType: string;
  verificationStatus: OrganizationVerificationStatus;
  rating: number;
  totalShipments: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ORGANIZATIONS_COLLECTION = 'organizations';

export const getOrganizationsCollection = (): Collection<IOrganization> => {
  return getDatabase().collection<IOrganization>(ORGANIZATIONS_COLLECTION);
};
