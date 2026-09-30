import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import { mechanicProfile, mockRequests, mockRepairs } from '@/constants/mechanicMockData';

export default function MechanicDashboardScreen() {
  const [dutyOn, setDutyOn] = useState(true);
  const [sosMode, setSosMode] = useState(true);

  const activeRepair = mockRepairs[0];
  const emergencyRequest = mockRequests[0];
  const incomingLeads = mockRequests.slice(1);

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={brand.logo} style={styles.headerLogo} contentFit="contain" />
          <Text style={styles.headerDot}>•</Text>
          <Text style={styles.headerHub}>NH-48 Corridor Hub</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color={colors.navy} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarMock}>
                <Ionicons name="person" size={28} color="#94A3B8" />
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{mechanicProfile.name}</Text>
                <Ionicons name="checkmark-circle" size={15} color={colors.orange} />
              </View>
              <Text style={styles.profileTitle}>{mechanicProfile.title}</Text>
              <View style={styles.statsRow}>
                <Ionicons name="star" size={13} color={colors.orange} style={{ marginRight: 3 }} />
                <Text style={styles.ratingText}>{mechanicProfile.rating}</Text>
                <Text style={styles.statsDot}>•</Text>
                <Text style={styles.repairsText}>{mechanicProfile.repairs}</Text>
              </View>
            </View>
            <View style={styles.dutyToggle}>
              <View style={styles.dutyDot} />
              <Text style={styles.dutyText}>DUTY{'\n'}ON</Text>
            </View>
          </View>
          
          <View style={styles.profileFooter}>
            <Ionicons name="car-sport-outline" size={14} color="#CBD5E1" style={{ marginRight: 6 }} />
            <Text style={styles.footerText}>Highway Patrol Unit active ({mechanicProfile.hub})</Text>
          </View>
          <View style={styles.sosRow}>
            <Text style={styles.sosText}>Emergency SOS Mode (1.8x)</Text>
            <Switch 
              value={sosMode} 
              onValueChange={setSosMode}
              trackColor={{ false: '#475569', true: colors.orange }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Emergency SOS Breakdown */}
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
              <View style={{flex: 1}}>
                <Text style={styles.sosVehicle}>{emergencyRequest.vehicle}</Text>
                <View style={styles.vehicleTypeBadge}>
                  <Text style={styles.vehicleTypeText}>{emergencyRequest.vehicleType}</Text>
                </View>
                <Text style={styles.driverText}>Driver: {emergencyRequest.driver}</Text>
              </View>
              <View style={styles.feeBox}>
                <Text style={styles.feeLabel}>GUARANTEED{'\n'}SLA FEE</Text>
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
              <Text style={styles.locationText}>{emergencyRequest.distance} • {emergencyRequest.location}</Text>
              <View style={styles.hazardBadge}>
                <Text style={styles.hazardText}>Heavy{'\n'}Hazard</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.acceptBtn} 
                onPress={() => router.push(`/mechanic/request-details?id=${emergencyRequest.id}` as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="flash" size={15} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.acceptBtnText}>ACCEPT EMERGENCY SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
                <Ionicons name="call" size={18} color={colors.navy} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dashboard Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>REQUESTS</Text>
              <View style={styles.statIconBox}>
                <Ionicons name="document-text-outline" size={16} color={colors.navy} />
              </View>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{mechanicProfile.stats.requests.today}</Text>
              <Text style={styles.statSubValue}>+{mechanicProfile.stats.requests.new} new</Text>
            </View>
            <Text style={styles.statDesc}>Today's dispatch volume</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>ACTIVE</Text>
              <View style={styles.statIconBoxBlue}>
                <Ionicons name="construct-outline" size={16} color={colors.blue} />
              </View>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{mechanicProfile.stats.activeJobs} Job</Text>
              <Text style={styles.statSubValue}>{mechanicProfile.stats.activeDistance}</Text>
            </View>
            <Text style={styles.statDesc}>In-Progress on site</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>COMPLETED</Text>
              <View style={styles.statIconBoxGreen}>
                <Ionicons name="checkmark-done-circle-outline" size={16} color={colors.green} />
              </View>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{mechanicProfile.stats.completed}</Text>
              <Text style={styles.statSubValue}>{mechanicProfile.stats.completionRate}</Text>
            </View>
            <Text style={styles.statDesc}>This month total</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>DAILY EARNED</Text>
              <View style={styles.statIconBoxOrange}>
                <Ionicons name="wallet-outline" size={16} color={colors.orange} />
              </View>
            </View>
            <Text style={styles.statValueEarned}>{mechanicProfile.stats.dailyEarned}</Text>
            <Text style={styles.statDesc}>Instant transfer ready</Text>
          </View>
        </View>

        {/* Active Repair */}
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
                <Ionicons name="car-sport-outline" size={20} color={colors.navy} />
              </View>
              <View style={styles.vehicleInfoBox}>
                <Text style={styles.activeVehicle}>{activeRepair.vehicle}</Text>
                <Text style={styles.activeDriver}>Driver: {activeRepair.driver}</Text>
                <Text style={styles.activeService}>Stage: {activeRepair.service}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Diagnostics (Done)</Text>
                <Text style={styles.progressLabel}>Tensioning Belt (65%)</Text>
                <Text style={styles.progressLabel}>Test Run</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${activeRepair.progress}%` }]} />
              </View>
            </View>

            <View style={styles.activeFooter}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location-outline" size={13} color={colors.textSecondary} style={{ marginRight: 3 }} />
                <Text style={styles.activeLocation}>{activeRepair.location}</Text>
              </View>
              <Text style={styles.activeEst}>Est. {activeRepair.amount}</Text>
            </View>

            <TouchableOpacity 
              style={styles.openJobBtn}
              onPress={() => router.push(`/mechanic/repair-details?id=${activeRepair.id}` as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={15} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.openJobBtnText}>Open Active Job Sheet & Diagnostics</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mechanic Toolkit */}
        <Text style={styles.sectionTitle}>Mechanic Toolkit <Text style={styles.sectionSubtitle}>• NH-48 Corridor</Text></Text>
        <View style={styles.toolkitGrid}>
          {[
            { label: 'Find SOS Alerts', icon: 'warning-outline' as const },
            { label: 'Parts Stock (42)', icon: 'cube-outline' as const },
            { label: 'OBD Scanner', icon: 'hardware-chip-outline' as const },
            { label: 'Patrol Map', icon: 'navigate-outline' as const },
            { label: 'Towing Cranes', icon: 'construct-outline' as const },
            { label: 'Fast Payout', icon: 'wallet-outline' as const },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.toolkitItem} activeOpacity={0.8}>
              <View style={styles.toolkitIcon}>
                <Ionicons name={item.icon} size={20} color={colors.navy} />
              </View>
              <Text style={styles.toolkitText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sector Patrol Radius */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={16} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.sectionTitleIcon}>NH-48 Sector Patrol Radius</Text>
          </View>
          <View style={styles.coverageBadge}>
            <Text style={styles.coverageText}>15 km{'\n'}Coverage</Text>
          </View>
        </View>
        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
             <View style={styles.mapMarkerBlue}>
               <Text style={styles.mapMarkerText}>Your Service Van: Sector 34</Text>
             </View>
             <View style={styles.mapMarkerWhite}>
               <Text style={styles.mapMarkerTextBlack}>3 Trucks Idle Nearby</Text>
             </View>
          </View>
          <View style={styles.mapFooter}>
            <Text style={styles.mapFooterText}>Highway Congestion: Normal flow (54 km/h)</Text>
            <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
          </View>
        </View>

        {/* Incoming Standby Leads */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Incoming Standby Leads</Text>
          <Text style={styles.autoRefreshText}>Auto-Refreshes</Text>
        </View>
        
        {incomingLeads.map((lead) => (
          <View key={lead.id} style={styles.leadCard}>
            <View style={styles.leadIconBox}>
              <Ionicons name="car-sport-outline" size={20} color={colors.navy} />
            </View>
            <View style={styles.leadInfo}>
              <View style={styles.leadTitleRow}>
                <Text style={styles.leadTitle}>{lead.vehicle}</Text>
                <View style={styles.distBadge}><Text style={styles.distText}>{lead.distance}</Text></View>
              </View>
              <Text style={styles.leadSubtitle}>{lead.vehicleType} • Driver: {lead.driver}</Text>
              <Text style={styles.leadFooter}>Est. {lead.amount} • {lead.service}</Text>
            </View>
            <TouchableOpacity 
              style={styles.reviewBtn}
              onPress={() => router.push(`/mechanic/request-details?id=${lead.id}` as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewBtnText}>Review</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 90, height: 26 },
  headerDot: { color: colors.textSecondary, marginHorizontal: 8 },
  headerHub: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  notificationBtn: { position: 'relative', padding: 4 },
  notificationDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  
  // Profile
  profileCard: { backgroundColor: '#1E293B', borderRadius: 16, overflow: 'hidden', marginBottom: spacing.md },
  profileRow: { flexDirection: 'row', padding: spacing.lg, alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: spacing.md },
  avatarMock: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.green, borderWidth: 2, borderColor: '#1E293B' },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginRight: 6 },
  profileTitle: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: colors.orange },
  statsDot: { color: '#64748B', marginHorizontal: 6, fontSize: 10 },
  repairsText: { fontSize: 11, color: '#E2E8F0' },
  dutyToggle: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  dutyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: 6 },
  dutyText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  profileFooter: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center' },
  footerText: { color: '#CBD5E1', fontSize: 11 },
  sosRow: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sosText: { color: colors.orange, fontSize: 12, fontWeight: 'bold' },
  
  // SOS Breakdown
  sosCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#FEE2E2', boxShadow: '0px 2px 8px rgba(220, 38, 38, 0.08)', elevation: 2 },
  sosHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sosBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sosBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#991B1B' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timerText: { fontSize: 12, fontWeight: 'bold', color: '#DC2626' },
  sosVehicleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  sosVehicle: { fontSize: 17, fontWeight: 'bold', color: colors.navy, marginBottom: 4 },
  vehicleTypeBadge: { backgroundColor: '#E0E7FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
  vehicleTypeText: { fontSize: 10, color: '#3730A3', fontWeight: 'bold' },
  driverText: { fontSize: 12, color: colors.textSecondary },
  feeBox: { alignItems: 'flex-end' },
  feeLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'right', fontWeight: 'bold', marginBottom: 2 },
  feeAmount: { fontSize: 20, fontWeight: 'bold', color: '#B45309' },
  failureBox: { backgroundColor: '#FEF2F2', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  failureTitle: { fontSize: 11, fontWeight: 'bold', color: '#B91C1C' },
  failureDesc: { fontSize: 13, color: colors.navy, fontStyle: 'italic' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  locationText: { flex: 1, fontSize: 12, color: colors.textSecondary },
  hazardBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignItems: 'center' },
  hazardText: { fontSize: 10, fontWeight: 'bold', color: colors.navy, textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  acceptBtn: { flex: 1, backgroundColor: colors.navy, paddingVertical: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  callBtn: { backgroundColor: '#EFF6FF', width: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  statTitle: { fontSize: 11, fontWeight: 'bold', color: colors.textSecondary },
  statIconBox: { width: 28, height: 28, backgroundColor: '#F1F5F9', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statIconBoxBlue: { width: 28, height: 28, backgroundColor: '#DBEAFE', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statIconBoxGreen: { width: 28, height: 28, backgroundColor: '#DCFCE7', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statIconBoxOrange: { width: 28, height: 28, backgroundColor: '#FFEDD5', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.navy, marginRight: 6 },
  statValueEarned: { fontSize: 22, fontWeight: 'bold', color: colors.navy, marginBottom: 4 },
  statSubValue: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  statDesc: { fontSize: 11, color: colors.textSecondary },

  // Active Repair
  activeRepairCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0' },
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  activeTitleRow: { flexDirection: 'row', alignItems: 'center' },
  dotNavy: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.navy, marginRight: 6 },
  activeTitle: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeBadgeText: { fontSize: 11, fontWeight: 'bold', color: colors.navy },
  activeVehicleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  vehicleIconBox: { width: 40, height: 40, backgroundColor: '#EFF6FF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  vehicleInfoBox: { flex: 1 },
  activeVehicle: { fontSize: 15, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  activeDriver: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  activeService: { fontSize: 11, fontWeight: 'bold', color: colors.navy },
  progressContainer: { marginBottom: spacing.md },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.navy },
  activeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  activeLocation: { fontSize: 11, color: colors.textSecondary },
  activeEst: { fontSize: 12, fontWeight: 'bold', color: colors.navy },
  openJobBtn: { flexDirection: 'row', backgroundColor: '#EFF6FF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  openJobBtnText: { fontSize: 13, fontWeight: 'bold', color: colors.navy },

  // Toolkit
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.md },
  sectionSubtitle: { fontSize: 12, color: colors.textSecondary, fontWeight: 'normal' },
  toolkitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  toolkitItem: { width: '31%', backgroundColor: '#FFFFFF', paddingVertical: spacing.md, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  toolkitIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  toolkitText: { fontSize: 10, fontWeight: 'bold', color: colors.navy, textAlign: 'center' },

  // Map
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitleIcon: { fontSize: 15, fontWeight: 'bold', color: colors.navy },
  coverageBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  coverageText: { fontSize: 10, fontWeight: 'bold', color: colors.navy, textAlign: 'center' },
  mapCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: spacing.xl, borderWidth: 1, borderColor: '#E2E8F0' },
  mapPlaceholder: { height: 130, backgroundColor: '#E2E8F0', padding: spacing.md, justifyContent: 'space-between' },
  mapMarkerBlue: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  mapMarkerText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  mapMarkerWhite: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-end', elevation: 2 },
  mapMarkerTextBlack: { color: colors.navy, fontSize: 11, fontWeight: 'bold' },
  mapFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, backgroundColor: '#FAFAFA' },
  mapFooterText: { fontSize: 11, fontWeight: 'bold', color: colors.textPrimary },

  // Leads
  autoRefreshText: { fontSize: 11, color: colors.textSecondary, fontWeight: 'bold' },
  leadCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm, borderWidth: 1, borderColor: '#E2E8F0' },
  leadIconBox: { width: 40, height: 40, backgroundColor: '#EFF6FF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  leadInfo: { flex: 1 },
  leadTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  leadTitle: { fontSize: 14, fontWeight: 'bold', color: colors.navy, marginRight: 8 },
  distBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  distText: { fontSize: 9, fontWeight: 'bold', color: colors.navy },
  leadSubtitle: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  leadFooter: { fontSize: 11, color: colors.navy, fontWeight: '500' },
  reviewBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  reviewBtnText: { fontSize: 12, fontWeight: 'bold', color: colors.navy },
});
