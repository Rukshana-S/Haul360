import { ObjectId } from 'mongodb';
import { getMongoClient } from '../config/database';
import {
  getUsersCollection,
  getDriversCollection,
  getMechanicsCollection,
  getOrganizationsCollection,
  getTransportOfficesCollection,
  IUser,
  IDriver,
  IMechanic,
  IOrganization,
  ITransportOffice,
  UserRole,
} from '../models';
import {
  RegisterDTO,
  LoginDTO,
  UserResponseData,
} from '../types/auth';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

const VALID_ROLES: UserRole[] = ['driver', 'mechanic', 'organization', 'transport_office'];

export class AuthService {
  /**
   * Register a new user and initialize their corresponding role profile.
   */
  public async register(dto: RegisterDTO): Promise<{ user: UserResponseData }> {
    // 1. Validate Input
    if (!dto.firstName || dto.firstName.trim() === '') {
      const error: AppError = new Error('First name is required');
      error.statusCode = 400;
      throw error;
    }

    if (!dto.mobile || dto.mobile.trim() === '') {
      const error: AppError = new Error('Mobile number is required');
      error.statusCode = 400;
      throw error;
    }

    // Basic 10-digit phone format validation
    const cleanMobile = dto.mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      const error: AppError = new Error('Please enter a valid mobile number (minimum 10 digits)');
      error.statusCode = 400;
      throw error;
    }

    if (!dto.password || dto.password.length < 8) {
      const error: AppError = new Error('Password must be at least 8 characters long');
      error.statusCode = 400;
      throw error;
    }

    if (!dto.role || !VALID_ROLES.includes(dto.role)) {
      const error: AppError = new Error(
        `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`
      );
      error.statusCode = 400;
      throw error;
    }

    const usersCollection = getUsersCollection();

    // 2. Duplicate Check
    const existingMobile = await usersCollection.findOne({ mobile: cleanMobile });
    if (existingMobile) {
      const error: AppError = new Error('A user with this mobile number already exists');
      error.statusCode = 409;
      throw error;
    }

    const cleanEmail = dto.email ? dto.email.trim().toLowerCase() : undefined;
    if (cleanEmail) {
      const existingEmail = await usersCollection.findOne({ email: cleanEmail });
      if (existingEmail) {
        const error: AppError = new Error('A user with this email address already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    // 3. Hash Password
    const passwordHash = await hashPassword(dto.password);
    const now = new Date();

    const newUserId = new ObjectId();
    const userDoc: IUser = {
      _id: newUserId,
      role: dto.role,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName ? dto.lastName.trim() : undefined,
      mobile: cleanMobile,
      email: cleanEmail || '',
      passwordHash,
      isActive: true,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    // 4. Create Role Profile Document
    const fullName = `${dto.firstName.trim()} ${dto.lastName ? dto.lastName.trim() : ''}`.trim();

    // Atomic Insertion with Transaction or Safe Rollback Strategy
    const client = getMongoClient();
    let session;
    try {
      session = client.startSession();
    } catch {
      session = null;
    }

    if (session) {
      try {
        await session.withTransaction(async () => {
          await usersCollection.insertOne(userDoc, { session });
          await this.createRoleProfile(dto.role, newUserId, fullName, cleanMobile, cleanEmail || '', now, session);
        });
      } catch (txError) {
        throw txError;
      } finally {
        await session.endSession();
      }
    } else {
      // Fallback with programmatic rollback
      await usersCollection.insertOne(userDoc);
      try {
        await this.createRoleProfile(dto.role, newUserId, fullName, cleanMobile, cleanEmail || '', now);
      } catch (profileError) {
        // Rollback created user on role profile failure
        await usersCollection.deleteOne({ _id: newUserId });
        throw profileError;
      }
    }

    return {
      user: {
        id: newUserId.toString(),
        role: userDoc.role,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        mobile: userDoc.mobile,
        email: userDoc.email,
        isActive: userDoc.isActive,
        isVerified: userDoc.isVerified,
      },
    };
  }

  /**
   * Helper to create the initial role profile document.
   */
  private async createRoleProfile(
    role: UserRole,
    userId: ObjectId,
    fullName: string,
    mobile: string,
    email: string,
    now: Date,
    session?: any
  ): Promise<void> {
    const options = session ? { session } : {};

    switch (role) {
      case 'driver': {
        const driverDoc: IDriver = {
          userId,
          fullName,
          age: 0,
          mobile,
          email,
          address: { city: '', state: '', pincode: '' },
          verificationStatus: 'pending',
          availabilityStatus: 'available',
          rating: 0,
          totalTrips: 0,
          createdAt: now,
          updatedAt: now,
        };
        await getDriversCollection().insertOne(driverDoc, options);
        break;
      }

      case 'mechanic': {
        const mechanicDoc: IMechanic = {
          userId,
          fullName,
          mobile,
          email,
          experienceYears: 0,
          workshopDetails: {
            workshopName: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
          },
          serviceDetails: {
            vehicleTypes: [],
            availableFrom: '09:00',
            availableTo: '19:00',
            mechanicType: 'General',
          },
          availabilityStatus: 'offline',
          verificationStatus: 'pending',
          rating: 0,
          totalReviews: 0,
          totalCompletedRepairs: 0,
          createdAt: now,
          updatedAt: now,
        };
        await getMechanicsCollection().insertOne(mechanicDoc, options);
        break;
      }

      case 'organization': {
        const orgDoc: IOrganization = {
          userId,
          organizationName: fullName,
          ownerName: fullName,
          mobile,
          email,
          gstNumber: '',
          businessAddress: {
            addressLine: '',
            city: '',
            state: '',
            pincode: '',
          },
          organizationType: 'Logistics',
          verificationStatus: 'pending',
          rating: 0,
          totalShipments: 0,
          createdAt: now,
          updatedAt: now,
        };
        await getOrganizationsCollection().insertOne(orgDoc, options);
        break;
      }

      case 'transport_office': {
        const officeDoc: ITransportOffice = {
          userId,
          officeName: fullName,
          contactPerson: fullName,
          mobile,
          email,
          address: {
            addressLine: '',
            city: '',
            state: '',
            pincode: '',
          },
          verificationStatus: 'pending',
          rating: 0,
          createdAt: now,
          updatedAt: now,
        };
        await getTransportOfficesCollection().insertOne(officeDoc, options);
        break;
      }
    }
  }

  /**
   * Authenticate a user by mobile and password, returning tokens.
   */
  public async login(dto: LoginDTO): Promise<{
    user: UserResponseData;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    if (!dto.mobile || !dto.password) {
      const error: AppError = new Error('Invalid mobile number or password');
      error.statusCode = 401;
      throw error;
    }

    const cleanMobile = dto.mobile.trim().replace(/\D/g, '');
    const usersCollection = getUsersCollection();

    const user = await usersCollection.findOne({ mobile: cleanMobile });
    if (!user || !user.isActive) {
      const error: AppError = new Error('Invalid mobile number or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(dto.password, user.passwordHash);
    if (!isMatch) {
      const error: AppError = new Error('Invalid mobile number or password');
      error.statusCode = 401;
      throw error;
    }

    const userIdStr = user._id!.toString();
    const accessToken = generateAccessToken({ userId: userIdStr, role: user.role });
    const refreshToken = generateRefreshToken({ userId: userIdStr, role: user.role });

    // Update lastLoginAt
    const now = new Date();
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: now, updatedAt: now } }
    );

    return {
      user: {
        id: userIdStr,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Verify refresh token and issue a new access token.
   */
  public async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      const error: AppError = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      const error: AppError = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(payload.userId) });

    if (!user || !user.isActive) {
      const error: AppError = new Error('User not found or inactive');
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = generateAccessToken({
      userId: user._id!.toString(),
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * Retrieve currently authenticated user profile.
   */
  public async getCurrentUser(userId: string): Promise<{ user: UserResponseData }> {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      user: {
        id: user._id!.toString(),
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export const authService = new AuthService();
