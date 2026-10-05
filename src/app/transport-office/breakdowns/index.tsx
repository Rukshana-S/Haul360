import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { BreakdownStatus } from '@/constants/transportOfficeMockData';

export default function TransportOfficeBreakdownsList() {
  const { breakdowns } = useTransportOffice();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  const filteredBreakdowns = breakdowns.filter((b) => {
    const isResolved = b.status === 'RESOLVED' || b.status === 'REPAIRED';
    if (activeFilter === 'ACTIVE') return !isResolved;
    if (activeFilter === 'RESOLVED') return isResolved;
    return true;
  });

  const getStatusBadge = (status: BreakdownStatus) => {
    switch (status) {
      case 'MECHANIC_REQUIRED':
      case 'REPORTED':
        return { label: 'MECHANIC REQUIRED', bg: '#FEE2E2', text: '#991B1B' };
      case 'MECHANIC_REQUESTED':
        return { label: 'REQUEST SENT', bg: '#FEF3C7', text: '#B45309' };
      case 'MECHANIC_ACCEPTED':
      case 'MECHANIC_ON_WAY':
        return { label: 'MECHANIC ON THE WAY', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'MECHANIC_ARRIVED':
      case 'DIAGNOSING':
      case 'REPAIRING':
        return { label: 'UNDER REPAIR', bg: '#F3E8FF', text: '#7E22CE' };
      case 'REPAIRED':
      case 'RESOLVED':
        return { label: 'REPAIRED / RESOLVED', bg: '#DCFCE7', text: '#15803D' };
      default:
        return { label: status, bg: '#F1F5F9', text: '#475569' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency & Breakdowns</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTER TABS */}
      <View style={styles.filtersRow}>
        {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((filter) => {
          const isSelected = activeFilter === filter;
          const count =
            filter === 'ALL'
              ? breakdowns.length
              : filter === 'ACTIVE'
              ? breakdowns.filter((b) => b.status !== 'RESOLVED' && b.status !== 'REPAIRED').length
              : breakdowns.filter((b) => b.status === 'RESOLVED' || b.status === 'REPAIRED').length;

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, isSelected && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterTabText, isSelected && styles.filterTabTextActive]}>
                {filter} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* BREAKDOWNS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredBreakdowns.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.green} />
            <Text style={styles.emptyTitle}>No Active Breakdowns</Text>
            <Text style={styles.emptySubtitle}>All fleet vehicles and drivers are operating smoothly.</Text>
          </View>
        ) : (
          filteredBreakdowns.map((item) => {
            const badge = getStatusBadge(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.breakdownCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/transport-office/breakdowns/${item.id}` as any)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Ionicons name="warning" size={16} color="#DC2626" style={{ marginRight: 6 }} />
                    <Text style={styles.incidentId}>Incident #{item.id}</Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.issueTitle}>{item.issueType}</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.metaBox}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Vehicle:</Text>
                    <Text style={styles.metaValue}>{item.vehicleNumber} ({item.vehicleType})</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Driver:</Text>
                    <Text style={styles.metaValue}>{item.driverName} • +91 {item.driverPhone}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Location:</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>{item.location}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.reportedTime}>{item.reportedAt}</Text>
                  <View style={styles.actionLink}>
                    <Text style={styles.actionLinkText}>View Incident & Dispatch →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
    marginBottom: spacing.xs,
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
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentId: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  issueTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#991B1B',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginVertical: 4,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 4,
    marginVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    width: 60,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    flex: 1,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 2,
  },
  reportedTime: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
