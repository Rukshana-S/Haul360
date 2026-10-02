import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { RepairCard } from '@/components/mechanic/RepairCard';
import { useMechanic } from '@/context/MechanicContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import { RepairJob } from '@/constants/mechanicMockData';

type RepairFilter = 'All' | 'In Progress' | 'Completed';

export default function RepairsScreen() {
  const { repairs } = useMechanic();
  const [activeFilter, setActiveFilter] = useState<RepairFilter>('All');

  const filteredRepairs = useMemo(() => {
    switch (activeFilter) {
      case 'In Progress':
        return repairs.filter((r) => r.status !== 'Completed');
      case 'Completed':
        return repairs.filter((r) => r.status === 'Completed');
      case 'All':
      default:
        return repairs;
    }
  }, [repairs, activeFilter]);

  const inProgressCount = useMemo(
    () => repairs.filter((r) => r.status !== 'Completed').length,
    [repairs]
  );
  const completedCount = useMemo(
    () => repairs.filter((r) => r.status === 'Completed').length,
    [repairs]
  );

  const activeRepair = repairs.find((r) => r.status !== 'Completed') || repairs[0];

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Active Dispatch Highlight Banner */}
      {activeRepair && (
        <View style={styles.activeBanner}>
          <View style={styles.activeTopRow}>
            <View style={styles.ticketBadge}>
              <Ionicons name="construct-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.ticketText}>CURRENT DISPATCH #{activeRepair.id}</Text>
            </View>
            <View style={styles.liveDispatchBadge}>
              <View style={styles.dotOrange} />
              <Text style={styles.liveDispatchText}>LIVE REPAIR</Text>
            </View>
          </View>

          <View style={styles.activeTimeRow}>
            <View>
              <Text style={styles.timeLabel}>Elapsed On-Site Time</Text>
              <Text style={styles.timeValue}>{activeRepair.timeElapsed}</Text>
            </View>
            <View style={styles.targetCol}>
              <Text style={styles.targetLabel}>Target SLA</Text>
              <Text style={styles.targetValue}>{'<'} 45 mins</Text>
            </View>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterTabsContainer}>
        {(
          [
            { key: 'All', label: `All Jobs (${repairs.length})` },
            { key: 'In Progress', label: `In Progress (${inProgressCount})` },
            { key: 'Completed', label: `Completed (${completedCount})` },
          ] as Array<{ key: RepairFilter; label: string }>
        ).map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter repairs by ${tab.label}`}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Repair Jobs & Tickets</Text>
        <Text style={styles.sectionSubtitle}>
          {filteredRepairs.length} {filteredRepairs.length === 1 ? 'ticket' : 'tickets'}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen safeArea style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={brand.logo} style={styles.headerLogo} contentFit="contain" />
          <View style={styles.headerSeparator} />
          <View>
            <Text style={styles.headerTitle}>Active Repairs</Text>
            <Text style={styles.headerSub}>Roadside Job Tracker</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => router.push('/mechanic')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="home-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <FlatList<RepairJob>
        data={filteredRepairs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            title="No repairs found"
            message={`No ${activeFilter.toLowerCase()} repair jobs found in your terminal.`}
            iconName="construct-outline"
          />
        }
        renderItem={({ item }) => (
          <RepairCard
            repair={item}
            onPress={() => router.push(`/mechanic/repair-details?id=${item.id}` as any)}
          />
        )}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 80,
    height: 24,
  },
  headerSeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  headerSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  notificationBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listHeader: {
    marginBottom: spacing.sm,
  },
  activeBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  activeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ticketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  liveDispatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dotOrange: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDBA74',
    marginRight: 5,
  },
  liveDispatchText: {
    color: '#FDBA74',
    fontSize: 9,
    fontWeight: '700',
  },
  activeTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timeLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 2,
  },
  timeValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  targetCol: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginBottom: 2,
  },
  targetValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
