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

type ShipmentFilter = 'ALL' | 'AVAILABLE' | 'REQUEST_SENT' | 'ACCEPTED' | 'REJECTED' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';

export default function TransportOfficeShipmentsList() {
  const { shipments, drivers, vehicles } = useTransportOffice();

  const [activeFilter, setActiveFilter] = useState<ShipmentFilter>('ALL');
  const [sourceQuery, setSourceQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [appliedSource, setAppliedSource] = useState('');
  const [appliedDestination, setAppliedDestination] = useState('');

  const handleSearch = () => {
    setAppliedSource(sourceQuery.trim().toLowerCase());
    setAppliedDestination(destinationQuery.trim().toLowerCase());
  };

  const handleClear = () => {
    setSourceQuery('');
    setDestinationQuery('');
    setAppliedSource('');
    setAppliedDestination('');
  };

  const filteredShipments = shipments.filter((s) => {
    // 1. Source filtering
    if (appliedSource) {
      const matchSource =
        s.origin.toLowerCase().includes(appliedSource) ||
        s.originAddress.toLowerCase().includes(appliedSource);
      if (!matchSource) return false;
    }

    // 2. Destination filtering
    if (appliedDestination) {
      const matchDest =
        s.destination.toLowerCase().includes(appliedDestination) ||
        s.destinationAddress.toLowerCase().includes(appliedDestination);
      if (!matchDest) return false;
    }

    // 3. Tab Filter
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'AVAILABLE') return s.requestStatus === 'NOT_REQUESTED' || !s.requestStatus;
    if (activeFilter === 'REQUEST_SENT') return s.requestStatus === 'REQUEST_SENT';
    if (activeFilter === 'ACCEPTED') return s.requestStatus === 'ACCEPTED' && s.status === 'PENDING_ASSIGNMENT';
    if (activeFilter === 'REJECTED') return s.requestStatus === 'REJECTED';
    if (activeFilter === 'ASSIGNED') return s.status === 'ASSIGNMENT_PENDING' || (s.status === 'ACCEPTED' && s.assignedDriverId);
    if (activeFilter === 'IN_TRANSIT') return s.status === 'IN_TRANSIT';
    if (activeFilter === 'DELIVERED') return s.status === 'DELIVERED';
    return true;
  });

  const getRequestBadge = (shipment: typeof shipments[0]) => {
    if (shipment.bidStatus === 'PENDING') {
      return { label: `BID PLACED (₹${(shipment.currentBidAmount || shipment.amount).toLocaleString('en-IN')})`, bg: '#FEF3C7', text: '#B45309', icon: 'pricetag-outline' as const };
    }
    if (shipment.returnLoadStatus === 'ACCEPTED_BY_ORGANIZATION') {
      return { label: 'RETURN LOAD CONFIRMED', bg: '#DCFCE7', text: '#15803D', icon: 'repeat' as const };
    }
    switch (shipment.requestStatus) {
      case 'REQUEST_SENT':
        return { label: 'REQUEST SENT', bg: '#FEF3C7', text: '#B45309', icon: 'time-outline' as const };
      case 'ACCEPTED':
        return { label: 'REQUEST ACCEPTED', bg: '#DCFCE7', text: '#15803D', icon: 'checkmark-circle' as const };
      case 'REJECTED':
        return { label: 'REQUEST REJECTED', bg: '#FEE2E2', text: '#B91C1C', icon: 'close-circle' as const };
      case 'EXPIRED':
        return { label: 'EXPIRED', bg: '#F1F5F9', text: '#64748B', icon: 'alert-circle' as const };
      case 'NOT_REQUESTED':
      default:
        return { label: 'AVAILABLE TO REQUEST', bg: '#EEF2FF', text: '#2563EB', icon: 'paper-plane-outline' as const };
    }
  };

  const filterOptions: { key: ShipmentFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'AVAILABLE', label: 'Available' },
    { key: 'REQUEST_SENT', label: 'Request Sent' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>All Organization Shipments</Text>
          <Text style={styles.headerSubtitle}>
            Browse & request logistics freight across all shipping clients
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push('/transport-office/notifications' as any)}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {/* DUAL SOURCE + DESTINATION SEARCH PANEL */}
      <View style={styles.dualSearchCard}>
        <View style={styles.dualSearchHeader}>
          <Ionicons name="search" size={16} color={colors.navy} style={{ marginRight: 6 }} />
          <Text style={styles.dualSearchTitle}>Search All Shipments by Route</Text>
        </View>

        <View style={styles.searchFieldsRow}>
          <View style={styles.searchFieldCol}>
            <Text style={styles.searchFieldLabel}>Source</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={16} color="#2563EB" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter source address"
                placeholderTextColor="#94A3B8"
                value={sourceQuery}
                onChangeText={setSourceQuery}
              />
            </View>
          </View>

          <View style={styles.searchFieldCol}>
            <Text style={styles.searchFieldLabel}>Destination</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="navigate-outline" size={16} color="#15803D" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter destination address"
                placeholderTextColor="#94A3B8"
                value={destinationQuery}
                onChangeText={setDestinationQuery}
              />
            </View>
          </View>
        </View>

        <View style={styles.searchActionsRow}>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
            <Ionicons name="search" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.searchBtnText}>Search Shipments</Text>
          </TouchableOpacity>

          {Boolean(sourceQuery.length > 0 || destinationQuery.length > 0 || appliedSource.length > 0 || appliedDestination.length > 0) && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.85}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
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
            let count = 0;
            if (option.key === 'ALL') count = shipments.length;
            else if (option.key === 'AVAILABLE') count = shipments.filter((s) => s.requestStatus === 'NOT_REQUESTED' || !s.requestStatus).length;
            else if (option.key === 'REQUEST_SENT') count = shipments.filter((s) => s.requestStatus === 'REQUEST_SENT').length;
            else if (option.key === 'ACCEPTED') count = shipments.filter((s) => s.requestStatus === 'ACCEPTED' && s.status === 'PENDING_ASSIGNMENT').length;
            else if (option.key === 'REJECTED') count = shipments.filter((s) => s.requestStatus === 'REJECTED').length;
            else if (option.key === 'ASSIGNED') count = shipments.filter((s) => s.status === 'ASSIGNMENT_PENDING' || (s.status === 'ACCEPTED' && s.assignedDriverId)).length;
            else if (option.key === 'IN_TRANSIT') count = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
            else if (option.key === 'DELIVERED') count = shipments.filter((s) => s.status === 'DELIVERED').length;

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
              Try another source or destination address or adjust the active filter.
            </Text>
          </View>
        ) : (
          filteredShipments.map((shipment) => {
            const reqBadge = getRequestBadge(shipment);
            const assignedDriver = drivers.find((d) => d.id === shipment.assignedDriverId);
            const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);

            return (
              <View key={shipment.id} style={styles.shipmentCard}>
                {/* ORGANIZATION BADGE & AMOUNT HEADER */}
                <View style={styles.cardTopHeader}>
                  <View style={styles.orgBadge}>
                    <Ionicons name="business" size={13} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.orgName}>{shipment.organizationName || 'ABC Exports'}</Text>
                  </View>

                  <View style={styles.amountBadge}>
                    <Text style={styles.amountLabel}>Shipment Amount</Text>
                    <Text style={styles.amountText}>₹{(shipment.amount || 18500).toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* CARD META ROW */}
                <View style={styles.shipmentCardHeader}>
                  <View style={styles.shipmentIdRow}>
                    <Text style={styles.shipmentId}>#{shipment.id}</Text>
                    <View style={styles.weightBadge}>
                      <Text style={styles.weightBadgeText}>
                        {shipment.cargoWeightKg.toLocaleString()} KG
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: reqBadge.bg }]}>
                    <Ionicons name={reqBadge.icon} size={12} color={reqBadge.text} style={{ marginRight: 3 }} />
                    <Text style={[styles.statusBadgeText, { color: reqBadge.text }]}>
                      {reqBadge.label}
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

                {/* CARGO & SCHEDULE INFO */}
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

                {/* ACTIONS */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.viewButtonFull}
                    onPress={() => router.push(`/transport-office/shipments/${shipment.id}` as any)}
                  >
                    <Text style={styles.viewButtonText}>View Details →</Text>
                  </TouchableOpacity>
                  {shipment.requestStatus === 'ACCEPTED' && (shipment.status === 'PENDING_ASSIGNMENT' || shipment.status === 'DECLINED') && (
                    <TouchableOpacity
                      style={styles.assignQuickButton}
                      onPress={() => router.push(`/transport-office/shipments/assign?shipmentId=${shipment.id}` as any)}
                    >
                      <Ionicons name="person-add" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                      <Text style={styles.assignQuickButtonText}>Assign Fleet</Text>
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
  dualSearchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dualSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dualSearchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  searchFieldsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchFieldCol: {
    flex: 1,
  },
  searchFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 8,
    height: 38,
  },
  inputIcon: {
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    color: colors.navy,
    paddingVertical: 0,
  },
  searchActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  searchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    height: 36,
  },
  searchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
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
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
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
  cardTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  orgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  orgName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  amountBadge: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
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
    fontSize: 14,
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
  cardActionsRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewButtonFull: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
    height: 38,
    paddingHorizontal: 8,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  assignQuickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: radius.md,
    height: 38,
    paddingHorizontal: 12,
  },
  assignQuickButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
