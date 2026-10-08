import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
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

export default function ShipmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { shipments, returnLoads, bids, placeBid, vehicle } = useDriver();

  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [bidNotesInput, setBidNotesInput] = useState('');
  const [bidEtaInput, setBidEtaInput] = useState('Tomorrow, 08:00 AM');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Find shipment in standard shipments or return loads
  const shipment = useMemo(() => {
    return (
      shipments.find((s) => s.id === id) ||
      returnLoads.find((r) => r.id === id) ||
      null
    );
  }, [shipments, returnLoads, id]);

  // Existing bid on this shipment
  const existingBid = useMemo(() => {
    return bids.find((b) => b.shipmentId === id && b.status !== 'WITHDRAWN');
  }, [bids, id]);

  if (!shipment) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipment Not Found</Text>
        </View>
        <View style={styles.notFoundCenter}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundText}>This shipment opportunity is no longer available.</Text>
          <TouchableOpacity style={styles.backBtnAction} onPress={() => router.back()}>
            <Text style={styles.backBtnActionText}>Back to Shipments</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const handleOpenBidModal = () => {
    setBidAmountInput(shipment.expectedPayment.toString());
    setBidModalVisible(true);
  };

  const handlePreSubmitBid = () => {
    const amount = parseFloat(bidAmountInput);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount in Rupees.');
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleConfirmBid = () => {
    setIsSubmitting(true);
    const amount = parseFloat(bidAmountInput);
    setTimeout(() => {
      const res = placeBid(shipment.id, amount, bidNotesInput, bidEtaInput);
      setIsSubmitting(false);
      setConfirmModalVisible(false);
      setBidModalVisible(false);
      if (res.success) {
        setSuccessMessage('Your bid has been placed successfully!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        Alert.alert('Bid Error', res.message);
      }
    }, 600);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Top App Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>{shipment.shipmentNumber}</Text>
          <Text style={styles.headerSubtitle}>Freight Load Specification</Text>
        </View>
        <StatusBadge status={shipment.status} size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {successMessage && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#15803D" />
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        )}

        {/* Existing Bid Banner */}
        {existingBid && (
          <View style={styles.existingBidBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.existingBidTitle}>Active Quote Placed: ₹{existingBid.bidAmount.toLocaleString('en-IN')}</Text>
              <Text style={styles.existingBidSub}>Status: {existingBid.status} • Submitted {existingBid.submittedAt}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewBidBtn}
              onPress={() => router.push(`/driver/bid/${existingBid.id}` as any)}
            >
              <Text style={styles.viewBidBtnText}>View Bid</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.cargoTitle}>{shipment.title}</Text>
          <View style={styles.payoutHighlightRow}>
            <View>
              <Text style={styles.payoutAmount}>₹{shipment.expectedPayment.toLocaleString('en-IN')}</Text>
              <Text style={styles.payoutLabel}>Shipper Target Budget</Text>
            </View>
            <View style={styles.bidsCountBadge}>
              <Ionicons name="people-outline" size={14} color={colors.navy} />
              <Text style={styles.bidsCountText}>{shipment.currentBidCount} Bids Placed</Text>
            </View>
          </View>
        </View>

        {/* Route Details Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Route Corridor & Waypoints</Text>

          <View style={styles.routeTimeline}>
            {/* Origin */}
            <View style={styles.timelineItem}>
              <View style={styles.originMarker} />
              <View style={styles.timelineContent}>
                <Text style={styles.nodeLabel}>PICKUP LOCATION</Text>
                <Text style={styles.nodeCity}>{shipment.pickupLocation.city}, {shipment.pickupLocation.state}</Text>
                <Text style={styles.nodeAddress}>{shipment.pickupLocation.address}</Text>
                {shipment.pickupLocation.landmark && (
                  <Text style={styles.landmarkText}>Landmark: {shipment.pickupLocation.landmark}</Text>
                )}
                <Text style={styles.nodeTime}>Scheduled Pickup: {shipment.pickupDate}</Text>
              </View>
            </View>

            <View style={styles.connectingLine} />

            {/* Destination */}
            <View style={styles.timelineItem}>
              <View style={styles.destMarker} />
              <View style={styles.timelineContent}>
                <Text style={styles.nodeLabel}>DELIVERY DESTINATION</Text>
                <Text style={styles.nodeCity}>{shipment.destinationLocation.city}, {shipment.destinationLocation.state}</Text>
                <Text style={styles.nodeAddress}>{shipment.destinationLocation.address}</Text>
                <Text style={styles.nodeTime}>Deadline: {shipment.deliveryDeadline}</Text>
              </View>
            </View>
          </View>

          <View style={styles.distanceBadgeRow}>
            <View style={styles.miniStat}>
              <Ionicons name="speedometer-outline" size={15} color={colors.textSecondary} />
              <Text style={styles.miniStatText}>Distance: {shipment.distanceKm} km</Text>
            </View>
            <View style={styles.miniStat}>
              <Ionicons name="time-outline" size={15} color={colors.orange} />
              <Text style={styles.miniStatText}>Bid Closes: {shipment.bidDeadline}</Text>
            </View>
          </View>
        </View>

        {/* Cargo & Vehicle Requirements */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Cargo & Equipment Specs</Text>

          <View style={styles.specGrid}>
            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Cargo Type</Text>
              <Text style={styles.specBoxValue}>{shipment.cargoType}</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Weight</Text>
              <Text style={styles.specBoxValue}>{(shipment.weightKg / 1000).toFixed(1)} Metric Tonnes</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Required Truck</Text>
              <Text style={styles.specBoxValue}>{shipment.vehicleTypeRequired}</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Capacity Fit</Text>
              <Text style={[styles.specBoxValue, { color: colors.green }]}>
                Matches Your {vehicle.capacityTons}T Truck
              </Text>
            </View>
          </View>

          {shipment.specialInstructions && (
            <View style={styles.instructionsBox}>
              <Ionicons name="information-circle-outline" size={18} color={colors.navy} />
              <Text style={styles.instructionsText}>{shipment.specialInstructions}</Text>
            </View>
          )}
        </View>

        {/* Shipper Organization Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Shipper Details</Text>
          <View style={styles.shipperRow}>
            <View style={styles.shipperAvatar}>
              <Ionicons name="business" size={24} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shipperCompanyName}>{shipment.shipperCompany}</Text>
              <Text style={styles.shipperContactName}>Contact: {shipment.shipperName}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={colors.orange} />
                <Text style={styles.ratingText}>{shipment.shipperRating} / 5.0 Shipper Score</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Bid Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomBarLabel}>Target Payout</Text>
          <Text style={styles.bottomBarAmount}>₹{shipment.expectedPayment.toLocaleString('en-IN')}</Text>
        </View>

        {existingBid ? (
          <TouchableOpacity
            style={[styles.bidActionButton, { backgroundColor: colors.blue }]}
            onPress={() => router.push(`/driver/bid/${existingBid.id}` as any)}
          >
            <Text style={styles.bidActionButtonText}>View My Quote</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.bidActionButton}
            onPress={handleOpenBidModal}
          >
            <Ionicons name="pricetag" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.bidActionButtonText}>Place Custom Bid</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Place Bid Modal */}
      <Modal
        visible={bidModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBidModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Place Bid Quote</Text>
              <TouchableOpacity onPress={() => setBidModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              {shipment.shipmentNumber} • {shipment.pickupLocation.city} → {shipment.destinationLocation.city}
            </Text>

            {/* Quick Preset Buttons */}
            <Text style={styles.inputSectionLabel}>Proposed Total Rate (₹ INR)</Text>
            <View style={styles.presetRow}>
              {[
                shipment.expectedPayment - 1500,
                shipment.expectedPayment,
                shipment.expectedPayment + 1500,
                shipment.expectedPayment + 3000,
              ].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetBtn,
                    bidAmountInput === val.toString() && styles.presetBtnActive,
                  ]}
                  onPress={() => setBidAmountInput(val.toString())}
                >
                  <Text
                    style={[
                      styles.presetText,
                      bidAmountInput === val.toString() && styles.presetTextActive,
                    ]}
                  >
                    ₹{(val / 1000).toFixed(1)}k
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={bidAmountInput}
                onChangeText={setBidAmountInput}
                placeholder="Enter amount"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={styles.inputSectionLabel}>Estimated Pickup Time</Text>
            <TextInput
              style={styles.modalTextInput}
              value={bidEtaInput}
              onChangeText={setBidEtaInput}
              placeholder="e.g. Tomorrow, 08:00 AM"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputSectionLabel}>Message to Shipper (Optional)</Text>
            <TextInput
              style={[styles.modalTextInput, { height: 60, textAlignVertical: 'top' }]}
              multiline
              value={bidNotesInput}
              onChangeText={setBidNotesInput}
              placeholder="e.g. Verified 10T Tata truck with weatherproof tarpaulin."
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity
              style={styles.submitBidBtn}
              onPress={handlePreSubmitBid}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBidBtnText}>Submit Quote to Shipper</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirm Bid Submission"
        message={`Are you sure you want to submit a bid of ₹${parseFloat(bidAmountInput || '0').toLocaleString('en-IN')} for ${shipment.shipmentNumber}?`}
        confirmText="Submit Bid"
        cancelText="Review"
        loading={isSubmitting}
        iconName="pricetag-outline"
        iconColor={colors.navy}
        onConfirm={handleConfirmBid}
        onCancel={() => setConfirmModalVisible(false)}
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
  headerTitleCol: {
    flex: 1,
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  successBannerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803D',
  },
  existingBidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  existingBidTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.blue,
  },
  existingBidSub: {
    fontSize: 11,
    color: colors.slate,
    marginTop: 2,
  },
  viewBidBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  viewBidBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cargoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  payoutHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  payoutAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.navy,
  },
  payoutLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bidsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  bidsCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
    letterSpacing: 0.3,
  },
  routeTimeline: {
    paddingVertical: spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  originMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
    marginTop: 4,
    marginRight: spacing.md,
  },
  destMarker: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.green,
    marginTop: 4,
    marginRight: spacing.md,
  },
  connectingLine: {
    width: 2,
    height: 36,
    backgroundColor: '#CBD5E1',
    marginLeft: 5,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
  },
  nodeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  nodeCity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 1,
  },
  nodeAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  landmarkText: {
    fontSize: 11,
    color: colors.blue,
    marginTop: 2,
  },
  nodeTime: {
    fontSize: 11,
    color: colors.slate,
    fontWeight: '500',
    marginTop: 4,
  },
  distanceBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniStatText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  specBoxLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  specBoxValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  instructionsBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: colors.navy,
    lineHeight: 18,
  },
  shipperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  shipperAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shipperCompanyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  shipperContactName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.orange,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)',
    elevation: 8,
  },
  bottomBarLeft: {},
  bottomBarLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bottomBarAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  bidActionButton: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  bidActionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: typography.sizes.heading3,
    fontWeight: typography.weights.bold as any,
    color: colors.navy,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  inputSectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: colors.navy,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate,
  },
  presetTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    backgroundColor: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginRight: 6,
  },
  modalInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    paddingVertical: 0,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 13,
    color: colors.navy,
    marginBottom: spacing.sm,
    backgroundColor: '#F8FAFC',
  },
  submitBidBtn: {
    backgroundColor: colors.navy,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  submitBidBtnText: {
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
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  backBtnAction: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  backBtnActionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
