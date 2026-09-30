import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';

export default function RepairsScreen() {
  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={brand.logo} style={styles.headerLogo} contentFit="contain" />
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color={colors.navy} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.md, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        <View style={styles.activeBanner}>
          <View style={styles.activeTopRow}>
            <View style={styles.ticketBadge}>
              <Ionicons name="construct-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.ticketText}>ACTIVE TICKET #REP-9042</Text>
            </View>
            <View style={styles.liveDispatchBadge}>
              <View style={styles.dotOrange} />
              <Text style={styles.liveDispatchText}>LIVE DISPATCH</Text>
            </View>
          </View>
          
          <View style={styles.activeTimeRow}>
            <View>
              <Text style={styles.timeLabel}>Elapsed On-Site Time</Text>
              <Text style={styles.timeValue}>34m : 14s</Text>
            </View>
            <View style={styles.targetCol}>
              <Text style={styles.targetLabel}>Target SLA</Text>
              <Text style={styles.targetValue}>{'<'} 45 mins</Text>
            </View>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>Lifecycle Timeline</Text>
            <View style={styles.phaseBadge}><Text style={styles.phaseText}>Phase 4 of 5</Text></View>
          </View>

          {/* Timeline Step 1 */}
          <View style={styles.timelineStep}>
            <View style={styles.stepIconBoxDone}>
              <Ionicons name="checkmark" size={15} color="#1E3A8A" />
            </View>
            <View style={styles.stepLineDone} />
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitleDone}>Request Received</Text>
                <Text style={styles.stepTime}>10:14 AM</Text>
              </View>
              <Text style={styles.stepDesc}>Logged via Haul360 Breakdown Alert</Text>
            </View>
          </View>

          {/* Timeline Step 2 */}
          <View style={styles.timelineStep}>
            <View style={styles.stepIconBoxDone}>
              <Ionicons name="document-text-outline" size={15} color="#1E3A8A" />
            </View>
            <View style={styles.stepLineDone} />
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitleDone}>Accepted & Dispatched</Text>
                <Text style={styles.stepTime}>10:16 AM</Text>
              </View>
              <Text style={styles.stepDesc}>Tech Van 04 route assigned</Text>
            </View>
          </View>

          {/* Timeline Step 3 */}
          <View style={styles.timelineStep}>
            <View style={styles.stepIconBoxDone}>
              <Ionicons name="location-outline" size={15} color="#1E3A8A" />
            </View>
            <View style={styles.stepLineDone} />
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitleDone}>Reached Location</Text>
                <Text style={styles.stepTime}>10:28 AM</Text>
              </View>
              <View style={styles.geofenceBadge}>
                <Ionicons name="navigate-outline" size={12} color="#1E3A8A" style={{ marginRight: 4 }} />
                <Text style={styles.geofenceText}>Geofence NH-48 Confirmed</Text>
              </View>
            </View>
          </View>

          {/* Timeline Step 4 (Active) */}
          <View style={styles.timelineStep}>
            <View style={styles.stepIconBoxActive}>
              <Ionicons name="sync-outline" size={15} color="#FFFFFF" />
            </View>
            <View style={styles.stepLinePending} />
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitleActive}>Repair In Progress</Text>
                <View style={styles.activePill}><Text style={styles.activePillText}>ACTIVE</Text></View>
              </View>
              <Text style={styles.stepDesc}>Replacing belt & tensioner assembly</Text>
            </View>
          </View>

          {/* Timeline Step 5 (Pending) */}
          <View style={styles.timelineStepLast}>
            <View style={styles.stepIconBoxPending}>
              <Ionicons name="checkmark" size={15} color="#94A3B8" />
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitlePending}>Repair Completed</Text>
                <Text style={styles.stepTimePending}>Pending</Text>
              </View>
              <Text style={styles.stepDescPending}>Requires driver OTP sign-off</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.driverRow}>
            <View style={styles.truckIconBox}>
              <Ionicons name="car-sport-outline" size={20} color={colors.navy} />
            </View>
            <View style={styles.driverInfo}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>Rajesh Singh</Text>
                <View style={styles.driverBadge}><Text style={styles.driverBadgeText}>DRIVER</Text></View>
              </View>
              <Text style={styles.truckInfo}>MH 12 AB 4589 • Tata Signa 4825.TK</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
              <Ionicons name="call" size={16} color={colors.navy} />
            </TouchableOpacity>
          </View>

          <View style={styles.siteHeaderRow}>
            <Text style={styles.siteLabel}>BREAKDOWN SITE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} style={{ marginRight: 2 }} />
              <Text style={styles.siteHub}>NH-48 Corridor</Text>
            </View>
          </View>
          <Text style={styles.siteAddress}>Vadodara Highway Shoulder, Bay 4 (KM 142.6)</Text>
          
          <View style={styles.geofenceBox}>
            <Ionicons name="location" size={14} color="#1E3A8A" style={{ marginRight: 4 }} />
            <Text style={styles.geofenceBoxText}>GPS Geofence Synced</Text>
          </View>

          <View style={styles.diagnosisBox}>
            <View style={styles.diagTitleRow}>
              <Ionicons name="alert-circle" size={15} color="#DC2626" style={{ marginRight: 4 }} />
              <Text style={styles.diagTitle}>Primary Diagnosis</Text>
            </View>
            <Text style={styles.diagDesc}>Alternator Belt snapped under peak payload tension. Idler/tensioner pulley bearing seized with heavy friction wear.</Text>
          </View>

          <View style={styles.partsHeaderRow}>
            <Text style={styles.partsLabel}>PARTS & VERIFICATION</Text>
            <Text style={styles.partsCount}>2 of 3 Done</Text>
          </View>

          <View style={styles.partRowDone}>
            <View style={styles.checkSquare}>
              <Ionicons name="checkmark" size={12} color={colors.green} />
            </View>
            <View style={styles.partInfo}>
              <Text style={styles.partName}>Heavy Duty Poly-V Alternator Belt</Text>
              <Text style={styles.partSub}>OEM Tata/Cummins #8PK2045</Text>
            </View>
            <Text style={styles.partPrice}>₹1,850</Text>
          </View>

          <View style={styles.partRowDone}>
            <View style={styles.checkSquare}>
              <Ionicons name="checkmark" size={12} color={colors.green} />
            </View>
            <View style={styles.partInfo}>
              <Text style={styles.partName}>Tensioner Pulley Assembly</Text>
              <Text style={styles.partSub}>Precision Sealed Unit</Text>
            </View>
            <Text style={styles.partPrice}>₹2,400</Text>
          </View>

          <View style={styles.partRowPending}>
            <View style={styles.checkSquareEmpty} />
            <View style={styles.partInfo}>
              <Text style={styles.partNamePending}>System Voltage & Amperage Test</Text>
              <Text style={styles.partSubPending}>Testing output at 14.2V idle</Text>
            </View>
            <View style={styles.inTestBadge}><Text style={styles.inTestText}>In-Test</Text></View>
          </View>

          <View style={styles.partsHeaderRow}>
            <Text style={styles.partsLabel}>FIELD PHOTO AUDIT</Text>
            <Text style={styles.partsCount}>2 uploads</Text>
          </View>

          <View style={styles.photoGrid}>
            <View style={styles.photoBox}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={24} color="#94A3B8" />
              </View>
              <View style={styles.photoLabel}><Text style={styles.photoLabelText}>Snapped Part</Text></View>
            </View>
            <View style={styles.photoBox}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="checkmark-circle" size={24} color={colors.green} />
              </View>
              <View style={styles.photoLabel}><Text style={styles.photoLabelText}>New Fitment</Text></View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.openFullTrackerBtn}
            onPress={() => router.push('/mechanic/repair-details?id=REP-8821' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="speedometer-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.openFullTrackerText}>Open Full Repair Tracker</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
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
  notificationBtn: { position: 'relative', padding: 4 },
  notificationDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  content: { flex: 1 },
  
  activeBanner: { backgroundColor: '#111827', borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md },
  activeTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  ticketBadge: { flexDirection: 'row', alignItems: 'center' },
  ticketText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  liveDispatchBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dotOrange: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FDBA74', marginRight: 6 },
  liveDispatchText: { color: '#E2E8F0', fontSize: 10, fontWeight: 'bold' },
  activeTimeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  timeLabel: { color: '#94A3B8', fontSize: 11, marginBottom: 4 },
  timeValue: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' },
  targetCol: { alignItems: 'flex-end', paddingBottom: 4 },
  targetLabel: { color: '#94A3B8', fontSize: 10, marginBottom: 2 },
  targetValue: { color: '#E2E8F0', fontSize: 12, fontWeight: 'bold' },
  
  timelineCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0' },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  timelineTitle: { fontSize: 15, fontWeight: 'bold', color: colors.navy },
  phaseBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  phaseText: { fontSize: 10, fontWeight: 'bold', color: '#1E3A8A' },
  
  timelineStep: { flexDirection: 'row', position: 'relative', paddingBottom: spacing.xl },
  timelineStepLast: { flexDirection: 'row', position: 'relative' },
  stepIconBoxDone: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  stepLineDone: { position: 'absolute', left: 15, top: 32, bottom: -8, width: 2, backgroundColor: '#DBEAFE', zIndex: 1 },
  stepLinePending: { position: 'absolute', left: 15, top: 32, bottom: -8, width: 2, backgroundColor: '#F1F5F9', zIndex: 1 },
  stepContent: { flex: 1, paddingLeft: spacing.md, paddingTop: 4 },
  stepTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  stepTitleDone: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  stepTime: { fontSize: 11, color: colors.navy, fontWeight: 'bold' },
  stepDesc: { fontSize: 11, color: '#64748B' },
  geofenceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  geofenceText: { fontSize: 10, fontWeight: 'bold', color: '#1E3A8A' },
  
  stepIconBoxActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  stepTitleActive: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  activePill: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  activePillText: { fontSize: 9, fontWeight: 'bold', color: '#92400E' },
  stepIconBoxPending: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  stepTitlePending: { fontSize: 13, fontWeight: 'bold', color: '#94A3B8' },
  stepTimePending: { fontSize: 11, color: '#94A3B8' },
  stepDescPending: { fontSize: 11, color: '#94A3B8' },
  
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.xl, borderWidth: 1, borderColor: '#E2E8F0' },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  truckIconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  driverInfo: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  driverName: { fontSize: 15, fontWeight: 'bold', color: colors.navy, marginRight: 6 },
  driverBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  driverBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#1E3A8A' },
  truckInfo: { fontSize: 11, color: '#64748B' },
  callBtn: { backgroundColor: '#EFF6FF', width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  
  siteHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  siteLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748B' },
  siteHub: { fontSize: 11, fontWeight: 'bold', color: colors.navy },
  siteAddress: { fontSize: 13, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.sm },
  geofenceBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', marginBottom: spacing.md },
  geofenceBoxText: { fontSize: 11, fontWeight: 'bold', color: '#1E3A8A' },
  
  diagnosisBox: { backgroundColor: '#FEF2F2', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  diagTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  diagTitle: { fontSize: 12, fontWeight: 'bold', color: '#DC2626' },
  diagDesc: { fontSize: 12, color: colors.navy, lineHeight: 16 },
  
  partsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  partsLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748B' },
  partsCount: { fontSize: 11, color: '#64748B' },
  
  partRowDone: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.xs },
  checkSquare: { width: 20, height: 20, borderRadius: 4, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  partInfo: { flex: 1 },
  partName: { fontSize: 12, fontWeight: 'bold', color: colors.navy },
  partSub: { fontSize: 10, color: '#64748B' },
  partPrice: { fontSize: 12, fontWeight: 'bold', color: colors.navy },
  
  partRowPending: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  checkSquareEmpty: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E1', marginRight: spacing.sm },
  partNamePending: { fontSize: 12, fontWeight: 'bold', color: colors.navy },
  partSubPending: { fontSize: 10, color: '#64748B' },
  inTestBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  inTestText: { fontSize: 9, fontWeight: 'bold', color: '#92400E' },
  
  photoGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  photoBox: { flex: 1, height: 90, borderRadius: 8, overflow: 'hidden', backgroundColor: '#E2E8F0', position: 'relative' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' },
  photoLabel: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  photoLabelText: { fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' },
  
  openFullTrackerBtn: { flexDirection: 'row', backgroundColor: colors.navy, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  openFullTrackerText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
});
