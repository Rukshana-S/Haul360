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

type HistoryFilter = 'ALL' | 'SHIPMENT' | 'MECHANIC' | 'BREAKDOWN';

export default function TransportOfficeHistoryScreen() {
  const { historyItems } = useTransportOffice();
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('ALL');

  const filteredItems = historyItems.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'SHIPMENT':
        return { name: 'cube-outline' as const, color: colors.blue, bg: '#EFF6FF' };
      case 'MECHANIC':
        return { name: 'construct-outline' as const, color: colors.orange, bg: '#FEF3C7' };
      case 'BREAKDOWN':
        return { name: 'warning-outline' as const, color: '#DC2626', bg: '#FEE2E2' };
      default:
        return { name: 'document-text-outline' as const, color: colors.navy, bg: '#F1F5F9' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Operational Audit History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTER TABS */}
      <View style={styles.filtersRow}>
        {(['ALL', 'SHIPMENT', 'MECHANIC', 'BREAKDOWN'] as HistoryFilter[]).map((filter) => {
          const isSelected = activeFilter === filter;
          const label =
            filter === 'ALL'
              ? 'All Records'
              : filter === 'SHIPMENT'
              ? 'Shipments'
              : filter === 'MECHANIC'
              ? 'Mechanic Servicing'
              : 'Breakdowns';

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, isSelected && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterTabText, isSelected && styles.filterTabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* HISTORY LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No History Records</Text>
            <Text style={styles.emptySubtitle}>No records match this audit filter.</Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const icon = getIcon(item.type);

            return (
              <View key={item.id} style={styles.historyCard}>
                <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.itemSub}>{item.subtitle}</Text>

                  {(item.driverName || item.vehicleNumber) && (
                    <View style={styles.tagRow}>
                      {item.driverName && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>Driver: {item.driverName}</Text>
                        </View>
                      )}
                      {item.vehicleNumber && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>Vehicle: {item.vehicleNumber}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
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
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  itemDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  itemSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
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
