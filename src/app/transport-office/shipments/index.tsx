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
        return { label: 'PENDING ACCEPTANCE', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'PENDING_ASSIGNMENT':
        return { label: 'UNASSIGNED', bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
      case 'DELIVERED':
        return { label: 'DELIVERED', bg: '#E0E7FF', text: '#4338CA', dot: '#6366F1' };
      case 'CANCELLED':
      default:
        return { label: 'CANCELLED', bg: '#FEE2E2', text: '#B91C1C', dot: '#DC2626' };
    }
  };

  const filterOptions: { key: ShipmentFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING_ASSIGNMENT', label: 'Unassigned' },
    { key: 'ASSIGNMENT_PENDING', label: 'Pending' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Freight Shipments</Text>
          <Text style={styles.headerSubtitle}>
            {shipments.length} assigned logistics hauls
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push('/transport-office/notifications' as any)}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by shipment #, route or cargo..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* COMPACT HORIZONTAL FILTER PILLS */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filterOptions.map((option) => {
            const isSelected = activeFilter === option.key;
            const count =
              option.key === 'ALL'
                ? shipments.length
                : shipments.filter((s) => s.status === option.key).length;

            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(option.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {option.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* SHIPMENTS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredShipments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cube-outline" size={32} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>No Shipments Found</Text>
            <Text style={styles.emptySubtitle}>
              No shipments found matching the selected filter or search criteria.
            </Text>
          </View>
        ) : (
          filteredShipments.map((shipment) => {
            const badge = getStatusBadge(shipment.status);
            const assignedDriver = drivers.find((d) => d.id === shipment.assignedDriverId);
            const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);

            return (
              <View key={shipment.id} style={styles.shipmentCard}>
                {/* CARD HEADER */}
                <View style={styles.shipmentCardHeader}>
                  <View style={styles.shipmentIdRow}>
                    <Text style={styles.shipmentId}>#{shipment.id}</Text>
                    <View style={styles.weightBadge}>
                      <Text style={styles.weightBadgeText}>
                        {shipment.cargoWeightKg.toLocaleString()} KG
                      </Text>
                    </View>
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
                    <Ionicons name="arrow-forward" size={14} color="#64748B" />
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

                {/* CARGO INFO */}
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

                {/* DRIVER & VEHICLE ROW */}
                <View style={styles.assignmentDetailsRow}>
                  <View style={styles.assignItem}>
                    <Ionicons name="person-outline" size={13} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.assignItemLabel}>Driver:</Text>
                    <Text style={styles.assignItemValue} numberOfLines={1}>
                      {assignedDriver ? assignedDriver.name : 'Not Assigned'}
                    </Text>
                  </View>

                  <View style={styles.assignItem}>
                    <Ionicons name="bus-outline" size={13} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.assignItemLabel}>Vehicle:</Text>
                    <Text style={styles.assignItemValue} numberOfLines={1}>
                      {assignedVehicle ? assignedVehicle.vehicleNumber : 'Not Assigned'}
                    </Text>
                  </View>
                </View>

                {/* ACTIONS */}
                <View style={styles.cardActionsRow}>
                  {shipment.status === 'PENDING_ASSIGNMENT' ? (
                    <TouchableOpacity
                      style={styles.assignButton}
                      activeOpacity={0.85}
                      onPress={() =>
                        router.push({
                          pathname: '/transport-office/shipments/assign',
                          params: { shipmentId: shipment.id },
                        } as any)
                      }
                    >
                      <Ionicons name="person-add" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.assignButtonText}>Assign Driver + Vehicle</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.viewDetailsBtn}
                      activeOpacity={0.7}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.navy,
    paddingVertical: 0,
  },
  filtersWrapper: {
    paddingVertical: 6,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 40,
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
    gap: 6,
  },
  shipmentId: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },
  weightBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  weightBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    fontWeight: '700',
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
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
    marginRight: 5,
  },
  destDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
    marginRight: 5,
  },
  cityText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  addressText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  routeArrow: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#64748B',
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
    color: '#64748B',
    marginRight: 4,
  },
  assignItemValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
    flexShrink: 1,
  },
  cardActionsRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
    height: 44,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: spacing.lg,
  },
});
