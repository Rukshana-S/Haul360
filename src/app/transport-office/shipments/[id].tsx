import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
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
import { ShipmentTimeline } from '@/components/ui/ShipmentTimeline';
import { ShipmentRouteMap } from '@/components/ui/ShipmentRouteMap';

export default function TransportOfficeShipmentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getShipmentById,
    getDriverById,
    getVehicleById,
    sendShipmentRequest,
    simulateOrgResponse,
    placeBid,
    cancelBid,
    simulateOrgBidResponse,
    advanceShipmentTrackingStep,
  } = useTransportOffice();

  const shipment = getShipmentById(id || '');

  const [showRequestConfirmModal, setShowRequestConfirmModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [bidError, setBidError] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/shipments' as any);
    }
  };

  if (!shipment) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Shipment Not Found</Text>
          <Button title="Back to Shipments" onPress={handleBack} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const assignedDriver = shipment.assignedDriverId ? getDriverById(shipment.assignedDriverId) : null;
  const assignedVehicle = shipment.assignedVehicleId ? getVehicleById(shipment.assignedVehicleId) : null;

  const isAcceptedByOrg = shipment.requestStatus === 'ACCEPTED';
  const isRequestSent = shipment.requestStatus === 'REQUEST_SENT';
  const isRejectedByOrg = shipment.requestStatus === 'REJECTED';
  const isNotRequested = !shipment.requestStatus || shipment.requestStatus === 'NOT_REQUESTED';

  const handleSendRequest = () => {
    sendShipmentRequest(shipment.id);
    setShowRequestConfirmModal(false);
    setSuccessToast(`Request sent to ${shipment.organizationName}! Waiting for approval.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSimulateOrg = (accept: boolean) => {
    simulateOrgResponse(shipment.id, accept, accept ? undefined : 'Logistics route allocated to another partner.');
    setSuccessToast(accept ? `Organization accepted request! You can now assign driver & vehicle.` : `Organization rejected request.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

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
      case 'DECLINED':
        return { label: 'DECLINED BY DRIVER', bg: '#FEE2E2', text: '#B91C1C' };
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipment #{shipment.id}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* TOAST ALERT */}
        {successToast && (
          <View style={styles.toastCard}>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>{successToast}</Text>
          </View>
        )}

        {/* ORGANIZATION & AMOUNT HERO CARD */}
        <View style={styles.orgHeroCard}>
          <View style={styles.orgHeroTop}>
            <View style={styles.orgIconWrap}>
              <Ionicons name="business" size={22} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orgLabel}>Originating Shipper</Text>
              <Text style={styles.orgTitle}>{shipment.organizationName || 'ABC Exports'}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountSub}>Shipment Amount</Text>
              <Text style={styles.amountValue}>₹{(shipment.amount || 18500).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* ORGANIZATION REQUEST WORKFLOW STATUS BANNER */}
        <View style={styles.requestStatusCard}>
          <View style={styles.requestHeaderRow}>
            <Text style={styles.requestSectionTitle}>Organization Request Status</Text>
            <View
              style={[
                styles.reqStatusBadge,
                {
                  backgroundColor:
                    isAcceptedByOrg
                      ? '#DCFCE7'
                      : isRequestSent
                      ? '#FEF3C7'
                      : isRejectedByOrg
                      ? '#FEE2E2'
                      : '#EEF2FF',
                },
              ]}
            >
              <Ionicons
                name={
                  isAcceptedByOrg
                    ? 'checkmark-circle'
                    : isRequestSent
                    ? 'time-outline'
                    : isRejectedByOrg
                    ? 'close-circle'
                    : 'paper-plane-outline'
                }
                size={12}
                color={
                  isAcceptedByOrg
                    ? '#15803D'
                    : isRequestSent
                    ? '#B45309'
                    : isRejectedByOrg
                    ? '#B91C1C'
                    : '#2563EB'
                }
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.reqStatusText,
                  {
                    color:
                      isAcceptedByOrg
                        ? '#15803D'
                        : isRequestSent
                        ? '#B45309'
                        : isRejectedByOrg
                        ? '#B91C1C'
                        : '#2563EB',
                  },
                ]}
              >
                {shipment.requestStatus || 'NOT_REQUESTED'}
              </Text>
            </View>
          </View>

          {isNotRequested && (
            <View style={styles.reqActionBox}>
              <Text style={styles.reqDescText}>
                This shipment is available. You can request it directly at the organization's listed rate or submit a custom bid.
              </Text>
              <View style={styles.reqActionBtnsRow}>
                <Button
                  title="Request at Listed Rate →"
                  onPress={() => setShowRequestConfirmModal(true)}
                  style={styles.requestBtn}
                />
                <TouchableOpacity
                  style={styles.bidActionBtn}
                  onPress={() => {
                    setBidAmountInput(String(shipment.amount));
                    setBidError('');
                    setShowBidModal(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="pricetag" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.bidActionBtnText}>Place Custom Bid</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isRequestSent && (
            <View style={styles.waitingNoticeBox}>
              <Ionicons name="hourglass-outline" size={20} color="#B45309" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.waitingTitle}>Waiting for Organization Response</Text>
                <Text style={styles.waitingSub}>
                  {shipment.currentBidAmount
                    ? `Your proposed rate: ₹${shipment.currentBidAmount.toLocaleString('en-IN')}. Driver/vehicle dispatch is locked until ${shipment.organizationName} approves.`
                    : `Request sent on ${shipment.requestSentAt || 'recently'}. Driver/vehicle dispatch is locked until ${shipment.organizationName} accepts.`}
                </Text>
                {shipment.currentBidAmount && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <TouchableOpacity
                      style={styles.smallOutlineBtn}
                      onPress={() => {
                        setBidAmountInput(String(shipment.currentBidAmount));
                        setBidError('');
                        setShowBidModal(true);
                      }}
                    >
                      <Text style={styles.smallOutlineBtnText}>Edit Bid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.smallDangerBtn}
                      onPress={() => cancelBid(shipment.id)}
                    >
                      <Text style={styles.smallDangerBtnText}>Cancel Bid</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}

          {isAcceptedByOrg && (
            <View style={styles.acceptedNoticeBox}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#15803D" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.acceptedTitle}>Organization Approved Request</Text>
                <Text style={styles.acceptedSub}>
                  Ready for driver and vehicle dispatch assignment.
                </Text>
              </View>
            </View>
          )}

          {isRejectedByOrg && (
            <View style={styles.rejectedNoticeBox}>
              <Ionicons name="alert-circle-outline" size={20} color="#B91C1C" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rejectedTitle}>Request Declined</Text>
                <Text style={styles.rejectedSub}>
                  {shipment.rejectionReason || 'The organization has assigned this haul to another carrier.'}
                </Text>
              </View>
            </View>
          )}

          {/* DEVELOPMENT / TEST SIMULATOR TOGGLE */}
          <View style={styles.devSimSection}>
            <Text style={styles.devSimLabel}>TEST SIMULATOR (MOCK ORGANIZATION RESPONSE)</Text>
            <View style={styles.devSimRow}>
              <TouchableOpacity
                style={[styles.simBtn, { backgroundColor: '#DCFCE7' }]}
                onPress={() => handleSimulateOrg(true)}
              >
                <Ionicons name="checkmark" size={14} color="#15803D" style={{ marginRight: 4 }} />
                <Text style={[styles.simBtnText, { color: '#15803D' }]}>Simulate Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.simBtn, { backgroundColor: '#FEE2E2' }]}
                onPress={() => handleSimulateOrg(false)}
              >
                <Ionicons name="close" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
                <Text style={[styles.simBtnText, { color: '#B91C1C' }]}>Simulate Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ROUTE HEADER CARD */}
        <View style={styles.heroStatusCard}>
          <View style={styles.heroStatusHeader}>
            <Text style={styles.heroSub}>Haul Route Manifest</Text>
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

        {/* FLEET ASSIGNMENT CARD (CRITICAL LOCK RULE) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Fleet Assignment</Text>
            {isAcceptedByOrg && (shipment.status === 'PENDING_ASSIGNMENT' || shipment.status === 'DECLINED') && (
              <TouchableOpacity
                onPress={() => router.push(`/transport-office/shipments/assign?shipmentId=${shipment.id}` as any)}
              >
                <Text style={styles.assignLink}>+ Assign Now</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isAcceptedByOrg ? (
            <View style={styles.lockedAssignmentBox}>
              <Ionicons name="lock-closed" size={24} color="#64748B" style={{ marginBottom: 6 }} />
              <Text style={styles.lockedTitle}>Waiting for Organization Approval</Text>
              <Text style={styles.lockedSub}>
                Driver and vehicle assignment is locked until {shipment.organizationName} formally approves the shipment request.
              </Text>
              <View style={styles.lockedStatusPills}>
                <View style={styles.lockedPill}>
                  <Text style={styles.lockedPillText}>Driver: Locked</Text>
                </View>
                <View style={styles.lockedPill}>
                  <Text style={styles.lockedPillText}>Vehicle: Locked</Text>
                </View>
              </View>
            </View>
          ) : (
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
          )}

          {shipment.declineReason && (
            <View style={styles.declineBox}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.declineText}>
                Previous Driver Decline Reason: {shipment.declineReason}
              </Text>
            </View>
          )}
        </View>

        {/* DRIVER RETURN LOAD OPTIMIZATION (FIND RETURN LOAD) */}
        {(!!shipment.assignedDriverId || shipment.status === 'ASSIGNMENT_PENDING' || shipment.status === 'ACCEPTED' || shipment.status === 'IN_TRANSIT' || shipment.status === 'DELIVERED') && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="repeat" size={18} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>Find Return Load</Text>
              </View>
              <View style={styles.badgeReturnPill}>
                <Text style={styles.badgeReturnPillText}>EMPTY-MILE OPTIMIZER</Text>
              </View>
            </View>
            <Text style={styles.returnCardDesc}>
              Pair this haul with reverse freight on <Text style={{ fontWeight: '700' }}>{shipment.destination} → {shipment.origin}</Text> for {assignedDriver?.name || 'assigned driver'} to eliminate empty return miles.
            </Text>

            {shipment.activeReturnLoadShipmentId ? (
              <View style={styles.activeReturnBox}>
                <Ionicons name="checkmark-circle" size={18} color="#15803D" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeReturnTitle}>Paired Return Load #{shipment.activeReturnLoadShipmentId}</Text>
                  <Text style={styles.activeReturnSub}>Return load has been bid/confirmed for this fleet.</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewReturnLink}
                  onPress={() => router.push(`/transport-office/shipments/${shipment.activeReturnLoadShipmentId}` as any)}
                >
                  <Text style={styles.viewReturnLinkText}>View Haul →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.findReturnBtn}
                onPress={() => router.push(`/transport-office/shipments/return-load?originalShipmentId=${shipment.id}` as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="repeat" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.findReturnBtnText}>
                  Find Return Load ({shipment.destination} → {shipment.origin}) →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CARGO & ROUTE SPECIFICATIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cargo & Route Manifest</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Organization Name:</Text>
            <Text style={styles.infoValue}>{shipment.organizationName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shipment Amount:</Text>
            <Text style={[styles.infoValue, { fontWeight: 'bold', color: colors.navy }]}>
              ₹{(shipment.amount || 18500).toLocaleString('en-IN')}
            </Text>
          </View>

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
            <Text style={styles.infoLabel}>Pickup Date & Time:</Text>
            <Text style={styles.infoValue}>{shipment.pickupDate || 'Today'} ({shipment.pickupTime})</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery Deadline:</Text>
            <Text style={styles.infoValue}>{shipment.deliveryDate || 'Tomorrow'} ({shipment.expectedDelivery})</Text>
          </View>
        </View>

        {/* LIVE SIMULATED TRACKING MAP & SYNCHRONIZED TIMELINE */}
        {(shipment.status === 'IN_TRANSIT' ||
          shipment.status === 'ACCEPTED' ||
          shipment.status === 'DELIVERED' ||
          shipment.status === 'ASSIGNMENT_PENDING' ||
          !!shipment.assignedDriverId) && (
          <ShipmentRouteMap
            shipment={shipment}
            driverName={assignedDriver?.name}
            vehicleNumber={assignedVehicle?.vehicleNumber}
            canAdvanceStatus={true}
            onAdvanceStatus={() => advanceShipmentTrackingStep(shipment.id)}
            isDriverView={false}
          />
        )}

        {isAcceptedByOrg && (shipment.status === 'PENDING_ASSIGNMENT' || shipment.status === 'DECLINED') && (
          <Button
            title={shipment.status === 'DECLINED' ? "Re-assign Driver & Vehicle Now →" : "Assign Driver & Vehicle Now →"}
            onPress={() => router.push(`/transport-office/shipments/assign?shipmentId=${shipment.id}` as any)}
            style={styles.assignButton}
          />
        )}
      </ScrollView>

      {/* CONFIRM REQUEST MODAL */}
      <Modal
        visible={showRequestConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRequestConfirmModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="paper-plane" size={28} color={colors.navy} />
            </View>

            <Text style={styles.modalTitle}>Request Shipment?</Text>
            <Text style={styles.modalDesc}>
              Send a dispatch request to <Text style={{ fontWeight: 'bold' }}>{shipment.organizationName}</Text> for haul <Text style={{ fontWeight: 'bold' }}>#{shipment.id}</Text> ({shipment.origin} → {shipment.destination}) with offered freight amount <Text style={{ fontWeight: 'bold' }}>₹{(shipment.amount || 18500).toLocaleString('en-IN')}</Text>.
            </Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowRequestConfirmModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmModalBtn}
                onPress={handleSendRequest}
              >
                <Text style={styles.confirmModalBtnText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PLACE / EDIT BID MODAL */}
      <Modal
        visible={showBidModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBidModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="pricetag" size={28} color={colors.navy} />
            </View>

            <Text style={styles.modalTitle}>Submit Custom Bid</Text>
            <Text style={styles.modalDesc}>
              Propose a customized carrier rate to <Text style={{ fontWeight: 'bold' }}>{shipment.organizationName}</Text> for haul <Text style={{ fontWeight: 'bold' }}>#{shipment.id}</Text>. Listed rate: ₹{(shipment.amount || 18500).toLocaleString('en-IN')}.
            </Text>

            <View style={styles.bidInputContainer}>
              <Text style={styles.rupeeSign}>₹</Text>
              <TextInput
                style={styles.bidInputField}
                placeholder="Enter proposed rate"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={bidAmountInput}
                onChangeText={(val) => {
                  setBidAmountInput(val);
                  if (bidError) setBidError('');
                }}
              />
            </View>

            {bidError.length > 0 && (
              <Text style={{ color: '#DC2626', fontSize: 11, marginBottom: 8, fontWeight: '600' }}>
                {bidError}
              </Text>
            )}

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowBidModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmModalBtn}
                onPress={() => {
                  const num = parseInt(bidAmountInput.replace(/\D/g, ''), 10);
                  if (isNaN(num) || num <= 0) {
                    setBidError('Please enter a valid amount.');
                    return;
                  }
                  placeBid(shipment.id, num);
                  setShowBidModal(false);
                  setSuccessToast(`Bid of ₹${num.toLocaleString('en-IN')} submitted to ${shipment.organizationName}!`);
                  setTimeout(() => setSuccessToast(null), 3000);
                }}
              >
                <Text style={styles.confirmModalBtnText}>Submit Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  toastText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  orgHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  orgHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orgIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  orgLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  orgTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountSub: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  requestStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  requestHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  requestSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  reqStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  reqStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reqActionBox: {
    paddingTop: spacing.xs,
  },
  reqDescText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  requestBtn: {
    backgroundColor: colors.navy,
  },
  waitingNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  waitingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  waitingSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
    lineHeight: 16,
  },
  acceptedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#DCFCE7',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  acceptedTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#15803D',
  },
  acceptedSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  rejectedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEE2E2',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  rejectedTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B91C1C',
  },
  rejectedSub: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
    lineHeight: 16,
  },
  devSimSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  devSimLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  devSimRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lockedAssignmentBox: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: spacing.xs,
  },
  lockedTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
  },
  lockedSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
  },
  lockedStatusPills: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  lockedPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  lockedPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  modalDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  confirmModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reqActionBtnsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bidActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    borderRadius: radius.md,
    height: 48,
  },
  bidActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  smallOutlineBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  smallOutlineBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  smallDangerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.xs,
    backgroundColor: '#FEE2E2',
  },
  smallDangerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  badgeReturnPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeReturnPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  returnCardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  activeReturnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  activeReturnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  activeReturnSub: {
    fontSize: 10,
    color: '#166534',
    marginTop: 1,
  },
  viewReturnLink: {
    backgroundColor: '#15803D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.xs,
  },
  viewReturnLinkText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  findReturnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: radius.md,
    height: 42,
    paddingHorizontal: spacing.md,
  },
  findReturnBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bidInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    width: '100%',
    marginBottom: spacing.md,
  },
  rupeeSign: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginRight: 6,
  },
  bidInputField: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
  },
});
