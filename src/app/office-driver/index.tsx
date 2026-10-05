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
import { typography } from '@/theme/typography';
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

  // Find assignments for this driver
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

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Image source={brand.logo} style={styles.logo} contentFit="contain" />
            <Text style={styles.driverIdBadge}>Driver ID: {driverId}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push('/office-driver/notifications' as any)}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.navy} />
              {unreadNotifs > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifs}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push('/office-driver/profile' as any)}
            >
              <Ionicons name="person" size={20} color={colors.navy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* WELCOME SECTION */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.driverNameText}>{driver?.name || 'Kumar S.'}</Text>
            <Text style={styles.officeText}>Transport Office: Apex Freight Solutions</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              activeTrip
                ? { backgroundColor: '#DBEAFE' }
                : pendingAssignments.length > 0
                ? { backgroundColor: '#FEF3C7' }
                : { backgroundColor: '#DCFCE7' },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                activeTrip
                  ? { backgroundColor: colors.blue }
                  : pendingAssignments.length > 0
                  ? { backgroundColor: colors.orange }
                  : { backgroundColor: colors.green },
              ]}
            />
            <Text
              style={[
                styles.statusPillText,
                activeTrip
                  ? { color: '#1D4ED8' }
                  : pendingAssignments.length > 0
                  ? { color: '#B45309' }
                  : { color: '#15803D' },
              ]}
            >
              {activeTrip
                ? 'ON TRIP'
                : pendingAssignments.length > 0
                ? 'ASSIGNED'
                : 'AVAILABLE'}
            </Text>
          </View>
        </View>

        {/* ACTIVE BREAKDOWN ALERT BANNER */}
        {activeBreakdown && (
          <TouchableOpacity
            style={styles.sosCard}
            activeOpacity={0.8}
            onPress={() => router.push('/office-driver/breakdown/status' as any)}
          >
            <View style={styles.sosHeader}>
              <View style={styles.sosBadge}>
                <Ionicons name="warning" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
                <Text style={styles.sosBadgeText}>ROADSIDE ASSISTANCE ACTIVE</Text>
              </View>
              <Text style={styles.sosStatus}>{activeBreakdown.status.replace(/_/g, ' ')}</Text>
            </View>
            <Text style={styles.sosTitle}>{activeBreakdown.issueType} on {activeBreakdown.vehicleNumber}</Text>
            <Text style={styles.sosDesc}>
              {activeBreakdown.assignedMechanicName
                ? `Mechanic: ${activeBreakdown.assignedMechanicName} (ETA ~${activeBreakdown.mechanicEtaMinutes || 18}m)`
                : 'Your Transport Office dispatch is dispatching a highway mechanic.'}
            </Text>
            <Text style={styles.sosAction}>View Live Assistance Tracking →</Text>
          </TouchableOpacity>
        )}

        {/* PENDING ASSIGNMENT BANNER */}
        {pendingAssignments.length > 0 && !activeTrip && (
          <TouchableOpacity
            style={styles.pendingAssignmentCard}
            activeOpacity={0.9}
            onPress={() => router.push('/office-driver/assignments' as any)}
          >
            <View style={styles.pendingHeader}>
              <View style={styles.pendingBadge}>
                <Ionicons name="cube" size={14} color="#1E3A8A" style={{ marginRight: 4 }} />
                <Text style={styles.pendingBadgeText}>NEW DISPATCH ASSIGNMENT</Text>
              </View>
              <Text style={styles.pendingTime}>Requires Response</Text>
            </View>

            <Text style={styles.pendingTitle}>
              Shipment #{pendingAssignments[0].id}: {pendingAssignments[0].origin} → {pendingAssignments[0].destination}
            </Text>
            <Text style={styles.pendingDesc}>
              Cargo: {pendingAssignments[0].cargoType} ({pendingAssignments[0].cargoWeightKg.toLocaleString()} KG)
            </Text>

            <View style={styles.pendingActionRow}>
              <Text style={styles.pendingActionText}>Review & Accept / Decline →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ACTIVE TRIP IN PROGRESS */}
        {activeTrip && (
          <View style={styles.activeTripCard}>
            <View style={styles.activeTripHeader}>
              <View style={styles.activeTripBadge}>
                <Ionicons name="navigate" size={14} color="#15803D" style={{ marginRight: 4 }} />
                <Text style={styles.activeTripBadgeText}>ACTIVE TRIP IN PROGRESS</Text>
              </View>
              <Text style={styles.activeTripId}>#{activeTrip.id}</Text>
            </View>

            <View style={styles.routeBox}>
              <Text style={styles.routeCity}>{activeTrip.origin}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.navy} style={{ marginHorizontal: 8 }} />
              <Text style={styles.routeCity}>{activeTrip.destination}</Text>
            </View>

            <View style={styles.tripMetaRow}>
              <Text style={styles.tripMetaLabel}>Assigned Vehicle:</Text>
              <Text style={styles.tripMetaValue}>
                {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'Vehicle Asset'}
              </Text>
            </View>

            <View style={styles.tripButtonsRow}>
              <TouchableOpacity
                style={styles.openTripBtn}
                onPress={() => router.push('/office-driver/trips/current' as any)}
              >
                <Text style={styles.openTripBtnText}>Open Live Trip Tracker →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sosSmallBtn}
                onPress={() => router.push('/office-driver/breakdown/create' as any)}
              >
                <Ionicons name="warning" size={16} color="#DC2626" />
                <Text style={styles.sosSmallBtnText}>SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* DRIVER STATS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Performance & Duty</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="mail-unread-outline" size={18} color={colors.blue} />
            </View>
            <Text style={styles.statVal}>{pendingAssignments.length}</Text>
            <Text style={styles.statLbl}>Pending Inbox</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="navigate-outline" size={18} color={colors.green} />
            </View>
            <Text style={styles.statVal}>{activeTrip ? 1 : 0}</Text>
            <Text style={styles.statLbl}>Active Trip</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="checkmark-done-circle-outline" size={18} color={colors.orange} />
            </View>
            <Text style={styles.statVal}>{driver?.completedTripsCount || 142}</Text>
            <Text style={styles.statLbl}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="star-outline" size={18} color="#7E22CE" />
            </View>
            <Text style={styles.statVal}>★ {driver?.rating.toFixed(1) || '4.9'}</Text>
            <Text style={styles.statLbl}>Fleet Rating</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Driver Hub Actions</Text>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/office-driver/assignments' as any)}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="mail-unread" size={20} color={colors.blue} />
            </View>
            <Text style={styles.actionTitle}>Assignment Inbox</Text>
            <Text style={styles.actionSub}>{pendingAssignments.length} pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/office-driver/trips/current' as any)}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="navigate" size={20} color={colors.green} />
            </View>
            <Text style={styles.actionTitle}>Current Trip</Text>
            <Text style={styles.actionSub}>{activeTrip ? 'In Progress' : 'No active haul'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/office-driver/trips/history' as any)}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color={colors.orange} />
            </View>
            <Text style={styles.actionTitle}>Trip History</Text>
            <Text style={styles.actionSub}>View past routes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/office-driver/breakdown/create' as any)}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="warning" size={20} color="#DC2626" />
            </View>
            <Text style={[styles.actionTitle, { color: '#B91C1C' }]}>SOS Breakdown</Text>
            <Text style={styles.actionSub}>Roadside assist</Text>
          </TouchableOpacity>
        </View>

        {/* ASSIGNED ASSET STATUS (NO PERMANENT VEHICLE) */}
        <View style={styles.assetCard}>
          <Text style={styles.assetCardTitle}>Current Fleet Asset Context</Text>
          <View style={styles.assetRow}>
            <Text style={styles.assetLabel}>Assigned Vehicle Asset:</Text>
            <Text style={styles.assetValue}>
              {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'None (Off duty / In yard)'}
            </Text>
          </View>
          <View style={styles.assetRow}>
            <Text style={styles.assetLabel}>Assigned Active Haul:</Text>
            <Text style={styles.assetValue}>
              {activeTrip ? `#${activeTrip.id} (${activeTrip.origin} → ${activeTrip.destination})` : 'None'}
            </Text>
          </View>
        </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logo: {
    width: 120,
    height: 36,
  },
  driverIdBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.slate,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  welcomeLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  driverNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  officeText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sosCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: spacing.md,
  },
  sosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  sosBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  sosStatus: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  sosTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7F1D1D',
  },
  sosDesc: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
  },
  sosAction: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginTop: spacing.xs,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  pendingAssignmentCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: spacing.md,
  },
  pendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  pendingTime: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '600',
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 2,
  },
  pendingDesc: {
    fontSize: 11,
    color: '#1E40AF',
    marginTop: 2,
  },
  pendingActionRow: {
    marginTop: spacing.xs,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
  },
  pendingActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  activeTripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    marginBottom: spacing.md,
  },
  activeTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activeTripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  activeTripBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  activeTripId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  tripMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tripMetaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tripMetaValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  tripButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  openTripBtn: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openTripBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sosSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 12,
    borderRadius: radius.md,
    gap: 4,
  },
  sosSmallBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  sectionHeaderRow: {
    marginVertical: spacing.xs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statLbl: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  actionSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  assetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  assetCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 4,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  assetLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  assetValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
