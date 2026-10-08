import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { useAuth } from '@/context/AuthContext';

export default function DriverProfileScreen() {
  const { profile, vehicle, documents } = useDriver();
  const { logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

  const verifiedDocsCount = documents.filter((d) => d.status === 'VERIFIED').length;
  const expiringDocsCount = documents.filter((d) => d.status === 'EXPIRING').length;

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/auth/login' as any);
  };

  interface MenuItem {
    title: string;
    subtitle: string;
    icon: string;
    route: string;
    badge?: string;
    badgeColor?: string;
  }

  interface MenuSection {
    title: string;
    items: MenuItem[];
  }

  const menuSections: MenuSection[] = [
    {
      title: 'FLEET & VEHICLE ASSETS',
      items: [
        {
          title: 'My Vehicle & Capacity',
          subtitle: `${vehicle.vehicleNumber} • ${vehicle.vehicleType}`,
          icon: 'car-sport-outline',
          route: '/driver/vehicle',
          badge: vehicle.rcStatus,
        },
        {
          title: 'Documents & Licenses',
          subtitle: `${verifiedDocsCount}/${documents.length} Verified` + (expiringDocsCount > 0 ? ` • ${expiringDocsCount} Expiring` : ''),
          icon: 'document-text-outline',
          route: '/driver/documents',
          badge: expiringDocsCount > 0 ? 'ALERT' : 'VERIFIED',
          badgeColor: expiringDocsCount > 0 ? '#DC2626' : '#15803D',
        },
      ],
    },
    {
      title: 'FINANCE & COMMERCE',
      items: [
        {
          title: 'Money, Passbook & Rewards',
          subtitle: 'Account Balance, Earnings Breakdown & Reward Perks',
          icon: 'wallet-outline',
          route: '/driver/money',
        },
        {
          title: 'FASTag Electronic Toll',
          subtitle: 'Vehicle Toll Wallet & Plaza Passbook',
          icon: 'card-outline',
          route: '/driver/fastag',
        },
      ],
    },
    {
      title: 'PERFORMANCE & DISPATCH',
      items: [
        {
          title: 'Driver Rating & Reviews',
          subtitle: `${profile.rating}★ (${profile.totalReviews} Shipper Reviews)`,
          icon: 'star-outline',
          route: '/driver/ratings',
        },
        {
          title: 'Call Logs & Contacts',
          subtitle: 'Shippers, Mechanics & Fleet Support directory',
          icon: 'call-outline',
          route: '/driver/calls',
        },
        {
          title: 'Notifications & Alerts',
          subtitle: 'System alerts, bids, and trip notifications',
          icon: 'notifications-outline',
          route: '/driver/alerts',
        },
      ],
    },
    {
      title: 'PREFERENCES & SUPPORT',
      items: [
        {
          title: 'Help Center & Guides',
          subtitle: 'Roadside support, FAQs, and ticket desk',
          icon: 'help-buoy-outline',
          route: '/driver/help',
        },
        {
          title: 'Settings & Security',
          subtitle: 'Password, alerts, and duty availability',
          icon: 'settings-outline',
          route: '/driver/settings',
        },
      ],
    },
  ];

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeroCard}>
          <View style={styles.heroTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>

            <View style={styles.heroInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#15803D" />
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              </View>

              <Text style={styles.phoneText}>{profile.phone}</Text>
              <Text style={styles.locationText}>
                {profile.city}, {profile.state}
              </Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statBox}
              onPress={() => router.push('/driver/ratings' as any)}
            >
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.orange} />
                <Text style={styles.statValue}>{profile.rating}</Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.totalTrips}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile.experienceYears} Yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionContainer}>
            <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  style={[
                    styles.menuItem,
                    itemIdx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconCircle}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={colors.navy}
                      />
                    </View>
                    <View style={styles.menuTextCol}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      <Text style={styles.menuItemSubtitle} numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.menuItemRight}>
                    {item.badge && (
                      <View
                        style={[
                          styles.badgePill,
                          {
                            backgroundColor:
                              item.badgeColor === '#DC2626' ? '#FEE2E2' : '#DCFCE7',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgePillText,
                            {
                              color: item.badgeColor || '#15803D',
                            },
                          ]}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#94A3B8"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Emergency SOS Shortcut */}
        <TouchableOpacity
          style={styles.sosCard}
          activeOpacity={0.85}
          onPress={() => router.push('/driver/sos' as any)}
        >
          <View style={styles.sosIconBox}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>Emergency Roadside SOS</Text>
            <Text style={styles.sosSubtitle}>
              Broadcast location & notify emergency highway dispatch
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#DC2626" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Haul360 Driver Edition • v1.0.0 (Enterprise)</Text>
      </ScrollView>

      {/* Logout Modal */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out?"
        message="Are you sure you want to sign out of your Haul360 driver account?"
        confirmText="Log Out"
        cancelText="Cancel"
        confirmVariant="outline"
        iconName="log-out-outline"
        iconColor="#DC2626"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
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
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileHeroCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    marginRight: spacing.md,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  heroInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 2,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
  },
  phoneText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  sectionContainer: {
    marginBottom: spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    paddingLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sosIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  sosSubtitle: {
    fontSize: 11,
    color: '#B91C1C',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  versionText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
