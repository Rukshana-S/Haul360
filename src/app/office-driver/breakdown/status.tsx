import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { BreakdownStatus } from '@/constants/transportOfficeMockData';

const DRIVER_MECH_STAGES: Array<{ key: BreakdownStatus; title: string; desc: string }> = [
  { key: 'MECHANIC_REQUESTED', title: 'Request Sent', desc: 'Dispatch contacted nearest mechanic' },
  { key: 'MECHANIC_ACCEPTED', title: 'Mechanic Accepted', desc: 'Assistance confirmed & dispatched' },
  { key: 'MECHANIC_ON_WAY', title: 'Mechanic On The Way', desc: 'Service van en route on highway' },
  { key: 'MECHANIC_ARRIVED', title: 'Mechanic Arrived', desc: 'Technician on-site at vehicle' },
  { key: 'DIAGNOSING', title: 'Diagnosing Problem', desc: 'Running diagnostic inspection' },
  { key: 'REPAIRING', title: 'Repair In Progress', desc: 'Fixing parts & tuning components' },
  { key: 'REPAIRED', title: 'Repair Completed', desc: 'Vehicle tested and ready for haul' },
  { key: 'RESOLVED', title: 'Resolved & Clear', desc: 'Trip ready to resume' },
];

export default function DriverBreakdownStatusScreen() {
  const {
    currentDriverUser,
    breakdowns,
    resumeTripAfterBreakdown,
    rateMechanicService,
  } = useTransportOffice();

  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSuccessMsg, setRatingSuccessMsg] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/office-driver/trips/current' as any);
    }
  };

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  const incident = breakdowns.find(
    (b) => b.driverId === driverId
  ) || breakdowns[0];

  if (!incident) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-checkmark-outline" size={48} color={colors.green} />
          <Text style={styles.emptyTitle}>No Active Roadside Incident</Text>
          <Button
            title="Back to Active Trip"
            onPress={handleBack}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Screen>
    );
  }

  const isRepaired = incident.status === 'REPAIRED' || incident.status === 'RESOLVED';
  const currentStageIndex = DRIVER_MECH_STAGES.findIndex((s) => s.key === incident.status);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const handleResumeTrip = () => {
    resumeTripAfterBreakdown(incident.id);
    router.replace('/office-driver/trips/current' as any);
  };

  const handleSubmitRating = () => {
    if (selectedRating < 1 || selectedRating > 5) return;
    const res = rateMechanicService(incident.id, selectedRating, ratingComment.trim());
    if (res.success) {
      setRatingSuccessMsg('Mechanic Rated Successfully');
      setTimeout(() => {
        setRatingSuccessMsg(null);
        setShowRateModal(false);
      }, 900);
    }
  };

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
          <Text style={styles.headerTitle}>Roadside Assistance Tracker</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* HERO STATUS BANNER */}
        <View style={[styles.heroCard, isRepaired && styles.heroCardRepaired]}>
          <View style={styles.heroHeader}>
            <View style={[styles.statusBadge, isRepaired && { backgroundColor: '#DCFCE7' }]}>
              <Ionicons
                name={isRepaired ? 'checkmark-circle' : 'warning'}
                size={14}
                color={isRepaired ? colors.green : '#B91C1C'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.statusBadgeText, isRepaired && { color: colors.green }]}>
                {isRepaired ? 'REPAIR COMPLETED' : 'ROADSIDE ASSIST ACTIVE'}
              </Text>
            </View>
            <Text style={styles.reportedTime}>{incident.reportedAt}</Text>
          </View>

          <Text style={styles.issueTitle}>{incident.issueType}</Text>
          <Text style={styles.locationText}>
            <Ionicons name="location-outline" size={13} color="#7F1D1D" /> {incident.location}
          </Text>

          <Text style={styles.noticeText}>
            Your transport office dispatch and attending mechanic are coordinating on this incident.
          </Text>
        </View>

        {/* READ ONLY TRACKING NOTICE */}
        <View style={styles.readOnlyNotice}>
          <Ionicons name="information-circle" size={18} color={colors.blue} style={{ marginRight: 6 }} />
          <Text style={styles.readOnlyNoticeText}>
            Mechanic assistance is tracked in real-time. Status updates are broadcasted directly by the attending technician.
          </Text>
        </View>

        {/* MECHANIC LIVE DISPATCH DETAILS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mechanic Assignment</Text>

          {incident.assignedMechanicName ? (
            <View style={styles.mechBox}>
              <View style={styles.mechHeaderRow}>
                <Ionicons name="construct" size={22} color={colors.navy} />
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.mechName}>{incident.assignedMechanicName}</Text>
                  <Text style={styles.mechSub}>Highway Fleet Care Unit</Text>
                </View>
                <View style={styles.etaPill}>
                  <Text style={styles.etaText}>
                    {isRepaired ? 'Completed' : `ETA ~${incident.mechanicEtaMinutes || 18}m`}
                  </Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Live Repair Status:</Text>
                <Text style={styles.statusValue}>{incident.status.replace(/_/g, ' ')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.coordinatingBox}>
              <Ionicons name="sync-outline" size={24} color={colors.blue} style={{ marginBottom: 4 }} />
              <Text style={styles.coordinatingTitle}>Coordinating Highway Assistance</Text>
              <Text style={styles.coordinatingSub}>
                Your transport office is selecting the best available mechanic for your location.
              </Text>
            </View>
          )}
        </View>

        {/* TIMELINE PROGRESSION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Assistance Progression (Read-Only)</Text>

          <View style={styles.timelineList}>
            {DRIVER_MECH_STAGES.map((stage, idx) => {
              const isPastOrCurrent = idx <= activeIndex;
              const isCurrent = idx === activeIndex;
              const isLast = idx === DRIVER_MECH_STAGES.length - 1;

              return (
                <View key={stage.key} style={styles.timelineItem}>
                  <View style={styles.timelineIconCol}>
                    <View
                      style={[
                        styles.timelineCircle,
                        isPastOrCurrent && styles.timelineCircleActive,
                        isCurrent && styles.timelineCircleCurrent,
                      ]}
                    >
                      {isPastOrCurrent ? (
                        <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                      ) : (
                        <View style={styles.timelineCirclePending} />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineBar,
                          isPastOrCurrent && idx < activeIndex && styles.timelineBarActive,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineContentCol}>
                    <Text
                      style={[
                        styles.stageTitle,
                        isCurrent && styles.stageTitleCurrent,
                        !isPastOrCurrent && styles.stageTitlePending,
                      ]}
                    >
                      {stage.title}
                    </Text>
                    <Text style={styles.stageDesc}>{stage.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* INCIDENT CONTEXT */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Incident Context</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Asset:</Text>
            <Text style={styles.infoVal}>{incident.vehicleNumber} ({incident.vehicleType})</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Shipment:</Text>
            <Text style={styles.infoVal}>#{incident.shipmentId} ({incident.route})</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Symptom Notes:</Text>
            <Text style={styles.infoVal}>{incident.description}</Text>
          </View>
        </View>

        {/* MECHANIC RATING SECTION (ONLY AFTER COMPLETED / REPAIRED / RESOLVED) */}
        {isRepaired && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Mechanic Service Rating</Text>
              {incident.driverRated && (
                <View style={styles.ratedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#15803D" style={{ marginRight: 4 }} />
                  <Text style={styles.ratedBadgeText}>Rated</Text>
                </View>
              )}
            </View>

            {incident.driverRated ? (
              <View style={styles.ratedSummaryBox}>
                <View style={styles.starsDisplayRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= (incident.driverRating || 5) ? 'star' : 'star-outline'}
                      size={20}
                      color="#F59E0B"
                    />
                  ))}
                  <Text style={styles.ratedScoreText}>{incident.driverRating || 5}/5</Text>
                </View>
                {!!incident.driverComment && (
                  <Text style={styles.ratedCommentText}>"{incident.driverComment}"</Text>
                )}
                <Text style={styles.ratedMechanicLabel}>
                  Attending Technician: {incident.assignedMechanicName || 'Suresh Kumar'}
                </Text>
              </View>
            ) : (
              <View style={styles.unratedBox}>
                <Text style={styles.unratedText}>
                  Repair completed by {incident.assignedMechanicName || 'Suresh Kumar'}. Share your feedback on the roadside service.
                </Text>
                <TouchableOpacity
                  style={styles.rateMechBtn}
                  onPress={() => setShowRateModal(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="star" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.rateMechBtnText}>Rate Mechanic</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* RESUME TRIP ACTION WHEN REPAIRED OR REPLACED */}
        {isRepaired ? (
          <Button
            title="Resume Haul & Continue Trip →"
            onPress={handleResumeTrip}
            style={styles.resumeBtn}
          />
        ) : (
          <Button
            title="Return to Live Trip Dispatch"
            variant="outline"
            onPress={handleBack}
            style={{ marginBottom: spacing.lg }}
          />
        )}
      </ScrollView>

      {/* RATE MECHANIC MODAL */}
      <Modal
        visible={showRateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Mechanic</Text>
              <TouchableOpacity onPress={() => setShowRateModal(false)}>
                <Ionicons name="close-circle" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Mechanic Summary */}
              <View style={styles.modalMechSummary}>
                <View style={styles.modalMechIcon}>
                  <Ionicons name="construct" size={24} color={colors.navy} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.modalMechName}>
                    {incident.assignedMechanicName || 'Suresh Kumar'}
                  </Text>
                  <Text style={styles.modalMechSub}>
                    Shipment: #{incident.shipmentId} • Service: {incident.issueType}
                  </Text>
                </View>
              </View>

              {/* Star Rating Selection */}
              <Text style={styles.starQuestion}>How was the service?</Text>
              <View style={styles.starsPickerRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setSelectedRating(star)}
                    style={styles.starTouchItem}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= selectedRating ? 'star' : 'star-outline'}
                      size={36}
                      color="#F59E0B"
                    />
                    <Text style={styles.starNumberLabel}>{star}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Comment Field */}
              <Text style={styles.commentLabel}>Comment (Optional)</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Write your feedback (e.g. Quick response and excellent repair)"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={ratingComment}
                onChangeText={setRatingComment}
              />

              {ratingSuccessMsg && (
                <View style={styles.ratingSuccessBox}>
                  <Ionicons name="checkmark-circle" size={16} color="#15803D" style={{ marginRight: 6 }} />
                  <Text style={styles.ratingSuccessText}>{ratingSuccessMsg}</Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitRatingBtn}
                onPress={handleSubmitRating}
                activeOpacity={0.85}
              >
                <Text style={styles.submitRatingBtnText}>Submit Rating</Text>
              </TouchableOpacity>
            </ScrollView>
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  heroCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  heroCardRepaired: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  reportedTime: {
    fontSize: 11,
    color: '#991B1B',
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7F1D1D',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 2,
  },
  noticeText: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
    lineHeight: 16,
  },
  readOnlyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  readOnlyNoticeText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 15,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
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
  mechBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  mechHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  mechName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  mechSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  etaPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  etaText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.green,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  coordinatingBox: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  coordinatingTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 4,
  },
  coordinatingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
  },
  timelineList: {
    paddingVertical: spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCircleActive: {
    backgroundColor: colors.navy,
  },
  timelineCircleCurrent: {
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  timelineCirclePending: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
  },
  timelineBar: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  timelineBarActive: {
    backgroundColor: colors.navy,
  },
  timelineContentCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  stageTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  stageTitleCurrent: {
    fontWeight: 'bold',
    color: colors.orange,
  },
  stageTitlePending: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
  stageDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '65%',
    textAlign: 'right',
  },
  resumeBtn: {
    backgroundColor: colors.navy,
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },

  // Rating Styles
  ratedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  ratedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  ratedSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  starsDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratedScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
    marginLeft: 6,
  },
  ratedCommentText: {
    fontSize: 12,
    color: colors.navy,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  ratedMechanicLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  unratedBox: {
    paddingVertical: 4,
  },
  unratedText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  rateMechBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  rateMechBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  modalMechSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  modalMechIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMechName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  modalMechSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  starQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 10,
  },
  starsPickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: spacing.md,
  },
  starTouchItem: {
    alignItems: 'center',
  },
  starNumberLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 6,
  },
  commentInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: spacing.sm,
    fontSize: 13,
    color: colors.navy,
    textAlignVertical: 'top',
    minHeight: 70,
    marginBottom: spacing.md,
  },
  ratingSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  ratingSuccessText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  submitRatingBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  submitRatingBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
