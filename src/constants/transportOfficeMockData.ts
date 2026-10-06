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
}

export interface OfficeDriver {
  id: string; // e.g. H360-D-1042
  officeId: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
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

export interface OfficeVehicle {
  id: string; // e.g. VEH-001
  officeId: string;
  vehicleNumber: string; // e.g. TN38AB1234
  vehicleType: string; // e.g. 10-Wheeler
  model: string;
  capacityKg: number;
  fuelType: 'Diesel' | 'CNG' | 'Electric';
  rcNumber: string;
  insuranceStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  permitStatus: 'NATIONAL_PERMIT' | 'STATE_PERMIT';
  isActive?: boolean;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRIP' | 'MAINTENANCE' | 'OFFLINE';
  currentDriverId?: string | null;
  currentShipmentId?: string | null;
  lastMaintenanceDate?: string;
}

export type ShipmentStatus =
  | 'PENDING_ASSIGNMENT'
  | 'ASSIGNMENT_PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type TripStage =
  | 'ASSIGNED'
  | 'READY_FOR_PICKUP'
  | 'TRIP_STARTED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED';

export interface ShipmentTimelineEvent {
  title: string;
  time: string;
  completed: boolean;
  description?: string;
}

export interface OfficeShipment {
  id: string; // e.g. HS1024
  officeId: string;
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
  status: ShipmentStatus;
  tripStage?: TripStage;
  assignedDriverId?: string | null;
  assignedVehicleId?: string | null;
  declinedDriverId?: string | null;
  declineReason?: string | null;
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
  type: 'ASSIGNMENT' | 'BREAKDOWN' | 'MECHANIC' | 'TRIP' | 'SYSTEM';
  read: boolean;
  targetId?: string;
}

export interface DriverNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ASSIGNMENT' | 'TRIP' | 'BREAKDOWN' | 'MECHANIC' | 'SYSTEM';
  read: boolean;
  targetId?: string;
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
  name: 'Haul360 Logistics Hub',
  managerName: 'Ramesh Chandran',
  phone: '9840123456',
  email: 'dispatch@haul360.in',
  address: '124, Ring Road Industrial Corridor',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600032',
  isVerified: true,
  registrationNumber: 'TN-CH-TO-2023-8891',
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
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'ASSIGNMENT_PENDING',
    currentShipmentId: 'HS1024',
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
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'BUSY',
    currentShipmentId: 'HS1019',
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
    documentStatus: 'VERIFIED',
    isFirstLogin: false,
    isActive: true,
    availability: 'OFFLINE',
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
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'ASSIGNED',
    currentDriverId: 'H360-D-1042',
    currentShipmentId: 'HS1024',
    lastMaintenanceDate: '15 Sep 2026',
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
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'IN_TRIP',
    currentDriverId: 'H360-D-1044',
    currentShipmentId: 'HS1019',
    lastMaintenanceDate: '02 Aug 2026',
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
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'AVAILABLE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '20 Jul 2026',
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
    insuranceStatus: 'VALID',
    permitStatus: 'STATE_PERMIT',
    isActive: true,
    status: 'AVAILABLE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '10 Aug 2026',
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
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: true,
    status: 'MAINTENANCE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '01 Oct 2026',
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
    insuranceStatus: 'VALID',
    permitStatus: 'NATIONAL_PERMIT',
    isActive: false,
    status: 'OFFLINE',
    currentDriverId: null,
    currentShipmentId: null,
    lastMaintenanceDate: '01 May 2026',
  },
];

export const initialOfficeShipments: OfficeShipment[] = [
  {
    id: 'HS1024',
    officeId: 'OFFICE-001',
    origin: 'Chennai',
    destination: 'Coimbatore',
    originAddress: 'Guindy Industrial Estate, Chennai, TN',
    destinationAddress: 'Peelamedu Warehousing Hub, Coimbatore, TN',
    distanceKm: 510,
    cargoType: 'Industrial Electronics & Spares',
    cargoWeightKg: 7500,
    requiredCapacityKg: 10000,
    pickupTime: 'Today, 10:00 AM',
    expectedDelivery: 'Today, 06:30 PM',
    status: 'ASSIGNMENT_PENDING',
    tripStage: 'ASSIGNED',
    assignedDriverId: 'H360-D-1042',
    assignedVehicleId: 'VEH-001',
    createdAt: '05 Oct 2026, 08:30 AM',
    timeline: [
      { title: 'Shipment Created', time: '08:30 AM', completed: true, description: 'Booked by Haul360 Enterprise Logistics' },
      { title: 'Assigned Driver & Vehicle', time: '08:45 AM', completed: true, description: 'Kumar S. • TN38AB1234' },
      { title: 'Driver Acceptance', time: '--', completed: false, description: 'Pending driver confirmation' },
      { title: 'Trip Started', time: '--', completed: false, description: 'Pickup & transit' },
      { title: 'In Transit', time: '--', completed: false, description: 'En route via NH-44' },
      { title: 'Delivered', time: '--', completed: false, description: 'Destination inspection & signoff' },
    ],
  },
  {
    id: 'HS1025',
    officeId: 'OFFICE-001',
    origin: 'Chennai',
    destination: 'Bengaluru',
    originAddress: 'Sriperumbudur Auto Corridor, Chennai, TN',
    destinationAddress: 'Electronic City Phase II, Bengaluru, KA',
    distanceKm: 345,
    cargoType: 'Automotive Assemblies',
    cargoWeightKg: 12000,
    requiredCapacityKg: 15000,
    pickupTime: 'Tomorrow, 06:00 AM',
    expectedDelivery: 'Tomorrow, 02:00 PM',
    status: 'PENDING_ASSIGNMENT',
    assignedDriverId: null,
    assignedVehicleId: null,
    createdAt: '05 Oct 2026, 09:15 AM',
    timeline: [
      { title: 'Shipment Created', time: '09:15 AM', completed: true, description: 'Scheduled enterprise haul' },
      { title: 'Assigned Driver & Vehicle', time: '--', completed: false },
      { title: 'Driver Acceptance', time: '--', completed: false },
      { title: 'Trip Started', time: '--', completed: false },
      { title: 'In Transit', time: '--', completed: false },
      { title: 'Delivered', time: '--', completed: false },
    ],
  },
  {
    id: 'HS1019',
    officeId: 'OFFICE-001',
    origin: 'Madurai',
    destination: 'Chennai',
    originAddress: 'Kappalur Industrial Hub, Madurai, TN',
    destinationAddress: 'Chennai Port Container Terminal, Chennai, TN',
    distanceKm: 460,
    cargoType: 'Textile Machinery & Yarn',
    cargoWeightKg: 13500,
    requiredCapacityKg: 15000,
    pickupTime: '05 Oct, 04:00 AM',
    expectedDelivery: '05 Oct, 04:30 PM',
    status: 'IN_TRANSIT',
    tripStage: 'IN_TRANSIT',
    assignedDriverId: 'H360-D-1044',
    assignedVehicleId: 'VEH-002',
    createdAt: '04 Oct 2026, 05:00 PM',
    timeline: [
      { title: 'Shipment Created', time: '04 Oct, 05:00 PM', completed: true },
      { title: 'Assigned Driver & Vehicle', time: '04 Oct, 06:30 PM', completed: true, description: 'Arun Prakash / TN38CD5678' },
      { title: 'Driver Acceptance', time: '04 Oct, 07:00 PM', completed: true },
      { title: 'Trip Started', time: '05 Oct, 04:15 AM', completed: true },
      { title: 'In Transit', time: '05 Oct, 08:30 AM', completed: true, description: 'Crossing Villupuram toll' },
      { title: 'Delivered', time: '--', completed: false },
    ],
  },
  {
    id: 'HS1018',
    officeId: 'OFFICE-001',
    origin: 'Chennai',
    destination: 'Salem',
    originAddress: 'Ambattur Industrial Estate, Chennai, TN',
    destinationAddress: 'Steel Plant Complex, Salem, TN',
    distanceKm: 340,
    cargoType: 'Steel Castings',
    cargoWeightKg: 9000,
    requiredCapacityKg: 10000,
    pickupTime: '03 Oct, 07:00 AM',
    expectedDelivery: '03 Oct, 04:00 PM',
    status: 'DELIVERED',
    tripStage: 'DELIVERED',
    assignedDriverId: 'H360-D-1042',
    assignedVehicleId: 'VEH-001',
    createdAt: '02 Oct 2026, 02:00 PM',
    timeline: [
      { title: 'Shipment Created', time: '02 Oct, 02:00 PM', completed: true },
      { title: 'Assigned Driver & Vehicle', time: '02 Oct, 03:00 PM', completed: true },
      { title: 'Driver Acceptance', time: '02 Oct, 03:15 PM', completed: true },
      { title: 'Trip Started', time: '03 Oct, 07:15 AM', completed: true },
      { title: 'In Transit', time: '03 Oct, 11:00 AM', completed: true },
      { title: 'Delivered', time: '03 Oct, 03:45 PM', completed: true, description: 'Signed by Salem Warehouse Manager' },
    ],
  },
];

export const mockNearbyMechanics: MockNearbyMechanic[] = [
  {
    id: 'MECH-001',
    name: 'Rajendran M. (Raj)',
    workshopName: 'Raj Heavy Truck Works',
    distanceKm: 2.4,
    specialty: 'Engine & Transmission Specialist',
    rating: 4.85,
    isAvailable: true,
    phone: '9840998877',
    etaMinutes: 18,
    jobsCompleted: 312,
  },
  {
    id: 'MECH-002',
    name: 'Arun Auto Clinic',
    workshopName: 'Salem Highway Fleet Care',
    distanceKm: 4.1,
    specialty: 'General Heavy Repair & Hydraulics',
    rating: 4.65,
    isAvailable: true,
    phone: '9840112233',
    etaMinutes: 28,
    jobsCompleted: 194,
  },
  {
    id: 'MECH-003',
    name: 'Kumar Electricals',
    workshopName: 'Kumar 24x7 Auto Electricals',
    distanceKm: 6.2,
    specialty: 'ECU, Starter & Electricals',
    rating: 4.4,
    isAvailable: false,
    phone: '9840445566',
    etaMinutes: 45,
    jobsCompleted: 140,
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
    shipmentId: 'HS1019',
    route: 'Madurai → Chennai',
    issueType: 'Engine Problem',
    description: 'Sudden coolant leak and engine overheating alarm near Villupuram toll.',
    location: 'NH-44, Km 148 near Villupuram Toll',
    status: 'MECHANIC_REQUIRED',
    reportedAt: '05 Oct 2026, 09:20 AM',
  },
];

export const initialOfficeNotifications: OfficeNotification[] = [
  {
    id: 'NOTIF-O-001',
    title: '🚨 Breakdown Alert',
    message: 'Arun Prakash reported Engine Problem on vehicle TN38CD5678 near Villupuram.',
    time: '10m ago',
    type: 'BREAKDOWN',
    read: false,
    targetId: 'BD-001',
  },
  {
    id: 'NOTIF-O-002',
    title: 'New Shipment Created',
    message: 'Shipment #HS1024 (Chennai → Coimbatore, 7,500 KG) is ready for assignment.',
    time: '45m ago',
    type: 'ASSIGNMENT',
    read: false,
    targetId: 'HS1024',
  },
  {
    id: 'NOTIF-O-003',
    title: 'Driver Account Ready',
    message: 'Driver Suresh Mani created with ID H360-D-1045. Credentials pending dispatch.',
    time: '2h ago',
    type: 'SYSTEM',
    read: true,
  },
];

export const initialDriverNotifications: DriverNotification[] = [
  {
    id: 'NOTIF-D-001',
    title: 'Welcome to Haul360',
    message: 'Your transport office registered your fleet credentials. Please update your security password.',
    time: '1h ago',
    type: 'SYSTEM',
    read: false,
  },
];

export const initialHistoryItems: HistoryItem[] = [
  {
    id: 'HIST-001',
    type: 'SHIPMENT',
    title: 'Shipment #HS1018 Delivered',
    subtitle: 'Chennai → Salem • Steel Castings (9,000 KG)',
    date: '03 Oct 2026',
    status: 'Delivered',
    route: 'Chennai → Salem',
    driverName: 'Kumar S.',
    vehicleNumber: 'TN38AB1234',
  },
  {
    id: 'HIST-002',
    type: 'MECHANIC',
    title: 'Brake Pad Replacement Service',
    subtitle: 'TN38AB1234 repaired by Raj Heavy Truck Works',
    date: '15 Sep 2026',
    status: 'Completed',
    vehicleNumber: 'TN38AB1234',
  },
  {
    id: 'HIST-003',
    type: 'SHIPMENT',
    title: 'Shipment #HS1012 Delivered',
    subtitle: 'Coimbatore → Chennai • Industrial Motors (14,000 KG)',
    date: '28 Sep 2026',
    status: 'Delivered',
    route: 'Coimbatore → Chennai',
    driverName: 'Manoj Kumar',
    vehicleNumber: 'TN38CD5678',
  },
];
