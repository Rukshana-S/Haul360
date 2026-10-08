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
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

export default function DriverRatingsScreen() {
  const { profile, reviews } = useDriver();

  const ratingBars = [
    { stars: 5, percent: 84 },
    { stars: 4, percent: 12 },
    { stars: 3, percent: 4 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Driver Ratings & Reviews</Text>
          <Text style={styles.headerSubtitle}>Verified Shipper Feedback & Safety Metrics</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rating Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroRatingVal}>{profile.rating}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={16} color={colors.orange} />
              ))}
            </View>
            <Text style={styles.heroRatingCount}>Based on {profile.totalReviews} verified hauls</Text>
          </View>

          <View style={styles.heroRight}>
            {ratingBars.map((bar) => (
              <View key={bar.stars} style={styles.barRow}>
                <Text style={styles.barStarNum}>{bar.stars}★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${bar.percent}%` }]} />
                </View>
                <Text style={styles.barPercent}>{bar.percent}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Key Reliability Metrics</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>98.4%</Text>
              <Text style={styles.metricLabel}>On-Time Delivery</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={[styles.metricVal, { color: colors.green }]}>100%</Text>
              <Text style={styles.metricLabel}>Cargo Damage Free</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>142</Text>
              <Text style={styles.metricLabel}>Completed Trips</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>4.9★</Text>
              <Text style={styles.metricLabel}>Communication</Text>
            </View>
          </View>
        </View>

        {/* Shipper Reviews */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Shipper Reviews ({reviews.length})</Text>

          {reviews.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewerName}>{rev.shipperName}</Text>
                  <Text style={styles.reviewerCompany}>{rev.company}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={13} color={colors.orange} />
                  ))}
                </View>
              </View>

              <Text style={styles.reviewComment}>"{rev.comment}"</Text>

              <View style={styles.reviewFooter}>
                <Text style={styles.reviewRoute}>Route: {rev.route}</Text>
                <Text style={styles.reviewDate}>{rev.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  heroLeft: {
    alignItems: 'center',
    width: 110,
  },
  heroRatingVal: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.navy,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  heroRatingCount: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  heroRight: {
    flex: 1,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barStarNum: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.orange,
    borderRadius: 3,
  },
  barPercent: {
    fontSize: 10,
    color: colors.textSecondary,
    width: 28,
    textAlign: 'right',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metricBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.navy,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  reviewerCompany: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: colors.slate,
    lineHeight: 18,
    marginVertical: 4,
    fontStyle: 'italic',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 4,
    marginTop: 4,
  },
  reviewRoute: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  reviewDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
