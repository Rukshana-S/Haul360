import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OfficeShipment, TripStage } from '@/constants/transportOfficeMockData';

interface RouteWaypoint {
  id: string;
  name: string;
  distKm: number;
  stageMatch: TripStage;
  statusText: string;
  eta: string;
}

interface ShipmentRouteMapProps {
  shipment: OfficeShipment;
  driverName?: string;
  vehicleNumber?: string;
  canAdvanceStatus?: boolean;
  onAdvanceStatus?: () => void;
  isDriverView?: boolean;
}

const ROUTE_WAYPOINTS: RouteWaypoint[] = [
  { id: 'wp-1', name: 'Origin Depot', distKm: 0, stageMatch: 'ASSIGNED', statusText: 'Assignment Pending', eta: 'Departed' },
  { id: 'wp-2', name: 'Driver Base', distKm: 15, stageMatch: 'ACCEPTED', statusText: 'Driver Accepted', eta: '10 mins' },
  { id: 'wp-3', name: 'Sriperumbudur Pickup', distKm: 42, stageMatch: 'EN_ROUTE_TO_PICKUP', statusText: 'En Route to Pickup', eta: '25 mins' },
  { id: 'wp-4', name: 'Consignor Warehouse', distKm: 45, stageMatch: 'ARRIVED_AT_PICKUP', statusText: 'At Pickup Point', eta: 'Loading' },
  { id: 'wp-5', name: 'Loaded & Dispatched', distKm: 50, stageMatch: 'LOADED', statusText: 'Cargo Loaded', eta: 'Departing' },
  { id: 'wp-6', name: 'Vellore Toll Plaza', distKm: 140, stageMatch: 'IN_TRANSIT', statusText: 'Highway In-Transit', eta: '1h 30m' },
  { id: 'wp-7', name: 'Krishnagiri Junction', distKm: 250, stageMatch: 'IN_TRANSIT', statusText: 'Midway Corridor', eta: '2h 15m' },
  { id: 'wp-8', name: 'Hosur Terminal', distKm: 310, stageMatch: 'IN_TRANSIT', statusText: 'Near Border Entry', eta: '45 mins' },
  { id: 'wp-9', name: 'Bangalore Hub', distKm: 345, stageMatch: 'ARRIVED_AT_DESTINATION', statusText: 'Arrived at Destination', eta: 'Unloading' },
  { id: 'wp-10', name: 'Consignee Facility', distKm: 350, stageMatch: 'DELIVERED', statusText: 'Delivered Successfully', eta: 'Completed' },
];

const STAGE_ORDER: TripStage[] = [
  'ASSIGNED',
  'ACCEPTED',
  'EN_ROUTE_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'LOADED',
  'IN_TRANSIT',
  'ARRIVED_AT_DESTINATION',
  'DELIVERED',
];

const STAGE_LABELS: Record<TripStage, string> = {
  ASSIGNED: 'Assigned',
  ACCEPTED: 'Accepted',
  READY_FOR_PICKUP: 'Ready for Pickup',
  EN_ROUTE_TO_PICKUP: 'En Route Pickup',
  ARRIVED_AT_PICKUP: 'Arrived Pickup',
  LOADED: 'Loaded',
  TRIP_STARTED: 'Trip Started',
  IN_TRANSIT: 'In Transit',
  ARRIVED: 'Arrived Destination',
  ARRIVED_AT_DESTINATION: 'Arrived Destination',
  DELIVERED: 'Delivered',
};

export const ShipmentRouteMap: React.FC<ShipmentRouteMapProps> = ({
  shipment,
  driverName,
  vehicleNumber,
  canAdvanceStatus = false,
  onAdvanceStatus,
  isDriverView = false,
}) => {
  const currentStage = shipment.tripStage || (shipment.status === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT');
  const stageIndex = STAGE_ORDER.indexOf(currentStage as TripStage);
  const safeStageIdx = stageIndex >= 0 ? stageIndex : 5; // Default to IN_TRANSIT index
  const isDelivered = currentStage === 'DELIVERED' || shipment.status === 'DELIVERED';

  // Calculate simulated waypoint matching
  const getSimulatedWaypoint = () => {
    switch (currentStage) {
      case 'ASSIGNED':
        return ROUTE_WAYPOINTS[0];
      case 'ACCEPTED':
        return ROUTE_WAYPOINTS[1];
      case 'EN_ROUTE_TO_PICKUP':
        return ROUTE_WAYPOINTS[2];
      case 'ARRIVED_AT_PICKUP':
        return ROUTE_WAYPOINTS[3];
      case 'LOADED':
        return ROUTE_WAYPOINTS[4];
      case 'IN_TRANSIT':
      case 'TRIP_STARTED':
        return ROUTE_WAYPOINTS[7]; // Hosur / Krishnagiri
      case 'ARRIVED_AT_DESTINATION':
      case 'ARRIVED':
        return ROUTE_WAYPOINTS[8];
      case 'DELIVERED':
        return ROUTE_WAYPOINTS[9];
      default:
        return ROUTE_WAYPOINTS[6];
    }
  };

  const currentWp = getSimulatedWaypoint();
  const progressPercent = Math.min(100, Math.round(((safeStageIdx + 1) / STAGE_ORDER.length) * 100));

  return (
    <View style={styles.container}>
      {/* Shipment Header Pill */}
      <View style={styles.routeHeader}>
        <View style={styles.routeHeaderLeft}>
          <Text style={styles.routeShipmentId}>{shipment.id}</Text>
          <View style={styles.routeLocationsRow}>
            <Text style={styles.routeOrigin}>{shipment.origin}</Text>
            <Ionicons name="arrow-forward" size={14} color="#64748B" style={styles.arrowIcon} />
            <Text style={styles.routeDestination}>{shipment.destination}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            isDelivered ? styles.statusBadgeDelivered : styles.statusBadgeActive,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isDelivered ? styles.statusDotGreen : styles.statusDotBlue,
            ]}
          />
          <Text
            style={[
              styles.statusBadgeText,
              isDelivered ? styles.statusTextGreen : styles.statusTextBlue,
            ]}
          >
            {isDelivered ? 'DELIVERED' : currentStage.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      {/* Simulated Visual Route Corridor Canvas */}
      <View style={styles.mapCanvas}>
        {/* Map Grid Pattern background */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineH1} />
          <View style={styles.gridLineH2} />
          <View style={styles.gridLineV1} />
          <View style={styles.gridLineV2} />
        </View>

        {/* Live GPS Tag */}
        <View style={styles.telemetryTag}>
          <View style={styles.telemetryPulse} />
          <Text style={styles.telemetryText}>Simulated Corridor Tracking • Live</Text>
        </View>

        {/* Speed / ETA Badge */}
        <View style={styles.speedBadge}>
          <Ionicons name="speedometer-outline" size={13} color="#2563EB" />
          <Text style={styles.speedBadgeText}>{isDelivered ? '0 km/h' : '58 km/h'}</Text>
        </View>

        {/* Highway Corridor Line & Nodes */}
        <View style={styles.highwayContainer}>
          {/* Background Route Track */}
          <View style={styles.highwayTrack} />
          {/* Active Completed Track */}
          <View style={[styles.highwayTrackActive, { width: `${progressPercent}%` }]} />

          {/* Node 1: Origin */}
          <View style={[styles.waypointNode, styles.nodeOrigin]}>
            <View style={styles.originMarkerOuter}>
              <View style={styles.originMarkerInner} />
            </View>
            <Text style={styles.waypointNodeLabel}>{shipment.origin.split(',')[0]}</Text>
            <Text style={styles.waypointNodeSub}>Pickup</Text>
          </View>

          {/* Node 2: Midway */}
          <View style={[styles.waypointNode, styles.nodeMidway]}>
            <View
              style={[
                styles.midwayMarker,
                safeStageIdx >= 5 && styles.midwayMarkerActive,
              ]}
            >
              <Ionicons
                name="git-commit-outline"
                size={14}
                color={safeStageIdx >= 5 ? '#2563EB' : '#94A3B8'}
              />
            </View>
            <Text style={styles.waypointNodeLabel}>Hosur Hub</Text>
            <Text style={styles.waypointNodeSub}>Waypoint</Text>
          </View>

          {/* Node 3: Destination */}
          <View style={[styles.waypointNode, styles.nodeDestination]}>
            <View
              style={[
                styles.destinationMarkerOuter,
                isDelivered && styles.destinationMarkerOuterGreen,
              ]}
            >
              <Ionicons
                name="location"
                size={16}
                color={isDelivered ? '#22C55E' : '#EF4444'}
              />
            </View>
            <Text style={styles.waypointNodeLabel}>{shipment.destination.split(',')[0]}</Text>
            <Text style={styles.waypointNodeSub}>Destination</Text>
          </View>

          {/* Dynamic Moving Vehicle Pin */}
          <View
            style={[
              styles.vehiclePinContainer,
              { left: `${Math.max(6, Math.min(88, progressPercent))}%` },
            ]}
          >
            <View style={styles.vehicleRadarPulse} />
            <View style={styles.vehicleIconCircle}>
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.vehicleCallout}>
              <Text style={styles.vehicleCalloutText}>{currentWp.name.split(' ')[0]}</Text>
            </View>
          </View>
        </View>

        {/* Map Legend */}
        <View style={styles.mapLegendRow}>
          <View style={styles.legendItem}>
            <View style={styles.legendDotOrigin} />
            <Text style={styles.legendText}>Pickup</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendDotVehicle} />
            <Text style={styles.legendText}>Current Location</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendDotDestination} />
            <Text style={styles.legendText}>Destination</Text>
          </View>
        </View>
      </View>

      {/* Live Telemetry Info Grid */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryCol}>
            <View style={styles.telemetryColHeader}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.telemetryLabel}>Current Location</Text>
            </View>
            <Text style={styles.telemetryValue}>{currentWp.name}</Text>
            <Text style={styles.telemetrySub}>Updated 2 mins ago</Text>
          </View>

          <View style={styles.telemetryColDivider} />

          <View style={styles.telemetryCol}>
            <View style={styles.telemetryColHeader}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.telemetryLabel}>Estimated Arrival</Text>
            </View>
            <Text style={styles.telemetryValue}>
              {isDelivered ? 'Delivered' : 'Today, 7:30 PM'}
            </Text>
            <Text style={styles.telemetrySub}>ETA: {currentWp.eta}</Text>
          </View>
        </View>

        <View style={styles.telemetryCardDivider} />

        <View style={styles.driverVehicleRow}>
          <View style={styles.driverInfoItem}>
            <Ionicons name="person-circle-outline" size={18} color="#2563EB" />
            <View style={styles.driverInfoTextWrap}>
              <Text style={styles.driverInfoLabel}>Driver</Text>
              <Text style={styles.driverInfoValue}>{driverName || 'Assigned Driver'}</Text>
            </View>
          </View>

          <View style={styles.driverInfoItem}>
            <Ionicons name="car-outline" size={18} color="#2563EB" />
            <View style={styles.driverInfoTextWrap}>
              <Text style={styles.driverInfoLabel}>Vehicle</Text>
              <Text style={styles.driverInfoValue}>{vehicleNumber || 'Assigned Vehicle'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Synchronized Status Timeline */}
      <View style={styles.timelineSection}>
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.timelineSectionTitle}>Shipment Status Timeline</Text>
          <Text style={styles.timelineProgressPercent}>{progressPercent}% Complete</Text>
        </View>

        <View style={styles.stepperContainer}>
          {STAGE_ORDER.map((stage, idx) => {
            const isCompleted = idx < safeStageIdx || isDelivered;
            const isCurrent = idx === safeStageIdx && !isDelivered;
            const isUpcoming = idx > safeStageIdx && !isDelivered;

            return (
              <View key={stage} style={styles.stepRow}>
                {/* Stepper Track and Node */}
                <View style={styles.stepTrackCol}>
                  <View
                    style={[
                      styles.stepNodeCircle,
                      isCompleted && styles.stepNodeCompleted,
                      isCurrent && styles.stepNodeCurrent,
                      isUpcoming && styles.stepNodeUpcoming,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : isCurrent ? (
                      <View style={styles.currentInnerDot} />
                    ) : (
                      <View style={styles.upcomingInnerDot} />
                    )}
                  </View>
                  {idx < STAGE_ORDER.length - 1 && (
                    <View
                      style={[
                        styles.stepLineVertical,
                        isCompleted && styles.stepLineCompleted,
                      ]}
                    />
                  )}
                </View>

                {/* Step Content */}
                <View style={styles.stepContentCol}>
                  <View style={styles.stepTitleRow}>
                    <Text
                      style={[
                        styles.stepTitleText,
                        isCompleted && styles.stepTitleCompleted,
                        isCurrent && styles.stepTitleCurrent,
                        isUpcoming && styles.stepTitleUpcoming,
                      ]}
                    >
                      {STAGE_LABELS[stage]}
                    </Text>
                    {isCurrent && (
                      <View style={styles.inProgressBadge}>
                        <Text style={styles.inProgressBadgeText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.stepSubText}>
                    {isCompleted
                      ? 'Milestone verified'
                      : isCurrent
                      ? 'In progress on route corridor'
                      : 'Pending next milestone'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Driver Milestone Progression Button (if applicable) */}
      {canAdvanceStatus && !isDelivered && onAdvanceStatus && (
        <TouchableOpacity
          style={styles.advanceStatusBtn}
          onPress={onAdvanceStatus}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-up-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.advanceStatusBtnText}>
            {isDriverView ? 'Advance Next Milestone' : 'Simulate Next Milestone'}
          </Text>
        </TouchableOpacity>
      )}

      {isDelivered && (
        <View style={styles.deliveredBanner}>
          <Ionicons name="checkmark-done-circle" size={20} color="#22C55E" />
          <Text style={styles.deliveredBannerText}>Shipment Delivered Successfully</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  routeShipmentId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeLocationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  routeOrigin: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  arrowIcon: {
    marginHorizontal: 6,
  },
  routeDestination: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusBadgeActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusBadgeDelivered: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusDotBlue: {
    backgroundColor: '#2563EB',
  },
  statusDotGreen: {
    backgroundColor: '#22C55E',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextBlue: {
    color: '#1D4ED8',
  },
  statusTextGreen: {
    color: '#15803D',
  },

  // Map Canvas
  mapCanvas: {
    height: 190,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gridLineH1: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  gridLineH2: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  gridLineV1: {
    position: 'absolute',
    left: '33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  gridLineV2: {
    position: 'absolute',
    left: '66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  telemetryTag: {
    position: 'absolute',
    top: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  telemetryPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  speedBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  speedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Highway track
  highwayContainer: {
    marginHorizontal: 28,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
  },
  highwayTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#334155',
    borderRadius: 3,
  },
  highwayTrackActive: {
    position: 'absolute',
    left: 0,
    height: 5,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  waypointNode: {
    position: 'absolute',
    alignItems: 'center',
    width: 80,
    marginLeft: -40,
  },
  nodeOrigin: {
    left: '0%',
  },
  nodeMidway: {
    left: '50%',
  },
  nodeDestination: {
    left: '100%',
  },
  originMarkerOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  originMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  midwayMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midwayMarkerActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A8A',
  },
  destinationMarkerOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationMarkerOuterGreen: {
    backgroundColor: '#DCFCE7',
  },
  waypointNodeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  waypointNodeSub: {
    fontSize: 9,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },

  // Vehicle Pin
  vehiclePinContainer: {
    position: 'absolute',
    top: -8,
    marginLeft: -16,
    alignItems: 'center',
    zIndex: 10,
  },
  vehicleRadarPulse: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    top: -2,
  },
  vehicleIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vehicleCallout: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  vehicleCalloutText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#38BDF8',
  },

  // Map Legend
  mapLegendRow: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDotOrigin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 4,
  },
  legendDotVehicle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    marginRight: 4,
  },
  legendDotDestination: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  legendText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // Telemetry Card
  telemetryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  telemetryRow: {
    flexDirection: 'row',
  },
  telemetryCol: {
    flex: 1,
  },
  telemetryColDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  telemetryColHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  telemetryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  telemetrySub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  telemetryCardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  driverVehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  driverInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverInfoTextWrap: {
    justifyContent: 'center',
  },
  driverInfoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  driverInfoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Timeline Section
  timelineSection: {
    marginTop: 4,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  timelineProgressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  stepperContainer: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 44,
  },
  stepTrackCol: {
    width: 24,
    alignItems: 'center',
  },
  stepNodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepNodeCompleted: {
    backgroundColor: '#22C55E',
  },
  stepNodeCurrent: {
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  stepNodeUpcoming: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  currentInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  upcomingInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  stepLineVertical: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stepLineCompleted: {
    backgroundColor: '#22C55E',
  },
  stepContentCol: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 14,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepTitleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepTitleCompleted: {
    color: '#0F172A',
    fontWeight: '700',
  },
  stepTitleCurrent: {
    color: '#2563EB',
    fontWeight: '700',
  },
  stepTitleUpcoming: {
    color: '#94A3B8',
  },
  inProgressBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  inProgressBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  stepSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  // Action Button & Banner
  advanceStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 12,
  },
  advanceStatusBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deliveredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
    marginTop: 12,
  },
  deliveredBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
});
