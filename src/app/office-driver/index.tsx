import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function OfficeDriverDashboard() {
  const {
    currentDriverUser,
    shipments,
    vehicles,
    driverNotifications,
    breakdowns,
  } = useTransportOffice();

  const driver = currentDriverUser;
  const driverId = driver?.id || 'H360-D-1042';

  const pendingAssignments = shipments.filter(
    (s) => s.assignedDriverId === driverId && s.status === 'ASSIGNMENT_PENDING'
  );

  const activeTrip = shipments.find(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT')
  );

  const assignedVehicle = activeTrip?.assignedVehicleId
    ? vehicles.find((v) => v.id === activeTrip.assignedVehicleId)
    : driver?.currentVehicleId
    ? vehicles.find((v) => v.id === driver.currentVehicleId)
    : null;

  const activeBreakdown = breakdowns.find(
    (b) => b.driverId === driverId && b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  );

  const unreadNotifs = driverNotifications.filter((n) => !n.read).length;

  const getAvailabilityInfo = () => {
    if (activeTrip) {
      return { label: 'On Trip', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
    }
    if (pendingAssignments.length > 0) {
      return { label: 'Assigned', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
    }
    return { label: 'Available', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
  };

  const avail = getAvailabilityInfo();

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={brand.logo} style={styles.logo} contentFit="contain" />
            <View>
              <Text style={styles.brandTitle}>Haul360</Text>
              <Text style={styles.driverIdText}>{driverId}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/office-driver/notifications' as any)}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.navy} />
              {unreadNotifs > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{unreadNotifs}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push('/office-driver/profile' as any)}
            >
              <Ionicons name="person-outline" size={18} color={colors.navy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* GREETING & AVAILABILITY */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingSub}>Good Morning,</Text>
            <Text style={styles.driverName}>{driver?.name || 'Transport Driver'}</Text>
          </View>

          <View style={[styles.availabilityBadge, { backgroundColor: avail.bg }]}>
            <View style={[styles.availabilityDot, { backgroundColor: avail.dot }]} />
            <Text style={[styles.availabilityText, { color: avail.text }]}>
              {avail.label}
            </Text>
          </View>
        </View>

        {/* ACTIVE BREAKDOWN ALERT (IF ANY) */}
        {activeBreakdown && (
          <TouchableOpacity
            style={styles.breakdownNotice}
            activeOpacity={0.85}
            onPress={() => router.push('/office-driver/breakdown/status' as any)}
          >
            <View style={styles.breakdownNoticeHeader}>
              <View style={styles.breakdownBadge}>
                <Ionicons name="warning" size={12} color="#B91C1C" style={{ marginRight: 4 }} />
                <Text style={styles.breakdownBadgeText}>ROADSIDE ASSISTANCE ACTIVE</Text>
              </View>
              <Text style={styles.breakdownTime}>{activeBreakdown.status.replace(/_/g, ' ')}</Text>
            </View>
            <Text style={styles.breakdownTitle}>
              {activeBreakdown.issueType} on {activeBreakdown.vehicleNumber}
            </Text>
            <Text style={styles.breakdownSub}>
              {activeBreakdown.assignedMechanicName
                ? `Assigned: ${activeBreakdown.assignedMechanicName} (~${activeBreakdown.mechanicEtaMinutes || 15}m ETA)`
                : 'Dispatch is coordinating nearby highway assistance.'}
            </Text>
            <Text style={styles.breakdownAction}>View Live Mechanic Status →</Text>
          </TouchableOpacity>
        )}

        {/* CURRENT TRIP SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Trip</Text>
        </View>

        {activeTrip ? (
          <View style={styles.currentTripCard}>
            <View style={styles.tripCardHeader}>
              <Text style={styles.shipmentId}>#{activeTrip.id}</Text>
              <View
                style={[
                  styles.statusPill,
                  activeTrip.status === 'IN_TRANSIT'
                    ? { backgroundColor: '#DBEAFE' }
                    : { backgroundColor: '#DCFCE7' },
                ]}
              >
                <View
                  style={[
                    styles.statusPillDot,
                    { backgroundColor: activeTrip.status === 'IN_TRANSIT' ? '#2563EB' : '#16A34A' },
                  ]}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    { color: activeTrip.status === 'IN_TRANSIT' ? '#1D4ED8' : '#15803D' },
                  ]}
                >
                  {activeTrip.status === 'IN_TRANSIT' ? 'In Progress' : 'Accepted'}
                </Text>
              </View>
            </View>

            {/* ROUTE DISPLAY */}
            <View style={styles.routeContainer}>
              <View style={styles.routeCol}>
                <View style={styles.routePointRow}>
                  <View style={styles.dotOrigin} />
                  <Text style={styles.routeCity}>{activeTrip.origin}</Text>
                </View>
                <Text style={styles.routeAddress} numberOfLines={1}>{activeTrip.originAddress}</Text>
              </View>

              <View style={styles.routeArrowCol}>
                <Ionicons name="arrow-forward" size={14} color={colors.navy} />
                <Text style={styles.distanceText}>{activeTrip.distanceKm} KM</Text>
              </View>

              <View style={styles.routeCol}>
                <View style={styles.routePointRow}>
                  <View style={styles.dotDest} />
                  <Text style={styles.routeCity}>{activeTrip.destination}</Text>
                </View>
                <Text style={styles.routeAddress} numberOfLines={1}>{activeTrip.destinationAddress}</Text>
              </View>
            </View>

            {/* VEHICLE & CARGO INFO */}
            <View style={styles.tripMetaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Vehicle:</Text>
                <Text style={styles.metaVal}>
                  {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'Assigned Asset'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Cargo:</Text>
                <Text style={styles.metaVal}>
                  {activeTrip.cargoType} ({activeTrip.cargoWeightKg.toLocaleString()} KG)
                </Text>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.viewTripButton}
                activeOpacity={0.85}
                onPress={() => router.push('/office-driver/trips/current' as any)}
              >
                <Ionicons name="navigate" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.viewTripButtonText}>VIEW TRIP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sosButton}
                activeOpacity={0.85}
                onPress={() => router.push('/office-driver/breakdown/create' as any)}
              >
                <Ionicons name="warning-outline" size={15} color="#DC2626" style={{ marginRight: 4 }} />
                <Text style={styles.sosButtonText}>SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyTripCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="checkmark-done" size={22} color={colors.green} />
            </View>
            <Text style={styles.emptyTitle}>No active trip</Text>
            <Text style={styles.emptySub}>
              You are available for your next transport dispatch.
            </Text>
          </View>
        )}

        {/* PENDING ASSIGNMENT SECTION */}
        {pendingAssignments.length > 0 && (
          <View style={{ marginTop: spacing.sm }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Assignment</Text>
            </View>

            {pendingAssignments.map((assignment) => {
              const vehicle = vehicles.find((v) => v.id === assignment.assignedVehicleId);

              return (
                <View key={assignment.id} style={styles.pendingCard}>
                  <View style={styles.pendingCardHeader}>
                    <View style={styles.newBadge}>
                      <Ionicons name="mail-unread" size={11} color="#B45309" style={{ marginRight: 4 }} />
                      <Text style={styles.newBadgeText}>NEW ASSIGNMENT</Text>
                    </View>
                    <Text style={styles.pendingShipmentId}>#{assignment.id}</Text>
                  </View>

                  <View style={styles.pendingRouteRow}>
                    <Text style={styles.pendingCity}>{assignment.origin}</Text>
                    <Ionicons name="arrow-forward" size={13} color={colors.navy} style={{ marginHorizontal: 6 }} />
                    <Text style={styles.pendingCity}>{assignment.destination}</Text>
                  </View>

                  <View style={styles.pendingVehicleRow}>
                    <Text style={styles.pendingMetaLabel}>Vehicle:</Text>
                    <Text style={styles.pendingMetaVal}>
                      {vehicle ? `${vehicle.vehicleNumber} (${vehicle.vehicleType})` : 'Yard Asset'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewAssignmentBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push('/office-driver/assignments' as any)}
                  >
                    <Text style={styles.viewAssignmentBtnText}>VIEW ASSIGNMENT</Text>
                    <Ionicons name="chevron-forward" size={13} color={colors.blue} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: spacing.xs,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },
  driverIdText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCount: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  greetingSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  breakdownNotice: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: spacing.md,
  },
  breakdownNoticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  breakdownBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },
  breakdownTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  breakdownSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  breakdownAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  currentTripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shipmentId: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusPillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  routeCol: {
    flex: 1,
  },
  routePointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dotOrigin: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
    marginRight: 4,
  },
  dotDest: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  routeCity: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  routeAddress: {
    fontSize: 10,
    color: '#64748B',
  },
  routeArrowCol: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  distanceText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  tripMetaBox: {
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  viewTripButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
    paddingVertical: 10,
  },
  viewTripButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sosButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  emptyTripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  emptySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  pendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: spacing.sm,
  },
  pendingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  pendingShipmentId: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  pendingRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pendingCity: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  pendingVehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  pendingMetaLabel: {
    fontSize: 11,
    color: '#64748B',
    marginRight: 4,
  },
  pendingMetaVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  viewAssignmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  viewAssignmentBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
  },
});
