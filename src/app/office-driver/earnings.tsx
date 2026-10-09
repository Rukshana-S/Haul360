import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { DriverTripEarning } from '@/constants/transportOfficeMockData';

export default function OfficeDriverEarningsScreen() {
  const { driverFinancials, driverTripEarnings, currentDriverUser } = useTransportOffice();
  const [selectedEarning, setSelectedEarning] = useState<DriverTripEarning | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  const filteredEarnings = driverTripEarnings.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Driver Earnings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* DRIVER EARNINGS DASHBOARD CARD */}
        <View style={styles.heroEarningsCard}>
          <Text style={styles.heroLabel}>Total Driver Earnings</Text>
          <Text style={styles.heroAmount}>
            ₹{driverFinancials.totalEarnings.toLocaleString('en-IN')}
          </Text>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                ₹{driverFinancials.thisMonth.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.metricLbl}>This Month</Text>
            </View>

            <View style={styles.metricDiv} />

            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                ₹{driverFinancials.thisWeek.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.metricLbl}>This Week</Text>
            </View>

            <View style={styles.metricDiv} />

            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                ₹{driverFinancials.today.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.metricLbl}>Today</Text>
            </View>
          </View>

          {/* Bottom Summary Bar */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryBox}>
              <Ionicons name="checkmark-done-circle-outline" size={16} color="#22C55E" />
              <Text style={styles.summaryBoxVal}>{driverFinancials.completedTripsCount}</Text>
              <Text style={styles.summaryBoxLbl}>Completed Trips</Text>
            </View>

            <View style={styles.summaryDiv} />

            <View style={styles.summaryBox}>
              <Ionicons name="time-outline" size={16} color="#F59E0B" />
              <Text style={styles.summaryBoxVal}>
                ₹{driverFinancials.pendingEarnings.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.summaryBoxLbl}>Pending Earnings</Text>
            </View>
          </View>
        </View>

        {/* STATUS SUMMARY CARDS */}
        <View style={styles.statusCardsRow}>
          <View style={[styles.statusCard, styles.statusCardPaid]}>
            <View style={styles.statusCardIconCirclePaid}>
              <Ionicons name="cash" size={16} color="#15803D" />
            </View>
            <Text style={styles.statusCardAmount}>
              ₹{driverFinancials.paidEarnings.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statusCardLabel}>Paid to Account</Text>
          </View>

          <View style={[styles.statusCard, styles.statusCardPending]}>
            <View style={styles.statusCardIconCirclePending}>
              <Ionicons name="hourglass" size={16} color="#B45309" />
            </View>
            <Text style={styles.statusCardAmount}>
              ₹{driverFinancials.pendingEarnings.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statusCardLabel}>Pending Payout</Text>
          </View>
        </View>

        {/* EARNING HISTORY SECTION */}
        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyTitle}>Recent Earnings</Text>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              {(['ALL', 'PAID', 'PENDING'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterTab,
                    activeTab === tab && styles.filterTabActive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      activeTab === tab && styles.filterTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {filteredEarnings.map((earning) => (
            <TouchableOpacity
              key={earning.id}
              style={styles.earningItemCard}
              onPress={() => setSelectedEarning(earning)}
              activeOpacity={0.85}
            >
              <View style={styles.earningItemTop}>
                <View style={styles.tripIdBadge}>
                  <Text style={styles.tripIdBadgeText}>Trip #{earning.tripId}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    earning.status === 'PAID' ? styles.statusPillPaid : styles.statusPillPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      earning.status === 'PAID' ? styles.statusPillTextPaid : styles.statusPillTextPending,
                    ]}
                  >
                    {earning.status}
                  </Text>
                </View>
              </View>

              <View style={styles.routeRow}>
                <Text style={styles.routeText}>{earning.route}</Text>
              </View>

              <View style={styles.earningItemBottom}>
                <View style={styles.earningMetaLeft}>
                  <Text style={styles.metaVehicle}>Vehicle: {earning.vehicleNumber}</Text>
                  <Text style={styles.metaCompleted}>Completed: {earning.completedDate}</Text>
                </View>
                <View style={styles.earningAmountCol}>
                  <Text style={styles.earningAmountLabel}>Driver Earning</Text>
                  <Text style={styles.earningAmountVal}>
                    ₹{earning.driverEarning.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FINANCIAL NOTICE */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle-outline" size={16} color="#64748B" />
          <Text style={styles.disclaimerText}>
            Driver trip earnings are calculated per Transport Office dispatch terms. Payouts are settled periodically to your verified driver bank account.
          </Text>
        </View>
      </ScrollView>

      {/* EARNING DETAILS MODAL */}
      <Modal
        visible={!!selectedEarning}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEarning(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Earning Details</Text>
              <TouchableOpacity onPress={() => setSelectedEarning(null)}>
                <Ionicons name="close-circle" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedEarning && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHero}>
                  <Text style={styles.modalHeroLabel}>Driver Payout</Text>
                  <Text style={styles.modalHeroAmount}>
                    ₹{selectedEarning.driverEarning.toLocaleString('en-IN')}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      selectedEarning.status === 'PAID'
                        ? styles.statusPillPaid
                        : styles.statusPillPending,
                      { marginTop: 8 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        selectedEarning.status === 'PAID'
                          ? styles.statusPillTextPaid
                          : styles.statusPillTextPending,
                      ]}
                    >
                      STATUS: {selectedEarning.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRowsWrap}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Trip ID</Text>
                    <Text style={styles.detailVal}>#{selectedEarning.tripId}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Shipment</Text>
                    <Text style={styles.detailVal}>{selectedEarning.shipmentId}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Route</Text>
                    <Text style={styles.detailVal}>{selectedEarning.route}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vehicle</Text>
                    <Text style={styles.detailVal}>{selectedEarning.vehicleNumber}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Trip Total Amount</Text>
                    <Text style={styles.detailVal}>
                      ₹{selectedEarning.tripAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Driver Earning</Text>
                    <Text style={[styles.detailVal, { color: '#15803D', fontWeight: '800' }]}>
                      ₹{selectedEarning.driverEarning.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Completed Date</Text>
                    <Text style={styles.detailVal}>{selectedEarning.completedDate}</Text>
                  </View>

                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel}>Payout Status</Text>
                    <Text
                      style={[
                        styles.detailVal,
                        {
                          color: selectedEarning.status === 'PAID' ? '#15803D' : '#B45309',
                          fontWeight: '800',
                        },
                      ]}
                    >
                      {selectedEarning.status}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedEarning(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Close Details</Text>
                </TouchableOpacity>
              </ScrollView>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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

  // Dashboard Hero Card
  heroEarningsCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricLbl: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  metricDiv: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryBoxVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryBoxLbl: {
    fontSize: 11,
    color: '#94A3B8',
  },
  summaryDiv: {
    width: 1,
    height: 16,
    backgroundColor: '#334155',
  },

  // Status Cards
  statusCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  statusCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  statusCardPaid: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  statusCardPending: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF08A',
  },
  statusCardIconCirclePaid: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statusCardIconCirclePending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statusCardAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
  },
  statusCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },

  // History
  historySection: {
    marginBottom: spacing.md,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: radius.pill,
    padding: 2,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  filterTabActive: {
    backgroundColor: colors.navy,
  },
  filterTabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  earningItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.sm,
  },
  earningItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripIdBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tripIdBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusPillPaid: {
    backgroundColor: '#DCFCE7',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillTextPaid: {
    color: '#15803D',
  },
  statusPillTextPending: {
    color: '#B45309',
  },
  routeRow: {
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  earningItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  earningMetaLeft: {
    flex: 1,
  },
  metaVehicle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  metaCompleted: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  earningAmountCol: {
    alignItems: 'flex-end',
  },
  earningAmountLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  earningAmountVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 1,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: spacing.xxl,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  modalHero: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalHeroLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  modalHeroAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 2,
  },
  detailRowsWrap: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  modalCloseBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
