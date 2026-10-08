import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { BidCard } from '@/components/driver/BidCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { BidStatus } from '@/constants/driverMockData';

type BidFilter = 'ALL' | BidStatus | 'RETURN_LOADS';

export default function MyBidsScreen() {
  const { bids, withdrawBid } = useDriver();
  const [activeFilter, setActiveFilter] = useState<BidFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBidIdToWithdraw, setSelectedBidIdToWithdraw] = useState<string | null>(null);

  // Dynamic state counts
  const counts = useMemo(() => {
    return {
      ALL: bids.length,
      PENDING: bids.filter((b) => b.status === 'PENDING').length,
      ACCEPTED: bids.filter((b) => b.status === 'ACCEPTED').length,
      REJECTED: bids.filter((b) => b.status === 'REJECTED').length,
      WITHDRAWN: bids.filter((b) => b.status === 'WITHDRAWN').length,
      EXPIRED: bids.filter((b) => b.status === 'EXPIRED').length,
      RETURN_LOADS: bids.filter((b) => b.isReturnLoad).length,
    };
  }, [bids]);

  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'RETURN_LOADS') return bid.isReturnLoad;
      return bid.status === activeFilter;
    });
  }, [bids, activeFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleConfirmWithdraw = () => {
    if (selectedBidIdToWithdraw) {
      withdrawBid(selectedBidIdToWithdraw);
      setSelectedBidIdToWithdraw(null);
    }
  };

  const filterTabs: { id: BidFilter; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Bids', count: counts.ALL },
    { id: 'PENDING', label: 'Pending', count: counts.PENDING },
    { id: 'ACCEPTED', label: 'Accepted', count: counts.ACCEPTED },
    { id: 'REJECTED', label: 'Rejected', count: counts.REJECTED },
    { id: 'RETURN_LOADS', label: 'Return Loads', count: counts.RETURN_LOADS },
    { id: 'WITHDRAWN', label: 'Withdrawn', count: counts.WITHDRAWN },
    { id: 'EXPIRED', label: 'Expired', count: counts.EXPIRED },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Shipment Bids</Text>
        <Text style={styles.subtitle}>
          Track your active quotes, shipper decisions, and accepted load offers
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                onPress={() => setActiveFilter(tab.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.countPill,
                    isSelected ? styles.countPillActive : styles.countPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected ? styles.countTextActive : styles.countTextInactive,
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bids List */}
      <FlatList
        data={filteredBids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BidCard
            bid={item}
            onWithdraw={(bidId) => setSelectedBidIdToWithdraw(bidId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            title="No Bids in this Category"
            message={
              activeFilter === 'PENDING'
                ? 'You currently have no pending quotes under review by shippers.'
                : 'No bids found for the selected filter.'
            }
            iconName="pricetag-outline"
          />
        }
      />

      {/* Withdraw Modal */}
      <ConfirmModal
        visible={!!selectedBidIdToWithdraw}
        title="Withdraw Quote?"
        message="Are you sure you want to withdraw this quote? The shipper will no longer be able to select your vehicle."
        confirmText="Withdraw Bid"
        cancelText="Keep Bid"
        confirmVariant="outline"
        iconName="close-circle-outline"
        iconColor="#DC2626"
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setSelectedBidIdToWithdraw(null)}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: typography.sizes.heading2,
    fontWeight: typography.weights.bold as any,
    color: colors.navy,
  },
  subtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countPillInactive: {
    backgroundColor: '#E2E8F0',
  },
  countPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  countTextInactive: {
    color: colors.slate,
  },
  countTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
