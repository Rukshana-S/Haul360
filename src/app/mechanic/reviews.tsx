import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReviewCard } from '@/components/mechanic/ReviewCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useMechanic } from '@/context/MechanicContext';

export default function ReviewsScreen() {
  const { reviews, profile } = useMechanic();

  const totalReviewsCount = profile.totalReviews || 124;
  const ratingValue = profile.rating || 4.9;

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.title}>Customer Reviews</Text>
          <Text style={styles.subtitle}>Verified driver and fleet ratings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rating Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View style={styles.bigScoreBox}>
              <Text style={styles.overallRating}>{ratingValue.toFixed(1)}</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={16} color={colors.orange} />
                ))}
              </View>
              <Text style={styles.reviewCount}>Based on {totalReviewsCount} ratings</Text>
            </View>

            <View style={styles.distribution}>
              {([
                { stars: 5, pct: '88%', label: '5★' },
                { stars: 4, pct: '10%', label: '4★' },
                { stars: 3, pct: '2%', label: '3★' },
                { stars: 2, pct: '2%', label: '2★' },
                { stars: 1, pct: '0%', label: '1★' },
              ] as const).map((row) => (
                <View key={row.stars} style={styles.distRow}>
                  <Text style={styles.distLabel}>{row.label}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: row.pct }]} />
                  </View>
                  <Text style={styles.distPct}>{row.pct}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.badgeFooter}>
            <View style={styles.footerPill}>
              <Ionicons name="shield-checkmark" size={13} color={colors.green} style={{ marginRight: 4 }} />
              <Text style={styles.footerPillText}>100% Verified Haul360 Jobs</Text>
            </View>
            <View style={styles.footerPill}>
              <Ionicons name="ribbon" size={13} color={colors.blue} style={{ marginRight: 4 }} />
              <Text style={styles.footerPillText}>Top 5% Highway Corridor SLA</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Driver Feedback</Text>
          <Text style={styles.sectionSubtitle}>Showing latest {reviews.length} reviews</Text>
        </View>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            message="When drivers or fleets rate your completed repairs, feedback will be shown here."
            iconName="star-outline"
          />
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: spacing.md,
    padding: 4,
  },
  headerTitleBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  overviewCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  overviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bigScoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    width: 120,
  },
  overallRating: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.navy,
    lineHeight: 44,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  reviewCount: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },

  distribution: {
    flex: 1,
    paddingLeft: spacing.md,
    gap: 4,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distLabel: {
    fontSize: 10,
    color: '#64748B',
    width: 20,
    fontWeight: '600',
  },
  barBg: {
    flex: 1,
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.orange,
    borderRadius: 4,
  },
  distPct: {
    fontSize: 10,
    color: '#64748B',
    width: 28,
    textAlign: 'right',
  },

  badgeFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.navy,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
});
