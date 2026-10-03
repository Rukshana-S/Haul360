import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export interface IReview {
  _id?: ObjectId;
  reviewId: string;
  repairId?: ObjectId | string;
  mechanicId: ObjectId;
  reviewerId?: ObjectId | string;
  reviewerName: string;
  driverRole?: string;
  vehicleType?: string;
  serviceCategory?: string;
  rating: number; // 1 - 5
  comment: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const REVIEWS_COLLECTION = 'reviews';

export const getReviewsCollection = (): Collection<IReview> => {
  return getDatabase().collection<IReview>(REVIEWS_COLLECTION);
};
