export type DriverAvailability = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type ShipmentStatus = 'AVAILABLE' | 'BID_PLACED' | 'ASSIGNED' | 'IN_TRANSIT' | 'COMPLETED' | 'EXPIRED';

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'EXPIRED';

export type TripLifecycleStatus =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE_TO_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'LOADED'
  | 'IN_TRANSIT'
  | 'ARRIVED_AT_DESTINATION'
  | 'DELIVERED'
  | 'CANCELLED';

export type BreakdownSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BreakdownStatus =
  | 'REPORTED'
  | 'MECHANIC_REQUESTED'
  | 'MECHANIC_ASSIGNED'
  | 'MECHANIC_ON_THE_WAY'
  | 'MECHANIC_ARRIVED'
  | 'REPAIRING'
  | 'READY_FOR_TESTING'
  | 'COMPLETED';

export interface DriverVehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  vehicleType: string;
  capacityKg: number;
  capacityTons: number;
  bodyType: string;
  fuelType: string;
  year?: number;
  rcNumber: string;
  rcExpiry: string;
  rcStatus: 'VERIFIED' | 'PENDING' | 'EXPIRING';
  insuranceNumber: string;
  insuranceExpiry: string;
  insuranceStatus: 'VERIFIED' | 'PENDING' | 'EXPIRING';
  permitNumber: string;
  permitExpiry: string;
  permitStatus: 'VERIFIED' | 'PENDING' | 'EXPIRING';
  fitnessNumber?: string;
  fitnessExpiry?: string;
  fitnessStatus?: 'VERIFIED' | 'PENDING' | 'EXPIRING' | 'REJECTED';
  fastagTagId: string;
  fastagStatus: 'ACTIVE' | 'LOW_BALANCE' | 'BLOCKED';
  fastagBalance?: number;
  isPrimary?: boolean;
}

export interface DriverDocument {
  id: string;
  name: string;
  type: 'DRIVING_LICENSE' | 'RC' | 'INSURANCE' | 'NATIONAL_PERMIT' | 'POLLUTION_PUC' | 'FITNESS';
  documentNumber: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRING' | 'REJECTED';
  issueDate: string;
  expiryDate: string;
  verifiedAt?: string;
  verificationMessage: string;
  fileUri?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  rating: number;
  totalReviews: number;
  totalTrips: number;
  experienceYears: number;
  joinedDate: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNDER_REVIEW';
  city: string;
  state: string;
  licenseNumber: string;
  preferredRoutes: string[];
}

export interface ShipmentItem {
  id: string;
  shipmentNumber: string;
  title: string;
  shipperName: string;
  shipperCompany: string;
  shipperPhone: string;
  shipperRating: number;
  pickupLocation: {
    city: string;
    state: string;
    address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  destinationLocation: {
    city: string;
    state: string;
    address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  distanceKm: number;
  cargoType: string;
  weightKg: number;
  requiredCapacityKg: number;
  vehicleTypeRequired: string;
  expectedPayment: number;
  bidDeadline: string;
  pickupDate: string;
  deliveryDeadline: string;
  isImportExport?: boolean;
  specialInstructions?: string;
  status: ShipmentStatus;
  currentBidCount: number;
  lowestBid?: number;
  isReturnLoadOpportunity?: boolean;
}

export interface ReturnLoadRecommendation extends ShipmentItem {
  matchScore: number;
  matchReasons: string[];
  pickupDistanceKm: number;
  originFromLastDropoff: string;
}

export interface BidItem {
  id: string;
  shipmentId: string;
  shipmentNumber: string;
  route: string;
  originCity: string;
  destinationCity: string;
  cargoType: string;
  weightKg: number;
  bidAmount: number;
  targetPayment: number;
  submittedAt: string;
  status: BidStatus;
  shipperName: string;
  shipperCompany: string;
  isReturnLoad: boolean;
  notes?: string;
  estimatedPickupDate: string;
}

export interface TripStep {
  status: TripLifecycleStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface TripItem {
  id: string;
  tripNumber: string;
  shipmentId: string;
  shipmentNumber: string;
  shipperName: string;
  shipperCompany: string;
  shipperPhone: string;
  pickupLocation: {
    city: string;
    state: string;
    address: string;
  };
  destinationLocation: {
    city: string;
    state: string;
    address: string;
  };
  distanceKm: number;
  cargoType: string;
  weightKg: number;
  vehicleNumber: string;
  paymentAmount: number;
  paymentStatus: 'PENDING' | 'ESCROW_LOCKED' | 'PAID' | 'RELEASED';
  status: TripLifecycleStatus;
  startDate: string;
  deliveryDate?: string;
  currentStepIndex: number;
  steps: TripStep[];
  breakdownId?: string;
  isReturnLoad?: boolean;
}

export interface BreakdownRecord {
  id: string;
  tripId?: string;
  tripNumber?: string;
  vehicleNumber: string;
  vehicleType: string;
  category: string;
  severity: BreakdownSeverity;
  description: string;
  locationAddress: string;
  reportedAt: string;
  status: BreakdownStatus;
  mechanic?: {
    id: string;
    name: string;
    workshopName: string;
    phone: string;
    rating: number;
    distanceKm: number;
    estimatedArrivalMinutes?: number;
    assignedAt?: string;
    repairNotes?: string;
    estimatedCost?: number;
  };
}

export interface MoneyTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  time: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: 'SHIPMENT_PAYMENT' | 'REWARD' | 'BONUS' | 'WITHDRAWAL' | 'FASTAG_RECHARGE' | 'REFUND' | 'ADJUSTMENT';
  title: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  relatedShipmentNumber?: string;
  referenceId?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  badgeCode: string;
  category: 'FUEL_DISCOUNT' | 'CASHBACK' | 'MAINTENANCE' | 'TIRE_SERVICE' | 'INSURANCE_PERK';
  isClaimed: boolean;
  claimedAt?: string;
  expiryDate: string;
  discountValue: string;
}

export interface RewardHistory {
  id: string;
  source: string;
  points: number;
  date: string;
  type: 'EARNED' | 'REDEEMED';
}

export interface FastagTransaction {
  id: string;
  plazaName: string;
  lane: string;
  date: string;
  time: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  vehicleNumber: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface CallLogItem {
  id: string;
  contactName: string;
  role: 'Shipper' | 'Transport Office' | 'Mechanic' | 'Haul360 Support' | 'Emergency Dispatch';
  phoneNumber: string;
  callType: 'INCOMING' | 'OUTGOING' | 'MISSED';
  date: string;
  time: string;
  duration?: string;
  relatedTripNumber?: string;
}

export interface DriverAlert {
  id: string;
  category: 'SHIPMENT' | 'BID' | 'ASSIGNMENT' | 'TRIP' | 'PAYMENT' | 'FASTAG' | 'DOCUMENTS' | 'MECHANIC' | 'ACCOUNT';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface DriverReview {
  id: string;
  shipperName: string;
  company: string;
  rating: number;
  date: string;
  comment: string;
  tripNumber: string;
  route: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  responseMessage?: string;
}

// ==========================================
// INITIAL MOCK DATA
// ==========================================

export const initialDriverProfile: DriverProfile = {
  id: 'DRV-IND-1042',
  name: 'Arun Kumar',
  phone: '+91 98765 43210',
  email: 'arun.kumar.freight@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  rating: 4.7,
  totalReviews: 86,
  totalTrips: 142,
  experienceYears: 6,
  joinedDate: '12 Jan 2023',
  verificationStatus: 'VERIFIED',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  licenseNumber: 'TN-38-2018-0094821',
  preferredRoutes: ['Coimbatore - Chennai', 'Bengaluru - Hyderabad', 'Salem - Kochi', 'Madurai - Mumbai'],
};

export const initialDriverVehicle: DriverVehicle = {
  id: 'VEH-IND-01',
  vehicleNumber: 'TN 38 AB 1234',
  model: 'Tata Prima 2830.K Heavy Truck',
  vehicleType: '10-Wheeler Multi-Axle Truck',
  capacityKg: 10000,
  capacityTons: 10,
  bodyType: 'Closed Container / Dry Van',
  fuelType: 'Diesel',
  year: 2021,
  rcNumber: 'RC-TN38-2021-9871',
  rcExpiry: '15 Aug 2031',
  rcStatus: 'VERIFIED',
  insuranceNumber: 'POL-ICICI-LOMB-88741',
  insuranceExpiry: '24 Nov 2026',
  insuranceStatus: 'VERIFIED',
  permitNumber: 'NP-IND-TN-2022-4911',
  permitExpiry: '10 May 2027',
  permitStatus: 'VERIFIED',
  fitnessNumber: 'FIT-TN-2023-8821',
  fitnessExpiry: '14 Oct 2027',
  fitnessStatus: 'VERIFIED',
  fastagTagId: 'NETC-HDFC-889920194',
  fastagStatus: 'ACTIVE',
  fastagBalance: 2450,
  isPrimary: true,
};

export const initialDriverVehicles: DriverVehicle[] = [
  initialDriverVehicle,
  {
    id: 'VEH-IND-02',
    vehicleNumber: 'TN 37 CY 8820',
    model: 'Ashok Leyland 1920 6x2',
    vehicleType: '6-Wheeler Medium Haul Truck',
    capacityKg: 6000,
    capacityTons: 6,
    bodyType: 'High Side Deck / Open',
    fuelType: 'Diesel',
    year: 2022,
    rcNumber: 'RC-TN37-2022-4412',
    rcExpiry: '20 Sep 2032',
    rcStatus: 'VERIFIED',
    insuranceNumber: 'POL-HDFC-ERGO-33912',
    insuranceExpiry: '18 Sep 2026',
    insuranceStatus: 'VERIFIED',
    permitNumber: 'NP-IND-TN-2022-9901',
    permitExpiry: '19 Sep 2027',
    permitStatus: 'VERIFIED',
    fitnessNumber: 'FIT-TN-2022-1920',
    fitnessExpiry: '15 Sep 2027',
    fitnessStatus: 'VERIFIED',
    fastagTagId: 'NETC-ICICI-991204812',
    fastagStatus: 'ACTIVE',
    fastagBalance: 1200,
    isPrimary: false,
  },
];

export const initialDriverDocuments: DriverDocument[] = [
  {
    id: 'DOC-01',
    name: 'Commercial Driving License',
    type: 'DRIVING_LICENSE',
    documentNumber: 'TN-38-2018-0094821',
    status: 'VERIFIED',
    issueDate: '14 Feb 2018',
    expiryDate: '13 Feb 2038',
    verifiedAt: '12 Jan 2023',
    verificationMessage: 'Verified and active for Heavy Commercial Transport.',
  },
  {
    id: 'DOC-02',
    name: 'Vehicle Registration Certificate (RC)',
    type: 'RC',
    documentNumber: 'TN38AB1234-RC',
    status: 'VERIFIED',
    issueDate: '15 Aug 2021',
    expiryDate: '15 Aug 2031',
    verifiedAt: '12 Jan 2023',
    verificationMessage: 'Transport Department verified. Clean title.',
  },
  {
    id: 'DOC-03',
    name: 'Comprehensive Commercial Insurance',
    type: 'INSURANCE',
    documentNumber: 'POL-ICICI-88741',
    status: 'VERIFIED',
    issueDate: '25 Nov 2025',
    expiryDate: '24 Nov 2026',
    verifiedAt: '26 Nov 2025',
    verificationMessage: 'Full collision, third party, and cargo liability active.',
  },
  {
    id: 'DOC-04',
    name: 'National Commercial Permit',
    type: 'NATIONAL_PERMIT',
    documentNumber: 'NP-TN-2022-4911',
    status: 'VERIFIED',
    issueDate: '11 May 2022',
    expiryDate: '10 May 2027',
    verifiedAt: '12 Jan 2023',
    verificationMessage: 'All-India National Permit valid.',
  },
  {
    id: 'DOC-05',
    name: 'Pollution Under Control (PUC)',
    type: 'POLLUTION_PUC',
    documentNumber: 'PUC-TN-99281',
    status: 'EXPIRING',
    issueDate: '10 Oct 2025',
    expiryDate: '09 Apr 2026',
    verifiedAt: '10 Oct 2025',
    verificationMessage: 'PUC renewal due in 2 days. Please renew to avoid fines.',
  },
];

export const initialShipments: ShipmentItem[] = [
  {
    id: 'SH-1040',
    shipmentNumber: 'SH-1040',
    title: 'General Cargo Batch',
    shipperName: 'Venkatesh R.',
    shipperCompany: 'Chennai Commercial Freight Ltd.',
    shipperPhone: '+91 94441 55667',
    shipperRating: 4.8,
    pickupLocation: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Guindy Industrial Estate, Sector 2',
      landmark: 'Near ESI Hospital',
    },
    destinationLocation: {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'L&T Bypass Logistics Center',
      landmark: 'Near Toll Plaza',
    },
    distanceKm: 505,
    cargoType: 'General Cargo',
    weightKg: 12000,
    requiredCapacityKg: 12000,
    vehicleTypeRequired: '10-Wheeler Multi-Axle Truck',
    expectedPayment: 18500,
    bidDeadline: 'Today, 07:00 PM',
    pickupDate: 'Tomorrow, 08:30 AM',
    deliveryDeadline: '2 Days from pickup',
    isImportExport: false,
    specialInstructions: 'Standard pallets. Waterproof tarpaulin required.',
    status: 'AVAILABLE',
    currentBidCount: 3,
    lowestBid: 18000,
  },
  {
    id: 'SH-1042',
    shipmentNumber: 'SH-1042',
    title: 'Precision Auto Components Batch',
    shipperName: 'Suresh Narayanan',
    shipperCompany: 'Apex Industrial Parts Ltd.',
    shipperPhone: '+91 94432 11223',
    shipperRating: 4.9,
    pickupLocation: {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'Plot 42, SIDCO Industrial Estate, Kurichi',
      landmark: 'Near Toll Gate',
    },
    destinationLocation: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Warehouse 12, Ambattur Industrial Estate',
      landmark: 'Opposite Telephone Exchange',
    },
    distanceKm: 510,
    cargoType: 'Industrial Machinery & Auto Parts',
    weightKg: 8500,
    requiredCapacityKg: 10000,
    vehicleTypeRequired: '10-Wheeler Multi-Axle Truck',
    expectedPayment: 38500,
    bidDeadline: 'Today, 06:00 PM',
    pickupDate: 'Tomorrow, 08:00 AM',
    deliveryDeadline: '2 Days from pickup',
    isImportExport: false,
    specialInstructions: 'Secure strapping required. Keep tarpaulin tight against rain.',
    status: 'AVAILABLE',
    currentBidCount: 4,
    lowestBid: 37000,
  },
  {
    id: 'SH-1043',
    shipmentNumber: 'SH-1043',
    title: 'Textile Fabric Bales & Yarn Spools',
    shipperName: 'Ramanathan G.',
    shipperCompany: 'Kovai Premier Textiles',
    shipperPhone: '+91 98421 99881',
    shipperRating: 4.8,
    pickupLocation: {
      city: 'Tiruppur',
      state: 'Tamil Nadu',
      address: 'Textile Hub, Mangalam Road',
    },
    destinationLocation: {
      city: 'Bengaluru',
      state: 'Karnataka',
      address: 'Peenya Industrial Area 3rd Phase',
    },
    distanceKm: 340,
    cargoType: 'Export Quality Cotton Bales',
    weightKg: 7200,
    requiredCapacityKg: 8000,
    vehicleTypeRequired: 'Open/Closed Truck',
    expectedPayment: 26500,
    bidDeadline: 'Tomorrow, 11:00 AM',
    pickupDate: 'Tomorrow, 02:00 PM',
    deliveryDeadline: 'Next Day Morning',
    isImportExport: true,
    specialInstructions: 'Dry cargo only. No moisture allowed in loading dock.',
    status: 'AVAILABLE',
    currentBidCount: 2,
    lowestBid: 25500,
  },
  {
    id: 'SH-1044',
    shipmentNumber: 'SH-1044',
    title: 'FMCG Packaged Goods & Dry Grocery',
    shipperName: 'Kavitha S.',
    shipperCompany: 'Zenith Logistics Hub',
    shipperPhone: '+91 97900 44556',
    shipperRating: 4.6,
    pickupLocation: {
      city: 'Salem',
      state: 'Tamil Nadu',
      address: 'Steel Plant Road Logistics Park',
    },
    destinationLocation: {
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Medchal Logistics Corridor, Unit 4',
    },
    distanceKm: 760,
    cargoType: 'Packed Consumer Staples',
    weightKg: 9500,
    requiredCapacityKg: 10000,
    vehicleTypeRequired: '10-Wheeler Covered Truck',
    expectedPayment: 54000,
    bidDeadline: 'Today, 08:30 PM',
    pickupDate: '10 Oct, 09:00 AM',
    deliveryDeadline: '12 Oct, 05:00 PM',
    isImportExport: false,
    specialInstructions: 'Fastag route mandatory. Digital POD upon dropoff.',
    status: 'AVAILABLE',
    currentBidCount: 6,
    lowestBid: 52000,
  },
  {
    id: 'SH-1045',
    shipmentNumber: 'SH-1045',
    title: 'Electrical Transformers & Cables',
    shipperName: 'Vikram Menon',
    shipperCompany: 'Kerala Power Systems',
    shipperPhone: '+91 94471 22334',
    shipperRating: 4.7,
    pickupLocation: {
      city: 'Kochi',
      state: 'Kerala',
      address: 'KINFRA Hi-Tech Park, Kalamassery',
    },
    destinationLocation: {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'Singanallur Industrial Complex',
    },
    distanceKm: 190,
    cargoType: 'Electrical Transformers & Spares',
    weightKg: 6800,
    requiredCapacityKg: 8000,
    vehicleTypeRequired: 'Flatbed / Heavy Truck',
    expectedPayment: 19500,
    bidDeadline: 'Today, 04:00 PM',
    pickupDate: 'Tomorrow, 07:00 AM',
    deliveryDeadline: 'Same Day Evening',
    isImportExport: false,
    specialInstructions: 'Heavy wooden crating. Handle with crane equipment.',
    status: 'AVAILABLE',
    currentBidCount: 3,
    lowestBid: 18500,
  },
  {
    id: 'SH-1046',
    shipmentNumber: 'SH-1046',
    title: 'Steel Coils & Construction Plates',
    shipperName: 'Anil Agarwal',
    shipperCompany: 'Deccan Metal Works',
    shipperPhone: '+91 98855 77112',
    shipperRating: 4.5,
    pickupLocation: {
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Balanagar Industrial Zone',
    },
    destinationLocation: {
      city: 'Chennai Port',
      state: 'Tamil Nadu',
      address: 'Harbor Gate 4, Container Freight Station',
    },
    distanceKm: 630,
    cargoType: 'Steel Coils (Export Consignment)',
    weightKg: 9800,
    requiredCapacityKg: 10000,
    vehicleTypeRequired: 'Heavy Multi-Axle Truck',
    expectedPayment: 46000,
    bidDeadline: '11 Oct, 02:00 PM',
    pickupDate: '12 Oct, 10:00 AM',
    deliveryDeadline: '14 Oct, 06:00 PM',
    isImportExport: true,
    specialInstructions: 'Customs port entry pass will be issued at gate.',
    status: 'AVAILABLE',
    currentBidCount: 5,
    lowestBid: 44000,
  },
];

export const initialReturnLoads: ReturnLoadRecommendation[] = [
  {
    id: 'RET-201',
    shipmentNumber: 'SH-RET-201',
    title: 'Port Machinery Return Load to Coimbatore',
    shipperName: 'Muruganandham V.',
    shipperCompany: 'Madras Freight Forwarders',
    shipperPhone: '+91 94440 88776',
    shipperRating: 4.9,
    pickupLocation: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Guindy Industrial Estate, Sector 2',
      landmark: 'Near ESI Hospital',
    },
    destinationLocation: {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'L&T Bypass Logistics Center',
    },
    distanceKm: 505,
    cargoType: 'Engineering Castings & Spare Parts',
    weightKg: 8900,
    requiredCapacityKg: 10000,
    vehicleTypeRequired: '10-Wheeler Multi-Axle Truck',
    expectedPayment: 36000,
    bidDeadline: 'Tomorrow, 03:00 PM',
    pickupDate: 'Tomorrow, 06:00 PM',
    deliveryDeadline: 'Next Day Evening',
    isImportExport: false,
    specialInstructions: 'Direct return route. Zero waiting time at pickup gate.',
    status: 'AVAILABLE',
    currentBidCount: 1,
    isReturnLoadOpportunity: true,
    matchScore: 96,
    matchReasons: [
      'Pickup is only 14 km from your Chennai delivery point',
      'Fits your 10-Tonne truck capacity perfectly (8.9T payload)',
      'Returns directly to your base city (Coimbatore)',
      'High payout rate of ₹71 / km',
    ],
    pickupDistanceKm: 14,
    originFromLastDropoff: 'Ambattur / Chennai Hub',
  },
  {
    id: 'RET-202',
    shipmentNumber: 'SH-RET-202',
    title: 'Electronics & Home Appliances Consignment',
    shipperName: 'Naveen Raj',
    shipperCompany: 'Sri City Electronics Hub',
    shipperPhone: '+91 98401 33221',
    shipperRating: 4.8,
    pickupLocation: {
      city: 'Sri City',
      state: 'Andhra Pradesh',
      address: 'Domestic Tariff Area, Zone A',
    },
    destinationLocation: {
      city: 'Salem',
      state: 'Tamil Nadu',
      address: 'Salem Highway Distribution Hub',
    },
    distanceKm: 380,
    cargoType: 'Consumer Appliances (Boxed)',
    weightKg: 6500,
    requiredCapacityKg: 8000,
    vehicleTypeRequired: 'Covered Container Truck',
    expectedPayment: 29500,
    bidDeadline: 'Today, 09:00 PM',
    pickupDate: 'Tomorrow, 10:00 AM',
    deliveryDeadline: 'Next Day Morning',
    isImportExport: false,
    specialInstructions: 'Waterproof container mandatory. Fragile electronics.',
    status: 'AVAILABLE',
    currentBidCount: 3,
    isReturnLoadOpportunity: true,
    matchScore: 89,
    matchReasons: [
      'Direct highway corridor through your route back home',
      'Lightweight cargo for lower fuel consumption',
      'Fast loading facility with pallet jacks',
    ],
    pickupDistanceKm: 48,
    originFromLastDropoff: 'Chennai North Hub',
  },
  {
    id: 'RET-203',
    shipmentNumber: 'SH-RET-203',
    title: 'Electronics Return Consignment',
    shipperName: 'Karthik S.',
    shipperCompany: 'Coimbatore Digital Logistics',
    shipperPhone: '+91 98422 11990',
    shipperRating: 4.9,
    pickupLocation: {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'Singanallur Commercial Hub, Block B',
      landmark: 'Near Trichy Road Flyover',
    },
    destinationLocation: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Ambattur Industrial Estate',
      landmark: 'Opposite Bus Terminus',
    },
    distanceKm: 505,
    cargoType: 'Electronics',
    weightKg: 850,
    requiredCapacityKg: 1000,
    vehicleTypeRequired: 'Covered Container / Light-Medium Truck',
    expectedPayment: 16500,
    bidDeadline: 'Tomorrow, 12:00 PM',
    pickupDate: 'Tomorrow, 02:00 PM',
    deliveryDeadline: 'Next Day Morning',
    isImportExport: false,
    specialInstructions: 'Fragile boxed items. Clean dry interior required.',
    status: 'AVAILABLE',
    currentBidCount: 2,
    isReturnLoadOpportunity: true,
    matchScore: 94,
    matchReasons: [
      'Pickup near current location (8 km away)',
      'Fits vehicle capacity',
      'Good payment',
      'Suitable pickup time',
    ],
    pickupDistanceKm: 8,
    originFromLastDropoff: 'Coimbatore Dropoff Hub',
  },
];

export const initialBids: BidItem[] = [
  {
    id: 'BID-901',
    shipmentId: 'SH-1042',
    shipmentNumber: 'SH-1042',
    route: 'Coimbatore → Chennai',
    originCity: 'Coimbatore',
    destinationCity: 'Chennai',
    cargoType: 'Industrial Machinery & Auto Parts',
    weightKg: 8500,
    bidAmount: 38000,
    targetPayment: 38500,
    submittedAt: 'Today, 02:15 PM',
    status: 'PENDING',
    shipperName: 'Suresh Narayanan',
    shipperCompany: 'Apex Industrial Parts Ltd.',
    isReturnLoad: false,
    notes: 'Available with 10T Tata Prima truck immediately. Experienced with heavy machinery.',
    estimatedPickupDate: 'Tomorrow, 08:00 AM',
  },
  {
    id: 'BID-899',
    shipmentId: 'SH-1039',
    shipmentNumber: 'SH-1039',
    route: 'Madurai → Bengaluru',
    originCity: 'Madurai',
    destinationCity: 'Bengaluru',
    cargoType: 'Agricultural Produce & Spices',
    weightKg: 9200,
    bidAmount: 34500,
    targetPayment: 35000,
    submittedAt: '04 Oct 2026, 10:30 AM',
    status: 'ACCEPTED',
    shipperName: 'Ganesan Traders',
    shipperCompany: 'Southern Spice Merchants',
    isReturnLoad: false,
    notes: 'Completed delivery on time.',
    estimatedPickupDate: '05 Oct 2026, 09:00 AM',
  },
  {
    id: 'BID-895',
    shipmentId: 'SH-1035',
    shipmentNumber: 'SH-1035',
    route: 'Salem → Kochi',
    originCity: 'Salem',
    destinationCity: 'Kochi',
    cargoType: 'Ceramic Tiles & Sanitaries',
    weightKg: 9800,
    bidAmount: 24000,
    targetPayment: 22000,
    submittedAt: '28 Sep 2026, 11:00 AM',
    status: 'REJECTED',
    shipperName: 'Royal Ceramics Ltd',
    shipperCompany: 'Royal Ceramics Ltd',
    isReturnLoad: false,
    notes: 'Bid was slightly higher than shipper ceiling rate.',
    estimatedPickupDate: '29 Sep 2026, 08:00 AM',
  },
  {
    id: 'BID-890',
    shipmentId: 'SH-RET-190',
    shipmentNumber: 'SH-RET-190',
    route: 'Chennai → Coimbatore',
    originCity: 'Chennai',
    destinationCity: 'Coimbatore',
    cargoType: 'Automotive Batteries',
    weightKg: 7500,
    bidAmount: 32000,
    targetPayment: 32500,
    submittedAt: '22 Sep 2026, 04:45 PM',
    status: 'ACCEPTED',
    shipperName: 'Madras Batteries Corp',
    shipperCompany: 'Madras Batteries Corp',
    isReturnLoad: true,
    notes: 'Return load completed successfully.',
    estimatedPickupDate: '23 Sep 2026, 09:00 AM',
  },
];

const DEFAULT_TRIP_STEPS: TripStep[] = [
  { status: 'ASSIGNED', label: 'Shipment Assigned', completed: true, current: false, timestamp: 'Today, 09:00 AM' },
  { status: 'ACCEPTED', label: 'Driver Accepted', completed: true, current: false, timestamp: 'Today, 09:15 AM' },
  { status: 'EN_ROUTE_TO_PICKUP', label: 'En Route to Pickup', completed: true, current: false, timestamp: 'Today, 10:00 AM' },
  { status: 'ARRIVED_AT_PICKUP', label: 'Arrived at Pickup Facility', completed: true, current: false, timestamp: 'Today, 10:45 AM' },
  { status: 'LOADED', label: 'Cargo Loaded & Secured', completed: true, current: false, timestamp: 'Today, 11:30 AM' },
  { status: 'IN_TRANSIT', label: 'In Transit on Highway', completed: false, current: true, timestamp: 'Today, 12:00 PM' },
  { status: 'ARRIVED_AT_DESTINATION', label: 'Arrived at Destination Hub', completed: false, current: false },
  { status: 'DELIVERED', label: 'Delivered & POD Verified', completed: false, current: false },
];

export const initialActiveTrip: TripItem = {
  id: 'TRIP-7041',
  tripNumber: 'TRP-2026-7041',
  shipmentId: 'SH-1042',
  shipmentNumber: 'SH-1042',
  shipperName: 'Suresh Narayanan',
  shipperCompany: 'Apex Industrial Parts Ltd.',
  shipperPhone: '+91 94432 11223',
  pickupLocation: {
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: 'Plot 42, SIDCO Industrial Estate, Kurichi',
  },
  destinationLocation: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Warehouse 12, Ambattur Industrial Estate',
  },
  distanceKm: 510,
  cargoType: 'Precision Auto Components Batch',
  weightKg: 8500,
  vehicleNumber: 'TN 38 AB 1234',
  paymentAmount: 38500,
  paymentStatus: 'ESCROW_LOCKED',
  status: 'IN_TRANSIT',
  startDate: 'Today, 10:00 AM',
  currentStepIndex: 5,
  steps: DEFAULT_TRIP_STEPS,
  isReturnLoad: false,
};

export const initialTripsHistory: TripItem[] = [
  initialActiveTrip,
  {
    id: 'TRIP-7038',
    tripNumber: 'TRP-2026-7038',
    shipmentId: 'SH-1039',
    shipmentNumber: 'SH-1039',
    shipperName: 'Ganesan Traders',
    shipperCompany: 'Southern Spice Merchants',
    shipperPhone: '+91 98432 55667',
    pickupLocation: {
      city: 'Madurai',
      state: 'Tamil Nadu',
      address: 'Grain Market Road, Mattuthavani',
    },
    destinationLocation: {
      city: 'Bengaluru',
      state: 'Karnataka',
      address: 'Yeshwanthpur APMC Yard',
    },
    distanceKm: 440,
    cargoType: 'Spices & Agri Goods',
    weightKg: 9200,
    vehicleNumber: 'TN 38 AB 1234',
    paymentAmount: 34500,
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    startDate: '04 Oct 2026',
    deliveryDate: '05 Oct 2026',
    currentStepIndex: 7,
    steps: DEFAULT_TRIP_STEPS.map((s) => ({ ...s, completed: true, current: false })),
    isReturnLoad: false,
  },
  {
    id: 'TRIP-7029',
    tripNumber: 'TRP-2026-7029',
    shipmentId: 'SH-RET-190',
    shipmentNumber: 'SH-RET-190',
    shipperName: 'Madras Batteries Corp',
    shipperCompany: 'Madras Batteries Corp',
    shipperPhone: '+91 94440 99112',
    pickupLocation: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'Maraimalai Nagar Industrial Zone',
    },
    destinationLocation: {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'Gandhipuram Goods Shed',
    },
    distanceKm: 500,
    cargoType: 'Automotive Batteries',
    weightKg: 7500,
    vehicleNumber: 'TN 38 AB 1234',
    paymentAmount: 32000,
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    startDate: '23 Sep 2026',
    deliveryDate: '24 Sep 2026',
    currentStepIndex: 7,
    steps: DEFAULT_TRIP_STEPS.map((s) => ({ ...s, completed: true, current: false })),
    isReturnLoad: true,
  },
];

export const initialBreakdownRecords: BreakdownRecord[] = [
  {
    id: 'BRK-501',
    tripId: 'TRIP-7041',
    tripNumber: 'TRP-2026-7041',
    vehicleNumber: 'TN 38 AB 1234',
    vehicleType: '10-Wheeler Multi-Axle Truck',
    category: 'Coolant Hose Leak & Temperature Rise',
    severity: 'MEDIUM',
    description: 'Engine temperature indicator warning on NH 44 near Salem bypass. Coolant reservoir dripping slowly.',
    locationAddress: 'NH 44, Near Omalur Toll Plaza, Salem District (11.7291° N, 78.0722° E)',
    reportedAt: 'Today, 01:10 PM',
    status: 'MECHANIC_ASSIGNED',
    mechanic: {
      id: 'MEC-881',
      name: 'Ramesh Kumar',
      workshopName: 'Sundaram Commercial Auto Care & Highway Rescue',
      phone: '+91 98422 66778',
      rating: 4.8,
      distanceKm: 6.5,
      estimatedArrivalMinutes: 18,
      assignedAt: 'Today, 01:25 PM',
      repairNotes: 'Mechanic en route with radiator hose kit and coolant canister.',
      estimatedCost: 2200,
    },
  },
];

export const initialMoneyTransactions: MoneyTransaction[] = [
  {
    id: 'TXN-9941',
    transactionNumber: 'TXN-2026-9941',
    date: '05 Oct 2026',
    time: '04:30 PM',
    amount: 34500,
    type: 'CREDIT',
    category: 'SHIPMENT_PAYMENT',
    title: 'Trip Settlement: Madurai → Bengaluru',
    description: 'Full payment released from shipper escrow after digital POD confirmation.',
    status: 'COMPLETED',
    relatedShipmentNumber: 'SH-1039',
  },
  {
    id: 'TXN-9938',
    transactionNumber: 'TXN-2026-9938',
    date: '04 Oct 2026',
    time: '11:15 AM',
    amount: 1500,
    type: 'CREDIT',
    category: 'REWARD',
    title: 'On-Time Delivery Milestone Reward',
    description: 'Reward voucher credited for maintaining 98% punctuality over 20 consecutive runs.',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-9932',
    transactionNumber: 'TXN-2026-9932',
    date: '01 Oct 2026',
    time: '09:00 AM',
    amount: 25000,
    type: 'DEBIT',
    category: 'WITHDRAWAL',
    title: 'Bank Transfer to HDFC Account ****4821',
    description: 'Withdrawal to registered bank account completed via IMPS.',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-9925',
    transactionNumber: 'TXN-2026-9925',
    date: '28 Sep 2026',
    time: '06:20 PM',
    amount: 2000,
    type: 'DEBIT',
    category: 'FASTAG_RECHARGE',
    title: 'FASTag Wallet Top-up',
    description: 'Recharge for vehicle TN 38 AB 1234 deducted from account balance.',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-9918',
    transactionNumber: 'TXN-2026-9918',
    date: '24 Sep 2026',
    time: '02:00 PM',
    amount: 32000,
    type: 'CREDIT',
    category: 'SHIPMENT_PAYMENT',
    title: 'Return Load Payment: Chennai → Coimbatore',
    description: 'Return haul payment credited directly to wallet.',
    status: 'COMPLETED',
    relatedShipmentNumber: 'SH-RET-190',
  },
];

export const initialRewards: RewardItem[] = [
  {
    id: 'REW-101',
    title: 'HPCL / IOCL Diesel Discount Coupon',
    description: 'Get ₹3.50/L off up to 100 Litres at all partner highway fuel stations.',
    pointsRequired: 500,
    badgeCode: 'FUEL_HERO',
    category: 'FUEL_DISCOUNT',
    isClaimed: false,
    expiryDate: '31 Oct 2026',
    discountValue: '₹350 Value',
  },
  {
    id: 'REW-102',
    title: 'Free Wheel Alignment & Brake Check',
    description: 'Complimentary computerized check at any certified Haul360 mechanic garage.',
    pointsRequired: 750,
    badgeCode: 'SAFETY_STAR',
    category: 'MAINTENANCE',
    isClaimed: true,
    claimedAt: '02 Oct 2026',
    expiryDate: '15 Nov 2026',
    discountValue: '₹800 Value',
  },
  {
    id: 'REW-103',
    title: 'Apollo / MRF Heavy Truck Tire Discount',
    description: '15% instant rebate on commercial radial truck tire replacement.',
    pointsRequired: 1200,
    badgeCode: 'TIRE_PRO',
    category: 'TIRE_SERVICE',
    isClaimed: false,
    expiryDate: '31 Dec 2026',
    discountValue: '15% Off',
  },
  {
    id: 'REW-104',
    title: 'Instant Cash Bonus to Passbook',
    description: 'Redeem 1000 points directly as ₹1,000 withdrawable cash credit.',
    pointsRequired: 1000,
    badgeCode: 'CASH_ELITE',
    category: 'CASHBACK',
    isClaimed: false,
    expiryDate: 'Unlimited',
    discountValue: '₹1,000 Cash',
  },
];

export const initialRewardHistory: RewardHistory[] = [
  { id: 'RH-01', source: 'Completed Trip: Madurai → Bengaluru', points: 150, date: '05 Oct 2026', type: 'EARNED' },
  { id: 'RH-02', source: '5-Star Rating Bonus from Shipper', points: 100, date: '05 Oct 2026', type: 'EARNED' },
  { id: 'RH-03', source: 'Redeemed Wheel Alignment Voucher', points: 750, date: '02 Oct 2026', type: 'REDEEMED' },
  { id: 'RH-04', source: 'Completed Return Load: Chennai → CBE', points: 200, date: '24 Sep 2026', type: 'EARNED' },
  { id: 'RH-05', source: 'Zero Toll Violation Monthly Bonus', points: 300, date: '20 Sep 2026', type: 'EARNED' },
];

export const initialFastagTransactions: FastagTransaction[] = [
  {
    id: 'FTG-881',
    plazaName: 'Salem NH-44 Toll Plaza',
    lane: 'Lane 04 (Express ETC)',
    date: 'Today',
    time: '12:45 PM',
    amount: 145,
    type: 'DEBIT',
    vehicleNumber: 'TN 38 AB 1234',
    status: 'SUCCESS',
  },
  {
    id: 'FTG-880',
    plazaName: 'Vijayamangalam Toll Plaza',
    lane: 'Lane 02',
    date: 'Today',
    time: '11:10 AM',
    amount: 110,
    type: 'DEBIT',
    vehicleNumber: 'TN 38 AB 1234',
    status: 'SUCCESS',
  },
  {
    id: 'FTG-875',
    plazaName: 'FASTag Wallet Top-up (App Balance)',
    lane: 'Online Payment',
    date: '04 Oct 2026',
    time: '10:00 AM',
    amount: 2000,
    type: 'CREDIT',
    vehicleNumber: 'TN 38 AB 1234',
    status: 'SUCCESS',
  },
  {
    id: 'FTG-870',
    plazaName: 'Krishnagiri Toll Plaza',
    lane: 'Lane 06',
    date: '04 Oct 2026',
    time: '02:30 PM',
    amount: 165,
    type: 'DEBIT',
    vehicleNumber: 'TN 38 AB 1234',
    status: 'SUCCESS',
  },
  {
    id: 'FTG-864',
    plazaName: 'Thoppur Toll Plaza',
    lane: 'Lane 03',
    date: '04 Oct 2026',
    time: '12:15 PM',
    amount: 120,
    type: 'DEBIT',
    vehicleNumber: 'TN 38 AB 1234',
    status: 'SUCCESS',
  },
];

export const initialCallLogs: CallLogItem[] = [
  {
    id: 'CALL-01',
    contactName: 'Suresh Narayanan',
    role: 'Shipper',
    phoneNumber: '+91 94432 11223',
    callType: 'OUTGOING',
    date: 'Today',
    time: '10:40 AM',
    duration: '2m 14s',
    relatedTripNumber: 'TRP-2026-7041',
  },
  {
    id: 'CALL-02',
    contactName: 'Ramesh Kumar (Mechanic)',
    role: 'Mechanic',
    phoneNumber: '+91 98422 66778',
    callType: 'INCOMING',
    date: 'Today',
    time: '01:26 PM',
    duration: '1m 45s',
    relatedTripNumber: 'TRP-2026-7041',
  },
  {
    id: 'CALL-03',
    contactName: 'Haul360 24/7 Driver Support',
    role: 'Haul360 Support',
    phoneNumber: '1800-428-5360',
    callType: 'OUTGOING',
    date: '04 Oct 2026',
    time: '03:15 PM',
    duration: '4m 02s',
  },
  {
    id: 'CALL-04',
    contactName: 'Ganesan Traders',
    role: 'Shipper',
    phoneNumber: '+91 98432 55667',
    callType: 'MISSED',
    date: '04 Oct 2026',
    time: '08:50 AM',
    relatedTripNumber: 'TRP-2026-7038',
  },
];

export const initialDriverAlerts: DriverAlert[] = [
  {
    id: 'ALT-01',
    category: 'MECHANIC',
    title: 'Mechanic Assigned to Breakdown',
    message: 'Ramesh Kumar from Sundaram Auto Care is on the way (ETA 18 mins).',
    timestamp: 'Today, 01:25 PM',
    isRead: false,
    actionRoute: '/driver/breakdown/BRK-501',
    priority: 'HIGH',
  },
  {
    id: 'ALT-02',
    category: 'SHIPMENT',
    title: 'High-Match Return Load Available!',
    message: '96% Match return load from Chennai to Coimbatore (₹36,000). Place your bid now.',
    timestamp: 'Today, 11:30 AM',
    isRead: false,
    actionRoute: '/driver/return-load/RET-201',
    priority: 'MEDIUM',
  },
  {
    id: 'ALT-03',
    category: 'PAYMENT',
    title: 'Payment Received ₹34,500',
    message: 'Settlement for trip TRP-2026-7038 has been credited to your Passbook.',
    timestamp: '05 Oct 2026, 04:30 PM',
    isRead: true,
    actionRoute: '/driver/money/passbook',
    priority: 'LOW',
  },
  {
    id: 'ALT-04',
    category: 'FASTAG',
    title: 'FASTag Balance Notice',
    message: 'Current FASTag balance is ₹2,450. Adequate for ongoing NH-44 trip.',
    timestamp: 'Today, 09:00 AM',
    isRead: true,
    actionRoute: '/driver/fastag',
    priority: 'LOW',
  },
  {
    id: 'ALT-05',
    category: 'DOCUMENTS',
    title: 'Pollution Certificate Expiring Soon',
    message: 'Your PUC expires in 2 days. Renew and upload copy to maintain active fleet status.',
    timestamp: '04 Oct 2026',
    isRead: false,
    actionRoute: '/driver/documents',
    priority: 'HIGH',
  },
];

export const initialDriverReviews: DriverReview[] = [
  {
    id: 'REV-01',
    shipperName: 'Suresh Narayanan',
    company: 'Apex Industrial Parts Ltd.',
    rating: 5,
    date: '05 Oct 2026',
    comment: 'Arun is extremely reliable and punctual. Secured our machinery with great care.',
    tripNumber: 'TRP-2026-7038',
    route: 'Madurai → Bengaluru',
  },
  {
    id: 'REV-02',
    shipperName: 'Muruganandham V.',
    company: 'Madras Freight Forwarders',
    rating: 5,
    date: '24 Sep 2026',
    comment: 'Prompt delivery, clean truck, smooth communication throughout the journey.',
    tripNumber: 'TRP-2026-7029',
    route: 'Chennai → Coimbatore',
  },
  {
    id: 'REV-03',
    shipperName: 'Kavitha S.',
    company: 'Zenith Logistics Hub',
    rating: 4,
    date: '14 Sep 2026',
    comment: 'Good transit time. Slight delay at toll plaza but updated us proactively.',
    tripNumber: 'TRP-2026-6991',
    route: 'Salem → Hyderabad',
  },
];

export const driverFaqs = [
  {
    question: 'How do I place a bid on a shipment?',
    answer: 'Navigate to the Shipments tab, browse available loads or use filters. Tap on any shipment to inspect cargo details and route. Tap "Place Bid", enter your proposed rate (₹), specify arrival ETA, and submit. The shipper will review all bids and choose the best offer.',
  },
  {
    question: 'What happens when a shipper selects my bid?',
    answer: 'You will receive an instant assignment notification. You must tap "Accept" within the allotted time to confirm the booking. Once accepted, the shipment moves to your Trips tab and your status changes to BUSY.',
  },
  {
    question: 'How does the Return Load feature work?',
    answer: 'When you are completing or planning a trip, Haul360 matches you with return shipments originating near your destination that head back toward your home city or preferred corridor. This eliminates empty running kilometers and boosts your net earnings.',
  },
  {
    question: 'How do I report a breakdown and request a mechanic?',
    answer: 'Open Quick Actions on Home or within your active Trip and tap "Breakdown / Mechanic". Select the issue category (e.g. Engine, Tire, Brakes), severity, and confirm your location. Haul360 automatically notifies certified highway mechanics nearby. You can track their arrival and inspect repair status in real time.',
  },
  {
    question: 'When and how will I receive payment for a completed delivery?',
    answer: 'Shippers deposit payment into secure Haul360 escrow before trip start. Upon cargo delivery and digital POD confirmation, the funds are instantly released to your Account Balance in the Money section. You can withdraw to your verified bank account anytime via IMPS.',
  },
  {
    question: 'How do I recharge my FASTag and manage toll fees?',
    answer: 'Go to the FASTag screen from Home or Profile. You can check real-time balance, view toll plaza deductions, and top up via your Haul360 account balance or UPI in seconds.',
  },
  {
    question: 'How is my driver rating calculated?',
    answer: 'Your rating is the average of ratings provided by shippers after trip deliveries, combined with on-time delivery score and cargo safety metrics. New independent drivers start at 0 until their first completed rated shipment.',
  },
  {
    question: 'Can I decline an assignment after bidding?',
    answer: 'Yes, while in ASSIGNED state, you can decline if your availability or truck schedule has changed. However, once you have officially accepted the assignment, you are expected to complete the trip.',
  },
];
