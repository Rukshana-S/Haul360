import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { MoneyTransaction, RewardItem } from '@/constants/driverMockData';

type MoneySubView = 'BALANCE' | 'REWARDS' | 'EARNINGS' | 'PASSBOOK';
type EarningTimeframe = 'WEEK' | 'MONTH' | 'LAST_MONTH' | 'ALL_TIME';

export default function DriverMoneyHubScreen() {
  const {
    moneyBalance,
    pendingBalance,
    withdrawableBalance,
    todayEarnings,
    weekEarnings,
    monthEarnings,
    transactions,
    rewards,
    rewardHistory,
    rewardPoints,
    claimReward,
  } = useDriver();

  const [activeTab, setActiveTab] = useState<MoneySubView>('BALANCE');
  const [earningPeriod, setEarningPeriod] = useState<EarningTimeframe>('MONTH');
  const [passbookFilter, setPassbookFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT' | 'SHIPMENT' | 'REWARD' | 'WITHDRAWAL'>('ALL');
  const [selectedRewardToClaim, setSelectedRewardToClaim] = useState<RewardItem | null>(null);

  // Filtered passbook transactions
  const filteredTransactions = transactions.filter((t) => {
    if (passbookFilter === 'ALL') return true;
    if (passbookFilter === 'CREDIT') return t.type === 'CREDIT';
    if (passbookFilter === 'DEBIT') return t.type === 'DEBIT';
    if (passbookFilter === 'SHIPMENT') return t.category === 'SHIPMENT_PAYMENT';
    if (passbookFilter === 'REWARD') return t.category === 'REWARD' || t.category === 'BONUS';
    if (passbookFilter === 'WITHDRAWAL') return t.category === 'WITHDRAWAL';
    return true;
  });

  const handleClaimRewardConfirm = () => {
    if (selectedRewardToClaim) {
      const res = claimReward(selectedRewardToClaim.id);
      setSelectedRewardToClaim(null);
      if (res.success) {
        Alert.alert('Perk Activated!', res.message);
      } else {
        Alert.alert('Unable to Claim', res.message);
      }
    }
  };

  const getEarningsForPeriod = () => {
    switch (earningPeriod) {
      case 'WEEK':
        return { total: weekEarnings, trips: 2, bonuses: 1500, rewards: 500, paid: weekEarnings };
      case 'MONTH':
        return { total: monthEarnings, trips: 4, bonuses: 3500, rewards: 1200, paid: monthEarnings - pendingBalance };
      case 'LAST_MONTH':
        return { total: 128000, trips: 4, bonuses: 2000, rewards: 800, paid: 128000 };
      case 'ALL_TIME':
      default:
        return { total: 420000, trips: 14, bonuses: 12000, rewards: 4500, paid: 381500 };
    }
  };

  const currentEarnings = getEarningsForPeriod();

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Driver Money Hub</Text>
          <Text style={styles.headerSubtitle}>Passbook, Wallet Balance, Rewards & Earnings</Text>
        </View>
      </View>

      {/* Primary Sub-Navigation Tabs: EXACTLY Account Balance, Rewards, Earnings, Passbook */}
      <View style={styles.subNavBar}>
        {(
          [
            { id: 'BALANCE', label: 'Balance' },
            { id: 'REWARDS', label: 'Rewards' },
            { id: 'EARNINGS', label: 'Earnings' },
            { id: 'PASSBOOK', label: 'Passbook' },
          ] as { id: MoneySubView; label: string }[]
        ).map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.subTabItem, isSelected && styles.subTabItemActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.subTabText, isSelected && styles.subTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================================================== */}
        {/* VIEW 1: ACCOUNT BALANCE */}
        {/* ==================================================== */}
        {activeTab === 'BALANCE' && (
          <>
            <View style={styles.balanceHero}>
              <Text style={styles.balanceHeroLabel}>Total Available Balance</Text>
              <Text style={styles.balanceHeroAmount}>₹{moneyBalance.toLocaleString('en-IN')}</Text>

              <View style={styles.balanceMetaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Withdrawable Now</Text>
                  <Text style={styles.metaValGreen}>₹{withdrawableBalance.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>In Escrow Settlement</Text>
                  <Text style={styles.metaValOrange}>₹{pendingBalance.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <View style={styles.heroActionRow}>
                <TouchableOpacity
                  style={styles.withdrawActionBtn}
                  onPress={() => router.push('/driver/money/withdraw' as any)}
                >
                  <Ionicons name="arrow-up-circle-outline" size={18} color={colors.white} style={{ marginRight: 6 }} />
                  <Text style={styles.withdrawActionBtnText}>Withdraw Funds</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.passbookShortcutBtn}
                  onPress={() => setActiveTab('PASSBOOK')}
                >
                  <Ionicons name="receipt-outline" size={16} color={colors.white} style={{ marginRight: 4 }} />
                  <Text style={styles.passbookShortcutBtnText}>View Passbook</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Linked Bank Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeading}>Payout Bank Account</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#15803D" />
                  <Text style={styles.verifiedText}>IMPS ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.bankName}>HDFC Bank Ltd. (Coimbatore Main Branch)</Text>
              <Text style={styles.accNum}>A/C: **********4821 • IFSC: HDFC0001249</Text>
            </View>

            {/* Recent Transactions Snippet */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeading}>Recent Passbook Activity</Text>
                <TouchableOpacity onPress={() => setActiveTab('PASSBOOK')}>
                  <Text style={styles.viewAllBlue}>See All</Text>
                </TouchableOpacity>
              </View>

              {transactions.slice(0, 3).map((txn) => (
                <View key={txn.id} style={styles.txnRow}>
                  <View style={styles.txnIconCircle}>
                    <Ionicons
                      name={txn.type === 'CREDIT' ? 'arrow-down' : 'arrow-up'}
                      size={16}
                      color={txn.type === 'CREDIT' ? colors.green : '#DC2626'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txnTitle} numberOfLines={1}>{txn.title}</Text>
                    <Text style={styles.txnDate}>{txn.date} • {txn.time}</Text>
                  </View>
                  <Text
                    style={[
                      styles.txnAmount,
                      { color: txn.type === 'CREDIT' ? colors.green : '#DC2626' },
                    ]}
                  >
                    {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ==================================================== */}
        {/* VIEW 2: REWARDS */}
        {/* ==================================================== */}
        {activeTab === 'REWARDS' && (
          <>
            <View style={styles.rewardHero}>
              <View style={styles.rewardHeroTop}>
                <View>
                  <Text style={styles.rewardHeroLabel}>Driver Club Rewards</Text>
                  <Text style={styles.rewardPointsVal}>{rewardPoints} Points</Text>
                </View>
                <View style={styles.tierBadge}>
                  <Ionicons name="trophy" size={16} color="#B45309" />
                  <Text style={styles.tierText}>GOLD TIER</Text>
                </View>
              </View>

              {/* Progress to Next Tier */}
              <View style={styles.tierProgressBlock}>
                <View style={styles.tierProgressRow}>
                  <Text style={styles.tierProgressLabel}>Progress to Platinum Tier</Text>
                  <Text style={styles.tierProgressCount}>{rewardPoints} / 2,500 Pts</Text>
                </View>
                <View style={styles.tierTrack}>
                  <View style={[styles.tierFill, { width: `${Math.min(100, (rewardPoints / 2500) * 100)}%` }]} />
                </View>
              </View>
            </View>

            {/* Available Vouchers */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Available Reward Vouchers & Perks</Text>

              {rewards.map((reward) => (
                <View key={reward.id} style={styles.rewardCardItem}>
                  <View style={styles.rewardLeft}>
                    <View style={styles.rewardIconCircle}>
                      <Ionicons
                        name={
                          reward.category === 'FUEL_DISCOUNT'
                            ? 'speedometer'
                            : reward.category === 'MAINTENANCE'
                            ? 'construct'
                            : reward.category === 'TIRE_SERVICE'
                            ? 'disc'
                            : 'cash'
                        }
                        size={20}
                        color={colors.navy}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rewardItemTitle}>{reward.title}</Text>
                      <Text style={styles.rewardItemDesc}>{reward.description}</Text>
                      <Text style={styles.rewardItemExpiry}>Valid until {reward.expiryDate}</Text>
                    </View>
                  </View>

                  <View style={styles.rewardActionCol}>
                    <Text style={styles.discountValueText}>{reward.discountValue}</Text>
                    {reward.isClaimed ? (
                      <View style={styles.claimedBadge}>
                        <Ionicons name="checkmark" size={12} color="#15803D" />
                        <Text style={styles.claimedBadgeText}>CLAIMED</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.claimBtn,
                          rewardPoints < reward.pointsRequired && styles.claimBtnDisabled,
                        ]}
                        disabled={rewardPoints < reward.pointsRequired}
                        onPress={() => setSelectedRewardToClaim(reward)}
                      >
                        <Text style={styles.claimBtnText}>{reward.pointsRequired} Pts</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Points History */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Points Ledger</Text>
              {rewardHistory.map((h) => (
                <View key={h.id} style={styles.historyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historySource}>{h.source}</Text>
                    <Text style={styles.historyDate}>{h.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.historyPoints,
                      { color: h.type === 'EARNED' ? colors.green : '#DC2626' },
                    ]}
                  >
                    {h.type === 'EARNED' ? '+' : '-'}{h.points} Pts
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ==================================================== */}
        {/* VIEW 3: EARNINGS */}
        {/* ==================================================== */}
        {activeTab === 'EARNINGS' && (
          <>
            {/* Period Selector */}
            <View style={styles.periodRow}>
              {(
                [
                  { id: 'WEEK', label: 'This Week' },
                  { id: 'MONTH', label: 'This Month' },
                  { id: 'LAST_MONTH', label: 'Last Month' },
                  { id: 'ALL_TIME', label: 'All Time' },
                ] as { id: EarningTimeframe; label: string }[]
              ).map((p) => {
                const isSelected = earningPeriod === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.periodBtn, isSelected && styles.periodBtnActive]}
                    onPress={() => setEarningPeriod(p.id)}
                  >
                    <Text style={[styles.periodBtnText, isSelected && styles.periodBtnTextActive]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Stats Overview */}
            <View style={styles.earningsHero}>
              <Text style={styles.earningsHeroLabel}>Net Settlement for Selected Period</Text>
              <Text style={styles.earningsHeroAmount}>₹{currentEarnings.total.toLocaleString('en-IN')}</Text>

              <View style={styles.earningsGrid}>
                <View style={styles.earnBox}>
                  <Text style={styles.earnBoxLabel}>Completed Hauls</Text>
                  <Text style={styles.earnBoxVal}>{currentEarnings.trips}</Text>
                </View>

                <View style={styles.earnBox}>
                  <Text style={styles.earnBoxLabel}>Paid Out</Text>
                  <Text style={[styles.earnBoxVal, { color: colors.green }]}>
                    ₹{currentEarnings.paid.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={styles.earnBox}>
                  <Text style={styles.earnBoxLabel}>Pending Settlement</Text>
                  <Text style={[styles.earnBoxVal, { color: colors.orange }]}>
                    ₹{(currentEarnings.total - currentEarnings.paid).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Revenue Category Breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Earnings Breakdown</Text>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.colorDot, { backgroundColor: colors.navy }]} />
                  <Text style={styles.breakdownName}>Base Trip Freight Payments</Text>
                </View>
                <Text style={styles.breakdownAmount}>
                  ₹{(currentEarnings.total - currentEarnings.bonuses - currentEarnings.rewards).toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.colorDot, { backgroundColor: colors.blue }]} />
                  <Text style={styles.breakdownName}>On-Time & Route Bonuses</Text>
                </View>
                <Text style={styles.breakdownAmount}>₹{currentEarnings.bonuses.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.colorDot, { backgroundColor: colors.orange }]} />
                  <Text style={styles.breakdownName}>Reward & Milestone Cashback</Text>
                </View>
                <Text style={styles.breakdownAmount}>₹{currentEarnings.rewards.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </>
        )}

        {/* ==================================================== */}
        {/* VIEW 4: PASSBOOK */}
        {/* ==================================================== */}
        {activeTab === 'PASSBOOK' && (
          <>
            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.passbookFilterScroll}
            >
              {[
                { id: 'ALL', label: 'All Transactions' },
                { id: 'CREDIT', label: 'Credits (+)' },
                { id: 'DEBIT', label: 'Debits (-)' },
                { id: 'SHIPMENT', label: 'Freight Payments' },
                { id: 'WITHDRAWAL', label: 'Withdrawals' },
                { id: 'REWARD', label: 'Bonuses & Rewards' },
              ].map((f) => {
                const isSelected = passbookFilter === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.passbookPill, isSelected && styles.passbookPillActive]}
                    onPress={() => setPassbookFilter(f.id as any)}
                  >
                    <Text style={[styles.passbookPillText, isSelected && styles.passbookPillTextActive]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.card}>
              <Text style={styles.cardHeading}>Transaction Ledger ({filteredTransactions.length})</Text>

              {filteredTransactions.length === 0 ? (
                <EmptyState
                  title="No Transactions"
                  message="No ledger records matching your filter."
                  iconName="receipt-outline"
                />
              ) : (
                filteredTransactions.map((txn) => (
                  <View key={txn.id} style={styles.passbookRow}>
                    <View style={styles.passbookIcon}>
                      <Ionicons
                        name={
                          txn.category === 'SHIPMENT_PAYMENT'
                            ? 'cube'
                            : txn.category === 'WITHDRAWAL'
                            ? 'card'
                            : txn.category === 'FASTAG_RECHARGE'
                            ? 'car'
                            : 'gift'
                        }
                        size={18}
                        color={colors.navy}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.pbTitle}>{txn.title}</Text>
                      <Text style={styles.pbDesc}>{txn.description}</Text>
                      <Text style={styles.pbMeta}>
                        Txn #{txn.transactionNumber} • {txn.date} {txn.time}
                      </Text>
                    </View>

                    <View style={styles.pbAmountCol}>
                      <Text
                        style={[
                          styles.pbAmount,
                          { color: txn.type === 'CREDIT' ? colors.green : '#DC2626' },
                        ]}
                      >
                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </Text>
                      <StatusBadge status={txn.status} size="sm" />
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Reward Claim Confirmation Modal */}
      {selectedRewardToClaim && (
        <ConfirmModal
          visible={!!selectedRewardToClaim}
          title={`Claim ${selectedRewardToClaim.title}?`}
          message={`This will redeem ${selectedRewardToClaim.pointsRequired} reward points from your balance.`}
          confirmText="Redeem Voucher"
          cancelText="Cancel"
          iconName="gift-outline"
          iconColor={colors.orange}
          onConfirm={handleClaimRewardConfirm}
          onCancel={() => setSelectedRewardToClaim(null)}
        />
      )}
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
  subNavBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  subTabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabItemActive: {
    borderBottomColor: colors.navy,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subTabTextActive: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  balanceHero: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  balanceHeroLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  balanceHeroAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    marginVertical: 4,
  },
  balanceMetaRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  metaValGreen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginTop: 2,
  },
  metaValOrange: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FBBF24',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#334155',
    marginHorizontal: spacing.sm,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  withdrawActionBtn: {
    flex: 1.5,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: radius.md,
  },
  withdrawActionBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  passbookShortcutBtn: {
    flex: 1.2,
    backgroundColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: radius.md,
  },
  passbookShortcutBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 2,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
  },
  bankName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  accNum: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewAllBlue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txnIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  txnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  txnDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  txnAmount: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  rewardHero: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  rewardHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rewardHeroLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B45309',
  },
  rewardPointsVal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#78350F',
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
  },
  tierProgressBlock: {
    marginTop: spacing.md,
  },
  tierProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierProgressLabel: {
    fontSize: 11,
    color: '#78350F',
  },
  tierProgressCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78350F',
  },
  tierTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDE68A',
    overflow: 'hidden',
  },
  tierFill: {
    height: '100%',
    backgroundColor: '#B45309',
    borderRadius: 3,
  },
  rewardCardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  rewardIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rewardItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  rewardItemDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rewardItemExpiry: {
    fontSize: 9,
    color: colors.orange,
    marginTop: 2,
  },
  rewardActionCol: {
    alignItems: 'flex-end',
  },
  discountValueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  claimBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  claimBtnDisabled: {
    opacity: 0.4,
  },
  claimBtnText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 2,
  },
  claimedBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historySource: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  historyDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  historyPoints: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  periodRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  periodBtnActive: {
    backgroundColor: colors.navy,
  },
  periodBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodBtnTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  earningsHero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  earningsHeroLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  earningsHeroAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.navy,
    marginVertical: 2,
  },
  earningsGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  earnBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  earnBoxLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  earnBoxVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.navy,
  },
  breakdownAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  passbookFilterScroll: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  passbookPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  passbookPillActive: {
    backgroundColor: colors.navy,
  },
  passbookPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  passbookPillTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  passbookRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: spacing.sm,
  },
  passbookIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pbTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  pbDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pbMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pbAmountCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pbAmount: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
