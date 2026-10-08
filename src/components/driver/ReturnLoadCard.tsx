import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReturnLoadRecommendation } from '@/constants/driverMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';

interface ReturnLoadCardProps {
  load: ReturnLoadRecommendation;
  onPress?: () => void;
}

export const ReturnLoadCard: React.FC<ReturnLoadCardProps> = ({ load, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/driver/return-load/${load.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      {/* Top row: Match badge & Return Payout */}
      <View style={styles.topRow}>
        <View style={styles.matchBadge}>
          <Ionicons name="sparkles" size={13} color="#B45309" />
          <Text style={styles.matchText}>{load.matchScore}% Match</Text>
        </View>

        <View style={styles.payoutCol}>
          <Text style={styles.payoutAmount}>₹{load.expectedPayment.toLocaleString('en-IN')}</Text>
          <Text style={styles.payoutLabel}>Return Payout</Text>
        </View>
      </View>

      <Text style={styles.titleText}>{load.title}</Text>

      {/* Origin & Destination */}
      <View style={styles.routeRow}>
        <View style={styles.routeItem}>
          <Text style={styles.routeLabel}>SOURCE / PICKUP</Text>
          <Text style={styles.cityText}>{load.pickupLocation.city}</Text>
          <Text style={styles.pickupDistBadge}>Pickup: {load.pickupDistanceKm} km away</Text>
        </View>

        <View style={styles.arrowBox}>
          <Ionicons name="arrow-down" size={16} color={colors.navy} />
        </View>

        <View style={styles.routeItem}>
          <Text style={styles.routeLabel}>DESTINATION</Text>
          <Text style={styles.cityText}>{load.destinationLocation.city}</Text>
          <Text style={styles.destSub}>{load.distanceKm} km transit</Text>
        </View>
      </View>

      {/* Cargo & Weight Specs */}
      <View style={styles.specsRow}>
        <View style={styles.specItem}>
          <Ionicons name="cube-outline" size={14} color={colors.navy} />
          <Text style={styles.specText}>{load.cargoType}</Text>
        </View>

        <View style={styles.specItem}>
          <Ionicons name="scale-outline" size={14} color={colors.navy} />
          <Text style={styles.specText}>
            {load.weightKg >= 1000 ? `${(load.weightKg / 1000).toFixed(1)}T` : `${load.weightKg} kg`} Payload
          </Text>
        </View>

        <View style={styles.specItem}>
          <Ionicons name="bus-outline" size={14} color={colors.navy} />
          <Text style={styles.specText}>
            {load.requiredCapacityKg >= 1000 ? `${(load.requiredCapacityKg / 1000).toFixed(0)}T` : `${load.requiredCapacityKg} kg`} Cap
          </Text>
        </View>
      </View>

      {/* Match reasons tags */}
      <View style={styles.reasonsContainer}>
        {load.matchReasons.map((reason, idx) => (
          <View key={idx} style={styles.reasonTag}>
            <Ionicons name="checkmark-circle" size={13} color={colors.green} />
            <Text style={styles.reasonText} numberOfLines={1}>{reason}</Text>
          </View>
        ))}
      </View>

      {/* Footer: Pickup Date / Deadline & View Load Button */}
      <View style={styles.footerRow}>
        <View style={styles.deadlineBox}>
          <Ionicons name="time-outline" size={13} color={colors.orange} />
          <Text style={styles.deadlineText}>Pickup: {load.pickupDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.viewLoadBtn}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.viewLoadText}>View Load</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    boxShadow: '0px 2px 6px rgba(245, 158, 11, 0.08)',
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  payoutCol: {
    alignItems: 'flex-end',
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  payoutLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  routeItem: {
    flex: 1,
  },
  arrowBox: {
    paddingHorizontal: spacing.sm,
  },
  routeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  cityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  pickupDistBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 2,
  },
  destSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginVertical: spacing.xs,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: '600',
  },
  reasonsContainer: {
    gap: 4,
    marginVertical: spacing.xs,
  },
  reasonTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reasonText: {
    fontSize: 11,
    color: colors.slate,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  viewLoadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  viewLoadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
});
