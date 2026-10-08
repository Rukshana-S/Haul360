import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { TripLifecycleStatus } from '@/constants/driverMockData';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    trips,
    advanceTripStep,
    acceptAssignment,
    declineAssignment,
    logCall,
  } = useDriver();

  const [confirmStepModalVisible, setConfirmStepModalVisible] = useState(false);
  const [callShipperModalVisible, setCallShipperModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [deliverySuccessModalVisible, setDeliverySuccessModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Not Found</Text>
        </View>
        <View style={styles.notFoundCenter}>
          <Text style={styles.notFoundText}>This trip record could not be found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back to Trips</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const getActionConfig = (status: TripLifecycleStatus) => {
    switch (status) {
      case 'ASSIGNED':
        return {
          title: 'Accept Shipment Assignment',
          sub: 'Confirm you will haul this shipment as quoted.',
          btnText: 'Accept Assignment',
          btnBg: colors.green,
          icon: 'checkmark-circle-outline' as const,
        };
      case 'ACCEPTED':
        return {
          title: 'Start Journey to Pickup',
          sub: 'Depart toward pickup facility in ' + trip.pickupLocation.city,
          btnText: 'Start Route to Pickup',
          btnBg: colors.navy,
          icon: 'car-outline' as const,
        };
      case 'EN_ROUTE_TO_PICKUP':
        return {
          title: 'Arrive at Pickup Facility',
          sub: 'Check in at loading dock gate',
          btnText: 'Mark Arrived at Pickup',
          btnBg: colors.navy,
          icon: 'location-outline' as const,
        };
      case 'ARRIVED_AT_PICKUP':
        return {
          title: 'Confirm Cargo Loading',
          sub: 'Ensure cargo is strapped and secured with tarpaulin',
          btnText: 'Confirm Loaded & Secured',
          btnBg: colors.navy,
          icon: 'cube-outline' as const,
        };
      case 'LOADED':
        return {
          title: 'Start Highway Transit',
          sub: 'Begin delivery route to ' + trip.destinationLocation.city,
          btnText: 'Start Highway Transit',
          btnBg: colors.navy,
          icon: 'navigate-outline' as const,
        };
      case 'IN_TRANSIT':
        return {
          title: 'Arrive at Destination Hub',
          sub: 'Reach recipient warehouse gate',
          btnText: 'Mark Arrived at Destination',
          btnBg: colors.navy,
          icon: 'flag-outline' as const,
        };
      case 'ARRIVED_AT_DESTINATION':
        return {
          title: 'Complete Delivery & Release POD',
          sub: 'Recipient confirms unload. Instant payout release to Passbook.',
          btnText: 'Confirm Delivery Complete',
          btnBg: colors.green,
          icon: 'checkmark-done-circle-outline' as const,
        };
      case 'DELIVERED':
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig(trip.status);

  const handleAdvanceStep = () => {
    setActionLoading(true);
    setTimeout(() => {
      const isFinishingDelivery = trip.status === 'ARRIVED_AT_DESTINATION';
      if (trip.status === 'ASSIGNED') {
        acceptAssignment(trip.id);
      } else {
        advanceTripStep(trip.id);
      }
      setActionLoading(false);
      setConfirmStepModalVisible(false);

      if (isFinishingDelivery) {
        setDeliverySuccessModalVisible(true);
      }
    }, 500);
  };

  const handleDecline = () => {
    declineAssignment(trip.id);
    setDeclineModalVisible(false);
  };

  const handleCallShipper = () => {
    logCall(trip.shipperName, 'Shipper', trip.shipperPhone, 'OUTGOING', 'Dialed', trip.tripNumber);
    setCallShipperModalVisible(false);
    const phoneToDial = trip.shipperPhone.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${phoneToDial}`).catch(() => {
      Alert.alert('Error', `Could not open dialer for ${trip.shipperPhone}`);
    });
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{trip.tripNumber}</Text>
          <Text style={styles.headerSubtitle}>Shipment {trip.shipmentNumber}</Text>
        </View>
        <StatusBadge status={trip.status} size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payout & Status Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Trip Earnings (Escrow)</Text>
              <Text style={styles.heroPayout}>₹{trip.paymentAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.escrowBadge}>
              <Ionicons
                name={trip.status === 'DELIVERED' ? 'checkmark-circle' : 'shield-checkmark'}
                size={16}
                color={trip.status === 'DELIVERED' ? colors.green : colors.blue}
              />
              <Text
                style={[
                  styles.escrowText,
                  trip.status === 'DELIVERED' && { color: colors.green },
                ]}
              >
                {trip.status === 'DELIVERED' ? 'PAYMENT RELEASED' : 'SECURE ESCROW'}
              </Text>
            </View>
          </View>

          <Text style={styles.cargoInfoText}>
            {trip.cargoType} • {(trip.weightKg / 1000).toFixed(1)} Tonnes • {trip.vehicleNumber}
          </Text>

          {/* Quick Tracking Button */}
          <TouchableOpacity
            style={styles.liveTrackingBtn}
            onPress={() => router.push(`/driver/trip/tracking?tripId=${trip.id}` as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="navigate-circle" size={18} color={colors.navy} />
            <Text style={styles.liveTrackingBtnText}>View Live Route Tracking</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.navy} />
          </TouchableOpacity>
        </View>

        {/* TRIP LIFECYCLE STEP PROGRESSION */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Trip Execution Steps</Text>

          <View style={styles.stepsTimeline}>
            {trip.steps.map((step, idx) => {
              const isCurrent = step.status === trip.status;
              const isDone = step.completed;

              return (
                <View key={step.status} style={styles.stepRow}>
                  <View style={styles.markerCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isDone && styles.stepDotDone,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      {isDone && <Ionicons name="checkmark" size={12} color={colors.white} />}
                      {isCurrent && <View style={styles.currentInnerDot} />}
                    </View>
                    {idx < trip.steps.length - 1 && (
                      <View
                        style={[
                          styles.stepConnector,
                          isDone && styles.stepConnectorDone,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCurrent && styles.stepLabelCurrent,
                        isDone && styles.stepLabelDone,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {step.timestamp && (
                      <Text style={styles.stepTimestamp}>{step.timestamp}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ROUTE WAYPOINTS */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Route Locations</Text>

          <View style={styles.locationBlock}>
            <View style={styles.originCircle} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nodeRole}>PICKUP FACILITY</Text>
              <Text style={styles.nodeCity}>{trip.pickupLocation.city}, {trip.pickupLocation.state}</Text>
              <Text style={styles.nodeAddress}>{trip.pickupLocation.address}</Text>
            </View>
          </View>

          <View style={styles.routeDividerLine} />

          <View style={styles.locationBlock}>
            <View style={styles.destSquare} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nodeRole}>DESTINATION UNLOAD DOCK</Text>
              <Text style={styles.nodeCity}>{trip.destinationLocation.city}, {trip.destinationLocation.state}</Text>
              <Text style={styles.nodeAddress}>{trip.destinationLocation.address}</Text>
            </View>
          </View>
        </View>

        {/* SHIPPER & EMERGENCY QUICK CONTACTS */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Trip Support & Contacts</Text>

          <View style={styles.contactRow}>
            <View style={styles.contactLeft}>
              <View style={styles.contactAvatar}>
                <Ionicons name="business" size={20} color={colors.navy} />
              </View>
              <View>
                <Text style={styles.contactName}>{trip.shipperName}</Text>
                <Text style={styles.contactRole}>{trip.shipperCompany}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => setCallShipperModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={16} color={colors.white} style={{ marginRight: 4 }} />
              <Text style={styles.callButtonText}>Call Shipper</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tripActionsGrid}>
            <TouchableOpacity
              style={styles.tripActionBtn}
              onPress={() => router.push(`/driver/breakdown/report?tripId=${trip.id}` as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="construct-outline" size={18} color="#DC2626" />
              <Text style={styles.tripActionBtnText}>Report Breakdown</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tripActionBtn}
              onPress={() => router.push('/driver/sos' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
              <Text style={[styles.tripActionBtnText, { color: '#DC2626' }]}>Emergency SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* IF DELIVERED: SHOW TRIP COMPLETED CARD WITH RETURN LOAD PROMPT */}
        {trip.status === 'DELIVERED' && (
          <View style={styles.deliveryCompletedCard}>
            <View style={styles.deliveryCompletedTop}>
              <View style={styles.deliveredCheckCircle}>
                <Ionicons name="checkmark-done" size={26} color={colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deliveryCompletedTitle}>TRIP COMPLETED</Text>
                <Text style={styles.deliveryCompletedSub}>
                  Shipment delivered successfully. Payout of ₹{trip.paymentAmount.toLocaleString('en-IN')} credited to Passbook.
                </Text>
              </View>
            </View>

            <Text style={styles.returnPromptText}>
              Would you like to find a return load from {trip.destinationLocation.city}?
            </Text>

            <View style={styles.deliveryActionsRow}>
              <TouchableOpacity
                style={styles.findReturnActionBtn}
                onPress={() =>
                  router.push(
                    `/driver/return-load?origin=${encodeURIComponent(trip.destinationLocation.city)}` as any
                  )
                }
                activeOpacity={0.85}
              >
                <Ionicons name="repeat" size={16} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.findReturnActionBtnText}>Find Return Load</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.finishTripBtn}
                onPress={() => router.push('/driver/(tabs)/trips' as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.finishTripBtnText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM ACTION BAR FOR ADVANCING STATUS */}
      {actionConfig && (
        <View style={styles.bottomBar}>
          {trip.status === 'ASSIGNED' ? (
            <View style={styles.assignedActionRow}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => setDeclineModalVisible(true)}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => setConfirmStepModalVisible(true)}
              >
                <Text style={styles.acceptBtnText}>Accept Assignment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.advanceButton, { backgroundColor: actionConfig.btnBg }]}
              onPress={() => setConfirmStepModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name={actionConfig.icon} size={20} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.advanceButtonText}>{actionConfig.btnText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Advance Step Confirmation Modal */}
      {actionConfig && (
        <ConfirmModal
          visible={confirmStepModalVisible}
          title={actionConfig.title}
          message={actionConfig.sub}
          confirmText={actionConfig.btnText}
          cancelText="Cancel"
          loading={actionLoading}
          iconName={actionConfig.icon}
          iconColor={actionConfig.btnBg}
          onConfirm={handleAdvanceStep}
          onCancel={() => setConfirmStepModalVisible(false)}
        />
      )}

      {/* Delivery Success Modal */}
      <ConfirmModal
        visible={deliverySuccessModalVisible}
        title="Trip Completed!"
        message={`Shipment ${trip.shipmentNumber} delivered successfully to ${trip.destinationLocation.city}. Payment of ₹${trip.paymentAmount.toLocaleString('en-IN')} is available in your Passbook. Would you like to find a return load?`}
        confirmText="Find Return Load"
        cancelText="Finish"
        iconName="checkmark-done-circle"
        iconColor={colors.green}
        onConfirm={() => {
          setDeliverySuccessModalVisible(false);
          router.push(
            `/driver/return-load?origin=${encodeURIComponent(trip.destinationLocation.city)}` as any
          );
        }}
        onCancel={() => {
          setDeliverySuccessModalVisible(false);
        }}
      />

      {/* Decline Assignment Modal */}
      <ConfirmModal
        visible={declineModalVisible}
        title="Decline Assignment?"
        message="Are you sure you want to decline this shipment booking? The shipper will be notified."
        confirmText="Decline Booking"
        cancelText="Cancel"
        confirmVariant="outline"
        iconName="close-circle-outline"
        iconColor="#DC2626"
        onConfirm={handleDecline}
        onCancel={() => setDeclineModalVisible(false)}
      />

      {/* Call Shipper Modal */}
      <ConfirmModal
        visible={callShipperModalVisible}
        title="Call Shipper?"
        message={`Connect with ${trip.shipperName} at ${trip.shipperPhone}?`}
        confirmText="Call"
        cancelText="Cancel"
        iconName="call-outline"
        iconColor={colors.navy}
        onConfirm={handleCallShipper}
        onCancel={() => setCallShipperModalVisible(false)}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 90,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  heroLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  heroPayout: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.navy,
    marginTop: 2,
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  escrowText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.blue,
  },
  cargoInfoText: {
    fontSize: 12,
    color: colors.slate,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  stepsTimeline: {
    paddingVertical: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
  },
  markerCol: {
    alignItems: 'center',
    width: 24,
    marginRight: spacing.sm,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: colors.green,
  },
  stepDotCurrent: {
    backgroundColor: colors.blue,
  },
  currentInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  stepConnector: {
    width: 2,
    height: 28,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stepConnectorDone: {
    backgroundColor: colors.green,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  stepLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  stepLabelDone: {
    color: colors.navy,
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: colors.blue,
    fontWeight: 'bold',
    fontSize: 13,
  },
  stepTimestamp: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationBlock: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  originCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
    marginTop: 4,
  },
  destSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.green,
    marginTop: 4,
  },
  nodeRole: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  nodeCity: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 1,
  },
  nodeAddress: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  routeDividerLine: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginLeft: 4,
    marginVertical: 4,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  contactRole: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  callButton: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripActionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  tripActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    gap: 6,
  },
  tripActionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  returnLoadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  returnIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnBannerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B45309',
  },
  returnBannerSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)',
    elevation: 8,
  },
  assignedActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  declineBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
  acceptBtn: {
    flex: 2,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: radius.md,
  },
  advanceButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  liveTrackingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  liveTrackingBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    flex: 1,
    marginLeft: spacing.xs,
  },
  deliveryCompletedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  deliveryCompletedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  deliveredCheckCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryCompletedTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#14532D',
  },
  deliveryCompletedSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  returnPromptText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginVertical: spacing.sm,
  },
  deliveryActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 2,
  },
  findReturnActionBtn: {
    flex: 2,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  findReturnActionBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  finishTripBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  finishTripBtnText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  backBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
