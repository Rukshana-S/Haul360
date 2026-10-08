import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';

interface StatusBadgeProps {
  status: string;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style, size = 'sm' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let bg = '#F1F5F9';
  let text = colors.slate;
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'AVAILABLE':
    case 'VERIFIED':
    case 'ACCEPTED':
    case 'DELIVERED':
    case 'COMPLETED':
    case 'PAID':
    case 'SUCCESS':
    case 'ACTIVE':
      bg = '#DCFCE7';
      text = '#15803D';
      break;

    case 'IN_TRANSIT':
    case 'EN_ROUTE_TO_PICKUP':
    case 'ARRIVED_AT_PICKUP':
    case 'LOADED':
    case 'ARRIVED_AT_DESTINATION':
    case 'MECHANIC_ASSIGNED':
    case 'MECHANIC_ON_THE_WAY':
    case 'REPAIRING':
    case 'READY_FOR_TESTING':
    case 'IN_PROGRESS':
    case 'ESCROW_LOCKED':
      bg = '#EFF6FF';
      text = '#1D4ED8';
      break;

    case 'PENDING':
    case 'BID_PLACED':
    case 'ASSIGNED':
    case 'MECHANIC_REQUESTED':
    case 'REPORTED':
    case 'OPEN':
      bg = '#FEF3C7';
      text = '#B45309';
      break;

    case 'BUSY':
    case 'EXPIRING':
    case 'LOW_BALANCE':
    case 'MEDIUM':
      bg = '#FFF7ED';
      text = '#C2410C';
      break;

    case 'REJECTED':
    case 'WITHDRAWN':
    case 'EXPIRED':
    case 'CANCELLED':
    case 'FAILED':
    case 'CRITICAL':
    case 'HIGH':
    case 'BLOCKED':
      bg = '#FEE2E2';
      text = '#B91C1C';
      break;

    case 'OFFLINE':
      bg = '#F1F5F9';
      text = '#64748B';
      break;

    default:
      bg = '#F1F5F9';
      text = colors.slate;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, paddingHorizontal: isSmall ? 8 : 12, paddingVertical: isSmall ? 3 : 6 },
        style,
      ]}
    >
      <Text style={[styles.badgeText, { color: text, fontSize: isSmall ? 11 : 13 }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: typography.weights.bold as any,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
