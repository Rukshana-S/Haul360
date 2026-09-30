import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';

export default function RequestsScreen() {
  const [activeTab, setActiveTab] = useState('sos');

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

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.md}} showsVerticalScrollIndicator={false}>
        
        <View style={styles.dispatcherBox}>
          <View style={styles.dispatcherLeft}>
            <View style={styles.dotOrange} />
            <Text style={styles.dispatcherText}>FAST-RESPONSE{'\n'}DISPATCHER</Text>
          </View>
          <View style={styles.dispatcherRight}>
            <Ionicons name="flash" size={15} color="#FDBA74" style={{ marginRight: 4 }} />
            <Text style={styles.multiplierText}>1.8x Peak Multiplier{'\n'}Active</Text>
          </View>
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, activeTab === 'sos' && styles.filterTabActive]} onPress={() => setActiveTab('sos')} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.filterTabText, activeTab === 'sos' && styles.filterTabTextActive]}>SOS (2)</Text>
              <View style={[styles.dotRed, { marginLeft: 4 }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterTab, activeTab === 'scheduled' && styles.filterTabActive]} onPress={() => setActiveTab('scheduled')} activeOpacity={0.8}>
            <Text style={[styles.filterTabText, activeTab === 'scheduled' && styles.filterTabTextActive]}>Scheduled (4)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterTab, activeTab === 'completed' && styles.filterTabActive]} onPress={() => setActiveTab('completed')} activeOpacity={0.8}>
            <Text style={[styles.filterTabText, activeTab === 'completed' && styles.filterTabTextActive]}>Completed (128)</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll} contentContainerStyle={{gap: spacing.sm, paddingRight: spacing.md}}>
          <View style={styles.tagDark}>
            <Ionicons name="location-outline" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.tagDarkText}>{'<'} 10 km</Text>
          </View>
          <View style={styles.tagLight}>
            <Ionicons name="car-sport-outline" size={12} color="#475569" style={{ marginRight: 4 }} />
            <Text style={styles.tagLightText}>Heavy Multi-axle</Text>
          </View>
          <View style={styles.tagLight}>
            <Ionicons name="construct-outline" size={12} color="#475569" style={{ marginRight: 4 }} />
            <Text style={styles.tagLightText}>Air Brake / Pneumatics</Text>
          </View>
        </ScrollView>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Live Inbound{'\n'}Incidents</Text>
          <View style={styles.urgentBadge}><Text style={styles.urgentText}>Urgent</Text></View>
          <Text style={styles.syncText}>Auto-syncing{'\n'}(3s)</Text>
        </View>

        {/* SOS Card */}
        <View style={styles.sosCard}>
          <View style={styles.sosCardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="warning" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.sosCardHeaderText}>EMERGENCY SOS • LIVE ROAD HAZARD</Text>
            </View>
            <View style={styles.timePill}><Text style={styles.timePillText}>3 mins ago</Text></View>
          </View>
          
          <View style={styles.cardBody}>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatarBox}>
                <View style={styles.driverAvatar}>
                  <Ionicons name="person" size={24} color="#64748B" />
                </View>
              </View>
              <View style={styles.driverInfo}>
                <View style={styles.driverNameRow}>
                  <Text style={styles.driverName}>Vikramaditya Rao</Text>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={10} color="#B45309" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
                <Text style={styles.driverSubInfo}>Haul-North Prime • ID #9410</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceText}>₹4,200</Text>
                <View style={styles.tariffBadge}><Text style={styles.tariffText}>1.8x SOS Tariff</Text></View>
              </View>
            </View>

            <View style={styles.vehicleBox}>
              <Ionicons name="car-sport-outline" size={18} color={colors.navy} style={{ marginRight: 8 }} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>Volvo FM 420 Heavy Axle</Text>
                <Text style={styles.vehiclePlate}>MH 46 DA 8011 • 28T Loaded Flatbed</Text>
              </View>
              <View style={styles.classBadge}><Text style={styles.classText}>Class 8</Text></View>
            </View>

            <View style={styles.locationBox}>
              <View style={styles.locLeft}>
                <Ionicons name="navigate" size={16} color={colors.orange} style={{ marginBottom: 2 }} />
                <View>
                  <Text style={styles.locDist}>4.2 km</Text>
                  <Text style={styles.locEta}>8m ETA</Text>
                </View>
              </View>
              <View style={styles.locDivider} />
              <View style={styles.locRight}>
                <Text style={styles.locLabel}>Breakdown Location:</Text>
                <Text style={styles.locAddress}>NH-48 Km Stone 142 near Shoolagiri</Text>
                <Text style={styles.locDanger}>Stranded on live highway lane</Text>
              </View>
            </View>

            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#B91C1C" style={{ marginRight: 6, marginTop: 2 }} />
              <Text style={styles.errorText}>"Complete steering lockup and pneumatic air pressure dropped below 4 bar while hauling heavy machinery. Truck stranded on live expressway lane."</Text>
            </View>

            <TouchableOpacity 
              style={styles.acceptBtn} 
              onPress={() => router.push('/mechanic/request-details?id=REQ-001' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="flash" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.acceptBtnText}>ACCEPT EMERGENCY DISPATCH</Text>
            </TouchableOpacity>

            <View style={styles.actionBtns}>
              <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
                <Ionicons name="call-outline" size={15} color="#1E3A8A" style={{ marginRight: 4 }} />
                <Text style={styles.secondaryBtnText}>Call Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
                <Ionicons name="map-outline" size={15} color="#1E3A8A" style={{ marginRight: 4 }} />
                <Text style={styles.secondaryBtnText}>View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* High Priority Card */}
        <View style={styles.standardCard}>
          <View style={styles.stdCardHeader}>
            <View style={styles.priorityPill}><Text style={styles.priorityPillText}>HIGH PRIORITY</Text></View>
            <Text style={styles.stdTime}>• 14 mins ago</Text>
            <Text style={styles.stdPrice}>₹2,400</Text>
          </View>
          
          <View style={styles.stdDriverRow}>
            <View style={styles.stdAvatar}>
              <Ionicons name="person" size={20} color="#64748B" />
            </View>
            <View style={styles.stdDriverInfo}>
              <Text style={styles.stdDriverName}>Gurmeet Singh</Text>
              <Text style={styles.stdDriverSub}>Eicher Pro 6035 • MH 14 CC 7731</Text>
            </View>
            <View style={styles.classBadge}><Text style={styles.classText}>20T High Bed</Text></View>
          </View>

          <View style={styles.stdLocBox}>
            <View style={styles.stdLocLeft}>
              <Text style={styles.stdLocDist}>8.6 km</Text>
              <Text style={styles.stdLocEta}>~16 mins</Text>
            </View>
            <View style={styles.stdLocDivider} />
            <View style={styles.stdLocRight}>
              <Text style={styles.stdLocAddress}>Talegaon Toll Plaza Approach Bay 3</Text>
              <Text style={styles.stdLocSub}>Safe off-lane bay area</Text>
            </View>
          </View>

          <View style={styles.stdErrorBox}>
            <Ionicons name="information-circle-outline" size={15} color={colors.navy} style={{ marginRight: 6 }} />
            <Text style={styles.stdErrorText}>"Radiator coolant overheating and burst upper hose clamp. Steam venting from hood."</Text>
          </View>

          <View style={styles.stdActionsRow}>
            <TouchableOpacity 
              style={styles.stdAcceptBtn}
              onPress={() => router.push('/mechanic/request-details?id=REQ-002' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="construct-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.stdAcceptBtnText}>Accept Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stdCallBtn} activeOpacity={0.8}>
              <Ionicons name="call-outline" size={18} color={colors.navy} />
            </TouchableOpacity>
          </View>
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
  headerDot: { color: colors.textSecondary, marginHorizontal: 8 },
  headerHub: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  notificationBtn: { position: 'relative', padding: 4 },
  notificationDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  content: { flex: 1 },
  dispatcherBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1E293B', borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  dispatcherLeft: { flexDirection: 'row', alignItems: 'center' },
  dotOrange: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FDBA74', marginRight: 8 },
  dispatcherText: { color: '#E2E8F0', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  dispatcherRight: { flexDirection: 'row', alignItems: 'center' },
  multiplierText: { color: '#FDBA74', fontSize: 11, fontWeight: 'bold' },
  filterTabs: { flexDirection: 'row', backgroundColor: '#DBEAFE', borderRadius: 10, padding: 4, marginBottom: spacing.sm },
  filterTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  filterTabActive: { backgroundColor: '#FFFFFF', elevation: 1 },
  filterTabText: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  filterTabTextActive: { color: '#B91C1C' },
  dotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DC2626' },
  tagsScroll: { marginBottom: spacing.md, maxHeight: 36 },
  tagDark: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.navy, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagDarkText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  tagLight: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  tagLightText: { color: '#475569', fontSize: 11, fontWeight: 'bold' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.navy, marginRight: spacing.sm },
  urgentBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  urgentText: { fontSize: 10, fontWeight: 'bold', color: '#B91C1C' },
  syncText: { marginLeft: 'auto', fontSize: 11, color: '#94A3B8', textAlign: 'right' },
  
  // SOS Card
  sosCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: spacing.lg, borderWidth: 1, borderColor: '#FEE2E2', elevation: 2 },
  sosCardHeader: { backgroundColor: '#B91C1C', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8 },
  sosCardHeaderText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  timePill: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timePillText: { color: '#B91C1C', fontSize: 10, fontWeight: 'bold' },
  cardBody: { padding: spacing.md },
  driverRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  driverAvatarBox: { marginRight: spacing.sm },
  driverAvatar: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  driverInfo: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center' },
  driverName: { fontSize: 15, fontWeight: 'bold', color: colors.navy, marginRight: 6 },
  ratingBox: { backgroundColor: '#FEF3C7', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, fontWeight: 'bold', marginLeft: 2, color: '#92400E' },
  driverSubInfo: { fontSize: 11, color: '#64748B', marginTop: 2 },
  priceBox: { alignItems: 'flex-end' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  tariffBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 2 },
  tariffText: { fontSize: 9, fontWeight: 'bold', color: '#92400E' },
  vehicleBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  vehiclePlate: { fontSize: 11, color: '#64748B' },
  classBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  classText: { fontSize: 10, fontWeight: 'bold', color: '#1E3A8A' },
  locationBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  locLeft: { paddingRight: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  locDist: { fontSize: 14, fontWeight: 'bold', color: colors.navy, textAlign: 'center' },
  locEta: { fontSize: 10, color: '#64748B', textAlign: 'center' },
  locDivider: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: spacing.sm },
  locRight: { flex: 1, justifyContent: 'center' },
  locLabel: { fontSize: 10, color: '#64748B', marginBottom: 2 },
  locAddress: { fontSize: 12, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  locDanger: { fontSize: 11, color: '#DC2626', fontWeight: '500' },
  errorBox: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  errorText: { flex: 1, fontSize: 12, color: '#1E293B', fontStyle: 'italic', lineHeight: 18 },
  acceptBtn: { flexDirection: 'row', backgroundColor: colors.navy, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  acceptBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  actionBtns: { flexDirection: 'row', gap: spacing.sm },
  secondaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#EFF6FF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 12, fontWeight: 'bold', color: '#1E3A8A' },

  // Standard Card
  standardCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  stdCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  priorityPill: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityPillText: { fontSize: 9, fontWeight: 'bold', color: '#92400E' },
  stdTime: { fontSize: 11, color: '#64748B', marginLeft: 8 },
  stdPrice: { fontSize: 18, fontWeight: 'bold', color: colors.navy, marginLeft: 'auto' },
  stdDriverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stdAvatar: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  stdDriverInfo: { flex: 1 },
  stdDriverName: { fontSize: 14, fontWeight: 'bold', color: colors.navy },
  stdDriverSub: { fontSize: 11, color: '#64748B' },
  stdLocBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md },
  stdLocLeft: { paddingRight: spacing.sm, justifyContent: 'center' },
  stdLocDist: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  stdLocEta: { fontSize: 10, color: '#64748B' },
  stdLocDivider: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: spacing.sm },
  stdLocRight: { flex: 1, justifyContent: 'center' },
  stdLocAddress: { fontSize: 12, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  stdLocSub: { fontSize: 11, color: '#64748B' },
  stdErrorBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.md, alignItems: 'center' },
  stdErrorText: { fontSize: 12, color: '#1E293B', flex: 1 },
  stdActionsRow: { flexDirection: 'row', gap: spacing.sm },
  stdAcceptBtn: { flex: 1, flexDirection: 'row', backgroundColor: colors.navy, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stdAcceptBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  stdCallBtn: { backgroundColor: '#EFF6FF', width: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
