import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { mechanicProfile } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';

import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [sosMode, setSosMode] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/auth/login?role=Mechanic' as any);
  };

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

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.md, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarBox}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#64748B" />
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.orange} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.tagsRow}>
                <View style={styles.goldBadge}>
                  <Ionicons name="shield-checkmark" size={11} color={colors.orange} style={{ marginRight: 3 }} />
                  <Text style={styles.goldBadgeText}>Gold Partner</Text>
                </View>
                <Text style={styles.expText}>• 12+ Yrs Fleet Exp</Text>
              </View>
              <Text style={styles.name}>{mechanicProfile.name}</Text>
              <Text style={styles.subtext}>Haul360 Highway Rescue & Fleet Care</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={colors.orange} style={{ marginRight: 3 }} />
                <Text style={styles.ratingText}>{mechanicProfile.rating} <Text style={styles.reviewCount}>(248)</Text></Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Jobs Solved</Text>
              <Text style={styles.statValue}>1,420+</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Avg ETA</Text>
              <Text style={styles.statValue}>18 min</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Resolution</Text>
              <Text style={styles.statValue}>98.4%</Text>
            </View>
          </View>
        </View>

        {/* SOS Patrol Mode */}
        <View style={styles.patrolCard}>
          <View style={styles.patrolIconBox}>
            <Ionicons name="navigate-circle-outline" size={24} color={colors.blue} />
          </View>
          <View style={styles.patrolInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.patrolTitle}>24/7 SOS Patrol Mode</Text>
              <View style={styles.dotGreen} />
            </View>
            <Text style={styles.patrolSub}>Accepting urgent roadside dispatches</Text>
          </View>
          <Switch 
            value={sosMode} 
            onValueChange={setSosMode}
            trackColor={{ false: '#CBD5E1', true: colors.navy }}
            thumbColor={colors.white}
          />
        </View>

        {/* Workshop & Mobile Hub */}
        <View style={styles.workshopCard}>
          <View style={styles.workshopHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="business-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.workshopTitle}>Workshop & Mobile Hub</Text>
            </View>
            <Text style={styles.hqBadge}>HQ & PATROL</Text>
          </View>
          <View style={styles.imagePlaceholder}>
            <View style={styles.imageOverlay}>
              <Ionicons name="location" size={13} color={colors.orange} style={{ marginRight: 4 }} />
              <Text style={styles.imageText}>NH-48 & KMP Expressway Junction</Text>
            </View>
          </View>
          <View style={styles.locItem}>
            <Ionicons name="location-outline" size={18} color={colors.navy} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={styles.locContent}>
              <Text style={styles.locTitle}>Primary Workshop Terminal</Text>
              <Text style={styles.locDesc}>Shop 14, Haul360 Commercial Fleet Plaza, NH-48 Sector 34, Gurugram Corridor</Text>
            </View>
          </View>
          <View style={styles.locItem}>
            <Ionicons name="radio-outline" size={18} color={colors.navy} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={styles.locContent}>
              <View style={styles.locRow}>
                <Text style={styles.locTitle}>Highway Coverage Radius</Text>
                <Text style={styles.locLabel}>35 km Patrol Ring</Text>
              </View>
              <Text style={styles.locDesc}>Mobile Van equipped with pneumatic impact wrenches, hydraulic trolley jacks, DC welding kit & BS-VI scanners.</Text>
            </View>
          </View>
        </View>

        {/* Verified Credentials */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Verified Credentials</Text>
          </View>
          
          <View style={styles.credItem}>
            <View style={styles.credIconBox}>
              <Ionicons name="id-card-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.credContent}>
              <Text style={styles.credTitle}>Aadhaar (UIDAI) <Text style={styles.credMask}>XXXX-XXXX-1029</Text></Text>
              <Text style={styles.credSub}>DigiLocker Government Verified</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          </View>
          
          <View style={styles.credItem}>
            <View style={styles.credIconBox}>
              <Ionicons name="card-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.credContent}>
              <Text style={styles.credTitle}>PAN Card <Text style={styles.credMask}>ABCDE1234F</Text></Text>
              <Text style={styles.credSub}>Direct GST Payout Settlements</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          </View>
        </View>

        {/* Specializations */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="construct-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Specializations</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/mechanic/edit-profile')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.editBtn}>Edit</Text>
                <Ionicons name="pencil" size={12} color={colors.blue} style={{ marginLeft: 2 }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.specTags}>
            <View style={styles.specTag}>
              <Ionicons name="car-sport-outline" size={12} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.specTagText}>16-22 Wheeler Multi-Axle</Text>
            </View>
            <View style={styles.specTag}>
              <Ionicons name="construct-outline" size={12} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.specTagText}>Pneumatics & Air Brakes</Text>
            </View>
            <View style={styles.specTag}>
              <Ionicons name="hardware-chip-outline" size={12} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.specTagText}>Cummins & BS-VI DEF Diagnostics</Text>
            </View>
            <View style={styles.specTag}>
              <Ionicons name="build-outline" size={12} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.specTagText}>Leaf Springs & Suspension</Text>
            </View>
            <View style={styles.specTag}>
              <Ionicons name="flash-outline" size={12} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.specTagText}>Heavy Electricals & Alternators</Text>
            </View>
            <View style={styles.specTag}>
              <Ionicons name="disc-outline" size={12} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.specTagText}>Tyre Vulcanizing & 50T Jacks</Text>
            </View>
          </View>
        </View>

        {/* Payout Account */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Ionicons name="wallet-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Payout Account</Text>
          </View>
          <View style={styles.payoutBox}>
            <View style={styles.payoutIconBox}>
              <Ionicons name="business-outline" size={20} color={colors.navy} />
            </View>
            <View style={styles.payoutContent}>
              <Text style={styles.payoutTitle}>HDFC Bank Current A/c</Text>
              <Text style={styles.payoutSub}>•••• •••• •••• 4029</Text>
            </View>
            <View style={styles.defaultBadge}><Text style={styles.defaultText}>Default</Text></View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </View>
        </View>

        {/* Preferences & Protocol */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences & Protocol</Text>
          
          <TouchableOpacity style={styles.prefRow} onPress={() => router.push('/mechanic/settings')} activeOpacity={0.8}>
            <View style={styles.prefIconBox}>
              <Ionicons name="language-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.prefContent}>
              <Text style={styles.prefTitle}>App Interface Language</Text>
              <Text style={styles.prefSub}>Hindi, Punjabi, Marathi supported</Text>
            </View>
            <View style={styles.prefBadge}>
              <Text style={styles.prefBadgeText}>English (EN)</Text>
              <Ionicons name="chevron-down" size={12} color={colors.navy} style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.prefRow} onPress={() => router.push('/mechanic/settings')} activeOpacity={0.8}>
            <View style={styles.prefIconBox}>
              <Ionicons name="volume-high-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.prefContent}>
              <Text style={styles.prefTitle}>Emergency SOS Tone</Text>
              <Text style={styles.prefSub}>Loud Siren & Continuous Vibration</Text>
            </View>
            <Text style={styles.prefStatus}>ACTIVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.prefRow} activeOpacity={0.8}>
            <View style={styles.prefIconBox}>
              <Ionicons name="headset-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.prefContent}>
              <Text style={styles.prefTitle}>Haul360 24/7 Mechanic Desk</Text>
              <Text style={styles.prefSub}>Priority Highway Dispatch Support</Text>
            </View>
            <View style={styles.blackBadge}><Text style={styles.blackBadgeText}>Call Hub</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.prefRow} activeOpacity={0.8}>
            <View style={styles.prefIconBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.navy} />
            </View>
            <View style={styles.prefContent}>
              <Text style={styles.prefTitle}>Roadside Safety Standards</Text>
              <Text style={styles.prefSub}>Cones, Reflective Gear & ISO Steps</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutModalVisible(true)} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Log Out from Terminal</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Haul360 Mechanic Terminal v2.14.0 (Build 9042){'\n'}Corridor Node: NH-48 Sector 34 Gateway • Encrypted Session</Text>
        
      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log out of Haul360?</Text>
            <Text style={styles.modalDesc}>You'll need to sign in again to access your mechanic workspace.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setLogoutModalVisible(false)} activeOpacity={0.8}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnLogout} onPress={confirmLogout} activeOpacity={0.8}>
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
  
  profileCard: { backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 16, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9' },
  profileTopRow: { flexDirection: 'row', marginBottom: spacing.md },
  avatarBox: { position: 'relative', marginRight: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 1 },
  profileInfo: { flex: 1 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  goldBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12, marginRight: 6 },
  goldBadgeText: { color: '#FDBA74', fontSize: 10, fontWeight: 'bold' },
  expText: { color: '#64748B', fontSize: 11 },
  name: { fontSize: 17, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  subtext: { fontSize: 11, color: '#64748B', marginBottom: 6 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  ratingText: { fontSize: 11, fontWeight: 'bold', color: '#92400E' },
  reviewCount: { color: '#B45309', fontWeight: 'normal' },
  
  statsRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 10, padding: spacing.sm },
  statCol: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#64748B', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: 'bold', color: colors.navy },
  
  patrolCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 16, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9' },
  patrolIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  patrolInfo: { flex: 1 },
  patrolTitle: { fontSize: 14, fontWeight: 'bold', color: colors.navy, marginRight: 6 },
  dotGreen: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, marginLeft: 6 },
  patrolSub: { fontSize: 11, color: '#64748B' },
  
  workshopCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9' },
  workshopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  workshopTitle: { fontSize: 14, fontWeight: 'bold', color: colors.navy },
  hqBadge: { backgroundColor: '#DBEAFE', color: '#1E3A8A', fontSize: 9, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  imagePlaceholder: { height: 90, backgroundColor: '#EEF2FF', borderRadius: 10, marginBottom: spacing.md, justifyContent: 'flex-end', padding: spacing.sm, borderWidth: 1, borderColor: '#E0E7FF' },
  imageOverlay: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  imageText: { fontSize: 11, fontWeight: 'bold', color: colors.navy },
  locItem: { flexDirection: 'row', marginBottom: spacing.sm },
  locContent: { flex: 1 },
  locTitle: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  locDesc: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  locRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  locLabel: { fontSize: 11, color: colors.blue, fontWeight: 'bold' },
  
  sectionCard: { backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 16, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.navy },
  editBtn: { fontSize: 12, color: colors.blue, fontWeight: 'bold' },
  
  credItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.xs },
  credIconBox: { width: 32, height: 32, backgroundColor: '#EFF6FF', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  credContent: { flex: 1 },
  credTitle: { fontSize: 12, fontWeight: 'bold', color: colors.navy },
  credMask: { color: '#64748B', fontWeight: 'normal' },
  credSub: { fontSize: 10, color: '#64748B' },
  
  specTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  specTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  specTagText: { fontSize: 11, color: colors.navy, fontWeight: '500' },
  
  payoutBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8 },
  payoutIconBox: { width: 36, height: 36, backgroundColor: '#DBEAFE', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  payoutContent: { flex: 1 },
  payoutTitle: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  payoutSub: { fontSize: 11, color: '#64748B' },
  defaultBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: spacing.sm },
  defaultText: { fontSize: 9, color: '#166534', fontWeight: 'bold' },
  
  prefRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  prefIconBox: { width: 32, height: 32, backgroundColor: '#F1F5F9', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  prefContent: { flex: 1 },
  prefTitle: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  prefSub: { fontSize: 10, color: '#64748B' },
  prefBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  prefBadgeText: { fontSize: 11, fontWeight: 'bold', color: colors.navy },
  prefStatus: { fontSize: 11, fontWeight: 'bold', color: colors.green },
  blackBadge: { backgroundColor: colors.navy, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  blackBadgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' },
  
  logoutBtn: { flexDirection: 'row', backgroundColor: '#FEF2F2', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: '#FECACA' },
  logoutBtnText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' },
  versionText: { fontSize: 10, color: '#94A3B8', textAlign: 'center', lineHeight: 14, marginBottom: spacing.xl },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.xl, width: '100%', maxWidth: 320, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.xs },
  modalDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: spacing.xl, lineHeight: 18 },
  modalActions: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  modalBtnCancel: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnCancelText: { color: colors.navy, fontWeight: 'bold', fontSize: 14 },
  modalBtnLogout: { flex: 1, backgroundColor: '#DC2626', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnLogoutText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});
