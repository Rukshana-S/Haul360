import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const mockHistory = [
  {
    id: 'REP-8941',
    date: 'Yesterday 04:30 PM',
    vehicle: 'BharatBenz 2823C',
    details: 'MH 04 GP 1902 • Driver: Harpreet Sandhu',
    amount: '₹5,200',
    rating: '5.0',
    service: 'Air Brake Booster Leak & Valve Overhaul',
    type: 'Pneumatics'
  },
  {
    id: 'REP-8910',
    date: '2 days ago',
    vehicle: 'Eicher Pro 6035',
    details: 'MH 14 CC 7731 • Driver: Amit Yadav',
    amount: '₹3,150',
    rating: '4.8',
    service: 'Alternator Cable Short Circuit & Fuse Replacement',
    type: 'Electrical'
  },
  {
    id: 'REP-8874',
    date: '3 days ago',
    vehicle: 'Tata Prima 3530.K',
    details: 'MH 12 AB 4589 • Driver: Rajesh Singh',
    amount: '₹4,800',
    rating: '5.0',
    service: 'Clutch Slave Cylinder Hydraulic Bleed',
    type: 'Emergency SOS'
  }
];

export default function ServiceHistoryScreen() {
  const [filter, setFilter] = useState('All');

  const filteredHistory = filter === 'All' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === filter || (filter === 'Emergency SOS' && item.type === 'Emergency SOS'));

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.title}>Service History</Text>
          <Text style={styles.subtitle}>Settled payouts & verified job log</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.calendarBadge}>
            <Ionicons name="calendar-outline" size={13} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.calendarText}>July 2026</Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
        {['All', 'Emergency SOS', 'Pneumatics', 'Electrical'].map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
          >
            {f === 'Emergency SOS' && <View style={styles.dotRed} />}
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'All' ? 'All (128)' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
        {filteredHistory.length === 0 ? (
          <EmptyState title="No history found" message="There are no settled jobs for this filter." />
        ) : (
          filteredHistory.map(job => (
            <TouchableOpacity 
              key={job.id} 
              style={styles.card} 
              onPress={() => router.push(`/mechanic/repair-details?id=${job.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.idBadge}><Text style={styles.idText}>{job.id}</Text></View>
                <Text style={styles.dateText}>{job.date}</Text>
                <View style={styles.settledBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#1E3A8A" style={{ marginRight: 3 }} />
                  <Text style={styles.settledText}>Settled in Wallet</Text>
                </View>
              </View>
              
              <View style={styles.mainRow}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{job.vehicle}</Text>
                  <Text style={styles.vehicleSub}>{job.details}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceText}>{job.amount}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="star" size={11} color={colors.orange} style={{ marginRight: 2 }} />
                    <Text style={styles.ratingText}>{job.rating}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.serviceRow}>
                <Ionicons name="construct-outline" size={14} color={colors.navy} style={{ marginRight: 8 }} />
                <Text style={styles.serviceText}>{job.service}</Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.invoiceCard}>
          <View style={styles.invoiceIconBox}>
            <Ionicons name="document-text-outline" size={20} color={colors.navy} />
          </View>
          <View style={styles.invoiceContent}>
            <Text style={styles.invoiceTitle}>Tax & GST Invoices</Text>
            <Text style={styles.invoiceDesc}>Download Form 16A & Monthly B2B Invoices</Text>
          </View>
          <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.8}>
            <Ionicons name="download-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
            <Text style={styles.pdfBtnText}>PDF</Text>
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
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { marginRight: spacing.md, padding: 4 },
  headerTitleBox: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.navy },
  subtitle: { fontSize: 12, color: colors.textSecondary },
  headerRight: {},
  calendarBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  calendarText: { fontSize: 11, color: colors.navy, fontWeight: 'bold' },
  
  filterScroll: { maxHeight: 50, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
  filterContainer: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, gap: spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  filterText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  filterTextActive: { color: '#FFFFFF' },
  dotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DC2626', marginRight: 6 },
  
  content: { flex: 1 },
  contentPad: { padding: spacing.md, paddingBottom: spacing.xxl },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  idBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  idText: { fontSize: 10, fontWeight: 'bold', color: '#1E3A8A' },
  dateText: { fontSize: 11, color: '#64748B', flex: 1 },
  settledBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  settledText: { fontSize: 10, fontWeight: 'bold', color: '#1E3A8A' },
  
  mainRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  vehicleInfo: { flex: 1, paddingRight: spacing.sm },
  vehicleName: { fontSize: 15, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  vehicleSub: { fontSize: 11, color: '#64748B' },
  priceInfo: { alignItems: 'flex-end' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: colors.navy },
  ratingText: { fontSize: 11, fontWeight: 'bold', color: '#B45309' },
  
  serviceRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: spacing.sm, borderRadius: 8 },
  serviceText: { flex: 1, fontSize: 12, color: colors.navy },
  
  invoiceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: spacing.md, borderRadius: 16, marginTop: spacing.sm },
  invoiceIconBox: { backgroundColor: '#DBEAFE', width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  invoiceContent: { flex: 1 },
  invoiceTitle: { fontSize: 14, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  invoiceDesc: { fontSize: 11, color: '#64748B' },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  pdfBtnText: { fontSize: 12, fontWeight: 'bold', color: colors.navy }
});
