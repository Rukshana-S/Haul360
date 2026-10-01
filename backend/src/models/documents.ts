import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type DocumentType =
  | 'aadhaar'
  | 'pan'
  | 'voter_id'
  | 'driving_license'
  | 'rc_book'
  | 'vehicle_insurance'
  | 'experience_certificate'
  | 'other';

export type DocumentVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IDocument {
  _id?: ObjectId;
  userId: ObjectId;
  documentType: DocumentType;
  documentUrl: string; // Secure reference/URL only
  verificationStatus: DocumentVerificationStatus;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DOCUMENTS_COLLECTION = 'documents';

export const getDocumentsCollection = (): Collection<IDocument> => {
  return getDatabase().collection<IDocument>(DOCUMENTS_COLLECTION);
};
