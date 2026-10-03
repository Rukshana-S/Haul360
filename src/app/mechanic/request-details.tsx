import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { ErrorState } from '@/components/ui/ErrorState';
import { useMechanic } from '@/context/MechanicContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, acceptRequest, rejectRequest, repairs } = useMechanic();

  const req = requests.find((r) => r.id === id) || requests[0];
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  if (!req) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Details</Text>
        </View>
        <ErrorState
          title="Request Not Found"
          message="The requested service ticket does not exist or has expired."
          onRetry={() => router.replace('/mechanic/requests')}
        />
      </Screen>
    );
  }

  const isEmergency = !!req.isEmergency || req.urgency === 'SOS';
  const isPending = req.status === 'PENDING' || req.status === 'Pending';
  const isAccepted = req.status === 'ACCEPTED' || req.status === 'Accepted';
  const isRejected = req.status === 'REJECTED' || req.status === 'Rejected';

  const handleAccept = async () => {
    const createdRepairId = await acceptRequest(req.id);
    setLocalFeedback('Request accepted! Routing to active repair workspace...');
    setTimeout(() => {
      router.push(`/mechanic/repair-details?id=${createdRepairId}` as any);
    }, 400);
  };

  const handleReject = async () => {
    await rejectRequest(req.id);
    setLocalFeedback('Request declined. Returning to requests queue...');
    setTimeout(() => {
      router.push('/mechanic/requests');
    }, 400);
  };

  const associatedRepair = repairs.find(
    (rep) => rep.id === `REP-${req.id.replace('REQ-', '')}`
  ) || repairs[0];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back to requests"
        >
          <Ionicons name="arrow-back" size={22} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Service Request Details</Text>
          <Text style={styles.headerSub}>Ticket #{req.id}</Text>
        </View>
        <View
          style={[
            styles.statusBadgeTop,
            isAccepted && styles.statusBadgeAccepted,
            isRejected && styles.statusBadgeRejected,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeTextTop,
              isAccepted && styles.statusBadgeTextAccepted,
              isRejected && styles.statusBadgeTextRejected,
            ]}
          >
            {req.status}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency SOS Protocol Banner */}
        {isEmergency && (
          <View style={styles.sosBanner}>
            <View style={styles.sosBannerHeader}>
              <View style={styles.sosProtocolBadge}>
                <Ionicons name="warning" size={12} color="#DC2626" style={{ marginRight: 4 }} />
                <Text style={styles.sosProtocolText}>HIGHWAY SOS EMERGENCY</Text>
              </View>
              <View style={styles.liveTimerPill}>
                <Ionicons name="time-outline" size={12} color="#DC2626" style={{ marginRight: 3 }} />
                <Text style={styles.liveTimerText}>{req.timeRequested}</Text>
              </View>
            </View>
            <Text style={styles.sosWarningDesc}>
              Priority dispatch active. Stranded on highway shoulder under heavy vehicle traffic.
            </Text>
          </View>
        )}

        {/* Location & Distance Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="navigate-circle-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Location & Response Distance</Text>
            </View>
            <View style={styles.etaBadge}>
              <Text style={styles.etaBadgeText}>{req.distance}</Text>
            </View>
          </View>

          <View style={styles.locationBox}>
            <Ionicons name="location" size={16} color={colors.orange} style={{ marginRight: 6, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.locationAddress}>{req.location}</Text>
              <Text style={styles.locationSub}>Corridor Node: NH-48 Express Highway</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="car-sport-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Vehicle Information</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{req.vehicleType}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Model</Text>
            <Text style={styles.infoValue}>{req.vehicle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Configuration</Text>
            <Text style={styles.infoValue}>{req.vehicleType}</Text>
          </View>
        </View>

        {/* Driver / Customer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="person-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Driver / Fleet Operator</Text>
            </View>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={11} color="#92400E" style={{ marginRight: 2 }} />
              <Text style={styles.ratingText}>4.8 Verified</Text>
            </View>
          </View>

          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#64748B" />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{req.driver}</Text>
              <Text style={styles.driverSub}>Haul360 Verified Fleet Driver</Text>
            </View>
          </View>
        </View>

        {/* Service / Problem Reported Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Reported Failure & Service</Text>
            </View>
          </View>

          <View style={styles.problemBox}>
            <Text style={styles.problemDesc}>"{req.service}"</Text>
          </View>
        </View>

        {/* Estimated Payment Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="wallet-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Tariff & Earnings Estimate</Text>
            </View>
            <Text style={styles.estimateLabel}>Guaranteed SLA</Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountTitle}>Estimated Total Payment</Text>
            <Text style={styles.amountValue}>{req.amount}</Text>
            <Text style={styles.amountNote}>Direct settlement upon job sign-off</Text>
          </View>
        </View>

        {/* Feedback Message (Only shown after active button press) */}
        {localFeedback && (
          <View style={styles.feedbackBox}>
            <Ionicons name="information-circle-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
            <Text style={styles.feedbackText}>{localFeedback}</Text>
          </View>
        )}

        {/* Action Buttons for PENDING state */}
        {isPending && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={handleReject}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Decline service request"
            >
              <Ionicons name="close-circle-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.rejectBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAccept}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Accept service request"
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.acceptBtnText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action button for ACCEPTED state */}
        {isAccepted && (
          <TouchableOpacity
            style={styles.viewJobBtn}
            onPress={() => router.push(`/mechanic/repair-details?id=${associatedRepair.id}` as any)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open active repair ticket"
          >
            <Ionicons name="construct-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.viewJobBtnText}>Go to Active Repair Ticket #{associatedRepair.id}</Text>
          </TouchableOpacity>
        )}

        {/* Action button for REJECTED state */}
        {isRejected && (
          <TouchableOpacity
            style={styles.backQueueBtn}
            onPress={() => router.push('/mechanic/requests')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Back to requests queue"
          >
            <Ionicons name="arrow-back" size={16} color={colors.navy} style={{ marginRight: 6 }} />
            <Text style={styles.backQueueBtnText}>Back to Requests Queue</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
    marginRight: spacing.sm,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusBadgeTop: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeAccepted: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeTextTop: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  statusBadgeTextAccepted: {
    color: '#166534',
  },
  statusBadgeTextRejected: {
    color: '#991B1B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sosBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  sosBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sosProtocolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sosProtocolText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  liveTimerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveTimerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  sosWarningDesc: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  etaBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  etaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  typeBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3730A3',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 8,
  },
  locationAddress: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  locationSub: {
    fontSize: 11,
    color: '#64748B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  driverSub: {
    fontSize: 11,
    color: '#64748B',
  },
  problemBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: 8,
  },
  problemDesc: {
    fontSize: 13,
    color: colors.navy,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  estimateLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  amountBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  amountTitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  amountNote: {
    fontSize: 11,
    color: colors.green,
    fontWeight: '600',
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  feedbackText: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  viewJobBtn: {
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  viewJobBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  backQueueBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: spacing.xs,
  },
  backQueueBtnText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '700',
  },
});
