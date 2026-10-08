import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { ShipmentCard } from '@/components/driver/ShipmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { ShipmentItem } from '@/constants/driverMockData';

type FilterCategory = 'ALL' | 'NEAR_ME' | 'HEAVY' | 'HIGH_PAY' | 'RETURN' | 'INTER_STATE' | 'EXPORT';

export default function ShipmentsScreen() {
  const { shipments, returnLoads } = useDriver();
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // Combine regular shipments and return load opportunities for complete discovery
  const allAvailableShipments = useMemo(() => {
    const combined: ShipmentItem[] = [...shipments];
    returnLoads.forEach((r) => {
      if (!combined.some((s) => s.id === r.id)) {
        combined.push(r);
      }
    });
    return combined;
  }, [shipments, returnLoads]);

  const filteredShipments = useMemo(() => {
    const src = sourceLocation.trim().toLowerCase();
    const dest = destinationLocation.trim().toLowerCase();

    return allAvailableShipments.filter((item) => {
      // 1. Source Location Filter
      if (src.length > 0) {
        const matchesPickupCity = item.pickupLocation.city.toLowerCase().includes(src);
        const matchesPickupState = item.pickupLocation.state.toLowerCase().includes(src);
        const matchesPickupAddress = item.pickupLocation.address.toLowerCase().includes(src);
        if (!matchesPickupCity && !matchesPickupState && !matchesPickupAddress) {
          return false;
        }
      }

      // 2. Destination Location Filter
      if (dest.length > 0) {
        const matchesDestCity = item.destinationLocation.city.toLowerCase().includes(dest);
        const matchesDestState = item.destinationLocation.state.toLowerCase().includes(dest);
        const matchesDestAddress = item.destinationLocation.address.toLowerCase().includes(dest);
        if (!matchesDestCity && !matchesDestState && !matchesDestAddress) {
          return false;
        }
      }

      // 3. Category filter
      switch (activeFilter) {
        case 'NEAR_ME':
          return (
            item.pickupLocation.city.toLowerCase() === 'coimbatore' ||
            item.pickupLocation.city.toLowerCase() === 'tiruppur' ||
            item.pickupLocation.city.toLowerCase() === 'salem'
          );
        case 'INTER_STATE':
          return item.pickupLocation.state !== item.destinationLocation.state;
        case 'HEAVY':
          return item.weightKg >= 8000;
        case 'HIGH_PAY':
          return item.expectedPayment >= 30000;
        case 'RETURN':
          return !!item.isReturnLoadOpportunity;
        case 'EXPORT':
          return !!item.isImportExport;
        case 'ALL':
        default:
          return true;
      }
    });
  }, [allAvailableShipments, sourceLocation, destinationLocation, activeFilter]);

  const handleSwapLocations = () => {
    const prevSrc = sourceLocation;
    setSourceLocation(destinationLocation);
    setDestinationLocation(prevSrc);
  };

  const handleClearSearch = () => {
    setSourceLocation('');
    setDestinationLocation('');
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const filterOptions: { id: FilterCategory; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Loads', count: allAvailableShipments.length },
    { id: 'NEAR_ME', label: 'Near Me' },
    { id: 'RETURN', label: 'Return Loads', count: returnLoads.length },
    { id: 'HIGH_PAY', label: 'High Pay (>₹30k)' },
    { id: 'HEAVY', label: 'Heavy (>8T)' },
    { id: 'INTER_STATE', label: 'Inter-State' },
    { id: 'EXPORT', label: 'Export / Port' },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Search Loads</Text>
          <Text style={styles.subtitle}>
            {filteredShipments.length} verified shipments available for bidding
          </Text>
        </View>
        <TouchableOpacity
          style={styles.returnLoadShortcut}
          onPress={() => router.push('/driver/return-load' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={14} color="#B45309" />
          <Text style={styles.returnShortcutText}>Return Match</Text>
        </TouchableOpacity>
      </View>

      {/* Dual Source + Destination Search Interface */}
      <View style={styles.searchContainer}>
        <View style={styles.searchCard}>
          {/* Source Input Row */}
          <View style={styles.inputRow}>
            <View style={[styles.routeIcon, { backgroundColor: '#EFF6FF' }]}>
              <View style={[styles.dotCircle, { backgroundColor: colors.blue }]} />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>SOURCE / PICKUP</Text>
              <TextInput
                placeholder="Enter pickup location (e.g. Chennai)"
                placeholderTextColor="#94A3B8"
                value={sourceLocation}
                onChangeText={setSourceLocation}
                style={styles.locationInput}
                autoCapitalize="words"
              />
            </View>
            {sourceLocation.length > 0 && (
              <TouchableOpacity onPress={() => setSourceLocation('')} style={styles.clearIconBtn}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dividerLine} />

          {/* Destination Input Row */}
          <View style={styles.inputRow}>
            <View style={[styles.routeIcon, { backgroundColor: '#DCFCE7' }]}>
              <View style={[styles.dotSquare, { backgroundColor: colors.green }]} />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>DESTINATION / DROPOFF</Text>
              <TextInput
                placeholder="Enter delivery location (e.g. Coimbatore)"
                placeholderTextColor="#94A3B8"
                value={destinationLocation}
                onChangeText={setDestinationLocation}
                style={styles.locationInput}
                autoCapitalize="words"
              />
            </View>
            {destinationLocation.length > 0 && (
              <TouchableOpacity onPress={() => setDestinationLocation('')} style={styles.clearIconBtn}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Controls Bar: Swap & Search Button */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.swapBtn}
            onPress={handleSwapLocations}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-vertical" size={16} color={colors.navy} />
            <Text style={styles.swapText}>Swap Route</Text>
          </TouchableOpacity>

          <View style={styles.searchBtnsRight}>
            {(sourceLocation.length > 0 || destinationLocation.length > 0) && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleClearSearch}
                activeOpacity={0.7}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.searchSubmitBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={14} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.searchSubmitText}>Search Loads</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Category Pills */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(f.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {f.label} {f.count !== undefined ? `(${f.count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Shipment Results List */}
      <FlatList
        data={filteredShipments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ShipmentCard shipment={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            title="No Loads Found"
            message="No shipments match your current source, destination, or active filters. Try changing your source or destination locations."
            iconName="cube-outline"
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: typography.sizes.heading2,
    fontWeight: typography.weights.bold as any,
    color: colors.navy,
  },
  subtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  returnLoadShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  returnShortcutText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  searchContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  routeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dotCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  locationInput: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  clearIconBtn: {
    padding: 4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: spacing.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: 4,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  swapText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  searchBtnsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  searchSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  searchSubmitText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  filterBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.xs,
  },
  filterScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
