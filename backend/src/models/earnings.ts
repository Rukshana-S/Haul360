import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type EarningStatus = 'PENDING' | 'PROCESSING' | 'SETTLED';
export type EarningType = 'SERVICE_PAYMENT' | 'BONUS' | 'ADJUSTMENT';

export interface IEarning {
  _id?: ObjectId;
  transactionId: string;
  mechanicId: ObjectId;
  repairId?: ObjectId | string;
  repairReference?: string;
  vehicleNumber?: string;
  serviceTitle?: string;
  amount: number;
  status: EarningStatus;
  type: EarningType;
  description?: string;
  paymentMode?: string;
  createdAt: Date;
  settledAt?: Date;
  updatedAt: Date;
}

export const EARNINGS_COLLECTION = 'earnings';

export const getEarningsCollection = (): Collection<IEarning> => {
  return getDatabase().collection<IEarning>(EARNINGS_COLLECTION);
};
