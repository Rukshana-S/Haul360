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
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import {
  mechanicProfile,
  mockRequests,
  mockRepairs,
} from '@/constants/mechanicMockData';
import { useAuth } from '@/context/AuthContext';
import { useMechanic } from '@/context/MechanicContext';
import { StatCard } from '@/components/mechanic/StatCard';
import { ServiceRequestCard } from '@/components/mechanic/ServiceRequestCard';
import { RepairCard } from '@/components/mechanic/RepairCard';
import {
  AvailabilitySelector,
  AvailabilityStatus,
  statusConfig,
} from '@/components/mechanic/AvailabilitySelector';

export default function MechanicDashboardScreen() {
  const { user, isLoading, logout } = useAuth();
  const { availability, setAvailability, sosMode, setSosMode } = useMechanic();
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);

  if (isLoading) {
    return (
      <Screen safeArea style={styles.container}>
        <LoadingState message="Loading mechanic workspace..." />
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

  // Derive real mechanic display name from AuthContext gracefully
  const mechanicName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      user.mobile ||
      'Mechanic'
    : 'Mechanic';

  const activeRepair = mockRepairs[0];
  const emergencyRequest = mockRequests.find((r) => r.isEmergency) || mockRequests[0];
  const incomingLeads = mockRequests.filter((r) => r.id !== emergencyRequest?.id);
  const currentStatus = statusConfig[availability];

  return (
    <Screen safeArea style={styles.container}>
      {/* Clean Mobile Header */}
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
            <Ionicons name="notifications-outline" size={20} color={colors.navy} />
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
                <Ionicons name="person" size={26} color="#94A3B8" />
              </View>
              <View style={[styles.statusDot, { backgroundColor: currentStatus.color }]} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.greetingText}>Welcome back,</Text>
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

        {/* Overview Statistics Grid using Reusable StatCard */}
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

        {/* Active Repair Card using Reusable RepairCard */}
        {activeRepair && (
          <RepairCard
            repair={activeRepair}
            onPress={() => router.push(`/mechanic/repair-details?id=${activeRepair.id}` as any)}
          />
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
              sublabel: 'Customer Rating',
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

        {/* Incoming Standby Service Requests using Reusable ServiceRequestCard */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Incoming Standby Requests</Text>
            <Text style={styles.sectionSubtitle}>Live roadside queue ({incomingLeads.length})</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/mechanic/requests')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {incomingLeads.length === 0 ? (
          <EmptyState
            title="No incoming requests"
            message="New service and roadside assistance dispatches will appear here."
            iconName="document-text-outline"
          />
        ) : (
          incomingLeads.map((lead) => (
            <ServiceRequestCard
              key={lead.id}
              request={lead}
              onPress={() => router.push(`/mechanic/request-details?id=${lead.id}` as any)}
            />
          ))
        )}
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
    elevation: 2,
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
  greetingText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
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
    fontSize: 12,
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
});
