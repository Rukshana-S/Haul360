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
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function OfficeDriverProfileScreen() {
  const { currentDriverUser, shipments, vehicles, office, driverFinancials } = useTransportOffice();

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
              Transport Office: {office.name}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{driver?.completedTripsCount || 18}</Text>
              <Text style={styles.statLabel}>Completed Trips</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>★ {driver?.rating.toFixed(1) || '4.9'}</Text>
              <Text style={styles.statLabel}>Driver Rating</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{driver?.experienceYears || 9} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* READ-ONLY OPERATIONAL INFORMATION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Operational Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Transport Office:</Text>
            <Text style={styles.infoVal}>{office.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver Management Status:</Text>
            <View style={styles.badgePillGreen}>
              <Text style={styles.badgePillGreenText}>
                {driver?.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Operational Availability:</Text>
            <View style={styles.badgePillBlue}>
              <Text style={styles.badgePillBlueText}>{driver?.availability || 'AVAILABLE'}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Assigned Vehicle:</Text>
            <Text style={styles.infoVal}>
              {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'None (In yard)'}
            </Text>
          </View>
        </View>

        {/* PERSONAL & CONTACT INFORMATION WITH EDIT PROFILE BUTTON */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Personal & Contact Details</Text>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => router.push('/office-driver/edit-profile' as any)}
            >
              <Ionicons name="create-outline" size={14} color={colors.blue} />
              <Text style={styles.editLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoVal}>{driver?.name || 'Kumar S.'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver ID:</Text>
            <Text style={styles.infoVal}>{driverId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile Number:</Text>
            <Text style={styles.infoVal}>+91 {driver?.phone || '9876543210'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoVal}>{driver?.email || 'kumar.driver@haul360.com'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoVal}>{driver?.dateOfBirth || '1992-05-14'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driving License No.:</Text>
            <Text style={styles.infoVal}>{driver?.licenseNumber || 'TN-59-2015-0084321'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>License Expiry:</Text>
            <Text style={styles.infoVal}>{driver?.licenseExpiry || '2028-11-20'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoVal}>{driver?.address || '14, Cross Cut Road, Gandhipuram'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City:</Text>
            <Text style={styles.infoVal}>{driver?.city || 'Coimbatore'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>State:</Text>
            <Text style={styles.infoVal}>{driver?.state || 'Tamil Nadu'}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Pincode:</Text>
            <Text style={styles.infoVal}>{driver?.pincode || '641012'}</Text>
          </View>
        </View>

        {/* DRIVER SERVICES & NAVIGATION MENU */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/edit-profile' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/earnings' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="cash-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.menuText}>Driver Earnings</Text>
                <Text style={styles.menuSubText}>
                  ₹{driverFinancials.totalEarnings.toLocaleString('en-IN')} Total
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

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
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/office-driver/settings' as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color={colors.navy} style={{ marginRight: 12 }} />
              <Text style={styles.menuText}>Help & Support</Text>
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
    marginBottom: spacing.xs,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
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
  badgePillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgePillGreenText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  badgePillBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgePillBlueText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
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
  menuSubText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
    marginTop: 1,
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
