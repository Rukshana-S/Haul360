import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function AssignShipmentScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId?: string }>();
  const {
    shipments,
    drivers,
    vehicles,
    assignDriverAndVehicle,
    getShipmentById,
  } = useTransportOffice();

  // Find target shipment
  const targetShipment = shipmentId
    ? getShipmentById(shipmentId)
    : shipments.find((s) => s.status === 'PENDING_ASSIGNMENT') || shipments[0];

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!targetShipment) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>No Unassigned Shipment Selected</Text>
          <Button title="Back to Shipments" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const handleConfirmAssignment = () => {
    if (!selectedDriverId || !selectedVehicleId) {
      setErrorBanner('Please select both an eligible driver and a compliant vehicle asset.');
      return;
    }

    const res = assignDriverAndVehicle(targetShipment.id, selectedDriverId, selectedVehicleId);
    if (!res.success) {
      setErrorBanner(res.error || 'Assignment validation failed.');
      setShowConfirmModal(false);
      return;
    }

    setShowConfirmModal(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          </View>
          <Text style={styles.successTitle}>Assignment Dispatched</Text>
          <Text style={styles.successSubtitle}>
            Shipment <Text style={{ fontWeight: 'bold', color: colors.navy }}>#{targetShipment.id}</Text> assigned to <Text style={{ fontWeight: 'bold', color: colors.navy }}>{selectedDriver?.name}</Text> with vehicle <Text style={{ fontWeight: 'bold', color: colors.navy }}>{selectedVehicle?.vehicleNumber}</Text>.
          </Text>

          <View style={styles.dispatchSummaryCard}>
            <View style={styles.dispatchRow}>
              <Text style={styles.dispatchLabel}>Status</Text>
              <Text style={[styles.dispatchVal, { color: colors.orange }]}>
                Awaiting Driver Acceptance
              </Text>
            </View>
            <View style={styles.dispatchRow}>
              <Text style={styles.dispatchLabel}>Assigned Driver</Text>
              <Text style={styles.dispatchVal}>{selectedDriver?.name} ({selectedDriver?.id})</Text>
            </View>
            <View style={[styles.dispatchRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.dispatchLabel}>Assigned Vehicle</Text>
              <Text style={styles.dispatchVal}>{selectedVehicle?.vehicleNumber} ({selectedVehicle?.capacityKg.toLocaleString()} KG)</Text>
            </View>
          </View>

          <Button
            title="View Shipment Details"
            onPress={() => router.replace(`/transport-office/shipments/${targetShipment.id}` as any)}
            style={styles.actionButton}
          />
          <Button
            title="Return to Shipments List"
            variant="outline"
            onPress={() => router.replace('/transport-office/shipments' as any)}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assign Driver & Vehicle</Text>
          <View style={{ width: 24 }} />
        </View>

        {errorBanner && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorBanner}</Text>
          </View>
        )}

        {/* STEP 1: SHIPMENT SUMMARY */}
        <View style={styles.shipmentSummaryCard}>
          <View style={styles.shipmentHeaderRow}>
            <Text style={styles.shipmentId}>Shipment #{targetShipment.id}</Text>
            <View style={styles.weightBadge}>
              <Text style={styles.weightBadgeText}>
                Cargo: {targetShipment.cargoWeightKg.toLocaleString()} KG
              </Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeDotBlue} />
            <Text style={styles.routeText}>{targetShipment.origin}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} style={{ marginHorizontal: 8 }} />
            <View style={styles.routeDotGreen} />
            <Text style={styles.routeText}>{targetShipment.destination}</Text>
          </View>

          <View style={styles.cargoInfoRow}>
            <Text style={styles.cargoType}>{targetShipment.cargoType}</Text>
            <Text style={styles.minCapacityNote}>
              Required Min Capacity: {targetShipment.requiredCapacityKg.toLocaleString()} KG+
            </Text>
          </View>
        </View>

        {/* STEP 2: SELECT DRIVER */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>STEP 1</Text>
            </View>
            <Text style={styles.stepTitle}>Select Available Driver</Text>
          </View>
          <Text style={styles.stepSubtitle}>
            Only eligible, non-busy drivers can be selected for dispatch.
          </Text>

          <View style={styles.optionsList}>
            {drivers.map((driver) => {
              const isEligible = driver.availability === 'AVAILABLE';
              const isSelected = selectedDriverId === driver.id;

              return (
                <TouchableOpacity
                  key={driver.id}
                  disabled={!isEligible}
                  style={[
                    styles.driverOptionCard,
                    isSelected && styles.optionCardSelected,
                    !isEligible && styles.optionCardDisabled,
                  ]}
                  onPress={() => {
                    setErrorBanner(null);
                    setSelectedDriverId(driver.id);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                        !isEligible && styles.radioCircleDisabled,
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.optionName,
                          !isEligible && { color: colors.textSecondary },
                        ]}
                      >
                        {driver.name}
                      </Text>
                      <Text style={styles.optionSub}>
                        {driver.id} • DL: {driver.licenseNumber}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.eligibilityBadge,
                      isEligible
                        ? { backgroundColor: '#DCFCE7' }
                        : driver.availability === 'BUSY'
                        ? { backgroundColor: '#FEF3C7' }
                        : { backgroundColor: '#F1F5F9' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.eligibilityText,
                        isEligible
                          ? { color: '#15803D' }
                          : driver.availability === 'BUSY'
                          ? { color: '#B45309' }
                          : { color: '#64748B' },
                      ]}
                    >
                      {driver.availability === 'AVAILABLE'
                        ? 'Available'
                        : driver.availability === 'BUSY'
                        ? 'On Trip'
                        : driver.availability === 'ASSIGNMENT_PENDING'
                        ? 'Assigned'
                        : 'Offline'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* STEP 3: SELECT VEHICLE ASSET */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>STEP 2</Text>
            </View>
            <Text style={styles.stepTitle}>Select Compliant Vehicle</Text>
          </View>
          <Text style={styles.stepSubtitle}>
            Capacity must be ≥ {targetShipment.cargoWeightKg.toLocaleString()} KG and vehicle must be in yard available.
          </Text>

          <View style={styles.optionsList}>
            {vehicles.map((vehicle) => {
              const hasCapacity = vehicle.capacityKg >= targetShipment.cargoWeightKg;
              const isAvailable = vehicle.status === 'AVAILABLE';
              const isEligible = hasCapacity && isAvailable;
              const isSelected = selectedVehicleId === vehicle.id;

              let reason = '';
              if (!hasCapacity) {
                reason = `Capacity too low (${vehicle.capacityKg.toLocaleString()} KG < ${targetShipment.cargoWeightKg.toLocaleString()} KG)`;
              } else if (!isAvailable) {
                reason = vehicle.status === 'IN_TRIP' ? 'Currently In Trip' : vehicle.status === 'MAINTENANCE' ? 'In Maintenance' : 'Assigned';
              }

              return (
                <TouchableOpacity
                  key={vehicle.id}
                  disabled={!isEligible}
                  style={[
                    styles.vehicleOptionCard,
                    isSelected && styles.optionCardSelected,
                    !isEligible && styles.optionCardDisabled,
                  ]}
                  onPress={() => {
                    setErrorBanner(null);
                    setSelectedVehicleId(vehicle.id);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                        !isEligible && styles.radioCircleDisabled,
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.optionName,
                          !isEligible && { color: colors.textSecondary },
                        ]}
                      >
                        {vehicle.vehicleNumber}
                      </Text>
                      <Text style={styles.optionSub}>
                        {vehicle.vehicleType} • Payload: {vehicle.capacityKg.toLocaleString()} KG
                      </Text>
                      {!isEligible && (
                        <Text style={styles.ineligibleReasonText}>{reason}</Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.eligibilityBadge,
                      isEligible
                        ? { backgroundColor: '#DCFCE7' }
                        : { backgroundColor: '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.eligibilityText,
                        isEligible ? { color: '#15803D' } : { color: '#B91C1C' },
                      ]}
                    >
                      {isEligible ? 'Eligible' : 'Unavailable'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ASSIGN SUBMIT BUTTON */}
        <Button
          title="Review & Confirm Assignment →"
          disabled={!selectedDriverId || !selectedVehicleId}
          onPress={() => {
            setErrorBanner(null);
            setShowConfirmModal(true);
          }}
          style={styles.reviewBtn}
        />
      </ScrollView>

      {/* CONFIRMATION MODAL */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="git-branch" size={28} color={colors.navy} />
            </View>

            <Text style={styles.modalTitle}>Confirm Dispatch Assignment</Text>
            <Text style={styles.modalSubtitle}>
              Assign <Text style={{ fontWeight: 'bold' }}>{selectedDriver?.name}</Text> with vehicle <Text style={{ fontWeight: 'bold' }}>{selectedVehicle?.vehicleNumber}</Text> to Shipment <Text style={{ fontWeight: 'bold' }}>#{targetShipment.id}</Text>?
            </Text>

            <View style={styles.modalSummaryBox}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Route:</Text>
                <Text style={styles.modalVal}>{targetShipment.origin} → {targetShipment.destination}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Cargo / Weight:</Text>
                <Text style={styles.modalVal}>{targetShipment.cargoWeightKg.toLocaleString()} KG</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Vehicle Capacity:</Text>
                <Text style={styles.modalVal}>{selectedVehicle?.capacityKg.toLocaleString()} KG</Text>
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmAssignment}
              >
                <Text style={styles.confirmBtnText}>Confirm Dispatch</Text>
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
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '500',
  },
  shipmentSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  shipmentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  shipmentId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  weightBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  weightBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.blue,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  routeDotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginRight: 6,
  },
  routeDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  routeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  cargoInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cargoType: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  minCapacityNote: {
    fontSize: 11,
    color: colors.slate,
    fontWeight: '600',
  },
  stepSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepBadge: {
    backgroundColor: colors.navy,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  stepBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  stepSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  optionsList: {
    gap: spacing.xs,
  },
  driverOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vehicleOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionCardSelected: {
    borderColor: colors.navy,
    backgroundColor: '#EEF2FF',
  },
  optionCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F1F5F9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  radioCircleDisabled: {
    borderColor: '#CBD5E1',
  },
  optionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  optionSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  ineligibleReasonText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 2,
  },
  eligibilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  eligibilityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reviewBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  modalSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  modalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  dispatchSummaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  dispatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dispatchLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dispatchVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  actionButton: {
    width: '100%',
    backgroundColor: colors.navy,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
});
