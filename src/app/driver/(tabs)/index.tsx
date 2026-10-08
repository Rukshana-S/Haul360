import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { TripCard } from '@/components/driver/TripCard';
import { ReturnLoadCard } from '@/components/driver/ReturnLoadCard';
import { ShipmentCard } from '@/components/driver/ShipmentCard';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

export default function DriverHomeScreen() {
  const {
    activeTrip,
    bids,
    shipments,
    returnLoads,
    moneyBalance,
    todayEarnings,
    fastagBalance,
    vehicle,
    activeBreakdown,
  } = useDriver();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const activeBid = bids.find((b) => b.status === 'PENDING') || bids[0];
  const topReturnLoad = returnLoads[0];
  const availableShipments = shipments.slice(0, 2);

  return (
    <Screen safeArea style={styles.container}>
      <DriverHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ACTIVE BREAKDOWN BANNER IF ANY */}
        {activeBreakdown && (
          <TouchableOpacity
            style={styles.breakdownAlertBanner}
            activeOpacity={0.85}
            onPress={() => router.push(`/driver/breakdown/${activeBreakdown.id}` as any)}
          >
            <View style={styles.breakdownLeft}>
              <View style={styles.breakdownIconCircle}>
                <Ionicons name="warning" size={18} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.breakdownAlertTitle}>Active Breakdown Assistance</Text>
                <Text style={styles.breakdownAlertSub} numberOfLines={1}>
                  {activeBreakdown.category} • {activeBreakdown.mechanic?.name || 'Mechanic dispatched'}
                </Text>
              </View>
            </View>
            <View style={styles.trackBtn}>
              <Text style={styles.trackBtnText}>Track</Text>
              <Ionicons name="chevron-forward" size={14} color="#DC2626" />
            </View>
          </TouchableOpacity>
        )}

        {/* SECTION 1: CURRENT / ACTIVE TRIP */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="navigate-circle" size={18} color={colors.navy} />
            <Text style={styles.sectionTitle}>
              {activeTrip ? 'Current Active Trip' : 'Trip Status'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/driver/(tabs)/trips' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>All Trips</Text>
          </TouchableOpacity>
        </View>

        {activeTrip ? (
          <View style={styles.activeTripWrapper}>
            <TripCard trip={activeTrip} />
            <View style={styles.tripQuickActions}>
              <TouchableOpacity
                style={styles.trackShipmentBtn}
                onPress={() => router.push('/driver/trip/tracking' as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="navigate-circle" size={16} color={colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.trackShipmentBtnText}>Track Shipment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateStatusBtn}
                onPress={() => router.push(`/driver/trip/${activeTrip.id}` as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="create-outline" size={16} color={colors.navy} style={{ marginRight: 4 }} />
                <Text style={styles.updateStatusBtnText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noTripCard}>
            <Ionicons name="checkmark-done-circle-outline" size={32} color={colors.green} />
            <Text style={styles.noTripTitle}>No Active Trip</Text>
            <Text style={styles.noTripSub}>
              You are ready to accept new assignments or bid on upcoming loads.
            </Text>
            <TouchableOpacity
              style={styles.findShipmentBtn}
              onPress={() => router.push('/driver/(tabs)/shipments' as any)}
            >
              <Text style={styles.findShipmentBtnText}>Find Shipment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION 2: MONEY & FASTAG CARDS ROW */}
        <View style={styles.financeRow}>
          {/* Money Card */}
          <TouchableOpacity
            style={styles.financeCard}
            activeOpacity={0.85}
            onPress={() => router.push('/driver/money' as any)}
          >
            <View style={styles.financeHeader}>
              <Text style={styles.financeLabel}>Account Balance</Text>
              <Ionicons name="wallet-outline" size={18} color={colors.navy} />
            </View>
            <Text style={styles.financeAmount}>₹{moneyBalance.toLocaleString('en-IN')}</Text>
            <View style={styles.financeFooter}>
              <Text style={styles.financeSub}>Today: +₹{todayEarnings.toLocaleString('en-IN')}</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.navy} />
            </View>
          </TouchableOpacity>

          {/* FASTag Card */}
          <TouchableOpacity
            style={styles.financeCard}
            activeOpacity={0.85}
            onPress={() => router.push('/driver/fastag' as any)}
          >
            <View style={styles.financeHeader}>
              <Text style={styles.financeLabel}>FASTag ({vehicle.vehicleNumber.slice(-4)})</Text>
              <Ionicons name="card-outline" size={18} color={colors.navy} />
            </View>
            <Text style={styles.financeAmount}>₹{fastagBalance.toLocaleString('en-IN')}</Text>
            <View style={styles.financeFooter}>
              <Text style={[styles.financeSub, fastagBalance < 500 && { color: '#DC2626' }]}>
                {fastagBalance < 500 ? 'Low Balance' : 'Active • All Tolls'}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.navy} />
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION 3: QUICK ACTIONS GRID */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push('/driver/(tabs)/shipments' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="search" size={20} color={colors.blue} />
              </View>
              <Text style={styles.actionGridLabel}>Find Loads</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push('/driver/(tabs)/bids' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="pricetag" size={20} color={colors.orange} />
              </View>
              <Text style={styles.actionGridLabel}>My Bids</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push('/driver/return-load' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="repeat" size={20} color="#15803D" />
              </View>
              <Text style={styles.actionGridLabel}>Return Load</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push('/driver/money' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="cash" size={20} color={colors.navy} />
              </View>
              <Text style={styles.actionGridLabel}>Passbook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push('/driver/breakdown/report' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="construct" size={20} color="#DC2626" />
              </View>
              <Text style={styles.actionGridLabel}>Breakdown</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push('/driver/calls' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="call" size={20} color="#7E22CE" />
              </View>
              <Text style={styles.actionGridLabel}>Call Logs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: RETURN LOAD RECOMMENDATION */}
        {topReturnLoad && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="sparkles" size={17} color={colors.orange} />
                <Text style={styles.sectionTitle}>Return Load Recommendation</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/driver/return-load' as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ReturnLoadCard load={topReturnLoad} />
          </View>
        )}

        {/* SECTION 5: ACTIVE BID SUMMARY */}
        {activeBid && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="pricetag" size={16} color={colors.navy} />
                <Text style={styles.sectionTitle}>Active Bid Summary</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/driver/(tabs)/bids' as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>My Bids</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.activeBidCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/driver/bid/${activeBid.id}` as any)}
            >
              <View style={styles.activeBidTop}>
                <View>
                  <Text style={styles.activeBidShipment}>{activeBid.shipmentNumber}</Text>
                  <Text style={styles.activeBidRoute}>{activeBid.route}</Text>
                </View>
                <StatusBadge status={activeBid.status} size="sm" />
              </View>

              <View style={styles.activeBidFooter}>
                <Text style={styles.activeBidAmount}>
                  My Offer: <Text style={{ color: colors.blue }}>₹{activeBid.bidAmount.toLocaleString('en-IN')}</Text>
                </Text>
                <View style={styles.bidChevron}>
                  <Text style={styles.bidViewText}>Details</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.navy} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION 6: AVAILABLE SHIPMENT OPPORTUNITIES */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="cube" size={16} color={colors.navy} />
              <Text style={styles.sectionTitle}>Available Freight Loads</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/driver/(tabs)/shipments' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>Browse All</Text>
            </TouchableOpacity>
          </View>

          {availableShipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </View>

        {/* SECTION 7: HELP & SUPPORT BANNER */}
        <TouchableOpacity
          style={styles.helpBanner}
          activeOpacity={0.85}
          onPress={() => router.push('/driver/help' as any)}
        >
          <View style={styles.helpIconBox}>
            <Ionicons name="help-buoy-outline" size={24} color={colors.navy} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Haul360 Driver Help & Support</Text>
            <Text style={styles.helpSub}>
              24/7 Roadside Assistance, FAQs, Highway Toll Guides & Dispute Desk
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.navy} />
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  breakdownAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  breakdownIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownAlertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  breakdownAlertSub: {
    fontSize: 11,
    color: '#B91C1C',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
    marginRight: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  sectionBlock: {
    marginBottom: spacing.sm,
  },
  noTripCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  noTripTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.xs,
  },
  noTripSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  findShipmentBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  findShipmentBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  financeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  financeCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.05)',
    elevation: 2,
  },
  financeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  financeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  financeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginVertical: 4,
  },
  financeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 4,
  },
  financeSub: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.green,
  },
  quickActionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  quickActionsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  actionGridItem: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionGridLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
  },
  activeBidCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  activeBidTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  activeBidShipment: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  activeBidRoute: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeBidFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: spacing.xs,
  },
  activeBidAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  bidChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bidViewText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  helpIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  helpSub: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  activeTripWrapper: {
    marginBottom: spacing.xs,
  },
  tripQuickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
  },
  trackShipmentBtn: {
    flex: 1,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  trackShipmentBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  updateStatusBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  updateStatusBtnText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
