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
  initialTransportOffice,
  initialOfficeDrivers,
  initialOfficeVehicles,
  initialOfficeShipments,
  mockNearbyMechanics,
  initialBreakdowns,
  initialOfficeNotifications,
  initialDriverNotifications,
  initialHistoryItems,
} from '@/constants/transportOfficeMockData';

interface AddDriverInput {
  name: string;
  phone: string;
  email: string;
  age: number;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  documentStatus?: 'VERIFIED' | 'PENDING' | 'EXPIRED';
}

interface AddVehicleInput {
  vehicleNumber: string;
  vehicleType: string;
  model: string;
  capacityKg: number;
  fuelType: 'Diesel' | 'CNG' | 'Electric';
  rcNumber: string;
  insuranceStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  permitStatus: 'NATIONAL_PERMIT' | 'STATE_PERMIT';
}

interface ReportBreakdownInput {
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
  currentDriverUser: OfficeDriver | null;

  // Office Actions
  updateOfficeProfile: (updated: Partial<TransportOffice>) => void;
  addDriver: (input: AddDriverInput) => { driver: OfficeDriver; tempPassword: string };
  addVehicle: (input: AddVehicleInput) => OfficeVehicle;
  markVehicleMaintenance: (vehicleId: string, isMaintenance: boolean) => void;
  assignDriverAndVehicle: (
    shipmentId: string,
    driverId: string,
    vehicleId: string
  ) => { success: boolean; error?: string };
  requestMechanic: (breakdownId: string, mechanicId: string) => void;
  progressMechanicStatus: (breakdownId: string) => void;
  replaceVehicleForBreakdown: (breakdownId: string, newVehicleId: string) => { success: boolean; error?: string };
  markOfficeNotificationRead: (id: string) => void;

  // Driver Actions
  setCurrentDriverUser: (driver: OfficeDriver | null) => void;
  loginDriverMock: (identifier: string, pass: string) => { success: boolean; driver?: OfficeDriver; isFirstLogin?: boolean; error?: string };
  updateDriverPassword: (driverId: string, newPass: string) => boolean;
  acceptAssignment: (shipmentId: string) => void;
  declineAssignment: (shipmentId: string, reason: string) => void;
  startTrip: (shipmentId: string) => void;
  advanceTripStage: (shipmentId: string) => void;
  reportBreakdown: (input: ReportBreakdownInput) => BreakdownIncident;
  resumeTripAfterBreakdown: (breakdownId: string) => void;
  markDriverNotificationRead: (id: string) => void;

  // Getters
  getDriverById: (id: string) => OfficeDriver | undefined;
  getVehicleById: (id: string) => OfficeVehicle | undefined;
  getShipmentById: (id: string) => OfficeShipment | undefined;
  getBreakdownById: (id: string) => BreakdownIncident | undefined;
  getMechanicById: (id: string) => MockNearbyMechanic | undefined;
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
      documentStatus: input.documentStatus || 'VERIFIED',
      isFirstLogin: true,
      tempPassword,
      availability: 'AVAILABLE',
      currentShipmentId: null,
      currentVehicleId: null,
      completedTripsCount: 0,
      rating: 5.0,
      experienceYears: Math.max(1, input.age - 22),
      joinedDate: 'Just now',
    };

    setDrivers((prev) => [newDriver, ...prev]);

    // Create notification
    const newNotif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Driver Account Created',
      message: `${newDriver.name} added (ID: ${driverId}). Temporary password generated.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
    };
    setOfficeNotifications((prev) => [newNotif, ...prev]);

    return { driver: newDriver, tempPassword };
  }, [drivers.length, office.id]);

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
      insuranceStatus: input.insuranceStatus,
      permitStatus: input.permitStatus,
      status: 'AVAILABLE',
      currentDriverId: null,
      currentShipmentId: null,
      lastMaintenanceDate: 'Inspection Valid',
    };

    setVehicles((prev) => [newVehicle, ...prev]);

    const newNotif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Vehicle Added to Fleet',
      message: `${newVehicle.vehicleNumber} (${newVehicle.vehicleType}) registered successfully.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
    };
    setOfficeNotifications((prev) => [newNotif, ...prev]);

    return newVehicle;
  }, [vehicles.length, office.id]);

  const markVehicleMaintenance = useCallback((vehicleId: string, isMaintenance: boolean) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            status: isMaintenance ? 'MAINTENANCE' : 'AVAILABLE',
          };
        }
        return v;
      })
    );
  }, []);

  const assignDriverAndVehicle = useCallback((
    shipmentId: string,
    driverId: string,
    vehicleId: string
  ) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    const driver = drivers.find((d) => d.id === driverId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (!shipment) return { success: false, error: 'Shipment not found.' };
    if (!driver) return { success: false, error: 'Driver not found.' };
    if (!vehicle) return { success: false, error: 'Vehicle not found.' };

    if (driver.availability !== 'AVAILABLE') {
      return { success: false, error: `Driver ${driver.name} is currently ${driver.availability.toLowerCase()}.` };
    }

    if (vehicle.status !== 'AVAILABLE') {
      return { success: false, error: `Vehicle ${vehicle.vehicleNumber} is currently ${vehicle.status.toLowerCase()}.` };
    }

    if (vehicle.capacityKg < shipment.cargoWeightKg) {
      return {
        success: false,
        error: `Vehicle capacity (${vehicle.capacityKg.toLocaleString()} KG) is less than shipment weight (${shipment.cargoWeightKg.toLocaleString()} KG).`,
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
            timeline: s.timeline.map((item, idx) => {
              if (idx === 1) {
                return {
                  ...item,
                  completed: true,
                  time: 'Just now',
                  description: `${driver.name} • ${vehicle.vehicleNumber}`,
                };
              }
              return item;
            }),
          };
        }
        return s;
      })
    );

    // Update Driver: state changes to ASSIGNMENT_PENDING (assigned to this shipment & vehicle)
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

    // Update Vehicle: state changes to ASSIGNED
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

    // Notifications
    const driverNotif: DriverNotification = {
      id: `NOTIF-D-${Date.now()}`,
      title: 'New Shipment Assignment',
      message: `You have been assigned to Shipment #${shipment.id} (${shipment.origin} → ${shipment.destination}) with Vehicle ${vehicle.vehicleNumber}.`,
      time: 'Just now',
      type: 'ASSIGNMENT',
      read: false,
      targetId: shipment.id,
    };
    setDriverNotifications((prev) => [driverNotif, ...prev]);

    const officeNotif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Assignment Dispatched',
      message: `Assigned ${driver.name} with vehicle ${vehicle.vehicleNumber} to #${shipment.id}. Awaiting driver acceptance.`,
      time: 'Just now',
      type: 'ASSIGNMENT',
      read: false,
      targetId: shipment.id,
    };
    setOfficeNotifications((prev) => [officeNotif, ...prev]);

    return { success: true };
  }, [shipments, drivers, vehicles]);

  const acceptAssignment = useCallback((shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment) return;

    const driverId = shipment.assignedDriverId;
    const vehicleId = shipment.assignedVehicleId;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'ACCEPTED',
            tripStage: 'ASSIGNED',
            timeline: s.timeline.map((item, idx) => {
              if (idx === 2) {
                return {
                  ...item,
                  completed: true,
                  time: 'Just now',
                  description: 'Accepted by driver',
                };
              }
              return item;
            }),
          };
        }
        return s;
      })
    );

    if (driverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, availability: 'BUSY' } : d))
      );
    }

    if (vehicleId) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: 'IN_TRIP' } : v))
      );
    }

    const driver = drivers.find((d) => d.id === driverId);
    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Assignment Accepted',
      message: `${driver?.name || 'Driver'} accepted Shipment #${shipment.id}. Ready for pickup.`,
      time: 'Just now',
      type: 'TRIP',
      read: false,
      targetId: shipment.id,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);
  }, [shipments, drivers]);

  const declineAssignment = useCallback((shipmentId: string, reason: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment) return;

    const driverId = shipment.assignedDriverId;
    const vehicleId = shipment.assignedVehicleId;
    const driver = drivers.find((d) => d.id === driverId);

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'PENDING_ASSIGNMENT',
            assignedDriverId: null,
            assignedVehicleId: null,
            declineReason: reason,
            timeline: s.timeline.map((item, idx) => {
              if (idx === 1) {
                return { ...item, completed: false, time: '--', description: 'Re-assignment required' };
              }
              return item;
            }),
          };
        }
        return s;
      })
    );

    if (driverId) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId
            ? { ...d, availability: 'AVAILABLE', currentShipmentId: null, currentVehicleId: null }
            : d
        )
      );
    }

    if (vehicleId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, status: 'AVAILABLE', currentDriverId: null, currentShipmentId: null }
            : v
        )
      );
    }

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Assignment Declined',
      message: `${driver?.name || 'Driver'} declined #${shipment.id}. Reason: ${reason}. Please re-assign.`,
      time: 'Just now',
      type: 'ASSIGNMENT',
      read: false,
      targetId: shipment.id,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);
  }, [shipments, drivers]);

  const startTrip = useCallback((shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'IN_TRANSIT',
            tripStage: 'IN_TRANSIT',
          };
        }
        return s;
      })
    );

    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment?.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === shipment.assignedDriverId ? { ...d, availability: 'BUSY' } : d))
      );
    }
    if (shipment?.assignedVehicleId) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === shipment.assignedVehicleId ? { ...v, status: 'IN_TRIP' } : v))
      );
    }

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Trip Started',
      message: `Shipment #${shipmentId} (${shipment?.origin} → ${shipment?.destination}) is in progress on highway.`,
      time: 'Just now',
      type: 'TRIP',
      read: false,
      targetId: shipmentId,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);
  }, [shipments]);

  const advanceTripStage = useCallback((shipmentId: string) => {
    const s = shipments.find((item) => item.id === shipmentId);
    if (!s) return;

    if (s.status === 'ACCEPTED') {
      startTrip(shipmentId);
      return;
    }

    if (s.status === 'IN_TRANSIT') {
      // Advance to DELIVERED
      setShipments((prev) =>
        prev.map((item) => {
          if (item.id === shipmentId) {
            return {
              ...item,
              status: 'DELIVERED',
              tripStage: 'DELIVERED',
            };
          }
          return item;
        })
      );

      // Release driver and vehicle
      if (s.assignedDriverId) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === s.assignedDriverId
              ? {
                  ...d,
                  availability: 'AVAILABLE',
                  currentShipmentId: null,
                  currentVehicleId: null,
                  completedTripsCount: d.completedTripsCount + 1,
                }
              : d
          )
        );
      }

      if (s.assignedVehicleId) {
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === s.assignedVehicleId
              ? {
                  ...v,
                  status: 'AVAILABLE',
                  currentDriverId: null,
                  currentShipmentId: null,
                }
              : v
          )
        );
      }

      // Add to History
      const hist: HistoryItem = {
        id: `HIST-${Date.now()}`,
        type: 'SHIPMENT',
        title: `Shipment #${s.id} Delivered`,
        subtitle: `${s.origin} → ${s.destination} • ${s.cargoType} (${s.cargoWeightKg.toLocaleString()} KG)`,
        date: 'Today',
        status: 'Delivered',
        route: `${s.origin} → ${s.destination}`,
        driverName: drivers.find((d) => d.id === s.assignedDriverId)?.name,
        vehicleNumber: vehicles.find((v) => v.id === s.assignedVehicleId)?.vehicleNumber,
      };
      setHistoryItems((prev) => [hist, ...prev]);

      const notif: OfficeNotification = {
        id: `NOTIF-O-${Date.now()}`,
        title: 'Shipment Delivered',
        message: `Shipment #${s.id} delivered successfully. Driver and vehicle are now available.`,
        time: 'Just now',
        type: 'TRIP',
        read: false,
        targetId: s.id,
      };
      setOfficeNotifications((prev) => [notif, ...prev]);
    }
  }, [shipments, drivers, vehicles, startTrip]);

  const reportBreakdown = useCallback((input: ReportBreakdownInput) => {
    const driver = drivers.find((d) => d.id === input.driverId);
    const vehicle = vehicles.find((v) => v.id === input.vehicleId);
    const shipment = shipments.find((s) => s.id === input.shipmentId);

    const breakdownId = `BD-${String(breakdowns.length + 1).padStart(3, '0')}`;

    const newBreakdown: BreakdownIncident = {
      id: breakdownId,
      officeId: office.id,
      driverId: input.driverId,
      driverName: driver?.name || 'Driver',
      driverPhone: driver?.phone || '9876543210',
      vehicleId: input.vehicleId,
      vehicleNumber: vehicle?.vehicleNumber || 'Vehicle',
      vehicleType: vehicle?.vehicleType || '10-Wheeler',
      shipmentId: input.shipmentId,
      route: shipment ? `${shipment.origin} → ${shipment.destination}` : 'In Transit',
      issueType: input.issueType,
      description: input.description,
      location: input.location,
      status: 'MECHANIC_REQUIRED',
      reportedAt: 'Just now',
    };

    setBreakdowns((prev) => [newBreakdown, ...prev]);

    // Office Alert
    const officeAlert: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: '🚨 Breakdown Reported',
      message: `${newBreakdown.driverName} reported ${newBreakdown.issueType} on ${newBreakdown.vehicleNumber} at ${newBreakdown.location}.`,
      time: 'Just now',
      type: 'BREAKDOWN',
      read: false,
      targetId: breakdownId,
    };
    setOfficeNotifications((prev) => [officeAlert, ...prev]);

    // Driver confirmation
    const driverAlert: DriverNotification = {
      id: `NOTIF-D-${Date.now()}`,
      title: 'Breakdown Request Transmitted',
      message: 'Your transport office dispatch has been notified. Stand by for mechanic coordination.',
      time: 'Just now',
      type: 'BREAKDOWN',
      read: false,
      targetId: breakdownId,
    };
    setDriverNotifications((prev) => [driverAlert, ...prev]);

    return newBreakdown;
  }, [drivers, vehicles, shipments, breakdowns.length, office.id]);

  const requestMechanic = useCallback((breakdownId: string, mechanicId: string) => {
    const mechanic = mechanics.find((m) => m.id === mechanicId);
    const breakdown = breakdowns.find((b) => b.id === breakdownId);
    if (!breakdown || !mechanic) return;

    setBreakdowns((prev) =>
      prev.map((b) => {
        if (b.id === breakdownId) {
          return {
            ...b,
            status: 'MECHANIC_REQUESTED',
            assignedMechanicId: mechanic.id,
            assignedMechanicName: mechanic.name,
            mechanicEtaMinutes: mechanic.etaMinutes,
          };
        }
        return b;
      })
    );

    const driverNotif: DriverNotification = {
      id: `NOTIF-D-${Date.now()}`,
      title: 'Mechanic Assigned',
      message: `${mechanic.name} (${mechanic.workshopName}) has been requested. ETA: ~${mechanic.etaMinutes} mins.`,
      time: 'Just now',
      type: 'MECHANIC',
      read: false,
      targetId: breakdownId,
    };
    setDriverNotifications((prev) => [driverNotif, ...prev]);

    const officeNotif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Mechanic Requested',
      message: `Request sent to ${mechanic.name} for Breakdown #${breakdownId}. ETA: ~${mechanic.etaMinutes} mins.`,
      time: 'Just now',
      type: 'MECHANIC',
      read: false,
      targetId: breakdownId,
    };
    setOfficeNotifications((prev) => [officeNotif, ...prev]);
  }, [breakdowns, mechanics]);

  const progressMechanicStatus = useCallback((breakdownId: string) => {
    const STAGES: BreakdownStatus[] = [
      'MECHANIC_REQUESTED',
      'MECHANIC_ACCEPTED',
      'MECHANIC_ON_WAY',
      'MECHANIC_ARRIVED',
      'DIAGNOSING',
      'REPAIRING',
      'REPAIRED',
      'RESOLVED',
    ];

    setBreakdowns((prev) =>
      prev.map((b) => {
        if (b.id !== breakdownId) return b;

        const currentIdx = STAGES.indexOf(b.status);
        const nextStatus = currentIdx >= 0 && currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : 'RESOLVED';

        let resolvedAt = b.resolvedAt;
        if (nextStatus === 'REPAIRED' || nextStatus === 'RESOLVED') {
          resolvedAt = 'Just now';
        }

        return {
          ...b,
          status: nextStatus,
          resolvedAt,
        };
      })
    );

    const breakdown = breakdowns.find((b) => b.id === breakdownId);
    if (!breakdown) return;

    const notif: OfficeNotification = {
      id: `NOTIF-O-${Date.now()}`,
      title: 'Mechanic Update',
      message: `Breakdown #${breakdownId} status updated for vehicle ${breakdown.vehicleNumber}.`,
      time: 'Just now',
      type: 'MECHANIC',
      read: false,
      targetId: breakdownId,
    };
    setOfficeNotifications((prev) => [notif, ...prev]);
  }, [breakdowns]);

  const replaceVehicleForBreakdown = useCallback((breakdownId: string, newVehicleId: string) => {
    const breakdown = breakdowns.find((b) => b.id === breakdownId);
    const newVehicle = vehicles.find((v) => v.id === newVehicleId);
    if (!breakdown || !newVehicle) return { success: false, error: 'Record not found' };

    const shipment = shipments.find((s) => s.id === breakdown.shipmentId);
    if (shipment && newVehicle.capacityKg < shipment.cargoWeightKg) {
      return {
        success: false,
        error: `Replacement vehicle capacity (${newVehicle.capacityKg.toLocaleString()} KG) is less than cargo weight (${shipment.cargoWeightKg.toLocaleString()} KG).`,
      };
    }

    const oldVehicleId = breakdown.vehicleId;

    // Update old vehicle -> MAINTENANCE
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === oldVehicleId) {
          return {
            ...v,
            status: 'MAINTENANCE',
            currentDriverId: null,
            currentShipmentId: null,
          };
        }
        if (v.id === newVehicleId) {
          return {
            ...v,
            status: 'IN_TRIP',
            currentDriverId: breakdown.driverId,
            currentShipmentId: breakdown.shipmentId,
          };
        }
        return v;
      })
    );

    // Update Driver currentVehicleId
    setDrivers((prev) =>
      prev.map((d) => (d.id === breakdown.driverId ? { ...d, currentVehicleId: newVehicleId } : d))
    );

    // Update Shipment assignedVehicleId
    setShipments((prev) =>
      prev.map((s) => (s.id === breakdown.shipmentId ? { ...s, assignedVehicleId: newVehicleId } : s))
    );

    // Update Breakdown
    setBreakdowns((prev) =>
      prev.map((b) => {
        if (b.id === breakdownId) {
          return {
            ...b,
            status: 'RESOLVED',
            resolvedAt: 'Vehicle Replaced',
            needsReplacementVehicle: false,
          };
        }
        return b;
      })
    );

    const driverNotif: DriverNotification = {
      id: `NOTIF-D-${Date.now()}`,
      title: 'Replacement Vehicle Assigned',
      message: `Your transport office assigned replacement vehicle ${newVehicle.vehicleNumber} (${newVehicle.vehicleType}) for Shipment #${breakdown.shipmentId}.`,
      time: 'Just now',
      type: 'SYSTEM',
      read: false,
      targetId: breakdown.shipmentId,
    };
    setDriverNotifications((prev) => [driverNotif, ...prev]);

    return { success: true };
  }, [breakdowns, vehicles, shipments]);

  const resumeTripAfterBreakdown = useCallback((breakdownId: string) => {
    setBreakdowns((prev) =>
      prev.map((b) => (b.id === breakdownId ? { ...b, status: 'RESOLVED', resolvedAt: 'Just now' } : b))
    );
  }, []);

  const loginDriverMock = useCallback((identifier: string, pass: string) => {
    const clean = identifier.trim().toLowerCase();
    const driver = drivers.find(
      (d) =>
        d.id.toLowerCase() === clean ||
        d.phone.replace(/\D/g, '') === clean.replace(/\D/g, '') ||
        d.email.toLowerCase() === clean
    );

    if (!driver) {
      return { success: false, error: 'Driver account not found. Please contact your Transport Office.' };
    }

    if (driver.isFirstLogin) {
      if (driver.tempPassword && pass !== driver.tempPassword) {
        return { success: false, error: 'Invalid temporary password provided by your Transport Office.' };
      }
      setCurrentDriverUserState(driver);
      return { success: true, driver, isFirstLogin: true };
    }

    if (pass.length < 6) {
      return { success: false, error: 'Invalid password. Must be at least 6 characters.' };
    }

    setCurrentDriverUserState(driver);
    return { success: true, driver, isFirstLogin: false };
  }, [drivers]);

  const updateDriverPassword = useCallback((driverId: string, _newPass: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          return {
            ...d,
            isFirstLogin: false,
            tempPassword: undefined,
          };
        }
        return d;
      })
    );
    return true;
  }, []);

  const markOfficeNotificationRead = useCallback((id: string) => {
    setOfficeNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markDriverNotificationRead = useCallback((id: string) => {
    setDriverNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const getDriverById = useCallback((id: string) => drivers.find((d) => d.id === id), [drivers]);
  const getVehicleById = useCallback((id: string) => vehicles.find((v) => v.id === id), [vehicles]);
  const getShipmentById = useCallback((id: string) => shipments.find((s) => s.id === id), [shipments]);
  const getBreakdownById = useCallback((id: string) => breakdowns.find((b) => b.id === id), [breakdowns]);
  const getMechanicById = useCallback((id: string) => mechanics.find((m) => m.id === id), [mechanics]);

  const value = useMemo<TransportOfficeContextType>(() => ({
    office,
    drivers,
    vehicles,
    shipments,
    breakdowns,
    mechanics,
    officeNotifications,
    driverNotifications,
    historyItems,
    currentDriverUser,
    updateOfficeProfile,
    addDriver,
    addVehicle,
    markVehicleMaintenance,
    assignDriverAndVehicle,
    requestMechanic,
    progressMechanicStatus,
    replaceVehicleForBreakdown,
    markOfficeNotificationRead,
    setCurrentDriverUser,
    loginDriverMock,
    updateDriverPassword,
    acceptAssignment,
    declineAssignment,
    startTrip,
    advanceTripStage,
    reportBreakdown,
    resumeTripAfterBreakdown,
    markDriverNotificationRead,
    getDriverById,
    getVehicleById,
    getShipmentById,
    getBreakdownById,
    getMechanicById,
  }), [
    office,
    drivers,
    vehicles,
    shipments,
    breakdowns,
    mechanics,
    officeNotifications,
    driverNotifications,
    historyItems,
    currentDriverUser,
    updateOfficeProfile,
    addDriver,
    addVehicle,
    markVehicleMaintenance,
    assignDriverAndVehicle,
    requestMechanic,
    progressMechanicStatus,
    replaceVehicleForBreakdown,
    markOfficeNotificationRead,
    setCurrentDriverUser,
    loginDriverMock,
    updateDriverPassword,
    acceptAssignment,
    declineAssignment,
    startTrip,
    advanceTripStage,
    reportBreakdown,
    resumeTripAfterBreakdown,
    markDriverNotificationRead,
    getDriverById,
    getVehicleById,
    getShipmentById,
    getBreakdownById,
    getMechanicById,
  ]);

  return (
    <TransportOfficeContext.Provider value={value}>
      {children}
    </TransportOfficeContext.Provider>
  );
};

export const useTransportOffice = (): TransportOfficeContextType => {
  const context = useContext(TransportOfficeContext);
  if (!context) {
    throw new Error('useTransportOffice must be used within a TransportOfficeProvider');
  }
  return context;
};
