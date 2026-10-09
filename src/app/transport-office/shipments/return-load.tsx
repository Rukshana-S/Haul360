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
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { OfficeShipment } from '@/constants/transportOfficeMockData';

export default function ReturnLoadSearchScreen() {
  const { originalShipmentId } = useLocalSearchParams<{ originalShipmentId: string }>();
  const {
    getShipmentById,
    getMatchingReturnLoads,
    placeBid,
    cancelBid,
    simulateOrgBidResponse,
    drivers,
    vehicles,
  } = useTransportOffice();

  const originalShipment = originalShipmentId ? getShipmentById(originalShipmentId) : undefined;
  const assignedDriver = originalShipment?.assignedDriverId
    ? drivers.find((d) => d.id === originalShipment.assignedDriverId)
    : undefined;
  const assignedVehicle = originalShipment?.assignedVehicleId
    ? vehicles.find((v) => v.id === originalShipment.assignedVehicleId)
    : undefined;

  const matchingShipments = originalShipmentId ? getMatchingReturnLoads(originalShipmentId) : [];

  // Bid Modal State
  const [selectedShipmentForBid, setSelectedShipmentForBid] = useState<OfficeShipment | null>(null);
  const [bidAmountInput, setBidAmountInput] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenBidModal = (shipment: OfficeShipment) => {
    setSelectedShipmentForBid(shipment);
    setBidAmountInput(shipment.currentBidAmount ? String(shipment.currentBidAmount) : String(shipment.amount));
    setBidError('');
  };

  const handleSubmitBid = () => {
    if (!selectedShipmentForBid || !originalShipment) return;
    const numAmount = parseInt(bidAmountInput.replace(/\D/g, ''), 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      setBidError('Please enter a valid bid amount in INR.');
      return;
    }

    const res = placeBid(selectedShipmentForBid.id, numAmount, true, originalShipment.id);
    if (res.success) {
      const targetOrg = selectedShipmentForBid.organizationName;
      const targetId = selectedShipmentForBid.id;
      setSelectedShipmentForBid(null);
      showToast(`Bid of ₹${numAmount.toLocaleString('en-IN')} submitted to ${targetOrg} for #${targetId}. Waiting for approval.`);
    } else {
      setBidError(res.error || 'Failed to submit bid.');
    }
  };

  const handleCancelBid = (shipmentId: string) => {
    cancelBid(shipmentId);
    showToast(`Bid for #${shipmentId} cancelled.`);
  };

  const handleSimulateAccept = (shipmentId: string) => {
    simulateOrgBidResponse(shipmentId, true);
    showToast(`✓ Organization Accepted Bid! Return Load Confirmed. Assigned driver has been notified.`);
  };

  const handleSimulateReject = (shipmentId: string) => {
    simulateOrgBidResponse(shipmentId, false, 'Rate proposed was not competitive with alternative quotes.');
    showToast(`Organization declined bid for #${shipmentId}.`);
  };

  if (!originalShipment) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Return Load</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>Original Shipment Not Found</Text>
          <Text style={styles.emptySubtitle}>
            Please select an active assigned shipment to find compatible return freight.
          </Text>
          <TouchableOpacity style={styles.primaryActionBtn} onPress={() => router.back()}>
            <Text style={styles.primaryActionBtnText}>← Return to Shipments</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>Find Return Load</Text>
          <Text style={styles.headerSubtitle}>
            Pair with Driver {assignedDriver?.name || 'Duty'} for return journey
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* TOAST BANNER */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <Ionicons name="information-circle" size={18} color="#15803D" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. ORIGINAL SHIPMENT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeOutbound}>
              <Ionicons name="arrow-up-circle" size={12} color="#1D4ED8" style={{ marginRight: 4 }} />
              <Text style={styles.badgeOutboundText}>PRIMARY OUTBOUND TRIP</Text>
            </View>
            <Text style={styles.shipmentIdText}>#{originalShipment.id}</Text>
          </View>

          <View style={styles.routeBox}>
            <View style={styles.routeCol}>
              <View style={styles.dotRow}>
                <View style={styles.originDot} />
                <Text style={styles.cityText}>{originalShipment.origin}</Text>
              </View>
              <Text style={styles.subAddressText} numberOfLines={1}>{originalShipment.originAddress}</Text>
            </View>

            <View style={styles.routeArrowCol}>
              <Ionicons name="arrow-forward" size={16} color="#64748B" />
              <Text style={styles.distanceText}>{originalShipment.distanceKm} KM</Text>
            </View>

            <View style={styles.routeCol}>
              <View style={styles.dotRow}>
                <View style={styles.destDot} />
                <Text style={styles.cityText}>{originalShipment.destination}</Text>
              </View>
              <Text style={styles.subAddressText} numberOfLines={1}>{originalShipment.destinationAddress}</Text>
            </View>
          </View>

          <View style={styles.driverFleetRow}>
            <View style={styles.fleetCol}>
              <Text style={styles.fleetLabel}>ASSIGNED DRIVER</Text>
              <Text style={styles.fleetValue}>{assignedDriver?.name || 'Driver'}</Text>
              <Text style={styles.fleetSub}>{assignedDriver?.id || ''}</Text>
            </View>
            <View style={styles.fleetCol}>
              <Text style={styles.fleetLabel}>ASSIGNED VEHICLE</Text>
              <Text style={styles.fleetValue}>{assignedVehicle?.vehicleNumber || 'Vehicle'}</Text>
              <Text style={styles.fleetSub}>{assignedVehicle?.vehicleType || ''}</Text>
            </View>
            <View style={styles.fleetCol}>
              <Text style={styles.fleetLabel}>OUTBOUND AMOUNT</Text>
              <Text style={[styles.fleetValue, { color: colors.navy }]}>
                ₹{originalShipment.amount.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.fleetSub}>{originalShipment.organizationName}</Text>
            </View>
          </View>
        </View>

        {/* 2. SUGGESTED RETURN ROUTE INVERSION BANNER */}
        <View style={styles.returnRouteBanner}>
          <View style={styles.returnRouteHeader}>
            <View style={styles.autoTag}>
              <Ionicons name="sync" size={12} color="#B45309" style={{ marginRight: 4 }} />
              <Text style={styles.autoTagText}>AUTOMATIC RETURN CORRIDOR INVERSION</Text>
            </View>
          </View>
          <Text style={styles.returnRouteInstruction}>
            System searching available organization freights reversing the outbound route:
          </Text>
          <View style={styles.inversionVisual}>
            <View style={styles.inversionNode}>
              <Text style={styles.inversionLabel}>RETURN PICKUP</Text>
              <Text style={styles.inversionCity}>{originalShipment.destination}</Text>
            </View>
            <Ionicons name="repeat" size={20} color="#2563EB" style={{ marginHorizontal: 12 }} />
            <View style={styles.inversionNode}>
              <Text style={styles.inversionLabel}>RETURN DROPOFF</Text>
              <Text style={styles.inversionCity}>{originalShipment.origin}</Text>
            </View>
          </View>
        </View>

        {/* 3. MATCHING RETURN LOADS LIST */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Available Matching Return Loads</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{matchingShipments.length} Available</Text>
          </View>
        </View>

        {matchingShipments.length === 0 ? (
          <View style={styles.emptyResultsCard}>
            <Ionicons name="cube-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyResultsTitle}>No Matching Return Freights</Text>
            <Text style={styles.emptyResultsSub}>
              No organization has posted open loads from {originalShipment.destination} to {originalShipment.origin} right now. Please check back later or refresh.
            </Text>
          </View>
        ) : (
          matchingShipments.map((shipment) => {
            const isOurBidPending = shipment.bidStatus === 'PENDING';
            const isOurBidAccepted = shipment.bidStatus === 'ACCEPTED' || shipment.returnLoadStatus === 'ACCEPTED_BY_ORGANIZATION';
            const isOurBidRejected = shipment.bidStatus === 'REJECTED';

            return (
              <View key={shipment.id} style={[styles.card, isOurBidAccepted && styles.cardAccepted]}>
                {/* TOP ORG & AMOUNT */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.orgTag}>
                    <Ionicons name="business" size={13} color={colors.navy} style={{ marginRight: 4 }} />
                    <Text style={styles.orgTagText}>{shipment.organizationName}</Text>
                  </View>

                  <View style={styles.amountWrap}>
                    <Text style={styles.amountLabel}>Organization Amount</Text>
                    <Text style={styles.amountText}>₹{shipment.amount.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* SHIPMENT ID & ROUTE */}
                <View style={styles.shipmentMetaRow}>
                  <Text style={styles.returnShipmentId}>#{shipment.id}</Text>
                  <View style={styles.cargoPill}>
                    <Text style={styles.cargoPillText}>{shipment.cargoWeightKg.toLocaleString()} KG • {shipment.cargoType}</Text>
                  </View>
                </View>

                {/* ROUTE BOX */}
                <View style={styles.routeBox}>
                  <View style={styles.routeCol}>
                    <View style={styles.dotRow}>
                      <View style={styles.originDot} />
                      <Text style={styles.cityText}>{shipment.origin}</Text>
                    </View>
                    <Text style={styles.subAddressText} numberOfLines={1}>{shipment.originAddress}</Text>
                  </View>

                  <View style={styles.routeArrowCol}>
                    <Ionicons name="arrow-forward" size={14} color="#64748B" />
                    <Text style={styles.distanceText}>{shipment.distanceKm} KM</Text>
                  </View>

                  <View style={styles.routeCol}>
                    <View style={styles.dotRow}>
                      <View style={styles.destDot} />
                      <Text style={styles.cityText}>{shipment.destination}</Text>
                    </View>
                    <Text style={styles.subAddressText} numberOfLines={1}>{shipment.destinationAddress}</Text>
                  </View>
                </View>

                {/* BID STATUS DISPLAY */}
                {isOurBidPending && (
                  <View style={styles.bidStatusBoxPending}>
                    <View style={styles.bidHeaderRow}>
                      <View style={styles.bidBadgePending}>
                        <Ionicons name="time" size={12} color="#B45309" style={{ marginRight: 4 }} />
                        <Text style={styles.bidBadgePendingText}>BID SUBMITTED — WAITING APPROVAL</Text>
                      </View>
                      <Text style={styles.bidAmountValue}>Your Proposed Bid: ₹{(shipment.currentBidAmount || shipment.amount).toLocaleString('en-IN')}</Text>
                    </View>
                    <Text style={styles.bidNoticeText}>
                      Submitted to {shipment.organizationName}. Driver will be notified ONLY after organization approves your bid.
                    </Text>

                    {/* DEVELOPER SIMULATOR CONTROLS */}
                    <View style={styles.simRow}>
                      <Text style={styles.simLabel}>[Test Simulator]:</Text>
                      <TouchableOpacity
                        style={styles.simAcceptBtn}
                        onPress={() => handleSimulateAccept(shipment.id)}
                      >
                        <Text style={styles.simBtnText}>✓ Org Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.simRejectBtn}
                        onPress={() => handleSimulateReject(shipment.id)}
                      >
                        <Text style={styles.simBtnText}>✕ Org Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {isOurBidAccepted && (
                  <View style={styles.bidStatusBoxAccepted}>
                    <View style={styles.bidBadgeAccepted}>
                      <Ionicons name="checkmark-circle" size={14} color="#15803D" style={{ marginRight: 4 }} />
                      <Text style={styles.bidBadgeAcceptedText}>✓ RETURN LOAD CONFIRMED</Text>
                    </View>
                    <Text style={styles.confirmedAmountText}>
                      Agreed Rate: ₹{shipment.amount.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.confirmedDriverText}>
                      Assigned to: {assignedDriver?.name} • {assignedVehicle?.vehicleNumber} (Automated return link)
                    </Text>
                    <Text style={styles.confirmedSubNotice}>
                      🔔 Duty alert dispatched to driver's assignments inbox.
                    </Text>
                  </View>
                )}

                {isOurBidRejected && (
                  <View style={styles.bidStatusBoxRejected}>
                    <View style={styles.bidBadgeRejected}>
                      <Ionicons name="close-circle" size={12} color="#B91C1C" style={{ marginRight: 4 }} />
                      <Text style={styles.bidBadgeRejectedText}>BID DECLINED BY ORGANIZATION</Text>
                    </View>
                    <Text style={styles.rejectReasonText}>
                      Reason: {shipment.rejectionReason || 'Rate was not competitive.'}
                    </Text>
                  </View>
                )}

                {/* ACTIONS */}
                <View style={styles.cardActionsRow}>
                  {!isOurBidPending && !isOurBidAccepted && (
                    <TouchableOpacity
                      style={styles.placeBidBtn}
                      onPress={() => handleOpenBidModal(shipment)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="pricetag" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.placeBidBtnText}>
                        {isOurBidRejected ? 'Submit Revised Bid' : 'Place Return Load Bid'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isOurBidPending && (
                    <View style={styles.pendingActionBtnsRow}>
                      <TouchableOpacity
                        style={styles.editBidBtn}
                        onPress={() => handleOpenBidModal(shipment)}
                      >
                        <Ionicons name="pencil" size={13} color={colors.navy} style={{ marginRight: 4 }} />
                        <Text style={styles.editBidBtnText}>Edit Bid</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelBidBtn}
                        onPress={() => handleCancelBid(shipment.id)}
                      >
                        <Ionicons name="close" size={13} color="#DC2626" style={{ marginRight: 4 }} />
                        <Text style={styles.cancelBidBtnText}>Cancel Bid</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {isOurBidAccepted && (
                    <TouchableOpacity
                      style={styles.viewConfirmedBtn}
                      onPress={() => router.push(`/transport-office/shipments/${shipment.id}` as any)}
                    >
                      <Text style={styles.viewConfirmedBtnText}>View Return Shipment Details →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* BID PLACEMENT MODAL */}
      <Modal
        visible={!!selectedShipmentForBid}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedShipmentForBid(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="pricetag" size={22} color={colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Place Return Load Bid</Text>
                <Text style={styles.modalSub}>
                  Shipment #{selectedShipmentForBid?.id} • {selectedShipmentForBid?.organizationName}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedShipmentForBid(null)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalRouteSummary}>
              <Text style={styles.modalRouteText}>
                {selectedShipmentForBid?.origin} → {selectedShipmentForBid?.destination} ({selectedShipmentForBid?.cargoWeightKg.toLocaleString()} KG)
              </Text>
              <Text style={styles.modalOfferedRate}>
                Shipper Listed Amount: ₹{selectedShipmentForBid?.amount.toLocaleString('en-IN')}
              </Text>
            </View>

            <Text style={styles.inputLabel}>Proposed Return Load Rate (in INR ₹)</Text>
            <View style={styles.bidInputWrap}>
              <Text style={styles.rupeePrefix}>₹</Text>
              <TextInput
                style={styles.bidInput}
                placeholder="e.g. 16500"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={bidAmountInput}
                onChangeText={(val) => {
                  setBidAmountInput(val);
                  if (bidError) setBidError('');
                }}
              />
            </View>

            {/* QUICK PRESET CHIPS */}
            {selectedShipmentForBid && (
              <View style={styles.presetChipsRow}>
                {[
                  { label: 'Exact Rate', val: selectedShipmentForBid.amount },
                  { label: '-5% Discount', val: Math.round(selectedShipmentForBid.amount * 0.95) },
                  { label: '-10% Discount', val: Math.round(selectedShipmentForBid.amount * 0.90) },
                ].map((chip) => (
                  <TouchableOpacity
                    key={chip.label}
                    style={styles.presetChip}
                    onPress={() => setBidAmountInput(String(chip.val))}
                  >
                    <Text style={styles.presetChipText}>{chip.label} (₹{chip.val.toLocaleString('en-IN')})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {bidError.length > 0 && <Text style={styles.modalErrorText}>{bidError}</Text>}

            {/* MANDATORY BUSINESS RULE WARNING */}
            <View style={styles.modalRuleNotice}>
              <Ionicons name="shield-checkmark" size={16} color="#2563EB" style={{ marginRight: 6, marginTop: 1 }} />
              <Text style={styles.modalRuleNoticeText}>
                <Text style={{ fontWeight: '700' }}>Strict Business Rule:</Text> Driver {assignedDriver?.name} will NOT be notified before {selectedShipmentForBid?.organizationName} accepts this bid.
              </Text>
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setSelectedShipmentForBid(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSubmitBid}
              >
                <Ionicons name="paper-plane" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalSubmitBtnText}>Submit Bid</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 40,
    gap: spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardAccepted: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeOutbound: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  badgeOutboundText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  shipmentIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.navy,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  routeCol: {
    flex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
    marginRight: 4,
  },
  destDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  cityText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  subAddressText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  routeArrowCol: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  driverFleetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: spacing.xs,
  },
  fleetCol: {
    flex: 1,
  },
  fleetLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  fleetValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  fleetSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  returnRouteBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  returnRouteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  autoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  autoTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  returnRouteInstruction: {
    fontSize: 11,
    color: '#78350F',
    marginVertical: 4,
  },
  inversionVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: 4,
  },
  inversionNode: {
    alignItems: 'center',
    flex: 1,
  },
  inversionLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  inversionCity: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
    marginTop: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  countPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  countPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyResultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyResultsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginTop: spacing.sm,
  },
  emptyResultsSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  orgTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  orgTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.navy,
  },
  shipmentMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  returnShipmentId: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.navy,
  },
  cargoPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  cargoPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  bidStatusBoxPending: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: spacing.xs,
  },
  bidHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bidBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidBadgePendingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  bidAmountValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  bidNoticeText: {
    fontSize: 10,
    color: '#78350F',
    lineHeight: 14,
  },
  simRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
  },
  simLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  simAcceptBtn: {
    backgroundColor: '#15803D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  simRejectBtn: {
    backgroundColor: '#B91C1C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  simBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bidStatusBoxAccepted: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginVertical: spacing.xs,
  },
  bidBadgeAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  bidBadgeAcceptedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  confirmedAmountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 2,
  },
  confirmedDriverText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    marginTop: 2,
  },
  confirmedSubNotice: {
    fontSize: 10,
    color: '#166534',
    marginTop: 4,
  },
  bidStatusBoxRejected: {
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginVertical: spacing.xs,
  },
  bidBadgeRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  bidBadgeRejectedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B91C1C',
  },
  rejectReasonText: {
    fontSize: 10,
    color: '#991B1B',
  },
  cardActionsRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  placeBidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
    height: 38,
  },
  placeBidBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pendingActionBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    height: 36,
  },
  editBidBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  cancelBidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    height: 36,
  },
  cancelBidBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  viewConfirmedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15803D',
    borderRadius: radius.md,
    height: 38,
  },
  viewConfirmedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 440,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  modalRouteSummary: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  modalRouteText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  modalOfferedRate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 4,
  },
  bidInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    marginBottom: spacing.xs,
  },
  rupeePrefix: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginRight: 6,
  },
  bidInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  presetChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  modalErrorText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  modalRuleNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modalRuleNoticeText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 15,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalSubmitBtn: {
    flex: 2,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
  },
  modalSubmitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  primaryActionBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  primaryActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
