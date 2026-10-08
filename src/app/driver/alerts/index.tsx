import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { DriverAlert } from '@/constants/driverMockData';

type AlertCategoryFilter = 'ALL' | DriverAlert['category'];

export default function AlertsScreen() {
  const { alerts, unreadAlertsCount, markAlertAsRead, markAllAlertsAsRead } = useDriver();
  const [activeCategory, setActiveCategory] = useState<AlertCategoryFilter>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (activeCategory === 'ALL') return true;
    return a.category === activeCategory;
  });

  const categories: { id: AlertCategoryFilter; label: string }[] = [
    { id: 'ALL', label: 'All Alerts' },
    { id: 'MECHANIC', label: 'Mechanic & Breakdown' },
    { id: 'SHIPMENT', label: 'Shipments & Return' },
    { id: 'BID', label: 'Bids' },
    { id: 'PAYMENT', label: 'Payments' },
    { id: 'FASTAG', label: 'FASTag' },
    { id: 'DOCUMENTS', label: 'Documents' },
  ];

  const handleAlertPress = (alert: DriverAlert) => {
    markAlertAsRead(alert.id);
    if (alert.actionRoute) {
      router.push(alert.actionRoute as any);
    }
  };

  const getAlertIcon = (category: DriverAlert['category']) => {
    switch (category) {
      case 'MECHANIC':
        return { name: 'construct', color: '#DC2626', bg: '#FEE2E2' };
      case 'SHIPMENT':
        return { name: 'cube', color: colors.blue, bg: '#EFF6FF' };
      case 'BID':
        return { name: 'pricetag', color: colors.orange, bg: '#FEF3C7' };
      case 'PAYMENT':
        return { name: 'cash', color: colors.green, bg: '#DCFCE7' };
      case 'FASTAG':
        return { name: 'card', color: colors.navy, bg: '#F1F5F9' };
      case 'DOCUMENTS':
        return { name: 'document-text', color: '#C2410C', bg: '#FFEDD5' };
      default:
        return { name: 'notifications', color: colors.navy, bg: '#F1F5F9' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Driver Alerts</Text>
          <Text style={styles.headerSubtitle}>
            {unreadAlertsCount} unread notification{unreadAlertsCount === 1 ? '' : 's'}
          </Text>
        </View>
        {unreadAlertsCount > 0 && (
          <TouchableOpacity onPress={markAllAlertsAsRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Filter */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const iconCfg = getAlertIcon(item.category);
          return (
            <TouchableOpacity
              style={[styles.alertCard, !item.isRead && styles.alertCardUnread]}
              onPress={() => handleAlertPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: iconCfg.bg }]}>
                <Ionicons name={iconCfg.name as any} size={20} color={iconCfg.color} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.alertTitle, !item.isRead && styles.alertTitleUnread]}>
                    {item.title}
                  </Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.alertMsg}>{item.message}</Text>
                <Text style={styles.alertTime}>{item.timestamp}</Text>
              </View>

              {item.actionRoute && (
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="No Alerts Found"
            message="You are all caught up with your shipment notifications and system alerts."
            iconName="notifications-off-outline"
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
  },
  markAllText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  categoryBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  categoryScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  categoryPillActive: {
    backgroundColor: colors.navy,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  alertCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    borderWidth: 1.5,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    flex: 1,
  },
  alertTitleUnread: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginLeft: 6,
  },
  alertMsg: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  alertTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
});
