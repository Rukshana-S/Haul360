import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TripItem } from '@/constants/driverMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { StatusBadge } from './StatusBadge';

interface TripCardProps {
  trip: TripItem;
  onPress?: () => void;
  showTimeline?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress, showTimeline = true }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/driver/trip/${trip.id}` as any);
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round(((trip.currentStepIndex + 1) / trip.steps.length) * 100)
  );

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={styles.topRow}>
        <View style={styles.tripIdCol}>
          <Text style={styles.tripIdText}>{trip.tripNumber}</Text>
          <Text style={styles.shipmentRefText}>Shipment {trip.shipmentNumber}</Text>
        </View>

        <StatusBadge status={trip.status} size="sm" />
      </View>

      {/* Origin -> Destination Route */}
      <View style={styles.routeBox}>
        <View style={styles.locationNode}>
          <View style={styles.originDot} />
          <View>
            <Text style={styles.cityText}>{trip.pickupLocation.city}</Text>
            <Text style={styles.addressSub} numberOfLines={1}>
              {trip.pickupLocation.address}
            </Text>
          </View>
        </View>

        <View style={styles.arrowRow}>
          <View style={styles.dottedLine} />
          <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
          <View style={styles.dottedLine} />
        </View>

        <View style={styles.locationNode}>
          <View style={styles.destSquare} />
          <View>
            <Text style={styles.cityText}>{trip.destinationLocation.city}</Text>
            <Text style={styles.addressSub} numberOfLines={1}>
              {trip.destinationLocation.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar for Active Trips */}
      {showTimeline && trip.status !== 'DELIVERED' && trip.status !== 'CANCELLED' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.currentStepText}>
              Step {trip.currentStepIndex + 1} of {trip.steps.length}: {trip.status.replace(/_/g, ' ')}
            </Text>
            <Text style={styles.percentText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      )}

      {/* Specs / Details */}
      <View style={styles.specsRow}>
        <View style={styles.specCol}>
          <Text style={styles.specLabel}>Cargo & Weight</Text>
          <Text style={styles.specValue} numberOfLines={1}>
            {(trip.weightKg / 1000).toFixed(1)}T • {trip.cargoType}
          </Text>
        </View>

        <View style={styles.specCol}>
          <Text style={styles.specLabel}>Trip Earnings</Text>
          <Text style={styles.payoutValue}>₹{trip.paymentAmount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <View style={styles.vehicleInfo}>
          <Ionicons name="car-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.vehicleText}>{trip.vehicleNumber}</Text>
          <Text style={styles.dateText}>• {trip.startDate}</Text>
        </View>

        <View style={styles.viewTripBtn}>
          <Text style={styles.viewTripText}>View Trip</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.blue} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.05)',
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tripIdCol: {},
  tripIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  shipmentRefText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  routeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  locationNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
  },
  destSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: colors.green,
  },
  cityText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  addressSub: {
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: 260,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    paddingVertical: 4,
    gap: 4,
  },
  dottedLine: {
    width: 20,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#94A3B8',
  },
  progressContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentStepText: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  percentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 2.5,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: spacing.xs,
  },
  specCol: {
    flex: 1,
  },
  specLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  payoutValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.green,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  viewTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewTripText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
});
