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

type VehicleFilter = 'ALL' | 'ACTIVE' | 'AVAILABLE' | 'ASSIGNED' | 'IN_TRIP' | 'MAINTENANCE' | 'INACTIVE' | 'OFFLINE';

export default function TransportOfficeVehiclesList() {
  const { vehicles, drivers, shipments } = useTransportOffice();

  const [activeFilter, setActiveFilter] = useState<VehicleFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return v.isActive !== false;
    if (activeFilter === 'INACTIVE') return v.isActive === false;
    if (activeFilter === 'AVAILABLE') return v.isActive !== false && v.status === 'AVAILABLE';
    if (activeFilter === 'ASSIGNED') return v.isActive !== false && v.status === 'ASSIGNED';
    if (activeFilter === 'IN_TRIP') return v.isActive !== false && v.status === 'IN_TRIP';
    if (activeFilter === 'MAINTENANCE') return v.isActive !== false && v.status === 'MAINTENANCE';
    if (activeFilter === 'OFFLINE') return v.isActive !== false && v.status === 'OFFLINE';
    return true;
  });

  const getStatusBadge = (vehicleItem: typeof vehicles[0]) => {
    if (vehicleItem.isActive === false) {
      return { label: 'INACTIVE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
    switch (vehicleItem.status) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNED':
        return { label: 'ASSIGNED', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'IN_TRIP':
        return { label: 'IN TRIP', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'MAINTENANCE':
        return { label: 'MAINTENANCE', bg: '#FEE2E2', text: '#B91C1C', dot: '#DC2626' };
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Vehicle Assets</Text>
          <Text style={styles.headerSubtitle}>
            {vehicles.length} registered transport vehicles
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addVehicleButton}
          activeOpacity={0.85}
          onPress={() => router.push('/transport-office/vehicles/add' as any)}
        >
          <Ionicons name="add-circle" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
          <Text style={styles.addVehicleButtonText}>+ Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by registration number, type or model..."
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

      {/* COMPACT FILTER PILLS */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {(
            [
              { key: 'ALL', label: 'All' },
              { key: 'ACTIVE', label: 'Active' },
              { key: 'AVAILABLE', label: 'Available' },
              { key: 'ASSIGNED', label: 'Assigned' },
              { key: 'IN_TRIP', label: 'In Trip' },
              { key: 'MAINTENANCE', label: 'Maintenance' },
              { key: 'INACTIVE', label: 'Inactive' },
              { key: 'OFFLINE', label: 'Offline' },
            ] as const
          ).map((item) => {
            const isSelected = activeFilter === item.key;
            const count =
              item.key === 'ALL'
                ? vehicles.length
                : item.key === 'ACTIVE'
                ? vehicles.filter((v) => v.isActive !== false).length
                : item.key === 'INACTIVE'
                ? vehicles.filter((v) => v.isActive === false).length
                : item.key === 'AVAILABLE'
                ? vehicles.filter((v) => v.isActive !== false && v.status === 'AVAILABLE').length
                : item.key === 'ASSIGNED'
                ? vehicles.filter((v) => v.isActive !== false && v.status === 'ASSIGNED').length
                : item.key === 'IN_TRIP'
                ? vehicles.filter((v) => v.isActive !== false && v.status === 'IN_TRIP').length
                : item.key === 'MAINTENANCE'
                ? vehicles.filter((v) => v.isActive !== false && v.status === 'MAINTENANCE').length
                : vehicles.filter((v) => v.isActive !== false && v.status === 'OFFLINE').length;

            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(item.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {item.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* VEHICLES LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredVehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bus-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Vehicles Found</Text>
            <Text style={styles.emptySubtitle}>
              No vehicles match the selected filter.
            </Text>
          </View>
        ) : (
          filteredVehicles.map((vehicle) => {
            const badge = getStatusBadge(vehicle);
            const currentDriver = drivers.find((d) => d.id === vehicle.currentDriverId);
            const currentShipment = shipments.find((s) => s.id === vehicle.currentShipmentId);

            return (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleCardHeader}>
                  <View style={styles.vehicleInfoLeft}>
                    <View style={styles.vehicleIconCircle}>
                      <Ionicons name="bus" size={20} color={colors.navy} />
                    </View>
                    <View>
                      <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
                      <Text style={styles.vehicleType}>{vehicle.vehicleType} • {vehicle.model}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.specsGrid}>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Gross Capacity</Text>
                    <Text style={styles.specValue}>
                      {vehicle.capacityKg.toLocaleString()} KG
                    </Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Fuel & Permit</Text>
                    <Text style={styles.specValue}>
                      {vehicle.fuelType} • National Permit
                    </Text>
                  </View>
                </View>

                {/* CURRENT ASSIGNMENT */}
                <View style={styles.assignmentBox}>
                  <View style={styles.assignmentRow}>
                    <Text style={styles.assignmentLabel}>Current Driver:</Text>
                    <Text style={styles.assignmentValue}>
                      {currentDriver ? currentDriver.name : 'None'}
                    </Text>
                  </View>
                  <View style={styles.assignmentRow}>
                    <Text style={styles.assignmentLabel}>Current Shipment:</Text>
                    <Text style={styles.assignmentValue}>
                      {currentShipment ? `#${currentShipment.id} (${currentShipment.origin} → ${currentShipment.destination})` : 'None'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.complianceRow}>
                    <Ionicons name="document-text-outline" size={14} color={colors.green} style={{ marginRight: 4 }} />
                    <Text style={styles.complianceText}>RC & Insurance: Valid</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => router.push(`/transport-office/vehicles/${vehicle.id}` as any)}
                  >
                    <Text style={styles.viewBtnText}>View Asset</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.navy} />
                  </TouchableOpacity>
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
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  addVehicleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vehicleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  vehicleInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vehicleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  vehicleType: {
    fontSize: 11,
    color: colors.textSecondary,
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
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  specItem: {
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
  assignmentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
    gap: 4,
  },
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    width: 110,
  },
  assignmentValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  complianceText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginRight: 2,
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
