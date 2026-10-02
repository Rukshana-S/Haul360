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
import { ServiceRequestCard } from '@/components/mechanic/ServiceRequestCard';
import { useMechanic } from '@/context/MechanicContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import { MechanicRequest, mechanicProfile } from '@/constants/mechanicMockData';

type FilterType = 'SOS' | 'Scheduled' | 'Completed';

export default function RequestsScreen() {
  const { requests } = useMechanic();
  const [activeFilter, setActiveFilter] = useState<FilterType>('SOS');

  const sosCount = useMemo(
    () => requests.filter((r) => r.isEmergency && r.status !== 'COMPLETED').length,
    [requests]
  );

  const scheduledCount = useMemo(
    () => requests.filter((r) => !r.isEmergency && r.status !== 'COMPLETED').length,
    [requests]
  );

  const completedCount = useMemo(
    () => mechanicProfile.stats.completed || requests.filter((r) => r.status === 'COMPLETED').length,
    [requests]
  );

  const filteredRequests = useMemo(() => {
    switch (activeFilter) {
      case 'SOS':
        return requests.filter((r) => r.isEmergency && r.status !== 'COMPLETED');
      case 'Scheduled':
        return requests.filter((r) => !r.isEmergency && r.status !== 'COMPLETED');
      case 'Completed':
        return requests.filter((r) => r.status === 'COMPLETED');
      default:
        return requests;
    }
  }, [requests, activeFilter]);

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Fast-Response Dispatcher Surge Banner */}
      <View style={styles.dispatcherBox}>
        <View style={styles.dispatcherLeft}>
          <View style={styles.dotOrange} />
          <View>
            <Text style={styles.dispatcherText}>FAST-RESPONSE DISPATCHER</Text>
            <Text style={styles.dispatcherSubtext}>Corridor Hub: NH-48 Active Node</Text>
          </View>
        </View>
        <View style={styles.dispatcherRight}>
          <Ionicons name="flash" size={15} color="#FDBA74" style={{ marginRight: 4 }} />
          <Text style={styles.multiplierText}>1.8x Surge Active</Text>
        </View>
      </View>

      {/* Filter Tabs: SOS (2), Scheduled (4), Completed (128) */}
      <View style={styles.filterTabsContainer}>
        {(
          [
            { key: 'SOS', label: `SOS (${sosCount})`, isAlert: true },
            { key: 'Scheduled', label: `Scheduled (${scheduledCount})` },
            { key: 'Completed', label: `Completed (${completedCount})` },
          ] as Array<{ key: FilterType; label: string; isAlert?: boolean }>
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
              accessibilityLabel={`Filter requests by ${tab.label}`}
            >
              {tab.isAlert && <View style={styles.dotRed} />}
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'SOS'
              ? 'Highway SOS Emergencies'
              : activeFilter === 'Scheduled'
              ? 'Scheduled Maintenance Jobs'
              : 'Completed & Settled Requests'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Showing {filteredRequests.length} {filteredRequests.length === 1 ? 'ticket' : 'tickets'}
          </Text>
        </View>
        <View style={styles.liveSyncBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveSyncText}>Live Channel</Text>
        </View>
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
            <Text style={styles.headerTitle}>Service Requests</Text>
            <Text style={styles.headerSub}>Live Roadside Queue</Text>
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

      <FlatList<MechanicRequest>
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            title={`No ${activeFilter} requests found`}
            message={
              activeFilter === 'SOS'
                ? 'No active SOS emergency roadside breakdowns in your sector.'
                : activeFilter === 'Scheduled'
                ? 'No scheduled fleet maintenance jobs at this time.'
                : 'No completed requests found in current session queue.'
            }
            iconName={activeFilter === 'SOS' ? 'warning-outline' : 'document-text-outline'}
          />
        }
        renderItem={({ item }) => (
          <ServiceRequestCard
            request={item}
            onPress={() => router.push(`/mechanic/request-details?id=${item.id}` as any)}
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
  dispatcherBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dispatcherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FDBA74',
    marginRight: spacing.sm,
  },
  dispatcherText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dispatcherSubtext: {
    color: '#94A3B8',
    fontSize: 10,
  },
  dispatcherRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  multiplierText: {
    color: '#FDBA74',
    fontSize: 10,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  dotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginRight: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 4,
  },
  liveSyncText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
});
