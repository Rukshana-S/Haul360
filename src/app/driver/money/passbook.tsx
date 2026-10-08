import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

type PassbookFilter = 'ALL' | 'CREDIT' | 'DEBIT' | 'SHIPMENT' | 'WITHDRAWAL' | 'REWARD' | 'FASTAG';

export default function DriverPassbookScreen() {
  const { transactions } = useDriver();
  const [filter, setFilter] = useState<PassbookFilter>('ALL');

  const filtered = transactions.filter((t) => {
    if (filter === 'ALL') return true;
    if (filter === 'CREDIT') return t.type === 'CREDIT';
    if (filter === 'DEBIT') return t.type === 'DEBIT';
    if (filter === 'SHIPMENT') return t.category === 'SHIPMENT_PAYMENT';
    if (filter === 'WITHDRAWAL') return t.category === 'WITHDRAWAL';
    if (filter === 'REWARD') return t.category === 'REWARD' || t.category === 'BONUS';
    if (filter === 'FASTAG') return t.category === 'FASTAG_RECHARGE';
    return true;
  });

  const filterTabs: { id: PassbookFilter; label: string }[] = [
    { id: 'ALL', label: 'All Transactions' },
    { id: 'CREDIT', label: 'Credits (+)' },
    { id: 'DEBIT', label: 'Debits (-)' },
    { id: 'SHIPMENT', label: 'Freight Settlements' },
    { id: 'WITHDRAWAL', label: 'Bank Payouts' },
    { id: 'REWARD', label: 'Rewards & Bonuses' },
    { id: 'FASTAG', label: 'FASTag Recharges' },
  ];

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Driver Passbook</Text>
          <Text style={styles.headerSubtitle}>Official Freight Ledger & Transaction History</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setFilter(tab.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.txnCard}>
            <View style={styles.txnTop}>
              <View style={styles.txnIconBox}>
                <Ionicons
                  name={
                    item.category === 'SHIPMENT_PAYMENT'
                      ? 'cube'
                      : item.category === 'WITHDRAWAL'
                      ? 'wallet'
                      : item.category === 'FASTAG_RECHARGE'
                      ? 'card'
                      : 'gift'
                  }
                  size={20}
                  color={colors.navy}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.txnTitle}>{item.title}</Text>
                <Text style={styles.txnDesc}>{item.description}</Text>
              </View>

              <View style={styles.amountCol}>
                <Text
                  style={[
                    styles.amountText,
                    { color: item.type === 'CREDIT' ? colors.green : '#DC2626' },
                  ]}
                >
                  {item.type === 'CREDIT' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                </Text>
                <StatusBadge status={item.status} size="sm" />
              </View>
            </View>

            <View style={styles.txnFooter}>
              <Text style={styles.refText}>ID: {item.transactionNumber}</Text>
              <Text style={styles.timestampText}>{item.date} • {item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Records Found"
            message="No transactions match your selected filter."
            iconName="receipt-outline"
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  filterBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: colors.navy,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  txnCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  txnTop: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  txnIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  txnDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  amountCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  txnFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 6,
    marginTop: 4,
  },
  refText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  timestampText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
