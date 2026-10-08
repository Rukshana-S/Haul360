import React, { useState } from 'react';
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

export default function ReturnLoadDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { returnLoads, bids, placeBid, vehicle } = useDriver();

  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [bidNotesInput, setBidNotesInput] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = returnLoads.find((r) => r.id === id) || returnLoads[0];

  const existingBid = bids.find(
    (b) => b.shipmentId === load?.id && b.status !== 'WITHDRAWN'
  );

  if (!load) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Return Load Not Found</Text>
        </View>
      </Screen>
    );
  }

  const handleOpenBid = () => {
    setBidAmountInput(load.expectedPayment.toString());
    setBidModalVisible(true);
  };

  const handleConfirmBid = () => {
    setIsSubmitting(true);
    const amount = parseFloat(bidAmountInput);
    setTimeout(() => {
      const res = placeBid(load.id, amount, bidNotesInput || 'Return trip capacity available.');
      setIsSubmitting(false);
      setConfirmModalVisible(false);
      setBidModalVisible(false);
      if (res.success) {
        Alert.alert('Return Quote Placed', 'Your return load quote has been sent to the shipper.');
      }
    }, 500);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{load.shipmentNumber}</Text>
          <Text style={styles.headerSubtitle}>Return Load Opportunity</Text>
        </View>
        <View style={styles.matchBadge}>
          <Ionicons name="sparkles" size={12} color="#B45309" />
          <Text style={styles.matchText}>{load.matchScore}% Match</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recommendation Criteria Box */}
        <View style={styles.recommendationBox}>
          <Text style={styles.recBoxTitle}>Why this return load is recommended for you:</Text>
          {load.matchReasons.map((reason, idx) => (
            <View key={idx} style={styles.reasonRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.green} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>

        {/* Load Summary Hero */}
        <View style={styles.card}>
          <Text style={styles.titleText}>{load.title}</Text>
          <View style={styles.payoutRow}>
            <View>
              <Text style={styles.payoutAmount}>₹{load.expectedPayment.toLocaleString('en-IN')}</Text>
              <Text style={styles.payoutSub}>Expected Return Payout</Text>
            </View>
            <StatusBadge status={load.status} size="sm" />
          </View>
        </View>

        {/* Route Details */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Return Route Corridor</Text>

          <View style={styles.routeBox}>
            <View style={styles.routeItem}>
              <Text style={styles.routeLabel}>PICKUP ({load.pickupDistanceKm} km from delivery)</Text>
              <Text style={styles.cityText}>{load.pickupLocation.city}</Text>
              <Text style={styles.addressText}>{load.pickupLocation.address}</Text>
              <Text style={styles.timeText}>Pickup: {load.pickupDate}</Text>
            </View>

            <View style={styles.routeDivider} />

            <View style={styles.routeItem}>
              <Text style={styles.routeLabel}>BASE / DESTINATION</Text>
              <Text style={styles.cityText}>{load.destinationLocation.city}</Text>
              <Text style={styles.addressText}>{load.destinationLocation.address}</Text>
              <Text style={styles.timeText}>Delivery: {load.deliveryDeadline}</Text>
            </View>
          </View>
        </View>

        {/* Cargo & Truck fit */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Cargo & Equipment</Text>
          <View style={styles.grid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Cargo</Text>
              <Text style={styles.gridValue}>{load.cargoType}</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Weight</Text>
              <Text style={styles.gridValue}>{(load.weightKg / 1000).toFixed(1)}T / {vehicle.capacityTons}T Truck</Text>
            </View>
          </View>

          {load.specialInstructions && (
            <View style={styles.instBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.navy} />
              <Text style={styles.instText}>{load.specialInstructions}</Text>
            </View>
          )}
        </View>

        {/* Shipper Details */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Shipper Entity</Text>
          <Text style={styles.shipperName}>{load.shipperCompany}</Text>
          <Text style={styles.shipperContact}>Contact: {load.shipperName} • {load.shipperRating}★ Rating</Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Return Payout</Text>
          <Text style={styles.bottomAmount}>₹{load.expectedPayment.toLocaleString('en-IN')}</Text>
        </View>

        {existingBid ? (
          <TouchableOpacity
            style={[styles.bidBtn, { backgroundColor: colors.blue }]}
            onPress={() => router.push(`/driver/bid/${existingBid.id}` as any)}
          >
            <Text style={styles.bidBtnText}>View My Quote</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.bidBtn}
            onPress={handleOpenBid}
          >
            <Ionicons name="pricetag" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.bidBtnText}>Place Return Quote</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bid Modal */}
      <Modal
        visible={bidModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBidModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Place Return Load Quote</Text>
              <TouchableOpacity onPress={() => setBidModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSub}>
              {load.shipmentNumber} • {load.pickupLocation.city} → {load.destinationLocation.city}
            </Text>

            <Text style={styles.inputLabel}>Quote Amount (₹ INR)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefix}>₹</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={bidAmountInput}
                onChangeText={setBidAmountInput}
              />
            </View>

            <Text style={styles.inputLabel}>Note to Shipper</Text>
            <TextInput
              style={styles.textInput}
              value={bidNotesInput}
              onChangeText={setBidNotesInput}
              placeholder="e.g. Empty 10T Tata truck available immediately."
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => setConfirmModalVisible(true)}
            >
              <Text style={styles.submitBtnText}>Submit Return Quote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Submit Return Quote?"
        message={`Confirm quote of ₹${parseFloat(bidAmountInput || '0').toLocaleString('en-IN')} for ${load.shipmentNumber}?`}
        confirmText="Submit Quote"
        cancelText="Cancel"
        loading={isSubmitting}
        iconName="sparkles"
        iconColor={colors.orange}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  matchText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B45309',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 90,
  },
  recommendationBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  recBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 2,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 12,
    color: '#78350F',
    fontWeight: '500',
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: spacing.xs,
  },
  payoutAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.navy,
  },
  payoutSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  routeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  routeItem: {
    paddingVertical: 2,
  },
  routeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  cityText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 1,
  },
  addressText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: 11,
    color: colors.slate,
    fontWeight: '500',
    marginTop: 2,
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gridBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  gridLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  instBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  instText: {
    fontSize: 11,
    color: colors.navy,
    flex: 1,
  },
  shipperName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  shipperContact: {
    fontSize: 11,
    color: colors.textSecondary,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  bottomAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  bidBtn: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  bidBtnText: {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sheetSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.sm,
  },
  prefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    paddingVertical: 0,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 13,
    color: colors.navy,
    marginBottom: spacing.md,
  },
  submitBtn: {
    backgroundColor: colors.navy,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
