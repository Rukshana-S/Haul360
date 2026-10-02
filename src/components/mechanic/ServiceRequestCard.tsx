import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MechanicRequest } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface ServiceRequestCardProps {
  request: MechanicRequest;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  onPress,
  style,
}) => {
  const isEmergency = !!request.isEmergency;
  const isAccepted = request.status === 'ACCEPTED';
  const isRejected = request.status === 'REJECTED';

  const isCompleted = request.status === 'COMPLETED';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isEmergency && styles.emergencyCard,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Service request for ${request.vehicle}, driver ${request.driver}, amount ${request.amount}`}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          {isEmergency && (
            <View style={styles.sosBadge}>
              <Ionicons name="warning" size={11} color="#DC2626" style={{ marginRight: 3 }} />
              <Text style={styles.sosBadgeText}>EMERGENCY SOS</Text>
            </View>
          )}
          {isAccepted && (
            <View style={styles.acceptedBadge}>
              <Ionicons name="checkmark-circle" size={11} color="#166534" style={{ marginRight: 3 }} />
              <Text style={styles.acceptedBadgeText}>ACCEPTED</Text>
            </View>
          )}
          {isRejected && (
            <View style={styles.rejectedBadge}>
              <Ionicons name="close-circle" size={11} color="#991B1B" style={{ marginRight: 3 }} />
              <Text style={styles.rejectedBadgeText}>REJECTED</Text>
            </View>
          )}
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-done" size={11} color="#1E40AF" style={{ marginRight: 3 }} />
              <Text style={styles.completedBadgeText}>COMPLETED</Text>
            </View>
          )}
          {request.isScheduled && !isEmergency && !isAccepted && !isRejected && !isCompleted && (
            <View style={styles.scheduledBadge}>
              <Ionicons name="calendar-outline" size={11} color="#1D4ED8" style={{ marginRight: 3 }} />
              <Text style={styles.scheduledBadgeText}>
                {request.scheduledTime ? `SCHEDULED • ${request.scheduledTime}` : 'SCHEDULED'}
              </Text>
            </View>
          )}
          {!request.isScheduled && !isEmergency && !isAccepted && !isRejected && !isCompleted && (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={11} color="#B45309" style={{ marginRight: 3 }} />
              <Text style={styles.pendingBadgeText}>PENDING</Text>
            </View>
          )}
        </View>
        <Text style={styles.timeText}>{request.timeRequested}</Text>
      </View>

      <View style={styles.bodyRow}>
        <View style={[styles.iconBox, isEmergency && styles.emergencyIconBox]}>
          <Ionicons
            name={isEmergency ? 'flash' : 'car-sport-outline'}
            size={20}
            color={isEmergency ? '#DC2626' : colors.navy}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.vehicleTitle} numberOfLines={1}>
              {request.vehicle}
            </Text>
            <View style={styles.distanceBadge}>
              <Ionicons name="navigate-outline" size={10} color={colors.navy} style={{ marginRight: 2 }} />
              <Text style={styles.distanceText}>{request.distance}</Text>
            </View>
          </View>

          <Text style={styles.driverSubtext} numberOfLines={1}>
            {request.vehicleType} • Driver: {request.driver}
          </Text>

          <Text style={styles.problemText} numberOfLines={1}>
            {request.service}
          </Text>
        </View>
      </View>

      <View style={styles.footerDivider} />

      <View style={styles.footerRow}>
        <View style={styles.locationBox}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} style={{ marginRight: 3 }} />
          <Text style={styles.locationText} numberOfLines={1}>
            {request.location}
          </Text>
        </View>

        <View style={styles.amountActionRow}>
          <Text style={styles.amountText}>{request.amount}</Text>
          <View style={[styles.actionBtn, isEmergency && styles.emergencyActionBtn]}>
            <Text style={[styles.actionBtnText, isEmergency && styles.emergencyActionBtnText]}>
              {isAccepted ? 'View Job' : 'Review'}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={12}
              color={isEmergency ? '#FFFFFF' : colors.navy}
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  emergencyCard: {
    borderColor: '#FECACA',
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sosBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  acceptedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
  },
  rejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rejectedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#991B1B',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E40AF',
  },
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  scheduledBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emergencyIconBox: {
    backgroundColor: '#FEE2E2',
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    flex: 1,
    marginRight: spacing.xs,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  distanceText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.navy,
  },
  driverSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  problemText: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '500',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
  },
  amountActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amountText: {
    fontSize: 13,
    color: colors.navy,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  emergencyActionBtn: {
    backgroundColor: colors.navy,
  },
  emergencyActionBtnText: {
    color: '#FFFFFF',
  },
});

export default ServiceRequestCard;
