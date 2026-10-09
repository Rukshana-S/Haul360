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
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeRewardsScreen() {
  const { rewards } = useTransportOffice();

  const progressPercent = Math.min(
    100,
    Math.max(0, ((rewards.points - 1000) / (2000 - 1000)) * 100)
  );

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'SHIPMENT':
        return { name: 'cube' as const, color: colors.blue, bg: '#EFF6FF' };
      case 'ON_TIME':
        return { name: 'timer' as const, color: colors.green, bg: '#DCFCE7' };
      case 'MILESTONE':
        return { name: 'trophy' as const, color: '#D97706', bg: '#FEF3C7' };
      case 'RETURN_LOAD':
        return { name: 'repeat' as const, color: '#9333EA', bg: '#F3E8FF' };
      case 'PERFORMANCE':
        return { name: 'ribbon' as const, color: colors.navy, bg: '#EEF2FF' };
      default:
        return { name: 'star' as const, color: colors.orange, bg: '#FEF3C7' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/transport-office' as any);
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fleet Rewards & Tiers</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO REWARDS CARD */}
        <View style={styles.heroRewardsCard}>
          <View style={styles.heroHeaderRow}>
            <View>
              <Text style={styles.heroLabel}>Total Reward Points</Text>
              <Text style={styles.heroPoints}>
                {rewards.points.toLocaleString('en-IN')} <Text style={styles.ptsUnit}>PTS</Text>
              </Text>
            </View>
            <View style={styles.tierBadgeBox}>
              <Ionicons name="medal" size={22} color="#F59E0B" />
              <Text style={styles.tierBadgeText}>{rewards.currentLevel} Tier</Text>
            </View>
          </View>

          {/* PROGRESS TO NEXT TIER */}
          <View style={styles.progressBox}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelLeft}>
                {rewards.currentLevel} ({rewards.points} pts)
              </Text>
              <Text style={styles.progressLabelRight}>
                {rewards.nextLevel} (2,000 pts)
              </Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>

            <Text style={styles.nextTierNotice}>
              {rewards.pointsToNextTier} more points to reach Platinum Tier benefits
            </Text>
          </View>
        </View>

        {/* TIER BENEFIT TIERS LEVEL PROGRESSION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reward Tiers & Levels</Text>
          <Text style={styles.sectionSubtitle}>Earn points on every completed shipment & on-time delivery</Text>

          <View style={styles.tierList}>
            <View style={styles.tierItem}>
              <View style={[styles.tierIconCircle, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="shield-outline" size={18} color="#64748B" />
              </View>
              <View style={styles.tierInfo}>
                <Text style={styles.tierName}>Bronze Tier</Text>
                <Text style={styles.tierRange}>0 – 499 Points</Text>
              </View>
              <Text style={styles.tierStatusCompleted}>Unlocked</Text>
            </View>

            <View style={styles.tierItem}>
              <View style={[styles.tierIconCircle, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="shield" size={18} color="#94A3B8" />
              </View>
              <View style={styles.tierInfo}>
                <Text style={styles.tierName}>Silver Tier</Text>
                <Text style={styles.tierRange}>500 – 999 Points</Text>
              </View>
              <Text style={styles.tierStatusCompleted}>Unlocked</Text>
            </View>

            <View style={[styles.tierItem, styles.tierItemActive]}>
              <View style={[styles.tierIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="medal" size={18} color="#D97706" />
              </View>
              <View style={styles.tierInfo}>
                <Text style={[styles.tierName, { color: '#B45309' }]}>Gold Tier</Text>
                <Text style={styles.tierRange}>1,000 – 1,999 Points</Text>
              </View>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT</Text>
              </View>
            </View>

            <View style={[styles.tierItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.tierIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="trophy" size={18} color={colors.blue} />
              </View>
              <View style={styles.tierInfo}>
                <Text style={styles.tierName}>Platinum Tier</Text>
                <Text style={styles.tierRange}>2,000+ Points • Priority Dispatch</Text>
              </View>
              <Text style={styles.tierStatusLocked}>Locked (750 pts to go)</Text>
            </View>
          </View>
        </View>

        {/* HOW TO EARN POINTS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          <Text style={styles.sectionSubtitle}>Fleet milestones and performance rewards</Text>

          <View style={styles.earnGrid}>
            <View style={styles.earnItem}>
              <Text style={styles.earnPoints}>+100 pts</Text>
              <Text style={styles.earnTitle}>Completed Shipment</Text>
              <Text style={styles.earnDesc}>On successful verified delivery</Text>
            </View>
            <View style={styles.earnItem}>
              <Text style={styles.earnPoints}>+50 pts</Text>
              <Text style={styles.earnTitle}>On-Time Delivery</Text>
              <Text style={styles.earnDesc}>Delivery within scheduled window</Text>
            </View>
            <View style={styles.earnItem}>
              <Text style={styles.earnPoints}>+75 pts</Text>
              <Text style={styles.earnTitle}>Return Haul</Text>
              <Text style={styles.earnDesc}>Assigned back-haul shipment</Text>
            </View>
            <View style={styles.earnItem}>
              <Text style={styles.earnPoints}>+250 pts</Text>
              <Text style={styles.earnTitle}>10 Trips Milestone</Text>
              <Text style={styles.earnDesc}>Fleet reliability milestone bonus</Text>
            </View>
          </View>
        </View>

        {/* REWARD POINTS HISTORY */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionTitle}>Reward Points History</Text>
          <Text style={styles.historyCountBadge}>{rewards.history.length} Activities</Text>
        </View>

        {rewards.history.map((item) => {
          const icon = getRewardIcon(item.type);

          return (
            <View key={item.id} style={styles.historyCard}>
              <View style={[styles.historyIconCircle, { backgroundColor: icon.bg }]}>
                <Ionicons name={icon.name} size={18} color={icon.color} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <View style={styles.pointsPill}>
                <Text style={styles.pointsPillText}>+{item.points} pts</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  heroRewardsCard: {
    backgroundColor: '#0F172A',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroPoints: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  ptsUnit: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  tierBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  progressBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelLeft: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressLabelRight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  nextTierNotice: {
    fontSize: 10,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  tierList: {
    gap: spacing.xs,
  },
  tierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tierItemActive: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 0,
  },
  tierIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  tierRange: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  tierStatusCompleted: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.green,
  },
  currentBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  tierStatusLocked: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  earnItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  earnPoints: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.blue,
  },
  earnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
    marginTop: 2,
  },
  earnDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  historyCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.sm,
  },
  historyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  historyDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pointsPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
});
