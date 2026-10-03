import { ObjectId } from 'mongodb';
import { getMechanicsCollection, IMechanic } from '../models/mechanics';
import { getUsersCollection, IUser } from '../models/users';
import {
  getServiceRequestsCollection,
  IServiceRequest,
  ServiceRequestStatus,
  ServiceRequestUrgency,
} from '../models/serviceRequests';
import {
  getRepairsCollection,
  IRepair,
  RepairStatus,
} from '../models/repairs';
import {
  getEarningsCollection,
  IEarning,
  EarningStatus,
  EarningType,
} from '../models/earnings';
import { getReviewsCollection, IReview } from '../models/reviews';
import {
  getDocumentsCollection,
  IDocument,
} from '../models/documents';
import {
  getSosEventsCollection,
  ISosEvent,
} from '../models/sosEvents';
import { AppError } from '../middleware/errorHandler';

export interface UpdateMechanicProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePhoto?: string;
  experienceYears?: number | string;
  yearsOfExperience?: string;
  mechanicType?: string;
  workshopName?: string;
  workshopAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  serviceCategories?: string[];
  services?: string[];
  vehicleTypes?: string[];
  coverageRadius?: string;
}

export interface MechanicProfileResponseDTO {
  userId: string;
  mechanicId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  email: string;
  profilePhoto?: string;
  experienceYears: number;
  yearsOfExperience: string;
  mechanicType: string;
  workshopName: string;
  workshopAddress: string;
  city: string;
  state: string;
  pincode: string;
  services: string[];
  serviceCategories: string[];
  vehicleTypes: string[];
  coverageRadius: string;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  sosMode: boolean;
  verificationStatus: string;
  rating: number;
  totalReviews: number;
  totalCompletedRepairs: number;
}

export interface MechanicSummaryResponseDTO {
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  sosMode: boolean;
  rating: number;
  totalRequests: number;
  activeRepairs: number;
  completedRepairs: number;
  dailyEarnings: number;
}

export class MechanicService {
  /**
   * Helper to normalize availability status string to standard uppercase enum.
   */
  private normalizeAvailability(status?: string): 'AVAILABLE' | 'BUSY' | 'OFFLINE' {
    const s = (status || '').toUpperCase();
    if (s === 'AVAILABLE' || s === 'BUSY' || s === 'OFFLINE') {
      return s;
    }
    return 'OFFLINE';
  }

  /**
   * Fetch mechanic document and associated user, self-healing if missing.
   */
  public async getMechanicRecord(userIdStr: string): Promise<{ mechanic: IMechanic; user: IUser }> {
    if (!ObjectId.isValid(userIdStr)) {
      const error: AppError = new Error('Invalid user identifier');
      error.statusCode = 400;
      throw error;
    }

    const userId = new ObjectId(userIdStr);
    const usersCollection = getUsersCollection();
    const mechanicsCollection = getMechanicsCollection();

    const user = await usersCollection.findOne({ _id: userId });
    if (!user || user.role !== 'mechanic') {
      const error: AppError = new Error('Mechanic profile not found or unauthorized role');
      error.statusCode = 403;
      throw error;
    }

    let mechanic = await mechanicsCollection.findOne({ userId });
    if (!mechanic) {
      const now = new Date();
      const newMechanic: IMechanic = {
        userId,
        experienceYears: 10,
        serviceDetails: {
          workshopName: `${user.firstName || 'Commercial'} Fleet Repair Hub`,
          workshopAddress: 'NH-48 Express Corridor',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
          specializations: ['Air Brakes', 'Heavy Electricals', 'BS-VI Engines'],
          services: [
            'Engine & Powertrain Diagnostics',
            'Air Brakes & Pneumatic Overhaul',
            'Heavy Electricals & Alternators',
            'Hydraulic Steering & Suspension',
            'Tyre Replacement & 50T Jacking',
          ],
          serviceCategories: [
            'Engine & Powertrain Diagnostics',
            'Air Brakes & Pneumatic Overhaul',
            'Heavy Electricals & Alternators',
          ],
          vehicleTypes: [
            '16-22 Wheeler Multi-Axle',
            'Heavy Dumpers & Tippers',
            'LCVs & Cargo Vans',
          ],
          coverageRadius: '35 km Patrol Ring',
          serviceRadiusKm: 35,
        },
        availability: 'AVAILABLE',
        sosMode: true,
        verification: {
          status: 'PENDING',
        },
        rating: {
          average: 4.9,
          count: 48,
        },
        stats: {
          totalRepairsCompleted: 120,
          totalRequestsReceived: 145,
        },
        createdAt: now,
        updatedAt: now,
      };

      const insertResult = await mechanicsCollection.insertOne(newMechanic);
      mechanic = { ...newMechanic, _id: insertResult.insertedId };
    }

    return { mechanic, user };
  }

  // ==========================================
  // PROFILE & SETTINGS
  // ==========================================

  public async getProfile(userIdStr: string): Promise<MechanicProfileResponseDTO> {
    const { mechanic, user } = await this.getMechanicRecord(userIdStr);

    const safeFirstName = user.firstName || '';
    const safeLastName = user.lastName || '';
    const fullName = [safeFirstName, safeLastName].filter(Boolean).join(' ').trim() || 'Mechanic';

    const serviceDetails = mechanic.serviceDetails || {
      workshopName: '',
      workshopAddress: '',
      city: '',
      state: '',
      pincode: '',
      services: [],
      serviceCategories: [],
      vehicleTypes: [],
      coverageRadius: '35 km Patrol Ring',
    };

    const expYears = mechanic.experienceYears ?? 10;
    const servicesList = serviceDetails.services?.length
      ? serviceDetails.services
      : serviceDetails.specializations || [];

    return {
      userId: user._id!.toString(),
      mechanicId: mechanic._id!.toString(),
      firstName: safeFirstName,
      lastName: safeLastName,
      fullName,
      mobile: user.mobile || '',
      email: user.email || '',
      experienceYears: expYears,
      yearsOfExperience: `${expYears}+ Years`,
      mechanicType: 'General Heavy Commercial',
      workshopName: serviceDetails.workshopName || 'Commercial Fleet Hub',
      workshopAddress: serviceDetails.workshopAddress || 'NH-48 Sector 34',
      city: serviceDetails.city || 'Gurugram',
      state: serviceDetails.state || 'Haryana',
      pincode: serviceDetails.pincode || '122001',
      services: servicesList,
      serviceCategories: serviceDetails.serviceCategories || servicesList,
      vehicleTypes: serviceDetails.vehicleTypes || [
        '16-22 Wheeler Multi-Axle',
        'Heavy Dumpers & Tippers',
        'LCVs & Cargo Vans',
      ],
      coverageRadius: serviceDetails.coverageRadius || `${serviceDetails.serviceRadiusKm || 35} km Patrol Ring`,
      availability: this.normalizeAvailability(mechanic.availability),
      sosMode: mechanic.sosMode !== undefined ? mechanic.sosMode : true,
      verificationStatus: (
        (typeof mechanic.verification?.status === 'string'
          ? mechanic.verification.status
          : mechanic.verificationStatus) || 'PENDING'
      ).toUpperCase(),
      rating: typeof mechanic.rating === 'number' ? mechanic.rating : mechanic.rating?.average || 4.9,
      totalReviews:
        typeof mechanic.rating === 'object' && mechanic.rating !== null
          ? mechanic.rating.count
          : mechanic.totalReviews || 48,
      totalCompletedRepairs:
        mechanic.stats?.totalRepairsCompleted || mechanic.totalCompletedRepairs || 120,
    };
  }

  public async updateProfile(
    userIdStr: string,
    dto: UpdateMechanicProfileDTO
  ): Promise<MechanicProfileResponseDTO> {
    const { mechanic, user } = await this.getMechanicRecord(userIdStr);
    const usersCollection = getUsersCollection();
    const mechanicsCollection = getMechanicsCollection();
    const now = new Date();

    const userUpdates: Partial<IUser> = { updatedAt: now };
    if (dto.firstName !== undefined) userUpdates.firstName = String(dto.firstName).trim();
    if (dto.lastName !== undefined) userUpdates.lastName = String(dto.lastName).trim();
    if (dto.email !== undefined) userUpdates.email = String(dto.email).trim().toLowerCase();

    if (Object.keys(userUpdates).length > 1) {
      await usersCollection.updateOne({ _id: user._id }, { $set: userUpdates });
    }

    const currentDetails = mechanic.serviceDetails || {
      workshopName: '',
      workshopAddress: '',
      city: '',
      state: '',
      pincode: '',
      specializations: [],
      services: [],
      serviceCategories: [],
      vehicleTypes: [],
      serviceRadiusKm: 35,
    };

    const newServiceDetails = {
      ...currentDetails,
      workshopName: dto.workshopName !== undefined ? String(dto.workshopName).trim() : currentDetails.workshopName,
      workshopAddress: dto.workshopAddress !== undefined ? String(dto.workshopAddress).trim() : currentDetails.workshopAddress,
      city: dto.city !== undefined ? String(dto.city).trim() : currentDetails.city,
      state: dto.state !== undefined ? String(dto.state).trim() : currentDetails.state,
      pincode: dto.pincode !== undefined ? String(dto.pincode).trim() : currentDetails.pincode,
      coverageRadius: dto.coverageRadius !== undefined ? String(dto.coverageRadius).trim() : currentDetails.coverageRadius,
      services: Array.isArray(dto.services) ? dto.services : currentDetails.services,
      serviceCategories: Array.isArray(dto.serviceCategories)
        ? dto.serviceCategories
        : Array.isArray(dto.services)
        ? dto.services
        : currentDetails.serviceCategories,
      vehicleTypes: Array.isArray(dto.vehicleTypes) ? dto.vehicleTypes : currentDetails.vehicleTypes,
    };

    let newExpYears = mechanic.experienceYears;
    if (dto.experienceYears !== undefined) {
      const parsed = parseInt(String(dto.experienceYears), 10);
      if (!isNaN(parsed) && parsed >= 0) newExpYears = parsed;
    }

    await mechanicsCollection.updateOne(
      { _id: mechanic._id },
      {
        $set: {
          serviceDetails: newServiceDetails,
          experienceYears: newExpYears,
          updatedAt: now,
        },
      }
    );

    return this.getProfile(userIdStr);
  }

  public async updateAvailability(
    userIdStr: string,
    availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE'
  ): Promise<'AVAILABLE' | 'BUSY' | 'OFFLINE'> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const normalized = this.normalizeAvailability(availability);
    const now = new Date();

    await getMechanicsCollection().updateOne(
      { _id: mechanic._id },
      { $set: { availability: normalized, updatedAt: now } }
    );

    return normalized;
  }

  public async updateSos(userIdStr: string, enabled: boolean): Promise<boolean> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const now = new Date();

    await getMechanicsCollection().updateOne(
      { _id: mechanic._id },
      { $set: { sosMode: Boolean(enabled), updatedAt: now } }
    );

    return Boolean(enabled);
  }

  // ==========================================
  // SERVICE REQUESTS & DISPATCH
  // ==========================================

  public async getRequests(userIdStr: string): Promise<any[]> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const requestsColl = getServiceRequestsCollection();

    // Auto-seed demo requests if no pending/offered requests are available
    const pendingCount = await requestsColl.countDocuments({ status: { $in: ['PENDING', 'OFFERED'] } });
    if (pendingCount === 0) {
      await this.seedInitialRequests();
    }

    // Exclude requests rejected by this mechanic
    const query: any = {
      $or: [
        { assignedMechanicId: mechanic._id, status: { $in: ['ACCEPTED', 'IN_PROGRESS'] } },
        {
          status: { $in: ['PENDING', 'OFFERED'] },
          rejectedMechanicIds: { $ne: mechanic._id },
        },
      ],
    };

    const docs = await requestsColl.find(query).sort({ isEmergency: -1, urgency: 1, createdAt: -1 } as any).toArray();

    return docs.map((r) => this.mapServiceRequestDTO(r));
  }

  public async getRequestById(userIdStr: string, requestIdStr: string): Promise<any> {
    await this.getMechanicRecord(userIdStr);
    const requestsColl = getServiceRequestsCollection();

    let query: any = { requestId: requestIdStr };
    if (ObjectId.isValid(requestIdStr)) {
      query = { $or: [{ requestId: requestIdStr }, { _id: new ObjectId(requestIdStr) }] };
    }

    const doc = await requestsColl.findOne(query);
    if (!doc) {
      const error: AppError = new Error('Service request not found');
      error.statusCode = 404;
      throw error;
    }

    return this.mapServiceRequestDTO(doc);
  }

  public async acceptRequest(userIdStr: string, requestIdStr: string): Promise<{ request: any; repair: any }> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const requestsColl = getServiceRequestsCollection();
    const repairsColl = getRepairsCollection();
    const mechanicsColl = getMechanicsCollection();
    const now = new Date();

    let query: any = { requestId: requestIdStr };
    if (ObjectId.isValid(requestIdStr)) {
      query = { $or: [{ requestId: requestIdStr }, { _id: new ObjectId(requestIdStr) }] };
    }

    const request = await requestsColl.findOne(query);
    if (!request) {
      const error: AppError = new Error('Service request not found');
      error.statusCode = 404;
      throw error;
    }

    // Idempotent or Conflict Check: Already accepted by someone else?
    if (
      request.status === 'ACCEPTED' ||
      request.status === 'IN_PROGRESS' ||
      request.status === 'COMPLETED'
    ) {
      if (request.assignedMechanicId && request.assignedMechanicId.toString() !== mechanic._id!.toString()) {
        const error: AppError = new Error('Request has already been accepted by another mechanic');
        error.statusCode = 409;
        throw error;
      }
    }

    // Update request
    await requestsColl.updateOne(
      { _id: request._id },
      {
        $set: {
          status: 'ACCEPTED',
          assignedMechanicId: mechanic._id,
          acceptedAt: now,
          updatedAt: now,
        },
      }
    );

    // Update mechanic availability: AVAILABLE -> BUSY (if not manually OFFLINE)
    const currentAvail = mechanic.availability;
    if (currentAvail !== 'OFFLINE') {
      await mechanicsColl.updateOne(
        { _id: mechanic._id },
        { $set: { availability: 'BUSY', updatedAt: now } }
      );
    }

    // Create repair ticket if not already existing (duplicate prevention)
    let repair = await repairsColl.findOne({ requestId: request._id });
    if (!repair) {
      const repairId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = request.estimatedCost || 4500;
      const laborAmount = Math.round(totalAmount * 0.4);
      const partsAmount = Math.round(totalAmount * 0.6);

      const newRepair: IRepair = {
        repairId,
        requestId: request._id!,
        mechanicId: mechanic._id!,
        driverName: request.driverName || 'Truck Driver',
        driverPhone: request.driverPhone || '+91 98765 43210',
        vehicleNumber: request.vehicleNumber || 'HR-55-AJ-9921',
        vehicleType: request.vehicleType || '16-22 Wheeler Multi-Axle',
        serviceCategory: request.serviceCategory || request.requestedServices?.[0] || 'Air Brake Overhaul',
        issueDescription: request.issueDescription || 'Highway breakdown diagnosis',
        laborAmount,
        partsAmount,
        totalAmount,
        status: 'RECEIVED',
        currentStepIndex: 0,
        location: {
          address: request.location?.address || 'NH-48 Toll Corridor',
          landmark: request.location?.landmark,
          latitude: request.location?.latitude,
          longitude: request.location?.longitude,
        },
        serviceItems: (request.requestedServices || ['Diagnostics', 'Pressure Valve Replacement']).map((s) => ({
          title: s,
          cost: Math.round(totalAmount / (request.requestedServices?.length || 1)),
          completed: false,
        })),
        parts: [
          { name: 'Pneumatic Pressure Seal Kit', partNumber: 'PN-4402', cost: 1200, quantity: 1 },
          { name: 'Heavy Dual Check Valve', partNumber: 'DC-881', cost: partsAmount - 1200, quantity: 1 },
        ],
        createdAt: now,
        updatedAt: now,
      };

      const res = await repairsColl.insertOne(newRepair);
      repair = { ...newRepair, _id: res.insertedId };
    }

    const updatedReq = await requestsColl.findOne({ _id: request._id });
    return {
      request: this.mapServiceRequestDTO(updatedReq!),
      repair: this.mapRepairDTO(repair),
    };
  }

  public async rejectRequest(userIdStr: string, requestIdStr: string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const requestsColl = getServiceRequestsCollection();
    const now = new Date();

    let query: any = { requestId: requestIdStr };
    if (ObjectId.isValid(requestIdStr)) {
      query = { $or: [{ requestId: requestIdStr }, { _id: new ObjectId(requestIdStr) }] };
    }

    const request = await requestsColl.findOne(query);
    if (!request) {
      const error: AppError = new Error('Service request not found');
      error.statusCode = 404;
      throw error;
    }

    await requestsColl.updateOne(
      { _id: request._id },
      {
        $addToSet: { rejectedMechanicIds: mechanic._id },
        $set: { updatedAt: now },
      }
    );

    return { success: true, message: 'Request rejected and removed from your dispatch queue' };
  }

  // ==========================================
  // REPAIR LIFECYCLE
  // ==========================================

  public async getRepairs(userIdStr: string, filter?: string): Promise<any[]> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const repairsColl = getRepairsCollection();

    // Auto seed demo repairs if none exist
    const totalRepairs = await repairsColl.countDocuments({ mechanicId: mechanic._id });
    if (totalRepairs === 0) {
      await this.seedInitialRepairs(mechanic._id!);
    }

    let query: any = { mechanicId: mechanic._id };
    if (filter === 'in_progress') {
      query.status = { $in: ['RECEIVED', 'DIAGNOSING', 'REPAIRING', 'READY_FOR_TESTING'] };
    } else if (filter === 'completed') {
      query.status = 'COMPLETED';
    }

    const docs = await repairsColl.find(query).sort({ updatedAt: -1, createdAt: -1 }).toArray();
    return docs.map((r) => this.mapRepairDTO(r));
  }

  public async getRepairById(userIdStr: string, repairIdStr: string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const repairsColl = getRepairsCollection();

    let query: any = { mechanicId: mechanic._id, repairId: repairIdStr };
    if (ObjectId.isValid(repairIdStr)) {
      query = {
        mechanicId: mechanic._id,
        $or: [{ repairId: repairIdStr }, { _id: new ObjectId(repairIdStr) }],
      };
    }

    const doc = await repairsColl.findOne(query);
    if (!doc) {
      const error: AppError = new Error('Repair ticket not found');
      error.statusCode = 404;
      throw error;
    }

    return this.mapRepairDTO(doc);
  }

  public async advanceRepairStatus(
    userIdStr: string,
    repairIdStr: string,
    targetStatus: RepairStatus
  ): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const repairsColl = getRepairsCollection();
    const requestsColl = getServiceRequestsCollection();
    const earningsColl = getEarningsCollection();
    const mechanicsColl = getMechanicsCollection();
    const now = new Date();

    let query: any = { mechanicId: mechanic._id, repairId: repairIdStr };
    if (ObjectId.isValid(repairIdStr)) {
      query = {
        mechanicId: mechanic._id,
        $or: [{ repairId: repairIdStr }, { _id: new ObjectId(repairIdStr) }],
      };
    }

    const repair = await repairsColl.findOne(query);
    if (!repair) {
      const error: AppError = new Error('Repair ticket not found');
      error.statusCode = 404;
      throw error;
    }

    if (repair.status === 'COMPLETED') {
      const error: AppError = new Error('Completed repair jobs cannot be modified');
      error.statusCode = 409;
      throw error;
    }

    const validTransitions: Record<RepairStatus, RepairStatus[]> = {
      RECEIVED: ['DIAGNOSING', 'REPAIRING'],
      DIAGNOSING: ['REPAIRING'],
      REPAIRING: ['READY_FOR_TESTING', 'COMPLETED'],
      READY_FOR_TESTING: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[repair.status]?.includes(targetStatus)) {
      const error: AppError = new Error(
        `Invalid status transition from '${repair.status}' to '${targetStatus}'`
      );
      error.statusCode = 409;
      throw error;
    }

    const updateFields: Partial<IRepair> = {
      status: targetStatus,
      updatedAt: now,
    };

    if (targetStatus === 'DIAGNOSING') {
      updateFields.currentStepIndex = 1;
      updateFields.arrivedAt = repair.arrivedAt || now;
      updateFields.diagnosedAt = now;
    } else if (targetStatus === 'REPAIRING') {
      updateFields.currentStepIndex = 2;
      updateFields.startedAt = repair.startedAt || now;
    } else if (targetStatus === 'READY_FOR_TESTING') {
      updateFields.currentStepIndex = 3;
      updateFields.readyAt = now;
    } else if (targetStatus === 'COMPLETED') {
      updateFields.currentStepIndex = 4;
      updateFields.completedAt = now;

      // 1. Mark request completed
      if (repair.requestId) {
        await requestsColl.updateOne(
          { _id: new ObjectId(repair.requestId.toString()) },
          { $set: { status: 'COMPLETED', completedAt: now, updatedAt: now } }
        );
      }

      // 2. Increment mechanic total repairs
      await mechanicsColl.updateOne(
        { _id: mechanic._id },
        {
          $inc: { 'stats.totalRepairsCompleted': 1 },
          $set: {
            // Restore to AVAILABLE if current state was BUSY (keep OFFLINE if set manually)
            ...(mechanic.availability === 'BUSY'
              ? { availability: 'AVAILABLE' }
              : {}),
            updatedAt: now,
          },
        }
      );

      // 3. Create Earning Record (Idempotent: check if exists)
      const existingEarning = await earningsColl.findOne({
        mechanicId: mechanic._id,
        repairId: repair._id,
      });

      if (!existingEarning) {
        const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
        const newEarning: IEarning = {
          transactionId: txnId,
          mechanicId: mechanic._id!,
          repairId: repair._id!,
          repairReference: repair.repairId,
          vehicleNumber: repair.vehicleNumber,
          serviceTitle: repair.serviceCategory || repair.issueDescription,
          amount: repair.totalAmount || 3850,
          status: 'SETTLED',
          type: 'SERVICE_PAYMENT',
          description: `Settlement for job ${repair.repairId} (${repair.vehicleNumber})`,
          paymentMode: 'Instant SLA Direct Deposit',
          createdAt: now,
          settledAt: now,
          updatedAt: now,
        };
        await earningsColl.insertOne(newEarning);
      }
    }

    await repairsColl.updateOne({ _id: repair._id }, { $set: updateFields });
    const updated = await repairsColl.findOne({ _id: repair._id });
    return this.mapRepairDTO(updated!);
  }

  // ==========================================
  // SERVICE HISTORY
  // ==========================================

  public async getServiceHistory(userIdStr: string, category?: string): Promise<any[]> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const repairsColl = getRepairsCollection();

    let query: any = {
      mechanicId: mechanic._id,
      status: 'COMPLETED',
    };

    if (category && category !== 'All' && category !== 'all') {
      query.serviceCategory = { $regex: new RegExp(category, 'i') };
    }

    const docs = await repairsColl.find(query).sort({ completedAt: -1, createdAt: -1 }).toArray();

    return docs.map((r) => ({
      id: r.repairId || r._id!.toString(),
      repairId: r.repairId,
      vehicle: r.vehicleNumber || 'HR-55-AJ-9921',
      vehicleType: r.vehicleType || '16-22 Wheeler Multi-Axle',
      driver: r.driverName || 'Commercial Driver',
      service: r.serviceCategory || r.issueDescription || 'Complete Diagnostic Overhaul',
      serviceCategory: r.serviceCategory || 'Engine',
      location: r.location?.address || 'NH-48 Hub Corridor',
      date: (r.completedAt || r.createdAt).toISOString().split('T')[0],
      time: (r.completedAt || r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: r.totalAmount || 3850,
      rating: 5.0,
      status: 'Completed',
    }));
  }

  // ==========================================
  // EARNINGS
  // ==========================================

  public async getEarnings(userIdStr: string, filter?: string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const earningsColl = getEarningsCollection();

    // Seed initial earnings if empty
    const total = await earningsColl.countDocuments({ mechanicId: mechanic._id });
    if (total === 0) {
      await this.seedInitialEarnings(mechanic._id!);
    }

    let query: any = { mechanicId: mechanic._id };
    if (filter === 'settled') {
      query.status = 'SETTLED';
    } else if (filter === 'pending') {
      query.status = { $in: ['PENDING', 'PROCESSING'] };
    }

    const docs = await earningsColl.find(query).sort({ createdAt: -1 }).toArray();
    const summary = await this.getEarningsSummary(userIdStr);

    return {
      transactions: docs.map((e) => ({
        id: e.transactionId || e._id!.toString(),
        transactionId: e.transactionId,
        repairId: e.repairReference || (e.repairId ? e.repairId.toString() : 'REP-1082'),
        vehicle: e.vehicleNumber || 'HR-55-AJ-9921',
        service: e.serviceTitle || 'Air Brake Assembly Overhaul',
        amount: e.amount,
        status: e.status === 'SETTLED' ? 'Settled' : 'Pending',
        date: e.createdAt.toISOString().split('T')[0],
        time: e.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: e.type,
        paymentMode: e.paymentMode || 'Direct Wallet',
      })),
      summary,
    };
  }

  public async getEarningsSummary(userIdStr: string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const earningsColl = getEarningsCollection();

    const allEarnings = await earningsColl.find({ mechanicId: mechanic._id }).toArray();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let today = 0;
    let week = 0;
    let month = 0;
    let pendingSettlement = 0;
    let completedJobsCount = 0;

    for (const e of allEarnings) {
      const eDate = new Date(e.createdAt);
      if (e.status === 'SETTLED') {
        completedJobsCount++;
        if (eDate >= startOfToday) today += e.amount;
        if (eDate >= sevenDaysAgo) week += e.amount;
        if (eDate >= startOfMonth) month += e.amount;
      } else {
        pendingSettlement += e.amount;
      }
    }

    return {
      today,
      week,
      month,
      pendingSettlement,
      completedJobsCount,
    };
  }

  // ==========================================
  // REVIEWS
  // ==========================================

  public async getReviews(userIdStr: string, ratingFilter?: number | string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const reviewsColl = getReviewsCollection();

    const total = await reviewsColl.countDocuments({ mechanicId: mechanic._id });
    if (total === 0) {
      await this.seedInitialReviews(mechanic._id!);
    }

    let query: any = { mechanicId: mechanic._id };
    if (ratingFilter && ratingFilter !== 'all' && ratingFilter !== 'All') {
      const num = parseInt(String(ratingFilter), 10);
      if (!isNaN(num)) query.rating = num;
    }

    const docs = await reviewsColl.find(query).sort({ createdAt: -1 }).toArray();
    const summary = await this.getReviewsSummary(userIdStr);

    return {
      reviews: docs.map((r) => ({
        id: r.reviewId || r._id!.toString(),
        reviewId: r.reviewId,
        reviewerName: r.reviewerName,
        driverRole: r.driverRole || 'Fleet Captain',
        vehicleType: r.vehicleType || '16-Wheeler Multi-Axle',
        serviceCategory: r.serviceCategory || 'Pneumatics',
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt.toISOString().split('T')[0],
        tags: r.tags || ['On-Time', 'Professional Equipment'],
      })),
      summary,
    };
  }

  public async getReviewsSummary(userIdStr: string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const reviewsColl = getReviewsCollection();

    const all = await reviewsColl.find({ mechanicId: mechanic._id }).toArray();
    if (all.length === 0) {
      return {
        averageRating: 4.9,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of all) {
      sum += r.rating;
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[rounded] = (breakdown[rounded] || 0) + 1;
    }

    return {
      averageRating: Number((sum / all.length).toFixed(1)),
      totalReviews: all.length,
      ratingBreakdown: {
        fiveStar: breakdown[5],
        fourStar: breakdown[4],
        threeStar: breakdown[3],
        twoStar: breakdown[2],
        oneStar: breakdown[1],
      },
    };
  }

  // ==========================================
  // DOCUMENTS
  // ==========================================

  public async getDocuments(userIdStr: string): Promise<any[]> {
    const { user } = await this.getMechanicRecord(userIdStr);
    const docsColl = getDocumentsCollection();

    const total = await docsColl.countDocuments({ userId: user._id });
    if (total === 0) {
      await this.seedInitialDocuments(user._id!);
    }

    const docs = await docsColl.find({ userId: user._id }).toArray();
    return docs.map((d) => ({
      id: d._id!.toString(),
      documentType: d.documentType,
      documentUrl: d.documentUrl,
      verificationStatus: (d.verificationStatus || 'pending').toUpperCase(),
      createdAt: d.createdAt,
      verifiedAt: d.verifiedAt,
    }));
  }

  public async getDocumentById(userIdStr: string, docIdStr: string): Promise<any> {
    const { user } = await this.getMechanicRecord(userIdStr);
    const docsColl = getDocumentsCollection();

    if (!ObjectId.isValid(docIdStr)) {
      const error: AppError = new Error('Invalid document identifier');
      error.statusCode = 400;
      throw error;
    }

    const doc = await docsColl.findOne({ _id: new ObjectId(docIdStr), userId: user._id });
    if (!doc) {
      const error: AppError = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: doc._id!.toString(),
      documentType: doc.documentType,
      documentUrl: doc.documentUrl,
      verificationStatus: (doc.verificationStatus || 'pending').toUpperCase(),
      createdAt: doc.createdAt,
      verifiedAt: doc.verifiedAt,
    };
  }

  // ==========================================
  // SOS EVENTS
  // ==========================================

  public async triggerSosEvent(
    userIdStr: string,
    location?: { address?: string; latitude?: number; longitude?: number },
    reason?: string
  ): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const sosColl = getSosEventsCollection();
    const now = new Date();

    const sosId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const event: ISosEvent = {
      sosId,
      mechanicId: mechanic._id!,
      location: {
        address: location?.address || 'NH-48 Sector 34 Highway Corridor',
        latitude: location?.latitude || 28.4595,
        longitude: location?.longitude || 77.0266,
      },
      status: 'ACTIVE',
      reason: reason || 'Highway Patrol Emergency Request',
      createdAt: now,
      updatedAt: now,
    };

    const res = await sosColl.insertOne(event);
    return { ...event, _id: res.insertedId };
  }

  public async resolveSosEvent(userIdStr: string, sosIdStr: string): Promise<any> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const sosColl = getSosEventsCollection();
    const now = new Date();

    let query: any = { mechanicId: mechanic._id, sosId: sosIdStr };
    if (ObjectId.isValid(sosIdStr)) {
      query = {
        mechanicId: mechanic._id,
        $or: [{ sosId: sosIdStr }, { _id: new ObjectId(sosIdStr) }],
      };
    }

    const event = await sosColl.findOne(query);
    if (!event) {
      const error: AppError = new Error('SOS event not found');
      error.statusCode = 404;
      throw error;
    }

    await sosColl.updateOne(
      { _id: event._id },
      { $set: { status: 'RESOLVED', resolvedAt: now, updatedAt: now } }
    );

    return { success: true, message: 'SOS event resolved successfully' };
  }

  // ==========================================
  // MECHANIC SUMMARY
  // ==========================================

  public async getSummary(userIdStr: string): Promise<MechanicSummaryResponseDTO> {
    const { mechanic } = await this.getMechanicRecord(userIdStr);
    const repairsColl = getRepairsCollection();
    const requestsColl = getServiceRequestsCollection();
    const earningsColl = getEarningsCollection();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [activeRepairsCount, completedRepairsCount, openRequestsCount, todayEarningsDocs] =
      await Promise.all([
        repairsColl.countDocuments({
          mechanicId: mechanic._id,
          status: { $in: ['RECEIVED', 'DIAGNOSING', 'REPAIRING', 'READY_FOR_TESTING'] },
        }),
        repairsColl.countDocuments({
          mechanicId: mechanic._id,
          status: 'COMPLETED',
        }),
        requestsColl.countDocuments({
          $or: [
            { assignedMechanicId: mechanic._id, status: { $in: ['ACCEPTED', 'IN_PROGRESS'] } },
            { status: { $in: ['PENDING', 'OFFERED'] }, rejectedMechanicIds: { $ne: mechanic._id } },
          ],
        }),
        earningsColl
          .find({
            mechanicId: mechanic._id,
            status: 'SETTLED',
            createdAt: { $gte: startOfToday },
          })
          .toArray(),
      ]);

    const dailyEarnings = todayEarningsDocs.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const currentRating = typeof mechanic.rating === 'number' ? mechanic.rating : mechanic.rating?.average || 4.9;
    return {
      availability: this.normalizeAvailability(mechanic.availability),
      sosMode: mechanic.sosMode !== undefined ? mechanic.sosMode : true,
      rating: currentRating,
      totalRequests: openRequestsCount,
      activeRepairs: activeRepairsCount,
      completedRepairs: completedRepairsCount,
      dailyEarnings,
    };
  }

  // ==========================================
  // DTO MAPPERS
  // ==========================================

  private mapServiceRequestDTO(r: IServiceRequest): any {
    return {
      id: r.requestId || r._id!.toString(),
      requestId: r.requestId,
      driverName: r.driverName || 'Harpreet Singh',
      driverPhone: r.driverPhone || '+91 98765 43210',
      vehicle: r.vehicleNumber ? `${r.vehicleNumber} (${r.vehicleType || '16-Wheeler'})` : 'Tata Prima 4028.S (16-Wheeler)',
      vehicleType: r.vehicleType || '16-22 Wheeler Multi-Axle',
      vehicleNumber: r.vehicleNumber || 'HR-55-AJ-9921',
      location: r.location?.address || 'NH-48, KM 142 (Near Manesar Toll)',
      distance: `${r.location?.distanceKm || 4.2} km`,
      issue: r.issueDescription || 'Air Brake Failure & Line Leakage',
      urgency: r.urgency === 'SOS' ? 'SOS' : r.urgency === 'URGENT' ? 'Urgent' : r.isScheduled ? 'Scheduled' : 'Normal',
      isEmergency: Boolean(r.isEmergency || r.urgency === 'SOS'),
      isScheduled: Boolean(r.isScheduled || r.urgency === 'SCHEDULED'),
      scheduledDate: r.scheduledAt ? r.scheduledAt.toISOString().split('T')[0] : undefined,
      timeRequested: (r.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedCost: r.estimatedCost || 4500,
      status:
        r.status === 'ACCEPTED'
          ? 'Accepted'
          : r.status === 'IN_PROGRESS'
          ? 'In Progress'
          : r.status === 'COMPLETED'
          ? 'Completed'
          : 'Pending',
    };
  }

  private mapRepairDTO(r: IRepair): any {
    const stageTitles = ['Received', 'Diagnosing', 'Repairing', 'Ready', 'Completed'];
    const currentStep = r.currentStepIndex ?? (r.status === 'COMPLETED' ? 4 : 0);

    return {
      id: r.repairId || r._id!.toString(),
      repairId: r.repairId,
      requestId: r.requestId ? r.requestId.toString() : 'REQ-1001',
      vehicle: r.vehicleNumber ? `${r.vehicleNumber} (${r.vehicleType || '16-Wheeler'})` : 'Tata Prima 4028.S',
      vehicleType: r.vehicleType || '16-22 Wheeler Multi-Axle',
      vehicleNumber: r.vehicleNumber || 'HR-55-AJ-9921',
      driver: r.driverName || 'Harpreet Singh',
      driverPhone: r.driverPhone || '+91 98765 43210',
      location: r.location?.address || 'NH-48 Corridor',
      service: r.serviceCategory || r.issueDescription || 'Pneumatics Diagnostic Overhaul',
      issue: r.issueDescription || 'Primary Air Brake Pressure Loss',
      status:
        r.status === 'DIAGNOSING'
          ? 'Diagnosing'
          : r.status === 'REPAIRING'
          ? 'Repairing'
          : r.status === 'READY_FOR_TESTING'
          ? 'Ready'
          : r.status === 'COMPLETED'
          ? 'Completed'
          : 'Received',
      currentStep,
      steps: stageTitles.map((title, idx) => ({
        status: title,
        progress: (idx + 1) * 20,
        completed: idx <= currentStep,
      })),
      parts: r.parts || [
        { name: 'Pneumatic Pressure Seal Kit', partNumber: 'PN-4402', cost: 1200, quantity: 1 },
      ],
      laborCost: r.laborAmount || 1800,
      partsCost: r.partsAmount || 2700,
      totalCost: r.totalAmount || 4500,
      arrivedAt: r.arrivedAt ? r.arrivedAt.toISOString() : undefined,
      diagnosedAt: r.diagnosedAt ? r.diagnosedAt.toISOString() : undefined,
      startedAt: r.startedAt ? r.startedAt.toISOString() : undefined,
      readyAt: r.readyAt ? r.readyAt.toISOString() : undefined,
      completedAt: r.completedAt ? r.completedAt.toISOString() : undefined,
    };
  }

  // ==========================================
  // INITIAL SEED HELPERS (DEMO DATA)
  // ==========================================

  private async seedInitialRequests(): Promise<void> {
    const coll = getServiceRequestsCollection();
    const now = new Date();

    const sampleRequests: IServiceRequest[] = [
      {
        requestId: `REQ-SOS-${Math.floor(100 + Math.random() * 900)}`,
        driverName: 'Harpreet Singh',
        driverPhone: '+91 98765 43210',
        vehicleNumber: 'HR-55-AJ-9921',
        vehicleType: '16-22 Wheeler Multi-Axle',
        serviceCategory: 'Air Brakes & Pneumatic Overhaul',
        requestedServices: ['Air Brake Overhaul', 'Pressure Line Leakage Fix'],
        issueDescription: 'Sudden pressure drop in rear dual chamber on NH-48 incline.',
        location: {
          address: 'NH-48, KM 142 (Near Manesar Toll Plaza)',
          landmark: 'Opposite HP Petrol Pump',
          latitude: 28.3512,
          longitude: 76.9412,
          distanceKm: 4.2,
        },
        urgency: 'SOS',
        isEmergency: true,
        isScheduled: false,
        estimatedCost: 5200,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      },
      {
        requestId: `REQ-SCH-${Math.floor(100 + Math.random() * 900)}`,
        driverName: 'Vikram Gurjar',
        driverPhone: '+91 98112 34567',
        vehicleNumber: 'RJ-14-GH-4412',
        vehicleType: 'Heavy Dumpers & Tippers',
        serviceCategory: 'Hydraulic Steering & Suspension',
        requestedServices: ['Hydraulic Ram Inspection', 'Bush Replacement'],
        issueDescription: 'Scheduled 50,000 KM heavy suspension maintenance.',
        location: {
          address: 'Sector 34 Logistic Yard, Bay 4',
          landmark: 'Warehouse Complex',
          latitude: 28.4321,
          longitude: 77.0123,
          distanceKm: 8.5,
        },
        urgency: 'SCHEDULED',
        isEmergency: false,
        isScheduled: true,
        scheduledAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        estimatedCost: 6800,
        status: 'PENDING',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: now,
      },
    ];

    await coll.insertMany(sampleRequests);
  }

  private async seedInitialRepairs(mechanicId: ObjectId): Promise<void> {
    const coll = getRepairsCollection();
    const now = new Date();

    const sampleRepairs: IRepair[] = [
      {
        repairId: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        requestId: new ObjectId(),
        mechanicId,
        driverName: 'Gurdeep Singh',
        driverPhone: '+91 98721 88321',
        vehicleNumber: 'PB-10-CX-7819',
        vehicleType: '16-22 Wheeler Multi-Axle',
        serviceCategory: 'Air Brakes & Pneumatic Overhaul',
        issueDescription: 'Dual chamber brake leak & valve replacement',
        laborAmount: 1800,
        partsAmount: 2050,
        totalAmount: 3850,
        status: 'REPAIRING',
        currentStepIndex: 2,
        location: {
          address: 'NH-48 KM 128 Highway Bay',
        },
        serviceItems: [
          { title: 'Brake Line Pressure Diagnostic', cost: 800, completed: true },
          { title: 'Dual Chamber Air Seal Replacement', cost: 1000, completed: true },
        ],
        parts: [
          { name: 'Heavy Duty Check Valve Kit', partNumber: 'CV-882', cost: 2050, quantity: 1 },
        ],
        arrivedAt: new Date(now.getTime() - 90 * 60 * 1000),
        diagnosedAt: new Date(now.getTime() - 60 * 60 * 1000),
        startedAt: new Date(now.getTime() - 30 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: now,
      },
      {
        repairId: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        requestId: new ObjectId(),
        mechanicId,
        driverName: 'Rajinder Meena',
        driverPhone: '+91 94140 12891',
        vehicleNumber: 'RJ-02-GB-1120',
        vehicleType: 'Heavy Dumpers & Tippers',
        serviceCategory: 'Heavy Electricals & Alternators',
        issueDescription: 'Alternator 24V short circuit and battery wiring overhaul',
        laborAmount: 1400,
        partsAmount: 3100,
        totalAmount: 4500,
        status: 'COMPLETED',
        currentStepIndex: 4,
        location: {
          address: 'Sector 34 Highway Terminal',
        },
        serviceItems: [
          { title: 'Electrical Load Diagnostic', cost: 600, completed: true },
          { title: '24V Heavy Duty Alternator Installation', cost: 800, completed: true },
        ],
        parts: [
          { name: 'Lucas-TVS 24V Commercial Alternator', partNumber: 'LT-24V-90A', cost: 3100, quantity: 1 },
        ],
        arrivedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        diagnosedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        readyAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        updatedAt: now,
      },
    ];

    await coll.insertMany(sampleRepairs);
  }

  private async seedInitialEarnings(mechanicId: ObjectId): Promise<void> {
    const coll = getEarningsCollection();
    const now = new Date();

    const sampleEarnings: IEarning[] = [
      {
        transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        mechanicId,
        repairReference: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicleNumber: 'RJ-02-GB-1120',
        serviceTitle: 'Heavy Electricals & Alternator Overhaul',
        amount: 4500,
        status: 'SETTLED',
        type: 'SERVICE_PAYMENT',
        description: 'Settlement for heavy electrical overhaul',
        paymentMode: 'Instant SLA Direct Deposit',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        settledAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: now,
      },
      {
        transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        mechanicId,
        repairReference: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicleNumber: 'HR-38-AA-5011',
        serviceTitle: 'BS-VI SCR DEF Sensor Replacement',
        amount: 3200,
        status: 'SETTLED',
        type: 'SERVICE_PAYMENT',
        description: 'Settlement for BS-VI SCR DEF sensor replacement',
        paymentMode: 'Instant SLA Direct Deposit',
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        settledAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        updatedAt: now,
      },
    ];

    await coll.insertMany(sampleEarnings);
  }

  private async seedInitialReviews(mechanicId: ObjectId): Promise<void> {
    const coll = getReviewsCollection();
    const now = new Date();

    const sampleReviews: IReview[] = [
      {
        reviewId: `REV-${Math.floor(10000 + Math.random() * 90000)}`,
        mechanicId,
        reviewerName: 'Rajinder Meena',
        driverRole: 'Heavy Hauler Captain',
        vehicleType: 'Heavy Dumpers & Tippers',
        serviceCategory: 'Electricals',
        rating: 5,
        comment: 'Fastest highway alternator replacement on NH-48. Got us moving under 45 minutes.',
        tags: ['Quick Response', 'Professional Diagnostic', 'Genuine Parts'],
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: now,
      },
      {
        reviewId: `REV-${Math.floor(10000 + Math.random() * 90000)}`,
        mechanicId,
        reviewerName: 'Gurdeep Singh',
        driverRole: 'Fleet Lead',
        vehicleType: '16-Wheeler Multi-Axle',
        serviceCategory: 'Pneumatics',
        rating: 5,
        comment: 'Expert pneumatic brake seal kit replacement. Complete digital billing and SLA compliance.',
        tags: ['50T Jacking', 'Pneumatics Expert'],
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        updatedAt: now,
      },
    ];

    await coll.insertMany(sampleReviews);
  }

  private async seedInitialDocuments(userId: ObjectId): Promise<void> {
    const coll = getDocumentsCollection();
    const now = new Date();

    const sampleDocs: IDocument[] = [
      {
        userId,
        documentType: 'aadhaar',
        documentUrl: 'https://secure.haul360.in/docs/aadhaar_verified_ref.pdf',
        verificationStatus: 'verified',
        verifiedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      },
      {
        userId,
        documentType: 'pan',
        documentUrl: 'https://secure.haul360.in/docs/pan_verified_ref.pdf',
        verificationStatus: 'verified',
        verifiedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      },
      {
        userId,
        documentType: 'experience_certificate',
        documentUrl: 'https://secure.haul360.in/docs/heavy_auto_cert.pdf',
        verificationStatus: 'verified',
        verifiedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      },
    ];

    await coll.insertMany(sampleDocs);
  }
}

export const mechanicService = new MechanicService();
