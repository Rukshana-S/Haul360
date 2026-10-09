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
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { EarningTripItem } from '@/constants/transportOfficeMockData';

export default function TransportOfficeEarningsScreen() {
  const { financials, earningTrips } = useTransportOffice();
  const [selectedTrip, setSelectedTrip] = useState<EarningTripItem | null>(null);
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'MONTH' | 'WEEK' | 'TODAY'>('ALL');

  const filteredTrips = earningTrips.filter((item) => {
    if (timeFilter === 'TODAY') return item.completedDate.includes('08 Oct');
    if (timeFilter === 'WEEK') return item.completedDate.includes('Oct');
    return true;
  });

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
        <Text style={styles.headerTitle}>Earnings & Revenue</Text>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={() => router.push('/transport-office/passbook' as any)}
        >
          <Ionicons name="wallet-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO TOTAL EARNINGS CARD */}
        <View style={styles.heroEarningsCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Total Net Earnings</Text>
              <Text style={styles.heroAmount}>
                ₹{financials.totalEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.heroIconBadge}>
              <Ionicons name="trending-up" size={24} color={colors.green} />
            </View>
          </View>

          {/* PERIOD BREAKDOWNS */}
          <View style={styles.periodRow}>
            <View style={styles.periodBox}>
              <Text style={styles.periodLabel}>This Month</Text>
              <Text style={styles.periodVal}>
                ₹{financials.thisMonthEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.periodDivider} />
            <View style={styles.periodBox}>
              <Text style={styles.periodLabel}>This Week</Text>
              <Text style={styles.periodVal}>
                ₹{financials.thisWeekEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.periodDivider} />
            <View style={styles.periodBox}>
              <Text style={styles.periodLabel}>Today</Text>
              <Text style={styles.periodVal}>
                ₹{financials.todayEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* FINANCIAL SUMMARY BREAKDOWN */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Financial Breakdown</Text>
          <Text style={styles.sectionSubtitle}>Trip earnings and operational net balance</Text>

          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownIconCircle}>
                <Ionicons name="checkmark-circle" size={18} color={colors.green} />
              </View>
              <View>
                <Text style={styles.breakdownItemLabel}>Completed Trips</Text>
                <Text style={styles.breakdownItemVal}>{financials.completedTripsCount}</Text>
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="cash" size={18} color={colors.blue} />
              </View>
              <View>
                <Text style={styles.breakdownItemLabel}>Gross Revenue</Text>
                <Text style={styles.breakdownItemVal}>
                  ₹{financials.grossEarnings.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="receipt" size={18} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.breakdownItemLabel}>Expenses (Fuel/Toll)</Text>
                <Text style={[styles.breakdownItemVal, { color: '#DC2626' }]}>
                  -₹{financials.expenses.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="wallet" size={18} color={colors.green} />
              </View>
              <View>
                <Text style={styles.breakdownItemLabel}>Net Earnings</Text>
                <Text style={[styles.breakdownItemVal, { color: colors.green }]}>
                  ₹{financials.netEarnings.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK LINK TO PASSBOOK / BALANCE */}
        <TouchableOpacity
          style={styles.passbookBanner}
          activeOpacity={0.85}
          onPress={() => router.push('/transport-office/passbook' as any)}
        >
          <View style={styles.passbookBannerLeft}>
            <View style={styles.passbookIconBox}>
              <Ionicons name="book-outline" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.passbookBannerTitle}>View Financial Passbook</Text>
              <Text style={styles.passbookBannerSub}>
                Available Balance: ₹{financials.availableBalance.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* RECENT EARNINGS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Completed Trip Earnings</Text>
          <Text style={styles.tripCountBadge}>{filteredTrips.length} Trips</Text>
        </View>

        {filteredTrips.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.earningCard}
            activeOpacity={0.85}
            onPress={() => setSelectedTrip(item)}
          >
            <View style={styles.earningCardTop}>
              <View style={styles.shipmentIdPill}>
                <Text style={styles.shipmentIdText}>#{item.shipmentId}</Text>
              </View>
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-done" size={12} color={colors.green} style={{ marginRight: 4 }} />
                <Text style={styles.completedBadgeText}>COMPLETED</Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <Ionicons name="navigate-circle" size={18} color={colors.blue} style={{ marginRight: 6 }} />
              <Text style={styles.routeText}>{item.route}</Text>
            </View>

            <View style={styles.driverVehicleRow}>
              <Text style={styles.driverInfoText}>Driver: <Text style={styles.boldText}>{item.driverName}</Text></Text>
              <Text style={styles.driverInfoText}>Vehicle: <Text style={styles.boldText}>{item.vehicleNumber}</Text></Text>
            </View>

            <View style={styles.earningCardBottom}>
              <View>
                <Text style={styles.dateLabel}>Completed Date</Text>
                <Text style={styles.dateVal}>{item.completedDate}</Text>
              </View>

              <View style={styles.amountRight}>
                <Text style={styles.earnedLabel}>Office Earned</Text>
                <Text style={styles.earnedAmount}>
                  +₹{item.officeEarnings.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* TRIP EARNING DETAIL MODAL */}
      <Modal
        visible={!!selectedTrip}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTrip(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Trip Earning Details</Text>
                <Text style={styles.modalSubtitle}>Shipment #{selectedTrip?.shipmentId}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setSelectedTrip(null)}
              >
                <Ionicons name="close" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>

            {selectedTrip && (
              <View style={styles.modalContent}>
                <View style={styles.modalStatusRow}>
                  <Text style={styles.modalRouteText}>{selectedTrip.route}</Text>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>{selectedTrip.status}</Text>
                  </View>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned Driver:</Text>
                  <Text style={styles.detailVal}>{selectedTrip.driverName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned Vehicle:</Text>
                  <Text style={styles.detailVal}>{selectedTrip.vehicleNumber}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Completion Date:</Text>
                  <Text style={styles.detailVal}>{selectedTrip.completedDate}</Text>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Shipment Amount:</Text>
                  <Text style={styles.detailVal}>₹{selectedTrip.shipmentAmount.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transport Office Earnings:</Text>
                  <Text style={[styles.detailVal, { color: colors.blue }]}>
                    ₹{selectedTrip.officeEarnings.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Trip Operational Expenses:</Text>
                  <Text style={[styles.detailVal, { color: '#DC2626' }]}>
                    -₹{selectedTrip.expenses.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={[styles.detailRow, styles.netRow]}>
                  <Text style={styles.netLabel}>Net Profit Margin:</Text>
                  <Text style={styles.netVal}>
                    ₹{selectedTrip.netEarnings.toLocaleString('en-IN')}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setSelectedTrip(null)}
                >
                  <Text style={styles.doneBtnText}>Close Earning Details</Text>
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
  heroEarningsCard: {
    backgroundColor: '#0F172A',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  periodBox: {
    flex: 1,
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  periodVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  periodDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  breakdownItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  breakdownIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  breakdownItemLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  breakdownItemVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginTop: 1,
  },
  passbookBanner: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  passbookBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passbookIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  passbookBannerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  passbookBannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tripCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  earningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.sm,
  },
  earningCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  shipmentIdPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shipmentIdText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  driverVehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginVertical: 4,
  },
  driverInfoText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '600',
    color: colors.navy,
  },
  earningCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  dateLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  dateVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    marginTop: 1,
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  earnedLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  earnedAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.green,
    marginTop: 1,
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
    marginBottom: spacing.sm,
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
  modalContent: {
    marginTop: spacing.xs,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  modalRouteText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  netRow: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  netLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803D',
  },
  netVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  doneBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
