import React from 'react';
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

export default function TransportOfficeNotificationsScreen() {
  const { officeNotifications, markOfficeNotificationRead } = useTransportOffice();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'BREAKDOWN':
        return { name: 'warning' as const, color: '#DC2626', bg: '#FEE2E2' };
      case 'FASTAG_LOW_BALANCE':
        return { name: 'car' as const, color: '#D97706', bg: '#FEF3C7' };
      case 'ASSIGNMENT':
        return { name: 'cube' as const, color: colors.blue, bg: '#EFF6FF' };
      case 'MECHANIC':
        return { name: 'construct' as const, color: colors.orange, bg: '#FEF3C7' };
      case 'TRIP':
        return { name: 'navigate' as const, color: colors.green, bg: '#DCFCE7' };
      case 'PAYMENT':
        return { name: 'wallet' as const, color: colors.green, bg: '#DCFCE7' };
      case 'REWARD':
        return { name: 'trophy' as const, color: '#D97706', bg: '#FEF3C7' };
      default:
        return { name: 'information-circle' as const, color: colors.navy, bg: '#F1F5F9' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {officeNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up on fleet alerts.</Text>
          </View>
        ) : (
          officeNotifications.map((notif) => {
            const icon = getIconForType(notif.type);

            return (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifCard,
                  !notif.read && styles.notifCardUnread,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  markOfficeNotificationRead(notif.id);
                  if (notif.type === 'BREAKDOWN' && notif.targetId) {
                    router.push(`/transport-office/breakdowns/${notif.targetId}` as any);
                  } else if (notif.type === 'FASTAG_LOW_BALANCE' && notif.targetId) {
                    router.push(`/transport-office/vehicles/${notif.targetId}` as any);
                  } else if (notif.type === 'ASSIGNMENT' && notif.targetId) {
                    router.push(`/transport-office/shipments/${notif.targetId}` as any);
                  }
                }}
              >
                <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifTitleRow}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                </View>

                {!notif.read && <View style={styles.unreadDot} />}
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  notifCardUnread: {
    borderColor: '#DBEAFE',
    backgroundColor: '#F0F9FF',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  notifMessage: {
    fontSize: 12,
    color: colors.slate,
    lineHeight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    position: 'absolute',
    top: 14,
    right: 14,
  },
  emptyContainer: {
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
