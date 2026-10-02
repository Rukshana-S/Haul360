import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RepairJob } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface RepairCardProps {
  repair: RepairJob;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const RepairCard: React.FC<RepairCardProps> = ({ repair, onPress, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.statusDot} />
          <Text style={styles.ticketId}>Active Repair #{repair.id}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={12} color={colors.navy} style={{ marginRight: 3 }} />
          <Text style={styles.timeText}>{repair.timeElapsed}</Text>
        </View>
      </View>

      <View style={styles.vehicleRow}>
        <View style={styles.vehicleIconBox}>
          <Ionicons name="construct" size={20} color={colors.navy} />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName} numberOfLines={1}>
            {repair.vehicle}
          </Text>
          <Text style={styles.driverText} numberOfLines={1}>
            Customer: {repair.driver}
          </Text>
          <Text style={styles.serviceStage} numberOfLines={1}>
            Stage: {repair.service}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Status: {repair.status}</Text>
          <Text style={styles.progressPercent}>{repair.progress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, repair.progress))}%` }]} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} style={{ marginRight: 3 }} />
          <Text style={styles.locationText} numberOfLines={1}>
            {repair.location}
          </Text>
        </View>
        <Text style={styles.amountText}>Est. {repair.amount}</Text>
      </View>

      <TouchableOpacity
        style={styles.openJobBtn}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Open job sheet for repair ticket ${repair.id}`}
      >
        <Ionicons name="document-text-outline" size={15} color={colors.navy} style={{ marginRight: 6 }} />
        <Text style={styles.openJobBtnText}>Open Active Job Sheet & Diagnostics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.navy,
    marginRight: 6,
  },
  ticketId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  vehicleIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  driverText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  serviceStage: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.navy,
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  openJobBtn: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openJobBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
});

export default RepairCard;
