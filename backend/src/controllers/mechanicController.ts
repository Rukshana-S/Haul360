import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { mechanicService } from '../services/mechanicService';
import { AppError } from '../middleware/errorHandler';

const getAuthUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?.userId || req.user?.id;
  if (!userId) {
    const error: AppError = new Error('Authentication required');
    error.statusCode = 401;
    throw error;
  }
  return userId;
};

// ==========================================
// PROFILE & SETTINGS
// ==========================================

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const profile = await mechanicService.getProfile(userId);
    res.status(200).json({
      success: true,
      message: 'Mechanic profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const {
      firstName,
      lastName,
      email,
      workshopName,
      workshopAddress,
      city,
      state,
      pincode,
      experienceYears,
      yearsOfExperience,
      mechanicType,
      services,
      serviceCategories,
      vehicleTypes,
      coverageRadius,
    } = req.body;

    const updatedProfile = await mechanicService.updateProfile(userId, {
      firstName,
      lastName,
      email,
      workshopName,
      workshopAddress,
      city,
      state,
      pincode,
      experienceYears,
      yearsOfExperience,
      mechanicType,
      services,
      serviceCategories,
      vehicleTypes,
      coverageRadius,
    });

    res.status(200).json({
      success: true,
      message: 'Mechanic profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const { availability } = req.body;
    if (!availability) {
      const error: AppError = new Error('Availability status is required');
      error.statusCode = 400;
      throw error;
    }

    const updated = await mechanicService.updateAvailability(userId, availability);
    res.status(200).json({
      success: true,
      message: 'Mechanic availability updated successfully',
      data: { availability: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSos = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      const error: AppError = new Error('SOS mode enabled parameter must be boolean');
      error.statusCode = 400;
      throw error;
    }

    const updated = await mechanicService.updateSos(userId, enabled);
    res.status(200).json({
      success: true,
      message: '24/7 SOS mode preference updated successfully',
      data: { enabled: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const summary = await mechanicService.getSummary(userId);
    res.status(200).json({
      success: true,
      message: 'Mechanic summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// SERVICE REQUESTS
// ==========================================

export const getRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const requests = await mechanicService.getRequests(userId);
    res.status(200).json({
      success: true,
      message: 'Service requests retrieved successfully',
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const request = await mechanicService.getRequestById(userId, id);
    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const result = await mechanicService.acceptRequest(userId, id);
    res.status(200).json({
      success: true,
      message: 'Service request accepted and repair ticket created',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const result = await mechanicService.rejectRequest(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// REPAIRS
// ==========================================

export const getRepairs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const filter = typeof req.query.filter === 'string' ? req.query.filter : undefined;
    const repairs = await mechanicService.getRepairs(userId, filter);
    res.status(200).json({
      success: true,
      data: repairs,
    });
  } catch (error) {
    next(error);
  }
};

export const getRepairById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const repair = await mechanicService.getRepairById(userId, id);
    res.status(200).json({
      success: true,
      data: repair,
    });
  } catch (error) {
    next(error);
  }
};

export const arriveRepair = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const repair = await mechanicService.advanceRepairStatus(userId, id, 'DIAGNOSING');
    res.status(200).json({
      success: true,
      message: 'Mechanic marked arrived on breakdown site',
      data: repair,
    });
  } catch (error) {
    next(error);
  }
};

export const diagnoseRepair = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const repair = await mechanicService.advanceRepairStatus(userId, id, 'DIAGNOSING');
    res.status(200).json({
      success: true,
      message: 'Repair moved to diagnosis stage',
      data: repair,
    });
  } catch (error) {
    next(error);
  }
};

export const startRepair = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const repair = await mechanicService.advanceRepairStatus(userId, id, 'REPAIRING');
    res.status(200).json({
      success: true,
      message: 'Repair overhaul started',
      data: repair,
    });
  } catch (error) {
    next(error);
  }
};

export const readyRepair = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const repair = await mechanicService.advanceRepairStatus(userId, id, 'READY_FOR_TESTING');
    res.status(200).json({
      success: true,
      message: 'Repair completed and ready for road test',
      data: repair,
    });
  } catch (error) {
    next(error);
  }
};

export const completeRepair = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const repair = await mechanicService.advanceRepairStatus(userId, id, 'COMPLETED');
    res.status(200).json({
      success: true,
      message: 'Repair successfully completed, signed off, and settled',
      data: repair,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// SERVICE HISTORY
// ==========================================

export const getServiceHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const history = await mechanicService.getServiceHistory(userId, category);
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EARNINGS
// ==========================================

export const getEarnings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const filter = typeof req.query.filter === 'string' ? req.query.filter : undefined;
    const earnings = await mechanicService.getEarnings(userId, filter);
    res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    next(error);
  }
};

export const getEarningsSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const summary = await mechanicService.getEarningsSummary(userId);
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// REVIEWS
// ==========================================

export const getReviews = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const rating = typeof req.query.rating === 'string' ? req.query.rating : undefined;
    const reviews = await mechanicService.getReviews(userId, rating);
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const summary = await mechanicService.getReviewsSummary(userId);
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DOCUMENTS
// ==========================================

export const getDocuments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const documents = await mechanicService.getDocuments(userId);
    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const document = await mechanicService.getDocumentById(userId, id);
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// SOS EVENTS
// ==========================================

export const triggerSos = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const { location, reason } = req.body;
    const event = await mechanicService.triggerSosEvent(userId, location, reason);
    res.status(201).json({
      success: true,
      message: 'Highway SOS event triggered successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveSos = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const result = await mechanicService.resolveSosEvent(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
