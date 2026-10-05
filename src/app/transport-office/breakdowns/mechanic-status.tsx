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
import { BreakdownStatus } from '@/constants/transportOfficeMockData';

const STAGES: Array<{ key: BreakdownStatus; title: string; desc: string }> = [
  { key: 'MECHANIC_REQUESTED', title: 'Request Sent', desc: 'Awaiting mechanic confirmation' },
  { key: 'MECHANIC_ACCEPTED', title: 'Mechanic Accepted', desc: 'Dispatched from workshop' },
  { key: 'MECHANIC_ON_WAY', title: 'Mechanic On The Way', desc: 'En route with service van' },
  { key: 'MECHANIC_ARRIVED', title: 'Mechanic Arrived', desc: 'On-site vehicle inspection' },
  { key: 'DIAGNOSING', title: 'Diagnosing Problem', desc: 'Scanning engine & systems' },
  { key: 'REPAIRING', title: 'Repair In Progress', desc: 'Part replacement & tuning' },
  { key: 'REPAIRED', title: 'Repair Completed', desc: 'Vehicle tested & roadworthy' },
  { key: 'RESOLVED', title: 'Resolved', desc: 'Driver cleared to resume haul' },
];

export default function MechanicStatusScreen() {
  const { breakdownId } = useLocalSearchParams<{ breakdownId?: string }>();
  const { breakdowns, progressMechanicStatus, getBreakdownById } = useTransportOffice();

  const incident = breakdownId
    ? getBreakdownById(breakdownId)
    : breakdowns[0];

  if (!incident) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Incident Not Found</Text>
          <Button title="Back to Breakdowns" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === incident.status);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const isCompleted = incident.status === 'REPAIRED' || incident.status === 'RESOLVED';

  const handleSimulateNextStage = () => {
    progressMechanicStatus(incident.id);
  };

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
          <Text style={styles.headerTitle}>Mechanic Live Tracking</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* MECHANIC SUMMARY CARD */}
        <View style={styles.mechHeroCard}>
          <View style={styles.mechAvatarCircle}>
            <Ionicons name="construct" size={28} color={colors.navy} />
          </View>
          <Text style={styles.mechName}>
            {incident.assignedMechanicName || 'Raj Heavy Truck Works'}
          </Text>
          <Text style={styles.incidentSub}>
            Assigned to Breakdown #{incident.id} • {incident.vehicleNumber}
          </Text>

          <View style={styles.etaBadge}>
            <Ionicons name="time" size={14} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.etaBadgeText}>
              {isCompleted ? 'SERVICE COMPLETED' : `ETA: ~${incident.mechanicEtaMinutes || 18} mins`}
            </Text>
          </View>
        </View>

        {/* TIMELINE STAGES */}
        <View style={styles.stagesCard}>
          <Text style={styles.stagesCardTitle}>Live Assistance Progression</Text>

          <View style={styles.timelineList}>
            {STAGES.map((stage, idx) => {
              const isPastOrCurrent = idx <= activeIndex;
              const isCurrent = idx === activeIndex;
              const isLast = idx === STAGES.length - 1;

              return (
                <View key={stage.key} style={styles.timelineItem}>
                  <View style={styles.timelineIconCol}>
                    <View
                      style={[
                        styles.timelineCircle,
                        isPastOrCurrent && styles.timelineCircleActive,
                        isCurrent && styles.timelineCircleCurrent,
                      ]}
                    >
                      {isPastOrCurrent ? (
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      ) : (
                        <View style={styles.timelineCirclePending} />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineBar,
                          isPastOrCurrent && idx < activeIndex && styles.timelineBarActive,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineContentCol}>
                    <Text
                      style={[
                        styles.stageTitle,
                        isCurrent && styles.stageTitleCurrent,
                        !isPastOrCurrent && styles.stageTitlePending,
                      ]}
                    >
                      {stage.title}
                    </Text>
                    <Text style={styles.stageDesc}>{stage.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* SIMULATE PROGRESSION CONTROL */}
        <View style={styles.simulationControlBox}>
          <Text style={styles.simLabel}>Operations & Simulation Actions</Text>
          {!isCompleted ? (
            <Button
              title="Advance Mechanic Repair Stage →"
              onPress={handleSimulateNextStage}
              style={styles.advanceBtn}
            />
          ) : (
            <View style={styles.completedNotice}>
              <Ionicons name="checkmark-circle" size={24} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.completedText}>
                Repair complete! Driver has been notified to inspect and resume the haul.
              </Text>
            </View>
          )}

          <Button
            title="Replace Vehicle Asset (Severe Fault)"
            variant="outline"
            onPress={() =>
              router.push({
                pathname: '/transport-office/breakdowns/replace-vehicle',
                params: { breakdownId: incident.id },
              } as any)
            }
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
  mechHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  mechAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  mechName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  incidentSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  etaBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  stagesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  stagesCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  timelineList: {
    paddingVertical: spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCircleActive: {
    backgroundColor: colors.navy,
  },
  timelineCircleCurrent: {
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  timelineCirclePending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  timelineBar: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  timelineBarActive: {
    backgroundColor: colors.navy,
  },
  timelineContentCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  stageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  stageTitleCurrent: {
    fontWeight: 'bold',
    color: colors.orange,
  },
  stageTitlePending: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
  stageDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  simulationControlBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  simLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  advanceBtn: {
    backgroundColor: colors.navy,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  completedText: {
    flex: 1,
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
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
