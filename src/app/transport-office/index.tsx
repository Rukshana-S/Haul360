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

export default function TransportOfficeDashboard() {
  const {
    office,
    drivers,
    vehicles,
    shipments,
    breakdowns,
    officeNotifications,
  } = useTransportOffice();

  const activeShipments = shipments.filter(
    (s) => s.status === 'IN_TRANSIT' || s.status === 'ACCEPTED'
  );

  const pendingShipments = shipments.filter(
    (s) => s.status === 'PENDING_ASSIGNMENT' || s.status === 'ASSIGNMENT_PENDING'
  );

  const declinedShipments = shipments.filter(
    (s) => s.status === 'DECLINED' || (!!s.declineReason && s.status === 'PENDING_ASSIGNMENT')
  );

  const availableDriversCount = drivers.filter((d) => d.availability === 'AVAILABLE').length;

  const activeBreakdowns = breakdowns.filter(
    (b) => b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  );

  const unreadNotifCount = officeNotifications.filter((n) => !n.read).length;

  const getShipmentStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return { label: 'In Transit', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'ACCEPTED':
        return { label: 'Driver Accepted', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'Awaiting Acceptance', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'PENDING_ASSIGNMENT':
        return { label: 'Unassigned', bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
      default:
        return { label: status, bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
    }
  };

  const hasNeedsAttention =
    activeBreakdowns.length > 0 ||
    pendingShipments.length > 0 ||
    declinedShipments.length > 0;

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
            <Text style={styles.officeNameText} numberOfLines={1}>{office.name}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/transport-office/notifications' as any)}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.navy} />
              {unreadNotifCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{unreadNotifCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push('/transport-office/profile' as any)}
            >
              <Ionicons name="business-outline" size={18} color={colors.navy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* GREETING */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>Good Morning,</Text>
          <Text style={styles.welcomeName}>{office.managerName || office.name}</Text>
        </View>

        {/* KEY STATS (2x2 Grid, Max 4) */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => router.push('/transport-office/shipments' as any)}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="cube-outline" size={18} color={colors.blue} />
            </View>
            <Text style={styles.statValue}>{activeShipments.length}</Text>
            <Text style={styles.statLabel}>Active Shipments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => router.push('/transport-office/shipments' as any)}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time-outline" size={18} color={colors.orange} />
            </View>
            <Text style={styles.statValue}>{pendingShipments.length}</Text>
            <Text style={styles.statLabel}>Pending Assignments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => router.push('/transport-office/drivers' as any)}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="people-outline" size={18} color={colors.green} />
            </View>
            <Text style={styles.statValue}>{availableDriversCount}</Text>
            <Text style={styles.statLabel}>Available Drivers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, activeBreakdowns.length > 0 && styles.statCardAlert]}
            activeOpacity={0.8}
            onPress={() => {
              if (activeBreakdowns.length > 0) {
                router.push(`/transport-office/breakdowns/${activeBreakdowns[0].id}` as any);
              }
            }}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: activeBreakdowns.length > 0 ? '#FEE2E2' : '#F1F5F9' },
              ]}
            >
              <Ionicons
                name="warning-outline"
                size={18}
                color={activeBreakdowns.length > 0 ? '#DC2626' : colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.statValue,
                activeBreakdowns.length > 0 && { color: '#DC2626' },
              ]}
            >
              {activeBreakdowns.length}
            </Text>
            <Text style={styles.statLabel}>Active Breakdowns</Text>
          </TouchableOpacity>
        </View>

        {/* NEEDS ATTENTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Needs Attention</Text>
        </View>

        {!hasNeedsAttention ? (
          <View style={styles.cleanStateCard}>
            <View style={styles.cleanStateIcon}>
              <Ionicons name="checkmark-circle" size={24} color={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cleanStateTitle}>Everything is under control</Text>
              <Text style={styles.cleanStateSub}>
                No critical breakdowns or unassigned delays requiring urgent action.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.attentionList}>
            {/* Active Breakdown Alert */}
            {activeBreakdowns.slice(0, 2).map((bd) => (
              <TouchableOpacity
                key={bd.id}
                style={styles.breakdownAlertCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/transport-office/breakdowns/${bd.id}` as any)}
              >
                <View style={styles.alertHeaderRow}>
                  <View style={styles.alertBadge}>
                    <Ionicons name="warning" size={12} color="#B91C1C" style={{ marginRight: 4 }} />
                    <Text style={styles.alertBadgeText}>ACTIVE BREAKDOWN</Text>
                  </View>
                  <Text style={styles.alertTime}>{bd.reportedAt}</Text>
                </View>
                <Text style={styles.alertTitle}>
                  {bd.issueType} • Vehicle: {bd.vehicleNumber}
                </Text>
                <Text style={styles.alertDesc}>
                  Driver: {bd.driverName} • Location: {bd.location}
                </Text>
                <View style={styles.alertActionRow}>
                  <Text style={styles.alertActionText}>Coordinate Mechanic Assistance →</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Driver Declined Alert */}
            {declinedShipments.slice(0, 1).map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.declinedAlertCard}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/transport-office/shipments/assign',
                    params: { shipmentId: s.id },
                  } as any)
                }
              >
                <View style={styles.alertHeaderRow}>
                  <View style={[styles.alertBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="close-circle" size={12} color="#B91C1C" style={{ marginRight: 4 }} />
                    <Text style={[styles.alertBadgeText, { color: '#B91C1C' }]}>DRIVER DECLINED</Text>
                  </View>
                  <Text style={styles.alertTime}>Shipment #{s.id}</Text>
                </View>
                <Text style={styles.alertTitle}>
                  Re-assignment Required ({s.origin} → {s.destination})
                </Text>
                <Text style={styles.alertDesc}>
                  Reason: {s.declineReason || 'Driver unavailable'}
                </Text>
                <View style={styles.alertActionRow}>
                  <Text style={styles.alertActionText}>Re-assign Shipment Now →</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Pending Assignment Alert */}
            {pendingShipments.filter((s) => s.status === 'PENDING_ASSIGNMENT' && !s.declineReason).slice(0, 2).map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.pendingAlertCard}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/transport-office/shipments/assign',
                    params: { shipmentId: s.id },
                  } as any)
                }
              >
                <View style={styles.alertHeaderRow}>
                  <View style={[styles.alertBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="time" size={12} color="#B45309" style={{ marginRight: 4 }} />
                    <Text style={[styles.alertBadgeText, { color: '#B45309' }]}>PENDING DISPATCH</Text>
                  </View>
                  <Text style={styles.alertTime}>Shipment #{s.id}</Text>
                </View>
                <Text style={styles.alertTitle}>
                  {s.origin} → {s.destination} ({s.cargoWeightKg.toLocaleString()} KG)
                </Text>
                <Text style={styles.alertDesc}>
                  Cargo: {s.cargoType} • Pickup: {s.pickupTime}
                </Text>
                <View style={styles.alertActionRow}>
                  <Text style={[styles.alertActionText, { color: colors.blue }]}>Assign Driver & Vehicle →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ACTIVE SHIPMENTS (2-3 items max + View All Shipments button) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Active Shipments</Text>
          <TouchableOpacity onPress={() => router.push('/transport-office/shipments' as any)}>
            <Text style={styles.seeAllLink}>View All ({shipments.length})</Text>
          </TouchableOpacity>
        </View>

        {activeShipments.length === 0 ? (
          <View style={styles.emptyShipmentsCard}>
            <Ionicons name="cube-outline" size={32} color="#64748B" />
            <Text style={styles.emptyShipmentsTitle}>No active shipments</Text>
            <Text style={styles.emptyShipmentsSub}>
              No shipments are currently in transit on the road network.
            </Text>
          </View>
        ) : (
          <View style={styles.shipmentsList}>
            {activeShipments.slice(0, 3).map((shipment) => {
              const driver = shipment.assignedDriverId
                ? drivers.find((d) => d.id === shipment.assignedDriverId)
                : null;
              const vehicle = shipment.assignedVehicleId
                ? vehicles.find((v) => v.id === shipment.assignedVehicleId)
                : null;
              const badge = getShipmentStatusBadge(shipment.status);

              return (
                <View key={shipment.id} style={styles.shipmentCard}>
                  <View style={styles.shipmentCardHeader}>
                    <Text style={styles.shipmentId}>#{shipment.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeRow}>
                    <Text style={styles.routeCity}>{shipment.origin}</Text>
                    <Ionicons name="arrow-forward" size={13} color={colors.navy} style={{ marginHorizontal: 6 }} />
                    <Text style={styles.routeCity}>{shipment.destination}</Text>
                  </View>

                  <View style={styles.driverVehicleRow}>
                    <Ionicons name="person-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.driverVehicleText}>
                      {driver?.name || 'Driver'} • {vehicle?.vehicleNumber || 'Vehicle'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewShipmentBtn}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/transport-office/shipments/${shipment.id}` as any)}
                  >
                    <Text style={styles.viewShipmentBtnText}>View Operations</Text>
                    <Ionicons name="chevron-forward" size={13} color={colors.navy} />
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.viewAllShipmentsBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/transport-office/shipments' as any)}
            >
              <Text style={styles.viewAllShipmentsBtnText}>View All Shipments →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* QUICK ACTIONS (+ Add Driver, + Add Vehicle) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionButton}
            activeOpacity={0.85}
            onPress={() => router.push('/transport-office/drivers/add' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="person-add" size={16} color={colors.blue} />
            </View>
            <Text style={styles.quickActionText}>+ Add Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            activeOpacity={0.85}
            onPress={() => router.push('/transport-office/vehicles/add' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="bus" size={16} color={colors.orange} />
            </View>
            <Text style={styles.quickActionText}>+ Add Vehicle</Text>
          </TouchableOpacity>
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
    paddingTop: spacing.xs,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: spacing.xs,
  },
  officeNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    flexShrink: 1,
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
  welcomeSection: {
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  welcomeGreeting: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCardAlert: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.blue,
  },
  cleanStateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: spacing.sm,
  },
  cleanStateIcon: {
    marginRight: spacing.sm,
  },
  cleanStateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  cleanStateSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 15,
  },
  attentionList: {
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  breakdownAlertCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  declinedAlertCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  pendingAlertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  alertBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },
  alertTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 4,
  },
  alertActionRow: {
    marginTop: 2,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyShipmentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyShipmentsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginTop: 4,
  },
  emptyShipmentsSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  shipmentsList: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  shipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shipmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeCity: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  driverVehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  driverVehicleText: {
    fontSize: 11,
    color: '#64748B',
  },
  viewShipmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewShipmentBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  viewAllShipmentsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  viewAllShipmentsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickActionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
});
