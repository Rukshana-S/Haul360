import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ShipmentStatus } from '@/constants/transportOfficeMockData';

interface ShipmentTimelineProps {
  status: ShipmentStatus;
  assignedDriverName?: string | null;
  assignedVehicleNumber?: string | null;
  createdAt?: string;
  expectedDelivery?: string;
}

export function ShipmentTimeline({
  status,
  assignedDriverName,
  assignedVehicleNumber,
  createdAt,
  expectedDelivery,
}: ShipmentTimelineProps) {
  // Step 1: ASSIGNED
  const isAssignedDone = status !== 'PENDING_ASSIGNMENT' && status !== 'CANCELLED';
  const isAssignedActive = status === 'PENDING_ASSIGNMENT';

  // Step 2: ACCEPTED
  const isAcceptedDone = ['ACCEPTED', 'IN_TRANSIT', 'DELIVERED'].includes(status);
  const isAcceptedActive = status === 'ASSIGNMENT_PENDING';

  // Step 3: IN PROGRESS / IN TRANSIT
  const isInProgressDone = status === 'DELIVERED';
  const isInProgressActive = status === 'IN_TRANSIT';

  // Step 4: DELIVERED
  const isDeliveredDone = status === 'DELIVERED';
  const isDeliveredActive = status === 'DELIVERED';

  const steps = [
    {
      key: 'ASSIGNED',
      title: 'Assigned Driver & Vehicle',
      time: isAssignedDone ? (createdAt || 'Completed') : '--',
      description: isAssignedDone
        ? assignedDriverName && assignedVehicleNumber
          ? `${assignedDriverName} • ${assignedVehicleNumber}`
          : 'Driver and vehicle assigned'
        : 'Pending fleet assignment',
      isDone: isAssignedDone && !isAssignedActive,
      isActive: isAssignedActive,
      isPending: !isAssignedDone && !isAssignedActive,
    },
    {
      key: 'ACCEPTED',
      title: 'Driver Acceptance',
      time: isAcceptedDone ? 'Accepted' : isAcceptedActive ? 'Awaiting confirmation' : '--',
      description: isAcceptedDone
        ? 'Accepted by driver • Ready for pickup'
        : isAcceptedActive
        ? 'Awaiting driver response'
        : 'Pending driver confirmation',
      isDone: isAcceptedDone && !isAcceptedActive,
      isActive: isAcceptedActive,
      isPending: !isAcceptedDone && !isAcceptedActive,
    },
    {
      key: 'IN_PROGRESS',
      title: 'In Progress (In Transit)',
      time: isInProgressDone ? 'En route completed' : isInProgressActive ? 'Live on Highway' : '--',
      description: isInProgressDone
        ? 'Highway haul completed'
        : isInProgressActive
        ? 'Cargo en route via highway transit'
        : 'Pending trip departure',
      isDone: isInProgressDone,
      isActive: isInProgressActive,
      isPending: !isInProgressDone && !isInProgressActive,
    },
    {
      key: 'DELIVERED',
      title: 'Delivered',
      time: isDeliveredDone ? (expectedDelivery || 'Delivered') : '--',
      description: isDeliveredDone
        ? 'Delivery inspection confirmed & signed off'
        : 'Destination delivery pending',
      isDone: isDeliveredDone,
      isActive: isDeliveredActive,
      isPending: !isDeliveredDone,
    },
  ];

  // Connectors
  const connector1Active = isAcceptedDone || isAcceptedActive;
  const connector2Active = isInProgressDone || isInProgressActive;
  const connector3Active = isDeliveredDone;

  const connectorStates = [connector1Active, connector2Active, connector3Active];

  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const lineActive = connectorStates[idx];

        return (
          <View key={step.key} style={styles.row}>
            <View style={styles.iconCol}>
              {step.isDone ? (
                <View style={styles.dotDone}>
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                </View>
              ) : step.isActive ? (
                <View style={styles.dotActive}>
                  <View style={styles.innerDotActive} />
                </View>
              ) : (
                <View style={styles.dotPending}>
                  <View style={styles.innerDotPending} />
                </View>
              )}

              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    lineActive ? styles.verticalLineActive : styles.verticalLinePending,
                  ]}
                />
              )}
            </View>

            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stepTitle,
                    step.isDone && styles.stepTitleDone,
                    step.isActive && styles.stepTitleActive,
                    step.isPending && styles.stepTitlePending,
                  ]}
                >
                  {step.title}
                </Text>
                <Text
                  style={[
                    styles.stepTime,
                    (step.isDone || step.isActive) && styles.stepTimeActive,
                  ]}
                >
                  {step.time}
                </Text>
              </View>

              <Text style={styles.stepDesc}>{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    minHeight: 56,
  },
  iconCol: {
    alignItems: 'center',
    width: 28,
    marginRight: spacing.md,
  },
  dotDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dotActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  innerDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  dotPending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  innerDotPending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  verticalLine: {
    width: 3,
    flex: 1,
    marginVertical: -2,
  },
  verticalLineActive: {
    backgroundColor: '#2563EB',
  },
  verticalLinePending: {
    backgroundColor: '#E2E8F0',
  },
  contentCol: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.navy,
  },
  stepTitleDone: {
    color: '#15803D',
    fontWeight: '700',
  },
  stepTitleActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  stepTitlePending: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  stepTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  stepTimeActive: {
    color: '#475569',
    fontWeight: '500',
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
