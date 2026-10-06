import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function OfficeDriverProfileScreen() {
  const { currentDriverUser, shipments, vehicles, office } = useTransportOffice();

  const driver = currentDriverUser;
  const driverId = driver?.id || 'H360-D-1042';

  const activeTrip = shipments.find(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT')
  );

  const assignedVehicle = activeTrip?.assignedVehicleId
    ? vehicles.find((v) => v.id === activeTrip.assignedVehicleId)
    : driver?.currentVehicleId
    ? vehicles.find((v) => v.id === driver.currentVehicleId)
    : null;

  const handleLogout = () => {
    router.replace('/auth/login?role=Driver' as any);
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
            style={styles.settingsBtn}
            onPress={() => router.push('/office-driver/settings' as any)}
          >
            <Ionicons name="settings-outline" size={22} color={colors.navy} />
          </TouchableOpacity>
        </View>

        {/* HERO DRIVER CARD */}
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {driver?.name ? driver.name.substring(0, 2).toUpperCase() : 'KS'}
            </Text>
          </View>

          <Text style={styles.driverName}>{driver?.name || 'Kumar S.'}</Text>
          <Text style={styles.driverId}>Driver ID: {driverId}</Text>

          <View style={styles.officeBadge}>
            <Ionicons name="business" size={12} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.officeBadgeText}>
              Affiliated Hub: {office.name}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{driver?.completedTripsCount || 142}</Text>
              <Text style={styles.statLabel}>Completed Hauls</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>★ {driver?.rating.toFixed(1) || '4.9'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{driver?.experienceYears || 9} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* CURRENT ASSIGNMENT (NEVER PERMANENT) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Active Fleet Assignment</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Vehicle:</Text>
            <Text style={styles.infoVal}>
              {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'None (Available in yard)'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Shipment:</Text>
            <Text style={styles.infoVal}>
              {activeTrip ? `#${activeTrip.id} (${activeTrip.origin} → ${activeTrip.destination})` : 'None'}
            </Text>
          </View>
        </View>

        {/* PERSONAL & LICENSE COMPLIANCE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal & License Verification</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile Number:</Text>
            <Text style={styles.infoVal}>+91 {driver?.phone || '9876543210'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Address:</Text>
            <Text style={styles.infoVal}>{driver?.email || 'kumar.driver@haul360.com'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driving License No.:</Text>
            <Text style={styles.infoVal}>{driver?.licenseNumber || 'TN-59-2015-0084321'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>License Validity:</Text>
            <Text style={styles.infoVal}>{driver?.licenseExpiry || '2028-11-20'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Document Verification:</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color={colors.green} />
              <Text style={styles.verifiedText}>OFFICE VERIFIED</Text>
            </View>
          </View>
        </View>

        {/* MENU OPTIONS */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/trips/history' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="time-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>My Trip History</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/notifications' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Notifications & Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/change-password' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="key-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Change Driver Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/settings' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Driver Security & App Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 12 }} />
              <Text style={[styles.menuText, { color: '#DC2626' }]}>Sign Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>

        <View style={styles.brandingFooter}>
          <Text style={styles.brandingText}>HAUL360 DRIVER FLEET • v1.0.0</Text>
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
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  avatarCircle: {
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
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  officeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
  },
  officeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statsRow: {
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
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 10,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
    marginLeft: 3,
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
