import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { ShipmentStatus } from '@/constants/transportOfficeMockData';

type ShipmentFilter = 'ALL' | ShipmentStatus;

export default function TransportOfficeShipmentsList() {
  const { shipments, drivers, vehicles } = useTransportOffice();

  const [activeFilter, setActiveFilter] = useState<ShipmentFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cargoType.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'ALL') return true;
    return s.status === activeFilter;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return { label: 'IN TRANSIT', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'ACCEPTED':
        return { label: 'ACCEPTED', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'AWAITING ACCEPTANCE', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'PENDING_ASSIGNMENT':
        return { label: 'PENDING ASSIGNMENT', bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
      case 'DELIVERED':
        return { label: 'DELIVERED', bg: '#E0E7FF', text: '#4338CA', dot: '#6366F1' };
      case 'CANCELLED':
      default:
        return { label: 'CANCELLED', bg: '#FEE2E2', text: '#B91C1C', dot: '#DC2626' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Freight Shipments</Text>
          <Text style={styles.headerSubtitle}>
            {shipments.length} assigned logistics hauls
          </Text>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by shipment #, route or cargo..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTER TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {(
          [
            'ALL',
            'PENDING_ASSIGNMENT',
            'ASSIGNMENT_PENDING',
            'ACCEPTED',
            'IN_TRANSIT',
            'DELIVERED',
          ] as ShipmentFilter[]
        ).map((filter) => {
          const isSelected = activeFilter === filter;
          const count =
            filter === 'ALL'
              ? shipments.length
              : shipments.filter((s) => s.status === filter).length;

          const label =
            filter === 'ALL'
              ? 'All'
              : filter === 'PENDING_ASSIGNMENT'
              ? 'Unassigned'
              : filter === 'ASSIGNMENT_PENDING'
              ? 'Pending Acceptance'
              : filter === 'ACCEPTED'
              ? 'Accepted'
              : filter === 'IN_TRANSIT'
              ? 'In Transit'
              : 'Delivered';

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, isSelected && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterTabText, isSelected && styles.filterTabTextActive]}>
                {label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* SHIPMENTS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredShipments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Shipments Found</Text>
            <Text style={styles.emptySubtitle}>
              No shipments found in this status category.
            </Text>
          </View>
        ) : (
          filteredShipments.map((shipment) => {
            const badge = getStatusBadge(shipment.status);
            const assignedDriver = drivers.find((d) => d.id === shipment.assignedDriverId);
            const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);

            return (
              <View key={shipment.id} style={styles.shipmentCard}>
                <View style={styles.shipmentCardHeader}>
                  <View style={styles.shipmentIdRow}>
                    <Text style={styles.shipmentId}>Shipment #{shipment.id}</Text>
                    <Text style={styles.weightBadge}>
                      {shipment.cargoWeightKg.toLocaleString()} KG
                    </Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* ROUTE BOX */}
                <View style={styles.routeBox}>
                  <View style={styles.routeCol}>
                    <View style={styles.pointRow}>
                      <View style={styles.originDot} />
                      <Text style={styles.cityText}>{shipment.origin}</Text>
                    </View>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {shipment.originAddress}
                    </Text>
                  </View>

                  <View style={styles.routeArrow}>
                    <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
                    <Text style={styles.distanceText}>{shipment.distanceKm} KM</Text>
                  </View>

                  <View style={styles.routeCol}>
                    <View style={styles.pointRow}>
                      <View style={styles.destDot} />
                      <Text style={styles.cityText}>{shipment.destination}</Text>
                    </View>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {shipment.destinationAddress}
                    </Text>
                  </View>
                </View>

                {/* CARGO & FLEET ASSIGNMENT */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Cargo</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>
                      {shipment.cargoType}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Required Capacity</Text>
                    <Text style={styles.infoValue}>
                      {shipment.requiredCapacityKg.toLocaleString()} KG+
                    </Text>
                  </View>
                </View>

                <View style={styles.assignmentDetailsRow}>
                  <View style={styles.assignItem}>
                    <Ionicons name="person-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.assignItemLabel}>Driver:</Text>
                    <Text style={styles.assignItemValue}>
                      {assignedDriver ? assignedDriver.name : 'Not Assigned'}
                    </Text>
                  </View>

                  <View style={styles.assignItem}>
                    <Ionicons name="bus-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.assignItemLabel}>Vehicle:</Text>
                    <Text style={styles.assignItemValue}>
                      {assignedVehicle ? assignedVehicle.vehicleNumber : 'Not Assigned'}
                    </Text>
                  </View>
                </View>

                {/* ACTIONS */}
                <View style={styles.cardActionsRow}>
                  {shipment.status === 'PENDING_ASSIGNMENT' ? (
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={() =>
                        router.push({
                          pathname: '/transport-office/shipments/assign',
                          params: { shipmentId: shipment.id },
                        } as any)
                      }
                    >
                      <Ionicons name="person-add" size={14} color={colors.white} style={{ marginRight: 6 }} />
                      <Text style={styles.assignButtonText}>Assign Driver + Vehicle</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.viewDetailsBtn}
                      onPress={() => router.push(`/transport-office/shipments/${shipment.id}` as any)}
                    >
                      <Text style={styles.viewDetailsBtnText}>View Operations Timeline</Text>
                      <Ionicons name="chevron-forward" size={14} color={colors.navy} />
                    </TouchableOpacity>
                  )}
                </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.navy,
    paddingVertical: 0,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: spacing.xs,
  },
  filterTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  shipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shipmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shipmentIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  shipmentId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  weightBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.slate,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  routeCol: {
    flex: 1,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginRight: 4,
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 4,
  },
  cityText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  addressText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routeArrow: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  assignmentDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2FF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  assignItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assignItemLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginRight: 4,
  },
  assignItemValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  cardActionsRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginRight: 4,
  },
  emptyContainer: {
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
