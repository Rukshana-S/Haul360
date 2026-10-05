import React from 'react';
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

export default function TransportOfficeDriverDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDriverById, getShipmentById, getVehicleById } = useTransportOffice();

  const driver = getDriverById(id || '');

  if (!driver) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Driver Not Found</Text>
          <Button title="Back to Driver Fleet" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const currentShipment = driver.currentShipmentId ? getShipmentById(driver.currentShipmentId) : null;
  const currentVehicle = driver.currentVehicleId ? getVehicleById(driver.currentVehicleId) : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE', bg: '#DCFCE7', text: '#15803D' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'ASSIGNED PENDING ACCEPTANCE', bg: '#FEF3C7', text: '#B45309' };
      case 'BUSY':
        return { label: 'ON ACTIVE TRIP', bg: '#DBEAFE', text: '#1D4ED8' };
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const badge = getStatusBadge(driver.availability);

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
          <Text style={styles.headerTitle}>Driver Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* HERO PROFILE CARD */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {driver.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.driverId}>ID: {driver.id}</Text>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg, marginTop: spacing.xs }]}>
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{driver.completedTripsCount}</Text>
              <Text style={styles.statLabel}>Completed Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>★ {driver.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Fleet Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{driver.experienceYears} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* CURRENT LIVE ASSIGNMENT (NOT PERMANENT) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Current Trip Assignment</Text>
            <Ionicons name="git-network-outline" size={18} color={colors.navy} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Shipment:</Text>
            <Text style={styles.infoValue}>
              {currentShipment ? `#${currentShipment.id} (${currentShipment.origin} → ${currentShipment.destination})` : 'None'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Assigned Vehicle:</Text>
            <Text style={styles.infoValue}>
              {currentVehicle ? `${currentVehicle.vehicleNumber} (${currentVehicle.vehicleType})` : 'None'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trip Status:</Text>
            <Text style={[styles.infoValue, { color: currentShipment ? colors.blue : colors.textSecondary }]}>
              {currentShipment ? currentShipment.status.replace(/_/g, ' ') : 'No Active Dispatch'}
            </Text>
          </View>

          {currentShipment && (
            <Button
              title="View Current Trip Details →"
              onPress={() => router.push(`/transport-office/shipments/${currentShipment.id}` as any)}
              style={styles.actionBtn}
            />
          )}

          {!currentShipment && driver.availability === 'AVAILABLE' && (
            <Button
              title="Assign Shipment to Driver"
              onPress={() => router.push('/transport-office/shipments' as any)}
              style={styles.actionBtn}
            />
          )}
        </View>

        {/* CONTACT & PERSONAL INFO */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal & Contact Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>+91 {driver.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{driver.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{driver.age} years old</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{driver.address}</Text>
          </View>
        </View>

        {/* DRIVING LICENSE & COMPLIANCE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>License Verification</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DL Number:</Text>
            <Text style={styles.infoValue}>{driver.licenseNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DL Expiry Date:</Text>
            <Text style={styles.infoValue}>{driver.licenseExpiry}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Document Status:</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color={colors.green} />
              <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
            </View>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => {}}
          >
            <Ionicons name="call" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.contactButtonText}>Call Driver</Text>
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
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  avatarLarge: {
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
  avatarLargeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
    marginLeft: 3,
  },
  actionBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.sm,
  },
  buttonGroup: {
    marginTop: spacing.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
