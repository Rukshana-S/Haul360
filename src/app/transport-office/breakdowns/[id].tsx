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

export default function TransportOfficeBreakdownDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBreakdownById } = useTransportOffice();

  const incident = getBreakdownById(id || '');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/breakdowns' as any);
    }
  };

  if (!incident) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Breakdown Incident Not Found</Text>
          <Button title="Back to Breakdowns" onPress={handleBack} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const isMechanicRequested =
    incident.status !== 'REPORTED' && incident.status !== 'MECHANIC_REQUIRED';
  const isResolved = incident.status === 'RESOLVED' || incident.status === 'REPAIRED';

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incident #{incident.id}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* HERO ALERT CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.alertBadge}>
              <Ionicons name="warning" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
              <Text style={styles.alertBadgeText}>HIGH PRIORITY SOS</Text>
            </View>
            <Text style={styles.reportedTime}>{incident.reportedAt}</Text>
          </View>

          <Text style={styles.issueTitle}>{incident.issueType}</Text>
          <Text style={styles.locationText}>
            <Ionicons name="location-outline" size={14} color="#991B1B" /> {incident.location}
          </Text>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>CURRENT STATUS</Text>
            <Text style={styles.statusValue}>{incident.status.replace(/_/g, ' ')}</Text>
          </View>
        </View>

        {/* DRIVER MESSAGE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Driver Incident Report</Text>
          <Text style={styles.driverMessageText}>"{incident.description}"</Text>
        </View>

        {/* DRIVER & VEHICLE CONTEXT */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dispatch Asset Context</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver Name:</Text>
            <Text style={styles.infoValue}>{incident.driverName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver Contact:</Text>
            <Text style={styles.infoValue}>+91 {incident.driverPhone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Asset:</Text>
            <Text style={styles.infoValue}>{incident.vehicleNumber} ({incident.vehicleType})</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Shipment:</Text>
            <Text style={styles.infoValue}>#{incident.shipmentId} ({incident.route})</Text>
          </View>
        </View>

        {/* MECHANIC COORDINATION SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mechanic Dispatch & Assistance</Text>

          {isMechanicRequested ? (
            <View style={styles.mechanicActiveBox}>
              <View style={styles.mechanicHeader}>
                <Ionicons name="construct" size={20} color={colors.navy} />
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.mechanicName}>{incident.assignedMechanicName || 'Raj Heavy Truck Works'}</Text>
                  <Text style={styles.mechanicEta}>
                    Status: {incident.status.replace(/_/g, ' ')}
                  </Text>
                </View>
                <View style={styles.activeDot} />
              </View>

              <Button
                title="Track Live Repair Stages →"
                onPress={() =>
                  router.push({
                    pathname: '/transport-office/breakdowns/mechanic-status',
                    params: { breakdownId: incident.id },
                  } as any)
                }
                style={styles.trackBtn}
              />
            </View>
          ) : (
            <View style={styles.mechanicNeedBox}>
              <Text style={styles.mechanicNeedText}>
                No mechanic has been dispatched for this incident yet. Connect with nearby verified highway heavy mechanics.
              </Text>

              <Button
                title="Find Nearby Heavy Mechanic →"
                onPress={() =>
                  router.push({
                    pathname: '/transport-office/breakdowns/find-mechanic',
                    params: { breakdownId: incident.id },
                  } as any)
                }
                style={styles.findMechBtn}
              />
            </View>
          )}
        </View>

        {/* SEVERE BREAKDOWN: VEHICLE REPLACEMENT */}
        {!isResolved && (
          <View style={styles.replacementCard}>
            <Text style={styles.replacementTitle}>Severe Breakdown / Vehicle Unusable?</Text>
            <Text style={styles.replacementDesc}>
              If on-site repair is not feasible, dispatch a replacement vehicle asset from your yard so the driver can transfer cargo and resume the haul.
            </Text>

            <Button
              title="Replace Vehicle for Shipment"
              variant="outline"
              onPress={() =>
                router.push({
                  pathname: '/transport-office/breakdowns/replace-vehicle',
                  params: { breakdownId: incident.id },
                } as any)
              }
              style={{ marginTop: spacing.xs }}
            />
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
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: spacing.md,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  reportedTime: {
    fontSize: 11,
    color: '#991B1B',
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7F1D1D',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#991B1B',
    marginVertical: 4,
    fontWeight: '500',
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  driverMessageText: {
    fontSize: 13,
    color: colors.navy,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    maxWidth: '65%',
    textAlign: 'right',
  },
  mechanicNeedBox: {
    paddingVertical: spacing.xs,
  },
  mechanicNeedText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  findMechBtn: {
    backgroundColor: colors.navy,
  },
  mechanicActiveBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  mechanicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mechanicName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  mechanicEta: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  trackBtn: {
    backgroundColor: colors.navy,
  },
  replacementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  replacementTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  replacementDesc: {
    fontSize: 11,
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
