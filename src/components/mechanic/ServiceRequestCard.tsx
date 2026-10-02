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
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Service request for ${request.vehicle}, driver ${request.driver}`}
    >
      <View style={styles.iconBox}>
        <Ionicons name="car-sport-outline" size={20} color={colors.navy} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.vehicleTitle} numberOfLines={1}>
            {request.vehicle}
          </Text>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{request.distance}</Text>
          </View>
        </View>

        <Text style={styles.driverSubtext} numberOfLines={1}>
          {request.vehicleType} • Driver: {request.driver}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.amountText}>{request.amount}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {request.location}
          </Text>
        </View>
      </View>

      <View style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>Review</Text>
        <Ionicons name="chevron-forward" size={13} color={colors.navy} style={{ marginLeft: 2 }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
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
  infoContainer: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    flex: 1,
    marginRight: spacing.xs,
  },
  distanceBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  distanceText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.navy,
  },
  driverSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '700',
  },
  dotSeparator: {
    color: '#94A3B8',
    marginHorizontal: 4,
    fontSize: 10,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: spacing.xs,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
});

export default ServiceRequestCard;
