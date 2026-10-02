import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import {
  mechanicProfile,
  mockRequests,
  mockRepairs,
} from '@/constants/mechanicMockData';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/mechanic/StatCard';
import {
  AvailabilitySelector,
  AvailabilityStatus,
  statusConfig,
} from '@/components/mechanic/AvailabilitySelector';

export default function MechanicDashboardScreen() {
  const { user, isLoading, logout } = useAuth();
  const [availability, setAvailability] = useState<AvailabilityStatus>('AVAILABLE');
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [sosMode, setSosMode] = useState(true);

  if (isLoading) {
    return (
      <Screen safeArea style={styles.container}>
        <LoadingState message="Loading mechanic terminal..." />
      </Screen>
    );
  }

  // Ensure role guard for authenticated user
  if (user && user.role !== 'mechanic') {
    return (
      <Screen safeArea style={styles.container}>
        <ErrorState
          title="Unauthorized Role"
          message={`Your account role is '${user.role}'. This terminal is restricted to Haul360 verified mechanics.`}
          onRetry={async () => {
            await logout();
            router.replace('/auth/login?role=Mechanic' as any);
          }}
        />
      </Screen>
    );
  }

  // Derive real mechanic display name from AuthContext
  const mechanicName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      user.mobile ||
      mechanicProfile.name
    : mechanicProfile.name;

  const activeRepair = mockRepairs[0];
  const emergencyRequest = mockRequests.find((r) => r.isEmergency) || mockRequests[0];
  const incomingLeads = mockRequests.filter((r) => r.id !== emergencyRequest?.id);
  const currentStatus = statusConfig[availability];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={brand.logo} style={styles.headerLogo} contentFit="contain" />
          <View style={styles.headerSeparator} />
          <View style={styles.headerHubBadge}>
            <Ionicons name="location-sharp" size={12} color={colors.navy} style={{ marginRight: 3 }} />
            <Text style={styles.headerHubText}>NH-48 Hub</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.statusPill, { backgroundColor: currentStatus.bgColor }]}
            onPress={() => setAvailabilityModalVisible(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Current status: ${currentStatus.label}. Tap to change.`}
          >
            <Ionicons name={currentStatus.icon} size={13} color={currentStatus.color} style={{ marginRight: 4 }} />
            <Text style={[styles.statusPillText, { color: currentStatus.color }]}>
              {currentStatus.label}
            </Text>
            <Ionicons name="chevron-down" size={12} color={currentStatus.color} style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => router.push('/mechanic/requests')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Notifications and dispatches"
          >
            <Ionicons name="notifications-outline" size={22} color={colors.navy} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mechanic Profile & Availability Banner */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarMock}>
                <Ionicons name="person" size={28} color="#94A3B8" />
              </View>
              <View style={[styles.statusDot, { backgroundColor: currentStatus.color }]} />
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {mechanicName}
                </Text>
                <Ionicons name="checkmark-circle" size={15} color={colors.orange} />
              </View>
              <Text style={styles.profileTitle} numberOfLines={1}>
                {mechanicProfile.title}
              </Text>
              <View style={styles.statsRow}>
                <Ionicons name="star" size={13} color={colors.orange} style={{ marginRight: 3 }} />
                <Text style={styles.ratingText}>{mechanicProfile.rating}</Text>
                <Text style={styles.statsDot}>•</Text>
                <Text style={styles.repairsText}>{mechanicProfile.repairs}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.dutyBtn}
              onPress={() => setAvailabilityModalVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Change duty status"
            >
              <View style={[styles.dutyIndicator, { backgroundColor: currentStatus.color }]} />
              <Text style={styles.dutyBtnText}>
                {availability === 'AVAILABLE' ? 'DUTY\nON' : availability === 'BUSY' ? 'BUSY\nJOB' : 'DUTY\nOFF'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hub Patrol & SOS Mode Row */}
          <View style={styles.profileFooter}>
            <Ionicons name="navigate-outline" size={14} color="#CBD5E1" style={{ marginRight: 6 }} />
            <Text style={styles.footerText}>
              Sector 34 Highway Patrol Node ({mechanicProfile.hub})
            </Text>
          </View>

          <View style={styles.sosRow}>
            <View style={styles.sosRowLeft}>
              <Ionicons name="flash" size={14} color={colors.orange} style={{ marginRight: 6 }} />
              <Text style={styles.sosText}>Emergency SOS Surge Protocol (1.8x)</Text>
            </View>
            <Switch
              value={sosMode}
              onValueChange={setSosMode}
              trackColor={{ false: '#475569', true: colors.orange }}
              thumbColor={colors.white}
              accessibilityLabel="Emergency SOS Mode switch"
            />
          </View>
        </View>

        {/* Real Statistics Grid using Reusable StatCard */}
        <Text style={styles.sectionHeaderTitle}>Overview Metrics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="TOTAL REQUESTS"
            value={mechanicProfile.stats.requests.today}
            subValue={`+${mechanicProfile.stats.requests.new} new`}
            desc="Today's dispatch volume"
            iconName="document-text-outline"
            iconColor={colors.navy}
            iconBgColor="#F1F5F9"
            onPress={() => router.push('/mechanic/requests')}
          />
          <StatCard
            title="ACTIVE REPAIRS"
            value={`${mockRepairs.length} Job`}
            subValue={mechanicProfile.stats.activeDistance}
            desc="In-progress on site"
            iconName="construct-outline"
            iconColor={colors.blue}
            iconBgColor="#DBEAFE"
            onPress={() => router.push('/mechanic/repairs')}
          />
          <StatCard
            title="COMPLETED"
            value={mechanicProfile.stats.completed}
            subValue={mechanicProfile.stats.completionRate}
            desc="This month settled"
            iconName="checkmark-done-circle-outline"
            iconColor={colors.green}
            iconBgColor="#DCFCE7"
            onPress={() => router.push('/mechanic/service-history')}
          />
          <StatCard
            title="DAILY EARNINGS"
            value={mechanicProfile.stats.dailyEarned}
            subValue="SLA settled"
            desc="Instant wallet ready"
            iconName="wallet-outline"
            iconColor={colors.orange}
            iconBgColor="#FFEDD5"
            onPress={() => router.push('/mechanic/earnings')}
          />
        </View>

        {/* Emergency SOS Breakdown Card */}
        {emergencyRequest && (
          <View style={styles.sosCard}>
            <View style={styles.sosHeader}>
              <View style={styles.sosBadge}>
                <Ionicons name="warning" size={13} color="#DC2626" style={{ marginRight: 4 }} />
                <Text style={styles.sosBadgeText}>HIGHWAY SOS BREAKDOWN</Text>
              </View>
              <View style={styles.timerBadge}>
                <Ionicons name="time-outline" size={13} color="#DC2626" style={{ marginRight: 3 }} />
                <Text style={styles.timerText}>{emergencyRequest.timeRequested}</Text>
              </View>
            </View>

            <View style={styles.sosVehicleRow}>
              <View style={{ flex: 1, paddingRight: spacing.sm }}>
                <Text style={styles.sosVehicle}>{emergencyRequest.vehicle}</Text>
                <View style={styles.vehicleTypeBadge}>
                  <Text style={styles.vehicleTypeText}>{emergencyRequest.vehicleType}</Text>
                </View>
                <Text style={styles.driverText}>Driver: {emergencyRequest.driver}</Text>
              </View>
              <View style={styles.feeBox}>
                <Text style={styles.feeLabel}>GUARANTEED{'\n'}SLA TARIFF</Text>
                <Text style={styles.feeAmount}>{emergencyRequest.amount}</Text>
              </View>
            </View>

            <View style={styles.failureBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Ionicons name="alert-circle" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
                <Text style={styles.failureTitle}>CRITICAL FAILURE REPORTED</Text>
              </View>
              <Text style={styles.failureDesc}>"{emergencyRequest.service}"</Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.locationText} numberOfLines={2}>
                {emergencyRequest.distance} • {emergencyRequest.location}
              </Text>
              <View style={styles.hazardBadge}>
                <Text style={styles.hazardText}>Heavy{'\n'}Hazard</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => router.push(`/mechanic/request-details?id=${emergencyRequest.id}` as any)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Accept Emergency SOS Request"
              >
                <Ionicons name="flash" size={15} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.acceptBtnText}>ACCEPT EMERGENCY SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => router.push(`/mechanic/request-details?id=${emergencyRequest.id}` as any)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="View Emergency Details"
              >
                <Ionicons name="chevron-forward" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Repair Card */}
        {activeRepair && (
          <View style={styles.activeRepairCard}>
            <View style={styles.activeHeader}>
              <View style={styles.activeTitleRow}>
                <View style={styles.dotNavy} />
                <Text style={styles.activeTitle}>Active Repair #{activeRepair.id}</Text>
              </View>
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={12} color={colors.navy} style={{ marginRight: 3 }} />
                <Text style={styles.timeBadgeText}>{activeRepair.timeElapsed}</Text>
              </View>
            </View>

            <View style={styles.activeVehicleRow}>
              <View style={styles.vehicleIconBox}>
                <Ionicons name="construct" size={20} color={colors.navy} />
              </View>
              <View style={styles.vehicleInfoBox}>
                <Text style={styles.activeVehicle}>{activeRepair.vehicle}</Text>
                <Text style={styles.activeDriver}>Customer: {activeRepair.driver}</Text>
                <Text style={styles.activeService}>Stage: {activeRepair.service}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Diagnostics (Done)</Text>
                <Text style={styles.progressLabel}>Repair ({activeRepair.progress}%)</Text>
                <Text style={styles.progressLabel}>Ready</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${activeRepair.progress}%` }]} />
              </View>
            </View>

            <View style={styles.activeFooter}>
              <View style={styles.activeLocationRow}>
                <Ionicons name="location-outline" size={13} color={colors.textSecondary} style={{ marginRight: 3 }} />
                <Text style={styles.activeLocation} numberOfLines={1}>
                  {activeRepair.location}
                </Text>
              </View>
              <Text style={styles.activeEst}>Est. {activeRepair.amount}</Text>
            </View>

            <TouchableOpacity
              style={styles.openJobBtn}
              onPress={() => router.push(`/mechanic/repair-details?id=${activeRepair.id}` as any)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Open Active Job Sheet and Diagnostics"
            >
              <Ionicons name="document-text-outline" size={15} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.openJobBtnText}>Open Active Job Sheet & Diagnostics</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions / Mechanic Toolkit */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            Quick Actions <Text style={styles.sectionSubtitle}>• Terminal Hub</Text>
          </Text>
        </View>

        <View style={styles.toolkitGrid}>
          {[
            {
              label: 'Requests',
              sublabel: 'Dispatch Queue',
              icon: 'alert-circle-outline' as const,
              route: '/mechanic/requests',
            },
            {
              label: 'Repairs',
              sublabel: 'Active Jobs',
              icon: 'construct-outline' as const,
              route: '/mechanic/repairs',
            },
            {
              label: 'Earnings',
              sublabel: 'Instant Payouts',
              icon: 'wallet-outline' as const,
              route: '/mechanic/earnings',
            },
            {
              label: 'History',
              sublabel: 'Settled Tickets',
              icon: 'time-outline' as const,
              route: '/mechanic/service-history',
            },
            {
              label: 'Reviews',
              sublabel: 'Rating 4.9',
              icon: 'star-outline' as const,
              route: '/mechanic/reviews',
            },
            {
              label: 'Profile',
              sublabel: 'Verified Hub',
              icon: 'person-outline' as const,
              route: '/mechanic/profile',
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.toolkitItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}: ${item.sublabel}`}
            >
              <View style={styles.toolkitIcon}>
                <Ionicons name={item.icon} size={20} color={colors.navy} />
              </View>
              <Text style={styles.toolkitText}>{item.label}</Text>
              <Text style={styles.toolkitSubtext}>{item.sublabel}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Incoming Standby Service Leads */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Incoming Standby Requests</Text>
            <Text style={styles.sectionSubtitle}>Live roadside queue ({incomingLeads.length})</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/mechanic/requests')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {incomingLeads.map((lead) => (
          <TouchableOpacity
            key={lead.id}
            style={styles.leadCard}
            onPress={() => router.push(`/mechanic/request-details?id=${lead.id}` as any)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Service request for ${lead.vehicle}`}
          >
            <View style={styles.leadIconBox}>
              <Ionicons name="car-sport-outline" size={20} color={colors.navy} />
            </View>
            <View style={styles.leadInfo}>
              <View style={styles.leadTitleRow}>
                <Text style={styles.leadTitle}>{lead.vehicle}</Text>
                <View style={styles.distBadge}>
                  <Text style={styles.distText}>{lead.distance}</Text>
                </View>
              </View>
              <Text style={styles.leadSubtitle} numberOfLines={1}>
                {lead.vehicleType} • Driver: {lead.driver}
              </Text>
              <Text style={styles.leadFooter} numberOfLines={1}>
                Est. {lead.amount} • {lead.location}
              </Text>
            </View>
            <View style={styles.reviewBtn}>
              <Text style={styles.reviewBtnText}>Review</Text>
              <Ionicons name="chevron-forward" size={13} color={colors.navy} style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Availability Selection Modal */}
      <AvailabilitySelector
        status={availability}
        visible={availabilityModalVisible}
        onSelect={(newStatus) => setAvailability(newStatus)}
        onClose={() => setAvailabilityModalVisible(false)}
      />
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
    width: 90,
    height: 26,
  },
  headerSeparator: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
    marginHorizontal: spacing.sm,
  },
  headerHubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  headerHubText: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notificationBtn: {
    position: 'relative',
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatarMock: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  profileInfo: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  profileTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.orange,
  },
  statsDot: {
    color: '#64748B',
    marginHorizontal: 6,
    fontSize: 10,
  },
  repairsText: {
    fontSize: 11,
    color: '#E2E8F0',
  },
  dutyBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dutyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dutyBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
  },
  profileFooter: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#CBD5E1',
    fontSize: 11,
    flex: 1,
  },
  sosRow: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sosRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sosText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: '700',
  },

  // Section Headers
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  viewAllText: {
    fontSize: 12,
    color: colors.blue,
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  // SOS Card
  sosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    elevation: 2,
  },
  sosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sosBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  sosVehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sosVehicle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 4,
  },
  vehicleTypeBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  vehicleTypeText: {
    fontSize: 10,
    color: '#3730A3',
    fontWeight: '700',
  },
  driverText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  feeBox: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'right',
    fontWeight: '700',
    marginBottom: 2,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#B45309',
  },
  failureBox: {
    backgroundColor: '#FEF2F2',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  failureTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
  },
  failureDesc: {
    fontSize: 12,
    color: colors.navy,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  hazardBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  hazardText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: colors.navy,
    paddingVertical: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  callBtn: {
    backgroundColor: '#EFF6FF',
    width: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Active Repair
  activeRepairCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotNavy: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.navy,
    marginRight: 6,
  },
  activeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  activeVehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  vehicleIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  vehicleInfoBox: {
    flex: 1,
  },
  activeVehicle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  activeDriver: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  activeService: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.navy,
  },
  activeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  activeLocation: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  activeEst: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  openJobBtn: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openJobBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },

  // Toolkit / Quick Actions
  toolkitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  toolkitItem: {
    width: '31.3%',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  toolkitIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  toolkitText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 2,
  },
  toolkitSubtext: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
  },

  // Leads
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leadIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  leadInfo: {
    flex: 1,
  },
  leadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  leadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginRight: 8,
  },
  distBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  distText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.navy,
  },
  leadSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  leadFooter: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '600',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
});
