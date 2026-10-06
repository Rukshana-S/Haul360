import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { ShipmentTimeline } from '@/components/ui/ShipmentTimeline';

export default function DriverCurrentTripScreen() {
  const {
    currentDriverUser,
    shipments,
    vehicles,
    startTrip,
    advanceTripStage,
    breakdowns,
  } = useTransportOffice();

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  // Find active trip
  const activeTrip = shipments.find(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT')
  );

  const assignedVehicle = activeTrip?.assignedVehicleId
    ? vehicles.find((v) => v.id === activeTrip.assignedVehicleId)
    : null;

  const activeBreakdown = breakdowns.find(
    (b) => b.driverId === driverId && b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/office-driver/assignments');
    }
  };

  if (!activeTrip) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Trip Dispatch</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="navigate-outline" size={56} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Active Trip in Progress</Text>
          <Text style={styles.emptySubtitle}>
            You currently have no active trip. Check your assignment inbox for new dispatch requests.
          </Text>
          <Button
            title="Check Assignment Inbox"
            onPress={() => router.push('/office-driver/assignments' as any)}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Screen>
    );
  }

  const getActionConfig = () => {
    if (activeTrip.status === 'ACCEPTED') {
      return {
        title: 'Start Trip & Depart →',
        onPress: () => startTrip(activeTrip.id),
      };
    }
    if (activeTrip.status === 'IN_TRANSIT') {
      return {
        title: 'Confirm Delivery & Complete Haul ✓',
        onPress: () => advanceTripStage(activeTrip.id),
      };
    }
    return null;
  };

  const actionConfig = getActionConfig();

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Current Haul #{activeTrip.id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ACTIVE BREAKDOWN WARNING BANNER */}
        {activeBreakdown && (
          <TouchableOpacity
            style={styles.breakdownNotice}
            onPress={() => router.push('/office-driver/breakdown/status' as any)}
          >
            <Ionicons name="warning" size={20} color="#DC2626" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.breakdownNoticeTitle}>Roadside Assistance in Progress</Text>
              <Text style={styles.breakdownNoticeSub}>
                Status: {activeBreakdown.status.replace(/_/g, ' ')} • Tap to view tracking
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#DC2626" />
          </TouchableOpacity>
        )}

        {/* HERO ROUTE CARD */}
        <View style={styles.heroRouteCard}>
          <View style={styles.heroRouteHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE FREIGHT HAUL</Text>
            </View>
            <Text style={styles.distanceBadge}>{activeTrip.distanceKm} KM</Text>
          </View>

          <View style={styles.routeCitiesRow}>
            <View style={styles.cityCol}>
              <View style={styles.pointDotBlue} />
              <Text style={styles.cityText}>{activeTrip.origin}</Text>
              <Text style={styles.subAddressText} numberOfLines={1}>{activeTrip.originAddress}</Text>
            </View>

            <View style={styles.arrowCol}>
              <Ionicons name="arrow-forward" size={18} color={colors.navy} />
            </View>

            <View style={styles.cityCol}>
              <View style={styles.pointDotGreen} />
              <Text style={styles.cityText}>{activeTrip.destination}</Text>
              <Text style={styles.subAddressText} numberOfLines={1}>{activeTrip.destinationAddress}</Text>
            </View>
          </View>
        </View>

        {/* ASSIGNED FLEET ASSETS & CARGO */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Manifest Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cargo:</Text>
            <Text style={styles.infoValue}>{activeTrip.cargoType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight:</Text>
            <Text style={styles.infoValue}>{activeTrip.cargoWeightKg.toLocaleString()} KG</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Vehicle:</Text>
            <Text style={[styles.infoValue, { fontWeight: 'bold' }]}>
              {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'Vehicle Asset'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expected Delivery:</Text>
            <Text style={styles.infoValue}>{activeTrip.expectedDelivery}</Text>
          </View>
        </View>

        {/* INTERACTIVE TIMELINE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Live Transit Milestones</Text>
          <ShipmentTimeline
            status={activeTrip.status}
            assignedDriverName={currentDriverUser?.name}
            assignedVehicleNumber={assignedVehicle?.vehicleNumber}
            createdAt={activeTrip.createdAt}
            expectedDelivery={activeTrip.expectedDelivery}
          />
        </View>

        {/* PROGRESS TRIP ACTION BUTTON */}
        {actionConfig && (
          <Button
            title={actionConfig.title}
            onPress={actionConfig.onPress}
            style={styles.progressBtn}
          />
        )}

        {/* EMERGENCY SOS / BREAKDOWN BUTTON */}
        <TouchableOpacity
          style={styles.sosEmergencyBtn}
          onPress={() => router.push('/office-driver/breakdown/create' as any)}
        >
          <Ionicons name="warning" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.sosEmergencyBtnText}>Report Emergency / Breakdown (SOS)</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  breakdownNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  breakdownNoticeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  breakdownNoticeSub: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
  },
  heroRouteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroRouteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
  },
  distanceBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  routeCitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  cityCol: {
    flex: 1,
  },
  pointDotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginBottom: 4,
  },
  pointDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  subAddressText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowCol: {
    paddingHorizontal: spacing.sm,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '65%',
    textAlign: 'right',
  },
  timelineList: {
    paddingVertical: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: colors.navy,
  },
  timelineCircleInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  timelineBar: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  timelineBarCompleted: {
    backgroundColor: colors.navy,
  },
  timelineContentCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timelineTitleCompleted: {
    fontWeight: 'bold',
    color: colors.navy,
  },
  timelineTime: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  timelineDesc: {
    fontSize: 10,
    color: colors.slate,
    marginTop: 1,
  },
  progressBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.xs,
  },
  sosEmergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  sosEmergencyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
});
