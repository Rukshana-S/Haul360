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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { ReturnLoadCard } from '@/components/driver/ReturnLoadCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

type ReturnFilter = 'ALL' | 'HIGH_MATCH' | 'NEAR_DROPOFF' | 'HOME_CORRIDOR' | 'CAPACITY_MATCH' | 'HIGH_PAY';

export default function ReturnLoadScreen() {
  const { origin } = useLocalSearchParams<{ origin?: string }>();
  const { returnLoads, activeTrip, profile, vehicle } = useDriver();

  const initialSource = origin || activeTrip?.destinationLocation.city || 'Coimbatore';
  const homeCity = profile.city || 'Chennai';

  const [sourceLocation, setSourceLocation] = useState(initialSource);
  const [destinationLocation, setDestinationLocation] = useState('');
  const [activeFilter, setActiveFilter] = useState<ReturnFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filteredLoads = useMemo(() => {
    const src = sourceLocation.trim().toLowerCase();
    const dest = destinationLocation.trim().toLowerCase();

    return returnLoads.filter((item) => {
      // 1. Source Location match
      if (src.length > 0) {
        const matchesPickupCity = item.pickupLocation.city.toLowerCase().includes(src);
        const matchesPickupState = item.pickupLocation.state.toLowerCase().includes(src);
        if (!matchesPickupCity && !matchesPickupState) {
          return false;
        }
      }

      // 2. Destination Location match
      if (dest.length > 0) {
        const matchesDestCity = item.destinationLocation.city.toLowerCase().includes(dest);
        const matchesDestState = item.destinationLocation.state.toLowerCase().includes(dest);
        if (!matchesDestCity && !matchesDestState) {
          return false;
        }
      }

      // 3. Filter tabs
      switch (activeFilter) {
        case 'NEAR_DROPOFF':
          return item.pickupDistanceKm <= 20;
        case 'HIGH_MATCH':
          return item.matchScore >= 90;
        case 'HIGH_PAY':
          return item.expectedPayment >= 20000;
        case 'HOME_CORRIDOR':
          return item.destinationLocation.city.toLowerCase().includes(homeCity.toLowerCase());
        case 'CAPACITY_MATCH':
          return item.weightKg <= vehicle.capacityKg;
        case 'ALL':
        default:
          return true;
      }
    });
  }, [returnLoads, sourceLocation, destinationLocation, activeFilter, homeCity, vehicle.capacityKg]);

  const handleClearSearch = () => {
    setSourceLocation('');
    setDestinationLocation('');
  };

  const handleResetSourceToDelivery = () => {
    setSourceLocation(initialSource);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const filterTabs: { id: ReturnFilter; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Return Loads', count: returnLoads.length },
    { id: 'HIGH_MATCH', label: '90%+ Match' },
    { id: 'NEAR_DROPOFF', label: 'Near Dropoff (<20 km)' },
    { id: 'HOME_CORRIDOR', label: `Return to ${homeCity}` },
    { id: 'CAPACITY_MATCH', label: `Fits ${vehicle.capacityTons}T Truck` },
    { id: 'HIGH_PAY', label: 'High Payout' },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Return Load Search</Text>
          <Text style={styles.headerSubtitle}>Find return freight & avoid empty back-hauls</Text>
        </View>
      </View>

      {/* Corridor Context Banner */}
      <View style={styles.contextHero}>
        <View style={styles.contextHeroTop}>
          <View style={styles.sparkleCircle}>
            <Ionicons name="sparkles" size={16} color="#B45309" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contextHeroTitle}>Recommended Return Loads</Text>
            <Text style={styles.contextHeroSub}>
              Starting from your delivery location in <Text style={{ fontWeight: 'bold' }}>{sourceLocation || initialSource}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Dual Source + Destination Return Load Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchCard}>
          {/* Source Input */}
          <View style={styles.inputRow}>
            <View style={[styles.dotCircle, { backgroundColor: colors.blue }]} />
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>SOURCE / CURRENT LOCATION</Text>
              <TextInput
                placeholder="Current delivery location"
                placeholderTextColor="#94A3B8"
                value={sourceLocation}
                onChangeText={setSourceLocation}
                style={styles.locationInput}
                autoCapitalize="words"
              />
            </View>
            {sourceLocation.length > 0 && (
              <TouchableOpacity onPress={() => setSourceLocation('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dividerLine} />

          {/* Destination Input */}
          <View style={styles.inputRow}>
            <View style={[styles.dotSquare, { backgroundColor: colors.green }]} />
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>RETURN DESTINATION</Text>
              <TextInput
                placeholder="Enter return destination (e.g. Chennai)"
                placeholderTextColor="#94A3B8"
                value={destinationLocation}
                onChangeText={setDestinationLocation}
                style={styles.locationInput}
                autoCapitalize="words"
              />
            </View>
            {destinationLocation.length > 0 && (
              <TouchableOpacity onPress={() => setDestinationLocation('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Controls Bar */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.deliveryOriginBtn}
            onPress={handleResetSourceToDelivery}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={14} color={colors.navy} />
            <Text style={styles.deliveryOriginText}>Use Delivery Location</Text>
          </TouchableOpacity>

          <View style={styles.actionBtnsRight}>
            {(sourceLocation.length > 0 || destinationLocation.length > 0) && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleClearSearch}
                activeOpacity={0.7}
              >
                <Text style={styles.resetText}>Clear</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.searchBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={14} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.searchBtnText}>Search Return Loads</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(tab.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Return Loads List */}
      <FlatList
        data={filteredLoads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReturnLoadCard load={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            title="No Return Loads Found"
            message="No return shipments matching your current source and destination. Try searching for other return locations or resetting filters."
            iconName="repeat-outline"
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  contextHero: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  contextHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sparkleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextHeroTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92400E',
  },
  contextHeroSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  dotCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  dotSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: spacing.sm,
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
  clearBtn: {
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
  deliveryOriginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  deliveryOriginText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.navy,
  },
  actionBtnsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  resetText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },
  searchBtnText: {
    fontSize: 11,
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
  },
  filterPillActive: {
    backgroundColor: colors.navy,
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
