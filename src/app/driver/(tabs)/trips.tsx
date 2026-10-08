import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { TripCard } from '@/components/driver/TripCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

type TripTab = 'CURRENT' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export default function TripsScreen() {
  const { trips } = useDriver();
  const [activeTab, setActiveTab] = useState<TripTab>('CURRENT');
  const [refreshing, setRefreshing] = useState(false);

  const counts = useMemo(() => {
    return {
      CURRENT: trips.filter(
        (t) =>
          t.status !== 'DELIVERED' &&
          t.status !== 'CANCELLED' &&
          t.status !== 'ASSIGNED'
      ).length,
      UPCOMING: trips.filter((t) => t.status === 'ASSIGNED').length,
      COMPLETED: trips.filter((t) => t.status === 'DELIVERED').length,
      CANCELLED: trips.filter((t) => t.status === 'CANCELLED').length,
    };
  }, [trips]);

  const filteredTrips = useMemo(() => {
    switch (activeTab) {
      case 'CURRENT':
        return trips.filter(
          (t) =>
            t.status !== 'DELIVERED' &&
            t.status !== 'CANCELLED' &&
            t.status !== 'ASSIGNED'
        );
      case 'UPCOMING':
        return trips.filter((t) => t.status === 'ASSIGNED');
      case 'COMPLETED':
        return trips.filter((t) => t.status === 'DELIVERED');
      case 'CANCELLED':
        return trips.filter((t) => t.status === 'CANCELLED');
      default:
        return trips;
    }
  }, [trips, activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const tabs: { id: TripTab; label: string; count: number }[] = [
    { id: 'CURRENT', label: 'In Progress', count: counts.CURRENT },
    { id: 'UPCOMING', label: 'Upcoming', count: counts.UPCOMING },
    { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
    { id: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trip Operations</Text>
        <Text style={styles.subtitle}>
          Manage active freight runs, waypoint check-ins, and completed delivery records
        </Text>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected ? styles.countBadgeActive : styles.countBadgeInactive,
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
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Trips List */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TripCard trip={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            title={`No ${activeTab.toLowerCase()} trips`}
            message={
              activeTab === 'CURRENT'
                ? 'You do not have an active shipment in transit right now. Accept an assignment or find loads to start a trip.'
                : 'No trip records found in this category.'
            }
            iconName="navigate-outline"
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    justifyContent: 'space-between',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: '#F1F5F9',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countBadgeInactive: {
    backgroundColor: '#E2E8F0',
  },
  countBadgeActive: {
    backgroundColor: colors.navy,
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
