import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type RepairStatus =
  | 'RECEIVED'
  | 'DIAGNOSING'
  | 'REPAIRING'
  | 'READY_FOR_TESTING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface IRepairPart {
  name: string;
  partNumber?: string;
  cost: number;
  quantity: number;
}

export interface IRepairServiceItem {
  title: string;
  cost: number;
  completed?: boolean;
}

export interface IRepair {
  _id?: ObjectId;
  repairId: string;
  requestId: ObjectId | string;
  mechanicId: ObjectId;
  driverId?: ObjectId | string;
  driverName?: string;
  driverPhone?: string;
  vehicleId?: ObjectId | string;
  vehicleNumber?: string;
  vehicleType?: string;
  serviceCategory?: string;
  issueDescription: string;
  diagnosis?: string;
  serviceItems?: IRepairServiceItem[];
  parts?: IRepairPart[];
  laborAmount: number;
  partsAmount: number;
  totalAmount: number;
  status: RepairStatus;
  currentStepIndex: number;
  location?: {
    address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  arrivedAt?: Date;
  diagnosedAt?: Date;
  startedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const REPAIRS_COLLECTION = 'repairs';

export const getRepairsCollection = (): Collection<IRepair> => {
  return getDatabase().collection<IRepair>(REPAIRS_COLLECTION);
};
