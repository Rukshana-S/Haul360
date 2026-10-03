import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  DimensionValue,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { EarningsCard } from '@/components/mechanic/EarningsCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useMechanic } from '@/context/MechanicContext';

const FILTER_OPTIONS = ['All', 'Settled', 'Pending'] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

export default function EarningsScreen() {
  const { earningsSummary, earningsTransactions, profile } = useMechanic();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [trendRange, setTrendRange] = useState<'7D' | '30D'>('7D');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(6); // Default to latest day

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'All') return earningsTransactions;
    if (activeFilter === 'Settled') {
      return earningsTransactions.filter((t) => t.status === 'SETTLED');
    }
    if (activeFilter === 'Pending') {
      return earningsTransactions.filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING');
    }
    return earningsTransactions;
  }, [earningsTransactions, activeFilter]);

  const settledCount = earningsTransactions.filter((t) => t.status === 'SETTLED').length;
  const pendingCount = earningsTransactions.filter(
    (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
  ).length;

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.title}>Earnings</Text>
          <Text style={styles.subtitle}>Track your service income and settlements.</Text>
        </View>
        <TouchableOpacity
          style={styles.statementBtn}
          onPress={() => router.push('/mechanic/service-history')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="View Service History"
        >
          <Ionicons name="document-text-outline" size={18} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Summary Grid (4 Areas) */}
        <View style={styles.summaryGrid}>
          {/* Today's Earnings (Primary Featured Card) */}
          <View style={styles.featuredSummaryCard}>
            <View style={styles.featuredTopRow}>
              <View>
                <Text style={styles.featuredLabel}>Today's Earnings</Text>
                <Text style={styles.featuredAmount}>{earningsSummary.today}</Text>
              </View>
              <View style={styles.featuredIconBox}>
                <Ionicons name="wallet" size={24} color={colors.orange} />
              </View>
            </View>
            <View style={styles.featuredFooter}>
              <View style={styles.dotGreen} />
              <Text style={styles.featuredFooterText}>
                Active SLA Settlement • Instant Wallet Ready
              </Text>
            </View>
          </View>

          {/* 3 Metrics Row: This Week, This Month, Pending Settlement */}
          <View style={styles.secondaryCardsRow}>
            {/* This Week */}
            <View style={styles.secondaryCard}>
              <Text style={styles.secondaryLabel}>This Week</Text>
              <Text style={styles.secondaryValue}>{earningsSummary.thisWeek}</Text>
              <Text style={styles.secondarySub}>7-day cycle</Text>
            </View>

            {/* This Month */}
            <View style={styles.secondaryCard}>
              <Text style={styles.secondaryLabel}>This Month</Text>
              <Text style={styles.secondaryValue}>{earningsSummary.thisMonth}</Text>
              <Text style={styles.secondarySub}>July 2026</Text>
            </View>

            {/* Pending Settlement */}
            <View style={[styles.secondaryCard, styles.pendingCard]}>
              <Text style={[styles.secondaryLabel, { color: '#92400E' }]}>Pending</Text>
              <Text style={[styles.secondaryValue, { color: '#B45309' }]}>
                {earningsSummary.pendingSettlement}
              </Text>
              <Text style={styles.secondarySub}>Escrow verified</Text>
            </View>
          </View>
        </View>

        {/* Lightweight Earnings Trend (Native Bars) */}
        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.trendTitle}>Earnings Trend</Text>
              <Text style={styles.trendSubtitle}>
                {selectedBarIndex !== null
                  ? `${earningsSummary.dailyTrend[selectedBarIndex].day}: ${earningsSummary.dailyTrend[selectedBarIndex].amount}`
                  : 'Daily payout distribution'}
              </Text>
            </View>
            <View style={styles.trendToggle}>
              <TouchableOpacity
                style={[styles.trendToggleBtn, trendRange === '7D' && styles.trendToggleBtnActive]}
                onPress={() => setTrendRange('7D')}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.trendToggleText, trendRange === '7D' && styles.trendToggleTextActive]}
                >
                  7 Days
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.trendToggleBtn, trendRange === '30D' && styles.trendToggleBtnActive]}
                onPress={() => setTrendRange('30D')}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.trendToggleText, trendRange === '30D' && styles.trendToggleTextActive]}
                >
                  30 Days
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Native Bar Chart */}
          <View style={styles.chartContainer}>
            {earningsSummary.dailyTrend.map((item, idx) => {
              const isSelected = selectedBarIndex === idx;
              const barHeight: DimensionValue = `${item.heightPct}%`;

              return (
                <TouchableOpacity
                  key={item.day}
                  style={styles.barCol}
                  onPress={() => setSelectedBarIndex(idx)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.day} earnings: ${item.amount}`}
                >
                  {isSelected && (
                    <View style={styles.barTooltip}>
                      <Text style={styles.barTooltipText}>{item.amount}</Text>
                    </View>
                  )}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: barHeight },
                        isSelected && styles.barFillSelected,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayLabel, isSelected && styles.barDayLabelSelected]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payout Bank Summary Box */}
        <View style={styles.payoutAccountCard}>
          <View style={styles.payoutIconBox}>
            <Ionicons name="business-outline" size={20} color={colors.navy} />
          </View>
          <View style={styles.payoutDetails}>
            <Text style={styles.payoutBankTitle}>{profile.bankName}</Text>
            <Text style={styles.payoutSubtext}>
              {profile.bankAccountMasked} • Direct GST Auto-Settlement
            </Text>
          </View>
          <View style={styles.directPill}>
            <Text style={styles.directPillText}>Auto-Disbursed</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionHeading}>Transaction History</Text>
          <View style={styles.filterTabsRow}>
            {FILTER_OPTIONS.map((f) => {
              const isSelected = activeFilter === f;
              const count =
                f === 'All'
                  ? earningsTransactions.length
                  : f === 'Settled'
                  ? settledCount
                  : pendingCount;

              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterTab, isSelected && styles.filterTabActive]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter ${f} transactions`}
                >
                  <Text style={[styles.filterTabText, isSelected && styles.filterTabTextActive]}>
                    {f} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="No Transactions Found"
            message={`There are no ${activeFilter.toLowerCase()} transactions at this time.`}
            iconName="wallet-outline"
          />
        ) : (
          filteredTransactions.map((earning) => (
            <EarningsCard
              key={earning.id}
              earning={earning}
              onPress={
                earning.jobId
                  ? () => router.push(`/mechanic/repair-details?id=${earning.jobId}` as any)
                  : undefined
              }
            />
          ))
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
    marginRight: spacing.md,
    padding: 4,
  },
  headerTitleBox: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  statementBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Summary Grid
  summaryGrid: {
    marginBottom: spacing.md,
  },
  featuredSummaryCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    elevation: 3,
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featuredLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
    fontWeight: '600',
  },
  featuredAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featuredIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  featuredFooterText: {
    fontSize: 10,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  secondaryCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pendingCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  secondaryLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  secondaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 2,
  },
  secondarySub: {
    fontSize: 9,
    color: '#94A3B8',
  },

  // Trend Card
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  trendSubtitle: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: '600',
    marginTop: 2,
  },
  trendToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  trendToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  trendToggleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  trendToggleTextActive: {
    color: colors.navy,
    fontWeight: '700',
  },

  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  barTooltip: {
    position: 'absolute',
    top: -18,
    backgroundColor: colors.navy,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  barTooltipText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  barTrack: {
    width: 14,
    height: 80,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#93C5FD',
    borderRadius: 7,
  },
  barFillSelected: {
    backgroundColor: colors.navy,
  },
  barDayLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '600',
  },
  barDayLabelSelected: {
    color: colors.navy,
    fontWeight: '800',
  },

  // Payout Account Card
  payoutAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  payoutIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  payoutDetails: {
    flex: 1,
  },
  payoutBankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  payoutSubtext: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  directPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  directPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
  },

  // Filters
  filterSection: {
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  filterTabActive: {
    backgroundColor: colors.navy,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
