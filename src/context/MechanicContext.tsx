import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  MechanicRequest,
  RepairJob,
  Review,
  MechanicProfileData,
  ServiceHistoryItem,
  EarningTransaction,
  EarningsSummary,
  mockRequests,
  mockRepairs,
  mockDetailedReviews,
  mockServiceHistory,
  mockEarningsTransactions,
  mockEarningsSummary,
  defaultMechanicProfile,
} from '@/constants/mechanicMockData';
import { AvailabilityStatus } from '@/components/mechanic/AvailabilitySelector';
import { useAuth } from '@/context/AuthContext';
import {
  mechanicApi,
  BackendMechanicProfile,
  BackendDocumentItem,
} from '@/services/api/mechanicApi';

interface MechanicContextType {
  requests: MechanicRequest[];
  repairs: RepairJob[];
  serviceHistory: ServiceHistoryItem[];
  reviews: Review[];
  earningsSummary: EarningsSummary;
  earningsTransactions: EarningTransaction[];
  documents: BackendDocumentItem[];
  profile: MechanicProfileData;
  availability: AvailabilityStatus;
  sosMode: boolean;
  isBackendConnected: boolean;
  isProfileLoading: boolean;
  setAvailability: (status: AvailabilityStatus) => void | Promise<void>;
  setSosMode: (mode: boolean) => void;
  updateProfile: (updated: Partial<MechanicProfileData>) => Promise<void>;
  refreshBackendData: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<string>;
  rejectRequest: (requestId: string) => Promise<void>;
  updateRepairStep: (repairId: string, stepIndex: number) => Promise<void>;
  completeRepair: (repairId: string) => Promise<void>;
  getRequestById: (id: string) => MechanicRequest | undefined;
  getRepairById: (id: string) => RepairJob | undefined;
  triggerSosEvent: (location?: { address?: string; latitude?: number; longitude?: number }, reason?: string) => Promise<any>;
}

const REPAIR_STAGES: Array<{ status: RepairJob['status']; progress: number }> = [
  { status: 'Received', progress: 15 },
  { status: 'Diagnosing', progress: 35 },
  { status: 'Repairing', progress: 65 },
  { status: 'Ready', progress: 90 },
  { status: 'Completed', progress: 100 },
];

const MechanicContext = createContext<MechanicContextType | undefined>(undefined);

export const MechanicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken } = useAuth();

  const [requests, setRequests] = useState<MechanicRequest[]>(mockRequests);
  const [repairs, setRepairs] = useState<RepairJob[]>(mockRepairs);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>(mockServiceHistory);
  const [reviews, setReviews] = useState<Review[]>(mockDetailedReviews);
  const [earningsTransactions, setEarningsTransactions] = useState<EarningTransaction[]>(mockEarningsTransactions);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary>(mockEarningsSummary);
  const [documents, setDocuments] = useState<BackendDocumentItem[]>([]);

  const [profile, setProfile] = useState<MechanicProfileData>(defaultMechanicProfile);
  const [availability, setAvailabilityState] = useState<AvailabilityStatus>('AVAILABLE');
  const [sosMode, setSosModeState] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  /**
   * Helper to map backend profile DTO into frontend MechanicProfileData structure.
   */
  const mapBackendProfile = useCallback(
    (bp: BackendMechanicProfile, prev: MechanicProfileData): MechanicProfileData => {
      const fName = bp.firstName || user?.firstName || '';
      const lName = bp.lastName || user?.lastName || '';
      return {
        ...prev,
        firstName: fName,
        lastName: lName,
        mobile: bp.mobile || user?.mobile || '',
        email: bp.email || user?.email || '',
        workshopName: bp.workshopName || (fName ? `${fName}'s Fleet Care` : prev.workshopName),
        workshopAddress: bp.workshopAddress || prev.workshopAddress,
        city: bp.city || prev.city,
        state: bp.state || prev.state,
        pincode: bp.pincode || prev.pincode,
        yearsOfExperience: bp.yearsOfExperience || prev.yearsOfExperience,
        mechanicType: bp.mechanicType || prev.mechanicType,
        coverageRadius: bp.coverageRadius || prev.coverageRadius,
        services: bp.services?.length ? bp.services : prev.services,
        vehicleTypes: bp.vehicleTypes?.length ? bp.vehicleTypes : prev.vehicleTypes,
        verificationStatus:
          bp.verificationStatus === 'VERIFIED' || bp.verificationStatus === 'REJECTED'
            ? bp.verificationStatus
            : 'PENDING',
        rating: bp.rating || prev.rating,
        totalReviews: bp.totalReviews || prev.totalReviews,
        completedRepairsCount: bp.totalCompletedRepairs || prev.completedRepairsCount,
      };
    },
    [user]
  );

  /**
   * Fetch real profile, requests, repairs, history, earnings & reviews from MongoDB.
   */
  const refreshBackendData = useCallback(async () => {
    if (!accessToken || user?.role !== 'mechanic') {
      return;
    }

    setIsProfileLoading(true);

    try {
      const [
        profileRes,
        summaryRes,
        requestsRes,
        repairsRes,
        historyRes,
        earningsRes,
        reviewsRes,
        docsRes,
      ] = await Promise.allSettled([
        mechanicApi.getProfile(accessToken),
        mechanicApi.getSummary(accessToken),
        mechanicApi.getRequests(accessToken),
        mechanicApi.getRepairs(accessToken),
        mechanicApi.getServiceHistory(accessToken),
        mechanicApi.getEarnings(accessToken),
        mechanicApi.getReviews(accessToken),
        mechanicApi.getDocuments(accessToken),
      ]);

      // 1. Profile
      if (profileRes.status === 'fulfilled' && profileRes.value.success && profileRes.value.data) {
        const bp = profileRes.value.data;
        setProfile((prev) => mapBackendProfile(bp, prev));
        if (bp.availability) {
          setAvailabilityState(bp.availability);
        }
        if (bp.sosMode !== undefined) {
          setSosModeState(bp.sosMode);
        }
        setIsBackendConnected(true);
      }

      // 2. Summary
      if (summaryRes.status === 'fulfilled' && summaryRes.value.success && summaryRes.value.data) {
        const sm = summaryRes.value.data;
        if (sm.availability) {
          setAvailabilityState(sm.availability);
        }
        if (sm.sosMode !== undefined) {
          setSosModeState(sm.sosMode);
        }
      }

      // 3. Requests
      if (requestsRes.status === 'fulfilled' && requestsRes.value.success && requestsRes.value.data) {
        setRequests(requestsRes.value.data);
      }

      // 4. Repairs
      if (repairsRes.status === 'fulfilled' && repairsRes.value.success && repairsRes.value.data) {
        setRepairs(repairsRes.value.data);
      }

      // 5. Service History
      if (historyRes.status === 'fulfilled' && historyRes.value.success && historyRes.value.data) {
        setServiceHistory(historyRes.value.data);
      }

      // 6. Earnings
      if (earningsRes.status === 'fulfilled' && earningsRes.value.success && earningsRes.value.data) {
        const ed = earningsRes.value.data;
        if (ed.transactions) setEarningsTransactions(ed.transactions);
        if (ed.summary) setEarningsSummary(ed.summary);
      }

      // 7. Reviews
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.success && reviewsRes.value.data) {
        const rd = reviewsRes.value.data;
        if (rd.reviews) setReviews(rd.reviews);
      }

      // 8. Documents
      if (docsRes.status === 'fulfilled' && docsRes.value.success && docsRes.value.data) {
        setDocuments(docsRes.value.data);
      }
    } catch {
      // Retain fallback local state gracefully if backend request fails
      setIsBackendConnected(false);
    } finally {
      setIsProfileLoading(false);
    }
  }, [accessToken, user, mapBackendProfile]);

  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  const setAvailability = async (newStatus: AvailabilityStatus): Promise<void> => {
    const previousStatus = availability;
    setAvailabilityState(newStatus);

    if (accessToken && user?.role === 'mechanic') {
      try {
        const response = await mechanicApi.updateAvailability(newStatus, accessToken);
        if (response.success && response.data?.availability) {
          setAvailabilityState(response.data.availability);
        } else {
          setAvailabilityState(previousStatus);
        }
      } catch (err) {
        console.error('Failed to persist mechanic availability to backend:', err);
        setAvailabilityState(previousStatus);
        await refreshBackendData();
      }
    }
  };

  const setSosMode = (enabled: boolean) => {
    setSosModeState(enabled);

    if (accessToken && user?.role === 'mechanic') {
      mechanicApi.updateSos(enabled, accessToken).catch(() => {
        // Fallback silently without breaking UI
      });
    }
  };

  const updateProfile = async (updated: Partial<MechanicProfileData>): Promise<void> => {
    // 1. Immediate optimistic update
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));

    // 2. Persist to MongoDB backend
    if (accessToken && user?.role === 'mechanic') {
      try {
        const response = await mechanicApi.updateProfile(
          {
            firstName: updated.firstName,
            lastName: updated.lastName,
            email: updated.email,
            workshopName: updated.workshopName,
            workshopAddress: updated.workshopAddress,
            city: updated.city,
            state: updated.state,
            pincode: updated.pincode,
            yearsOfExperience: updated.yearsOfExperience,
            mechanicType: updated.mechanicType,
            coverageRadius: updated.coverageRadius,
            services: updated.services,
            vehicleTypes: updated.vehicleTypes,
          },
          accessToken
        );

        if (response.success && response.data) {
          const bp = response.data;
          setProfile((prev) => mapBackendProfile(bp, prev));
          setIsBackendConnected(true);
        }
      } catch (error) {
        setIsBackendConnected(false);
        throw error;
      }
    }
  };

  const acceptRequest = async (requestId: string): Promise<string> => {
    // 1. If connected to backend, perform real mutation
    if (accessToken && user?.role === 'mechanic') {
      try {
        const response = await mechanicApi.acceptRequest(requestId, accessToken);
        if (response.success && response.data) {
          const { request: updatedReq, repair: createdRepair } = response.data;
          setRequests((prev) =>
            prev.map((r) => (r.id === requestId ? { ...r, status: 'ACCEPTED' } : r))
          );
          setRepairs((prev) => [createdRepair, ...prev.filter((rep) => rep.id !== createdRepair.id)]);
          setAvailabilityState('BUSY');
          return createdRepair.id;
        }
      } catch (error) {
        console.warn('Backend accept request failed, falling back to local workflow:', error);
      }
    }

    // Local fallback workflow
    const targetReq = requests.find((r) => r.id === requestId);
    const newRepairId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRepairJob: RepairJob = {
      id: newRepairId,
      requestId,
      vehicle: targetReq?.vehicle || 'Tata Prima 4028.S (16-Wheeler)',
      vehicleType: targetReq?.vehicleType || '16-22 Wheeler Multi-Axle',
      driver: targetReq?.driver || targetReq?.driverName || 'Harpreet Singh',
      driverPhone: targetReq?.driverPhone || '+91 98765 43210',
      location: targetReq?.location || 'NH-48, KM 142 (Near Manesar Toll)',
      service: targetReq?.service || targetReq?.issue || 'Air Brake Overhaul',
      issue: targetReq?.issue || targetReq?.service || 'Air Brake Failure & Line Leakage',
      status: 'Received',
      progress: 20,
      amount: targetReq?.amount || '₹3,850',
      startTime: 'Just now',
      timeElapsed: '0 min',
      currentStep: 0,
      steps: [
        { status: 'Received', progress: 15, completed: true },
        { status: 'Diagnosing', progress: 35, completed: false },
        { status: 'Repairing', progress: 65, completed: false },
        { status: 'Ready', progress: 90, completed: false },
        { status: 'Completed', progress: 100, completed: false },
      ],
      parts: [
        { name: 'Dual Chamber Air Seal Kit', partNumber: 'PN-4402', quantity: 1, cost: 1200 },
        { name: 'Heavy Duty Check Valve', partNumber: 'DC-881', quantity: 1, cost: 850 },
      ],
      laborCost: 1800,
      partsCost: 2050,
      totalCost: 3850,
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'ACCEPTED' } : r))
    );
    setRepairs((prev) => [newRepairJob, ...prev]);
    setAvailabilityState('BUSY');

    return newRepairId;
  };

  const rejectRequest = async (requestId: string): Promise<void> => {
    if (accessToken && user?.role === 'mechanic') {
      try {
        await mechanicApi.rejectRequest(requestId, accessToken);
      } catch (error) {
        console.warn('Backend reject request failed:', error);
      }
    }

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const updateRepairStep = async (repairId: string, stepIndex: number): Promise<void> => {
    const targetStage = REPAIR_STAGES[stepIndex];
    if (!targetStage) return;

    // Call backend transitions if available
    if (accessToken && user?.role === 'mechanic') {
      try {
        if (targetStage.status === 'Diagnosing') {
          await mechanicApi.diagnoseRepair(repairId, accessToken);
        } else if (targetStage.status === 'Repairing') {
          await mechanicApi.startRepair(repairId, accessToken);
        } else if (targetStage.status === 'Ready') {
          await mechanicApi.readyRepair(repairId, accessToken);
        } else if (targetStage.status === 'Completed') {
          await completeRepair(repairId);
          return;
        }
      } catch (error) {
        console.warn('Backend repair update failed, using local update:', error);
      }
    }

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          const existingSteps = r.steps || [
            { status: 'Received', progress: 20, completed: true },
            { status: 'Diagnosing', progress: 40, completed: false },
            { status: 'Repairing', progress: 60, completed: false },
            { status: 'Ready', progress: 80, completed: false },
            { status: 'Completed', progress: 100, completed: false },
          ];

          const updatedSteps = existingSteps.map((st: any, idx: number) => ({
            ...st,
            completed: idx <= stepIndex,
          }));

          return {
            ...r,
            status: targetStage.status,
            currentStep: stepIndex,
            progress: (stepIndex + 1) * 20,
            steps: updatedSteps,
          };
        }
        return r;
      })
    );
  };

  const completeRepair = async (repairId: string): Promise<void> => {
    const targetRepair = repairs.find((r) => r.id === repairId);
    if (!targetRepair) return;

    if (accessToken && user?.role === 'mechanic') {
      try {
        await mechanicApi.completeRepair(repairId, accessToken);
        await refreshBackendData();
        return;
      } catch (error) {
        console.warn('Backend completeRepair failed, running local transition:', error);
      }
    }

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const costNum = targetRepair.totalCost || 3850;

    // 1. Move repair to completed
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          const existingSteps = r.steps || [];
          return {
            ...r,
            status: 'Completed',
            currentStep: 4,
            progress: 100,
            steps: existingSteps.map((st) => ({ ...st, completed: true })),
          };
        }
        return r;
      })
    );

    // 2. Mark corresponding request as Completed
    if (targetRepair.requestId) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === targetRepair.requestId ? { ...r, status: 'COMPLETED' } : r
        )
      );
    }

    // 3. Add to Service History
    const historyItem: ServiceHistoryItem = {
      id: targetRepair.id,
      vehicle: targetRepair.vehicle,
      vehicleType: targetRepair.vehicleType || '16-22 Wheeler Multi-Axle',
      driver: targetRepair.driver,
      service: targetRepair.service,
      serviceCategory: 'Pneumatics',
      location: targetRepair.location,
      date: currentDate,
      time: currentTime,
      amount: `₹${costNum.toLocaleString('en-IN')}`,
      rawAmount: costNum,
      rating: 5.0,
      status: 'COMPLETED',
      category: 'Pneumatics',
    };

    setServiceHistory((prev) => [historyItem, ...prev]);

    // 4. Create Earning Record
    const newTxnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const earningItem: EarningTransaction = {
      id: newTxnId,
      repairId: targetRepair.id,
      vehicle: targetRepair.vehicle,
      service: targetRepair.service,
      amount: `₹${costNum.toLocaleString('en-IN')}`,
      rawAmount: costNum,
      status: 'SETTLED',
      date: currentDate,
      time: currentTime,
      type: 'SERVICE_PAYMENT',
    };

    setEarningsTransactions((prev) => [earningItem, ...prev]);

    // 5. Update Earnings Summary
    setEarningsSummary((prev) => {
      const curToday = parseInt(prev.today.replace(/[^0-9]/g, ''), 10) || 0;
      const curWeek = parseInt(prev.thisWeek.replace(/[^0-9]/g, ''), 10) || 0;
      const curMonth = parseInt(prev.thisMonth.replace(/[^0-9]/g, ''), 10) || 0;

      return {
        ...prev,
        today: `₹${(curToday + costNum).toLocaleString('en-IN')}`,
        thisWeek: `₹${(curWeek + costNum).toLocaleString('en-IN')}`,
        thisMonth: `₹${(curMonth + costNum).toLocaleString('en-IN')}`,
        completedJobsCount: (prev.completedJobsCount || 0) + 1,
      };
    });

    // 6. Reset Availability to AVAILABLE (if was BUSY)
    if (availability === 'BUSY') {
      setAvailabilityState('AVAILABLE');
    }
  };

  const triggerSosEvent = async (
    location?: { address?: string; latitude?: number; longitude?: number },
    reason?: string
  ): Promise<any> => {
    if (accessToken && user?.role === 'mechanic') {
      return mechanicApi.triggerSos(accessToken, location, reason);
    }
    return { success: true };
  };

  const getRequestById = (id: string): MechanicRequest | undefined => {
    return requests.find((r) => r.id === id);
  };

  const getRepairById = (id: string): RepairJob | undefined => {
    const foundRepair = repairs.find((r) => r.id === id);
    if (foundRepair) return foundRepair;

    const foundHistory = serviceHistory.find((h) => h.id === id);
    if (foundHistory) {
      const histCost = typeof foundHistory.amount === 'number'
        ? foundHistory.amount
        : parseInt(String(foundHistory.amount).replace(/[^0-9]/g, ''), 10) || 3850;

      return {
        id: foundHistory.id,
        vehicle: `${foundHistory.vehicle} (${foundHistory.vehicleType})`,
        driver: foundHistory.driver,
        service: foundHistory.service,
        status: 'Completed',
        progress: 100,
        amount: typeof foundHistory.amount === 'string' ? foundHistory.amount : `₹${foundHistory.amount.toLocaleString('en-IN')}`,
        startTime: foundHistory.time || '10:00 AM',
        timeElapsed: '45 mins',
        currentStep: 4,
        steps: [
          { status: 'Received', progress: 20, completed: true },
          { status: 'Diagnosing', progress: 40, completed: true },
          { status: 'Repairing', progress: 60, completed: true },
          { status: 'Ready', progress: 80, completed: true },
          { status: 'Completed', progress: 100, completed: true },
        ],
        parts: [
          { name: 'Factory Verified Service Kit', partNumber: 'FS-9901', quantity: 1, cost: Math.max(0, histCost - 1500) },
        ],
        laborCost: 1500,
        partsCost: Math.max(0, histCost - 1500),
        totalCost: histCost,
        location: foundHistory.location,
      };
    }

    return undefined;
  };

  const contextValue = useMemo(
    () => ({
      requests,
      repairs,
      serviceHistory,
      reviews,
      earningsSummary,
      earningsTransactions,
      documents,
      profile,
      availability,
      sosMode,
      isBackendConnected,
      isProfileLoading,
      setAvailability,
      setSosMode,
      updateProfile,
      refreshBackendData,
      acceptRequest,
      rejectRequest,
      updateRepairStep,
      completeRepair,
      getRequestById,
      getRepairById,
      triggerSosEvent,
    }),
    [
      requests,
      repairs,
      serviceHistory,
      reviews,
      earningsSummary,
      earningsTransactions,
      documents,
      profile,
      availability,
      sosMode,
      isBackendConnected,
      isProfileLoading,
      refreshBackendData,
    ]
  );

  return <MechanicContext.Provider value={contextValue}>{children}</MechanicContext.Provider>;
};

export const useMechanic = (): MechanicContextType => {
  const context = useContext(MechanicContext);
  if (!context) {
    throw new Error('useMechanic must be used within a MechanicProvider');
  }
  return context;
};
