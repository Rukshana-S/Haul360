import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Earning, EarningTransaction } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface EarningsCardProps {
  earning: Earning | EarningTransaction;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ earning, onPress, style }) => {
  const isTransaction = 'rawAmount' in earning || 'jobId' in earning;
  const transaction = earning as EarningTransaction;

  const getStatusBadge = (status: string) => {
    const normalized = status.toUpperCase();
    switch (normalized) {
      case 'SETTLED':
      case 'COMPLETED':
        return {
          label: 'SETTLED',
          bg: '#DCFCE7',
          text: '#166534',
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
        };
      case 'PENDING':
        return {
          label: 'PENDING',
          bg: '#FEF3C7',
          text: '#92400E',
          icon: 'time' as keyof typeof Ionicons.glyphMap,
        };
      case 'PROCESSING':
      default:
        return {
          label: 'PROCESSING',
          bg: '#EFF6FF',
          text: '#1E3A8A',
          icon: 'sync-outline' as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const statusBadge = getStatusBadge(earning.status);

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`Transaction ${earning.service}, amount ${earning.amount}, status ${earning.status}`}
    >
      <View style={styles.topRow}>
        <View style={styles.idGroup}>
          {isTransaction && transaction.jobId ? (
            <View style={styles.jobIdBadge}>
              <Text style={styles.jobIdText}>{transaction.jobId}</Text>
            </View>
          ) : null}
          <Text style={styles.dateText}>{earning.date}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
          <Ionicons name={statusBadge.icon} size={11} color={statusBadge.text} style={{ marginRight: 3 }} />
          <Text style={[styles.statusBadgeText, { color: statusBadge.text }]}>{statusBadge.label}</Text>
        </View>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.info}>
          <Text style={styles.serviceTitle} numberOfLines={1}>
            {earning.service}
          </Text>
          {isTransaction && transaction.vehicle ? (
            <Text style={styles.vehicleText} numberOfLines={1}>
              {transaction.vehicle}
            </Text>
          ) : null}
          {isTransaction && transaction.paymentMethod ? (
            <Text style={styles.paymentMethodText} numberOfLines={1}>
              {transaction.paymentMethod}
            </Text>
          ) : null}
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>+{earning.amount}</Text>
          {onPress && (
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginTop: 4 }} />
          )}
        </View>
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobIdBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  jobIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  vehicleText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  paymentMethodText: {
    fontSize: 10,
    color: colors.blue,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.green,
  },
});

export default EarningsCard;
