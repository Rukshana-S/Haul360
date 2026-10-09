import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { PassbookTransaction } from '@/constants/transportOfficeMockData';

type FilterType = 'ALL' | 'CREDIT' | 'DEBIT' | 'TODAY' | 'WEEK' | 'MONTH';

export default function TransportOfficePassbookScreen() {
  const { financials, passbook, withdrawOfficeFunds } = useTransportOffice();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('10000');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<PassbookTransaction | null>(null);

  const filteredTransactions = passbook.filter((tx) => {
    if (activeFilter === 'CREDIT') return tx.type === 'CREDIT';
    if (activeFilter === 'DEBIT') return tx.type === 'DEBIT';
    if (activeFilter === 'TODAY') return tx.date.includes('Today') || tx.date.includes('08 Oct');
    if (activeFilter === 'WEEK') return tx.date.includes('Oct');
    if (activeFilter === 'MONTH') return tx.date.includes('Oct');
    return true;
  });

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmountInput, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > financials.availableBalance) {
      Alert.alert('Insufficient Balance', 'Withdrawal amount exceeds available account balance.');
      return;
    }

    const res = withdrawOfficeFunds(amount, 'HDFC Bank Hub Transfer (A/C XX8902)');
    if (res.success) {
      setWithdrawSuccessMsg(`₹${amount.toLocaleString('en-IN')} transferred to your verified bank account.`);
      setTimeout(() => {
        setWithdrawSuccessMsg(null);
        setShowWithdrawModal(false);
      }, 1500);
    } else {
      Alert.alert('Error', res.error || 'Failed to process withdrawal.');
    }
  };

  const getCategoryIcon = (category: PassbookTransaction['category']) => {
    switch (category) {
      case 'SHIPMENT_EARNING':
        return { name: 'arrow-down-circle' as const, color: colors.green, bg: '#DCFCE7' };
      case 'FASTAG_RECHARGE':
        return { name: 'car' as const, color: colors.orange, bg: '#FEF3C7' };
      case 'WITHDRAWAL':
        return { name: 'arrow-up-circle' as const, color: '#DC2626', bg: '#FEE2E2' };
      case 'TRIP_EXPENSE':
        return { name: 'receipt' as const, color: '#64748B', bg: '#F1F5F9' };
      default:
        return { name: 'cash-outline' as const, color: colors.navy, bg: '#EEF2FF' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/transport-office' as any);
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financial Passbook</Text>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={() => router.push('/transport-office/earnings' as any)}
        >
          <Ionicons name="stats-chart-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ACCOUNT BALANCE HERO CARD */}
        <View style={styles.heroBalanceCard}>
          <View style={styles.balanceHeaderRow}>
            <View>
              <Text style={styles.balanceTag}>Available Account Balance</Text>
              <Text style={styles.mainBalance}>
                ₹{financials.availableBalance.toLocaleString('en-IN')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.withdrawButton}
              activeOpacity={0.85}
              onPress={() => setShowWithdrawModal(true)}
            >
              <Ionicons name="arrow-up-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          {/* FINANCIAL STATS ROW */}
          <View style={styles.financialStatsRow}>
            <View style={styles.fStatBox}>
              <Text style={styles.fStatLabel}>Total Earnings</Text>
              <Text style={styles.fStatVal}>
                ₹{financials.totalEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.fStatDivider} />
            <View style={styles.fStatBox}>
              <Text style={styles.fStatLabel}>Withdrawn</Text>
              <Text style={styles.fStatVal}>
                ₹{financials.withdrawnAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.fStatDivider} />
            <View style={styles.fStatBox}>
              <Text style={styles.fStatLabel}>Pending</Text>
              <Text style={styles.fStatVal}>
                ₹{financials.pendingEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View style={styles.balanceNoticeBox}>
            <Ionicons name="information-circle-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
            <Text style={styles.balanceNoticeText}>
              Office balance is strictly separate from individual vehicle FASTag balances.
            </Text>
          </View>
        </View>

        {/* FILTERS */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {(
              [
                { key: 'ALL', label: 'All Transactions' },
                { key: 'CREDIT', label: 'Credits (+)' },
                { key: 'DEBIT', label: 'Debits (-)' },
                { key: 'TODAY', label: 'Today' },
                { key: 'WEEK', label: 'This Week' },
                { key: 'MONTH', label: 'This Month' },
              ] as const
            ).map((filter) => {
              const isSelected = activeFilter === filter.key;
              return (
                <TouchableOpacity
                  key={filter.key}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* TRANSACTION LIST */}
        <View style={styles.transactionsHeaderRow}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <Text style={styles.txCountBadge}>{filteredTransactions.length} Records</Text>
        </View>

        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={42} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptySubtitle}>No records match the selected filter.</Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => {
            const icon = getCategoryIcon(tx.category);
            const isCredit = tx.type === 'CREDIT';

            return (
              <TouchableOpacity
                key={tx.id}
                style={styles.txCard}
                activeOpacity={0.85}
                onPress={() => setSelectedTxn(tx)}
              >
                <View style={[styles.txIconCircle, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>

                <View style={styles.txMainInfo}>
                  <View style={styles.txTitleRow}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={[styles.txAmount, { color: isCredit ? colors.green : '#DC2626' }]}>
                      {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <Text style={styles.txSubtitle} numberOfLines={1}>
                    {tx.subtitle}
                  </Text>

                  <View style={styles.txMetaRow}>
                    <Text style={styles.txDate}>{tx.date}</Text>
                    <Text style={styles.txBalanceAfter}>
                      Balance: ₹{tx.balanceAfter.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* WITHDRAW MODAL */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Withdraw Available Funds</Text>
                <Text style={styles.modalSubtitle}>Direct transfer to registered Hub bank account</Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowWithdrawModal(false)}
              >
                <Ionicons name="close" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>

            {withdrawSuccessMsg ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={48} color={colors.green} />
                <Text style={styles.successTitle}>Withdrawal Initiated!</Text>
                <Text style={styles.successSubtitle}>{withdrawSuccessMsg}</Text>
              </View>
            ) : (
              <View style={styles.modalBody}>
                <View style={styles.modalAvailableBox}>
                  <Text style={styles.modalAvailableLabel}>Available to Withdraw</Text>
                  <Text style={styles.modalAvailableAmount}>
                    ₹{financials.availableBalance.toLocaleString('en-IN')}
                  </Text>
                </View>

                <Text style={styles.inputLabel}>Enter Withdrawal Amount (₹)</Text>
                <TextInput
                  style={styles.inputAmount}
                  keyboardType="numeric"
                  value={withdrawAmountInput}
                  onChangeText={setWithdrawAmountInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                />

                <View style={styles.quickPresetRow}>
                  {['5000', '10000', '25000', '50000'].map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={styles.presetPill}
                      onPress={() => setWithdrawAmountInput(amt)}
                    >
                      <Text style={styles.presetPillText}>+₹{parseInt(amt, 10).toLocaleString('en-IN')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.bankDetailCard}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.green} style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.bankName}>HDFC Bank Logistics A/C</Text>
                    <Text style={styles.bankAcc}>A/C: ••••••••••••8902 • IFSC: HDFC0001243</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.confirmWithdrawBtn}
                  onPress={handleWithdraw}
                >
                  <Text style={styles.confirmWithdrawText}>Confirm & Transfer to Bank</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* TRANSACTION DETAILS MODAL */}
      <Modal
        visible={!!selectedTxn}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTxn(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transaction Details</Text>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setSelectedTxn(null)}
              >
                <Ionicons name="close" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>

            {selectedTxn && (
              <View style={styles.modalBody}>
                <View style={styles.txDetailHero}>
                  <Text style={styles.txDetailTypeBadge}>
                    {selectedTxn.type === 'CREDIT' ? 'CREDIT RECEIVED' : 'DEBIT TRANSACTION'}
                  </Text>
                  <Text
                    style={[
                      styles.txDetailHeroAmount,
                      { color: selectedTxn.type === 'CREDIT' ? colors.green : '#DC2626' },
                    ]}
                  >
                    {selectedTxn.type === 'CREDIT' ? '+' : '-'} ₹{selectedTxn.amount.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.txDetailTitle}>{selectedTxn.title}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction ID:</Text>
                  <Text style={styles.detailVal}>{selectedTxn.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailVal}>{selectedTxn.subtitle}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time:</Text>
                  <Text style={styles.detailVal}>{selectedTxn.date}</Text>
                </View>

                {selectedTxn.refId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reference ID:</Text>
                    <Text style={styles.detailVal}>{selectedTxn.refId}</Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Balance After Transaction:</Text>
                  <Text style={[styles.detailVal, { fontWeight: '700' }]}>
                    ₹{selectedTxn.balanceAfter.toLocaleString('en-IN')}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.confirmWithdrawBtn}
                  onPress={() => setSelectedTxn(null)}
                >
                  <Text style={styles.confirmWithdrawText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  heroBalanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  balanceTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  withdrawButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  financialStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  fStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  fStatLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  fStatVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  balanceNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  balanceNoticeText: {
    fontSize: 10,
    color: '#94A3B8',
    flex: 1,
  },
  filtersWrapper: {
    marginBottom: spacing.md,
  },
  filtersContainer: {
    gap: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  txCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.sm,
  },
  txIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  txMainInfo: {
    flex: 1,
  },
  txTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  txSubtitle: {
    fontSize: 11,
    color: colors.slate,
    marginBottom: 4,
  },
  txMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  txBalanceAfter: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.slate,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 420,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.navy,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginTop: spacing.xs,
  },
  modalAvailableBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalAvailableLabel: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: '600',
  },
  modalAvailableAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 6,
  },
  inputAmount: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  quickPresetRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  presetPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  bankDetailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  bankName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  bankAcc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  confirmWithdrawBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  confirmWithdrawText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.sm,
  },
  successSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  txDetailHero: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  txDetailTypeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  txDetailHeroAmount: {
    fontSize: 26,
    fontWeight: '800',
    marginVertical: 4,
  },
  txDetailTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
