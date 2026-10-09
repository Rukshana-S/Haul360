export interface TransportOffice {
  id: string;
  name: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isVerified: boolean;
  registrationNumber: string;
  managerAadhaar?: string;
  managerAadhaarStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  gstNumber?: string;
  gstStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  submittedDate?: string;
}

export interface OfficeDriver {
  id: string; // e.g. H360-D-1042
  officeId: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  dateOfBirth?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  aadhaarNumber?: string;
  aadhaarStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  panNumber?: string;
  panStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  documentStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED';
  isFirstLogin: boolean;
  tempPassword?: string;
  isActive?: boolean;
  availability: 'AVAILABLE' | 'ASSIGNMENT_PENDING' | 'BUSY' | 'OFFLINE';
  currentShipmentId?: string | null;
  currentVehicleId?: string | null;
  completedTripsCount: number;
  rating: number;
  ratingCount?: number;
  lastRatedDate?: string;
  experienceYears: number;
  avatarUrl?: string;
  joinedDate: string;
}

export interface DriverFinancials {
  totalEarnings: number;
  thisMonth: number;
  thisMonthEarnings?: number;
  thisWeek: number;
  thisWeekEarnings?: number;
  today: number;
  todayEarnings?: number;
  completedTripsCount: number;
  pendingEarnings: number;
  paidEarnings: number;
}

export interface DriverTripEarning {
  id: string;
  tripId: string;
  shipmentId: string;
  route: string;
  vehicleNumber: string;
  completedDate: string;
  tripAmount: number;
  driverEarning: number;
  status: 'PAID' | 'PENDING';
}

export interface MechanicReview {
  id: string;
  mechanicId: string;
  driverId: string;
  driverName?: string;
  shipmentId: string;
  serviceRequestId?: string;
  breakdownId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface FastagTransaction {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  type: 'RECHARGE' | 'TOLL_DEDUCTION';
  amount: number;
  locationOrMethod: string;
  date: string;
  status: 'SUCCESS' | 'PENDING';
  balanceAfter: number;
}

export interface VehicleFastag {
  id: string; // e.g. FT-1001
  vehicleId: string;
  tagNumber: string;
  status: 'ACTIVE' | 'LOW_BALANCE' | 'INACTIVE';
  balance: number;
  lowBalanceThreshold: number; // default 1000
  lastRechargeAmount?: number;
  lastRechargeDate?: string;
  lastTollAmount?: number;
  lastTollDate?: string;
  transactions: FastagTransaction[];
}

export interface OfficeVehicle {
  id: string; // e.g. VEH-001
  officeId: string;
  vehicleNumber: string; // e.g. TN38AB1234
  vehicleType: string; // e.g. 10-Wheeler Heavy
  model: string;
  capacityKg: number;
  fuelType: 'Diesel' | 'CNG' | 'Electric';
  rcNumber: string;
  rcStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRING';
  insuranceNumber?: string;
  insuranceExpiry?: string;
  insuranceStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  permitStatus: 'NATIONAL_PERMIT' | 'STATE_PERMIT';
  isActive?: boolean;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRIP' | 'MAINTENANCE' | 'OFFLINE';
  currentDriverId?: string | null;
  currentShipmentId?: string | null;
  lastMaintenanceDate?: string;
  fastag?: VehicleFastag;
}

export interface OfficeFinancials {
  totalEarnings: number;
  thisMonthEarnings: number;
  thisWeekEarnings: number;
  todayEarnings: number;
  completedTripsCount: number;
  grossEarnings: number;
  expenses: number;
  netEarnings: number;
  availableBalance: number;
  withdrawnAmount: number;
  pendingEarnings: number;
}

export interface EarningTripItem {
  id: string;
  shipmentId: string;
  route: string;
  driverName: string;
  vehicleNumber: string;
  completedDate: string;
  shipmentAmount: number;
  officeEarnings: number;
  expenses: number;
  netEarnings: number;
  status: 'COMPLETED' | 'SETTLED' | 'PENDING';
}

export interface PassbookTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  category: 'SHIPMENT_EARNING' | 'FASTAG_RECHARGE' | 'WITHDRAWAL' | 'TRIP_EXPENSE';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  refId?: string;
  balanceAfter: number;
}

export interface RewardHistoryItem {
  id: string;
  title: string;
  points: number;
  date: string;
  type: 'SHIPMENT' | 'ON_TIME' | 'MILESTONE' | 'RETURN_LOAD' | 'PERFORMANCE';
}

export interface RewardAccount {
  points: number;
  currentLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextLevel: 'Silver' | 'Gold' | 'Platinum' | 'Max';
  currentTierPoints: number;
  nextTierPoints: number;
  pointsToNextTier: number;
  history: RewardHistoryItem[];
}

export type ShipmentStatus =
  | 'PENDING_ASSIGNMENT'
  | 'ASSIGNMENT_PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type ShipmentRequestStatus =
  | 'NOT_REQUESTED'
  | 'REQUEST_SENT'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export type TripStage =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'READY_FOR_PICKUP'
  | 'EN_ROUTE_TO_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'LOADED'
  | 'TRIP_STARTED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'ARRIVED_AT_DESTINATION'
  | 'DELIVERED';

export interface ShipmentTimelineEvent {
  title: string;
  time: string;
  completed: boolean;
  description?: string;
}

export interface OfficeShipment {
  id: string; // e.g. SH-1001 / HS1024
  officeId: string;
  organizationId: string;
  organizationName: string;
  amount: number; // Immutable amount provided by organization (in INR)
  origin: string;
  destination: string;
  originAddress: string;
  destinationAddress: string;
  distanceKm: number;
  cargoType: string;
  cargoWeightKg: number;
  requiredCapacityKg: number;
  pickupTime: string;
  expectedDelivery: string;
  pickupDate?: string;
  deliveryDate?: string;
  status: ShipmentStatus;
  requestStatus: ShipmentRequestStatus;
  requestSentAt?: string;
  responseReceivedAt?: string;
  rejectionReason?: string;
  tripStage?: TripStage;
  assignedDriverId?: string | null;
  assignedVehicleId?: string | null;
  declinedDriverId?: string | null;
  declineReason?: string | null;
  // Return Load & Bidding System
  returnLoadForShipmentId?: string | null; // ID of original shipment this serves as return load for
  activeReturnLoadShipmentId?: string | null; // ID of matched return shipment for this original trip
  returnLoadStatus?:
    | 'AVAILABLE'
    | 'BID_PLACED'
    | 'WAITING_ORGANIZATION_APPROVAL'
    | 'ACCEPTED_BY_ORGANIZATION'
    | 'REJECTED_BY_ORGANIZATION'
    | 'DRIVER_NOTIFIED'
    | 'DRIVER_ACCEPTED'
    | 'RETURN_LOAD_ASSIGNED';
  currentBidAmount?: number | null; // Transport Office's proposed bid amount (in INR)
  bidStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  bidPlacedAt?: string | null;
  bids?: Array<{
    id: string;
    transportOfficeId: string;
    transportOfficeName: string;
    amount: number;
    driverName?: string;
    vehicleNumber?: string;
    placedAt: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    isOurBid?: boolean;
  }>;
  createdAt: string;
  timeline: ShipmentTimelineEvent[];
}

export type BreakdownStatus =
  | 'REPORTED'
  | 'MECHANIC_REQUIRED'
  | 'MECHANIC_REQUESTED'
  | 'MECHANIC_ACCEPTED'
  | 'MECHANIC_ON_WAY'
  | 'MECHANIC_ARRIVED'
  | 'DIAGNOSING'
  | 'REPAIRING'
  | 'REPAIRED'
  | 'RESOLVED';

export type BreakdownIssueType =
  | 'Engine Problem'
  | 'Tyre Problem'
  | 'Battery Problem'
  | 'Electrical Problem'
  | 'Accident'
  | 'Fuel Problem'
  | 'Other';

export interface BreakdownIncident {
  id: string; // e.g. BD-001
  officeId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  shipmentId: string;
  route: string;
  issueType: BreakdownIssueType;
  description: string;
  location: string;
  status: BreakdownStatus;
  mechanicRequestId?: string;
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  mechanicEtaMinutes?: number;
  reportedAt: string;
  resolvedAt?: string;
  needsReplacementVehicle?: boolean;
  driverRated?: boolean;
  driverRating?: number;
  driverComment?: string;
}

export interface MockNearbyMechanic {
  id: string;
  name: string;
  workshopName: string;
  distanceKm: number;
  specialty: string;
  rating: number;
  isAvailable: boolean;
  phone: string;
  etaMinutes: number;
  jobsCompleted: number;
}

export interface OfficeNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ASSIGNMENT' | 'BREAKDOWN' | 'MECHANIC' | 'TRIP' | 'SYSTEM' | 'REQUEST' | 'FASTAG_LOW_BALANCE' | 'PAYMENT' | 'REWARD';
  read: boolean;
  targetId?: string;
}

export interface DriverNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ASSIGNMENT' | 'TRIP' | 'BREAKDOWN' | 'MECHANIC' | 'SYSTEM' | 'RETURN_LOAD';
  read: boolean;
  targetId?: string;
  shipmentId?: string;
  originalShipmentId?: string;
  organizationName?: string;
  amount?: number;
  route?: string;
}

export interface HistoryItem {
  id: string;
  type: 'SHIPMENT' | 'ASSIGNMENT' | 'BREAKDOWN' | 'MECHANIC';
  title: string;
  subtitle: string;
  date: string;
  status: string;
  route?: string;
  driverName?: string;
  vehicleNumber?: string;
}

// ----------------------------------------------------
// INITIAL MOCK DATA
// ----------------------------------------------------

export const initialTransportOffice: TransportOffice = {
  id: 'OFFICE-001',
  name: 'Haul360 Southern Logistics Hub',
  managerName: 'Ramesh Chandran',
  phone: '9840123456',
  email: 'dispatch@haul360.in',
  address: '124, Ring Road Industrial Corridor, Guindy',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600032',
  isVerified: true,
  registrationNumber: 'TN-CH-TO-2023-8891',
  managerAadhaar: 'XXXX-XXXX-8921',
  managerAadhaarStatus: 'VERIFIED',
  gstNumber: '33AAAAA0000A1Z5',
  gstStatus: 'VERIFIED',
  submittedDate: '15 Jan 2024',
};

export const initialOfficeDrivers: OfficeDriver[] = [
  {
    id: 'H360-D-1042',
    officeId: 'OFFICE-001',
    name: 'Kumar S.',
    phone: '9876543210',
    email: 'kumar.driver@haul360.com',
    age: 34,
    address: '45 Gandhi Nagar, Madurai, Tamil Nadu',
    licenseNumber: 'TN-59-2015-0084321',
    licenseExpiry: '2028-11-20',
    licenseStatus: 'VERIFIED',
    aadhaarNumber: 'XXXX-XXXX-4512',
    aadhaarStatus: 'VERIFIED',
    panNumber: 'ABCDE1234F',
    panStatus: 'VERIFIED',
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'ASSIGNMENT_PENDING',
    currentShipmentId: 'SH-1001',
    currentVehicleId: 'VEH-001',
    completedTripsCount: 142,
    rating: 4.85,
    ratingCount: 28,
    lastRatedDate: 'Yesterday',
    experienceYears: 9,
    joinedDate: '12 Jan 2024',
  },
  {
    id: 'H360-D-1043',
    officeId: 'OFFICE-001',
    name: 'Ravi Verma',
    phone: '9876543211',
    email: 'ravi.v@haul360.com',
    age: 29,
    address: '12 Cross Street, Salem, Tamil Nadu',
    licenseNumber: 'TN-30-2018-0019283',
    licenseExpiry: '2030-05-15',
    licenseStatus: 'VERIFIED',
    aadhaarNumber: 'XXXX-XXXX-7834',
    aadhaarStatus: 'VERIFIED',
    panNumber: 'BVMPR9021K',
    panStatus: 'VERIFIED',
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'AVAILABLE',
    currentShipmentId: null,
    currentVehicleId: null,
    completedTripsCount: 88,
    rating: 4.7,
    ratingCount: 19,
    lastRatedDate: '02 Oct 2026',
    experienceYears: 6,
    joinedDate: '04 Mar 2024',
  },
  {
    id: 'H360-D-1044',
    officeId: 'OFFICE-001',
    name: 'Arun Prakash',
    phone: '9876543212',
    email: 'arun.p@haul360.com',
    age: 38,
    address: '88 Trunk Road, Vellore, Tamil Nadu',
    licenseNumber: 'TN-23-2012-0044556',
    licenseExpiry: '2027-08-10',
    licenseStatus: 'VERIFIED',
    aadhaarNumber: 'XXXX-XXXX-1190',
    aadhaarStatus: 'VERIFIED',
    panNumber: 'APZPK4431L',
    panStatus: 'VERIFIED',
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'BUSY',
    currentShipmentId: 'SH-1003',
    currentVehicleId: 'VEH-002',
    completedTripsCount: 210,
    rating: 4.9,
    ratingCount: 42,
    lastRatedDate: '28 Sep 2026',
    experienceYears: 14,
    joinedDate: '18 Nov 2023',
  },
  {
    id: 'H360-D-1045',
    officeId: 'OFFICE-001',
    name: 'Suresh Mani',
    phone: '9876543213',
    email: 'suresh.m@haul360.com',
    age: 31,
    address: '22 Bazaar Street, Coimbatore, Tamil Nadu',
    licenseNumber: 'TN-38-2017-0067890',
    licenseExpiry: '2029-02-28',
    licenseStatus: 'VERIFIED',
    aadhaarNumber: 'XXXX-XXXX-9901',
    aadhaarStatus: 'VERIFIED',
    panNumber: 'SMPMN8872Q',
    panStatus: 'VERIFIED',
    documentStatus: 'VERIFIED',
    isFirstLogin: true,
    tempPassword: 'H360@5821',
    isActive: true,
    availability: 'AVAILABLE',
    currentShipmentId: null,
    currentVehicleId: null,
    completedTripsCount: 35,
    rating: 4.6,
    ratingCount: 8,
    experienceYears: 4,
    joinedDate: '01 Oct 2026',
  },
  {
    id: 'H360-D-1046',
    officeId: 'OFFICE-001',
    name: 'Manoj Kumar',
    phone: '9876543214',
    email: 'manoj.k@haul360.com',
    age: 42,
    address: '7 Anna Salai, Trichy, Tamil Nadu',
    licenseNumber: 'TN-45-2010-0033221',
    licenseExpiry: '2026-12-31',
    licenseStatus: 'EXPIRING',
    aadhaarNumber: 'XXXX-XXXX-6623',
    aadhaarStatus: 'VERIFIED',
    panNumber: 'MKPPR5512R',
    panStatus: 'VERIFIED',
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'AVAILABLE',
    currentShipmentId: null,
    currentVehicleId: null,
    completedTripsCount: 320,
    rating: 4.95,
    ratingCount: 65,
    lastRatedDate: '15 Sep 2026',
    experienceYears: 18,
    joinedDate: '10 Aug 2023',
  },
  {
    id: 'H360-D-1047',
    officeId: 'OFFICE-001',
    name: 'Gopal Krishnan',
    phone: '9876543215',
    email: 'gopal.k@haul360.com',
    age: 45,
    address: '19 North Car Street, Tirunelveli, Tamil Nadu',
    licenseNumber: 'TN-72-2009-0099881',
    licenseExpiry: '2027-04-14',
    licenseStatus: 'VERIFIED',
    aadhaarNumber: 'XXXX-XXXX-3341',
    aadhaarStatus: 'VERIFIED',
    panNumber: 'GKPRN1190T',
    panStatus: 'VERIFIED',
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: false,
    availability: 'OFFLINE',
    currentShipmentId: null,
    currentVehicleId: null,
    completedTripsCount: 180,
    rating: 4.5,
    ratingCount: 30,
    lastRatedDate: '20 Aug 2026',
    experienceYears: 16,
    joinedDate: '05 Jan 2023',
  },
];

export const initialOfficeVehicles: OfficeVehicle[] = [
  {
    id: 'VEH-001',
    officeId: 'OFFICE-001',
    vehicleNumber: 'TN38AB1234',
    vehicleType: '10-Wheeler Heavy',
    model: 'Tata Signa 2823.K',
    capacityKg: 10000,
    fuelType: 'Diesel',
    rcNumber: 'RC-TN38-2021-9988',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-ICICI-88912',
    insuranceExpiry: '2027-09-15',
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'ASSIGNED',
    currentDriverId: 'H360-D-1042',
    currentShipmentId: 'SH-1001',
    lastMaintenanceDate: '15 Sep 2026',
    fastag: {
      id: 'FT-1001',
      vehicleId: 'VEH-001',
      tagNumber: '3416-8921-9901',
      status: 'ACTIVE',
      balance: 2450,
      lowBalanceThreshold: 1000,
      lastRechargeAmount: 2000,
      lastRechargeDate: '08 Oct 2026',
      lastTollAmount: 350,
      lastTollDate: '08 Oct 2026',
      transactions: [
        {
          id: 'FT-TX-101',
          vehicleId: 'VEH-001',
          vehicleNumber: 'TN38AB1234',
          type: 'TOLL_DEDUCTION',
          amount: 350,
          locationOrMethod: 'NH-44 Bangalore Toll Plaza',
          date: '08 Oct 2026, 02:15 PM',
          status: 'SUCCESS',
          balanceAfter: 2450,
        },
        {
          id: 'FT-TX-102',
          vehicleId: 'VEH-001',
          vehicleNumber: 'TN38AB1234',
          type: 'RECHARGE',
          amount: 2000,
          locationOrMethod: 'Transport Office Wallet Recharge',
          date: '07 Oct 2026, 11:30 AM',
          status: 'SUCCESS',
          balanceAfter: 2800,
        },
        {
          id: 'FT-TX-103',
          vehicleId: 'VEH-001',
          vehicleNumber: 'TN38AB1234',
          type: 'TOLL_DEDUCTION',
          amount: 180,
          locationOrMethod: 'Hosur Border Toll Plaza',
          date: '06 Oct 2026, 04:45 PM',
          status: 'SUCCESS',
          balanceAfter: 800,
        },
        {
          id: 'FT-TX-104',
          vehicleId: 'VEH-001',
          vehicleNumber: 'TN38AB1234',
          type: 'TOLL_DEDUCTION',
          amount: 220,
          locationOrMethod: 'Chennai Outer Ring Road Plaza',
          date: '05 Oct 2026, 09:10 AM',
          status: 'SUCCESS',
          balanceAfter: 980,
        },
      ],
    },
  },
  {
    id: 'VEH-002',
    officeId: 'OFFICE-001',
    vehicleNumber: 'TN38CD5678',
    vehicleType: '14-Wheeler Heavy',
    model: 'Ashok Leyland 3520',
    capacityKg: 15000,
    fuelType: 'Diesel',
    rcNumber: 'RC-TN38-2022-4411',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-HDFC-99214',
    insuranceExpiry: '2027-05-10',
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'IN_TRIP',
    currentDriverId: 'H360-D-1044',
    currentShipmentId: 'SH-1003',
    lastMaintenanceDate: '02 Aug 2026',
    fastag: {
      id: 'FT-1002',
      vehicleId: 'VEH-002',
      tagNumber: '3416-8921-9902',
      status: 'LOW_BALANCE',
      balance: 750,
      lowBalanceThreshold: 1000,
      lastRechargeAmount: 1500,
      lastRechargeDate: '01 Oct 2026',
      lastTollAmount: 250,
      lastTollDate: '08 Oct 2026',
      transactions: [
        {
          id: 'FT-TX-201',
          vehicleId: 'VEH-002',
          vehicleNumber: 'TN38CD5678',
          type: 'TOLL_DEDUCTION',
          amount: 250,
          locationOrMethod: 'Dindigul Expressway Plaza',
          date: '08 Oct 2026, 09:40 AM',
          status: 'SUCCESS',
          balanceAfter: 750,
        },
        {
          id: 'FT-TX-202',
          vehicleId: 'VEH-002',
          vehicleNumber: 'TN38CD5678',
          type: 'TOLL_DEDUCTION',
          amount: 300,
          locationOrMethod: 'Salem Bypass Toll Gate',
          date: '07 Oct 2026, 06:20 PM',
          status: 'SUCCESS',
          balanceAfter: 1000,
        },
        {
          id: 'FT-TX-203',
          vehicleId: 'VEH-002',
          vehicleNumber: 'TN38CD5678',
          type: 'RECHARGE',
          amount: 1500,
          locationOrMethod: 'Office Account UPI',
          date: '01 Oct 2026, 10:00 AM',
          status: 'SUCCESS',
          balanceAfter: 1300,
        },
      ],
    },
  },
  {
    id: 'VEH-003',
    officeId: 'OFFICE-001',
    vehicleNumber: 'TN38EF9012',
    vehicleType: '18-Wheeler Multi-Axle',
    model: 'BharatBenz 4028T',
    capacityKg: 20000,
    fuelType: 'Diesel',
    rcNumber: 'RC-TN38-2023-1122',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-BAJAJ-55123',
    insuranceExpiry: '2027-11-25',
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'AVAILABLE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '20 Jul 2026',
    fastag: {
      id: 'FT-1003',
      vehicleId: 'VEH-003',
      tagNumber: '3416-8921-9903',
      status: 'ACTIVE',
      balance: 4820,
      lowBalanceThreshold: 1000,
      lastRechargeAmount: 3000,
      lastRechargeDate: '05 Oct 2026',
      lastTollAmount: 180,
      lastTollDate: '07 Oct 2026',
      transactions: [
        {
          id: 'FT-TX-301',
          vehicleId: 'VEH-003',
          vehicleNumber: 'TN38EF9012',
          type: 'TOLL_DEDUCTION',
          amount: 180,
          locationOrMethod: 'Krishnagiri Plaza (NH-44)',
          date: '07 Oct 2026, 03:30 PM',
          status: 'SUCCESS',
          balanceAfter: 4820,
        },
        {
          id: 'FT-TX-302',
          vehicleId: 'VEH-003',
          vehicleNumber: 'TN38EF9012',
          type: 'RECHARGE',
          amount: 3000,
          locationOrMethod: 'Office Account Auto-Recharge',
          date: '05 Oct 2026, 08:00 AM',
          status: 'SUCCESS',
          balanceAfter: 5000,
        },
      ],
    },
  },
  {
    id: 'VEH-004',
    officeId: 'OFFICE-001',
    vehicleNumber: 'TN38GH3456',
    vehicleType: '6-Wheeler Medium',
    model: 'Eicher Pro 3015',
    capacityKg: 5000,
    fuelType: 'CNG',
    rcNumber: 'RC-TN38-2024-7733',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-NEWINDIA-11890',
    insuranceExpiry: '2026-12-30',
    insuranceStatus: 'VALID',
    permitStatus: 'STATE_PERMIT',
    isActive: true,
    status: 'AVAILABLE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '10 Aug 2026',
    fastag: {
      id: 'FT-1004',
      vehicleId: 'VEH-004',
      tagNumber: '3416-8921-9904',
      status: 'ACTIVE',
      balance: 1850,
      lowBalanceThreshold: 1000,
      lastRechargeAmount: 2000,
      lastRechargeDate: '03 Oct 2026',
      lastTollAmount: 150,
      lastTollDate: '06 Oct 2026',
      transactions: [
        {
          id: 'FT-TX-401',
          vehicleId: 'VEH-004',
          vehicleNumber: 'TN38GH3456',
          type: 'TOLL_DEDUCTION',
          amount: 150,
          locationOrMethod: 'Vellore Bypass Plaza',
          date: '06 Oct 2026, 11:20 AM',
          status: 'SUCCESS',
          balanceAfter: 1850,
        },
        {
          id: 'FT-TX-402',
          vehicleId: 'VEH-004',
          vehicleNumber: 'TN38GH3456',
          type: 'RECHARGE',
          amount: 2000,
          locationOrMethod: 'Office Net Banking',
          date: '03 Oct 2026, 09:00 AM',
          status: 'SUCCESS',
          balanceAfter: 2000,
        },
      ],
    },
  },
  {
    id: 'VEH-005',
    officeId: 'OFFICE-001',
    vehicleNumber: 'TN38JK7890',
    vehicleType: '12-Wheeler Container',
    model: 'Tata Prima 3530.K',
    capacityKg: 14000,
    fuelType: 'Diesel',
    rcNumber: 'RC-TN38-2020-5566',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-CHOLA-77612',
    insuranceExpiry: '2027-01-18',
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'AVAILABLE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '01 Oct 2026',
    fastag: {
      id: 'FT-1005',
      vehicleId: 'VEH-005',
      tagNumber: '3416-8921-9905',
      status: 'ACTIVE',
      balance: 3200,
      lowBalanceThreshold: 1000,
      lastRechargeAmount: 2500,
      lastRechargeDate: '04 Oct 2026',
      lastTollAmount: 240,
      lastTollDate: '06 Oct 2026',
      transactions: [
        {
          id: 'FT-TX-501',
          vehicleId: 'VEH-005',
          vehicleNumber: 'TN38JK7890',
          type: 'TOLL_DEDUCTION',
          amount: 240,
          locationOrMethod: 'Tindivanam Toll Plaza',
          date: '06 Oct 2026, 01:15 PM',
          status: 'SUCCESS',
          balanceAfter: 3200,
        },
      ],
    },
  },
  {
    id: 'VEH-006',
    officeId: 'OFFICE-001',
    vehicleNumber: 'TN38LM2468',
    vehicleType: '10-Wheeler Heavy',
    model: 'Mahindra Blazo X 28',
    capacityKg: 11000,
    fuelType: 'Diesel',
    rcNumber: 'RC-TN38-2019-3311',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-TATA-44190',
    insuranceExpiry: '2026-08-14',
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: false,
    status: 'OFFLINE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '01 May 2026',
    fastag: {
      id: 'FT-1006',
      vehicleId: 'VEH-006',
      tagNumber: '3416-8921-9906',
      status: 'INACTIVE',
      balance: 500,
      lowBalanceThreshold: 1000,
      transactions: [],
    },
  },
];

export const initialOfficeShipments: OfficeShipment[] = [
  {
    id: 'SH-1001',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-001',
    organizationName: 'ABC Exports',
    amount: 18500,
    origin: 'Chennai',
    destination: 'Coimbatore',
    originAddress: 'Guindy Industrial Estate, Sector 2, Chennai, TN',
    destinationAddress: 'Peelamedu Warehousing Hub, Coimbatore, TN',
    distanceKm: 510,
    cargoType: 'Industrial Electronics & Auto Spares',
    cargoWeightKg: 10000,
    requiredCapacityKg: 10000,
    pickupTime: 'Today, 10:00 AM',
    expectedDelivery: 'Today, 06:30 PM',
    status: 'ASSIGNMENT_PENDING',
    requestStatus: 'ACCEPTED',
    requestSentAt: '05 Oct 2026, 08:00 AM',
    responseReceivedAt: '05 Oct 2026, 08:15 AM',
    tripStage: 'ASSIGNED',
    assignedDriverId: 'H360-D-1042',
    assignedVehicleId: 'VEH-001',
    createdAt: '05 Oct 2026, 07:30 AM',
    timeline: [
      { title: 'Shipment Posted', time: '07:30 AM', completed: true, description: 'Posted by ABC Exports' },
      { title: 'Request Accepted', time: '08:15 AM', completed: true, description: 'ABC Exports approved haul assignment' },
      { title: 'Driver Assigned', time: '08:45 AM', completed: true, description: 'Kumar S. • TN38AB1234' },
      { title: 'Driver Acceptance', time: '--', completed: false, description: 'Pending driver confirmation' },
      { title: 'In Transit', time: '--', completed: false },
      { title: 'Delivered', time: '--', completed: false },
    ],
  },
  {
    id: 'SH-1002',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-002',
    organizationName: 'Sri Logistics Pvt Ltd',
    amount: 15000,
    origin: 'Bengaluru',
    destination: 'Chennai',
    originAddress: 'Peenya Industrial Area 3rd Phase, Bengaluru, KA',
    destinationAddress: 'Ambattur Industrial Estate, Chennai, TN',
    distanceKm: 345,
    cargoType: 'Packaged FMCG & Consumer Goods',
    cargoWeightKg: 8000,
    requiredCapacityKg: 10000,
    pickupTime: 'Tomorrow, 08:00 AM',
    expectedDelivery: 'Tomorrow, 04:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'ACCEPTED',
    requestSentAt: '05 Oct 2026, 09:00 AM',
    responseReceivedAt: '05 Oct 2026, 09:20 AM',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 08:45 AM',
    timeline: [
      { title: 'Shipment Posted', time: '08:45 AM', completed: true, description: 'Posted by Sri Logistics Pvt Ltd' },
      { title: 'Request Accepted', time: '09:20 AM', completed: true, description: 'Sri Logistics Pvt Ltd approved haul assignment' },
      { title: 'Driver & Vehicle Assignment', time: '--', completed: false, description: 'Ready for Transport Office assignment' },
    ],
  },
  {
    id: 'SH-1003',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-003',
    organizationName: 'Green Cargo Industries',
    amount: 9500,
    origin: 'Coimbatore',
    destination: 'Madurai',
    originAddress: 'SIDCO Industrial Estate, Kurichi, Coimbatore, TN',
    destinationAddress: 'Kappalur Industrial Hub, Madurai, TN',
    distanceKm: 215,
    cargoType: 'Agricultural Pumps & Castings',
    cargoWeightKg: 5000,
    requiredCapacityKg: 6000,
    pickupTime: '05 Oct, 04:00 AM',
    expectedDelivery: '05 Oct, 11:30 AM',
    status: 'IN_TRANSIT',
    requestStatus: 'ACCEPTED',
    requestSentAt: '04 Oct 2026, 04:00 PM',
    responseReceivedAt: '04 Oct 2026, 04:30 PM',
    tripStage: 'IN_TRANSIT',
    assignedDriverId: 'H360-D-1044',
    assignedVehicleId: 'VEH-002',
    createdAt: '04 Oct 2026, 03:00 PM',
    timeline: [
      { title: 'Shipment Posted', time: '04 Oct, 03:00 PM', completed: true, description: 'Posted by Green Cargo Industries' },
      { title: 'Request Accepted', time: '04 Oct, 04:30 PM', completed: true },
      { title: 'Assigned Driver & Vehicle', time: '04 Oct, 06:30 PM', completed: true, description: 'Arun Prakash / TN38CD5678' },
      { title: 'Driver Accepted', time: '04 Oct, 07:00 PM', completed: true },
      { title: 'In Transit', time: '05 Oct, 05:00 AM', completed: true, description: 'Crossing Dindigul highway' },
      { title: 'Delivered', time: '--', completed: false },
    ],
  },
  {
    id: 'SH-1004',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-004',
    organizationName: 'Southern Freight Solutions',
    amount: 22000,
    origin: 'Chennai Port',
    destination: 'Bengaluru',
    originAddress: 'Harbor Gate 4, Container Freight Station, Chennai, TN',
    destinationAddress: 'Whitefield Inland Container Depot, Bengaluru, KA',
    distanceKm: 360,
    cargoType: 'Heavy Machinery Spares (Import Consignment)',
    cargoWeightKg: 14000,
    requiredCapacityKg: 15000,
    pickupTime: '07 Oct, 09:00 AM',
    expectedDelivery: '07 Oct, 06:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 11:00 AM',
    timeline: [
      { title: 'Shipment Posted', time: '11:00 AM', completed: true, description: 'Posted by Southern Freight Solutions' },
      { title: 'Request to Organization', time: '--', completed: false, description: 'Send request to claim this haul' },
    ],
  },
  {
    id: 'SH-1005',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-005',
    organizationName: 'Tamil Nadu Industrial Cargo',
    amount: 12800,
    origin: 'Salem',
    destination: 'Tiruchirappalli',
    originAddress: 'Steel Plant Road Logistics Park, Salem, TN',
    destinationAddress: 'Thuvakudi Industrial Estate, Trichy, TN',
    distanceKm: 145,
    cargoType: 'Fabricated Steel Plates & Angles',
    cargoWeightKg: 9500,
    requiredCapacityKg: 10000,
    pickupTime: '08 Oct, 07:00 AM',
    expectedDelivery: '08 Oct, 01:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'REQUEST_SENT',
    requestSentAt: '05 Oct 2026, 10:15 AM',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 09:30 AM',
    timeline: [
      { title: 'Shipment Posted', time: '09:30 AM', completed: true, description: 'Posted by Tamil Nadu Industrial Cargo' },
      { title: 'Request Sent', time: '10:15 AM', completed: true, description: 'Waiting for Tamil Nadu Industrial Cargo response' },
    ],
  },
  {
    id: 'SH-1006',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-001',
    organizationName: 'ABC Exports',
    amount: 27500,
    origin: 'Madurai',
    destination: 'Bengaluru',
    originAddress: 'Kappalur Export Terminal, Madurai, TN',
    destinationAddress: 'Peenya Industrial Logistics Hub, Bengaluru, KA',
    distanceKm: 440,
    cargoType: 'Export Textiles & Cotton Bales',
    cargoWeightKg: 11000,
    requiredCapacityKg: 12000,
    pickupTime: '08 Oct, 06:00 AM',
    expectedDelivery: '08 Oct, 05:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 10:45 AM',
    timeline: [
      { title: 'Shipment Posted', time: '10:45 AM', completed: true, description: 'Posted by ABC Exports' },
    ],
  },
  {
    id: 'SH-1007',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-002',
    organizationName: 'Sri Logistics Pvt Ltd',
    amount: 16000,
    origin: 'Coimbatore',
    destination: 'Salem',
    originAddress: 'L&T Bypass Warehousing Park, Coimbatore, TN',
    destinationAddress: 'Salem Central Freight Depot, Salem, TN',
    distanceKm: 165,
    cargoType: 'Electrical Transformers & Switchgear',
    cargoWeightKg: 4800,
    requiredCapacityKg: 5000,
    pickupTime: '09 Oct, 08:30 AM',
    expectedDelivery: '09 Oct, 02:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'REJECTED',
    requestSentAt: '05 Oct 2026, 08:00 AM',
    responseReceivedAt: '05 Oct 2026, 08:45 AM',
    rejectionReason: 'Capacity already allocated to another carrier partner.',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 07:15 AM',
    timeline: [
      { title: 'Shipment Posted', time: '07:15 AM', completed: true, description: 'Posted by Sri Logistics Pvt Ltd' },
      { title: 'Request Sent', time: '08:00 AM', completed: true },
      { title: 'Request Rejected', time: '08:45 AM', completed: true, description: 'Capacity already allocated' },
    ],
  },
  {
    id: 'SH-1008',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-003',
    organizationName: 'Green Cargo Industries',
    amount: 34000,
    origin: 'Chennai',
    destination: 'Madurai',
    originAddress: 'Sriperumbudur Manufacturing Corridor, Chennai, TN',
    destinationAddress: 'Madurai Ring Road Cargo Terminal, Madurai, TN',
    distanceKm: 460,
    cargoType: 'Auto Component Castings & Machinery',
    cargoWeightKg: 13500,
    requiredCapacityKg: 15000,
    pickupTime: '09 Oct, 05:00 AM',
    expectedDelivery: '09 Oct, 04:30 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 11:30 AM',
    timeline: [
      { title: 'Shipment Posted', time: '11:30 AM', completed: true, description: 'Posted by Green Cargo Industries' },
    ],
  },
  {
    id: 'SH-2001',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-001',
    organizationName: 'ABC Exports',
    amount: 18000,
    origin: 'Coimbatore',
    destination: 'Chennai',
    originAddress: 'Peelamedu Warehousing Hub, Coimbatore, TN',
    destinationAddress: 'Guindy Industrial Estate, Sector 2, Chennai, TN',
    distanceKm: 510,
    cargoType: 'Industrial Textile Yarn & Spun Goods',
    cargoWeightKg: 8000,
    requiredCapacityKg: 10000,
    pickupTime: 'Tomorrow, 09:00 AM',
    expectedDelivery: 'Tomorrow, 06:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    returnLoadStatus: 'AVAILABLE',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 01:00 PM',
    timeline: [
      { title: 'Shipment Posted', time: '01:00 PM', completed: true, description: 'Posted by ABC Exports' },
    ],
  },
  {
    id: 'SH-2002',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-002',
    organizationName: 'Sri Logistics Pvt Ltd',
    amount: 16500,
    origin: 'Coimbatore',
    destination: 'Chennai',
    originAddress: 'SIDCO Industrial Hub, Kurichi, Coimbatore, TN',
    destinationAddress: 'Ambattur Industrial Estate, Chennai, TN',
    distanceKm: 515,
    cargoType: 'Packaged Precision Engineering Tools',
    cargoWeightKg: 5500,
    requiredCapacityKg: 6000,
    pickupTime: 'Tomorrow, 11:00 AM',
    expectedDelivery: 'Tomorrow, 08:30 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    returnLoadStatus: 'AVAILABLE',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 01:30 PM',
    timeline: [
      { title: 'Shipment Posted', time: '01:30 PM', completed: true, description: 'Posted by Sri Logistics Pvt Ltd' },
    ],
  },
  {
    id: 'SH-2003',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-004',
    organizationName: 'Southern Freight Solutions',
    amount: 10500,
    origin: 'Madurai',
    destination: 'Coimbatore',
    originAddress: 'Kappalur Industrial Hub, Madurai, TN',
    destinationAddress: 'L&T Bypass Warehousing Park, Coimbatore, TN',
    distanceKm: 215,
    cargoType: 'Automotive Rubber Moldings & Seals',
    cargoWeightKg: 4500,
    requiredCapacityKg: 5000,
    pickupTime: 'Tomorrow, 06:00 AM',
    expectedDelivery: 'Tomorrow, 01:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    returnLoadStatus: 'AVAILABLE',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 02:00 PM',
    timeline: [
      { title: 'Shipment Posted', time: '02:00 PM', completed: true, description: 'Posted by Southern Freight Solutions' },
    ],
  },
  {
    id: 'SH-2004',
    officeId: 'OFFICE-001',
    organizationId: 'ORG-003',
    organizationName: 'Green Cargo Industries',
    amount: 16000,
    origin: 'Chennai',
    destination: 'Bengaluru',
    originAddress: 'Guindy Industrial Estate, Sector 1, Chennai, TN',
    destinationAddress: 'Peenya Industrial Area 3rd Phase, Bengaluru, KA',
    distanceKm: 345,
    cargoType: 'Specialty Auto Chemicals & Oils',
    cargoWeightKg: 7000,
    requiredCapacityKg: 8000,
    pickupTime: 'Tomorrow, 07:30 AM',
    expectedDelivery: 'Tomorrow, 04:00 PM',
    status: 'PENDING_ASSIGNMENT',
    requestStatus: 'NOT_REQUESTED',
    returnLoadStatus: 'AVAILABLE',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 02:30 PM',
    timeline: [
      { title: 'Shipment Posted', time: '02:30 PM', completed: true, description: 'Posted by Green Cargo Industries' },
    ],
  },
];

export const initialBreakdowns: BreakdownIncident[] = [
  {
    id: 'BD-001',
    officeId: 'OFFICE-001',
    driverId: 'H360-D-1044',
    driverName: 'Arun Prakash',
    driverPhone: '9876543212',
    vehicleId: 'VEH-002',
    vehicleNumber: 'TN38CD5678',
    vehicleType: '14-Wheeler Heavy',
    shipmentId: 'SH-1003',
    route: 'Coimbatore → Madurai',
    issueType: 'Tyre Problem',
    description: 'Rear dual tyre burst on highway. Need mobile tyre service with jack.',
    location: 'NH-44 near Dindigul Toll Plaza (KM 382)',
    status: 'REPORTED',
    reportedAt: '10 minutes ago',
  },
];

export const mockNearbyMechanics: MockNearbyMechanic[] = [
  {
    id: 'MECH-01',
    name: 'Selvam Auto Works',
    workshopName: 'Selvam Heavy Vehicle Garage',
    distanceKm: 4.2,
    specialty: 'Tyres & Brake Systems',
    rating: 4.8,
    isAvailable: true,
    phone: '9842112345',
    etaMinutes: 18,
    jobsCompleted: 145,
  },
  {
    id: 'MECH-02',
    name: 'Murugan Diesel Services',
    workshopName: 'Murugan Truck Care & Pump Works',
    distanceKm: 7.8,
    specialty: 'Engine & Fuel Line',
    rating: 4.7,
    isAvailable: true,
    phone: '9842198765',
    etaMinutes: 28,
    jobsCompleted: 210,
  },
  {
    id: 'MECH-03',
    name: 'Highway Rapid Repairs',
    workshopName: 'Highway 24x7 Roadside Assistance',
    distanceKm: 12.0,
    specialty: 'Electrical & Battery',
    rating: 4.6,
    isAvailable: true,
    phone: '9842155443',
    etaMinutes: 40,
    jobsCompleted: 98,
  },
];

export const initialOfficeNotifications: OfficeNotification[] = [
  {
    id: 'NOTIF-O-1',
    title: 'New Shipment Request Approval',
    message: 'ABC Exports approved your request for Shipment #SH-1001 (Chennai → Coimbatore). Ready for fleet assignment.',
    time: '15 mins ago',
    type: 'REQUEST',
    read: false,
    targetId: 'SH-1001',
  },
  {
    id: 'NOTIF-O-2',
    title: 'Breakdown Reported',
    message: 'Driver Arun Prakash reported Tyre Problem on NH-44 near Dindigul for vehicle TN38CD5678.',
    time: '10 mins ago',
    type: 'BREAKDOWN',
    read: false,
    targetId: 'BD-001',
  },
  {
    id: 'NOTIF-O-3',
    title: 'FASTag Low Balance',
    message: 'Vehicle TN38CD5678 FASTag balance is ₹750 (Threshold limit ₹1,000). Please recharge the FASTag to avoid toll payment issues.',
    time: '2 mins ago',
    type: 'FASTAG_LOW_BALANCE',
    read: false,
    targetId: 'VEH-002',
  },
];

export const initialDriverNotifications: DriverNotification[] = [
  {
    id: 'NOTIF-D-1',
    title: 'New Shipment Assigned',
    message: 'Transport Office assigned you to Shipment #SH-1001 (Chennai → Coimbatore) with vehicle TN38AB1234. Amount: ₹18,500.',
    time: '20 mins ago',
    type: 'ASSIGNMENT',
    read: false,
    targetId: 'SH-1001',
  },
];

export const initialHistoryItems: HistoryItem[] = [
  {
    id: 'HIST-01',
    type: 'SHIPMENT',
    title: 'Shipment #SH-1001 Assigned',
    subtitle: 'ABC Exports • ₹18,500 • Assigned to Kumar S. & TN38AB1234',
    date: 'Today, 08:45 AM',
    status: 'COMPLETED',
    route: 'Chennai → Coimbatore',
    driverName: 'Kumar S.',
    vehicleNumber: 'TN38AB1234',
  },
];

export const initialOfficeFinancials: OfficeFinancials = {
  totalEarnings: 248500,
  thisMonthEarnings: 58500,
  thisWeekEarnings: 18200,
  todayEarnings: 4500,
  completedTripsCount: 24,
  grossEarnings: 285000,
  expenses: 36500,
  netEarnings: 248500,
  availableBalance: 142800,
  withdrawnAmount: 105700,
  pendingEarnings: 18500,
};

export const initialEarningTrips: EarningTripItem[] = [
  {
    id: 'ERN-1024',
    shipmentId: 'SH-1024',
    route: 'Chennai → Bangalore',
    driverName: 'Arun Kumar',
    vehicleNumber: 'TN38AB1234',
    completedDate: '08 Oct 2026',
    shipmentAmount: 22000,
    officeEarnings: 18500,
    expenses: 3500,
    netEarnings: 15000,
    status: 'COMPLETED',
  },
  {
    id: 'ERN-1042',
    shipmentId: 'SH-1042',
    route: 'Coimbatore → Chennai',
    driverName: 'Karthik',
    vehicleNumber: 'TN38CD5678',
    completedDate: '07 Oct 2026',
    shipmentAmount: 17500,
    officeEarnings: 14800,
    expenses: 2700,
    netEarnings: 12100,
    status: 'COMPLETED',
  },
  {
    id: 'ERN-1032',
    shipmentId: 'SH-1032',
    route: 'Madurai → Trichy',
    driverName: 'Ravi Verma',
    vehicleNumber: 'TN38GH3456',
    completedDate: '05 Oct 2026',
    shipmentAmount: 16500,
    officeEarnings: 14200,
    expenses: 2300,
    netEarnings: 11900,
    status: 'COMPLETED',
  },
  {
    id: 'ERN-1051',
    shipmentId: 'SH-1051',
    route: 'Salem → Hyderabad',
    driverName: 'Manoj Kumar',
    vehicleNumber: 'TN38EF9012',
    completedDate: '03 Oct 2026',
    shipmentAmount: 26000,
    officeEarnings: 22000,
    expenses: 4000,
    netEarnings: 18000,
    status: 'COMPLETED',
  },
  {
    id: 'ERN-1060',
    shipmentId: 'SH-1060',
    route: 'Chennai → Pondicherry',
    driverName: 'Suresh Mani',
    vehicleNumber: 'TN38JK7890',
    completedDate: '01 Oct 2026',
    shipmentAmount: 19500,
    officeEarnings: 16800,
    expenses: 2700,
    netEarnings: 14100,
    status: 'COMPLETED',
  },
];

export const initialPassbookTransactions: PassbookTransaction[] = [
  {
    id: 'PB-101',
    type: 'CREDIT',
    category: 'SHIPMENT_EARNING',
    title: 'Shipment Earnings',
    subtitle: 'Shipment #SH-1024 (Chennai → Bangalore)',
    amount: 18500,
    date: '08 Oct 2026',
    refId: 'SH-1024',
    balanceAfter: 142800,
  },
  {
    id: 'PB-102',
    type: 'CREDIT',
    category: 'SHIPMENT_EARNING',
    title: 'Shipment Earnings',
    subtitle: 'Shipment #SH-1042 (Coimbatore → Chennai)',
    amount: 14800,
    date: '07 Oct 2026',
    refId: 'SH-1042',
    balanceAfter: 124300,
  },
  {
    id: 'PB-103',
    type: 'DEBIT',
    category: 'FASTAG_RECHARGE',
    title: 'FASTag Recharge',
    subtitle: 'Vehicle TN38AB1234 • Tag FT-1001',
    amount: 2000,
    date: '07 Oct 2026',
    refId: 'TN38AB1234',
    balanceAfter: 109500,
  },
  {
    id: 'PB-104',
    type: 'DEBIT',
    category: 'FASTAG_RECHARGE',
    title: 'FASTag Recharge',
    subtitle: 'Vehicle TN38EF9012 • Tag FT-1003',
    amount: 3000,
    date: '05 Oct 2026',
    refId: 'TN38EF9012',
    balanceAfter: 111500,
  },
  {
    id: 'PB-105',
    type: 'DEBIT',
    category: 'WITHDRAWAL',
    title: 'Bank Withdrawal',
    subtitle: 'HDFC Bank Hub Transfer • A/C XX8902',
    amount: 20000,
    date: '05 Oct 2026',
    refId: 'TXN-WDR-889',
    balanceAfter: 114500,
  },
  {
    id: 'PB-106',
    type: 'CREDIT',
    category: 'SHIPMENT_EARNING',
    title: 'Shipment Earnings',
    subtitle: 'Shipment #SH-1051 (Salem → Hyderabad)',
    amount: 22000,
    date: '03 Oct 2026',
    refId: 'SH-1051',
    balanceAfter: 134500,
  },
  {
    id: 'PB-107',
    type: 'DEBIT',
    category: 'FASTAG_RECHARGE',
    title: 'FASTag Recharge',
    subtitle: 'Vehicle TN38CD5678 • Tag FT-1002',
    amount: 1500,
    date: '01 Oct 2026',
    refId: 'TN38CD5678',
    balanceAfter: 112500,
  },
];

export const initialRewardAccount: RewardAccount = {
  points: 1250,
  currentLevel: 'Gold',
  nextLevel: 'Platinum',
  currentTierPoints: 1250,
  nextTierPoints: 2000,
  pointsToNextTier: 750,
  history: [
    {
      id: 'RWD-01',
      title: 'Monthly Fleet Performance Bonus',
      points: 200,
      date: '08 Oct 2026',
      type: 'PERFORMANCE',
    },
    {
      id: 'RWD-02',
      title: 'Completed Shipment #SH-1024',
      points: 100,
      date: '08 Oct 2026',
      type: 'SHIPMENT',
    },
    {
      id: 'RWD-03',
      title: 'On-Time Delivery (SH-1024)',
      points: 50,
      date: '08 Oct 2026',
      type: 'ON_TIME',
    },
    {
      id: 'RWD-04',
      title: 'Successful Return Load Assignment',
      points: 75,
      date: '07 Oct 2026',
      type: 'RETURN_LOAD',
    },
    {
      id: 'RWD-05',
      title: '10 Successful Trips Milestone',
      points: 250,
      date: '05 Oct 2026',
      type: 'MILESTONE',
    },
    {
      id: 'RWD-06',
      title: 'Completed Shipment #SH-1042',
      points: 100,
      date: '04 Oct 2026',
      type: 'SHIPMENT',
    },
    {
      id: 'RWD-07',
      title: 'Completed Shipment #SH-1051',
      points: 100,
      date: '03 Oct 2026',
      type: 'SHIPMENT',
    },
  ],
};

export const initialDriverFinancials: DriverFinancials = {
  totalEarnings: 48500,
  thisMonth: 12800,
  thisMonthEarnings: 12800,
  thisWeek: 4500,
  thisWeekEarnings: 4500,
  today: 1800,
  todayEarnings: 1800,
  completedTripsCount: 18,
  pendingEarnings: 3500,
  paidEarnings: 45000,
};

export const initialDriverTripEarnings: DriverTripEarning[] = [
  {
    id: 'TR-1024',
    tripId: 'TR-1024',
    shipmentId: 'SH-1024',
    route: 'Chennai → Bangalore',
    vehicleNumber: 'TN38AB1234',
    completedDate: '08 Oct 2026',
    tripAmount: 22000,
    driverEarning: 2800,
    status: 'PAID',
  },
  {
    id: 'TR-1021',
    tripId: 'TR-1021',
    shipmentId: 'SH-1042',
    route: 'Coimbatore → Chennai',
    vehicleNumber: 'TN38CD5678',
    completedDate: '07 Oct 2026',
    tripAmount: 18000,
    driverEarning: 3200,
    status: 'PAID',
  },
  {
    id: 'TR-1015',
    tripId: 'TR-1015',
    shipmentId: 'SH-1032',
    route: 'Madurai → Trichy',
    vehicleNumber: 'TN38GH3456',
    completedDate: '05 Oct 2026',
    tripAmount: 16500,
    driverEarning: 2500,
    status: 'PAID',
  },
  {
    id: 'TR-1033',
    tripId: 'TR-1033',
    shipmentId: 'SH-1051',
    route: 'Salem → Hyderabad',
    vehicleNumber: 'TN38EF9012',
    completedDate: '03 Oct 2026',
    tripAmount: 26000,
    driverEarning: 3500,
    status: 'PENDING',
  },
  {
    id: 'TR-1008',
    tripId: 'TR-1008',
    shipmentId: 'SH-1060',
    route: 'Chennai → Pondicherry',
    vehicleNumber: 'TN38JK7890',
    completedDate: '01 Oct 2026',
    tripAmount: 19500,
    driverEarning: 2400,
    status: 'PAID',
  },
];

export const initialMechanicReviews: MechanicReview[] = [
  {
    id: 'REV-001',
    mechanicId: 'MECH-01',
    driverId: 'H360-D-1042',
    driverName: 'Kumar S.',
    shipmentId: 'SH-1001',
    breakdownId: 'BD-001',
    rating: 5,
    comment: 'Quick response and excellent highway tyre replacement.',
    createdAt: '08 Oct 2026',
  },
];
