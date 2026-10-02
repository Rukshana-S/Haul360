import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReviewCard } from '@/components/mechanic/ReviewCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const mockDetailedReviews = [
  {
    id: '1',
    customer: 'ABC Logistics',
    rating: 5,
    service: 'Engine Repair',
    date: '24 Sep 2026',
    comment: 'Quick diagnosis and excellent service.'
  },
  {
    id: '2',
    customer: 'Gurmeet Singh',
    rating: 4,
    service: 'Pneumatic Hose Rupture',
    date: '23 Sep 2026',
    comment: 'Very professional. Solved the airbrake issue safely on the highway.'
  }
];

export default function ReviewsScreen() {
  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Customer Reviews</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.md, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        <View style={styles.overviewCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={styles.overallRating}>4.8</Text>
            <Ionicons name="star" size={28} color={colors.orange} style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.reviewCount}>Based on 124 verified reviews</Text>
          
          <View style={styles.distribution}>
            {[5, 4, 3, 2, 1].map(stars => (
              <View key={stars} style={styles.distRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 40 }}>
                  <Text style={styles.distStars}>{stars}</Text>
                  <Ionicons name="star" size={11} color={colors.orange} style={{ marginLeft: 2 }} />
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: stars === 5 ? '80%' : stars === 4 ? '15%' : '2%' }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Reviews</Text>

        {mockDetailedReviews.length === 0 ? (
          <EmptyState title="No reviews yet" message="When customers leave reviews, they will appear here." iconName="star-outline" />
        ) : (
          mockDetailedReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
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
    borderBottomColor: '#E2E8F0' 
  },
  backBtn: { marginRight: spacing.md, padding: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.navy },
  content: { flex: 1 },
  
  overviewCard: { backgroundColor: '#FFFFFF', padding: spacing.xl, borderRadius: 16, alignItems: 'center', marginBottom: spacing.xl, borderWidth: 1, borderColor: '#F1F5F9' },
  overallRating: { fontSize: 44, fontWeight: 'bold', color: colors.navy },
  reviewCount: { fontSize: 13, color: '#64748B', marginBottom: spacing.lg },
  distribution: { width: '100%', gap: 6 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distStars: { fontSize: 12, color: '#64748B', fontWeight: 'bold' },
  barBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.orange, borderRadius: 4 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.md },
  
  reviewCard: { backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  customerName: { fontSize: 15, fontWeight: 'bold', color: colors.navy },
  starsRow: { flexDirection: 'row', gap: 2 },
  serviceTag: { fontSize: 11, color: '#64748B', marginBottom: spacing.sm },
  comment: { fontSize: 13, color: colors.navy, fontStyle: 'italic', marginBottom: spacing.sm, lineHeight: 18 },
  date: { fontSize: 11, color: '#94A3B8', textAlign: 'right' }
});
