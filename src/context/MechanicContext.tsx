import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  MechanicRequest,
  RepairJob,
  mockRequests,
  mockRepairs,
} from '@/constants/mechanicMockData';

interface MechanicContextType {
  requests: MechanicRequest[];
  repairs: RepairJob[];
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

  const getRequestById = (id: string): MechanicRequest | undefined => {
    return requests.find((r) => r.id === id);
  };

  const getRepairById = (id: string): RepairJob | undefined => {
    return repairs.find((r) => r.id === id);
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
          return {
            ...r,
            status: stage.status,
            progress: stage.progress,
            timeElapsed: stepIndex === REPAIR_STAGES.length - 1 ? 'Job Completed' : r.timeElapsed,
          };
        }
        return r;
      })
    );
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
  };

  const value = useMemo(
    () => ({
      requests,
      repairs,
      acceptRequest,
      rejectRequest,
      updateRepairStep,
      completeRepair,
      getRequestById,
      getRepairById,
    }),
    [requests, repairs]
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
