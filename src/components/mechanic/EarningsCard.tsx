import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Earning } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface EarningsCardProps {
  earning: Earning;
  style?: StyleProp<ViewStyle>;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ earning, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.iconBox}>
        <Ionicons name="wallet-outline" size={20} color={colors.navy} />
      </View>
      <View style={styles.info}>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {earning.service}
        </Text>
        <Text style={styles.subtext}>
          {earning.date} • {earning.status}
        </Text>
      </View>
      <Text style={styles.amountText}>+{earning.amount}</Text>
    </View>
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
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  subtext: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.green,
  },
});

export default EarningsCard;
