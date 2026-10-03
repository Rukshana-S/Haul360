import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type ServiceRequestStatus =
  | 'PENDING'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ServiceRequestUrgency = 'SOS' | 'URGENT' | 'NORMAL' | 'SCHEDULED';

export interface IServiceRequest {
  _id?: ObjectId;
  requestId: string;
  vehicleId?: ObjectId | string;
  driverId?: ObjectId | string;
  organizationId?: ObjectId | string;
  assignedMechanicId?: ObjectId;
  rejectedMechanicIds?: ObjectId[];
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  serviceCategory?: string;
  requestedServices: string[];
  issueDescription: string;
  location: {
    address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    distanceKm?: number;
  };
  urgency: ServiceRequestUrgency;
  isEmergency?: boolean;
  isScheduled?: boolean;
  scheduledAt?: Date;
  estimatedCost?: number;
  status: ServiceRequestStatus;
  acceptedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const SERVICE_REQUESTS_COLLECTION = 'serviceRequests';

export const getServiceRequestsCollection = (): Collection<IServiceRequest> => {
  return getDatabase().collection<IServiceRequest>(SERVICE_REQUESTS_COLLECTION);
};
