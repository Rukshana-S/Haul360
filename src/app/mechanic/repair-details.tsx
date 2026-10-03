import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { ErrorState } from '@/components/ui/ErrorState';
import { useMechanic } from '@/context/MechanicContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { RepairJob } from '@/constants/mechanicMockData';

const REPAIR_STAGES: Array<{
  key: RepairJob['status'];
  label: string;
  description: string;
  actionText: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    key: 'Received',
    label: 'Request Accepted',
    description: 'Mechanic assigned & dispatched to highway coordinate',
    actionText: 'Mark Arrived & Begin Diagnosis',
    icon: 'location-outline',
  },
  {
    key: 'Diagnosing',
    label: 'Diagnostic Inspection',
    description: 'Pneumatic pressure & component root-cause check',
    actionText: 'Confirm Diagnosis & Start Repair',
    icon: 'search-outline',
  },
  {
    key: 'Repairing',
    label: 'Active Repair Work',
    description: 'Component overhaul, replacement & assembly in progress',
    actionText: 'Mark Ready for Testing',
    icon: 'construct-outline',
  },
  {
    key: 'Ready',
    label: 'Quality & Road Test',
    description: 'Pressure tolerance validation & system trial run',
    actionText: 'Sign Off & Complete Repair',
    icon: 'shield-checkmark-outline',
  },
  {
    key: 'Completed',
    label: 'Job Completed',
    description: 'Job verified, SLA honored, digital invoice generated',
    actionText: 'Completed',
    icon: 'checkmark-circle-outline',
  },
];

export default function RepairDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repairs, updateRepairStep, completeRepair, getRepairById } = useMechanic();
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  const repair = getRepairById(id || '') || repairs.find((r) => r.id === id) || repairs[0];

  if (!repair) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Repair Details</Text>
        </View>
        <ErrorState
          title="Repair Ticket Not Found"
          message="The requested repair job does not exist in your active queue."
          onRetry={() => router.replace('/mechanic/repairs')}
        />
      </Screen>
    );
  }

  // Calculate current stage index
  const currentStageIndex = REPAIR_STAGES.findIndex((s) => s.key === repair.status);
  const safeStageIndex = currentStageIndex === -1 ? 0 : currentStageIndex;
  const isCompleted = repair.status === 'Completed';

  const handleNextStage = async () => {
    try {
      if (safeStageIndex < REPAIR_STAGES.length - 2) {
        const nextIndex = safeStageIndex + 1;
        await updateRepairStep(repair.id, nextIndex);
        setLocalFeedback(`Stage updated: ${REPAIR_STAGES[nextIndex].label}`);
      } else if (safeStageIndex === REPAIR_STAGES.length - 2) {
        await completeRepair(repair.id);
        setLocalFeedback('Repair successfully finalized and signed off!');
      }
    } catch (err: any) {
      setLocalFeedback(err?.message || 'Unable to update repair stage. Please try again.');
    }
  };

  const getStatusBadgeStyle = (status: RepairJob['status']) => {
    switch (status) {
      case 'Completed':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'Ready':
        return { bg: '#EFF6FF', text: colors.navy };
      case 'Repairing':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'Diagnosing':
        return { bg: '#F3E8FF', text: '#6B21A8' };
      case 'Received':
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const badgeStyle = getStatusBadgeStyle(repair.status);

  return (
    <Screen safeArea style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Back to repairs"
        >
          <Ionicons name="arrow-back" size={22} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {isCompleted ? 'Completed Repair Job' : 'Active Repair Job'}
          </Text>
          <Text style={styles.headerSub}>Ticket #{repair.id}</Text>
        </View>
        <View style={[styles.statusBadgeTop, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.statusBadgeTextTop, { color: badgeStyle.text }]}>
            {repair.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live SLA & Progress Header Box */}
        <View style={[styles.slaBanner, isCompleted && styles.slaBannerCompleted]}>
          <View style={styles.slaTopRow}>
            <View style={styles.progressCol}>
              <Text style={styles.slaLabel}>
                {isCompleted ? 'Job Status' : 'Overall Completion'}
              </Text>
              <Text style={styles.progressValue}>
                {isCompleted ? '100% Settled' : `${repair.progress}%`}
              </Text>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.slaLabel}>
                {isCompleted ? 'SLA Fulfillment' : 'Elapsed Time'}
              </Text>
              <Text style={[styles.timeValue, isCompleted && styles.timeValueCompleted]}>
                {isCompleted ? 'Completed' : repair.timeElapsed}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${repair.progress}%`,
                  backgroundColor: isCompleted ? colors.green : colors.orange,
                },
              ]}
            />
          </View>
        </View>

        {/* 5-Stage Repair Progress Tracker */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="git-network-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Repair Lifecycle Tracker</Text>
            </View>
            <Text style={styles.stepCounterText}>
              Stage {safeStageIndex + 1} of {REPAIR_STAGES.length}
            </Text>
          </View>

          <View style={styles.stagesContainer}>
            {REPAIR_STAGES.map((stage, idx) => {
              const isDone = idx < safeStageIndex || isCompleted;
              const isCurrent = idx === safeStageIndex && !isCompleted;
              const isLast = idx === REPAIR_STAGES.length - 1;

              return (
                <View key={stage.key} style={styles.stageItem}>
                  <View style={styles.stageIndicatorCol}>
                    <View
                      style={[
                        styles.stageNode,
                        isDone && styles.stageNodeDone,
                        isCurrent && styles.stageNodeCurrent,
                      ]}
                    >
                      {isDone ? (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      ) : isCurrent ? (
                        <View style={styles.stageNodeInnerDot} />
                      ) : (
                        <Text style={styles.stageNodeNumber}>{idx + 1}</Text>
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.stageLine,
                          idx < safeStageIndex && styles.stageLineDone,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stageDetailsCol}>
                    <Text
                      style={[
                        styles.stageLabel,
                        isCurrent && styles.stageLabelCurrent,
                        isDone && styles.stageLabelDone,
                      ]}
                    >
                      {stage.label}
                    </Text>
                    <Text style={styles.stageDescription}>{stage.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Vehicle & Operator Info */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="car-sport-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Vehicle & Operator</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle</Text>
            <Text style={styles.infoValue}>{repair.vehicle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Operator / Driver</Text>
            <Text style={styles.infoValue}>{repair.driver}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dispatch Coordinate</Text>
            <Text style={styles.infoValue}>{repair.location}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Dispatch Time</Text>
            <Text style={styles.infoValue}>{repair.startTime}</Text>
          </View>
        </View>

        {/* Issue & Technical Diagnosis */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="construct-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Issue & Technical Diagnosis</Text>
            </View>
          </View>

          <View style={styles.diagBox}>
            <Text style={styles.diagTitle}>Reported Failure:</Text>
            <Text style={styles.diagText}>"{repair.service}"</Text>
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Diagnostic Assessment:</Text>
            <Text style={styles.notesText}>
              • Air line coupling connector pressure degradation at valve manifold.{'\n'}
              • Secondary pressure chamber stabilized to standard 8.5 bar specs.{'\n'}
              • Safety lock pins lubricated and torque-checked.
            </Text>
          </View>
        </View>

        {/* Parts & Materials Verified */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="cube-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Parts & Service Items</Text>
            </View>
            <Text style={styles.verifiedBadge}>Verified OE Parts</Text>
          </View>

          <View style={styles.partItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.partName}>Heavy Duty Hose Connector (12mm)</Text>
              <Text style={styles.partSub}>Part #HD-99201 • Qty: 2</Text>
            </View>
            <Text style={styles.partPrice}>₹850</Text>
          </View>

          <View style={styles.partItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.partName}>Airbrake Valve Seal Gasket Kit</Text>
              <Text style={styles.partSub}>Part #GK-3341 • Qty: 1</Text>
            </View>
            <Text style={styles.partPrice}>₹550</Text>
          </View>

          <View style={[styles.partItem, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.partName}>On-Site Certified Labor & Diagnostics</Text>
              <Text style={styles.partSub}>Master Technician Labor Tariff</Text>
            </View>
            <Text style={styles.partPrice}>₹1,000</Text>
          </View>
        </View>

        {/* Billing & Settlement Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="wallet-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Billing & Settlement Summary</Text>
            </View>
            <Text style={styles.estimatePill}>
              {isCompleted ? 'Finalized Payout' : 'Estimated Tariff'}
            </Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Base Labor Charge</Text>
            <Text style={styles.billValue}>₹1,000</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Parts & Consumables</Text>
            <Text style={styles.billValue}>₹1,400</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payout Value</Text>
            <Text style={styles.totalValue}>{repair.amount}</Text>
          </View>
          <Text style={styles.escrowNote}>
            {isCompleted
              ? '✓ Payout credited to your Haul360 settlement balance'
              : 'Direct fleet escrow settlement upon driver QR verification'}
          </Text>
        </View>

        {/* Local Feedback Notice */}
        {localFeedback && (
          <View style={styles.feedbackBox}>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginRight: 6 }} />
            <Text style={styles.feedbackText}>{localFeedback}</Text>
          </View>
        )}

        {/* Interactive Action Buttons */}
        {!isCompleted ? (
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={handleNextStage}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={REPAIR_STAGES[safeStageIndex].actionText}
          >
            <Ionicons
              name={REPAIR_STAGES[safeStageIndex].icon}
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryActionBtnText}>
              {REPAIR_STAGES[safeStageIndex].actionText}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedSection}>
            <View style={styles.completedBanner}>
              <Ionicons name="checkmark-circle" size={26} color="#166534" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.completedTitle}>Repair Successfully Completed</Text>
                <Text style={styles.completedSubtitle}>
                  SLA Target Met • Digital Inspection Certificate Issued
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.historyBtn}
              onPress={() => router.push('/mechanic/service-history')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="View in service history"
            >
              <Ionicons name="time-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.historyBtnText}>View in Service History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.queueBtn}
              onPress={() => router.push('/mechanic/repairs')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Back to repairs queue"
            >
              <Ionicons name="arrow-back" size={16} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.queueBtnText}>Back to Active Repairs</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
    marginRight: spacing.sm,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusBadgeTop: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeTextTop: {
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  slaBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  slaBannerCompleted: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  slaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  progressCol: {
    flex: 1,
  },
  timeCol: {
    alignItems: 'flex-end',
  },
  slaLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 2,
  },
  progressValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  timeValue: {
    color: '#FDBA74',
    fontSize: 15,
    fontWeight: '700',
  },
  timeValueCompleted: {
    color: colors.green,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  stepCounterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  stagesContainer: {
    paddingLeft: 4,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stageIndicatorCol: {
    alignItems: 'center',
    width: 28,
    marginRight: spacing.sm,
  },
  stageNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNodeDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  stageNodeCurrent: {
    backgroundColor: '#FEF3C7',
    borderColor: colors.orange,
  },
  stageNodeInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  stageNodeNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  stageLine: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stageLineDone: {
    backgroundColor: colors.green,
  },
  stageDetailsCol: {
    flex: 1,
    paddingBottom: 24,
  },
  stageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  stageLabelCurrent: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: 14,
  },
  stageLabelDone: {
    fontWeight: '600',
    color: colors.navy,
  },
  stageDescription: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  diagBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  diagTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  diagText: {
    fontSize: 13,
    color: colors.navy,
    fontStyle: 'italic',
  },
  notesBox: {
    backgroundColor: '#EFF6FF',
    padding: spacing.sm,
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 16,
  },
  verifiedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.green,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  partName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 1,
  },
  partSub: {
    fontSize: 10,
    color: '#64748B',
  },
  partPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  estimatePill: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  billLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  billValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  billDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.green,
  },
  escrowNote: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  feedbackText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: spacing.xs,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  completedSection: {
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  completedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  completedSubtitle: {
    fontSize: 11,
    color: '#15803D',
  },
  historyBtn: {
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  queueBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  queueBtnText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '700',
  },
});
