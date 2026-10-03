export interface MechanicRequest {
  id: string;
  vehicle: string;
  vehicleType: string;
  driver: string;
  service: string;
  distance: string;
  location: string;
  amount: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  isEmergency?: boolean;
  isScheduled?: boolean;
  scheduledTime?: string;
  description?: string;
  timeRequested: string;
}

export interface RepairJob {
  id: string;
  vehicle: string;
  driver: string;
  service: string;
  status: 'Received' | 'Diagnosing' | 'Repairing' | 'Ready' | 'Completed';
  progress: number;
  location: string;
  amount: string;
  startTime: string;
  timeElapsed: string;
}

export interface Earning {
  id: string;
  service: string;
  amount: string;
  status: string;
  date: string;
}

export interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  service?: string;
}

export interface MechanicProfileData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  workshopName: string;
  workshopAddress: string;
  city: string;
  state: string;
  pincode: string;
  yearsOfExperience: string;
  mechanicType: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  certificateStatus: string;
  rating: number;
  totalReviews: number;
  completedRepairsCount: number;
  services: string[];
  vehicleTypes: string[];
  bankName: string;
  bankAccountMasked: string;
  coverageRadius: string;
}

export interface ServiceHistoryItem {
  id: string;
  vehicle: string;
  vehicleType: string;
  driver: string;
  service: string;
  date: string;
  location: string;
  amount: string;
  rating: number;
  status: 'COMPLETED' | 'SETTLED';
  category: 'All' | 'Pneumatics' | 'Electrical' | 'Engine' | 'SOS';
}

export const mockRequests: MechanicRequest[] = [
  {
    id: 'REQ-001',
    vehicle: 'Tata Signa 4825.TK',
    vehicleType: '25T Container',
    driver: 'Vikramaditya Rao',
    service: 'Severe airbrake pressure leak and steering lockup on expressway shoulder.',
    distance: '4.2 km away',
    location: 'NH-48 Km Stone 142 (Near Shoolagiri Toll)',
    amount: '₹3,800',
    status: 'PENDING',
    isEmergency: true,
    timeRequested: '04:16',
  },
  {
    id: 'REQ-002',
    vehicle: 'Eicher Pro 6028',
    vehicleType: '28T Heavy Cargo',
    driver: 'Manpreet Singh',
    service: 'Pneumatic Hose Rupture & Pressure Valve Replacement',
    distance: '6.8 km',
    location: 'NH-48 Corridor Km 89',
    amount: '₹1,950',
    status: 'PENDING',
    isScheduled: true,
    scheduledTime: 'Today, 02:30 PM',
    timeRequested: '12 mins ago',
  },
  {
    id: 'REQ-003',
    vehicle: 'Ashok Leyland 4220',
    vehicleType: 'Multi-axle Trailer',
    driver: 'Anup Sharma',
    service: 'Battery Jumpstart & Alternator Circuit Diagnostic',
    distance: '8.1 km',
    location: 'Bypass Road Truck Hub',
    amount: '₹1,200',
    status: 'PENDING',
    isScheduled: true,
    scheduledTime: 'Today, 04:00 PM',
    timeRequested: '18 mins ago',
  },
  {
    id: 'REQ-004',
    vehicle: 'BharatBenz 3528C',
    vehicleType: 'Tipper Multi-axle',
    driver: 'Gurvinder Singh',
    service: 'Engine Overheating & Coolant Radiator Pipe Rupture',
    distance: '3.1 km away',
    location: 'NH-48 Expressway Flyover Margin',
    amount: '₹4,200',
    status: 'PENDING',
    isEmergency: true,
    timeRequested: '08:42',
  },
  {
    id: 'REQ-005',
    vehicle: 'Mahindra Blazo X 49',
    vehicleType: '49T Heavy Hauler',
    driver: 'Sanjay Deshmukh',
    service: 'Scheduled Brake Pad Inspection & Hub Greasing',
    distance: '11.5 km',
    location: 'NH-48 Toll Plaza Logistics Park',
    amount: '₹2,100',
    status: 'PENDING',
    isScheduled: true,
    scheduledTime: 'Tomorrow, 10:00 AM',
    timeRequested: '35 mins ago',
  },
  {
    id: 'REQ-006',
    vehicle: 'Tata Prima 2830.K',
    vehicleType: 'Heavy Dumper',
    driver: 'Naseer Khan',
    service: 'Differential Oil Flush & Filter Replacement',
    distance: '14.0 km',
    location: 'Industrial Freight Yard Gate 3',
    amount: '₹2,800',
    status: 'PENDING',
    isScheduled: true,
    scheduledTime: 'Tomorrow, 01:30 PM',
    timeRequested: '1 hour ago',
  },
  {
    id: 'REQ-007',
    vehicle: 'Volvo FM 420 8x4',
    vehicleType: 'Puller Tractor',
    driver: 'Rajinder Kumar',
    service: 'Air Suspension Leveling Valve Calibration',
    distance: '5.4 km',
    location: 'NH-48 Highway Service Station',
    amount: '₹5,600',
    status: 'COMPLETED',
    timeRequested: 'Yesterday, 05:15 PM',
  },
];

export const mockRepairs: RepairJob[] = [
  {
    id: 'REP-8821',
    vehicle: 'BharatBenz 2823C Multi-axle',
    driver: 'Rajesh Singh',
    service: 'Alternate Alternator Belt Replacement',
    status: 'Diagnosing',
    progress: 35,
    location: 'Dhabha Halt, Manor Bypass (Km 78)',
    amount: '₹2,400',
    startTime: '10:00 AM',
    timeElapsed: '24 mins elapsed',
  }
];

export const mockEarnings: Earning[] = [
  { id: 'E-1', service: 'Engine Repair', amount: '₹3,500', status: 'Completed', date: 'Today, 11:30 AM' },
  { id: 'E-2', service: 'Brake Service', amount: '₹1,800', status: 'Completed', date: 'Yesterday, 04:15 PM' },
  { id: 'E-3', service: 'Tyre Replacement', amount: '₹4,500', status: 'Completed', date: '28 Sep 2026' },
];

export const mockReviews: Review[] = [
  { id: 'R-1', customer: 'Ramesh Transport Corp', rating: 5, comment: 'Very fast and professional service. Saved our trip!', date: 'Today' },
  { id: 'R-2', customer: 'Suresh Kumar', rating: 4, comment: 'Good knowledge of airbrakes. Reached on time.', date: 'Yesterday' },
];

export const mockDetailedReviews: Review[] = [
  {
    id: 'REV-01',
    customer: 'Ramesh Transport Corp (Fleet #402)',
    rating: 5,
    service: 'Air Brake Booster & Dual Valve Overhaul',
    comment: 'Super fast roadside response near Shoolagiri toll. Diagnosed the airbrake pressure leak in 10 minutes and had our 25T container rolling safely.',
    date: 'Today, 09:30 AM',
  },
  {
    id: 'REV-02',
    customer: 'Suresh Kumar (National Logistics)',
    rating: 5,
    service: 'Pneumatic Hose Rupture & Fitting',
    comment: 'Expert mechanic. Arrived with full diagnostic OBD scanner and replaced pneumatic hose quickly on NH-48 corridor.',
    date: 'Yesterday, 04:15 PM',
  },
  {
    id: 'REV-03',
    customer: 'Balwant Singh (Northern Express Freight)',
    rating: 4,
    service: 'BS-VI DEF Injector Diagnostic',
    comment: 'Good knowledge of BS-VI DEF injector circuits. Cleared error codes and restored engine power on highway shoulder.',
    date: '28 Sep 2026',
  },
  {
    id: 'REV-04',
    customer: 'Deccan Cargo Movers',
    rating: 5,
    service: '50T Hydraulic Lift & Hub Greasing',
    comment: 'Handled 50T hydraulic jack lift and dual hub greasing seamlessly. Extremely professional and courteous.',
    date: '24 Sep 2026',
  },
  {
    id: 'REV-05',
    customer: 'Gurvinder Singh (Express Logistics)',
    rating: 5,
    service: 'Alternator Belt Replacement',
    comment: 'Saved our delivery timeline during a midnight alternator belt breakdown. Top quality workmanship.',
    date: '20 Sep 2026',
  },
];

export const mockServiceHistory: ServiceHistoryItem[] = [
  {
    id: 'REP-8941',
    vehicle: 'BharatBenz 2823C',
    vehicleType: '28T Heavy Cargo',
    driver: 'Harpreet Sandhu (Punjab Roadways)',
    service: 'Air Brake Booster Leak & Valve Overhaul',
    date: 'Today, 04:30 PM',
    location: 'NH-48 Km Stone 142 (Near Shoolagiri Toll)',
    amount: '₹5,200',
    rating: 5.0,
    status: 'SETTLED',
    category: 'Pneumatics',
  },
  {
    id: 'REP-8910',
    vehicle: 'Eicher Pro 6035',
    vehicleType: 'Multi-axle Trailer',
    driver: 'Amit Yadav (Balaji Logistics)',
    service: 'Alternator Cable Short Circuit & Fuse Replacement',
    date: 'Yesterday, 02:15 PM',
    location: 'Bypass Road Truck Hub Km 89',
    amount: '₹3,150',
    rating: 4.8,
    status: 'SETTLED',
    category: 'Electrical',
  },
  {
    id: 'REP-8874',
    vehicle: 'Tata Prima 3530.K',
    vehicleType: 'Heavy Dumper',
    driver: 'Rajesh Singh (Express Haulage)',
    service: 'Clutch Slave Cylinder Hydraulic Bleed',
    date: '3 days ago',
    location: 'NH-48 Expressway Flyover Margin',
    amount: '₹4,800',
    rating: 5.0,
    status: 'SETTLED',
    category: 'SOS',
  },
  {
    id: 'REP-8820',
    vehicle: 'Mahindra Blazo X 49',
    vehicleType: '49T Heavy Hauler',
    driver: 'Sanjay Deshmukh (Western Freight)',
    service: 'Engine Coolant Hose Rupture & Radiator Flush',
    date: '25 Sep 2026',
    location: 'Logistics Park Gate 4, NH-48 Corridor',
    amount: '₹3,800',
    rating: 4.9,
    status: 'SETTLED',
    category: 'Engine',
  },
  {
    id: 'REP-8792',
    vehicle: 'Volvo FM 420 8x4',
    vehicleType: 'Puller Tractor',
    driver: 'Rajinder Kumar (Globe Trans)',
    service: 'Air Suspension Leveling Valve Calibration',
    date: '22 Sep 2026',
    location: 'Highway Service Yard Km 104',
    amount: '₹5,600',
    rating: 5.0,
    status: 'SETTLED',
    category: 'Pneumatics',
  },
];

export const defaultMechanicProfile: MechanicProfileData = {
  firstName: 'Ramesh',
  lastName: 'Verma',
  mobile: '9876543210',
  email: 'ramesh.verma@haul360.in',
  workshopName: 'Verma Commercial Fleet Hub & Mobile Rescue',
  workshopAddress: 'Shop 14, Haul360 Commercial Fleet Plaza, NH-48 Sector 34',
  city: 'Gurugram',
  state: 'Haryana',
  pincode: '122001',
  yearsOfExperience: '12+ Years',
  mechanicType: 'Master Diesel & Pneumatics Specialist',
  verificationStatus: 'VERIFIED',
  certificateStatus: 'Certified Master Commercial Technician (CMCT-IV)',
  rating: 4.9,
  totalReviews: 124,
  completedRepairsCount: 1420,
  services: [
    'Engine & Powertrain Diagnostics',
    'Air Brakes & Pneumatic Overhaul',
    'Heavy Electricals & Alternators',
    'Hydraulic Steering & Suspension',
    'Tyre Replacement & 50T Jacking',
    'BS-VI DEF & Exhaust SCR Service'
  ],
  vehicleTypes: [
    '16-22 Wheeler Multi-Axle',
    'Heavy Dumpers & Tippers',
    'Tractor Trailers & Pullers',
    'LCVs & Cargo Vans',
    'Commercial Buses'
  ],
  bankName: 'HDFC Bank Commercial A/c',
  bankAccountMasked: '•••• •••• •••• 4029',
  coverageRadius: '35 km Patrol Ring',
};

export const mechanicProfile = {
  name: 'Ramesh C. Verma',
  title: 'Master Diesel & Airbrake Specialist',
  rating: 4.9,
  repairs: '280+ roadside repairs',
  hub: 'NH-48 Sector 34 Hub',
  stats: {
    requests: { today: 14, new: 3 },
    activeJobs: 1,
    activeDistance: '3.2 km',
    completed: 128,
    completionRate: '98.6% SLA',
    dailyEarned: '₹6,450',
  }
};
