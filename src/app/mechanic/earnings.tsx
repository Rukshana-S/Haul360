import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockEarnings } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function EarningsScreen() {
  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings & Payouts</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.lg, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Earned (This Month)</Text>
          <Text style={styles.balanceAmount}>₹18,500</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceStat}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Ionicons name="time-outline" size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <Text style={styles.statValue}>₹2,400</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.balanceStat}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Ionicons name="checkmark-circle-outline" size={12} color="#86EFAC" style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <Text style={styles.statValue}>₹16,100</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {mockEarnings.length === 0 ? (
          <EmptyState title="No transactions yet" message="Completed repairs and payouts will appear here." iconName="wallet-outline" />
        ) : (
          mockEarnings.map((earning) => (
            <View key={earning.id} style={styles.transactionCard}>
              <View style={styles.txIconBox}>
                <Ionicons name="wallet-outline" size={20} color={colors.navy} />
              </View>
              <View style={styles.txLeft}>
                <Text style={styles.txService}>{earning.service}</Text>
                <Text style={styles.txDate}>{earning.date} • {earning.status}</Text>
              </View>
              <Text style={styles.txAmount}>+{earning.amount}</Text>
            </View>
          ))
        )}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.navy },
  content: { flex: 1 },
  balanceCard: { backgroundColor: colors.navy, borderRadius: 16, padding: spacing.xl, marginBottom: spacing.xl },
  balanceLabel: { color: '#CBD5E1', fontSize: 13, marginBottom: 8 },
  balanceAmount: { color: colors.white, fontSize: 36, fontWeight: 'bold', marginBottom: spacing.xl },
  balanceFooter: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: spacing.md },
  balanceStat: { flex: 1 },
  statLabel: { color: '#94A3B8', fontSize: 11 },
  statValue: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  dividerVertical: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.md },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm, borderWidth: 1, borderColor: '#E2E8F0' },
  txIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  txLeft: { flex: 1 },
  txService: { fontSize: 14, fontWeight: 'bold', color: colors.navy, marginBottom: 2 },
  txDate: { fontSize: 11, color: colors.textSecondary },
  txAmount: { fontSize: 16, fontWeight: 'bold', color: colors.green },
});
