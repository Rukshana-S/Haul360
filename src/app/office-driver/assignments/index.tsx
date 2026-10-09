import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { DRIVER_DECLINE_REASONS } from '@/constants/transportOfficeDriverMockData';
import { ShipmentStatus } from '@/constants/transportOfficeMockData';

type AssignmentTabFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED';

export default function DriverAssignmentsInbox() {
  const {
    shipments,
    vehicles,
    currentDriverUser,
    acceptAssignment,
    declineAssignment,
  } = useTransportOffice();

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  // Canonical filtered assignments for this specific driver
  const myAssignments = shipments.filter((s) => {
    if (s.assignedDriverId === driverId) {
      return (
        s.status === 'ASSIGNMENT_PENDING' ||
        s.status === 'ACCEPTED' ||
        s.status === 'IN_TRANSIT' ||
        s.status === 'DELIVERED'
      );
    }
    if (s.declinedDriverId === driverId || (s.assignedDriverId === driverId && s.status === 'DECLINED')) {
      return s.status === 'DECLINED';
    }
    return false;
  });

  const [activeFilter, setActiveFilter] = useState<AssignmentTabFilter>('ALL');
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState(DRIVER_DECLINE_REASONS[0]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Dynamic counts derived from canonical driver assignments
  const pendingCount = myAssignments.filter(
    (s) => s.assignedDriverId === driverId && s.status === 'ASSIGNMENT_PENDING'
  ).length;

  const acceptedCount = myAssignments.filter(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT' || s.status === 'DELIVERED')
  ).length;

  const declinedCount = myAssignments.filter(
    (s) => s.status === 'DECLINED' && (s.declinedDriverId === driverId || s.assignedDriverId === driverId)
  ).length;

  const allCount = myAssignments.length;

  const filteredAssignments = myAssignments.filter((s) => {
    if (activeFilter === 'PENDING') {
      return s.assignedDriverId === driverId && s.status === 'ASSIGNMENT_PENDING';
    }
    if (activeFilter === 'ACCEPTED') {
      return (
        s.assignedDriverId === driverId &&
        (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT' || s.status === 'DELIVERED')
      );
    }
    if (activeFilter === 'DECLINED') {
      return s.status === 'DECLINED' && (s.declinedDriverId === driverId || s.assignedDriverId === driverId);
    }
    return true;
  });

  const handleAccept = (shipmentId: string) => {
    acceptAssignment(shipmentId);
    setSuccessToast(`Shipment #${shipmentId} Accepted! Ready for pickup.`);
    setTimeout(() => {
      setSuccessToast(null);
      router.push('/office-driver/trips/current' as any);
    }, 900);
  };

  const handleDeclineSubmit = () => {
    if (!declineTargetId) return;
    declineAssignment(declineTargetId, selectedDeclineReason);
    const target = declineTargetId;
    setDeclineTargetId(null);
    setSuccessToast(`Assignment #${target} declined. Transport Office notified.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'ASSIGNMENT_PENDING':
        return {
          label: 'PENDING ACCEPTANCE',
          bg: '#FEF3C7',
          text: '#B45309',
          icon: 'time-outline' as const,
        };
      case 'ACCEPTED':
        return {
          label: 'ACCEPTED',
          bg: '#DCFCE7',
          text: '#15803D',
          icon: 'checkmark-circle' as const,
        };
      case 'IN_TRANSIT':
        return {
          label: 'IN TRANSIT',
          bg: '#DBEAFE',
          text: '#1D4ED8',
          icon: 'navigate' as const,
        };
      case 'DELIVERED':
        return {
          label: 'DELIVERED',
          bg: '#E0E7FF',
          text: '#4338CA',
          icon: 'checkmark-done-circle' as const,
        };
      case 'DECLINED':
      default:
        return {
          label: 'DECLINED',
          bg: '#FEE2E2',
          text: '#B91C1C',
          icon: 'close-circle' as const,
        };
    }
  };

  const filterTabs: { key: AssignmentTabFilter; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: allCount },
    { key: 'PENDING', label: 'Pending', count: pendingCount },
    { key: 'ACCEPTED', label: 'Accepted', count: acceptedCount },
    { key: 'DECLINED', label: 'Declined', count: declinedCount },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Assignments</Text>
          <Text style={styles.headerSubtitle}>
            {myAssignments.length === 1
              ? '1 shipment assignment recorded'
              : `${myAssignments.length} shipment assignments recorded`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push('/office-driver/notifications' as any)}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {/* COMPACT HORIZONTAL FILTER PILLS */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* SUCCESS TOAST BANNER */}
      {successToast && (
        <View style={styles.toastBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{successToast}</Text>
        </View>
      )}

      {/* ASSIGNMENTS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAssignments.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={
                  activeFilter === 'PENDING'
                    ? 'mail-open-outline'
                    : activeFilter === 'ACCEPTED'
                    ? 'checkmark-done-circle-outline'
                    : activeFilter === 'DECLINED'
                    ? 'close-circle-outline'
                    : 'cube-outline'
                }
                size={38}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeFilter === 'PENDING'
                ? 'No pending assignments'
                : activeFilter === 'ACCEPTED'
                ? 'No accepted assignments'
                : activeFilter === 'DECLINED'
                ? 'No declined assignments'
                : 'No assignments yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'PENDING'
                ? 'New shipment assignments from your transport office will appear here.'
                : activeFilter === 'ACCEPTED'
                ? 'Accepted shipments ready for pickup or transit will appear here.'
                : activeFilter === 'DECLINED'
                ? 'Assignments you have declined will appear here for your records.'
                : 'No shipment dispatches have been assigned to your driver account.'}
            </Text>
          </View>
        ) : (
          filteredAssignments.map((shipment) => {
            const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);
            const isPending = shipment.status === 'ASSIGNMENT_PENDING';
            const isAccepted = shipment.status === 'ACCEPTED' || shipment.status === 'IN_TRANSIT';
            const isDeclined = shipment.status === 'DECLINED';
            const badge = getStatusBadge(shipment.status);

            return (
              <View key={shipment.id} style={styles.assignmentCard}>
                {/* RETURN LOAD IDENTIFIER BANNER */}
                {shipment.returnLoadForShipmentId && (
                  <View style={styles.returnLoadCardBanner}>
                    <Ionicons name="repeat" size={13} color="#1D4ED8" style={{ marginRight: 5 }} />
                    <Text style={styles.returnLoadCardBannerText}>
                      RETURN LOAD • REVERSE HAUL FOR #{shipment.returnLoadForShipmentId}
                    </Text>
                  </View>
                )}

                {/* ORGANIZATION & AMOUNT HEADER */}
                <View style={styles.cardOrgHeader}>
                  <View style={styles.orgTag}>
                    <Ionicons name="business" size={12} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.orgTagText}>{shipment.organizationName || 'ABC Exports'}</Text>
                  </View>
                  <View style={styles.amountWrap}>
                    <Text style={styles.amountLabelMini}>Amount</Text>
                    <Text style={styles.amountValueMini}>₹{(shipment.amount || 18500).toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* CARD STATUS HEADER */}
                <View style={styles.cardHeader}>
                  <View style={[styles.assignmentBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons
                      name={badge.icon}
                      size={13}
                      color={badge.text}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.assignmentBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>

                  <Text style={styles.shipmentId}>#{shipment.id}</Text>
                </View>

                {/* ROUTE BOX */}
                <View style={styles.routeBox}>
                  <View style={styles.routeCol}>
                    <View style={styles.dotRow}>
                      <View style={styles.dotOrigin} />
                      <Text style={styles.cityName}>{shipment.origin}</Text>
                    </View>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {shipment.originAddress}
                    </Text>
                  </View>

                  <View style={styles.routeArrow}>
                    <Ionicons name="arrow-forward" size={16} color={colors.navy} />
                    <Text style={styles.distanceText}>{shipment.distanceKm} KM</Text>
                  </View>

                  <View style={styles.routeCol}>
                    <View style={styles.dotRow}>
                      <View style={styles.dotDest} />
                      <Text style={styles.cityName}>{shipment.destination}</Text>
                    </View>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {shipment.destinationAddress}
                    </Text>
                  </View>
                </View>

                {/* MANIFEST SPECIFICATIONS */}
                <View style={styles.specsBox}>
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Cargo Description:</Text>
                    <Text style={styles.specValue} numberOfLines={1}>
                      {shipment.cargoType}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Cargo Weight:</Text>
                    <Text style={styles.specValue}>
                      {shipment.cargoWeightKg.toLocaleString()} KG
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Assigned Vehicle Asset:</Text>
                    <Text style={[styles.specValue, { fontWeight: 'bold', color: colors.navy }]}>
                      {assignedVehicle
                        ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})`
                        : shipment.assignedVehicleId
                        ? shipment.assignedVehicleId
                        : 'To be assigned'}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Pickup Date & Time:</Text>
                    <Text style={styles.specValue}>
                      {shipment.pickupDate || 'Today'} • {shipment.pickupTime}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Delivery Deadline:</Text>
                    <Text style={styles.specValue}>
                      {shipment.deliveryDate || 'Tomorrow'} • ETA: {shipment.expectedDelivery}
                    </Text>
                  </View>

                  {isDeclined && shipment.declineReason && (
                    <View style={[styles.specRow, styles.declineReasonRow]}>
                      <Text style={[styles.specLabel, { color: '#B91C1C', fontWeight: '600' }]}>
                        Decline Reason:
                      </Text>
                      <Text style={[styles.specValue, { color: '#B91C1C' }]}>
                        {shipment.declineReason}
                      </Text>
                    </View>
                  )}
                </View>

                {/* ACTION BUTTONS */}
                {isPending && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.declineBtn}
                      onPress={() => {
                        setSelectedDeclineReason(DRIVER_DECLINE_REASONS[0]);
                        setDeclineTargetId(shipment.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={16} color="#DC2626" style={{ marginRight: 4 }} />
                      <Text style={styles.declineBtnText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => handleAccept(shipment.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.acceptBtnText}>Accept Assignment</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isAccepted && (
                  <TouchableOpacity
                    style={styles.viewTripBtn}
                    onPress={() => router.push('/office-driver/trips/current' as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewTripBtnText}>Open Live Trip Tracker →</Text>
                  </TouchableOpacity>
                )}

                {isDeclined && (
                  <View style={styles.declinedNoticeBox}>
                    <Ionicons name="information-circle-outline" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
                    <Text style={styles.declinedNoticeText}>
                      Assignment declined. Transport Office notified for re-dispatch.
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* DECLINE CONFIRMATION & REASON MODAL */}
      <Modal
        visible={!!declineTargetId}
        transparent
        animationType="fade"
        onRequestClose={() => setDeclineTargetId(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="alert-circle" size={28} color="#DC2626" />
            </View>

            <Text style={styles.modalTitle}>Decline Assignment?</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to decline this shipment? Please select a reason so your Transport Office dispatch can assign an alternate driver.
            </Text>

            <View style={styles.reasonsList}>
              {DRIVER_DECLINE_REASONS.map((reason) => {
                const isSelected = selectedDeclineReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
                    onPress={() => setSelectedDeclineReason(reason)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeclineTargetId(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeclineBtn}
                onPress={handleDeclineSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmDeclineBtnText}>Confirm Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: spacing.xs,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersWrapper: {
    paddingVertical: 6,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  toastText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.green,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 40,
    gap: spacing.md,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.04)' as any,
  },
  returnLoadCardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    marginBottom: spacing.xs,
  },
  returnLoadCardBannerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  cardOrgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  orgTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  orgTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  amountLabelMini: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  amountValueMini: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  assignmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  assignmentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  routeCol: {
    flex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotOrigin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginRight: 4,
  },
  dotDest: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 4,
  },
  cityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  addressText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routeArrow: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  specsBox: {
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '60%',
    textAlign: 'right',
  },
  declineReasonRow: {
    backgroundColor: '#FEF2F2',
    padding: 6,
    borderRadius: radius.xs,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    paddingVertical: 10,
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 10,
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewTripBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  viewTripBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  declinedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  declinedNoticeText: {
    fontSize: 11,
    color: '#B91C1C',
    flex: 1,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  reasonsList: {
    width: '100%',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonOptionSelected: {
    borderColor: colors.navy,
    backgroundColor: '#EEF2FF',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  reasonText: {
    fontSize: 12,
    color: colors.navy,
  },
  reasonTextSelected: {
    fontWeight: 'bold',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  confirmDeclineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDeclineBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
