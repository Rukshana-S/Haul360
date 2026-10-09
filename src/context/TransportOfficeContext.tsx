import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  TransportOffice,
  OfficeDriver,
  OfficeVehicle,
  OfficeShipment,
  BreakdownIncident,
  MockNearbyMechanic,
  OfficeNotification,
  DriverNotification,
  HistoryItem,
  BreakdownIssueType,
  BreakdownStatus,
  TripStage,
  OfficeFinancials,
  EarningTripItem,
  PassbookTransaction,
  RewardAccount,
  VehicleFastag,
  FastagTransaction,
  DriverFinancials,
  DriverTripEarning,
  MechanicReview,
  initialTransportOffice,
  initialOfficeDrivers,
  initialOfficeVehicles,
  initialOfficeShipments,
  mockNearbyMechanics,
  initialBreakdowns,
  initialOfficeNotifications,
  initialDriverNotifications,
  initialHistoryItems,
  initialOfficeFinancials,
  initialEarningTrips,
  initialPassbookTransactions,
  initialRewardAccount,
  initialDriverFinancials,
  initialDriverTripEarnings,
  initialMechanicReviews,
} from '@/constants/transportOfficeMockData';

export interface AddDriverInput {
  name: string;
  phone: string;
  email: string;
  age: number;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  aadhaarNumber?: string;
  aadhaarStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  panNumber?: string;
  panStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  documentStatus?: 'VERIFIED' | 'PENDING' | 'EXPIRED';
}

export interface AddVehicleInput {
  vehicleNumber: string;
  vehicleType: string;
  model: string;
  capacityKg: number;
  fuelType: 'Diesel' | 'CNG' | 'Electric';
  rcNumber: string;
  rcStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  insuranceNumber?: string;
  insuranceExpiry?: string;
  insuranceStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  permitStatus: 'NATIONAL_PERMIT' | 'STATE_PERMIT';
}

export interface ReportBreakdownInput {
  driverId: string;
  vehicleId: string;
  shipmentId: string;
  issueType: BreakdownIssueType;
  description: string;
  location: string;
}

interface TransportOfficeContextType {
  office: TransportOffice;
  drivers: OfficeDriver[];
  vehicles: OfficeVehicle[];
  shipments: OfficeShipment[];
  breakdowns: BreakdownIncident[];
  mechanics: MockNearbyMechanic[];
  officeNotifications: OfficeNotification[];
  driverNotifications: DriverNotification[];
  historyItems: HistoryItem[];
  financials: OfficeFinancials;
  earningTrips: EarningTripItem[];
  passbook: PassbookTransaction[];
  rewards: RewardAccount;
  driverFinancials: DriverFinancials;
  driverTripEarnings: DriverTripEarning[];
  mechanicReviews: MechanicReview[];
  currentDriverUser: OfficeDriver | null;

  // Office Actions
  updateOfficeProfile: (updated: Partial<TransportOffice>) => void;
  addDriver: (input: AddDriverInput) => { driver: OfficeDriver; tempPassword: string };
  inactivateDriver: (driverId: string) => { success: boolean; error?: string };
  activateDriver: (driverId: string) => { success: boolean; error?: string };
  rateDriver: (driverId: string, rating: number, feedback?: string) => void;
  addVehicle: (input: AddVehicleInput) => OfficeVehicle;
  inactivateVehicle: (vehicleId: string) => { success: boolean; error?: string };
  activateVehicle: (vehicleId: string) => { success: boolean; error?: string };
  markVehicleMaintenance: (vehicleId: string, isMaintenance: boolean) => void;
  sendShipmentRequest: (shipmentId: string) => void;
  simulateOrgResponse: (shipmentId: string, accept: boolean, reason?: string) => void;
  placeBid: (
    shipmentId: string,
    bidAmount: number,
    isReturnLoad?: boolean,
    originalShipmentId?: string
  ) => { success: boolean; error?: string };
  cancelBid: (shipmentId: string) => void;
  simulateOrgBidResponse: (shipmentId: string, accept: boolean, reason?: string) => void;
  getMatchingReturnLoads: (originalShipmentId: string) => OfficeShipment[];
  assignDriverAndVehicle: (
    shipmentId: string,
    driverId: string,
    vehicleId: string
  ) => { success: boolean; error?: string };
  requestMechanic: (breakdownId: string, mechanicId: string) => void;
  progressMechanicStatus: (breakdownId: string) => void;
  replaceVehicleForBreakdown: (breakdownId: string, newVehicleId: string) => { success: boolean; error?: string };
  markOfficeNotificationRead: (id: string) => void;
  rechargeVehicleFastag: (vehicleId: string, amount: number) => { success: boolean; newBalance?: number; error?: string };
  deductVehicleToll: (vehicleId: string, amount: number, location: string) => { success: boolean; newBalance?: number; error?: string };
  withdrawOfficeFunds: (amount: number, bankMethod?: string) => { success: boolean; error?: string };

  // Driver Actions
  setCurrentDriverUser: (driver: OfficeDriver | null) => void;
  loginDriverMock: (identifier: string, pass: string) => { success: boolean; driver?: OfficeDriver; isFirstLogin?: boolean; error?: string };
  updateDriverPassword: (driverId: string, newPass: string) => boolean;
  updateDriverProfile: (driverId: string, updated: Partial<OfficeDriver>) => { success: boolean; error?: string };
  acceptAssignment: (shipmentId: string) => void;
  declineAssignment: (shipmentId: string, reason: string) => void;
  startTrip: (shipmentId: string) => void;
  advanceTripStage: (shipmentId: string) => void;
  advanceShipmentTrackingStep: (shipmentId: string) => void;
  reportBreakdown: (input: ReportBreakdownInput) => BreakdownIncident;
  resumeTripAfterBreakdown: (breakdownId: string) => void;
  rateMechanicService: (breakdownId: string, rating: number, comment?: string) => { success: boolean; error?: string };
  markDriverNotificationRead: (id: string) => void;

  // Getters
  getDriverById: (id: string) => OfficeDriver | undefined;
  getVehicleById: (id: string) => OfficeVehicle | undefined;
  getShipmentById: (id: string) => OfficeShipment | undefined;
  getBreakdownById: (id: string) => BreakdownIncident | undefined;
  getMechanicById: (id: string) => MockNearbyMechanic | undefined;
  getVehicleFastag: (vehicleId: string) => VehicleFastag | undefined;
}

const TransportOfficeContext = createContext<TransportOfficeContextType | undefined>(undefined);

export const TransportOfficeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [office, setOffice] = useState<TransportOffice>(initialTransportOffice);
  const [drivers, setDrivers] = useState<OfficeDriver[]>(initialOfficeDrivers);
  const [vehicles, setVehicles] = useState<OfficeVehicle[]>(initialOfficeVehicles);
  const [shipments, setShipments] = useState<OfficeShipment[]>(initialOfficeShipments);
  const [breakdowns, setBreakdowns] = useState<BreakdownIncident[]>(initialBreakdowns);
  const [mechanics] = useState<MockNearbyMechanic[]>(mockNearbyMechanics);
  const [officeNotifications, setOfficeNotifications] = useState<OfficeNotification[]>(initialOfficeNotifications);
  const [driverNotifications, setDriverNotifications] = useState<DriverNotification[]>(initialDriverNotifications);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialHistoryItems);
  const [financials, setFinancials] = useState<OfficeFinancials>(initialOfficeFinancials);
  const [earningTrips, setEarningTrips] = useState<EarningTripItem[]>(initialEarningTrips);
  const [passbook, setPassbook] = useState<PassbookTransaction[]>(initialPassbookTransactions);
  const [rewards, setRewards] = useState<RewardAccount>(initialRewardAccount);
  const [driverFinancials, setDriverFinancials] = useState<DriverFinancials>(initialDriverFinancials);
  const [driverTripEarnings, setDriverTripEarnings] = useState<DriverTripEarning[]>(initialDriverTripEarnings);
  const [mechanicReviews, setMechanicReviews] = useState<MechanicReview[]>(initialMechanicReviews);

  // Active simulated driver session
  const [currentDriverUser, setCurrentDriverUserState] = useState<OfficeDriver | null>(() => {
    return initialOfficeDrivers.find((d) => d.id === 'H360-D-1042') || null;
  });

  const setCurrentDriverUser = useCallback((driver: OfficeDriver | null) => {
    setCurrentDriverUserState(driver);
  }, []);

  const updateOfficeProfile = useCallback((updated: Partial<TransportOffice>) => {
    setOffice((prev) => ({ ...prev, ...updated }));
  }, []);

  // 1. Add Driver (No vehicle assignment)
  const addDriver = useCallback((input: AddDriverInput) => {
    const nextIndex = drivers.length + 1042;
    const driverId = `H360-D-${nextIndex}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const tempPassword = `H360@${randomCode}`;

    const newDriver: OfficeDriver = {
      id: driverId,
      officeId: office.id,
      name: input.name,
      phone: input.phone,
      email: input.email || `${input.name.toLowerCase().replace(/\s+/g, '.')}@haul360.com`,
      age: input.age,
      address: input.address,
      licenseNumber: input.licenseNumber,
      licenseExpiry: input.licenseExpiry,
      licenseStatus: input.licenseStatus || 'VERIFIED',
      aadhaarNumber: input.aadhaarNumber || 'XXXX-XXXX-8822',
      aadhaarStatus: input.aadhaarStatus || 'VERIFIED',
      panNumber: input.panNumber || 'ABCDE9901Z',
      panStatus: input.panStatus || 'VERIFIED',
      documentStatus: input.documentStatus || 'VERIFIED',
      isFirstLogin: true,
      tempPassword,
      isActive: true,
      availability: 'AVAILABLE',
      currentShipmentId: null,
      currentVehicleId: null,
      completedTripsCount: 0,
      rating: 0,
      ratingCount: 0,
      lastRatedDate: 'No ratings yet',
      experienceYears: Math.max(1, input.age - 22),
      joinedDate: 'Just now',
    };

    setDrivers((prev) => [newDriver, ...prev]);

    // Create notification
    const newNotif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Driver Account Created',
      message: `${newDriver.name} added (ID: ${driverId}). Documents verified. Temporary password generated.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
    };
    setOfficeNotifications((prev) => [newNotif, ...prev]);

    return { driver: newDriver, tempPassword };
  }, [drivers.length, office.id]);

  const inactivateDriver = useCallback((driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return { success: false, error: 'Driver not found.' };

    if (driver.availability === 'BUSY' || driver.availability === 'ASSIGNMENT_PENDING' || driver.currentShipmentId) {
      return {
        success: false,
        error: `Driver ${driver.name} is currently assigned to an active trip. Complete or re-assign trip before inactivating.`,
      };
    }

    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, isActive: false, availability: 'OFFLINE' } : d))
    );

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Driver Deactivated',
      message: `${driver.name} (ID: ${driver.id}) has been soft-deactivated and excluded from new assignments.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);

    return { success: true };
  }, [drivers]);

  const activateDriver = useCallback((driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, isActive: true, availability: 'AVAILABLE' } : d))
    );
    return { success: true };
  }, []);

  const rateDriver = useCallback((driverId: string, rating: number, feedback?: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const currentCount = d.ratingCount || 0;
          const currentRating = d.rating || 5;
          const newCount = currentCount + 1;
          const newAvg = Number(((currentRating * currentCount + rating) / newCount).toFixed(2));
          return {
            ...d,
            rating: newAvg,
            ratingCount: newCount,
            lastRatedDate: 'Just now',
          };
        }
        return d;
      })
    );

    if (feedback) {
      const notif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: 'Driver Rating Submitted',
        message: `Driver rated ${rating}★. Feedback: "${feedback}"`,
        time: 'Just now',
        type: 'SYSTEM',
        read: false,
      };
      setOfficeNotifications((prev) => [notif, ...prev]);
    }
  }, []);

  // 2. Add Vehicle
  const addVehicle = useCallback((input: AddVehicleInput) => {
    const nextIndex = vehicles.length + 1;
    const vehicleId = `VEH-${String(nextIndex).padStart(3, '0')}`;

    const newVehicle: OfficeVehicle = {
      id: vehicleId,
      officeId: office.id,
      vehicleNumber: input.vehicleNumber.toUpperCase().trim(),
      vehicleType: input.vehicleType,
      model: input.model,
      capacityKg: input.capacityKg,
      fuelType: input.fuelType,
      rcNumber: input.rcNumber.toUpperCase().trim(),
      rcStatus: input.rcStatus || 'VERIFIED',
      insuranceNumber: input.insuranceNumber || `POL-${Date.now().toString().slice(-6)}`,
      insuranceExpiry: input.insuranceExpiry || '2027-12-31',
      insuranceStatus: input.insuranceStatus || 'VALID',
      permitStatus: input.permitStatus,
      isActive: true,
      status: 'AVAILABLE',
      currentDriverId: null,
      currentShipmentId: null,
      lastMaintenanceDate: 'Not serviced yet',
    };

    setVehicles((prev) => [newVehicle, ...prev]);

    const newNotif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Vehicle Added to Fleet',
      message: `Commercial Vehicle ${newVehicle.vehicleNumber} registered with payload capacity of ${(newVehicle.capacityKg / 1000).toFixed(1)}T.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
    };
    setOfficeNotifications((prev) => [newNotif, ...prev]);

    return newVehicle;
  }, [vehicles.length, office.id]);

  const inactivateVehicle = useCallback((vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return { success: false, error: 'Vehicle asset not found.' };

    if (vehicle.status === 'IN_TRIP' || vehicle.status === 'ASSIGNED' || vehicle.currentShipmentId) {
      return {
        success: false,
        error: `Vehicle ${vehicle.vehicleNumber} is currently assigned to an active trip. Complete trip before deactivating.`,
      };
    }

    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, isActive: false, status: 'OFFLINE' } : v))
    );

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Vehicle Deactivated',
      message: `Vehicle ${vehicle.vehicleNumber} has been soft-deactivated and excluded from new assignments.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);

    return { success: true };
  }, [vehicles]);

  const activateVehicle = useCallback((vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, isActive: true, status: 'AVAILABLE' } : v))
    );
    return { success: true };
  }, []);

  const markVehicleMaintenance = useCallback((vehicleId: string, isMaintenance: boolean) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              status: isMaintenance ? 'MAINTENANCE' : 'AVAILABLE',
              lastMaintenanceDate: isMaintenance ? 'In Workshop' : 'Just inspected',
            }
          : v
      )
    );
  }, []);

  // 3. Send Shipment Request to Organization
  const sendShipmentRequest = useCallback((shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            requestStatus: 'REQUEST_SENT',
            requestSentAt: 'Just now',
            timeline: [
              ...s.timeline,
              {
                title: 'Request Sent to Organization',
                time: 'Just now',
                completed: true,
                description: `Sent haul request to ${s.organizationName}`,
              },
            ],
          };
        }
        return s;
      })
    );

    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment) {
      const notif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: 'Haul Request Sent',
        message: `Request sent to ${shipment.organizationName} for Shipment #${shipment.id} (${shipment.origin} → ${shipment.destination}). Waiting for organization approval.`,
        time: 'Just now',
        type: 'REQUEST',
        read: false,
        targetId: shipment.id,
      };
      setOfficeNotifications((prev) => [notif, ...prev]);
    }
  }, [shipments]);

  // 4. Simulate Organization Response (Accept / Reject)
  const simulateOrgResponse = useCallback((shipmentId: string, accept: boolean, reason?: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            requestStatus: accept ? 'ACCEPTED' : 'REJECTED',
            responseReceivedAt: 'Just now',
            rejectionReason: accept ? undefined : (reason || 'Capacity not required by shipper at this time.'),
            timeline: [
              ...s.timeline,
              {
                title: accept ? 'Organization Approved Request' : 'Organization Declined Request',
                time: 'Just now',
                completed: true,
                description: accept
                  ? `${s.organizationName} approved your haul allocation. You can now assign a driver and vehicle.`
                  : `${s.organizationName} declined this request.`,
              },
            ],
          };
        }
        return s;
      })
    );

    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment) {
      const notif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: accept ? 'Shipment Request Approved' : 'Shipment Request Declined',
        message: accept
          ? `${shipment.organizationName} approved Shipment #${shipment.id}. Ready for Driver and Vehicle assignment.`
          : `${shipment.organizationName} declined request for #${shipment.id}.`,
        time: 'Just now',
        type: 'REQUEST',
        read: false,
        targetId: shipment.id,
      };
      setOfficeNotifications((prev) => [notif, ...prev]);
    }
  }, [shipments]);

  // 4b. Place Bid on Normal Shipment or Return Load
  const placeBid = useCallback((
    shipmentId: string,
    bidAmount: number,
    isReturnLoad?: boolean,
    originalShipmentId?: string
  ) => {
    const target = shipments.find((s) => s.id === shipmentId);
    if (!target) return { success: false, error: 'Shipment not found.' };

    const originalShipment = originalShipmentId ? shipments.find((s) => s.id === originalShipmentId) : null;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            currentBidAmount: bidAmount,
            bidStatus: 'PENDING',
            requestStatus: 'REQUEST_SENT',
            bidPlacedAt: 'Just now',
            returnLoadForShipmentId: isReturnLoad ? originalShipmentId : s.returnLoadForShipmentId,
            returnLoadStatus: isReturnLoad ? 'WAITING_ORGANIZATION_APPROVAL' : s.returnLoadStatus,
            timeline: [
              ...s.timeline,
              {
                title: isReturnLoad ? `Return Load Bid Placed (₹${bidAmount.toLocaleString('en-IN')})` : `Bid Submitted (₹${bidAmount.toLocaleString('en-IN')})`,
                time: 'Just now',
                completed: true,
                description: isReturnLoad && originalShipmentId
                  ? `Placed return haul bid for trip #${originalShipmentId} (${originalShipment?.origin} → ${originalShipment?.destination}). Waiting for ${s.organizationName} approval.`
                  : `Proposed rate of ₹${bidAmount.toLocaleString('en-IN')} to ${s.organizationName}. Waiting for review.`,
              },
            ],
          };
        }
        if (isReturnLoad && originalShipmentId && s.id === originalShipmentId) {
          return {
            ...s,
            activeReturnLoadShipmentId: shipmentId,
          };
        }
        return s;
      })
    );

    const notifTitle = isReturnLoad ? 'Return Load Bid Placed' : 'Shipment Bid Submitted';
    const notifMsg = isReturnLoad
      ? `Bid of ₹${bidAmount.toLocaleString('en-IN')} placed for return shipment #${target.id} (${target.origin} → ${target.destination}). Waiting for ${target.organizationName} approval.`
      : `Bid of ₹${bidAmount.toLocaleString('en-IN')} submitted to ${target.organizationName} for Shipment #${target.id}.`;

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: notifTitle,
      message: notifMsg,
      time: 'Just now',
      type: 'REQUEST',
      read: false,
      targetId: target.id,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);

    return { success: true };
  }, [shipments]);

  // 4c. Cancel Bid
  const cancelBid = useCallback((shipmentId: string) => {
    const target = shipments.find((s) => s.id === shipmentId);
    const origId = target?.returnLoadForShipmentId;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            currentBidAmount: null,
            bidStatus: 'NONE',
            requestStatus: 'NOT_REQUESTED',
            returnLoadStatus: undefined,
            returnLoadForShipmentId: undefined,
          };
        }
        if (origId && s.id === origId) {
          return {
            ...s,
            activeReturnLoadShipmentId: null,
          };
        }
        return s;
      })
    );
  }, [shipments]);

  // 4d. Simulate Organization Bid Response (Accept / Reject)
  const simulateOrgBidResponse = useCallback((shipmentId: string, accept: boolean, reason?: string) => {
    const target = shipments.find((s) => s.id === shipmentId);
    if (!target) return;

    const isReturn = !!target.returnLoadForShipmentId;
    const origShipment = isReturn ? shipments.find((s) => s.id === target.returnLoadForShipmentId) : null;
    const finalAmount = target.currentBidAmount || target.amount;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          if (accept) {
            return {
              ...s,
              amount: finalAmount,
              bidStatus: 'ACCEPTED',
              requestStatus: 'ACCEPTED',
              returnLoadStatus: isReturn ? 'ACCEPTED_BY_ORGANIZATION' : s.returnLoadStatus,
              assignedDriverId: isReturn ? (origShipment?.assignedDriverId || s.assignedDriverId) : s.assignedDriverId,
              assignedVehicleId: isReturn ? (origShipment?.assignedVehicleId || s.assignedVehicleId) : s.assignedVehicleId,
              status: isReturn ? 'ASSIGNMENT_PENDING' : s.status,
              responseReceivedAt: 'Just now',
              timeline: [
                ...s.timeline,
                {
                  title: isReturn ? `Organization Accepted Return Load (₹${finalAmount.toLocaleString('en-IN')})` : `Organization Accepted Bid (₹${finalAmount.toLocaleString('en-IN')})`,
                  time: 'Just now',
                  completed: true,
                  description: isReturn
                    ? `${s.organizationName} approved your return haul bid. Assigned to driver and vehicle from original trip.`
                    : `${s.organizationName} accepted your bid. Ready for driver & vehicle assignment.`,
                },
              ],
            };
          } else {
            return {
              ...s,
              bidStatus: 'REJECTED',
              requestStatus: 'REJECTED',
              returnLoadStatus: isReturn ? 'REJECTED_BY_ORGANIZATION' : undefined,
              rejectionReason: reason || 'Organization selected an alternate carrier bid.',
              responseReceivedAt: 'Just now',
              timeline: [
                ...s.timeline,
                {
                  title: 'Organization Declined Bid',
                  time: 'Just now',
                  completed: true,
                  description: reason || 'Bid declined by organization.',
                },
              ],
            };
          }
        }
        if (!accept && isReturn && origShipment && s.id === origShipment.id) {
          return {
            ...s,
            activeReturnLoadShipmentId: null,
          };
        }
        return s;
      })
    );

    if (accept) {
      // Office notification
      const officeNotif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: isReturn ? '🎉 Return Load Bid Approved' : '🎉 Shipment Bid Accepted',
        message: isReturn
          ? `${target.organizationName} accepted your return load bid of ₹${finalAmount.toLocaleString('en-IN')} for Shipment #${target.id} (${target.origin} → ${target.destination}). Driver has been notified.`
          : `${target.organizationName} accepted your bid of ₹${finalAmount.toLocaleString('en-IN')} for Shipment #${target.id}. You can now dispatch a driver.`,
        time: 'Just now',
        type: 'REQUEST',
        read: false,
        targetId: target.id,
      };
      setOfficeNotifications((prev) => [officeNotif, ...prev]);

      // CRITICAL RULE: NOTIFY DRIVER ONLY AFTER ORGANIZATION ACCEPTANCE
      if (isReturn && origShipment?.assignedDriverId) {
        const assignedDrv = drivers.find((d) => d.id === origShipment.assignedDriverId);
        const driverNotif: DriverNotification = {
          id: `NOTIF-D-${Date.now()}`,
          title: '🔔 Return Load Confirmed',
          message: `A return load from ${target.origin} to ${target.destination} has been confirmed with ${target.organizationName}. Rate: ₹${finalAmount.toLocaleString('en-IN')}.`,
          time: 'Just now',
          type: 'RETURN_LOAD',
          read: false,
          targetId: target.id,
          shipmentId: target.id,
          originalShipmentId: origShipment.id,
          organizationName: target.organizationName,
          amount: finalAmount,
          route: `${target.origin} → ${target.destination}`,
        };
        setDriverNotifications((prev) => [driverNotif, ...prev]);
      }
    } else {
      const officeNotif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: 'Bid Declined by Organization',
        message: `${target.organizationName} declined your bid for Shipment #${target.id}.`,
        time: 'Just now',
        type: 'REQUEST',
        read: false,
        targetId: target.id,
      };
      setOfficeNotifications((prev) => [officeNotif, ...prev]);
    }
  }, [shipments, drivers]);

  // 4e. Find Matching Return Loads (Auto-reverses origin & destination)
  const getMatchingReturnLoads = useCallback((originalShipmentId: string) => {
    const original = shipments.find((s) => s.id === originalShipmentId);
    if (!original) return [];

    const origOrigin = original.origin.toLowerCase().trim();
    const origDest = original.destination.toLowerCase().trim();

    return shipments.filter((s) => {
      if (s.id === originalShipmentId) return false;
      // Reversible route match: Return origin is original destination, Return destination is original origin
      const returnOrigin = s.origin.toLowerCase().trim();
      const returnDest = s.destination.toLowerCase().trim();

      const originMatches = returnOrigin.includes(origDest) || origDest.includes(returnOrigin);
      const destMatches = returnDest.includes(origOrigin) || origOrigin.includes(returnDest);

      if (!originMatches || !destMatches) return false;

      // Must be available or already linked to this original trip
      const isAvailable = s.status === 'PENDING_ASSIGNMENT' && (!s.assignedDriverId || s.returnLoadForShipmentId === originalShipmentId);
      const isLinkedToUs = s.returnLoadForShipmentId === originalShipmentId;

      return isAvailable || isLinkedToUs;
    });
  }, [shipments]);

  // 5. Assign Driver & Vehicle (Unlocked ONLY when requestStatus === 'ACCEPTED')
  const assignDriverAndVehicle = useCallback((
    shipmentId: string,
    driverId: string,
    vehicleId: string
  ) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment) return { success: false, error: 'Shipment not found.' };

    if (shipment.requestStatus !== 'ACCEPTED') {
      return {
        success: false,
        error: 'Cannot assign fleet before Organization has approved the shipment request.',
      };
    }

    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return { success: false, error: 'Selected driver not found.' };
    if (!driver.isActive || driver.availability !== 'AVAILABLE') {
      return { success: false, error: `Driver ${driver.name} is currently ${driver.availability.toLowerCase()} or inactive.` };
    }

    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return { success: false, error: 'Selected vehicle not found.' };
    if (!vehicle.isActive || vehicle.status !== 'AVAILABLE') {
      return { success: false, error: `Vehicle ${vehicle.vehicleNumber} is currently ${vehicle.status.toLowerCase()} or inactive.` };
    }

    // Capacity validation
    if (vehicle.capacityKg < shipment.cargoWeightKg) {
      return {
        success: false,
        error: `Vehicle capacity (${(vehicle.capacityKg / 1000).toFixed(1)}T) is insufficient for shipment cargo weight (${(shipment.cargoWeightKg / 1000).toFixed(1)}T).`,
      };
    }

    // Update Shipment
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'ASSIGNMENT_PENDING',
            assignedDriverId: driverId,
            assignedVehicleId: vehicleId,
            declinedDriverId: null,
            declineReason: null,
            timeline: [
              ...s.timeline,
              {
                title: 'Driver & Vehicle Assigned',
                time: 'Just now',
                completed: true,
                description: `${driver.name} • ${vehicle.vehicleNumber} • Awaiting Driver Acceptance`,
              },
            ],
          };
        }
        return s;
      })
    );

    // Update Driver
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          return {
            ...d,
            availability: 'ASSIGNMENT_PENDING',
            currentShipmentId: shipmentId,
            currentVehicleId: vehicleId,
          };
        }
        return d;
      })
    );

    // Update Vehicle
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            status: 'ASSIGNED',
            currentDriverId: driverId,
            currentShipmentId: shipmentId,
          };
        }
        return v;
      })
    );

    // Add Driver Notification
    const driverNotif: DriverNotification = {
      id: `NOTIF-D-${Date.now()}`,
      title: 'New Shipment Assignment',
      message: `You have been assigned to ${shipment.organizationName} shipment #${shipment.id} (${shipment.origin} → ${shipment.destination}) with vehicle ${vehicle.vehicleNumber}. Amount: ₹${shipment.amount.toLocaleString('en-IN')}.`,
      time: 'Just now',
      type: 'ASSIGNMENT',
      read: false,
      targetId: shipment.id,
    };
    setDriverNotifications((prev) => [driverNotif, ...prev]);

    // Add History Item
    const newHist: HistoryItem = {
      id: `HIST-${Date.now()}`,
      type: 'ASSIGNMENT',
      title: `Shipment #${shipment.id} Assigned`,
      subtitle: `${shipment.organizationName} • ₹${shipment.amount.toLocaleString('en-IN')} • ${driver.name} & ${vehicle.vehicleNumber}`,
      date: 'Just now',
      status: 'PENDING_ACCEPTANCE',
      route: `${shipment.origin} → ${shipment.destination}`,
      driverName: driver.name,
      vehicleNumber: vehicle.vehicleNumber,
    };
    setHistoryItems((prev) => [newHist, ...prev]);

    return { success: true };
  }, [shipments, drivers, vehicles]);

  // 6. Driver Accept Assignment
  const acceptAssignment = useCallback((shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment) return;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'ACCEPTED',
            tripStage: 'READY_FOR_PICKUP',
            timeline: [
              ...s.timeline,
              {
                title: 'Driver Accepted Assignment',
                time: 'Just now',
                completed: true,
                description: 'Driver confirmed trip & vehicle pre-check',
              },
            ],
          };
        }
        return s;
      })
    );

    if (shipment.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === shipment.assignedDriverId ? { ...d, availability: 'BUSY' } : d))
      );
    }

    if (shipment.assignedVehicleId) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === shipment.assignedVehicleId ? { ...v, status: 'IN_TRIP' } : v))
      );
    }

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Assignment Accepted',
      message: `Driver accepted assignment for Shipment #${shipment.id} (${shipment.origin} → ${shipment.destination}).`,
      time: 'Just now',
      type: 'ASSIGNMENT',
      read: false,
      targetId: shipment.id,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);
  }, [shipments]);

  // 7. Driver Decline Assignment
  const declineAssignment = useCallback((shipmentId: string, reason: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment) return;

    const declinedDriverId = shipment.assignedDriverId;
    const declinedVehicleId = shipment.assignedVehicleId;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'DECLINED',
            declinedDriverId,
            declineReason: reason,
            assignedDriverId: null,
            assignedVehicleId: null,
            timeline: [
              ...s.timeline,
              {
                title: 'Driver Declined Assignment',
                time: 'Just now',
                completed: true,
                description: `Reason: ${reason}`,
              },
            ],
          };
        }
        return s;
      })
    );

    if (declinedDriverId) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === declinedDriverId
            ? { ...d, availability: 'AVAILABLE', currentShipmentId: null, currentVehicleId: null }
            : d
        )
      );
    }

    if (declinedVehicleId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === declinedVehicleId
            ? { ...v, status: 'AVAILABLE', currentDriverId: null, currentShipmentId: null }
            : v
        )
      );
    }

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Assignment Declined by Driver',
      message: `Driver declined Shipment #${shipment.id}. Reason: "${reason}". Reassignment required.`,
      time: 'Just now',
      type: 'ASSIGNMENT',
      read: false,
      targetId: shipment.id,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);
  }, [shipments]);

  const startTrip = useCallback((shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'IN_TRANSIT',
            tripStage: 'IN_TRANSIT',
            timeline: [
              ...s.timeline,
              {
                title: 'Trip In Transit',
                time: 'Just now',
                completed: true,
                description: 'Vehicle en route on highway corridor',
              },
            ],
          };
        }
        return s;
      })
    );
  }, []);

  const advanceTripStage = useCallback((shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          const currentStage = s.tripStage || 'ASSIGNED';
          let nextStage: TripStage = 'IN_TRANSIT';
          let newStatus = s.status;

          if (currentStage === 'ASSIGNED') nextStage = 'READY_FOR_PICKUP';
          else if (currentStage === 'READY_FOR_PICKUP') nextStage = 'TRIP_STARTED';
          else if (currentStage === 'TRIP_STARTED') {
            nextStage = 'IN_TRANSIT';
            newStatus = 'IN_TRANSIT';
          } else if (currentStage === 'IN_TRANSIT') nextStage = 'ARRIVED';
          else if (currentStage === 'ARRIVED') {
            nextStage = 'DELIVERED';
            newStatus = 'DELIVERED';
          }

          // If delivered, free up driver and vehicle
          if (nextStage === 'DELIVERED') {
            if (s.assignedDriverId) {
              setDrivers((dPrev) =>
                dPrev.map((d) =>
                  d.id === s.assignedDriverId
                    ? { ...d, availability: 'AVAILABLE', currentShipmentId: null, currentVehicleId: null, completedTripsCount: d.completedTripsCount + 1 }
                    : d
                )
              );
            }
            if (s.assignedVehicleId) {
              setVehicles((vPrev) =>
                vPrev.map((v) =>
                  v.id === s.assignedVehicleId
                    ? { ...v, status: 'AVAILABLE', currentDriverId: null, currentShipmentId: null }
                    : v
                )
              );
            }
          }

          return {
            ...s,
            tripStage: nextStage,
            status: newStatus,
            timeline: [
              ...s.timeline,
              {
                title: `Trip Stage: ${nextStage.replace(/_/g, ' ')}`,
                time: 'Just now',
                completed: true,
              },
            ],
          };
        }
        return s;
      })
    );
  }, []);

  const reportBreakdown = useCallback((input: ReportBreakdownInput) => {
    const driver = drivers.find((d) => d.id === input.driverId);
    const vehicle = vehicles.find((v) => v.id === input.vehicleId);
    const shipment = shipments.find((s) => s.id === input.shipmentId);

    const newIncident: BreakdownIncident = {
      id: `BD-${String(breakdowns.length + 1).padStart(3, '0')}`,
      officeId: office.id,
      driverId: input.driverId,
      driverName: driver?.name || 'Driver',
      driverPhone: driver?.phone || '9876543210',
      vehicleId: input.vehicleId,
      vehicleNumber: vehicle?.vehicleNumber || 'Vehicle',
      vehicleType: vehicle?.vehicleType || 'Truck',
      shipmentId: input.shipmentId,
      route: shipment ? `${shipment.origin} → ${shipment.destination}` : 'Highway',
      issueType: input.issueType,
      description: input.description,
      location: input.location,
      status: 'REPORTED',
      reportedAt: 'Just now',
    };

    setBreakdowns((prev) => [newIncident, ...prev]);

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: '🚨 Breakdown Reported',
      message: `Driver ${newIncident.driverName} reported ${newIncident.issueType} on vehicle ${newIncident.vehicleNumber} at ${newIncident.location}.`,
      time: 'Just now',
      type: 'BREAKDOWN',
      read: false,
      targetId: newIncident.id,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);

    return newIncident;
  }, [drivers, vehicles, shipments, breakdowns.length, office.id]);

  const requestMechanic = useCallback((breakdownId: string, mechanicId: string) => {
    const mech = mechanics.find((m) => m.id === mechanicId);
    setBreakdowns((prev) =>
      prev.map((b) =>
        b.id === breakdownId
          ? {
              ...b,
              status: 'MECHANIC_REQUESTED',
              assignedMechanicId: mechanicId,
              assignedMechanicName: mech?.name || 'Assigned Mechanic',
              mechanicEtaMinutes: mech?.etaMinutes || 25,
            }
          : b
      )
    );
  }, [mechanics]);

  const progressMechanicStatus = useCallback((breakdownId: string) => {
    setBreakdowns((prev) =>
      prev.map((b) => {
        if (b.id === breakdownId) {
          const statusOrder: BreakdownStatus[] = [
            'REPORTED',
            'MECHANIC_REQUESTED',
            'MECHANIC_ACCEPTED',
            'MECHANIC_ON_WAY',
            'MECHANIC_ARRIVED',
            'REPAIRING',
            'REPAIRED',
            'RESOLVED',
          ];
          const currentIdx = statusOrder.indexOf(b.status);
          const nextStatus = statusOrder[Math.min(currentIdx + 1, statusOrder.length - 1)];
          return {
            ...b,
            status: nextStatus,
            resolvedAt: nextStatus === 'RESOLVED' ? 'Just now' : b.resolvedAt,
          };
        }
        return b;
      })
    );
  }, []);

  const replaceVehicleForBreakdown = useCallback((breakdownId: string, newVehicleId: string) => {
    const incident = breakdowns.find((b) => b.id === breakdownId);
    if (!incident) return { success: false, error: 'Breakdown incident not found.' };

    const newVeh = vehicles.find((v) => v.id === newVehicleId);
    if (!newVeh || !newVeh.isActive || newVeh.status !== 'AVAILABLE') {
      return { success: false, error: 'Replacement vehicle is not available.' };
    }

    // Assign new vehicle to shipment
    setShipments((prev) =>
      prev.map((s) => (s.id === incident.shipmentId ? { ...s, assignedVehicleId: newVehicleId } : s))
    );

    // Old vehicle goes to maintenance
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === incident.vehicleId) {
          return { ...v, status: 'MAINTENANCE', currentDriverId: null, currentShipmentId: null };
        }
        if (v.id === newVehicleId) {
          return { ...v, status: 'IN_TRIP', currentDriverId: incident.driverId, currentShipmentId: incident.shipmentId };
        }
        return v;
      })
    );

    setBreakdowns((prev) =>
      prev.map((b) => (b.id === breakdownId ? { ...b, needsReplacementVehicle: false, status: 'RESOLVED', resolvedAt: 'Just now' } : b))
    );

    return { success: true };
  }, [breakdowns, vehicles]);

  const resumeTripAfterBreakdown = useCallback((breakdownId: string) => {
    setBreakdowns((prev) =>
      prev.map((b) => (b.id === breakdownId ? { ...b, status: 'RESOLVED', resolvedAt: 'Just now' } : b))
    );
  }, []);

  const markOfficeNotificationRead = useCallback((id: string) => {
    setOfficeNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markDriverNotificationRead = useCallback((id: string) => {
    setDriverNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  // FASTag & Financial Operations
  const rechargeVehicleFastag = useCallback((vehicleId: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, error: 'Recharge amount must be greater than zero.' };
    }

    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle) {
      return { success: false, error: 'Vehicle not found.' };
    }

    const currentFastag = targetVehicle.fastag || {
      id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId,
      tagNumber: `3416-8921-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ACTIVE',
      balance: 0,
      lowBalanceThreshold: 1000,
      transactions: [],
    };

    const newBalance = currentFastag.balance + amount;
    const newStatus = newBalance > currentFastag.lowBalanceThreshold ? 'ACTIVE' : 'LOW_BALANCE';

    const newFastagTxn: FastagTransaction = {
      id: `FT-TX-${Date.now().toString().slice(-4)}`,
      vehicleId,
      vehicleNumber: targetVehicle.vehicleNumber,
      type: 'RECHARGE',
      amount,
      locationOrMethod: 'Transport Office Wallet Recharge',
      date: 'Today, Just now',
      status: 'SUCCESS',
      balanceAfter: newBalance,
    };

    const updatedFastag: VehicleFastag = {
      ...currentFastag,
      balance: newBalance,
      status: newStatus,
      lastRechargeAmount: amount,
      lastRechargeDate: 'Today',
      transactions: [newFastagTxn, ...currentFastag.transactions],
    };

    // Update Vehicle
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, fastag: updatedFastag } : v))
    );

    // Add Passbook Entry (Debit from office balance for FASTag wallet recharge)
    const newPassbookEntry: PassbookTransaction = {
      id: `PB-${Date.now().toString().slice(-4)}`,
      type: 'DEBIT',
      category: 'FASTAG_RECHARGE',
      title: 'FASTag Recharge',
      subtitle: `Vehicle ${targetVehicle.vehicleNumber} • Tag ${updatedFastag.id}`,
      amount,
      date: 'Today',
      refId: targetVehicle.vehicleNumber,
      balanceAfter: Math.max(0, financials.availableBalance - amount),
    };
    setPassbook((prev) => [newPassbookEntry, ...prev]);

    // Update Financials (Available Balance)
    setFinancials((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
    }));

    // If new balance is healthy, mark any low balance notification for this vehicle as read
    if (newStatus === 'ACTIVE') {
      setOfficeNotifications((prev) =>
        prev.map((n) =>
          n.type === 'FASTAG_LOW_BALANCE' && n.targetId === vehicleId ? { ...n, read: true } : n
        )
      );
    }

    return { success: true, newBalance };
  }, [vehicles, financials]);

  const deductVehicleToll = useCallback((vehicleId: string, amount: number, location: string) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle || !targetVehicle.fastag) {
      return { success: false, error: 'Vehicle or FASTag not found.' };
    }

    const currentFastag = targetVehicle.fastag;
    const newBalance = Math.max(0, currentFastag.balance - amount);
    const wasLowBalance = currentFastag.status === 'LOW_BALANCE';
    const isNowLowBalance = newBalance <= currentFastag.lowBalanceThreshold;
    const newStatus = isNowLowBalance ? 'LOW_BALANCE' : 'ACTIVE';

    const newFastagTxn: FastagTransaction = {
      id: `FT-TX-${Date.now().toString().slice(-4)}`,
      vehicleId,
      vehicleNumber: targetVehicle.vehicleNumber,
      type: 'TOLL_DEDUCTION',
      amount,
      locationOrMethod: location || 'National Highway Toll Plaza',
      date: 'Today, Just now',
      status: 'SUCCESS',
      balanceAfter: newBalance,
    };

    const updatedFastag: VehicleFastag = {
      ...currentFastag,
      balance: newBalance,
      status: newStatus,
      lastTollAmount: amount,
      lastTollDate: 'Today',
      transactions: [newFastagTxn, ...currentFastag.transactions],
    };

    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, fastag: updatedFastag } : v))
    );

    // Only create notification if transitioning from healthy to low balance (prevent duplicate notifications on render/repeat)
    if (!wasLowBalance && isNowLowBalance) {
      const notif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: 'FASTag Low Balance',
        message: `Vehicle ${targetVehicle.vehicleNumber} FASTag balance is ₹${newBalance.toLocaleString('en-IN')} (Threshold limit ₹${currentFastag.lowBalanceThreshold.toLocaleString('en-IN')}). Please recharge the FASTag to avoid toll payment issues.`,
        time: 'Just now',
        type: 'FASTAG_LOW_BALANCE',
        read: false,
        targetId: vehicleId,
      };
      setOfficeNotifications((prev) => [notif, ...prev]);
    }

    return { success: true, newBalance };
  }, [vehicles]);

  const withdrawOfficeFunds = useCallback((amount: number, bankMethod?: string) => {
    if (amount <= 0) return { success: false, error: 'Withdrawal amount must be greater than zero.' };
    if (amount > financials.availableBalance) {
      return { success: false, error: 'Insufficient available account balance.' };
    }

    const newAvailable = financials.availableBalance - amount;
    const newWithdrawn = financials.withdrawnAmount + amount;

    setFinancials((prev) => ({
      ...prev,
      availableBalance: newAvailable,
      withdrawnAmount: newWithdrawn,
    }));

    const newPassbookEntry: PassbookTransaction = {
      id: `PB-${Date.now().toString().slice(-4)}`,
      type: 'DEBIT',
      category: 'WITHDRAWAL',
      title: 'Bank Withdrawal',
      subtitle: bankMethod || 'Bank Transfer • Verified Office A/C',
      amount,
      date: 'Today',
      refId: `TXN-WDR-${Date.now().toString().slice(-4)}`,
      balanceAfter: newAvailable,
    };
    setPassbook((prev) => [newPassbookEntry, ...prev]);

    return { success: true };
  }, [financials]);

  // Driver Auth simulation
  const loginDriverMock = useCallback((identifier: string, pass: string) => {
    const cleanId = identifier.trim().toUpperCase();
    const cleanPhone = identifier.replace(/\D/g, '');

    const driver = drivers.find(
      (d) =>
        d.id.toUpperCase() === cleanId ||
        d.phone.replace(/\D/g, '') === cleanPhone
    );

    if (!driver) {
      return { success: false, error: 'Driver credentials not recognized in Transport Office directory.' };
    }

    if (!driver.isActive) {
      return { success: false, error: 'Driver account is inactive. Contact your Transport Office dispatcher.' };
    }

    setCurrentDriverUserState(driver);
    return {
      success: true,
      driver,
      isFirstLogin: driver.isFirstLogin,
    };
  }, [drivers]);

  const updateDriverPassword = useCallback((driverId: string, newPass: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, isFirstLogin: false, tempPassword: newPass } : d))
    );
    return true;
  }, []);

  const updateDriverProfile = useCallback((driverId: string, updated: Partial<OfficeDriver>) => {
    // Protected operational fields cannot be modified by driver
    const { id, officeId, status, availability, assignedVehicleId, ...safeUpdates } = updated as any;

    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const updatedDriver = { ...d, ...safeUpdates };
          if (currentDriverUser?.id === driverId) {
            setCurrentDriverUserState(updatedDriver);
          }
          return updatedDriver;
        }
        return d;
      })
    );

    return { success: true };
  }, [currentDriverUser?.id]);

  const rateMechanicService = useCallback((breakdownId: string, rating: number, comment?: string) => {
    const incident = breakdowns.find((b) => b.id === breakdownId);
    if (!incident) {
      return { success: false, error: 'Breakdown incident not found.' };
    }

    if (incident.status !== 'RESOLVED' && incident.status !== 'REPAIRED') {
      return { success: false, error: 'Rating is only available after mechanic service is completed.' };
    }

    if (incident.driverRated) {
      return { success: false, error: 'This mechanic service has already been rated.' };
    }

    // Update Breakdown Incident with driver rating
    setBreakdowns((prev) =>
      prev.map((b) =>
        b.id === breakdownId
          ? {
              ...b,
              driverRated: true,
              driverRating: rating,
              driverComment: comment || '',
            }
          : b
      )
    );

    // Create a new MechanicReview entry
    const newReview: MechanicReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      mechanicId: incident.assignedMechanicId || 'MECH-001',
      driverId: incident.driverId,
      shipmentId: incident.shipmentId,
      serviceRequestId: incident.id,
      rating,
      comment: comment || 'Quick response and excellent repair.',
      createdAt: 'Today',
    };

    setMechanicReviews((prev) => [newReview, ...prev]);

    return { success: true };
  }, [breakdowns]);

  const advanceShipmentTrackingStep = useCallback((shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          const stages: TripStage[] = [
            'ASSIGNED',
            'ACCEPTED',
            'EN_ROUTE_TO_PICKUP',
            'ARRIVED_AT_PICKUP',
            'LOADED',
            'IN_TRANSIT',
            'ARRIVED_AT_DESTINATION',
            'DELIVERED',
          ];
          const currentStage = s.tripStage || 'ASSIGNED';
          const currentIdx = stages.indexOf(currentStage);
          const nextIdx = Math.min(currentIdx + 1, stages.length - 1);
          const nextStage = stages[nextIdx];

          let newStatus = s.status;
          if (nextStage === 'ACCEPTED') newStatus = 'ACCEPTED';
          else if (nextStage === 'EN_ROUTE_TO_PICKUP' || nextStage === 'ARRIVED_AT_PICKUP' || nextStage === 'LOADED' || nextStage === 'IN_TRANSIT') {
            newStatus = 'IN_TRANSIT';
          } else if (nextStage === 'ARRIVED_AT_DESTINATION') {
            newStatus = 'IN_TRANSIT';
          } else if (nextStage === 'DELIVERED') {
            newStatus = 'DELIVERED';
          }

          // If delivered, update driver availability, vehicle status, and driver completed trip stats
          if (nextStage === 'DELIVERED') {
            if (s.assignedDriverId) {
              setDrivers((dPrev) =>
                dPrev.map((d) =>
                  d.id === s.assignedDriverId
                    ? { ...d, availability: 'AVAILABLE', currentShipmentId: null, currentVehicleId: null, completedTripsCount: d.completedTripsCount + 1 }
                    : d
                )
              );
            }
            if (s.assignedVehicleId) {
              setVehicles((vPrev) =>
                vPrev.map((v) =>
                  v.id === s.assignedVehicleId
                    ? { ...v, status: 'AVAILABLE', currentDriverId: null, currentShipmentId: null }
                    : v
                )
              );
            }
          }

          return {
            ...s,
            tripStage: nextStage,
            status: newStatus,
            timeline: [
              ...s.timeline,
              {
                title: nextStage.replace(/_/g, ' '),
                time: 'Just now',
                completed: true,
                description: `Milestone reached: ${nextStage.replace(/_/g, ' ')}`,
              },
            ],
          };
        }
        return s;
      })
    );
  }, []);

  // Getters
  const getDriverById = useCallback((id: string) => drivers.find((d) => d.id === id), [drivers]);
  const getVehicleById = useCallback((id: string) => vehicles.find((v) => v.id === id), [vehicles]);
  const getShipmentById = useCallback((id: string) => shipments.find((s) => s.id === id), [shipments]);
  const getBreakdownById = useCallback((id: string) => breakdowns.find((b) => b.id === id), [breakdowns]);
  const getMechanicById = useCallback((id: string) => mechanics.find((m) => m.id === id), [mechanics]);
  const getVehicleFastag = useCallback((vehicleId: string) => {
    const v = vehicles.find((veh) => veh.id === vehicleId);
    return v?.fastag;
  }, [vehicles]);

  const value = useMemo(
    () => ({
      office,
      drivers,
      vehicles,
      shipments,
      breakdowns,
      mechanics,
      officeNotifications,
      driverNotifications,
      historyItems,
      financials,
      earningTrips,
      passbook,
      rewards,
      driverFinancials,
      driverTripEarnings,
      mechanicReviews,
      currentDriverUser,
      updateOfficeProfile,
      addDriver,
      inactivateDriver,
      activateDriver,
      rateDriver,
      addVehicle,
      inactivateVehicle,
      activateVehicle,
      markVehicleMaintenance,
      sendShipmentRequest,
      simulateOrgResponse,
      placeBid,
      cancelBid,
      simulateOrgBidResponse,
      getMatchingReturnLoads,
      assignDriverAndVehicle,
      requestMechanic,
      progressMechanicStatus,
      replaceVehicleForBreakdown,
      markOfficeNotificationRead,
      rechargeVehicleFastag,
      deductVehicleToll,
      withdrawOfficeFunds,
      setCurrentDriverUser,
      loginDriverMock,
      updateDriverPassword,
      updateDriverProfile,
      acceptAssignment,
      declineAssignment,
      startTrip,
      advanceTripStage,
      advanceShipmentTrackingStep,
      reportBreakdown,
      resumeTripAfterBreakdown,
      rateMechanicService,
      markDriverNotificationRead,
      getDriverById,
      getVehicleById,
      getShipmentById,
      getBreakdownById,
      getMechanicById,
      getVehicleFastag,
    }),
    [
      office,
      drivers,
      vehicles,
      shipments,
      breakdowns,
      mechanics,
      officeNotifications,
      driverNotifications,
      historyItems,
      financials,
      earningTrips,
      passbook,
      rewards,
      driverFinancials,
      driverTripEarnings,
      mechanicReviews,
      currentDriverUser,
      updateOfficeProfile,
      addDriver,
      inactivateDriver,
      activateDriver,
      rateDriver,
      addVehicle,
      inactivateVehicle,
      activateVehicle,
      markVehicleMaintenance,
      sendShipmentRequest,
      simulateOrgResponse,
      placeBid,
      cancelBid,
      simulateOrgBidResponse,
      getMatchingReturnLoads,
      assignDriverAndVehicle,
      requestMechanic,
      progressMechanicStatus,
      replaceVehicleForBreakdown,
      markOfficeNotificationRead,
      rechargeVehicleFastag,
      deductVehicleToll,
      withdrawOfficeFunds,
      setCurrentDriverUser,
      loginDriverMock,
      updateDriverPassword,
      updateDriverProfile,
      acceptAssignment,
      declineAssignment,
      startTrip,
      advanceTripStage,
      advanceShipmentTrackingStep,
      reportBreakdown,
      resumeTripAfterBreakdown,
      rateMechanicService,
      markDriverNotificationRead,
      getDriverById,
      getVehicleById,
      getShipmentById,
      getBreakdownById,
      getMechanicById,
      getVehicleFastag,
    ]
  );

  return (
    <TransportOfficeContext.Provider value={value}>
      {children}
    </TransportOfficeContext.Provider>
  );
};

export const useTransportOffice = () => {
  const context = useContext(TransportOfficeContext);
  if (!context) {
    throw new Error('useTransportOffice must be used within a TransportOfficeProvider');
  }
  return context;
};
