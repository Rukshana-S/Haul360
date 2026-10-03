import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import { useAuth } from '@/context/AuthContext';
import { useMechanic } from '@/context/MechanicContext';
import {
  AvailabilitySelector,
  statusConfig,
} from '@/components/mechanic/AvailabilitySelector';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const {
    profile,
    availability,
    setAvailability,
    sosMode,
    setSosMode,
  } = useMechanic();

  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/auth/login?role=Mechanic' as any);
  };

  // Derive authenticated mechanic display name gracefully from AuthContext, then local profile state
  const mechanicName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
      user.mobile ||
      profile.mobile ||
      'Mechanic'
    : [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
      profile.mobile ||
      'Mechanic';

  const mechanicMobile = user?.mobile || profile.mobile || 'Not provided';
  const mechanicEmail = user?.email || profile.email || 'mechanic@haul360.in';

  const currentStatus = statusConfig[availability];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={brand.logo} style={styles.headerLogo} contentFit="contain" />
          <Text style={styles.headerDot}>•</Text>
          <Text style={styles.headerTitle}>Mechanic Profile</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/mechanic/settings')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons name="settings-outline" size={20} color={colors.navy} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBox}>
                <Ionicons name="person" size={36} color="#64748B" />
              </View>
              <TouchableOpacity
                style={styles.avatarCameraBadge}
                activeOpacity={0.8}
                onPress={() => router.push('/mechanic/edit-profile')}
                accessibilityRole="button"
                accessibilityLabel="Edit profile picture"
              >
                <Ionicons name="camera" size={13} color={colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroInfo}>
              <View style={styles.badgeRow}>
                <View style={styles.partnerBadge}>
                  <Ionicons name="shield-checkmark" size={11} color={colors.orange} style={styles.badgeIcon} />
                  <Text style={styles.partnerBadgeText}>Verified Partner</Text>
                </View>
                <View style={styles.experienceBadge}>
                  <Text style={styles.experienceBadgeText}>{profile.yearsOfExperience}</Text>
                </View>
              </View>

              <Text style={styles.mechanicName} numberOfLines={1}>
                {mechanicName}
              </Text>
              <Text style={styles.mechanicSpecialty} numberOfLines={1}>
                {profile.mechanicType}
              </Text>

              <View style={styles.ratingRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color={colors.orange} style={styles.badgeIcon} />
                  <Text style={styles.ratingValue}>{profile.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewsCount}> ({profile.totalReviews} reviews)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Repairs Done</Text>
              <Text style={styles.metricValue}>{profile.completedRepairsCount}+</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Avg Highway ETA</Text>
              <Text style={styles.metricValue}>18 min</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>SLA Resolution</Text>
              <Text style={styles.metricValue}>98.4%</Text>
            </View>
          </View>
        </View>

        {/* Quick Navigation Action Grid */}
        <View style={styles.quickNavGrid}>
          <TouchableOpacity
            style={styles.quickNavCard}
            onPress={() => router.push('/mechanic/edit-profile')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="create-outline" size={20} color={colors.blue} />
            </View>
            <Text style={styles.quickNavTitle}>Edit Profile</Text>
            <Text style={styles.quickNavSubtitle}>Update info & skills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickNavCard}
            onPress={() => router.push('/mechanic/service-history')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Service History"
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="time-outline" size={20} color={colors.green} />
            </View>
            <Text style={styles.quickNavTitle}>Job History</Text>
            <Text style={styles.quickNavSubtitle}>Settled jobs & logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickNavCard}
            onPress={() => router.push('/mechanic/reviews')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Customer Reviews"
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star-outline" size={20} color={colors.orange} />
            </View>
            <Text style={styles.quickNavTitle}>Reviews</Text>
            <Text style={styles.quickNavSubtitle}>Driver feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickNavCard}
            onPress={() => router.push('/mechanic/settings')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <View style={[styles.quickNavIcon, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="settings-outline" size={20} color={colors.navy} />
            </View>
            <Text style={styles.quickNavTitle}>Settings</Text>
            <Text style={styles.quickNavSubtitle}>Tones & security</Text>
          </TouchableOpacity>
        </View>

        {/* Live Availability & Patrol Mode Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="radio-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Dispatch Availability</Text>
            </View>
            <TouchableOpacity
              onPress={() => setAvailabilityModalVisible(true)}
              style={styles.changeBtn}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Change availability status"
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.statusBanner, { backgroundColor: currentStatus.bgColor }]}
            onPress={() => setAvailabilityModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.statusIconBox, { backgroundColor: colors.white }]}>
              <Ionicons name={currentStatus.icon} size={20} color={currentStatus.color} />
            </View>
            <View style={styles.statusInfo}>
              <View style={styles.statusTitleRow}>
                <Text style={[styles.statusLabel, { color: colors.navy }]}>{currentStatus.label}</Text>
                <View style={[styles.activePill, { backgroundColor: currentStatus.color }]}>
                  <Text style={styles.activePillText}>ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.statusSublabel}>{currentStatus.sublabel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.navy} />
          </TouchableOpacity>

          <View style={styles.patrolRow}>
            <View style={styles.patrolInfo}>
              <View style={styles.patrolTitleRow}>
                <Text style={styles.patrolTitle}>24/7 SOS Patrol Mode</Text>
                <View style={[styles.liveDot, { backgroundColor: sosMode ? colors.green : '#94A3B8' }]} />
              </View>
              <Text style={styles.patrolDesc}>
                {sosMode
                  ? 'Accepting urgent roadside breakdown dispatches along corridor'
                  : 'SOS dispatches paused'}
              </Text>
            </View>
            <Switch
              value={sosMode}
              onValueChange={setSosMode}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Toggle 24/7 SOS Patrol Mode"
            />
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/mechanic/edit-profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{mechanicName}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile</Text>
              <Text style={styles.infoValue}>+91 {mechanicMobile}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{mechanicEmail}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Registered Role</Text>
              <View style={styles.roleBadge}>
                <Ionicons name="construct" size={11} color={colors.blue} style={styles.badgeIcon} />
                <Text style={styles.roleBadgeText}>Commercial Fleet Mechanic</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Workshop Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="business-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Workshop & Mobile Hub</Text>
            </View>
            <View style={styles.hqBadge}>
              <Text style={styles.hqBadgeText}>HQ & PATROL</Text>
            </View>
          </View>

          <View style={styles.workshopBox}>
            <Text style={styles.workshopName}>{profile.workshopName}</Text>
            <View style={styles.locItem}>
              <Ionicons name="location-outline" size={16} color={colors.navy} style={styles.locIcon} />
              <Text style={styles.workshopAddress}>
                {profile.workshopAddress}, {profile.city}, {profile.state} - {profile.pincode}
              </Text>
            </View>

            <View style={styles.radiusRow}>
              <Ionicons name="navigate-outline" size={16} color={colors.blue} style={styles.locIcon} />
              <View style={styles.radiusInfo}>
                <Text style={styles.radiusLabel}>Highway Coverage Ring: <Text style={styles.radiusVal}>{profile.coverageRadius}</Text></Text>
                <Text style={styles.radiusDesc}>
                  Equipped with pneumatic tools, 50T hydraulic jacks, DC welding kit & BS-VI scanners.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Experience & Specialization */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="ribbon-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Experience & Certification</Text>
            </View>
          </View>

          <View style={styles.expBox}>
            <View style={styles.expRow}>
              <View style={styles.expCol}>
                <Text style={styles.expLabel}>Total Experience</Text>
                <Text style={styles.expValue}>{profile.yearsOfExperience}</Text>
              </View>
              <View style={styles.expDivider} />
              <View style={styles.expCol}>
                <Text style={styles.expLabel}>Mechanic Type</Text>
                <Text style={styles.expValue}>{profile.mechanicType}</Text>
              </View>
            </View>

            <View style={styles.certCard}>
              <Ionicons name="shield-checkmark" size={18} color={colors.green} style={styles.certIcon} />
              <View style={styles.certInfo}>
                <Text style={styles.certTitle}>{profile.certificateStatus}</Text>
                <Text style={styles.certDesc}>Authorized Heavy Commercial Fleet Breakdown Specialist</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services Offered */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="construct-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Services Offered</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/mechanic/edit-profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipsWrap}>
            {profile.services.map((service) => (
              <View key={service} style={styles.serviceChip}>
                <Ionicons name="checkmark-circle" size={13} color={colors.blue} style={styles.chipIcon} />
                <Text style={styles.serviceChipText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Supported Vehicle Types */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="bus-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Supported Vehicles</Text>
            </View>
          </View>

          <View style={styles.chipsWrap}>
            {profile.vehicleTypes.map((vType) => (
              <View key={vType} style={styles.vehicleChip}>
                <Ionicons name="car-outline" size={13} color={colors.navy} style={styles.chipIcon} />
                <Text style={styles.vehicleChipText}>{vType}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Verification Status & Terminal Credentials */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Terminal Verification</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                profile.verificationStatus === 'VERIFIED'
                  ? styles.verifiedPill
                  : profile.verificationStatus === 'PENDING'
                  ? styles.pendingPill
                  : styles.rejectedPill,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  profile.verificationStatus === 'VERIFIED'
                    ? styles.verifiedPillText
                    : profile.verificationStatus === 'PENDING'
                    ? styles.pendingPillText
                    : styles.rejectedPillText,
                ]}
              >
                {profile.verificationStatus}
              </Text>
            </View>
          </View>

          <Text style={styles.verificationNote}>
            Demonstration mode: Credentials verified for local terminal workspace.
          </Text>

          <View style={styles.credItem}>
            <View style={styles.credIconBox}>
              <Ionicons name="id-card-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.credContent}>
              <Text style={styles.credTitle}>
                Aadhaar (UIDAI) <Text style={styles.credMask}>XXXX-XXXX-1029</Text>
              </Text>
              <Text style={styles.credSub}>DigiLocker Identity Verified</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          </View>

          <View style={styles.credItem}>
            <View style={styles.credIconBox}>
              <Ionicons name="card-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.credContent}>
              <Text style={styles.credTitle}>
                PAN Card <Text style={styles.credMask}>ABCDE1234F</Text>
              </Text>
              <Text style={styles.credSub}>GST & Fast Payout Settlement</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          </View>
        </View>

        {/* Payout Account */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="wallet-outline" size={18} color={colors.navy} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Payout Account</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/mechanic/earnings')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="View Earnings and Payouts"
            >
              <Text style={styles.editLink}>View Earnings</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.payoutBox}
            onPress={() => router.push('/mechanic/earnings')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open Earnings screen"
          >
            <View style={styles.payoutIconBox}>
              <Ionicons name="business-outline" size={20} color={colors.navy} />
            </View>
            <View style={styles.payoutContent}>
              <Text style={styles.payoutTitle}>{profile.bankName}</Text>
              <Text style={styles.payoutSub}>{profile.bankAccountMasked}</Text>
            </View>
            <View style={styles.instantBadge}>
              <Text style={styles.instantBadgeText}>Instant Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Log Out from Terminal"
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={styles.logoutBtnIcon} />
          <Text style={styles.logoutBtnText}>Log Out from Terminal</Text>
        </TouchableOpacity>

        {/* Footer Info */}
        <Text style={styles.versionText}>
          Haul360 Mechanic Terminal v2.14.0 (Build 9042){'\n'}
          Smart Freight. Smarter Hauling. • NH-48 Corridor Node
        </Text>
      </ScrollView>

      {/* Availability Selector Modal */}
      <AvailabilitySelector
        status={availability}
        visible={availabilityModalVisible}
        onSelect={(newStatus) => setAvailability(newStatus)}
        onClose={() => setAvailabilityModalVisible(false)}
      />

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Ionicons name="log-out" size={26} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Log Out of Terminal?</Text>
            <Text style={styles.modalDesc}>
              You will be signed out of your mechanic account. You can log back in at any time with your credentials.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cancel logout"
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnLogout}
                onPress={confirmLogout}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Confirm logout"
              >
                <Text style={styles.modalBtnLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 88,
    height: 26,
  },
  headerDot: {
    color: '#94A3B8',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.navy,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeIcon: {
    marginRight: 3,
  },
  partnerBadgeText: {
    color: '#FDBA74',
    fontSize: 10,
    fontWeight: '700',
  },
  experienceBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  experienceBadgeText: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '600',
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  mechanicSpecialty: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  reviewsCount: {
    fontSize: 11,
    color: '#B45309',
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },

  // Quick Nav Grid
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  quickNavCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickNavIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 1,
  },
  quickNavSubtitle: {
    fontSize: 10,
    color: '#64748B',
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  editLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
  },
  changeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
  },

  // Status Banner
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  statusIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },
  activePill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusSublabel: {
    fontSize: 10,
    color: '#64748B',
  },

  // Patrol
  patrolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  patrolInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  patrolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  patrolTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginRight: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  patrolDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },

  // Personal Info
  infoList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },

  // Workshop
  hqBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hqBadgeText: {
    color: '#1E3A8A',
    fontSize: 9,
    fontWeight: '800',
  },
  workshopBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 10,
  },
  workshopName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 4,
  },
  locItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  locIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  workshopAddress: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    flex: 1,
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    padding: spacing.xs,
    borderRadius: 6,
    marginTop: 4,
  },
  radiusInfo: {
    flex: 1,
  },
  radiusLabel: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '600',
  },
  radiusVal: {
    color: colors.blue,
    fontWeight: '700',
  },
  radiusDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    lineHeight: 14,
  },

  // Experience
  expBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: spacing.sm,
  },
  expRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  expCol: {
    flex: 1,
  },
  expLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  expValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  expDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: spacing.sm,
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.xs,
    borderRadius: 6,
  },
  certIcon: {
    marginRight: 6,
  },
  certInfo: {
    flex: 1,
  },
  certTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  certDesc: {
    fontSize: 9,
    color: '#15803D',
  },

  // Chips
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipIcon: {
    marginRight: 4,
  },
  serviceChipText: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '600',
  },
  vehicleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  vehicleChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },

  // Verification
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedPill: {
    backgroundColor: '#DCFCE7',
  },
  pendingPill: {
    backgroundColor: '#FEF3C7',
  },
  rejectedPill: {
    backgroundColor: '#FEE2E2',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  verifiedPillText: {
    color: '#166534',
  },
  pendingPillText: {
    color: '#92400E',
  },
  rejectedPillText: {
    color: '#991B1B',
  },
  verificationNote: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: spacing.xs,
  },
  credItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.xs,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
  credIconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  credContent: {
    flex: 1,
  },
  credTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  credMask: {
    color: '#64748B',
    fontWeight: 'normal',
  },
  credSub: {
    fontSize: 10,
    color: '#64748B',
  },

  // Payout
  defaultPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultPillText: {
    fontSize: 9,
    color: '#166534',
    fontWeight: '700',
  },
  payoutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 8,
  },
  payoutIconBox: {
    width: 36,
    height: 36,
    backgroundColor: '#DBEAFE',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  payoutContent: {
    flex: 1,
  },
  payoutTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  payoutSub: {
    fontSize: 11,
    color: '#64748B',
  },
  instantBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  instantBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.navy,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnIcon: {
    marginRight: 6,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  versionText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: spacing.lg,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  modalDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 17,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: colors.navy,
    fontWeight: '700',
    fontSize: 13,
  },
  modalBtnLogout: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnLogoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
