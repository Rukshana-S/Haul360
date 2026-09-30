import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { mockRequests } from '@/constants/mechanicMockData';
import { ErrorState } from '@/components/ui/ErrorState';

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [status, setStatus] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING');

  const req = mockRequests.find(r => r.id === id) || mockRequests[0];

  if (!req) return <ErrorState />;

  const handleAccept = () => setStatus('ACCEPTED');
  const handleReject = () => setStatus('REJECTED');

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Request Details</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.md, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        {req.isEmergency && (
          <View style={styles.sosBanner}>
            <Text style={styles.sosProtocol}>IMMEDIATE RESPONSE PROTOCOL</Text>
            <View style={styles.sosTitleRow}>
              <View style={styles.dotOrange} />
              <Text style={styles.sosTitle}>EMERGENCY SOS #{req.id}</Text>
              <View style={styles.liveBadge}>
                <Ionicons name="flash" size={12} color="#B91C1C" style={{ marginRight: 3 }} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapTopRow}>
              <View style={styles.distBadge}>
                <Ionicons name="navigate" size={13} color={colors.navy} style={{ marginRight: 4 }} />
                <Text style={styles.distText}>Distance & ETA: <Text style={{fontWeight: 'bold', color: '#000'}}>{req.distance}</Text></Text>
              </View>
            </View>
            <View style={styles.mapCenterMarker}>
              <View style={styles.markerCircle}>
                <Ionicons name="warning" size={22} color="#DC2626" />
              </View>
            </View>
          </View>
          <View style={styles.mapInfo}>
            <View style={styles.mapInfoTop}>
              <Ionicons name="location-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.mapAddress}>{req.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.avatarBox}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#64748B" />
              </View>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{req.driver}</Text>
              <Text style={styles.driverStats}>Contact: {req.driver.split(' ')[0].toLowerCase()}@haul360.com</Text>
            </View>
          </View>

          <View style={styles.truckDetailsRow}>
            <View style={styles.truckBox}>
              <Text style={styles.preAuthLabel}>VEHICLE DETAILS</Text>
              <Text style={styles.truckModel}>{req.vehicle}</Text>
              <Text style={styles.truckPlate}>{req.vehicleType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.faultDescBox}>
          <Text style={styles.sectionTitle}>Service Required</Text>
          <Text style={styles.faultDescText}>{req.service}</Text>
        </View>

        <View style={styles.faultDescBox}>
          <Text style={styles.sectionTitle}>Timing</Text>
          <Text style={styles.faultDescText}>Requested: {req.timeRequested}</Text>
        </View>

        <View style={styles.tariffCard}>
          <View style={styles.tariffHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="wallet-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.tariffTitle}>Estimated Payment</Text>
            </View>
          </View>
          <View style={styles.tariffTotalBox}>
            <Text style={styles.totalAmount}>{req.amount}</Text>
          </View>
        </View>

        {status === 'PENDING' ? (
          <View style={styles.actionRow2}>
            <TouchableOpacity style={styles.actionBtnReject} onPress={handleReject} activeOpacity={0.8}>
              <Ionicons name="close-circle-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnRejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleAccept} activeOpacity={0.8}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnPrimaryText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusBox}>
            <Ionicons 
              name={status === 'ACCEPTED' ? 'checkmark-circle' : 'close-circle'} 
              size={24} 
              color={status === 'ACCEPTED' ? colors.green : colors.error} 
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.statusBoxText}>Status: {status}</Text>
          </View>
        )}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { marginRight: spacing.md, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.navy },
  content: { flex: 1 },
  
  sosBanner: { backgroundColor: '#111827', borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  sosProtocol: { color: '#FDBA74', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  sosTitleRow: { flexDirection: 'row', alignItems: 'center' },
  dotOrange: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginRight: 8 },
  sosTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', flex: 1 },
  liveBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  liveBadgeText: { color: '#B91C1C', fontSize: 10, fontWeight: 'bold' },
  
  mapCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0' },
  mapPlaceholder: { height: 150, backgroundColor: '#DBEAFE', padding: spacing.sm },
  mapTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  distBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  distText: { fontSize: 11, color: '#475569' },
  mapCenterMarker: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  markerCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(220, 38, 38, 0.2)', alignItems: 'center', justifyContent: 'center' },
  mapInfo: { padding: spacing.md },
  mapInfoTop: { flexDirection: 'row', alignItems: 'center' },
  mapAddress: { fontSize: 14, fontWeight: 'bold', color: colors.navy, flex: 1 },
  
  driverCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0' },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatarBox: { position: 'relative', marginRight: spacing.sm },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  driverStats: { fontSize: 11, color: '#64748B' },
  
  truckDetailsRow: { flexDirection: 'row', gap: spacing.sm },
  truckBox: { flex: 1, backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8 },
  preAuthLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748B', marginBottom: 4 },
  truckModel: { fontSize: 13, fontWeight: 'bold', color: colors.navy },
  truckPlate: { fontSize: 11, color: '#64748B' },
  
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.navy, marginBottom: 6 },
  faultDescBox: { backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9' },
  faultDescText: { fontSize: 13, color: colors.navy, lineHeight: 20 },
  
  tariffCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.xl, borderWidth: 1, borderColor: '#E2E8F0' },
  tariffHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  tariffTitle: { fontSize: 15, fontWeight: 'bold', color: colors.navy },
  tariffTotalBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: spacing.md, borderRadius: 12 },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: colors.navy },
  
  actionRow2: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  actionBtnReject: { flex: 1, flexDirection: 'row', backgroundColor: '#FEF2F2', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FECACA' },
  actionBtnRejectText: { fontSize: 13, fontWeight: 'bold', color: '#DC2626' },
  actionBtnPrimary: { flex: 2, flexDirection: 'row', backgroundColor: colors.navy, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionBtnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  
  statusBox: { backgroundColor: '#F1F5F9', padding: spacing.lg, borderRadius: 12, alignItems: 'center', marginBottom: spacing.xl },
  statusBoxText: { fontSize: 15, fontWeight: 'bold', color: colors.navy },
});
