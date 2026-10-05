import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function ReplaceVehicleScreen() {
  const { breakdownId } = useLocalSearchParams<{ breakdownId?: string }>();
  const {
    breakdowns,
    vehicles,
    shipments,
    replaceVehicleForBreakdown,
    getBreakdownById,
    getShipmentById,
  } = useTransportOffice();

  const incident = breakdownId
    ? getBreakdownById(breakdownId)
    : breakdowns[0];

  const shipment = incident ? getShipmentById(incident.shipmentId) : null;
  const cargoWeight = shipment ? shipment.cargoWeightKg : 7500;

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!incident) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Incident Record Not Found</Text>
          <Button title="Back to Breakdowns" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const handleConfirmReplacement = () => {
    if (!selectedVehicleId) {
      setErrorBanner('Please select a replacement vehicle asset.');
      return;
    }

    const res = replaceVehicleForBreakdown(incident.id, selectedVehicleId);
    if (!res.success) {
      setErrorBanner(res.error || 'Failed to replace vehicle.');
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          </View>
          <Text style={styles.successTitle}>Replacement Vehicle Assigned</Text>
          <Text style={styles.successSubtitle}>
            Vehicle <Text style={{ fontWeight: 'bold', color: colors.navy }}>{selectedVehicle?.vehicleNumber}</Text> is now assigned to driver <Text style={{ fontWeight: 'bold', color: colors.navy }}>{incident.driverName}</Text> for Shipment <Text style={{ fontWeight: 'bold', color: colors.navy }}>#{incident.shipmentId}</Text>.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Disabled Vehicle</Text>
              <Text style={[styles.summaryVal, { color: '#B91C1C' }]}>{incident.vehicleNumber} (To Yard Maintenance)</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Replacement Asset</Text>
              <Text style={[styles.summaryVal, { color: colors.green }]}>{selectedVehicle?.vehicleNumber} ({selectedVehicle?.capacityKg.toLocaleString()} KG)</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Assigned Driver</Text>
              <Text style={styles.summaryVal}>{incident.driverName}</Text>
            </View>
          </View>

          <Button
            title="Return to Shipments"
            onPress={() => router.replace('/transport-office/shipments' as any)}
            style={styles.actionBtn}
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
          <Text style={styles.headerTitle}>Emergency Vehicle Replacement</Text>
          <View style={{ width: 24 }} />
        </View>

        {errorBanner && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorBanner}</Text>
          </View>
        )}

        {/* DISABLED CURRENT VEHICLE */}
        <View style={styles.disabledVehicleCard}>
          <Text style={styles.disabledHeader}>UNUSABLE / BROKEN DOWN ASSET</Text>
          <View style={styles.disabledRow}>
            <View>
              <Text style={styles.disabledVehicleNumber}>{incident.vehicleNumber}</Text>
              <Text style={styles.disabledVehicleSub}>{incident.vehicleType} • Issue: {incident.issueType}</Text>
            </View>
            <View style={styles.statusBadgeDisabled}>
              <Text style={styles.statusBadgeDisabledText}>UNAVAILABLE</Text>
            </View>
          </View>
        </View>

        {/* REPLACEMENT OPTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Yard Replacement Asset</Text>
          <Text style={styles.sectionSubtitle}>
            Must be in yard available and satisfy minimum cargo payload (≥ {cargoWeight.toLocaleString()} KG).
          </Text>
        </View>

        <View style={styles.optionsList}>
          {vehicles
            .filter((v) => v.id !== incident.vehicleId)
            .map((v) => {
              const hasCapacity = v.capacityKg >= cargoWeight;
              const isAvailable = v.status === 'AVAILABLE';
              const isEligible = hasCapacity && isAvailable;
              const isSelected = selectedVehicleId === v.id;

              return (
                <TouchableOpacity
                  key={v.id}
                  disabled={!isEligible}
                  style={[
                    styles.vehicleCard,
                    isSelected && styles.vehicleCardSelected,
                    !isEligible && styles.vehicleCardDisabled,
                  ]}
                  onPress={() => {
                    setErrorBanner(null);
                    setSelectedVehicleId(v.id);
                  }}
                >
                  <View style={styles.cardLeft}>
                    <View
                      style={[
                        styles.radio,
                        isSelected && styles.radioSelected,
                        !isEligible && styles.radioDisabled,
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.vehicleNumber,
                          !isEligible && { color: colors.textSecondary },
                        ]}
                      >
                        {v.vehicleNumber}
                      </Text>
                      <Text style={styles.vehicleSub}>
                        {v.vehicleType} • Payload: {v.capacityKg.toLocaleString()} KG
                      </Text>
                      {!hasCapacity && (
                        <Text style={styles.ineligibleText}>
                          Capacity {v.capacityKg.toLocaleString()} KG &lt; Cargo {cargoWeight.toLocaleString()} KG
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      isEligible ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isEligible ? { color: '#15803D' } : { color: '#B91C1C' },
                      ]}
                    >
                      {isEligible ? 'Available' : v.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>

        <Button
          title="Confirm Emergency Replacement →"
          disabled={!selectedVehicleId}
          onPress={handleConfirmReplacement}
          style={styles.submitBtn}
        />
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
  disabledVehicleCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: spacing.md,
  },
  disabledHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  disabledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledVehicleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7F1D1D',
  },
  disabledVehicleSub: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
  },
  statusBadgeDisabled: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusBadgeDisabledText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  sectionHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionsList: {
    gap: spacing.xs,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vehicleCardSelected: {
    borderColor: colors.navy,
    backgroundColor: '#EEF2FF',
  },
  vehicleCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F8FAFC',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  radioDisabled: {
    borderColor: '#CBD5E1',
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  vehicleSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  ineligibleText: {
    fontSize: 10,
    color: '#DC2626',
    marginTop: 2,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
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
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionBtn: {
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
