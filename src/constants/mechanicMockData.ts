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
  description?: string;
  timeRequested: string;
}

export interface RepairJob {
  id: string;
  vehicle: string;
  driver: string;
  service: string;
  status: 'Received' | 'Diagnosing' | 'Repairing' | 'Ready';
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
    vehicle: 'Pneumatic Hose Rupture',
    vehicleType: 'Eicher Pro 6028',
    driver: 'Manpreet Singh',
    service: 'Pay on Site',
    distance: '6.8 km',
    location: 'NH-48 Corridor',
    amount: '₹1,950',
    status: 'PENDING',
    timeRequested: '12 mins ago',
  },
  {
    id: 'REQ-003',
    vehicle: 'Battery Jumpstart & Alternator Check',
    vehicleType: 'Ashok Leyland 4220',
    driver: 'Anup Sharma',
    service: 'Fast UPI',
    distance: '8.1 km',
    location: 'Bypass Road',
    amount: '₹1,200',
    status: 'PENDING',
    timeRequested: '18 mins ago',
  }
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
