import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeProfileScreen() {
  const { office, drivers, vehicles, shipments } = useTransportOffice();

  const handleLogout = () => {
    router.replace('/auth/login?role=Transport%20Office' as any);
  };

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={brand.logo} style={styles.logo} contentFit="contain" />
          <TouchableOpacity
            style={styles.settingsIconBtn}
            onPress={() => router.push('/transport-office/settings' as any)}
          >
            <Ionicons name="settings-outline" size={22} color={colors.navy} />
          </TouchableOpacity>
        </View>

        {/* HERO OFFICE CARD */}
        <View style={styles.profileHero}>
          <View style={styles.officeAvatarCircle}>
            <Ionicons name="business" size={32} color={colors.navy} />
          </View>

          <Text style={styles.officeName}>{office.name}</Text>
          <Text style={styles.officeId}>Office ID: {office.id}</Text>

          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.green} style={{ marginRight: 4 }} />
            <Text style={styles.verifiedText}>Verified Transport Hub</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{drivers.length}</Text>
              <Text style={styles.statLbl}>Drivers</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{vehicles.length}</Text>
              <Text style={styles.statLbl}>Vehicles</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{shipments.length}</Text>
              <Text style={styles.statLbl}>Hauls</Text>
            </View>
          </View>
        </View>

        {/* MANAGER & CONTACT INFO */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Hub Contact & Location</Text>
            <TouchableOpacity onPress={() => router.push('/transport-office/edit-profile' as any)}>
              <Text style={styles.editLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fleet Manager:</Text>
            <Text style={styles.infoVal}>{office.managerName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Official Phone:</Text>
            <Text style={styles.infoVal}>+91 {office.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dispatch Email:</Text>
            <Text style={styles.infoVal}>{office.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Operating Hub Address:</Text>
            <Text style={styles.infoVal}>{office.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City, State & PIN:</Text>
            <Text style={styles.infoVal}>{office.city}, {office.state} - {office.pincode}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Govt Reg No.:</Text>
            <Text style={styles.infoVal}>{office.registrationNumber}</Text>
          </View>
        </View>

        {/* QUICK MANAGEMENT LINKS */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/transport-office/history' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Audit & Operational History</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/transport-office/notifications' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Notifications & Broadcasts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/transport-office/settings' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Security & Network Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 12 }} />
              <Text style={[styles.menuText, { color: '#DC2626' }]}>Sign Out of Transport Office</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>

        <View style={styles.brandingFooter}>
          <Text style={styles.brandingText}>HAUL360 FLEET HUB • v1.0.0</Text>
          <Text style={styles.tagline}>{brand.tagline}</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 120,
    height: 36,
  },
  settingsIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHero: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  officeAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  officeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  officeId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.green,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statLbl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDiv: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  editLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '60%',
    textAlign: 'right',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  brandingFooter: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  brandingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.slate,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
