export * from './transportOfficeMockData';

export const DRIVER_DECLINE_REASONS = [
  'Not available / Off duty',
  'Vehicle mechanical concern',
  'Personal emergency',
  'Route / Weather alert',
  'Exceeds daily driving limit',
  'Other reason',
];

export const BREAKDOWN_ISSUE_OPTIONS = [
  { id: 'Engine Problem', label: 'Engine Problem / Overheating', icon: 'speedometer-outline' },
  { id: 'Tyre Problem', label: 'Tyre Puncture / Blowout', icon: 'disc-outline' },
  { id: 'Battery Problem', label: 'Battery / Alternator Dead', icon: 'flash-outline' },
  { id: 'Electrical Problem', label: 'Lighting / Wiring / ECU Fault', icon: 'hardware-chip-outline' },
  { id: 'Accident', label: 'Accident / Collision / Road Damage', icon: 'warning-outline' },
  { id: 'Fuel Problem', label: 'Fuel Leak / Clogged Injector', icon: 'water-outline' },
  { id: 'Other', label: 'Brakes / Suspension / Other', icon: 'construct-outline' },
];
