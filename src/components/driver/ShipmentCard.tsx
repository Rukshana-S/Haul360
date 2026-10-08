import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ShipmentItem } from '@/constants/driverMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { StatusBadge } from './StatusBadge';

interface ShipmentCardProps {
  shipment: ShipmentItem;
  onPress?: () => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/driver/shipment/${shipment.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      {/* Top row: ID, Badge, Payout */}
      <View style={styles.topRow}>
        <View style={styles.idBox}>
          <Text style={styles.idText}>{shipment.shipmentNumber}</Text>
          {shipment.isImportExport && (
            <View style={styles.importBadge}>
              <Text style={styles.importText}>EXPORT</Text>
            </View>
          )}
          {shipment.isReturnLoadOpportunity && (
            <View style={styles.returnBadge}>
              <Text style={styles.returnText}>RETURN LOAD</Text>
            </View>
          )}
        </View>

        <View style={styles.paymentBox}>
          <Text style={styles.payoutAmount}>
            ₹{shipment.expectedPayment.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.payoutLabel}>Est. Payout</Text>
        </View>
      </View>

      {/* Route: Origin to Destination */}
      <View style={styles.routeContainer}>
        <View style={styles.routeColLeft}>
          <View style={styles.circleOrigin} />
          <View style={styles.routeLine} />
          <View style={styles.squareDest} />
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.locationBlock}>
            <Text style={styles.cityText}>{shipment.pickupLocation.city}</Text>
            <Text style={styles.stateText} numberOfLines={1}>
              {shipment.pickupLocation.address}
            </Text>
          </View>

          <View style={[styles.locationBlock, { marginTop: spacing.sm }]}>
            <Text style={styles.cityText}>{shipment.destinationLocation.city}</Text>
            <Text style={styles.stateText} numberOfLines={1}>
              {shipment.destinationLocation.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Cargo & Truck Specs */}
      <View style={styles.specsRow}>
        <View style={styles.specItem}>
          <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.specText} numberOfLines={1}>
            {shipment.cargoType}
          </Text>
        </View>

        <View style={styles.specItem}>
          <Ionicons name="scale-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.specText}>
            {(shipment.weightKg / 1000).toFixed(1)}T / {(shipment.requiredCapacityKg / 1000).toFixed(0)}T Truck
          </Text>
        </View>

        <View style={styles.specItem}>
          <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.specText}>{shipment.distanceKm} km</Text>
        </View>
      </View>

      {/* Footer: Shipper, Deadline, Button */}
      <View style={styles.footerRow}>
        <View style={styles.deadlineBox}>
          <Ionicons name="time-outline" size={13} color={colors.orange} />
          <Text style={styles.deadlineText}>Bid before {shipment.bidDeadline}</Text>
        </View>

        <View style={styles.actionRow}>
          <StatusBadge status={shipment.status} size="sm" />
          <Ionicons name="chevron-forward" size={16} color={colors.navy} style={{ marginLeft: 6 }} />
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
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  idText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    letterSpacing: 0.5,
  },
  importBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  importText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.blue,
  },
  returnBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  returnText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  paymentBox: {
    alignItems: 'flex-end',
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.navy,
  },
  payoutLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  routeContainer: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  routeColLeft: {
    alignItems: 'center',
    width: 16,
    paddingTop: 4,
    marginRight: spacing.sm,
  },
  circleOrigin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
  squareDest: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: colors.green,
  },
  routeDetails: {
    flex: 1,
  },
  locationBlock: {},
  cityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  stateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingVertical: spacing.sm,
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
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
