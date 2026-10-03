import React, { useState, useMemo } from 'react';
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
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useMechanic } from '@/context/MechanicContext';

const FILTER_TABS = ['All', 'Pneumatics', 'Electrical', 'Engine', 'SOS'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function ServiceHistoryScreen() {
  const { serviceHistory } = useMechanic();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filteredList = useMemo(() => {
    if (activeFilter === 'All') return serviceHistory;
    return serviceHistory.filter((item) => {
      if (activeFilter === 'SOS') return item.category === 'SOS';
      return item.category === activeFilter;
    });
  }, [serviceHistory, activeFilter]);

  const totalSettledAmount = useMemo(() => {
    return serviceHistory.reduce((acc, curr) => {
      const numeric =
        typeof curr.amount === 'number'
          ? curr.amount
          : parseInt(String(curr.amount).replace(/[^0-9]/g, ''), 10) || 0;
      return acc + numeric;
    }, 0);
  }, [serviceHistory]);

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.title}>Service History</Text>
          <Text style={styles.subtitle}>Settled payouts & verified job log</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.calendarBadge}>
            <Ionicons name="calendar-outline" size={13} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.calendarText}>July 2026</Text>
          </View>
        </View>
      </View>

      {/* Summary Stat Card */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total Jobs</Text>
          <Text style={styles.summaryValue}>{serviceHistory.length}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total Settled</Text>
          <Text style={styles.summaryValue}>₹{totalSettledAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Satisfaction</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={13} color={colors.orange} style={{ marginRight: 3 }} />
            <Text style={styles.summaryValue}>4.9</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTER_TABS.map((f) => {
            const isSelected = activeFilter === f;
            const count =
              f === 'All'
                ? serviceHistory.length
                : serviceHistory.filter((i) => (f === 'SOS' ? i.category === 'SOS' : i.category === f)).length;

            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${f}`}
              >
                {f === 'SOS' && <View style={styles.dotRed} />}
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {f === 'All' ? `All (${serviceHistory.length})` : `${f} (${count})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* History List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPad}
        showsVerticalScrollIndicator={false}
      >
        {filteredList.length === 0 ? (
          <EmptyState
            title="No Service History"
            message={`There are no settled jobs under '${activeFilter}'. Completed roadside repairs will appear here.`}
            iconName="time-outline"
          />
        ) : (
          filteredList.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.card}
              onPress={() => router.push(`/mechanic/repair-details?id=${job.id}` as any)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`View details for job ${job.id}`}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.idBadge}>
                  <Text style={styles.idText}>{job.id}</Text>
                </View>
                <Text style={styles.dateText}>{job.date}</Text>
                <View style={styles.settledBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#1E3A8A" style={{ marginRight: 3 }} />
                  <Text style={styles.settledText}>Settled</Text>
                </View>
              </View>

              <View style={styles.mainRow}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{job.vehicle}</Text>
                  <Text style={styles.vehicleSub}>{job.driver}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceText}>
                    {typeof job.amount === 'number'
                      ? `₹${job.amount.toLocaleString('en-IN')}`
                      : job.amount}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="star" size={11} color={colors.orange} style={{ marginRight: 2 }} />
                    <Text style={styles.ratingText}>{job.rating.toFixed(1)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {job.location}
                </Text>
              </View>

              <View style={styles.serviceRow}>
                <Ionicons name="construct-outline" size={14} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.serviceText} numberOfLines={1}>
                  {job.service}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* GST / Tax Invoices Card */}
        <View style={styles.invoiceCard}>
          <View style={styles.invoiceIconBox}>
            <Ionicons name="document-text-outline" size={22} color={colors.navy} />
          </View>
          <View style={styles.invoiceContent}>
            <Text style={styles.invoiceTitle}>Tax & GST Statements</Text>
            <Text style={styles.invoiceDesc}>Download TDS Form 16A & Monthly B2B Invoices</Text>
          </View>
          <TouchableOpacity
            style={styles.pdfBtn}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Download PDF statement"
          >
            <Ionicons name="download-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.pdfBtnText}>PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: spacing.md,
    padding: 4,
  },
  headerTitleBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  headerRight: {},
  calendarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  calendarText: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '700',
  },

  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },

  filterWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: spacing.xs,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  dotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginRight: 6,
  },

  content: {
    flex: 1,
  },
  contentPad: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  idBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
  },
  settledText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },

  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  vehicleInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  vehicleSub: {
    fontSize: 11,
    color: '#64748B',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.xs,
    borderRadius: 8,
  },
  serviceText: {
    flex: 1,
    fontSize: 11,
    color: colors.navy,
    fontWeight: '500',
  },

  invoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 14,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  invoiceIconBox: {
    backgroundColor: '#DBEAFE',
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  invoiceContent: {
    flex: 1,
  },
  invoiceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  invoiceDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  pdfBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
});
