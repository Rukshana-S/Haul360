import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { TripLifecycleStatus } from '@/constants/driverMockData';

export default function ShipmentLiveTrackingScreen() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const { trips, activeTrip, advanceTripStep } = useDriver();

  const [advancing, setAdvancing] = useState(false);

  // Target trip (selected trip or active trip)
  const trip = tripId ? trips.find((t) => t.id === tripId) || activeTrip : activeTrip || trips[0];

  if (!trip) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
        </View>
        <View style={styles.notFoundCenter}>
          <Ionicons name="navigate-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>No Active Shipment to Track</Text>
          <Text style={styles.notFoundSub}>
            Start or accept a shipment to view live simulated route progress.
          </Text>
          <TouchableOpacity
            style={styles.findLoadsBtn}
            onPress={() => router.replace('/driver/(tabs)/shipments' as any)}
          >
            <Text style={styles.findLoadsBtnText}>Explore Shipments</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  // Simulated location and progress calculation based on status
  const getSimulatedTrackingData = (status: TripLifecycleStatus) => {
    switch (status) {
      case 'ASSIGNED':
        return {
          percent: 5,
          locationText: `${trip.pickupLocation.city} Commercial Dispatch Hub`,
          eta: 'Awaiting Driver Confirmation',
          nextActionText: 'Accept Assignment',
          subNotice: 'Simulated dispatch checkpoint',
        };
      case 'ACCEPTED':
        return {
          percent: 15,
          locationText: `Driver Staging Yard, ${trip.pickupLocation.city}`,
          eta: 'Ready for Departure to Pickup',
          nextActionText: 'Start Route to Pickup',
          subNotice: 'Vehicle pre-trip safety checklist complete',
        };
      case 'EN_ROUTE_TO_PICKUP':
        return {
          percent: 30,
          locationText: `Outer Ring Road, Approach to ${trip.pickupLocation.city} Industrial Zone`,
          eta: '18 mins to Loading Dock',
          nextActionText: 'Mark Arrived at Pickup',
          subNotice: 'Toll passed: City Expressway Toll Plaza',
        };
      case 'ARRIVED_AT_PICKUP':
        return {
          percent: 45,
          locationText: `${trip.pickupLocation.address}, ${trip.pickupLocation.city}`,
          eta: 'Cargo Loading & Strapping in Progress',
          nextActionText: 'Confirm Loaded & Secured',
          subNotice: 'Dock Gate #4 • Verification completed',
        };
      case 'LOADED':
        return {
          percent: 55,
          locationText: `${trip.pickupLocation.city} Highway Departure Checkpost`,
          eta: 'Departing onto National Highway',
          nextActionText: 'Start Highway Transit',
          subNotice: 'E-Way Bill & Weight Slip generated',
        };
      case 'IN_TRANSIT':
        return {
          percent: 80,
          locationText: `NH 44 Highway Milestone 184 (Near Salem / Dharmapuri Corridor)`,
          eta: 'Estimated Arrival: 3 hrs 20 mins',
          nextActionText: 'Mark Arrived at Destination',
          subNotice: 'Speed: 52 km/h (Simulated Telematics) • Weather: Clear',
        };
      case 'ARRIVED_AT_DESTINATION':
        return {
          percent: 95,
          locationText: `${trip.destinationLocation.address}, ${trip.destinationLocation.city}`,
          eta: 'Unloading Bay Docking',
          nextActionText: 'Confirm Delivery Complete',
          subNotice: 'Consignee receiver standing by with OTP',
        };
      case 'DELIVERED':
        return {
          percent: 100,
          locationText: `${trip.destinationLocation.city} Recipient Warehouse (Delivered)`,
          eta: 'Delivered • POD Confirmed',
          nextActionText: 'Delivered',
          subNotice: 'Escrow payment released to Passbook',
        };
      default:
        return {
          percent: 0,
          locationText: 'Status Pending',
          eta: 'Pending',
          nextActionText: 'Update Status',
          subNotice: 'Simulated tracking',
        };
    }
  };

  const trackingData = getSimulatedTrackingData(trip.status);

  const handleAdvanceStep = () => {
    if (trip.status === 'DELIVERED') {
      router.push(`/driver/return-load?origin=${encodeURIComponent(trip.destinationLocation.city)}` as any);
      return;
    }

    setAdvancing(true);
    setTimeout(() => {
      advanceTripStep(trip.id);
      setAdvancing(false);
    }, 400);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Live Shipment Tracking</Text>
          <Text style={styles.headerSubtitle}>Simulated Non-GPS Route Telematics</Text>
        </View>
        <StatusBadge status={trip.status} size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO CARD: SHIPMENT ID & ROUTE */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.shipmentIdText}>{trip.shipmentNumber}</Text>
              <Text style={styles.tripIdSub}>Trip Ref: {trip.tripNumber}</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveText}>SIMULATED LIVE</Text>
            </View>
          </View>

          {/* ROUTE CORRIDOR DIAGRAM */}
          <View style={styles.routeCorridor}>
            <View style={styles.corridorStop}>
              <View style={styles.originMarker} />
              <Text style={styles.corridorCity}>{trip.pickupLocation.city}</Text>
              <Text style={styles.corridorRole}>PICKUP</Text>
            </View>

            <View style={styles.corridorMiddle}>
              <View style={styles.corridorLine}>
                <View
                  style={[
                    styles.corridorLineProgress,
                    { width: `${trackingData.percent}%` },
                  ]}
                />
              </View>
              <View style={styles.truckIconBadge}>
                <Ionicons name="car-sport" size={14} color={colors.navy} />
              </View>
            </View>

            <View style={styles.corridorStop}>
              <View style={styles.destMarker} />
              <Text style={styles.corridorCity}>{trip.destinationLocation.city}</Text>
              <Text style={styles.corridorRole}>DESTINATION</Text>
            </View>
          </View>
        </View>

        {/* STATUS & PROGRESS CARD */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="speedometer-outline" size={18} color={colors.navy} />
            <Text style={styles.cardTitle}>Live Journey Telematics</Text>
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Current Status</Text>
              <Text style={styles.metricVal}>{trip.status.replace(/_/g, ' ')}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Route Progress</Text>
              <Text style={[styles.metricVal, { color: colors.blue }]}>
                {trackingData.percent}%
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${trackingData.percent}%` }]}
              />
            </View>
          </View>

          {/* Location Milestone */}
          <View style={styles.locationDetailBox}>
            <View style={styles.locIconCol}>
              <Ionicons name="location" size={20} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locHeading}>Current Simulated Location</Text>
              <Text style={styles.locAddress}>{trackingData.locationText}</Text>
              <Text style={styles.locSub}>{trackingData.subNotice}</Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.timeText}>Last updated: Just now • ETA: {trackingData.eta}</Text>
          </View>
        </View>

        {/* STATUS LIFECYCLE TIMELINE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipment Lifecycle Progression</Text>

          <View style={styles.timelineList}>
            {trip.steps.map((step, idx) => {
              const isCurrent = step.status === trip.status;
              const isDone = step.completed;

              return (
                <View key={step.status} style={styles.stepItem}>
                  <View style={styles.stepLeftCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isDone && styles.stepDotDone,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      {isDone && <Ionicons name="checkmark" size={12} color={colors.white} />}
                      {isCurrent && <View style={styles.currentDotCore} />}
                    </View>
                    {idx < trip.steps.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          isDone && styles.stepLineDone,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepRightCol}>
                    <Text
                      style={[
                        styles.stepText,
                        isCurrent && styles.stepTextCurrent,
                        isDone && styles.stepTextDone,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {step.timestamp && (
                      <Text style={styles.stepTimeSub}>{step.timestamp}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* DELIVERED & RETURN LOAD PROMPT BANNER */}
        {trip.status === 'DELIVERED' ? (
          <View style={styles.deliveryCompleteBanner}>
            <View style={styles.deliveredIconCircle}>
              <Ionicons name="checkmark-done" size={28} color={colors.green} />
            </View>
            <Text style={styles.deliveredHeading}>Trip Completed Successfully!</Text>
            <Text style={styles.deliveredSub}>
              Payout of ₹{trip.paymentAmount.toLocaleString('en-IN')} has been credited. Find a return load from {trip.destinationLocation.city} to avoid empty runs.
            </Text>

            <TouchableOpacity
              style={styles.findReturnBtn}
              onPress={() =>
                router.push(
                  `/driver/return-load?origin=${encodeURIComponent(trip.destinationLocation.city)}` as any
                )
              }
              activeOpacity={0.85}
            >
              <Ionicons name="repeat" size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.findReturnBtnText}>Find Return Load from {trip.destinationLocation.city}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ACTION TO ADVANCE STATUS */
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.advanceStepBtn,
                advancing && { opacity: 0.7 },
              ]}
              onPress={handleAdvanceStep}
              disabled={advancing}
              activeOpacity={0.85}
            >
              {advancing ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Ionicons name="arrow-forward-circle" size={20} color={colors.white} style={{ marginRight: 6 }} />
                  <Text style={styles.advanceStepBtnText}>
                    Advance Status: {trackingData.nextActionText}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  shipmentIdText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  tripIdSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.green,
    letterSpacing: 0.5,
  },
  routeCorridor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  corridorStop: {
    alignItems: 'center',
    width: 90,
  },
  originMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
    marginBottom: 4,
  },
  destMarker: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.green,
    marginBottom: 4,
  },
  corridorCity: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  corridorRole: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  corridorMiddle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corridorLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#334155',
    borderRadius: 1.5,
  },
  corridorLineProgress: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 1.5,
  },
  truckIconBadge: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  progressBarContainer: {
    marginVertical: spacing.xs,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 3,
  },
  locationDetailBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  locIconCol: {
    marginTop: 2,
  },
  locHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  locAddress: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 1,
  },
  locSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  timeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  timelineList: {
    marginTop: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: 40,
  },
  stepLeftCol: {
    alignItems: 'center',
    width: 24,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: colors.green,
  },
  stepDotCurrent: {
    backgroundColor: colors.blue,
  },
  currentDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stepLineDone: {
    backgroundColor: colors.green,
  },
  stepRightCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  stepText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stepTextCurrent: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  stepTextDone: {
    color: colors.navy,
    fontWeight: '600',
  },
  stepTimeSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  advanceStepBtn: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: radius.md,
    elevation: 3,
  },
  advanceStepBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  deliveryCompleteBanner: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  deliveredIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  deliveredHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#14532D',
    marginBottom: 4,
  },
  deliveredSub: {
    fontSize: 12,
    color: '#166534',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  findReturnBtn: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    width: '100%',
  },
  findReturnBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
    marginBottom: 4,
  },
  notFoundSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  findLoadsBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  findLoadsBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
