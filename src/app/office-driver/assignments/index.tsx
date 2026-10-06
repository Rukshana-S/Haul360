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
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { DRIVER_DECLINE_REASONS } from '@/constants/transportOfficeDriverMockData';

export default function DriverAssignmentsInbox() {
  const {
    shipments,
    vehicles,
    currentDriverUser,
    acceptAssignment,
    declineAssignment,
  } = useTransportOffice();

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  // Assignments for this driver
  const myAssignments = shipments.filter(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ASSIGNMENT_PENDING' || s.status === 'ACCEPTED')
  );

  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'ACCEPTED' | 'ALL'>('PENDING');
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState(DRIVER_DECLINE_REASONS[0]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredAssignments = myAssignments.filter((s) => {
    if (activeFilter === 'PENDING') return s.status === 'ASSIGNMENT_PENDING';
    if (activeFilter === 'ACCEPTED') return s.status === 'ACCEPTED';
    return true;
  });

  const handleAccept = (shipmentId: string) => {
    acceptAssignment(shipmentId);
    setSuccessToast(`Shipment #${shipmentId} Accepted! Starting trip.`);
    setTimeout(() => {
      setSuccessToast(null);
      router.push('/office-driver/trips/current' as any);
    }, 800);
  };

  const handleDeclineSubmit = () => {
    if (!declineTargetId) return;
    declineAssignment(declineTargetId, selectedDeclineReason);
    setDeclineTargetId(null);
    setSuccessToast(`Assignment #${declineTargetId} declined. Notified Transport Office.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2000);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Assignments</Text>
          <Text style={styles.headerSubtitle}>
            {myAssignments.length} dispatches assigned to you
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push('/office-driver/notifications' as any)}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {/* COMPACT FILTER PILLS */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {(['PENDING', 'ACCEPTED', 'ALL'] as const).map((f) => {
            const isSelected = activeFilter === f;
            const count =
              f === 'ALL'
                ? myAssignments.length
                : f === 'PENDING'
                ? myAssignments.filter((s) => s.status === 'ASSIGNMENT_PENDING').length
                : myAssignments.filter((s) => s.status === 'ACCEPTED').length;

            const label = f === 'PENDING' ? 'Pending' : f === 'ACCEPTED' ? 'Accepted' : 'All';

            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {successToast && (
        <View style={styles.toastBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{successToast}</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAssignments.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="mail-open-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Assignments Found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'PENDING'
                ? 'You currently have no new shipments awaiting response.'
                : 'No assignments found in this category.'}
            </Text>
          </View>
        ) : (
          filteredAssignments.map((shipment) => {
            const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);
            const isPending = shipment.status === 'ASSIGNMENT_PENDING';

            return (
              <View key={shipment.id} style={styles.assignmentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.assignmentBadge}>
                    <Ionicons
                      name={isPending ? 'mail-unread' : 'checkmark-circle'}
                      size={14}
                      color={isPending ? '#B45309' : colors.green}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.assignmentBadgeText,
                        { color: isPending ? '#B45309' : colors.green },
                      ]}
                    >
                      {isPending ? 'NEW SHIPMENT ASSIGNMENT' : 'ACCEPTED ASSIGNMENT'}
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
                    <Text style={styles.addressText} numberOfLines={1}>{shipment.originAddress}</Text>
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
                    <Text style={styles.addressText} numberOfLines={1}>{shipment.destinationAddress}</Text>
                  </View>
                </View>

                {/* MANIFEST SPECS */}
                <View style={styles.specsBox}>
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Cargo Description:</Text>
                    <Text style={styles.specValue}>{shipment.cargoType}</Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Cargo Weight:</Text>
                    <Text style={styles.specValue}>{shipment.cargoWeightKg.toLocaleString()} KG</Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Assigned Vehicle Asset:</Text>
                    <Text style={[styles.specValue, { fontWeight: 'bold', color: colors.navy }]}>
                      {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'To be assigned'}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Pickup / Delivery Time:</Text>
                    <Text style={styles.specValue}>{shipment.pickupTime} • ETA: {shipment.expectedDelivery}</Text>
                  </View>
                </View>

                {/* ACCEPT / DECLINE BUTTONS */}
                {isPending ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.declineBtn}
                      onPress={() => setDeclineTargetId(shipment.id)}
                    >
                      <Ionicons name="close" size={16} color="#DC2626" style={{ marginRight: 4 }} />
                      <Text style={styles.declineBtnText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => handleAccept(shipment.id)}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.acceptBtnText}>Accept Assignment</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.viewTripBtn}
                    onPress={() => router.push('/office-driver/trips/current' as any)}
                  >
                    <Text style={styles.viewTripBtnText}>Open Live Trip Tracker →</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* DECLINE REASON MODAL */}
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

            <Text style={styles.modalTitle}>Decline Shipment Assignment</Text>
            <Text style={styles.modalSubtitle}>
              Please select a reason so your Transport Office dispatch can assign an alternate driver.
            </Text>

            <View style={styles.reasonsList}>
              {DRIVER_DECLINE_REASONS.map((reason) => {
                const isSelected = selectedDeclineReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
                    onPress={() => setSelectedDeclineReason(reason)}
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
              >
                <Text style={styles.cancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeclineBtn}
                onPress={handleDeclineSubmit}
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
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  assignmentBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
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
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
