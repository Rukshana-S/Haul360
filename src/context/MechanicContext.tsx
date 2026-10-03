import React, { createContext, useContext, useState, useMemo } from 'react';
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

interface MechanicContextType {
  requests: MechanicRequest[];
  repairs: RepairJob[];
  serviceHistory: ServiceHistoryItem[];
  reviews: Review[];
  earningsSummary: EarningsSummary;
  earningsTransactions: EarningTransaction[];
  profile: MechanicProfileData;
  availability: AvailabilityStatus;
  sosMode: boolean;
  setAvailability: (status: AvailabilityStatus) => void;
  setSosMode: (mode: boolean) => void;
  updateProfile: (updated: Partial<MechanicProfileData>) => void;
  acceptRequest: (requestId: string) => string;
  rejectRequest: (requestId: string) => void;
  updateRepairStep: (repairId: string, stepIndex: number) => void;
  completeRepair: (repairId: string) => void;
  getRequestById: (id: string) => MechanicRequest | undefined;
  getRepairById: (id: string) => RepairJob | undefined;
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
  const [requests, setRequests] = useState<MechanicRequest[]>(mockRequests);
  const [repairs, setRepairs] = useState<RepairJob[]>(mockRepairs);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>(mockServiceHistory);
  const [reviews] = useState<Review[]>(mockDetailedReviews);
  const [earningsTransactions] = useState<EarningTransaction[]>(mockEarningsTransactions);
  const [earningsSummary] = useState<EarningsSummary>(mockEarningsSummary);
  const [profile, setProfile] = useState<MechanicProfileData>(defaultMechanicProfile);
  const [availability, setAvailability] = useState<AvailabilityStatus>('AVAILABLE');
  const [sosMode, setSosMode] = useState<boolean>(true);

  const getRequestById = (id: string): MechanicRequest | undefined => {
    return requests.find((r) => r.id === id);
  };

  const getRepairById = (id: string): RepairJob | undefined => {
    // 1. Search in active repairs
    const foundRepair = repairs.find((r) => r.id === id);
    if (foundRepair) return foundRepair;

    // 2. Search in service history (completed jobs)
    const foundHistory = serviceHistory.find((h) => h.id === id);
    if (foundHistory) {
      return {
        id: foundHistory.id,
        vehicle: `${foundHistory.vehicle} (${foundHistory.vehicleType})`,
        driver: foundHistory.driver,
        service: foundHistory.service,
        status: 'Completed',
        progress: 100,
        location: foundHistory.location,
        amount: foundHistory.amount,
        startTime: 'Completed',
        timeElapsed: 'Job Completed',
      };
    }

    // 3. Search in requests matching id
    const foundReq = requests.find((req) => req.id === id || `REP-${req.id.replace('REQ-', '')}` === id);
    if (foundReq) {
      return {
        id: id.startsWith('REP-') ? id : `REP-${foundReq.id.replace('REQ-', '')}`,
        vehicle: `${foundReq.vehicle} (${foundReq.vehicleType})`,
        driver: foundReq.driver,
        service: foundReq.service,
        status: foundReq.status === 'COMPLETED' ? 'Completed' : 'Received',
        progress: foundReq.status === 'COMPLETED' ? 100 : 15,
        location: foundReq.location,
        amount: foundReq.amount,
        startTime: foundReq.timeRequested,
        timeElapsed: foundReq.status === 'COMPLETED' ? 'Job Completed' : '0 mins elapsed',
      };
    }

    return undefined;
  };

  const updateProfile = (updated: Partial<MechanicProfileData>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const acceptRequest = (requestId: string): string => {
    let targetRepairId = '';

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return { ...r, status: 'ACCEPTED' as const };
        }
        return r;
      })
    );

    const targetReq = requests.find((r) => r.id === requestId);
    if (targetReq) {
      // Check if a repair already exists for this request
      const existing = repairs.find((rep) => rep.id === `REP-${targetReq.id.replace('REQ-', '')}`);
      if (existing) {
        targetRepairId = existing.id;
      } else {
        const newRepairId = `REP-${targetReq.id.replace('REQ-', '') || Date.now().toString().slice(-4)}`;
        targetRepairId = newRepairId;
        const newRepair: RepairJob = {
          id: newRepairId,
          vehicle: `${targetReq.vehicle} (${targetReq.vehicleType})`,
          driver: targetReq.driver,
          service: targetReq.service,
          status: 'Received',
          progress: 15,
          location: targetReq.location,
          amount: targetReq.amount,
          startTime: 'Just now',
          timeElapsed: '0 mins elapsed',
        };
        setRepairs((prevRepairs) => [newRepair, ...prevRepairs]);
      }
    }

    return targetRepairId || repairs[0]?.id || 'REP-8821';
  };

  const rejectRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return { ...r, status: 'REJECTED' as const };
        }
        return r;
      })
    );
  };

  const updateRepairStep = (repairId: string, stepIndex: number) => {
    const stage = REPAIR_STAGES[stepIndex] || REPAIR_STAGES[0];
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          const isCompleted = stepIndex === REPAIR_STAGES.length - 1;
          return {
            ...r,
            status: stage.status,
            progress: stage.progress,
            timeElapsed: isCompleted ? 'Job Completed' : r.timeElapsed,
          };
        }
        return r;
      })
    );

    // If completed, add to settled service history
    if (stepIndex === REPAIR_STAGES.length - 1) {
      const rep = repairs.find((r) => r.id === repairId);
      if (rep && !serviceHistory.some((h) => h.id === rep.id)) {
        const historyEntry: ServiceHistoryItem = {
          id: rep.id,
          vehicle: rep.vehicle,
          vehicleType: 'Heavy Commercial',
          driver: rep.driver,
          service: rep.service,
          date: 'Just now',
          location: rep.location,
          amount: rep.amount,
          rating: 5.0,
          status: 'SETTLED',
          category: 'All',
        };
        setServiceHistory((prev) => [historyEntry, ...prev]);
      }
    }
  };

  const completeRepair = (repairId: string) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Completed',
            progress: 100,
            timeElapsed: 'Completed',
          };
        }
        return r;
      })
    );
    const rep = repairs.find((r) => r.id === repairId);
    if (rep && !serviceHistory.some((h) => h.id === rep.id)) {
      const historyEntry: ServiceHistoryItem = {
        id: rep.id,
        vehicle: rep.vehicle,
        vehicleType: 'Heavy Commercial',
        driver: rep.driver,
        service: rep.service,
        date: 'Just now',
        location: rep.location,
        amount: rep.amount,
        rating: 5.0,
        status: 'SETTLED',
        category: 'All',
      };
      setServiceHistory((prev) => [historyEntry, ...prev]);
    }
  };

  const value = useMemo(
    () => ({
      requests,
      repairs,
      serviceHistory,
      reviews,
      earningsSummary,
      earningsTransactions,
      profile,
      availability,
      sosMode,
      setAvailability,
      setSosMode,
      updateProfile,
      acceptRequest,
      rejectRequest,
      updateRepairStep,
      completeRepair,
      getRequestById,
      getRepairById,
    }),
    [
      requests,
      repairs,
      serviceHistory,
      reviews,
      earningsSummary,
      earningsTransactions,
      profile,
      availability,
      sosMode,
    ]
  );

  return <MechanicContext.Provider value={value}>{children}</MechanicContext.Provider>;
};

export const useMechanic = (): MechanicContextType => {
  const context = useContext(MechanicContext);
  if (!context) {
    throw new Error('useMechanic must be used within a MechanicProvider');
  }
  return context;
};

export default MechanicContext;

