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

export default function TransportOfficeDashboard() {
  const {
    office,
    drivers,
    vehicles,
    shipments,
    breakdowns,
    officeNotifications,
  } = useTransportOffice();

  const activeShipmentsCount = shipments.filter(
    (s) => s.status === 'IN_TRANSIT' || s.status === 'ACCEPTED'
  ).length;
  const availableDriversCount = drivers.filter((d) => d.availability === 'AVAILABLE').length;
  const driversOnTripCount = drivers.filter((d) => d.availability === 'BUSY').length;
  const availableVehiclesCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const pendingAssignmentsCount = shipments.filter(
    (s) => s.status === 'PENDING_ASSIGNMENT' || s.status === 'ASSIGNMENT_PENDING'
  ).length;
  const activeBreakdowns = breakdowns.filter(
    (b) => b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  );

  const unreadNotifCount = officeNotifications.filter((n) => !n.read).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return { label: 'IN TRANSIT', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'ACCEPTED':
        return { label: 'ACCEPTED', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'AWAITING ACCEPTANCE', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'PENDING_ASSIGNMENT':
        return { label: 'UNASSIGNED', bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
      case 'DELIVERED':
        return { label: 'DELIVERED', bg: '#E0E7FF', text: '#4338CA', dot: '#6366F1' };
      default:
        return { label: status, bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={brand.logo} style={styles.logo} contentFit="contain" />
            <Text style={styles.officeNameText}>{office.name}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/transport-office/notifications' as any)}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.navy} />
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
              <Ionicons name="business" size={20} color={colors.navy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* WELCOME SECTION */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeGreeting}>Good Morning,</Text>
            <Text style={styles.welcomeName}>{office.managerName || 'Fleet Manager'}</Text>
            <Text style={styles.welcomeSub}>Fleet Telematics & Dispatch Operations Hub</Text>
          </View>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>OPERATIONAL</Text>
          </View>
        </View>

        {/* PROMINENT BREAKDOWN ALERT BANNER */}
        {activeBreakdowns.length > 0 && (
          <TouchableOpacity
            style={styles.breakdownAlertCard}
            activeOpacity={0.9}
            onPress={() =>
              router.push(`/transport-office/breakdowns/${activeBreakdowns[0].id}` as any)
            }
          >
            <View style={styles.alertHeaderRow}>
              <View style={styles.alertBadge}>
                <Ionicons name="warning" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
                <Text style={styles.alertBadgeText}>ACTIVE SOS BREAKDOWN</Text>
              </View>
              <Text style={styles.alertTime}>{activeBreakdowns[0].reportedAt}</Text>
            </View>

            <Text style={styles.alertTitle}>
              {activeBreakdowns[0].issueType} • {activeBreakdowns[0].vehicleNumber}
            </Text>
            <Text style={styles.alertDesc}>
              Driver: {activeBreakdowns[0].driverName} • Location: {activeBreakdowns[0].location}
            </Text>

            <View style={styles.alertActionRow}>
              <Text style={styles.alertActionText}>Coordinate Mechanic Assistance →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 6 KEY METRICS GRID */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Fleet Overview</Text>
          <Text style={styles.sectionSubTitle}>Real-time stats</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="cube-outline" size={20} color={colors.blue} />
            </View>
            <Text style={styles.statValue}>{activeShipmentsCount}</Text>
            <Text style={styles.statLabel}>Active Shipments</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.green} />
            </View>
            <Text style={styles.statValue}>{availableDriversCount}</Text>
            <Text style={styles.statLabel}>Available Drivers</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="navigate-outline" size={20} color={colors.orange} />
            </View>
            <Text style={styles.statValue}>{driversOnTripCount}</Text>
            <Text style={styles.statLabel}>Drivers On Trip</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="bus-outline" size={20} color={colors.navy} />
            </View>
            <Text style={styles.statValue}>{availableVehiclesCount}</Text>
            <Text style={styles.statLabel}>Available Vehicles</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="time-outline" size={20} color="#7E22CE" />
            </View>
            <Text style={styles.statValue}>{pendingAssignmentsCount}</Text>
            <Text style={styles.statLabel}>Pending Assignments</Text>
          </View>

          <View style={[styles.statCard, activeBreakdowns.length > 0 && styles.statCardAlert]}>
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: activeBreakdowns.length > 0 ? '#FEE2E2' : '#F1F5F9' },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
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
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/transport-office/drivers/add' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="person-add" size={20} color={colors.navy} />
            </View>
            <Text style={styles.quickActionLabel}>Add Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/transport-office/vehicles/add' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="add-circle" size={20} color={colors.orange} />
            </View>
            <Text style={styles.quickActionLabel}>Add Vehicle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/transport-office/shipments' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="git-branch" size={20} color={colors.green} />
            </View>
            <Text style={styles.quickActionLabel}>Assign Shipment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/transport-office/breakdowns' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="construct" size={20} color="#DC2626" />
            </View>
            <Text style={styles.quickActionLabel}>Breakdowns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/transport-office/history' as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="newspaper-outline" size={20} color={colors.slate} />
            </View>
            <Text style={styles.quickActionLabel}>Audit History</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* TODAY'S OPERATIONS / SHIPMENT CARDS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Shipments</Text>
          <TouchableOpacity onPress={() => router.push('/transport-office/shipments' as any)}>
            <Text style={styles.viewAllText}>View All ({shipments.length}) →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shipmentsList}>
          {shipments.slice(0, 3).map((shipment) => {
            const badge = getStatusBadge(shipment.status);
            const assignedDriver = drivers.find((d) => d.id === shipment.assignedDriverId);
            const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);

            return (
              <TouchableOpacity
                key={shipment.id}
                style={styles.shipmentCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/transport-office/shipments/${shipment.id}` as any)}
              >
                <View style={styles.shipmentHeader}>
                  <View style={styles.shipmentIdRow}>
                    <Text style={styles.shipmentIdText}>Shipment #{shipment.id}</Text>
                    <Text style={styles.cargoWeightText}>
                      {shipment.cargoWeightKg.toLocaleString()} KG
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeBox}>
                  <View style={styles.routePoint}>
                    <View style={styles.originDot} />
                    <Text style={styles.cityText}>{shipment.origin}</Text>
                  </View>
                  <View style={styles.routeConnector}>
                    <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
                  </View>
                  <View style={styles.routePoint}>
                    <View style={styles.destDot} />
                    <Text style={styles.cityText}>{shipment.destination}</Text>
                  </View>
                </View>

                <View style={styles.shipmentDetailsGrid}>
                  <View style={styles.shipmentDetailItem}>
                    <Text style={styles.detailLabel}>Assigned Driver</Text>
                    <Text style={styles.detailValue}>
                      {assignedDriver ? assignedDriver.name : 'Not Assigned'}
                    </Text>
                  </View>
                  <View style={styles.shipmentDetailItem}>
                    <Text style={styles.detailLabel}>Vehicle Asset</Text>
                    <Text style={styles.detailValue}>
                      {assignedVehicle ? assignedVehicle.vehicleNumber : 'Not Assigned'}
                    </Text>
                  </View>
                </View>

                {shipment.status === 'PENDING_ASSIGNMENT' && (
                  <TouchableOpacity
                    style={styles.assignNowBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/transport-office/shipments/assign',
                        params: { shipmentId: shipment.id },
                      } as any)
                    }
                  >
                    <Ionicons name="person-add-outline" size={14} color={colors.white} style={{ marginRight: 6 }} />
                    <Text style={styles.assignNowText}>Assign Driver & Vehicle</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Network Activity</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: colors.green }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={{ fontWeight: 'bold' }}>Kumar S.</Text> verified assignment for #HS1018
              </Text>
              <Text style={styles.activityTime}>35 mins ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: colors.blue }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                Vehicle <Text style={{ fontWeight: 'bold' }}>TN38CD5678</Text> departed Madurai hub
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.activityDot, { backgroundColor: colors.orange }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={{ fontWeight: 'bold' }}>Raj Heavy Truck Works</Text> completed maintenance check
              </Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
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
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logo: {
    width: 130,
    height: 38,
    marginBottom: 2,
  },
  officeNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.slate,
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
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
  badgeCount: {
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
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeSection: {
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
  welcomeGreeting: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  welcomeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
  },
  breakdownAlertCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: spacing.md,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  alertTime: {
    fontSize: 11,
    color: '#991B1B',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7F1D1D',
    marginTop: 2,
  },
  alertDesc: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: 2,
  },
  alertActionRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B91C1C',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
  },
  statCardAlert: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  statIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  quickActionButton: {
    alignItems: 'center',
    width: 78,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    textAlign: 'center',
  },
  shipmentsList: {
    gap: spacing.md,
  },
  shipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shipmentIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shipmentIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  cargoWeightText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    fontWeight: 'bold',
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginRight: 6,
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  cityText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  routeConnector: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  shipmentDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  shipmentDetailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  assignNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  assignNowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 12,
    color: colors.navy,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
