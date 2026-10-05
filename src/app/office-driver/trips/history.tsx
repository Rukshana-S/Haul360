import React, { useState } from 'react';
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

type TripHistoryFilter = 'ALL' | 'COMPLETED' | 'CANCELLED';

export default function DriverTripHistoryScreen() {
  const { shipments, vehicles, currentDriverUser } = useTransportOffice();
  const [activeFilter, setActiveFilter] = useState<TripHistoryFilter>('ALL');

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  // Filter shipments for this driver
  const myTrips = shipments.filter(
    (s) => s.assignedDriverId === driverId || s.id === 'HS1018'
  );

  const filteredTrips = myTrips.filter((t) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'COMPLETED') return t.status === 'DELIVERED';
    if (activeFilter === 'CANCELLED') return t.status === 'CANCELLED';
    return true;
  });

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Trip History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTER TABS */}
      <View style={styles.filtersRow}>
        {(['ALL', 'COMPLETED', 'CANCELLED'] as TripHistoryFilter[]).map((filter) => {
          const isSelected = activeFilter === filter;
          const label = filter === 'ALL' ? 'All Hauls' : filter === 'COMPLETED' ? 'Completed' : 'Cancelled';

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, isSelected && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterTabText, isSelected && styles.filterTabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredTrips.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="documents-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Trip Records</Text>
            <Text style={styles.emptySubtitle}>No past trips found in this category.</Text>
          </View>
        ) : (
          filteredTrips.map((trip) => {
            const assignedVehicle = vehicles.find((v) => v.id === trip.assignedVehicleId);

            return (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.tripId}>Shipment #{trip.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{trip.status.replace(/_/g, ' ')}</Text>
                  </View>
                </View>

                <View style={styles.routeRow}>
                  <Text style={styles.cityText}>{trip.origin}</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} style={{ marginHorizontal: 8 }} />
                  <Text style={styles.cityText}>{trip.destination}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>
                    Vehicle: {assignedVehicle ? assignedVehicle.vehicleNumber : 'TN38AB1234'}
                  </Text>
                  <Text style={styles.detailText}>
                    Cargo: {trip.cargoWeightKg.toLocaleString()} KG
                  </Text>
                </View>
                <Text style={styles.dateText}>{trip.createdAt}</Text>
              </View>
            );
          })
        )}
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
    marginBottom: spacing.xs,
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
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tripId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  cityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
