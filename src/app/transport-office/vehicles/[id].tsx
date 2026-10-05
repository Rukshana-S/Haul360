import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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

export default function TransportOfficeVehicleDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getVehicleById,
    getDriverById,
    getShipmentById,
    markVehicleMaintenance,
  } = useTransportOffice();

  const vehicle = getVehicleById(id || '');

  if (!vehicle) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Vehicle Asset Not Found</Text>
          <Button title="Back to Vehicles" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const currentDriver = vehicle.currentDriverId ? getDriverById(vehicle.currentDriverId) : null;
  const currentShipment = vehicle.currentShipmentId ? getShipmentById(vehicle.currentShipmentId) : null;

  const isUnderMaintenance = vehicle.status === 'MAINTENANCE';

  const toggleMaintenance = () => {
    markVehicleMaintenance(vehicle.id, !isUnderMaintenance);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE FOR DISPATCH', bg: '#DCFCE7', text: '#15803D' };
      case 'ASSIGNED':
        return { label: 'ASSIGNED PENDING TRIP', bg: '#FEF3C7', text: '#B45309' };
      case 'IN_TRIP':
        return { label: 'ON ACTIVE TRIP', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'MAINTENANCE':
        return { label: 'UNDER WORKSHOP MAINTENANCE', bg: '#FEE2E2', text: '#B91C1C' };
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const badge = getStatusBadge(vehicle.status);

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
          <Text style={styles.headerTitle}>Vehicle Asset Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* HERO VEHICLE CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="bus" size={32} color={colors.navy} />
          </View>
          <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
          <Text style={styles.vehicleSub}>{vehicle.vehicleType} • {vehicle.model}</Text>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg, marginTop: spacing.sm }]}>
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* CURRENT DISPATCH INFO (SEPARATION FROM DRIVER) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Current Dispatch Assignment</Text>
            <Ionicons name="git-branch-outline" size={18} color={colors.navy} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Driver:</Text>
            <Text style={styles.infoValue}>
              {currentDriver ? currentDriver.name : 'None (Available in Yard)'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Shipment:</Text>
            <Text style={styles.infoValue}>
              {currentShipment ? `#${currentShipment.id} (${currentShipment.origin} → ${currentShipment.destination})` : 'None'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trip Status:</Text>
            <Text style={[styles.infoValue, { color: currentShipment ? colors.blue : colors.textSecondary }]}>
              {currentShipment ? currentShipment.status.replace(/_/g, ' ') : 'Parked / Yard Ready'}
            </Text>
          </View>

          {currentShipment && (
            <Button
              title="View Active Trip Dispatch →"
              onPress={() => router.push(`/transport-office/shipments/${currentShipment.id}` as any)}
              style={styles.actionBtn}
            />
          )}
        </View>

        {/* TECHNICAL SPECIFICATIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Technical Specifications</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payload Capacity:</Text>
            <Text style={styles.infoValue}>{vehicle.capacityKg.toLocaleString()} KG</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fuel Type:</Text>
            <Text style={styles.infoValue}>{vehicle.fuelType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Body & Axle Config:</Text>
            <Text style={styles.infoValue}>{vehicle.vehicleType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Inspection:</Text>
            <Text style={styles.infoValue}>{vehicle.lastMaintenanceDate || '15 Sep 2026'}</Text>
          </View>
        </View>

        {/* COMPLIANCE & LEGAL DOCUMENTS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Compliance & Permits</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>RC Certificate No.:</Text>
            <Text style={styles.infoValue}>{vehicle.rcNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Road Permit:</Text>
            <Text style={styles.infoValue}>
              {vehicle.permitStatus === 'NATIONAL_PERMIT' ? 'All India National Permit' : 'State Goods Carrier'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Insurance Policy:</Text>
            <View style={styles.validBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.green} />
              <Text style={styles.validBadgeText}>ACTIVE & VALID</Text>
            </View>
          </View>
        </View>

        {/* MAINTENANCE CONTROLS */}
        <View style={styles.maintenanceCard}>
          <Text style={styles.maintenanceTitle}>Fleet Asset Maintenance Mode</Text>
          <Text style={styles.maintenanceDesc}>
            {isUnderMaintenance
              ? 'This vehicle is marked under workshop maintenance and is excluded from dispatch assignment selection.'
              : 'Mark this vehicle for maintenance if undergoing inspection or servicing.'}
          </Text>

          <Button
            title={isUnderMaintenance ? 'Mark as Available (Complete Maintenance)' : 'Mark Vehicle Under Maintenance'}
            variant={isUnderMaintenance ? 'primary' : 'outline'}
            onPress={toggleMaintenance}
            style={{ marginTop: spacing.sm }}
          />
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
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  vehicleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
  },
  vehicleSub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '60%',
    textAlign: 'right',
  },
  validBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  validBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
    marginLeft: 3,
  },
  actionBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.sm,
  },
  maintenanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  maintenanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  maintenanceDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.xs,
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
