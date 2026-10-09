import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeVehicleDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getVehicleById,
    getDriverById,
    getShipmentById,
    markVehicleMaintenance,
    inactivateVehicle,
    activateVehicle,
    rechargeVehicleFastag,
    deductVehicleToll,
    financials,
  } = useTransportOffice();

  const vehicle = getVehicleById(id || '');

  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [inactivateError, setInactivateError] = useState<string | null>(null);

  const [showFastagRechargeModal, setShowFastagRechargeModal] = useState(false);
  const [fastagRechargeAmount, setFastagRechargeAmount] = useState('1000');
  const [fastagRechargeSuccess, setFastagRechargeSuccess] = useState<string | null>(null);
  const [showAllFastagTxns, setShowAllFastagTxns] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/vehicles' as any);
    }
  };

  if (!vehicle) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Vehicle Asset Not Found</Text>
          <Button
            title="Back to Vehicles"
            onPress={handleBack}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Screen>
    );
  }

  const isInactive = vehicle.isActive === false;
  const currentDriver = vehicle.currentDriverId ? getDriverById(vehicle.currentDriverId) : null;
  const currentShipment = vehicle.currentShipmentId ? getShipmentById(vehicle.currentShipmentId) : null;

  const isUnderMaintenance = vehicle.status === 'MAINTENANCE';

  const toggleMaintenance = () => {
    markVehicleMaintenance(vehicle.id, !isUnderMaintenance);
  };

  const getStatusBadge = () => {
    if (isInactive) {
      return { label: 'INACTIVE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
    switch (vehicle.status) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE FOR DISPATCH', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'ASSIGNED':
        return { label: 'ASSIGNED PENDING TRIP', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'IN_TRIP':
        return { label: 'ON ACTIVE TRIP', bg: '#DBEAFE', text: '#1D4ED8', dot: '#2563EB' };
      case 'MAINTENANCE':
        return { label: 'UNDER WORKSHOP MAINTENANCE', bg: '#FEE2E2', text: '#B91C1C', dot: '#DC2626' };
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
  };

  const badge = getStatusBadge();

  const handleOpenInactivate = () => {
    setInactivateError(null);
    if (vehicle.status === 'IN_TRIP' || vehicle.status === 'ASSIGNED' || vehicle.currentShipmentId) {
      setInactivateError('This vehicle is currently assigned to an active shipment.');
    }
    setShowInactivateModal(true);
  };

  const handleConfirmInactivate = () => {
    const res = inactivateVehicle(vehicle.id);
    if (!res.success) {
      setInactivateError(res.error || 'Failed to inactivate vehicle.');
    } else {
      setShowInactivateModal(false);
    }
  };

  const handleToggleActivate = () => {
    if (isInactive) {
      activateVehicle(vehicle.id);
    } else {
      handleOpenInactivate();
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
          <Text style={styles.headerTitle}>Vehicle Asset Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* HERO VEHICLE CARD */}
        <View style={styles.heroCard}>
          <View style={[styles.heroIconCircle, isInactive && { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}>
            <Ionicons name="bus" size={32} color={isInactive ? '#64748B' : colors.navy} />
          </View>
          <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
          <Text style={styles.vehicleSub}>{vehicle.vehicleType} • {vehicle.model}</Text>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg, marginTop: spacing.sm }]}>
            <View style={[styles.statusDot, { backgroundColor: badge.dot }]} />
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* ASSET MANAGEMENT ACTIONS: INACTIVATE / ACTIVATE */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsCardTitle}>Asset State Management</Text>
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
              {isInactive ? 'ACTIVATE VEHICLE' : 'INACTIVATE VEHICLE'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CURRENT DISPATCH INFO (SEPARATION FROM DRIVER) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Current Dispatch Assignment</Text>
            <Ionicons name="git-branch-outline" size={18} color={colors.navy} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Driver:</Text>
            <Text style={styles.infoValue}>
              {currentDriver ? currentDriver.name : 'None (Available in Yard)'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Shipment:</Text>
            <Text style={styles.infoValue}>
              {currentShipment ? `#${currentShipment.id} (${currentShipment.origin} → ${currentShipment.destination})` : 'None'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trip Status:</Text>
            <Text style={[styles.infoValue, { color: currentShipment ? colors.blue : colors.textSecondary }]}>
              {currentShipment ? currentShipment.status.replace(/_/g, ' ') : 'Parked / Yard Ready'}
            </Text>
          </View>

          {currentShipment && (
            <Button
              title="View Active Trip Dispatch →"
              onPress={() => router.push(`/transport-office/shipments/${currentShipment.id}` as any)}
              style={styles.actionBtn}
            />
          )}

          {isInactive && (
            <View style={styles.inactiveNoticeBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.inactiveNoticeText}>
                This vehicle is inactive and excluded from new dispatch assignments.
              </Text>
            </View>
          )}
        </View>

        {/* TECHNICAL SPECIFICATIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Technical Specifications</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payload Capacity:</Text>
            <Text style={styles.infoValue}>{vehicle.capacityKg.toLocaleString()} KG</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fuel Type:</Text>
            <Text style={styles.infoValue}>{vehicle.fuelType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Body & Axle Config:</Text>
            <Text style={styles.infoValue}>{vehicle.vehicleType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Inspection:</Text>
            <Text style={styles.infoValue}>{vehicle.lastMaintenanceDate || '15 Sep 2026'}</Text>
          </View>
        </View>

        {/* COMPLIANCE & LEGAL DOCUMENTS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Compliance & Permits</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>RC Certificate No.:</Text>
            <Text style={styles.infoValue}>{vehicle.rcNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Road Permit:</Text>
            <Text style={styles.infoValue}>
              {vehicle.permitStatus === 'NATIONAL_PERMIT' ? 'All India National Permit' : 'State Goods Carrier'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Insurance Policy:</Text>
            <View style={styles.validBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.green} />
              <Text style={styles.validBadgeText}>ACTIVE & VALID</Text>
            </View>
          </View>
        </View>

        {/* FASTAG VEHICLE MANAGEMENT SECTION */}
        {vehicle.fastag ? (
          <View style={[styles.sectionCard, vehicle.fastag.status === 'LOW_BALANCE' && styles.fastagCardLow]}>
            <View style={styles.fastagHeaderRow}>
              <View style={styles.fastagHeaderLeft}>
                <View style={[styles.fastagIconCircle, vehicle.fastag.status === 'LOW_BALANCE' && { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons
                    name="car"
                    size={20}
                    color={vehicle.fastag.status === 'LOW_BALANCE' ? '#B45309' : colors.navy}
                  />
                </View>
                <View>
                  <Text style={styles.fastagSectionTitle}>FASTag Account</Text>
                  <Text style={styles.fastagIdText}>Tag ID: {vehicle.fastag.id}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.fastagStatusBadge,
                  {
                    backgroundColor:
                      isInactive
                        ? '#F1F5F9'
                        : vehicle.fastag.status === 'LOW_BALANCE'
                        ? '#FEF3C7'
                        : '#DCFCE7',
                  },
                ]}
              >
                <View
                  style={[
                    styles.fastagStatusDot,
                    {
                      backgroundColor:
                        isInactive
                          ? '#94A3B8'
                          : vehicle.fastag.status === 'LOW_BALANCE'
                          ? '#F59E0B'
                          : '#22C55E',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.fastagStatusText,
                    {
                      color:
                        isInactive
                          ? '#64748B'
                          : vehicle.fastag.status === 'LOW_BALANCE'
                          ? '#B45309'
                          : '#15803D',
                    },
                  ]}
                >
                  {isInactive ? 'INACTIVE' : vehicle.fastag.status === 'LOW_BALANCE' ? 'LOW BALANCE' : 'ACTIVE'}
                </Text>
              </View>
            </View>

            {/* BALANCE & RECHARGE ACTION */}
            <View style={styles.fastagBalanceBox}>
              <View>
                <Text style={styles.fastagBalanceLabel}>Current Balance</Text>
                <Text
                  style={[
                    styles.fastagBalanceAmount,
                    vehicle.fastag.status === 'LOW_BALANCE' && { color: '#DC2626' },
                  ]}
                >
                  ₹{vehicle.fastag.balance.toLocaleString('en-IN')}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.fastagRechargeBtn,
                  vehicle.fastag.status === 'LOW_BALANCE' && styles.fastagRechargeBtnUrgent,
                ]}
                activeOpacity={0.85}
                onPress={() => {
                  setFastagRechargeSuccess(null);
                  setShowFastagRechargeModal(true);
                }}
              >
                <Ionicons name="flash" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.fastagRechargeBtnText}>Recharge FASTag</Text>
              </TouchableOpacity>
            </View>

            {/* DETAILS GRID */}
            <View style={styles.fastagDetailsGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Low Balance Limit:</Text>
                <Text style={styles.infoValue}>₹{vehicle.fastag.lowBalanceThreshold.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Recharge:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.fastag.lastRechargeAmount
                    ? `₹${vehicle.fastag.lastRechargeAmount.toLocaleString('en-IN')} (${vehicle.fastag.lastRechargeDate || 'Recent'})`
                    : 'None recorded'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Toll Deduction:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.fastag.lastTollAmount
                    ? `-₹${vehicle.fastag.lastTollAmount.toLocaleString('en-IN')} (${vehicle.fastag.lastTollDate || 'Recent'})`
                    : 'None recorded'}
                </Text>
              </View>
            </View>

            {/* TRANSACTIONS HISTORY PREVIEW */}
            <View style={styles.fastagTxnHeaderRow}>
              <Text style={styles.fastagTxnHeaderTitle}>Recent FASTag Transactions</Text>
              <TouchableOpacity onPress={() => setShowAllFastagTxns(!showAllFastagTxns)}>
                <Text style={styles.viewAllTxnLink}>
                  {showAllFastagTxns ? 'Collapse' : 'View All'}
                </Text>
              </TouchableOpacity>
            </View>

            {vehicle.fastag.transactions.length === 0 ? (
              <Text style={styles.noTxnText}>No FASTag transactions recorded.</Text>
            ) : (
              (showAllFastagTxns ? vehicle.fastag.transactions : vehicle.fastag.transactions.slice(0, 3)).map(
                (tx) => {
                  const isRecharge = tx.type === 'RECHARGE';
                  return (
                    <View key={tx.id} style={styles.fastagTxnRow}>
                      <View
                        style={[
                          styles.fastagTxnIconCircle,
                          { backgroundColor: isRecharge ? '#DCFCE7' : '#FEE2E2' },
                        ]}
                      >
                        <Ionicons
                          name={isRecharge ? 'add' : 'remove'}
                          size={14}
                          color={isRecharge ? '#15803D' : '#DC2626'}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fastagTxnLocation}>{tx.locationOrMethod}</Text>
                        <Text style={styles.fastagTxnDate}>{tx.date}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text
                          style={[
                            styles.fastagTxnAmount,
                            { color: isRecharge ? colors.green : '#DC2626' },
                          ]}
                        >
                          {isRecharge ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                        </Text>
                        <Text style={styles.fastagTxnBalance}>Bal: ₹{tx.balanceAfter.toLocaleString('en-IN')}</Text>
                      </View>
                    </View>
                  );
                }
              )
            )}
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>FASTag</Text>
            <Text style={styles.infoLabel}>No FASTag configured for this vehicle asset.</Text>
          </View>
        )}

        {/* MAINTENANCE CONTROLS */}
        {!isInactive && (
          <View style={styles.maintenanceCard}>
            <Text style={styles.maintenanceTitle}>Fleet Asset Maintenance Mode</Text>
            <Text style={styles.maintenanceDesc}>
              {isUnderMaintenance
                ? 'This vehicle is marked under workshop maintenance and is excluded from dispatch assignment selection.'
                : 'Mark this vehicle for maintenance if undergoing inspection or servicing.'}
            </Text>

            <Button
              title={isUnderMaintenance ? 'Mark as Available (Complete Maintenance)' : 'Mark Vehicle Under Maintenance'}
              variant={isUnderMaintenance ? 'primary' : 'outline'}
              onPress={toggleMaintenance}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        )}
      </ScrollView>

      {/* INACTIVATE VEHICLE CONFIRMATION MODAL */}
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
              {inactivateError ? 'Cannot Inactivate Vehicle' : 'Inactivate Vehicle?'}
            </Text>

            {inactivateError ? (
              <View style={styles.inactivateErrorBox}>
                <Text style={styles.inactivateErrorText}>{inactivateError}</Text>
                <Text style={styles.inactivateErrorSub}>
                  Please complete the shipment or assign a replacement vehicle first.
                </Text>
              </View>
            ) : (
              <Text style={styles.modalSubtitle}>
                "{vehicle.vehicleNumber} will no longer be available for new shipment assignments."
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

      {/* FASTAG RECHARGE MODAL */}
      <Modal
        visible={showFastagRechargeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFastagRechargeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Recharge Vehicle FASTag</Text>
                <Text style={styles.modalSubtitle}>
                  {vehicle.vehicleNumber} • Tag {vehicle.fastag?.id}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowFastagRechargeModal(false)}
              >
                <Ionicons name="close" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>

            {fastagRechargeSuccess ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={48} color={colors.green} />
                <Text style={styles.successTitle}>FASTag Recharged!</Text>
                <Text style={styles.successSubtitle}>{fastagRechargeSuccess}</Text>
              </View>
            ) : (
              <View style={styles.modalBody}>
                <View style={styles.currentBalanceBox}>
                  <Text style={styles.currBalanceLabel}>Current Vehicle FASTag Balance</Text>
                  <Text style={styles.currBalanceAmount}>
                    ₹{(vehicle.fastag?.balance || 0).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.officeBalSub}>
                    Debited from Hub Balance (Available: ₹{financials.availableBalance.toLocaleString('en-IN')})
                  </Text>
                </View>

                <Text style={styles.inputLabel}>Select Top-up Amount</Text>
                <View style={styles.quickPresetGrid}>
                  {['500', '1000', '2000', '5000'].map((amt) => {
                    const isSelected = fastagRechargeAmount === amt;
                    return (
                      <TouchableOpacity
                        key={amt}
                        style={[styles.rechargePresetPill, isSelected && styles.rechargePresetActive]}
                        onPress={() => setFastagRechargeAmount(amt)}
                      >
                        <Text
                          style={[
                            styles.rechargePresetText,
                            isSelected && styles.rechargePresetTextActive,
                          ]}
                        >
                          ₹{parseInt(amt, 10).toLocaleString('en-IN')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.inputLabel}>Or Enter Custom Amount (₹)</Text>
                <TextInput
                  style={styles.customAmountInput}
                  keyboardType="numeric"
                  value={fastagRechargeAmount}
                  onChangeText={setFastagRechargeAmount}
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                />

                <TouchableOpacity
                  style={styles.confirmRechargeBtn}
                  onPress={() => {
                    const amt = parseInt(fastagRechargeAmount, 10);
                    if (isNaN(amt) || amt <= 0) {
                      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
                      return;
                    }
                    const res = rechargeVehicleFastag(vehicle.id, amt);
                    if (res.success) {
                      setFastagRechargeSuccess(
                        `₹${amt.toLocaleString('en-IN')} credited to ${vehicle.vehicleNumber}. New Balance: ₹${(res.newBalance || 0).toLocaleString('en-IN')}`
                      );
                      setTimeout(() => {
                        setFastagRechargeSuccess(null);
                        setShowFastagRechargeModal(false);
                      }, 1500);
                    } else {
                      Alert.alert('Recharge Failed', res.error || 'Failed to recharge FASTag.');
                    }
                  }}
                >
                  <Text style={styles.confirmRechargeText}>
                    Confirm Recharge (₹{parseInt(fastagRechargeAmount || '0', 10).toLocaleString('en-IN')})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  heroIconCircle: {
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
  vehicleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
  },
  vehicleSub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
  validBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  validBadgeText: {
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
  maintenanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  maintenanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  maintenanceDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.xs,
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
  fastagCardLow: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  fastagHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  fastagHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fastagIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  fastagSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  fastagIdText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  fastagStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  fastagStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  fastagStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  fastagBalanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  fastagBalanceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  fastagBalanceAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
    marginTop: 2,
  },
  fastagRechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.md,
  },
  fastagRechargeBtnUrgent: {
    backgroundColor: '#D97706',
  },
  fastagRechargeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fastagDetailsGrid: {
    paddingVertical: spacing.xs,
  },
  fastagTxnHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  fastagTxnHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  viewAllTxnLink: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
  },
  noTxnText: {
    fontSize: 11,
    color: colors.textSecondary,
    paddingVertical: spacing.xs,
  },
  fastagTxnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  fastagTxnIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  fastagTxnLocation: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  fastagTxnDate: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  fastagTxnAmount: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  fastagTxnBalance: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginTop: spacing.xs,
  },
  currentBalanceBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currBalanceLabel: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: '600',
  },
  currBalanceAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
    marginVertical: 2,
  },
  officeBalSub: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 6,
  },
  quickPresetGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  rechargePresetPill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rechargePresetActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  rechargePresetText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  rechargePresetTextActive: {
    color: '#FFFFFF',
  },
  customAmountInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  confirmRechargeBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  confirmRechargeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.sm,
  },
  successSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
