import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeDriverDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getDriverById,
    getShipmentById,
    getVehicleById,
    inactivateDriver,
    activateDriver,
    rateDriver,
  } = useTransportOffice();

  const driver = getDriverById(id || '');

  // Modals state
  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [inactivateError, setInactivateError] = useState<string | null>(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [ratingFeedback, setRatingFeedback] = useState<string>('');
  const [ratingSuccessToast, setRatingSuccessToast] = useState<string | null>(null);

  const [showCallModal, setShowCallModal] = useState(false);
  const [callConnecting, setCallConnecting] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/drivers' as any);
    }
  };

  if (!driver) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Driver Not Found</Text>
          <Button
            title="Back to Driver Fleet"
            onPress={handleBack}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Screen>
    );
  }

  const isInactive = driver.isActive === false;
  const currentShipment = driver.currentShipmentId ? getShipmentById(driver.currentShipmentId) : null;
  const currentVehicle = driver.currentVehicleId ? getVehicleById(driver.currentVehicleId) : null;

  const getStatusBadge = () => {
    if (isInactive) {
      return { label: 'INACTIVE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
    switch (driver.availability) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNMENT_PENDING':
        return { label: 'ASSIGNED PENDING ACCEPTANCE', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'BUSY':
        return { label: 'ON ACTIVE TRIP', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
  };

  const badge = getStatusBadge();

  // INACTIVATE / ACTIVATE HANDLERS
  const handleOpenInactivate = () => {
    setInactivateError(null);
    if (driver.availability === 'BUSY' || driver.availability === 'ASSIGNMENT_PENDING' || driver.currentShipmentId) {
      setInactivateError('Driver is currently assigned to an active trip.');
    }
    setShowInactivateModal(true);
  };

  const handleConfirmInactivate = () => {
    const res = inactivateDriver(driver.id);
    if (!res.success) {
      setInactivateError(res.error || 'Failed to inactivate driver.');
    } else {
      setShowInactivateModal(false);
    }
  };

  const handleToggleActivate = () => {
    if (isInactive) {
      activateDriver(driver.id);
    } else {
      handleOpenInactivate();
    }
  };

  // RATING HANDLERS
  const handleOpenRating = () => {
    setSelectedStars(5);
    setRatingFeedback('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    rateDriver(driver.id, selectedStars, ratingFeedback.trim() || undefined);
    setShowRatingModal(false);
    setRatingSuccessToast(`Driver rating of ${selectedStars} ★ submitted successfully`);
    setTimeout(() => {
      setRatingSuccessToast(null);
    }, 4000);
  };

  // CALL HANDLERS
  const handleOpenCall = () => {
    setCallConnecting(false);
    setShowCallModal(true);
  };

  const handleInitiateCall = async () => {
    setCallConnecting(true);
    try {
      const cleanPhone = driver.phone.replace(/\D/g, '');
      const telUrl = `tel:${cleanPhone}`;
      if (Platform.OS !== 'web') {
        const canOpen = await Linking.canOpenURL(telUrl);
        if (canOpen) {
          await Linking.openURL(telUrl);
        }
      }
    } catch {
      // safe fallback in dev/simulator
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
          <Text style={styles.headerTitle}>Driver Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* TOAST SUCCESS BANNER */}
        {ratingSuccessToast && (
          <View style={styles.toastCard}>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" style={{ marginRight: 6 }} />
            <Text style={styles.toastText}>{ratingSuccessToast}</Text>
          </View>
        )}

        {/* HERO PROFILE CARD */}
        <View style={styles.profileHeroCard}>
          <View style={[styles.avatarLarge, isInactive && { borderColor: '#CBD5E1', backgroundColor: '#F1F5F9' }]}>
            <Text style={[styles.avatarLargeText, isInactive && { color: '#64748B' }]}>
              {driver.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.driverId}>Driver ID: {driver.id}</Text>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg, marginTop: spacing.xs }]}>
            <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{driver.completedTripsCount}</Text>
              <Text style={styles.statLabel}>Completed Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>★ {driver.rating > 0 ? driver.rating.toFixed(1) : '0.0'}</Text>
              <Text style={styles.statLabel}>Fleet Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{driver.experienceYears} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* PRIMARY ACTION BUTTONS: CALL DRIVER, RATE DRIVER, INACTIVATE DRIVER */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsCardTitle}>Management & Dispatch Actions</Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.callActionButton}
              activeOpacity={0.85}
              onPress={handleOpenCall}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.callActionButtonText}>Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rateActionButton}
              activeOpacity={0.85}
              onPress={handleOpenRating}
            >
              <Ionicons name="star" size={16} color="#B45309" style={{ marginRight: 6 }} />
              <Text style={styles.rateActionButtonText}>Rate Driver</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.inactivateButton,
              isInactive ? styles.activateButton : styles.deactivateButton,
            ]}
            activeOpacity={0.85}
            onPress={handleToggleActivate}
          >
            <Ionicons
              name={isInactive ? 'checkmark-circle-outline' : 'power-outline'}
              size={16}
              color={isInactive ? '#15803D' : '#B91C1C'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.inactivateButtonText,
                isInactive ? { color: '#15803D' } : { color: '#B91C1C' },
              ]}
            >
              {isInactive ? 'ACTIVATE DRIVER' : 'INACTIVATE DRIVER'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* RATING & PERFORMANCE SUMMARY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Transport Office Rating & Feedback</Text>
            <Ionicons name="star-outline" size={18} color={colors.navy} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Transport Office Rating:</Text>
            <View style={styles.starValueRow}>
              <Ionicons name="star" size={15} color={driver.rating > 0 ? '#F59E0B' : '#94A3B8'} style={{ marginRight: 3 }} />
              <Text style={styles.infoValueBold}>
                {driver.rating > 0 ? `${driver.rating.toFixed(1)} / 5.0` : '0.0 ★ (No ratings yet)'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Reviews Logged:</Text>
            <Text style={styles.infoValue}>
              {driver.ratingCount && driver.ratingCount > 0 ? `${driver.ratingCount} reviews` : '0 reviews'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Rated:</Text>
            <Text style={styles.infoValue}>{driver.lastRatedDate || 'No ratings yet'}</Text>
          </View>
        </View>

        {/* CURRENT LIVE ASSIGNMENT (NOT PERMANENT) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Current Trip Assignment</Text>
            <Ionicons name="git-network-outline" size={18} color={colors.navy} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Shipment:</Text>
            <Text style={styles.infoValue}>
              {currentShipment ? `#${currentShipment.id} (${currentShipment.origin} → ${currentShipment.destination})` : 'None'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Assigned Vehicle:</Text>
            <Text style={styles.infoValue}>
              {currentVehicle ? `${currentVehicle.vehicleNumber} (${currentVehicle.vehicleType})` : 'None'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trip Status:</Text>
            <Text style={[styles.infoValue, { color: currentShipment ? colors.blue : colors.textSecondary }]}>
              {currentShipment ? currentShipment.status.replace(/_/g, ' ') : 'No Active Dispatch'}
            </Text>
          </View>

          {currentShipment && (
            <Button
              title="View Current Trip Details →"
              onPress={() => router.push(`/transport-office/shipments/${currentShipment.id}` as any)}
              style={styles.actionBtn}
            />
          )}

          {!currentShipment && !isInactive && driver.availability === 'AVAILABLE' && (
            <Button
              title="Assign Shipment to Driver"
              onPress={() => router.push('/transport-office/shipments' as any)}
              style={styles.actionBtn}
            />
          )}

          {isInactive && (
            <View style={styles.inactiveNoticeBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.inactiveNoticeText}>
                This driver is inactive and cannot be assigned to new shipments.
              </Text>
            </View>
          )}
        </View>

        {/* CONTACT & PERSONAL INFO */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal & Contact Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>+91 {driver.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{driver.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{driver.age} years old</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{driver.address}</Text>
          </View>
        </View>

        {/* DRIVING LICENSE & COMPLIANCE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>License Verification</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DL Number:</Text>
            <Text style={styles.infoValue}>{driver.licenseNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DL Expiry Date:</Text>
            <Text style={styles.infoValue}>{driver.licenseExpiry}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Document Status:</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color={colors.green} />
              <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ---------------------------------------------------- */}
      {/* 1. CALL DRIVER MODAL */}
      {/* ---------------------------------------------------- */}
      <Modal
        visible={showCallModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconBox, callConnecting && { backgroundColor: '#DCFCE7' }]}>
              <Ionicons
                name="call"
                size={28}
                color={callConnecting ? '#15803D' : colors.navy}
              />
            </View>

            <Text style={styles.modalTitle}>
              {callConnecting ? `Calling ${driver.name}...` : 'Call Driver'}
            </Text>

            <Text style={styles.modalDriverName}>{driver.name}</Text>
            <Text style={styles.modalPhoneText}>+91 {driver.phone}</Text>

            <Text style={styles.modalSubtitle}>
              {callConnecting
                ? 'Connecting dispatch audio bridge to driver mobile device...'
                : 'Your call will be connected to the driver via Haul360 dispatch bridge.'}
            </Text>

            <View style={styles.modalButtonsRow}>
              {!callConnecting ? (
                <>
                  <TouchableOpacity
                    style={styles.cancelModalBtn}
                    onPress={() => setShowCallModal(false)}
                  >
                    <Text style={styles.cancelModalBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmCallBtn}
                    onPress={handleInitiateCall}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.confirmCallBtnText}>Call</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.endCallBtn}
                  onPress={() => setShowCallModal(false)}
                >
                  <Ionicons name="close-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.endCallBtnText}>End Call / Close</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------------------------------------------------- */}
      {/* 2. RATE DRIVER MODAL */}
      {/* ---------------------------------------------------- */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={28} color="#D97706" />
            </View>

            <Text style={styles.modalTitle}>Rate {driver.name}</Text>
            <Text style={styles.modalSubtitle}>
              How was this driver's operational performance?
            </Text>

            {/* STAR SELECTOR */}
            <View style={styles.starRatingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.7}
                  onPress={() => setSelectedStars(star)}
                  style={styles.starTouchItem}
                >
                  <Ionicons
                    name={star <= selectedStars ? 'star' : 'star-outline'}
                    size={36}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.starLabelText}>
              {selectedStars === 5
                ? '5.0 — Excellent Performance'
                : selectedStars === 4
                ? '4.0 — Very Good'
                : selectedStars === 3
                ? '3.0 — Satisfactory'
                : selectedStars === 2
                ? '2.0 — Needs Improvement'
                : '1.0 — Unsatisfactory'}
            </Text>

            {/* OPTIONAL FEEDBACK INPUT */}
            <View style={styles.feedbackInputWrapper}>
              <TextInput
                style={styles.feedbackTextInput}
                placeholder="Share feedback on punctuality, safety, cargo care..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={ratingFeedback}
                onChangeText={setRatingFeedback}
              />
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmSubmitRatingBtn}
                onPress={handleSubmitRating}
              >
                <Text style={styles.confirmSubmitRatingBtnText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------------------------------------------------- */}
      {/* 3. INACTIVATE DRIVER CONFIRMATION MODAL */}
      {/* ---------------------------------------------------- */}
      <Modal
        visible={showInactivateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInactivateModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons
                name={inactivateError ? 'alert-circle' : 'power'}
                size={28}
                color="#B91C1C"
              />
            </View>

            <Text style={styles.modalTitle}>
              {inactivateError ? 'Cannot Inactivate Driver' : 'Inactivate Driver?'}
            </Text>

            {inactivateError ? (
              <View style={styles.inactivateErrorBox}>
                <Text style={styles.inactivateErrorText}>{inactivateError}</Text>
                <Text style={styles.inactivateErrorSub}>
                  Please complete the current shipment or re-assign to another fleet driver first.
                </Text>
              </View>
            ) : (
              <Text style={styles.modalSubtitle}>
                "{driver.name} will no longer be available for new shipment assignments."
              </Text>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowInactivateModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>
                  {inactivateError ? 'Understood' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              {!inactivateError && (
                <TouchableOpacity
                  style={styles.confirmInactivateBtn}
                  onPress={handleConfirmInactivate}
                >
                  <Text style={styles.confirmInactivateBtnText}>Inactivate</Text>
                </TouchableOpacity>
              )}
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
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    flex: 1,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarLargeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  driverId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  actionsCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  callActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  callActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rateActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  rateActionButtonText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: 'bold',
  },
  inactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  deactivateButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  activateButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  inactivateButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '60%',
    textAlign: 'right',
  },
  infoValueBold: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  starValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
    marginLeft: 3,
  },
  actionBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.sm,
  },
  inactiveNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  inactiveNoticeText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
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

  // MODAL STYLES
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalDriverName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
    marginTop: 2,
  },
  modalPhoneText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    marginTop: spacing.sm,
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelModalBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  confirmCallBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCallBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  endCallBtn: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  starRatingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: spacing.sm,
  },
  starTouchItem: {
    padding: 4,
  },
  starLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: spacing.sm,
  },
  feedbackInputWrapper: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackTextInput: {
    fontSize: 13,
    color: colors.navy,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  confirmSubmitRatingBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmSubmitRatingBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inactivateErrorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  inactivateErrorText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B91C1C',
    textAlign: 'center',
  },
  inactivateErrorSub: {
    fontSize: 11,
    color: '#991B1B',
    textAlign: 'center',
    marginTop: 4,
  },
  confirmInactivateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmInactivateBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
