import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type SosEventStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELLED';

export interface ISosEvent {
  _id?: ObjectId;
  sosId: string;
  mechanicId: ObjectId;
  location: {
    address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  status: SosEventStatus;
  reason?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const SOS_EVENTS_COLLECTION = 'sosEvents';

export const getSosEventsCollection = (): Collection<ISosEvent> => {
  return getDatabase().collection<ISosEvent>(SOS_EVENTS_COLLECTION);
};
