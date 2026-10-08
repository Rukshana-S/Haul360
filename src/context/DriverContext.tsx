import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  DriverProfile,
  DriverVehicle,
  DriverDocument,
  DriverAvailability,
  ShipmentItem,
  ReturnLoadRecommendation,
  BidItem,
  TripItem,
  TripLifecycleStatus,
  BreakdownRecord,
  BreakdownSeverity,
  MoneyTransaction,
  RewardItem,
  RewardHistory,
  FastagTransaction,
  CallLogItem,
  DriverAlert,
  DriverReview,
  SupportTicket,
  initialDriverProfile,
  initialDriverVehicle,
  initialDriverVehicles,
  initialDriverDocuments,
  initialShipments,
  initialReturnLoads,
  initialBids,
  initialTripsHistory,
  initialBreakdownRecords,
  initialMoneyTransactions,
  initialRewards,
  initialRewardHistory,
  initialFastagTransactions,
  initialCallLogs,
  initialDriverAlerts,
  initialDriverReviews,
} from '@/constants/driverMockData';

export interface ActiveSosRecord {
  id: string;
  reason: string;
  location: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
  vehicleNumber: string;
}

interface DriverContextType {
  profile: DriverProfile;
  vehicle: DriverVehicle;
  vehicles: DriverVehicle[];
  activeVehicleId: string;
  documents: DriverDocument[];
  availability: DriverAvailability;
  shipments: ShipmentItem[];
  returnLoads: ReturnLoadRecommendation[];
  bids: BidItem[];
  trips: TripItem[];
  activeTrip: TripItem | null;
  breakdowns: BreakdownRecord[];
  activeBreakdown: BreakdownRecord | null;
  moneyBalance: number;
  pendingBalance: number;
  withdrawableBalance: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  transactions: MoneyTransaction[];
  rewards: RewardItem[];
  rewardHistory: RewardHistory[];
  rewardPoints: number;
  fastagBalance: number;
  fastagTransactions: FastagTransaction[];
  callLogs: CallLogItem[];
  alerts: DriverAlert[];
  unreadAlertsCount: number;
  reviews: DriverReview[];
  tickets: SupportTicket[];
  activeSos: ActiveSosRecord | null;

  // Methods
  setAvailability: (status: DriverAvailability) => void;
  updateProfile: (data: Partial<DriverProfile>) => void;
  updateVehicle: (data: Partial<DriverVehicle>) => void;
  addVehicle: (data: Partial<DriverVehicle>) => { success: boolean; message: string; vehicleId?: string };
  selectVehicle: (vehicleId: string) => void;
  registerDriver: (data: {
    name: string;
    phone: string;
    email?: string;
    licenseNumber: string;
    experienceYears?: number;
    vehicleType: string;
    vehicleNumber: string;
    capacityKg: number;
    model: string;
    city?: string;
    state?: string;
  }) => { success: boolean; message: string };
  placeBid: (shipmentId: string, amount: number, notes?: string, eta?: string) => { success: boolean; message: string; bidId?: string };
  withdrawBid: (bidId: string) => { success: boolean; message: string };
  acceptAssignment: (tripId: string) => { success: boolean; message: string };
  declineAssignment: (tripId: string) => { success: boolean; message: string };
  advanceTripStep: (tripId: string) => { success: boolean; nextStatus?: TripLifecycleStatus; message: string };
  reportBreakdown: (data: {
    category: string;
    severity: BreakdownSeverity;
    description: string;
    locationAddress: string;
    tripId?: string;
  }) => BreakdownRecord;
  rechargeFastag: (amount: number, vehicleId?: string) => { success: boolean; message: string };
  withdrawMoney: (amount: number, bankDetails?: string) => { success: boolean; message: string };
  claimReward: (rewardId: string) => { success: boolean; message: string };
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  logCall: (
    contactName: string,
    role: CallLogItem['role'],
    phoneNumber: string,
    callType: 'INCOMING' | 'OUTGOING' | 'MISSED',
    duration?: string,
    tripNumber?: string
  ) => void;
  raiseTicket: (category: string, subject: string, message: string) => SupportTicket;
  triggerSos: (reason: string, location: string) => { success: boolean; sosId: string };
  resolveSos: () => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

const TRIP_LIFECYCLE_ORDER: TripLifecycleStatus[] = [
  'ASSIGNED',
  'ACCEPTED',
  'EN_ROUTE_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'LOADED',
  'IN_TRANSIT',
  'ARRIVED_AT_DESTINATION',
  'DELIVERED',
];

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<DriverProfile>(initialDriverProfile);
  const [vehicles, setVehicles] = useState<DriverVehicle[]>(initialDriverVehicles);
  const [activeVehicleId, setActiveVehicleId] = useState<string>('VEH-IND-01');
  const [documents, setDocuments] = useState<DriverDocument[]>(initialDriverDocuments);
  const [availability, setAvailabilityState] = useState<DriverAvailability>('BUSY'); // 'BUSY' because active trip is ongoing
  const [shipments, setShipments] = useState<ShipmentItem[]>(initialShipments);
  const [returnLoads, setReturnLoads] = useState<ReturnLoadRecommendation[]>(initialReturnLoads);
  const [bids, setBids] = useState<BidItem[]>(initialBids);
  const [trips, setTrips] = useState<TripItem[]>(initialTripsHistory);
  const [breakdowns, setBreakdowns] = useState<BreakdownRecord[]>(initialBreakdownRecords);
  const [moneyBalance, setMoneyBalance] = useState<number>(46200);
  const [pendingBalance, setPendingBalance] = useState<number>(38500);
  const [withdrawableBalance, setWithdrawableBalance] = useState<number>(46200);
  const [todayEarnings, setTodayEarnings] = useState<number>(0);
  const [weekEarnings, setWeekEarnings] = useState<number>(69000);
  const [monthEarnings, setMonthEarnings] = useState<number>(142000);
  const [transactions, setTransactions] = useState<MoneyTransaction[]>(initialMoneyTransactions);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>(initialRewardHistory);
  const [rewardPoints, setRewardPoints] = useState<number>(1850);
  const [fastagBalance, setFastagBalance] = useState<number>(2450);
  const [fastagTransactions, setFastagTransactions] = useState<FastagTransaction[]>(initialFastagTransactions);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(initialCallLogs);
  const [alerts, setAlerts] = useState<DriverAlert[]>(initialDriverAlerts);
  const [reviews] = useState<DriverReview[]>(initialDriverReviews);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeSos, setActiveSos] = useState<ActiveSosRecord | null>(null);

  // Active vehicle reference
  const vehicle = useMemo(() => {
    return vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || initialDriverVehicle;
  }, [vehicles, activeVehicleId]);

  // Derived active trip
  const activeTrip = useMemo(() => {
    return (
      trips.find(
        (t) =>
          t.status !== 'DELIVERED' &&
          t.status !== 'CANCELLED'
      ) || null
    );
  }, [trips]);

  // Derived active breakdown
  const activeBreakdown = useMemo(() => {
    return (
      breakdowns.find(
        (b) => b.status !== 'COMPLETED'
      ) || null
    );
  }, [breakdowns]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter((a) => !a.isRead).length;
  }, [alerts]);

  const setAvailability = useCallback((status: DriverAvailability) => {
    setAvailabilityState(status);
  }, []);

  const updateProfile = useCallback((data: Partial<DriverProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  const updateVehicle = useCallback((data: Partial<DriverVehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === activeVehicleId ? { ...v, ...data } : v))
    );
  }, [activeVehicleId]);

  const selectVehicle = useCallback((vehicleId: string) => {
    setActiveVehicleId(vehicleId);
    const target = vehicles.find((v) => v.id === vehicleId);
    if (target?.fastagBalance !== undefined) {
      setFastagBalance(target.fastagBalance);
    }
  }, [vehicles]);

  const addVehicle = useCallback((data: Partial<DriverVehicle>) => {
    if (!data.vehicleNumber) {
      return { success: false, message: 'Vehicle number is required.' };
    }
    const cleanNumber = data.vehicleNumber.trim().toUpperCase();
    const exists = vehicles.some(
      (v) => v.vehicleNumber.replace(/\s+/g, '').toUpperCase() === cleanNumber.replace(/\s+/g, '')
    );
    if (exists) {
      return { success: false, message: `Truck with number ${cleanNumber} is already registered.` };
    }

    const newId = `VEH-IND-${Date.now().toString().slice(-4)}`;
    const capKg = data.capacityKg || 10000;
    const newVehicle: DriverVehicle = {
      id: newId,
      vehicleNumber: cleanNumber,
      model: data.model || 'Commercial Freight Carrier',
      vehicleType: data.vehicleType || '10-Wheeler Multi-Axle Truck',
      capacityKg: capKg,
      capacityTons: Math.round(capKg / 1000),
      bodyType: data.bodyType || 'Closed Container',
      fuelType: data.fuelType || 'Diesel',
      year: data.year || new Date().getFullYear(),
      rcNumber: data.rcNumber || `RC-${cleanNumber.replace(/\s+/g, '')}`,
      rcExpiry: data.rcExpiry || '15 Aug 2032',
      rcStatus: data.rcStatus || 'VERIFIED',
      insuranceNumber: data.insuranceNumber || `POL-COMM-${Math.floor(10000 + Math.random() * 90000)}`,
      insuranceExpiry: data.insuranceExpiry || '24 Nov 2026',
      insuranceStatus: data.insuranceStatus || 'VERIFIED',
      permitNumber: data.permitNumber || `NP-IND-${cleanNumber.slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      permitExpiry: data.permitExpiry || '10 May 2028',
      permitStatus: data.permitStatus || 'VERIFIED',
      fitnessNumber: data.fitnessNumber || `FIT-${cleanNumber.slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      fitnessExpiry: data.fitnessExpiry || '14 Oct 2027',
      fitnessStatus: data.fitnessStatus || 'VERIFIED',
      fastagTagId: data.fastagTagId || `NETC-AUTO-${Math.floor(10000000 + Math.random() * 90000000)}`,
      fastagStatus: data.fastagStatus || 'ACTIVE',
      fastagBalance: data.fastagBalance || 1500,
      isPrimary: false,
    };

    setVehicles((prev) => [...prev, newVehicle]);

    // Alert for added truck
    const alert: DriverAlert = {
      id: `ALT-${Date.now()}`,
      category: 'DOCUMENTS',
      title: `Truck Added: ${cleanNumber}`,
      message: `Commercial vehicle ${cleanNumber} (${newVehicle.vehicleType}) has been registered to your fleet profile.`,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: '/driver/vehicle',
      priority: 'MEDIUM',
    };
    setAlerts((prev) => [alert, ...prev]);

    return { success: true, message: `Truck ${cleanNumber} added successfully!`, vehicleId: newId };
  }, [vehicles]);

  const registerDriver = useCallback((data: {
    name: string;
    phone: string;
    email?: string;
    licenseNumber: string;
    experienceYears?: number;
    vehicleType: string;
    vehicleNumber: string;
    capacityKg: number;
    model: string;
    city?: string;
    state?: string;
  }) => {
    const cleanNumber = data.vehicleNumber.trim().toUpperCase();
    const capKg = Number(data.capacityKg) || 10000;

    // Update Profile
    setProfile((prev) => ({
      ...prev,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || prev.email,
      licenseNumber: data.licenseNumber.trim().toUpperCase(),
      experienceYears: data.experienceYears || 5,
      city: data.city || 'Chennai',
      state: data.state || 'Tamil Nadu',
      verificationStatus: 'VERIFIED',
    }));

    // Update / Set Primary Vehicle
    const newVehicle: DriverVehicle = {
      id: 'VEH-IND-01',
      vehicleNumber: cleanNumber,
      model: data.model || 'Tata Prima 2830.K Heavy Truck',
      vehicleType: data.vehicleType || '10-Wheeler Multi-Axle Truck',
      capacityKg: capKg,
      capacityTons: Math.round(capKg / 1000),
      bodyType: 'Closed Container / Dry Van',
      fuelType: 'Diesel',
      year: new Date().getFullYear(),
      rcNumber: `RC-${cleanNumber.replace(/\s+/g, '')}`,
      rcExpiry: '15 Aug 2031',
      rcStatus: 'VERIFIED',
      insuranceNumber: `POL-ICICI-${Math.floor(10000 + Math.random() * 90000)}`,
      insuranceExpiry: '24 Nov 2026',
      insuranceStatus: 'VERIFIED',
      permitNumber: `NP-IND-${cleanNumber.slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      permitExpiry: '10 May 2027',
      permitStatus: 'VERIFIED',
      fitnessNumber: `FIT-${cleanNumber.slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      fitnessExpiry: '14 Oct 2027',
      fitnessStatus: 'VERIFIED',
      fastagTagId: `NETC-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      fastagStatus: 'ACTIVE',
      fastagBalance: 2450,
      isPrimary: true,
    };

    setVehicles([newVehicle]);
    setActiveVehicleId('VEH-IND-01');

    // Update documents
    setDocuments((prev) => [
      {
        id: 'DOC-01',
        name: 'Commercial Driving License',
        type: 'DRIVING_LICENSE',
        documentNumber: data.licenseNumber.trim().toUpperCase(),
        status: 'VERIFIED',
        issueDate: '14 Feb 2018',
        expiryDate: '13 Feb 2038',
        verifiedAt: 'Just now',
        verificationMessage: 'Verified and active for Heavy Commercial Transport.',
      },
      {
        id: 'DOC-02',
        name: 'Vehicle Registration Certificate (RC)',
        type: 'RC',
        documentNumber: `${cleanNumber}-RC`,
        status: 'VERIFIED',
        issueDate: '15 Aug 2021',
        expiryDate: '15 Aug 2031',
        verifiedAt: 'Just now',
        verificationMessage: 'Transport Department verified. Clean title.',
      },
      ...prev.slice(2),
    ]);

    // Add Registration Alert
    const alert: DriverAlert = {
      id: `ALT-${Date.now()}`,
      category: 'ACCOUNT',
      title: 'Welcome to Haul360!',
      message: `Account activated for ${data.name.trim()} with vehicle ${cleanNumber}. You can now bid on freight loads and manage trips.`,
      timestamp: 'Just now',
      isRead: false,
      priority: 'HIGH',
    };
    setAlerts((prev) => [alert, ...prev]);

    return { success: true, message: 'Driver registration completed successfully!' };
  }, []);

  const placeBid = useCallback(
    (shipmentId: string, amount: number, notes?: string, eta?: string) => {
      // Find shipment from regular or return loads
      const shipment =
        shipments.find((s) => s.id === shipmentId) ||
        returnLoads.find((r) => r.id === shipmentId);

      if (!shipment) {
        return { success: false, message: 'Shipment not found' };
      }

      // Check if already active bid
      const existingBid = bids.find(
        (b) => b.shipmentId === shipmentId && b.status === 'PENDING'
      );
      if (existingBid) {
        return { success: false, message: 'You already have an active pending bid on this shipment.' };
      }

      const isReturn = !!shipment.isReturnLoadOpportunity;
      const newBidId = `BID-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBid: BidItem = {
        id: newBidId,
        shipmentId: shipment.id,
        shipmentNumber: shipment.shipmentNumber,
        route: `${shipment.pickupLocation.city} → ${shipment.destinationLocation.city}`,
        originCity: shipment.pickupLocation.city,
        destinationCity: shipment.destinationLocation.city,
        cargoType: shipment.cargoType,
        weightKg: shipment.weightKg,
        bidAmount: amount,
        targetPayment: shipment.expectedPayment,
        submittedAt: 'Just now',
        status: 'PENDING',
        shipperName: shipment.shipperName,
        shipperCompany: shipment.shipperCompany,
        isReturnLoad: isReturn,
        notes: notes || 'Available with verified 10T Tata Prima heavy truck.',
        estimatedPickupDate: eta || shipment.pickupDate,
      };

      setBids((prev) => [newBid, ...prev]);

      // Update shipment bid count and status
      setShipments((prev) =>
        prev.map((s) =>
          s.id === shipmentId
            ? { ...s, currentBidCount: s.currentBidCount + 1, status: 'BID_PLACED' }
            : s
        )
      );

      // Add alert
      const newAlert: DriverAlert = {
        id: `ALT-${Date.now()}`,
        category: 'BID',
        title: `Bid Submitted: ₹${amount.toLocaleString('en-IN')}`,
        message: `Your bid on ${shipment.shipmentNumber} (${shipment.pickupLocation.city} → ${shipment.destinationLocation.city}) has been sent to ${shipment.shipperCompany}.`,
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/driver/bid/${newBidId}`,
        priority: 'MEDIUM',
      };
      setAlerts((prev) => [newAlert, ...prev]);

      return { success: true, message: 'Bid submitted successfully!', bidId: newBidId };
    },
    [shipments, returnLoads, bids]
  );

  const withdrawBid = useCallback((bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'WITHDRAWN' } : b))
    );
    return { success: true, message: 'Bid has been withdrawn.' };
  }, []);

  const acceptAssignment = useCallback(
    (tripId: string) => {
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            const updatedSteps = t.steps.map((step, idx) => {
              if (step.status === 'ACCEPTED') {
                return { ...step, completed: true, current: true, timestamp: 'Just now' };
              }
              return step;
            });
            return {
              ...t,
              status: 'ACCEPTED',
              currentStepIndex: 1,
              steps: updatedSteps,
            };
          }
          return t;
        })
      );

      setAvailabilityState('BUSY');

      return { success: true, message: 'Assignment accepted! Trip is now ready for departure.' };
    },
    []
  );

  const declineAssignment = useCallback((tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'CANCELLED' } : t))
    );
    return { success: true, message: 'Assignment declined.' };
  }, []);

  const advanceTripStep = useCallback(
    (tripId: string) => {
      let nextStatusToReturn: TripLifecycleStatus | undefined;

      setTrips((prev) =>
        prev.map((t) => {
          if (t.id !== tripId) return t;

          const currentIndex = TRIP_LIFECYCLE_ORDER.indexOf(t.status);
          if (currentIndex === -1 || currentIndex >= TRIP_LIFECYCLE_ORDER.length - 1) {
            return t;
          }

          const nextIndex = currentIndex + 1;
          const nextStatus = TRIP_LIFECYCLE_ORDER[nextIndex];
          nextStatusToReturn = nextStatus;

          const updatedSteps = t.steps.map((step, idx) => {
            if (idx < nextIndex) {
              return { ...step, completed: true, current: false };
            }
            if (idx === nextIndex) {
              return { ...step, completed: nextStatus === 'DELIVERED', current: nextStatus !== 'DELIVERED', timestamp: 'Just now' };
            }
            return { ...step, completed: false, current: false };
          });

          const isDelivered = nextStatus === 'DELIVERED';

          if (isDelivered) {
            // Trigger payment release into Money balance & Passbook
            const payout = t.paymentAmount;
            setMoneyBalance((b) => b + payout);
            setWithdrawableBalance((b) => b + payout);
            setPendingBalance((p) => Math.max(0, p - payout));
            setTodayEarnings((e) => e + payout);
            setWeekEarnings((e) => e + payout);
            setMonthEarnings((e) => e + payout);
            setRewardPoints((pts) => pts + 200);

            // Add transaction
            const newTxn: MoneyTransaction = {
              id: `TXN-${Date.now()}`,
              transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              date: 'Today',
              time: 'Just now',
              amount: payout,
              type: 'CREDIT',
              category: 'SHIPMENT_PAYMENT',
              title: `Delivery Completed: ${t.pickupLocation.city} → ${t.destinationLocation.city}`,
              description: `Full payment released from escrow for shipment ${t.shipmentNumber}.`,
              status: 'COMPLETED',
              relatedShipmentNumber: t.shipmentNumber,
            };
            setTransactions((txns) => [newTxn, ...txns]);

            // Add Delivery Alert
            const alert: DriverAlert = {
              id: `ALT-${Date.now()}`,
              category: 'PAYMENT',
              title: `Payment Credited ₹${payout.toLocaleString('en-IN')}`,
              message: `Delivery confirmed for ${t.shipmentNumber}. Funds are available in your Passbook. Search return loads to avoid empty run!`,
              timestamp: 'Just now',
              isRead: false,
              actionRoute: '/driver/return-load',
              priority: 'HIGH',
            };
            setAlerts((a) => [alert, ...a]);

            // Set availability to AVAILABLE
            setAvailabilityState('AVAILABLE');
          }

          return {
            ...t,
            status: nextStatus,
            currentStepIndex: nextIndex,
            steps: updatedSteps,
            deliveryDate: isDelivered ? 'Today' : t.deliveryDate,
            paymentStatus: isDelivered ? 'PAID' : t.paymentStatus,
          };
        })
      );

      return {
        success: true,
        nextStatus: nextStatusToReturn,
        message: `Trip status advanced to ${nextStatusToReturn?.replace(/_/g, ' ')}`,
      };
    },
    []
  );

  const reportBreakdown = useCallback(
    (data: {
      category: string;
      severity: BreakdownSeverity;
      description: string;
      locationAddress: string;
      tripId?: string;
    }) => {
      const breakdownId = `BRK-${Math.floor(100 + Math.random() * 900)}`;

      const newRecord: BreakdownRecord = {
        id: breakdownId,
        tripId: data.tripId || activeTrip?.id,
        tripNumber: data.tripId ? trips.find((t) => t.id === data.tripId)?.tripNumber : activeTrip?.tripNumber,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        category: data.category,
        severity: data.severity,
        description: data.description,
        locationAddress: data.locationAddress,
        reportedAt: 'Just now',
        status: 'MECHANIC_ASSIGNED',
        mechanic: {
          id: 'MEC-AUTO-01',
          name: 'Sundaram Express Rescue Service',
          workshopName: 'Highway Commercial Mechanics Network',
          phone: '+91 98422 66778',
          rating: 4.8,
          distanceKm: 5.2,
          estimatedArrivalMinutes: 15,
          assignedAt: 'Just now',
          repairNotes: 'Mechanic dispatched with emergency repair kit.',
          estimatedCost: 1800,
        },
      };

      setBreakdowns((prev) => [newRecord, ...prev]);

      // Add alert
      const alert: DriverAlert = {
        id: `ALT-${Date.now()}`,
        category: 'MECHANIC',
        title: 'Breakdown Reported & Mechanic Dispatched',
        message: `Mechanic assigned for ${data.category}. ETA: 15 mins.`,
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/driver/breakdown/${breakdownId}`,
        priority: 'URGENT',
      };
      setAlerts((a) => [alert, ...a]);

      return newRecord;
    },
    [activeTrip, trips, vehicle]
  );

  const rechargeFastag = useCallback((amount: number, targetVehicleId?: string) => {
    const vId = targetVehicleId || activeVehicleId;
    const targetVeh = vehicles.find((v) => v.id === vId) || vehicle;

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vId
          ? { ...v, fastagBalance: (v.fastagBalance || 0) + amount, fastagStatus: 'ACTIVE' }
          : v
      )
    );

    if (vId === activeVehicleId) {
      setFastagBalance((prev) => prev + amount);
    }

    const newTxn: FastagTransaction = {
      id: `FTG-${Date.now()}`,
      plazaName: `FASTag Top-up (${targetVeh.vehicleNumber})`,
      lane: 'Online Payment',
      date: 'Today',
      time: 'Just now',
      amount,
      type: 'CREDIT',
      vehicleNumber: targetVeh.vehicleNumber,
      status: 'SUCCESS',
    };

    setFastagTransactions((prev) => [newTxn, ...prev]);

    // Debit from money balance if available
    setMoneyBalance((prev) => Math.max(0, prev - amount));
    setWithdrawableBalance((prev) => Math.max(0, prev - amount));

    const moneyTxn: MoneyTransaction = {
      id: `TXN-${Date.now()}`,
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Today',
      time: 'Just now',
      amount,
      type: 'DEBIT',
      category: 'FASTAG_RECHARGE',
      title: 'FASTag Wallet Recharge',
      description: `Recharge of ₹${amount} for vehicle ${targetVeh.vehicleNumber}.`,
      status: 'COMPLETED',
    };
    setTransactions((prev) => [moneyTxn, ...prev]);

    return { success: true, message: `FASTag recharged with ₹${amount.toLocaleString('en-IN')} for ${targetVeh.vehicleNumber} successfully!` };
  }, [activeVehicleId, vehicle, vehicles]);

  const withdrawMoney = useCallback((amount: number, bankDetails?: string) => {
    if (amount > withdrawableBalance) {
      return { success: false, message: 'Insufficient withdrawable balance.' };
    }

    setMoneyBalance((prev) => prev - amount);
    setWithdrawableBalance((prev) => prev - amount);

    const newTxn: MoneyTransaction = {
      id: `TXN-${Date.now()}`,
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Today',
      time: 'Just now',
      amount,
      type: 'DEBIT',
      category: 'WITHDRAWAL',
      title: 'Bank Withdrawal (IMPS Instant)',
      description: `Transferred to ${bankDetails || 'Primary Bank Account ****4821'}. IMPS Ref: ${Math.floor(10000000 + Math.random() * 90000000)}.`,
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTxn, ...prev]);

    return { success: true, message: `₹${amount.toLocaleString('en-IN')} withdrawal initiated successfully.` };
  }, [withdrawableBalance]);

  const claimReward = useCallback((rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found.' };

    if (rewardPoints < reward.pointsRequired) {
      return { success: false, message: `Requires ${reward.pointsRequired} points (You have ${rewardPoints}).` };
    }

    setRewardPoints((prev) => prev - reward.pointsRequired);
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId ? { ...r, isClaimed: true, claimedAt: 'Today' } : r
      )
    );

    const rh: RewardHistory = {
      id: `RH-${Date.now()}`,
      source: `Redeemed ${reward.title}`,
      points: reward.pointsRequired,
      date: 'Today',
      type: 'REDEEMED',
    };
    setRewardHistory((prev) => [rh, ...prev]);

    return { success: true, message: `Claimed "${reward.title}" coupon successfully!` };
  }, [rewards, rewardPoints]);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
    );
  }, []);

  const markAllAlertsAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }, []);

  const logCall = useCallback(
    (
      contactName: string,
      role: CallLogItem['role'],
      phoneNumber: string,
      callType: 'INCOMING' | 'OUTGOING' | 'MISSED',
      duration?: string,
      tripNumber?: string
    ) => {
      const newLog: CallLogItem = {
        id: `CALL-${Date.now()}`,
        contactName,
        role,
        phoneNumber,
        callType,
        date: 'Today',
        time: 'Just now',
        duration: duration || '1m 12s',
        relatedTripNumber: tripNumber || activeTrip?.tripNumber,
      };
      setCallLogs((prev) => [newLog, ...prev]);
    },
    [activeTrip]
  );

  const raiseTicket = useCallback((category: string, subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `TCK-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subject,
      message,
      status: 'OPEN',
      createdAt: 'Just now',
      responseMessage: 'Ticket received by Haul360 Priority Desk. An agent will follow up within 30 minutes.',
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  }, []);

  const triggerSos = useCallback((reason: string, location: string) => {
    const sosId = `SOS-${Date.now().toString().slice(-4)}`;
    const record: ActiveSosRecord = {
      id: sosId,
      reason,
      location,
      timestamp: 'Just now',
      status: 'ACTIVE',
      vehicleNumber: vehicle.vehicleNumber,
    };
    setActiveSos(record);

    const alert: DriverAlert = {
      id: `ALT-${Date.now()}`,
      category: 'ACCOUNT',
      title: '🚨 EMERGENCY SOS ACTIVE',
      message: `Emergency broadcast initiated for ${reason} at ${location}. Haul360 Dispatch & Emergency Services notified.`,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: '/driver/sos',
      priority: 'URGENT',
    };
    setAlerts((prev) => [alert, ...prev]);
    return { success: true, sosId };
  }, [vehicle]);

  const resolveSos = useCallback(() => {
    setActiveSos((prev) => (prev ? { ...prev, status: 'RESOLVED' } : null));
    const alert: DriverAlert = {
      id: `ALT-${Date.now()}`,
      category: 'ACCOUNT',
      title: '✅ SOS Emergency Resolved',
      message: 'The SOS emergency broadcast has been marked resolved.',
      timestamp: 'Just now',
      isRead: false,
      priority: 'MEDIUM',
    };
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  return (
    <DriverContext.Provider
      value={{
        profile,
        vehicle,
        vehicles,
        activeVehicleId,
        documents,
        availability,
        shipments,
        returnLoads,
        bids,
        trips,
        activeTrip,
        breakdowns,
        activeBreakdown,
        moneyBalance,
        pendingBalance,
        withdrawableBalance,
        todayEarnings,
        weekEarnings,
        monthEarnings,
        transactions,
        rewards,
        rewardHistory,
        rewardPoints,
        fastagBalance,
        fastagTransactions,
        callLogs,
        alerts,
        unreadAlertsCount,
        reviews,
        tickets,
        activeSos,

        setAvailability,
        updateProfile,
        updateVehicle,
        addVehicle,
        selectVehicle,
        registerDriver,
        placeBid,
        withdrawBid,
        acceptAssignment,
        declineAssignment,
        advanceTripStep,
        reportBreakdown,
        rechargeFastag,
        withdrawMoney,
        claimReward,
        markAlertAsRead,
        markAllAlertsAsRead,
        logCall,
        raiseTicket,
        triggerSos,
        resolveSos,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = (): DriverContextType => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
};
