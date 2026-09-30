import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { mockRepairs } from '@/constants/mechanicMockData';
import { ErrorState } from '@/components/ui/ErrorState';

const STATES = ['Received', 'Diagnosing', 'Repairing', 'Ready', 'Completed'];

export default function RepairDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repair = mockRepairs.find(r => r.id === id) || mockRepairs[0];
  
  const [currentStepIndex, setCurrentStepIndex] = useState(1);

  if (!repair) return <ErrorState />;

  const handleNext = () => {
    if (currentStepIndex < STATES.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
    }
  };

  const isCompleted = currentStepIndex === STATES.length - 1;

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Repair Ticket #{repair.id}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.md, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Vehicle</Text>
          <Text style={styles.infoValue}>{repair.vehicle}</Text>
          <Text style={styles.infoLabel}>Customer / Driver</Text>
          <Text style={styles.infoValue}>{repair.driver}</Text>
          <Text style={styles.infoLabel}>Service</Text>
          <Text style={styles.infoValue}>{repair.service}</Text>
          <Text style={styles.infoLabel}>Estimated Amount</Text>
          <Text style={styles.infoValue}>{repair.amount}</Text>
        </View>

        <Text style={styles.sectionTitle}>Repair Progress Tracker</Text>

        <View style={styles.trackerCard}>
          {STATES.map((state, index) => {
            const isActive = index === currentStepIndex;
            const isDone = index < currentStepIndex;
            
            return (
              <View key={state} style={styles.stepRow}>
                <View style={[styles.dot, isDone && styles.dotDone, isActive && styles.dotActive]}>
                  {isDone && <Ionicons name="checkmark" size={12} color={colors.white} />}
                  {isActive && <View style={styles.innerDot} />}
                </View>
                <Text style={[styles.stepText, isActive && styles.stepTextActive, isDone && styles.stepTextDone]}>
                  {state}
                </Text>
              </View>
            );
          })}
        </View>

        {!isCompleted ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>
              {currentStepIndex === STATES.length - 2 ? 'Mark as Completed' : 'Update Status'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBox}>
            <Ionicons name="checkmark-circle" size={24} color="#166534" style={{ marginRight: 8 }} />
            <Text style={styles.completedText}>Repair Completed</Text>
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
  
  infoCard: { backgroundColor: '#FFFFFF', padding: spacing.lg, borderRadius: 12, marginBottom: spacing.lg, borderWidth: 1, borderColor: '#F1F5F9' },
  infoLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.md },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.md },
  
  trackerCard: { backgroundColor: '#FFFFFF', padding: spacing.xl, borderRadius: 12, marginBottom: spacing.xl, borderWidth: 1, borderColor: '#F1F5F9' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E2E8F0', marginRight: spacing.md, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: colors.orange },
  innerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange },
  dotDone: { backgroundColor: colors.green },
  stepText: { fontSize: 14, color: '#64748B' },
  stepTextActive: { fontWeight: 'bold', color: colors.navy, fontSize: 15 },
  stepTextDone: { color: colors.navy, fontWeight: '500' },
  
  primaryBtn: { backgroundColor: colors.navy, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  
  completedBox: { backgroundColor: '#DCFCE7', padding: spacing.lg, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  completedText: { color: '#166534', fontSize: 16, fontWeight: 'bold' },
});
