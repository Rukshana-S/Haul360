import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BidItem } from '@/constants/driverMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { StatusBadge } from './StatusBadge';

interface BidCardProps {
  bid: BidItem;
  onPress?: () => void;
  onWithdraw?: (bidId: string) => void;
}

export const BidCard: React.FC<BidCardProps> = ({ bid, onPress, onWithdraw }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/driver/bid/${bid.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={styles.headerRow}>
        <View style={styles.idBox}>
          <Text style={styles.bidIdText}>{bid.id}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.shipmentNumText}>{bid.shipmentNumber}</Text>
          {bid.isReturnLoad && (
            <View style={styles.returnBadge}>
              <Text style={styles.returnBadgeText}>RETURN</Text>
            </View>
          )}
        </View>

        <StatusBadge status={bid.status} size="sm" />
      </View>

      <Text style={styles.routeText}>{bid.route}</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>My Bid Amount</Text>
          <Text style={styles.bidAmount}>₹{bid.bidAmount.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Shipper Target</Text>
          <Text style={styles.targetAmount}>₹{bid.targetPayment.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Submitted</Text>
          <Text style={styles.timeText}>{bid.submittedAt}</Text>
        </View>
      </View>

      <View style={styles.shipperRow}>
        <View style={styles.shipperInfo}>
          <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.shipperName} numberOfLines={1}>
            {bid.shipperCompany}
          </Text>
        </View>

        <View style={styles.actionBlock}>
          {bid.status === 'PENDING' && onWithdraw && (
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={(e) => {
                e.stopPropagation();
                onWithdraw(bid.id);
              }}
            >
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-forward" size={16} color={colors.navy} style={{ marginLeft: 6 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.05)',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidIdText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  dot: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  shipmentNumText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  returnBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  returnBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  routeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginVertical: spacing.xs,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.sm,
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bidAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blue,
  },
  targetAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  shipperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  shipperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  shipperName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withdrawButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    backgroundColor: '#FEE2E2',
  },
  withdrawText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B91C1C',
  },
});
