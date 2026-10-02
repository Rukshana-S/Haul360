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
