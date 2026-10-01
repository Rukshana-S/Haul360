import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type VehicleStatus = 'active' | 'inactive' | 'maintenance' | 'on_trip';

export interface IVehicle {
  _id?: ObjectId;
  driverId: ObjectId;
  vehicleNumber: string;
  vehicleType: string;
  capacityKg: number; // Stored in KG as primary storage unit
  make?: string;
  model?: string;
  year?: number;
  insuranceDocument?: string;
  rcDocument?: string;
  fastagId?: string;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const VEHICLES_COLLECTION = 'vehicles';

export const getVehiclesCollection = (): Collection<IVehicle> => {
  return getDatabase().collection<IVehicle>(VEHICLES_COLLECTION);
};
