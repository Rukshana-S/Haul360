import React, { useState } from 'react';
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
import { StatusBadge } from '@/components/driver/StatusBadge';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { BreakdownStatus } from '@/constants/driverMockData';

const BREAKDOWN_STAGES: { status: BreakdownStatus; label: string; desc: string }[] = [
  { status: 'REPORTED', label: 'Breakdown Reported', desc: 'Alert logged to Haul360 roadside dispatch' },
  { status: 'MECHANIC_REQUESTED', label: 'Broadcasting to Mechanics', desc: 'Searching certified highway workshops nearby' },
  { status: 'MECHANIC_ASSIGNED', label: 'Mechanic Assigned', desc: 'Workshop accepted dispatch and prepping repair kit' },
  { status: 'MECHANIC_ON_THE_WAY', label: 'Mechanic En Route', desc: 'Service van travelling to your GPS milestone' },
  { status: 'MECHANIC_ARRIVED', label: 'Mechanic On Site', desc: 'Inspecting vehicle engine & components' },
  { status: 'REPAIRING', label: 'Repair in Progress', desc: 'Replacing damaged parts and testing flow' },
  { status: 'READY_FOR_TESTING', label: 'Testing & Quality Check', desc: 'Engine diagnostic and idle verification' },
  { status: 'COMPLETED', label: 'Repair Certified & Done', desc: 'Truck ready for road. Driver can resume journey.' },
];

export default function BreakdownTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { breakdowns, logCall } = useDriver();
  const [callModalVisible, setCallModalVisible] = useState(false);

  const breakdown = breakdowns.find((b) => b.id === id) || breakdowns[0];

  if (!breakdown) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Record Not Found</Text>
        </View>
        <View style={styles.notFoundCenter}>
          <Text style={styles.notFoundText}>Breakdown record could not be found.</Text>
        </View>
      </Screen>
    );
  }

  const mechanic = breakdown.mechanic;
  const currentStageIndex = BREAKDOWN_STAGES.findIndex((s) => s.status === breakdown.status);

  const handleCallMechanic = () => {
    if (mechanic) {
      logCall(mechanic.name, 'Mechanic', mechanic.phone, 'OUTGOING', '1m 45s', breakdown.tripNumber);
    }
    setCallModalVisible(false);
    Alert.alert('Simulating Call', `Connecting to ${mechanic?.name || 'Mechanic'} at ${mechanic?.phone || '+91 98422 66778'}.`);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Breakdown #{breakdown.id}</Text>
          <Text style={styles.headerSubtitle}>Roadside Rescue & Repair Tracker</Text>
        </View>
        <StatusBadge status={breakdown.status} size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBannerLeft}>
            <Ionicons name="construct" size={24} color="#DC2626" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{breakdown.category}</Text>
              <Text style={styles.bannerSub}>
                Severity: {breakdown.severity} • {breakdown.vehicleNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* Assigned Mechanic Profile Card */}
        {mechanic ? (
          <View style={styles.mechanicCard}>
            <View style={styles.mechanicTop}>
              <View style={styles.mechanicAvatar}>
                <Ionicons name="person" size={24} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.mechanicNameRow}>
                  <Text style={styles.mechanicName}>{mechanic.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={colors.orange} />
                    <Text style={styles.ratingText}>{mechanic.rating}★</Text>
                  </View>
                </View>
                <Text style={styles.workshopName}>{mechanic.workshopName}</Text>
                <Text style={styles.etaText}>
                  📍 {mechanic.distanceKm} km away • Estimated Arrival: ~{mechanic.estimatedArrivalMinutes} mins
                </Text>
              </View>
            </View>

            <View style={styles.mechanicActions}>
              <TouchableOpacity
                style={styles.callMechanicBtn}
                onPress={() => setCallModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={16} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.callMechanicBtnText}>Call Mechanic ({mechanic.phone})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.searchingMechanicCard}>
            <Ionicons name="search" size={28} color={colors.orange} />
            <Text style={styles.searchingTitle}>Searching for Nearby Mechanics</Text>
            <Text style={styles.searchingSub}>
              Haul360 is dispatching certified workshops along NH 44 corridor.
            </Text>
          </View>
        )}

        {/* REPAIR LIFECYCLE STAGES TIMELINE */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeading}>Mechanic Repair Progress</Text>
            <Text style={styles.controlledNote}>Controlled by Mechanic</Text>
          </View>

          <View style={styles.timeline}>
            {BREAKDOWN_STAGES.map((stage, idx) => {
              const isDone = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <View key={stage.status} style={styles.stageRow}>
                  <View style={styles.stageMarkerCol}>
                    <View
                      style={[
                        styles.stageDot,
                        isDone && styles.stageDotDone,
                        isCurrent && styles.stageDotCurrent,
                      ]}
                    >
                      {isDone && !isCurrent && (
                        <Ionicons name="checkmark" size={12} color={colors.white} />
                      )}
                      {isCurrent && <View style={styles.stageInnerDot} />}
                    </View>
                    {idx < BREAKDOWN_STAGES.length - 1 && (
                      <View
                        style={[
                          styles.stageLine,
                          isDone && idx < currentStageIndex && styles.stageLineDone,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stageContent}>
                    <Text
                      style={[
                        styles.stageTitle,
                        isDone && styles.stageTitleDone,
                        isCurrent && styles.stageTitleCurrent,
                      ]}
                    >
                      {stage.label}
                    </Text>
                    <Text style={styles.stageDesc}>{stage.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Breakdown Description & Estimate */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Breakdown Incident Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{breakdown.locationAddress}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reported Time</Text>
            <Text style={styles.detailValue}>{breakdown.reportedAt}</Text>
          </View>

          {breakdown.description && (
            <View style={styles.notesBlock}>
              <Text style={styles.notesLabel}>Driver Description:</Text>
              <Text style={styles.notesText}>{breakdown.description}</Text>
            </View>
          )}

          {mechanic?.estimatedCost && (
            <View style={styles.costBox}>
              <Text style={styles.costLabel}>Estimated Repair Cost</Text>
              <Text style={styles.costAmount}>₹{mechanic.estimatedCost.toLocaleString('en-IN')}</Text>
            </View>
          )}
        </View>

        {/* Emergency SOS & Support Bar */}
        <TouchableOpacity
          style={styles.sosBanner}
          activeOpacity={0.85}
          onPress={() => router.push('/driver/sos' as any)}
        >
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <Text style={styles.sosBannerText}>Need Police / Highway Patrol Emergency SOS</Text>
          <Ionicons name="chevron-forward" size={16} color="#DC2626" />
        </TouchableOpacity>
      </ScrollView>

      {/* Call Mechanic Confirmation */}
      <ConfirmModal
        visible={callModalVisible}
        title="Call Mechanic?"
        message={`Dial ${mechanic?.name || 'Assigned Mechanic'} at ${mechanic?.phone || ''}?`}
        confirmText="Call"
        cancelText="Cancel"
        iconName="call-outline"
        iconColor={colors.navy}
        onConfirm={handleCallMechanic}
        onCancel={() => setCallModalVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  statusBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statusBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  bannerSub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },
  mechanicCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  mechanicTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  mechanicAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mechanicNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mechanicName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B45309',
  },
  workshopName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  etaText: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: '600',
    marginTop: 4,
  },
  mechanicActions: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  callMechanicBtn: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  callMechanicBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchingMechanicCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: spacing.md,
  },
  searchingTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B45309',
    marginTop: spacing.xs,
  },
  searchingSub: {
    fontSize: 11,
    color: '#92400E',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  controlledNote: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  timeline: {
    paddingVertical: spacing.xs,
  },
  stageRow: {
    flexDirection: 'row',
  },
  stageMarkerCol: {
    alignItems: 'center',
    width: 20,
    marginRight: spacing.sm,
  },
  stageDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDotDone: {
    backgroundColor: colors.green,
  },
  stageDotCurrent: {
    backgroundColor: colors.blue,
  },
  stageInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  stageLine: {
    width: 2,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stageLineDone: {
    backgroundColor: colors.green,
  },
  stageContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  stageTitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  stageTitleDone: {
    color: colors.navy,
    fontWeight: '600',
  },
  stageTitleCurrent: {
    color: colors.blue,
    fontWeight: 'bold',
    fontSize: 13,
  },
  stageDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  detailRow: {
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.navy,
    marginTop: 1,
  },
  notesBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  notesText: {
    fontSize: 12,
    color: colors.slate,
    marginTop: 2,
    lineHeight: 16,
  },
  costBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  costLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  costAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blue,
  },
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  sosBannerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
