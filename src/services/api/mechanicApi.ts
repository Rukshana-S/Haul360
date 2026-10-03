import { apiClient } from './client';
import { ApiResponse } from './types';
import { AvailabilityStatus } from '@/components/mechanic/AvailabilitySelector';
import {
  MechanicRequest,
  RepairJob,
  ServiceHistoryItem,
  EarningTransaction,
  EarningsSummary,
  Review,
} from '@/constants/mechanicMockData';

export interface BackendMechanicProfile {
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
  availability: AvailabilityStatus;
  sosMode: boolean;
  verificationStatus: string;
  rating: number;
  totalReviews: number;
  totalCompletedRepairs: number;
}

export interface UpdateMechanicProfileRequest {
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
  services?: string[];
  serviceCategories?: string[];
  vehicleTypes?: string[];
  coverageRadius?: string;
}

export interface MechanicSummaryData {
  availability: AvailabilityStatus;
  sosMode: boolean;
  rating: number;
  totalRequests: number;
  activeRepairs: number;
  completedRepairs: number;
  dailyEarnings: number;
}

export interface BackendDocumentItem {
  id: string;
  documentType: string;
  documentUrl: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt?: string;
  verifiedAt?: string;
}

export interface BackendReviewsData {
  reviews: Review[];
  summary: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
      fiveStar: number;
      fourStar: number;
      threeStar: number;
      twoStar: number;
      oneStar: number;
    };
  };
}

export interface BackendEarningsData {
  transactions: EarningTransaction[];
  summary: EarningsSummary;
}

/**
 * Real Backend Mechanic API Service
 */
export const mechanicApi = {
  // 1. Profile & Settings
  getProfile: async (token: string): Promise<ApiResponse<BackendMechanicProfile>> => {
    return apiClient.get<BackendMechanicProfile>('/mechanic/profile', { token });
  },

  updateProfile: async (
    data: UpdateMechanicProfileRequest,
    token: string
  ): Promise<ApiResponse<BackendMechanicProfile>> => {
    return apiClient.put<BackendMechanicProfile>('/mechanic/profile', data, { token });
  },

  updateAvailability: async (
    status: AvailabilityStatus,
    token: string
  ): Promise<ApiResponse<{ availability: AvailabilityStatus }>> => {
    return apiClient.patch<{ availability: AvailabilityStatus }>(
      '/mechanic/availability',
      { availability: status },
      { token }
    );
  },

  updateSos: async (
    enabled: boolean,
    token: string
  ): Promise<ApiResponse<{ enabled: boolean }>> => {
    return apiClient.patch<{ enabled: boolean }>(
      '/mechanic/sos',
      { enabled },
      { token }
    );
  },

  getSummary: async (token: string): Promise<ApiResponse<MechanicSummaryData>> => {
    return apiClient.get<MechanicSummaryData>('/mechanic/summary', { token });
  },

  // 2. Service Requests
  getRequests: async (token: string): Promise<ApiResponse<MechanicRequest[]>> => {
    return apiClient.get<MechanicRequest[]>('/mechanic/requests', { token });
  },

  getRequestById: async (id: string, token: string): Promise<ApiResponse<MechanicRequest>> => {
    return apiClient.get<MechanicRequest>(`/mechanic/requests/${id}`, { token });
  },

  acceptRequest: async (
    id: string,
    token: string
  ): Promise<ApiResponse<{ request: MechanicRequest; repair: RepairJob }>> => {
    return apiClient.post<{ request: MechanicRequest; repair: RepairJob }>(
      `/mechanic/requests/${id}/accept`,
      {},
      { token }
    );
  },

  rejectRequest: async (id: string, token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(`/mechanic/requests/${id}/reject`, {}, { token });
  },

  // 3. Repairs Lifecycle
  getRepairs: async (token: string, filter?: string): Promise<ApiResponse<RepairJob[]>> => {
    const endpoint = filter ? `/mechanic/repairs?filter=${filter}` : '/mechanic/repairs';
    return apiClient.get<RepairJob[]>(endpoint, { token });
  },

  getRepairById: async (id: string, token: string): Promise<ApiResponse<RepairJob>> => {
    return apiClient.get<RepairJob>(`/mechanic/repairs/${id}`, { token });
  },

  arriveRepair: async (id: string, token: string): Promise<ApiResponse<RepairJob>> => {
    return apiClient.post<RepairJob>(`/mechanic/repairs/${id}/arrive`, {}, { token });
  },

  diagnoseRepair: async (id: string, token: string): Promise<ApiResponse<RepairJob>> => {
    return apiClient.post<RepairJob>(`/mechanic/repairs/${id}/diagnose`, {}, { token });
  },

  startRepair: async (id: string, token: string): Promise<ApiResponse<RepairJob>> => {
    return apiClient.post<RepairJob>(`/mechanic/repairs/${id}/start`, {}, { token });
  },

  readyRepair: async (id: string, token: string): Promise<ApiResponse<RepairJob>> => {
    return apiClient.post<RepairJob>(`/mechanic/repairs/${id}/ready`, {}, { token });
  },

  completeRepair: async (id: string, token: string): Promise<ApiResponse<RepairJob>> => {
    return apiClient.post<RepairJob>(`/mechanic/repairs/${id}/complete`, {}, { token });
  },

  // 4. Service History
  getServiceHistory: async (
    token: string,
    category?: string
  ): Promise<ApiResponse<ServiceHistoryItem[]>> => {
    const endpoint = category ? `/mechanic/service-history?category=${encodeURIComponent(category)}` : '/mechanic/service-history';
    return apiClient.get<ServiceHistoryItem[]>(endpoint, { token });
  },

  // 5. Earnings
  getEarnings: async (token: string, filter?: string): Promise<ApiResponse<BackendEarningsData>> => {
    const endpoint = filter ? `/mechanic/earnings?filter=${filter}` : '/mechanic/earnings';
    return apiClient.get<BackendEarningsData>(endpoint, { token });
  },

  getEarningsSummary: async (token: string): Promise<ApiResponse<EarningsSummary>> => {
    return apiClient.get<EarningsSummary>('/mechanic/earnings/summary', { token });
  },

  // 6. Reviews
  getReviews: async (token: string, rating?: string | number): Promise<ApiResponse<BackendReviewsData>> => {
    const endpoint = rating ? `/mechanic/reviews?rating=${rating}` : '/mechanic/reviews';
    return apiClient.get<BackendReviewsData>(endpoint, { token });
  },

  getReviewsSummary: async (token: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/mechanic/reviews/summary', { token });
  },

  // 7. Documents
  getDocuments: async (token: string): Promise<ApiResponse<BackendDocumentItem[]>> => {
    return apiClient.get<BackendDocumentItem[]>('/mechanic/documents', { token });
  },

  getDocumentById: async (id: string, token: string): Promise<ApiResponse<BackendDocumentItem>> => {
    return apiClient.get<BackendDocumentItem>(`/mechanic/documents/${id}`, { token });
  },

  // 8. SOS Events
  triggerSos: async (
    token: string,
    location?: { address?: string; latitude?: number; longitude?: number },
    reason?: string
  ): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/mechanic/sos/trigger', { location, reason }, { token });
  },

  resolveSos: async (id: string, token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(`/mechanic/sos/${id}/resolve`, {}, { token });
  },
};

export default mechanicApi;
