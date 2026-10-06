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
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { ShipmentTimeline } from '@/components/ui/ShipmentTimeline';

type TripTab = 'CURRENT' | 'HISTORY';
type HistoryFilter = 'ALL' | 'COMPLETED' | 'CANCELLED';

export default function OfficeDriverTripsScreen() {
  const {
    currentDriverUser,
    shipments,
    vehicles,
    startTrip,
    advanceTripStage,
    breakdowns,
  } = useTransportOffice();

  const [activeTab, setActiveTab] = useState<TripTab>('CURRENT');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ALL');

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  // Active trip
  const activeTrip = shipments.find(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT')
  );

  const assignedVehicle = activeTrip?.assignedVehicleId
    ? vehicles.find((v) => v.id === activeTrip.assignedVehicleId)
    : null;

  const activeBreakdown = breakdowns.find(
    (b) => b.driverId === driverId && b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  );

  // Past / History trips
  const myHistoryTrips = shipments.filter(
    (s) =>
      (s.assignedDriverId === driverId || s.id === 'HS1018') &&
      (s.status === 'DELIVERED' || s.status === 'CANCELLED')
  );

  const filteredHistory = myHistoryTrips.filter((t) => {
    if (historyFilter === 'ALL') return true;
    if (historyFilter === 'COMPLETED') return t.status === 'DELIVERED';
    if (historyFilter === 'CANCELLED') return t.status === 'CANCELLED';
    return true;
  });

  const getActionConfig = () => {
    if (!activeTrip) return null;
    if (activeTrip.status === 'ACCEPTED') {
      return {
        title: 'Start Trip & Depart →',
        onPress: () => startTrip(activeTrip.id),
      };
    }
    if (activeTrip.status === 'IN_TRANSIT') {
      return {
        title: 'Confirm Delivery & Complete Haul ✓',
        onPress: () => advanceTripStage(activeTrip.id),
      };
    }
    return null;
  };

  const actionConfig = getActionConfig();

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Trips</Text>
          <Text style={styles.headerSubtitle}>
            Active transit and delivery history
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push('/office-driver/notifications' as any)}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {/* SEGMENTED TAB SWITCHER */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'CURRENT' && styles.tabBtnActive]}
          onPress={() => setActiveTab('CURRENT')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'CURRENT' && styles.tabBtnTextActive]}>
            Current Trip {activeTrip ? '●' : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'HISTORY' && styles.tabBtnActive]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'HISTORY' && styles.tabBtnTextActive]}>
            Trip History ({myHistoryTrips.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'CURRENT' ? (
          /* CURRENT TRIP TAB */
          activeTrip ? (
            <View style={styles.tabContent}>
              {/* ACTIVE BREAKDOWN WARNING BANNER */}
              {activeBreakdown && (
                <TouchableOpacity
                  style={styles.breakdownNotice}
                  onPress={() => router.push('/office-driver/breakdown/status' as any)}
                >
                  <Ionicons name="warning" size={20} color="#DC2626" style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.breakdownNoticeTitle}>Roadside Assistance in Progress</Text>
                    <Text style={styles.breakdownNoticeSub}>
                      Status: {activeBreakdown.status.replace(/_/g, ' ')} • Tap to view tracking
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#DC2626" />
                </TouchableOpacity>
              )}

              {/* HERO ROUTE CARD */}
              <View style={styles.heroRouteCard}>
                <View style={styles.heroRouteHeader}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveBadgeText}>
                      {activeTrip.status === 'IN_TRANSIT' ? 'LIVE FREIGHT HAUL' : 'READY FOR PICKUP'}
                    </Text>
                  </View>
                  <Text style={styles.distanceBadge}>{activeTrip.distanceKm} KM</Text>
                </View>

                <View style={styles.routeCitiesRow}>
                  <View style={styles.cityCol}>
                    <View style={styles.pointDotBlue} />
                    <Text style={styles.cityText}>{activeTrip.origin}</Text>
                    <Text style={styles.subAddressText} numberOfLines={1}>{activeTrip.originAddress}</Text>
                  </View>

                  <View style={styles.arrowCol}>
                    <Ionicons name="arrow-forward" size={18} color={colors.navy} />
                  </View>

                  <View style={styles.cityCol}>
                    <View style={styles.pointDotGreen} />
                    <Text style={styles.cityText}>{activeTrip.destination}</Text>
                    <Text style={styles.subAddressText} numberOfLines={1}>{activeTrip.destinationAddress}</Text>
                  </View>
                </View>
              </View>

              {/* MANIFEST DETAILS */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Manifest Details</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cargo:</Text>
                  <Text style={styles.infoValue}>{activeTrip.cargoType}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Weight:</Text>
                  <Text style={styles.infoValue}>{activeTrip.cargoWeightKg.toLocaleString()} KG</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Assigned Vehicle:</Text>
                  <Text style={[styles.infoValue, { fontWeight: 'bold' }]}>
                    {assignedVehicle ? `${assignedVehicle.vehicleNumber} (${assignedVehicle.vehicleType})` : 'Vehicle Asset'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expected Delivery:</Text>
                  <Text style={styles.infoValue}>{activeTrip.expectedDelivery}</Text>
                </View>
              </View>

              {/* INTERACTIVE TIMELINE */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Live Transit Milestones</Text>
                <ShipmentTimeline
                  status={activeTrip.status}
                  assignedDriverName={currentDriverUser?.name}
                  assignedVehicleNumber={assignedVehicle?.vehicleNumber}
                  createdAt={activeTrip.createdAt}
                  expectedDelivery={activeTrip.expectedDelivery}
                />
              </View>

              {/* PROGRESS TRIP ACTION BUTTON */}
              {actionConfig && (
                <Button
                  title={actionConfig.title}
                  onPress={actionConfig.onPress}
                  style={styles.progressBtn}
                />
              )}

              {/* EMERGENCY SOS / BREAKDOWN BUTTON */}
              <TouchableOpacity
                style={styles.sosEmergencyBtn}
                onPress={() => router.push('/office-driver/breakdown/create' as any)}
              >
                <Ionicons name="warning-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.sosEmergencyBtnText}>Report Emergency / Breakdown (SOS)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="navigate-outline" size={40} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Active Trip in Progress</Text>
              <Text style={styles.emptySubtitle}>
                You are available for your next haul. Check your assignment inbox for new dispatch requests.
              </Text>
              <Button
                title="Check Assignment Inbox"
                onPress={() => router.push('/office-driver/assignments' as any)}
                style={{ marginTop: spacing.md }}
              />
            </View>
          )
        ) : (
          /* TRIP HISTORY TAB */
          <View style={styles.tabContent}>
            {/* Filter Pills */}
            <View style={styles.historyFiltersRow}>
              {(['ALL', 'COMPLETED', 'CANCELLED'] as HistoryFilter[]).map((f) => {
                const isSelected = historyFilter === f;
                const label = f === 'ALL' ? 'All' : f === 'COMPLETED' ? 'Completed' : 'Cancelled';

                return (
                  <TouchableOpacity
                    key={f}
                    style={[styles.historyFilterPill, isSelected && styles.historyFilterPillActive]}
                    onPress={() => setHistoryFilter(f)}
                  >
                    <Text style={[styles.historyFilterText, isSelected && styles.historyFilterTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {filteredHistory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="documents-outline" size={40} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Past Trips</Text>
                <Text style={styles.emptySubtitle}>No trip history records found in this filter.</Text>
              </View>
            ) : (
              filteredHistory.map((trip) => {
                const veh = vehicles.find((v) => v.id === trip.assignedVehicleId);

                return (
                  <View key={trip.id} style={styles.historyCard}>
                    <View style={styles.historyCardHeader}>
                      <Text style={styles.historyShipmentId}>Shipment #{trip.id}</Text>
                      <View
                        style={[
                          styles.historyStatusBadge,
                          trip.status === 'DELIVERED'
                            ? { backgroundColor: '#DCFCE7' }
                            : { backgroundColor: '#FEE2E2' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.historyStatusText,
                            trip.status === 'DELIVERED'
                              ? { color: '#15803D' }
                              : { color: '#B91C1C' },
                          ]}
                        >
                          {trip.status === 'DELIVERED' ? 'Delivered' : 'Cancelled'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.historyRouteRow}>
                      <Text style={styles.historyCity}>{trip.origin}</Text>
                      <Ionicons name="arrow-forward" size={14} color={colors.navy} style={{ marginHorizontal: 6 }} />
                      <Text style={styles.historyCity}>{trip.destination}</Text>
                    </View>

                    <View style={styles.historyMetaRow}>
                      <Text style={styles.historyMetaText}>
                        Vehicle: {veh ? veh.vehicleNumber : 'Yard Asset'}
                      </Text>
                      <Text style={styles.historyMetaText}>
                        {trip.cargoWeightKg.toLocaleString()} KG
                      </Text>
                    </View>

                    <Text style={styles.historyDateText}>{trip.createdAt}</Text>
                  </View>
                );
              })
            )}
          </View>
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
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    backgroundColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.navy,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 40,
  },
  tabContent: {
    gap: spacing.md,
  },
  breakdownNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  breakdownNoticeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  breakdownNoticeSub: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
  },
  heroRouteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroRouteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#15803D',
  },
  distanceBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  routeCitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityCol: {
    flex: 1,
  },
  pointDotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginBottom: 4,
  },
  pointDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  subAddressText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowCol: {
    paddingHorizontal: spacing.sm,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  progressBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
  },
  sosEmergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  sosEmergencyBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  historyFiltersRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  historyFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyFilterPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  historyFilterText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  historyFilterTextActive: {
    color: '#FFFFFF',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyShipmentId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  historyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  historyStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  historyRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyCity: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  historyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  historyDateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
