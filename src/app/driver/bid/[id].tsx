import React, { useState } from 'react';
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
import { StatusBadge } from '@/components/driver/StatusBadge';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

export default function BidDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bids, withdrawBid } = useDriver();
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const bid = bids.find((b) => b.id === id);

  if (!bid) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bid Not Found</Text>
        </View>
        <View style={styles.notFoundCenter}>
          <Text style={styles.notFoundText}>This bid record could not be found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back to Bids</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const handleConfirmWithdraw = () => {
    withdrawBid(bid.id);
    setWithdrawModalVisible(false);
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{bid.id}</Text>
          <Text style={styles.headerSubtitle}>Shipment Quote Details</Text>
        </View>
        <StatusBadge status={bid.status} size="sm" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.label}>Bid Status</Text>
              <Text style={styles.statusTitle}>{bid.status.replace(/_/g, ' ')}</Text>
            </View>
            <StatusBadge status={bid.status} size="md" />
          </View>
          <Text style={styles.statusExplainer}>
            {bid.status === 'PENDING' &&
              'Your quote has been delivered to the shipper. You will be notified once a selection decision is made.'}
            {bid.status === 'ACCEPTED' &&
              'Congratulations! The shipper selected your quote. Assignment has been created in Trips.'}
            {bid.status === 'REJECTED' &&
              'The shipper chose another vehicle quote for this particular load.'}
            {bid.status === 'WITHDRAWN' &&
              'You have retracted this quote. No further action is required.'}
            {bid.status === 'EXPIRED' &&
              'The bidding deadline for this shipment closed before selection.'}
          </Text>
        </View>

        {/* Pricing Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Financial Terms</Text>

          <View style={styles.financeGrid}>
            <View style={styles.financeBox}>
              <Text style={styles.financeLabel}>Your Submitted Quote</Text>
              <Text style={styles.myQuoteAmount}>₹{bid.bidAmount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.financeBox}>
              <Text style={styles.financeLabel}>Shipper Target Budget</Text>
              <Text style={styles.targetAmount}>₹{bid.targetPayment.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Submission Time</Text>
            <Text style={styles.detailValue}>{bid.submittedAt}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Pickup Arrival</Text>
            <Text style={styles.detailValue}>{bid.estimatedPickupDate}</Text>
          </View>
        </View>

        {/* Shipment & Route Details */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Shipment & Route</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shipment Reference</Text>
            <Text style={styles.detailValueBold}>{bid.shipmentNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Route Corridor</Text>
            <Text style={styles.detailValueBold}>{bid.route}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cargo Type</Text>
            <Text style={styles.detailValue}>{bid.cargoType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payload Weight</Text>
            <Text style={styles.detailValue}>{(bid.weightKg / 1000).toFixed(1)} Tonnes</Text>
          </View>

          <TouchableOpacity
            style={styles.viewShipmentAction}
            onPress={() => router.push(`/driver/shipment/${bid.shipmentId}` as any)}
          >
            <Text style={styles.viewShipmentActionText}>View Full Shipment Details</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.blue} />
          </TouchableOpacity>
        </View>

        {/* Message to Shipper */}
        {bid.notes && (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Notes Attached to Quote</Text>
            <Text style={styles.notesText}>{bid.notes}</Text>
          </View>
        )}

        {/* Shipper Details */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Shipper Entity</Text>
          <Text style={styles.shipperName}>{bid.shipperCompany}</Text>
          <Text style={styles.shipperContact}>Contact Person: {bid.shipperName}</Text>
        </View>

        {/* Withdraw Action if Pending */}
        {bid.status === 'PENDING' && (
          <TouchableOpacity
            style={styles.withdrawBtn}
            onPress={() => setWithdrawModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.withdrawBtnText}>Withdraw Quote</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Confirm Withdraw Modal */}
      <ConfirmModal
        visible={withdrawModalVisible}
        title="Withdraw Quote?"
        message="Are you sure you want to withdraw this quote? The shipper will no longer see your submission."
        confirmText="Withdraw Bid"
        cancelText="Keep Bid"
        confirmVariant="outline"
        iconName="close-circle-outline"
        iconColor="#DC2626"
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setWithdrawModalVisible(false)}
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
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  statusExplainer: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  financeGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  financeBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  financeLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  myQuoteAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  targetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.slate,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '500',
  },
  detailValueBold: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: 'bold',
  },
  viewShipmentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  viewShipmentActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  notesText: {
    fontSize: 12,
    color: colors.slate,
    lineHeight: 18,
  },
  shipperName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  shipperContact: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  withdrawBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
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
