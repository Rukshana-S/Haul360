import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeShipmentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getShipmentById, getDriverById, getVehicleById } = useTransportOffice();

  const shipment = getShipmentById(id || '');

  if (!shipment) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Shipment Not Found</Text>
          <Button title="Back to Shipments" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const assignedDriver = shipment.assignedDriverId ? getDriverById(shipment.assignedDriverId) : null;
  const assignedVehicle = shipment.assignedVehicleId ? getVehicleById(shipment.assignedVehicleId) : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return { label: 'IN TRANSIT', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'ACCEPTED':
        return { label: 'DRIVER ACCEPTED', bg: '#DCFCE7', text: '#15803D' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'PENDING ACCEPTANCE', bg: '#FEF3C7', text: '#B45309' };
      case 'PENDING_ASSIGNMENT':
        return { label: 'UNASSIGNED', bg: '#F1F5F9', text: '#475569' };
      case 'DELIVERED':
        return { label: 'DELIVERED', bg: '#E0E7FF', text: '#4338CA' };
      default:
        return { label: status, bg: '#F1F5F9', text: '#475569' };
    }
  };

  const badge = getStatusBadge(shipment.status);

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipment #{shipment.id}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* STATUS BANNER */}
        <View style={styles.heroStatusCard}>
          <View style={styles.heroStatusHeader}>
            <Text style={styles.heroSub}>Logistics Dispatch Operation</Text>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                {badge.label}
              </Text>
            </View>
          </View>

          <View style={styles.routeHeader}>
            <View style={styles.routeCityBox}>
              <View style={styles.originDot} />
              <Text style={styles.routeCity}>{shipment.origin}</Text>
            </View>
            <View style={styles.routeDivider}>
              <Ionicons name="arrow-forward" size={16} color={colors.navy} />
              <Text style={styles.distanceText}>{shipment.distanceKm} KM</Text>
            </View>
            <View style={styles.routeCityBox}>
              <View style={styles.destDot} />
              <Text style={styles.routeCity}>{shipment.destination}</Text>
            </View>
          </View>
        </View>

        {/* ASSIGNMENT STATUS CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Fleet Assignment</Text>
            {shipment.status === 'PENDING_ASSIGNMENT' && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/transport-office/shipments/assign',
                    params: { shipmentId: shipment.id },
                  } as any)
                }
              >
                <Text style={styles.assignLink}>+ Assign Now</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.assignmentRow}>
            <View style={styles.assignBox}>
              <Text style={styles.assignLabel}>ASSIGNED DRIVER</Text>
              {assignedDriver ? (
                <TouchableOpacity
                  onPress={() => router.push(`/transport-office/drivers/${assignedDriver.id}` as any)}
                >
                  <Text style={styles.assignName}>{assignedDriver.name}</Text>
                  <Text style={styles.assignSub}>{assignedDriver.id} • +91 {assignedDriver.phone}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.unassignedText}>Not Assigned</Text>
              )}
            </View>

            <View style={styles.assignBox}>
              <Text style={styles.assignLabel}>ASSIGNED VEHICLE</Text>
              {assignedVehicle ? (
                <TouchableOpacity
                  onPress={() => router.push(`/transport-office/vehicles/${assignedVehicle.id}` as any)}
                >
                  <Text style={styles.assignName}>{assignedVehicle.vehicleNumber}</Text>
                  <Text style={styles.assignSub}>{assignedVehicle.vehicleType} ({assignedVehicle.capacityKg.toLocaleString()} KG)</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.unassignedText}>Not Assigned</Text>
              )}
            </View>
          </View>

          {shipment.declineReason && (
            <View style={styles.declineBox}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.declineText}>
                Previous Driver Decline Reason: {shipment.declineReason}
              </Text>
            </View>
          )}
        </View>

        {/* CARGO & ROUTE SPECIFICATIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cargo & Route Manifest</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cargo Description:</Text>
            <Text style={styles.infoValue}>{shipment.cargoType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Cargo Weight:</Text>
            <Text style={styles.infoValue}>{shipment.cargoWeightKg.toLocaleString()} KG</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Capacity Required:</Text>
            <Text style={styles.infoValue}>{shipment.requiredCapacityKg.toLocaleString()} KG+</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pickup Warehouse:</Text>
            <Text style={styles.infoValue}>{shipment.originAddress}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Destination Facility:</Text>
            <Text style={styles.infoValue}>{shipment.destinationAddress}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expected Schedule:</Text>
            <Text style={styles.infoValue}>{shipment.pickupTime} → {shipment.expectedDelivery}</Text>
          </View>
        </View>

        {/* OPERATIONAL TIMELINE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Operational Timeline</Text>

          <View style={styles.timelineContainer}>
            {shipment.timeline.map((event, idx) => {
              const isLast = idx === shipment.timeline.length - 1;

              return (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineLeftCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        event.completed && styles.timelineDotCompleted,
                      ]}
                    >
                      {event.completed ? (
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      ) : (
                        <View style={styles.timelineInnerDot} />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineVerticalLine,
                          event.completed && styles.timelineVerticalLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineRightCol}>
                    <View style={styles.timelineTitleRow}>
                      <Text
                        style={[
                          styles.timelineEventTitle,
                          event.completed && styles.timelineEventTitleCompleted,
                        ]}
                      >
                        {event.title}
                      </Text>
                      <Text style={styles.timelineEventTime}>{event.time}</Text>
                    </View>
                    {event.description && (
                      <Text style={styles.timelineEventDesc}>{event.description}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {shipment.status === 'PENDING_ASSIGNMENT' && (
          <Button
            title="Assign Driver & Vehicle Now →"
            onPress={() =>
              router.push({
                pathname: '/transport-office/shipments/assign',
                params: { shipmentId: shipment.id },
              } as any)
            }
            style={styles.assignButton}
          />
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  heroStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  heroStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  routeCityBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
    marginRight: 6,
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  routeDivider: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  assignLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  assignmentRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  assignBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  assignLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  assignName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  assignSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unassignedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  declineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  declineText: {
    flex: 1,
    fontSize: 11,
    color: '#991B1B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    width: '40%',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    width: '60%',
    textAlign: 'right',
  },
  timelineContainer: {
    paddingVertical: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeftCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: colors.navy,
  },
  timelineInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  timelineVerticalLineCompleted: {
    backgroundColor: colors.navy,
  },
  timelineRightCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineEventTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  timelineEventTitleCompleted: {
    fontWeight: 'bold',
    color: colors.navy,
  },
  timelineEventTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  timelineEventDesc: {
    fontSize: 11,
    color: colors.slate,
    marginTop: 2,
  },
  assignButton: {
    backgroundColor: colors.navy,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
});
