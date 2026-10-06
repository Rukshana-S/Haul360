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

type DriverFilter = 'ALL' | 'ACTIVE' | 'AVAILABLE' | 'ASSIGNED' | 'BUSY' | 'INACTIVE' | 'OFFLINE';

export default function TransportOfficeDriversList() {
  const { drivers, shipments, vehicles } = useTransportOffice();

  const [activeFilter, setActiveFilter] = useState<DriverFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return driver.isActive !== false;
    if (activeFilter === 'INACTIVE') return driver.isActive === false;
    if (activeFilter === 'AVAILABLE') return driver.isActive !== false && driver.availability === 'AVAILABLE';
    if (activeFilter === 'ASSIGNED') return driver.isActive !== false && driver.availability === 'ASSIGNMENT_PENDING';
    if (activeFilter === 'BUSY') return driver.isActive !== false && driver.availability === 'BUSY';
    if (activeFilter === 'OFFLINE') return driver.isActive !== false && driver.availability === 'OFFLINE';
    return true;
  });

  const getAvailabilityBadge = (driverItem: typeof drivers[0]) => {
    if (driverItem.isActive === false) {
      return { label: 'INACTIVE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
    switch (driverItem.availability) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'ASSIGNED', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'BUSY':
        return { label: 'ON TRIP', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'OFFLINE':
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Driver Fleet</Text>
          <Text style={styles.headerSubtitle}>
            {drivers.length} registered office drivers
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addDriverButton}
          activeOpacity={0.85}
          onPress={() => router.push('/transport-office/drivers/add' as any)}
        >
          <Ionicons name="person-add" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
          <Text style={styles.addDriverButtonText}>+ Add Driver</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, Driver ID or mobile..."
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
              { key: 'BUSY', label: 'On Trip' },
              { key: 'INACTIVE', label: 'Inactive' },
              { key: 'OFFLINE', label: 'Offline' },
            ] as const
          ).map((item) => {
            const isSelected = activeFilter === item.key;
            const count =
              item.key === 'ALL'
                ? drivers.length
                : item.key === 'ACTIVE'
                ? drivers.filter((d) => d.isActive !== false).length
                : item.key === 'INACTIVE'
                ? drivers.filter((d) => d.isActive === false).length
                : item.key === 'AVAILABLE'
                ? drivers.filter((d) => d.isActive !== false && d.availability === 'AVAILABLE').length
                : item.key === 'ASSIGNED'
                ? drivers.filter((d) => d.isActive !== false && d.availability === 'ASSIGNMENT_PENDING').length
                : item.key === 'BUSY'
                ? drivers.filter((d) => d.isActive !== false && d.availability === 'BUSY').length
                : drivers.filter((d) => d.isActive !== false && d.availability === 'OFFLINE').length;

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

      {/* DRIVERS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredDrivers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Drivers Found</Text>
            <Text style={styles.emptySubtitle}>
              No drivers match the current filter or search criteria.
            </Text>
          </View>
        ) : (
          filteredDrivers.map((driver) => {
            const badge = getAvailabilityBadge(driver);
            const currentShipment = shipments.find((s) => s.id === driver.currentShipmentId);
            const currentVehicle = vehicles.find((v) => v.id === driver.currentVehicleId);

            return (
              <View key={driver.id} style={styles.driverCard}>
                <View style={styles.driverCardHeader}>
                  <View style={styles.driverInfoLeft}>
                    <View style={styles.driverAvatar}>
                      <Text style={styles.driverAvatarText}>
                        {driver.name.substring(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.driverName}>{driver.name}</Text>
                      <Text style={styles.driverId}>ID: {driver.id}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.driverDetailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Contact Phone</Text>
                    <Text style={styles.detailValue}>+91 {driver.phone}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Experience & Rating</Text>
                    <Text style={styles.detailValue}>
                      {driver.experienceYears} yrs • ★ {driver.rating > 0 ? driver.rating.toFixed(1) : '0.0'}
                    </Text>
                  </View>
                </View>

                {/* CURRENT ASSIGNMENT CONTEXT (NO PERMANENT VEHICLE) */}
                <View style={styles.assignmentContextBox}>
                  <View style={styles.assignmentItem}>
                    <Text style={styles.assignmentLabel}>Current Shipment:</Text>
                    <Text style={styles.assignmentValue}>
                      {currentShipment ? `#${currentShipment.id} (${currentShipment.origin} → ${currentShipment.destination})` : 'None'}
                    </Text>
                  </View>
                  <View style={styles.assignmentItem}>
                    <Text style={styles.assignmentLabel}>Current Vehicle:</Text>
                    <Text style={styles.assignmentValue}>
                      {currentVehicle ? `${currentVehicle.vehicleNumber} (${currentVehicle.vehicleType})` : 'None'}
                    </Text>
                  </View>
                </View>

                <View style={styles.driverCardFooter}>
                  <View style={styles.verificationRow}>
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color={colors.green}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.verificationText}>DL Verified: {driver.licenseNumber}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push(`/transport-office/drivers/${driver.id}` as any)}
                  >
                    <Text style={styles.viewButtonText}>View Profile</Text>
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
  addDriverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  addDriverButtonText: {
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
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  driverCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  driverInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverId: {
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
  driverDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  assignmentContextBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
    gap: 4,
  },
  assignmentItem: {
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
  driverCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verificationText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewButtonText: {
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
