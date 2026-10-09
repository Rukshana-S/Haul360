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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { OfficeVehicle } from '@/constants/transportOfficeMockData';

export default function TransportOfficeFastagScreen() {
  const {
    vehicles,
    rechargeVehicleFastag,
    deductVehicleToll,
    financials,
  } = useTransportOffice();

  const [selectedVehicle, setSelectedVehicle] = useState<OfficeVehicle | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('1000');
  const [rechargeSuccessMsg, setRechargeSuccessMsg] = useState<string | null>(null);

  const [selectedTxnVehicle, setSelectedTxnVehicle] = useState<OfficeVehicle | null>(null);

  const vehiclesWithFastag = vehicles.filter((v) => !!v.fastag);
  const lowBalanceCount = vehiclesWithFastag.filter(
    (v) => v.fastag?.status === 'LOW_BALANCE' || (v.fastag?.balance || 0) <= (v.fastag?.lowBalanceThreshold || 1000)
  ).length;
  const activeCount = vehiclesWithFastag.filter((v) => v.fastag?.status === 'ACTIVE' && v.isActive !== false).length;

  const handleOpenRecharge = (vehicle: OfficeVehicle) => {
    setSelectedVehicle(vehicle);
    setRechargeAmount('1000');
    setRechargeSuccessMsg(null);
    setShowRechargeModal(true);
  };

  const handleConfirmRecharge = () => {
    if (!selectedVehicle) return;
    const amt = parseInt(rechargeAmount, 10);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please select or enter a valid recharge amount.');
      return;
    }

    const res = rechargeVehicleFastag(selectedVehicle.id, amt);
    if (res.success) {
      setRechargeSuccessMsg(
        `₹${amt.toLocaleString('en-IN')} credited to ${selectedVehicle.vehicleNumber} FASTag. New Balance: ₹${(res.newBalance || 0).toLocaleString('en-IN')}`
      );
      setTimeout(() => {
        setRechargeSuccessMsg(null);
        setShowRechargeModal(false);
      }, 1500);
    } else {
      Alert.alert('Recharge Failed', res.error || 'Failed to recharge FASTag.');
    }
  };

  const handleSimulateToll = (vehicle: OfficeVehicle) => {
    const res = deductVehicleToll(vehicle.id, 250, 'Salem-Bangalore Expressway Toll');
    if (res.success) {
      Alert.alert(
        'Toll Deducted (-₹250)',
        `Deducted from ${vehicle.vehicleNumber}. Current Balance: ₹${(res.newBalance || 0).toLocaleString('en-IN')}`
      );
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/transport-office' as any);
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fleet FASTag Hub</Text>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={() => router.push('/transport-office/passbook' as any)}
        >
          <Ionicons name="receipt-outline" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* FLEET FASTAG HERO STATS */}
        <View style={styles.heroFastagCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Total Fleet FASTag Units</Text>
              <Text style={styles.heroUnitsCount}>{vehiclesWithFastag.length} Registered Tags</Text>
            </View>
            <View style={styles.heroIconBadge}>
              <Ionicons name="car" size={24} color={colors.blue} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Active & Healthy</Text>
              <Text style={[styles.statVal, { color: '#22C55E' }]}>{activeCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Low Balance (≤ ₹1k)</Text>
              <Text style={[styles.statVal, { color: lowBalanceCount > 0 ? '#F59E0B' : '#94A3B8' }]}>
                {lowBalanceCount}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Low Limit Rule</Text>
              <Text style={styles.statVal}>₹1,000</Text>
            </View>
          </View>
        </View>

        {/* LOW BALANCE ALERT BANNER (IF ANY) */}
        {lowBalanceCount > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={20} color="#B45309" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertBannerTitle}>
                {lowBalanceCount} Vehicle{lowBalanceCount > 1 ? 's' : ''} Require Immediate FASTag Top-up
              </Text>
              <Text style={styles.alertBannerSub}>
                Recharge to avoid highway toll lane stoppages and penalties.
              </Text>
            </View>
          </View>
        )}

        {/* VEHICLE FASTAG LIST */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Vehicles & Individual FASTags</Text>
          <Text style={styles.fastagCountBadge}>{vehiclesWithFastag.length} Vehicles</Text>
        </View>

        {vehiclesWithFastag.map((vehicle) => {
          const fastag = vehicle.fastag!;
          const isLow = fastag.status === 'LOW_BALANCE' || fastag.balance <= fastag.lowBalanceThreshold;
          const isInactive = vehicle.isActive === false;

          return (
            <View key={vehicle.id} style={[styles.vehicleFastagCard, isLow && styles.vehicleCardLow]}>
              <View style={styles.cardTopRow}>
                <View style={styles.vehHeaderLeft}>
                  <View style={[styles.vehIconCircle, isLow && { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="bus" size={18} color={isLow ? '#B45309' : colors.navy} />
                  </View>
                  <View>
                    <Text style={styles.vehNumber}>{vehicle.vehicleNumber}</Text>
                    <Text style={styles.vehModel}>{vehicle.vehicleType} • {vehicle.model}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.tagStatusBadge,
                    {
                      backgroundColor: isInactive
                        ? '#F1F5F9'
                        : isLow
                        ? '#FEF3C7'
                        : '#DCFCE7',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.tagStatusDot,
                      {
                        backgroundColor: isInactive
                          ? '#94A3B8'
                          : isLow
                          ? '#F59E0B'
                          : '#22C55E',
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.tagStatusText,
                      {
                        color: isInactive
                          ? '#64748B'
                          : isLow
                          ? '#B45309'
                          : '#15803D',
                      },
                    ]}
                  >
                    {isInactive ? 'INACTIVE' : isLow ? 'LOW BALANCE' : 'ACTIVE'}
                  </Text>
                </View>
              </View>

              {/* FASTAG SPECS */}
              <View style={styles.tagSpecsGrid}>
                <View style={styles.tagSpecItem}>
                  <Text style={styles.specLabel}>FASTag ID</Text>
                  <Text style={styles.specVal}>{fastag.id}</Text>
                </View>

                <View style={styles.tagSpecItem}>
                  <Text style={styles.specLabel}>Low Balance Limit</Text>
                  <Text style={styles.specVal}>₹{fastag.lowBalanceThreshold.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.tagSpecItem}>
                  <Text style={styles.specLabel}>Last Recharge</Text>
                  <Text style={styles.specVal}>
                    {fastag.lastRechargeAmount ? `₹${fastag.lastRechargeAmount.toLocaleString('en-IN')}` : 'None'}
                  </Text>
                </View>

                <View style={styles.tagSpecItem}>
                  <Text style={styles.specLabel}>Last Toll</Text>
                  <Text style={styles.specVal}>
                    {fastag.lastTollAmount ? `-₹${fastag.lastTollAmount.toLocaleString('en-IN')}` : 'None'}
                  </Text>
                </View>
              </View>

              {/* BALANCE & ACTIONS */}
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.balanceLabel}>Current FASTag Balance</Text>
                  <Text style={[styles.balanceAmount, { color: isLow ? '#DC2626' : colors.navy }]}>
                    ₹{fastag.balance.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={styles.actionsBtnGroup}>
                  <TouchableOpacity
                    style={styles.viewTxnBtn}
                    onPress={() => setSelectedTxnVehicle(vehicle)}
                  >
                    <Text style={styles.viewTxnBtnText}>Transactions</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.rechargeBtn, isLow && styles.rechargeBtnUrgent]}
                    activeOpacity={0.85}
                    onPress={() => handleOpenRecharge(vehicle)}
                  >
                    <Ionicons name="flash" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.rechargeBtnText}>Recharge</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* SIMULATE TOLL (FOR TESTING & DEMO) */}
              <View style={styles.simRow}>
                <TouchableOpacity
                  style={styles.simBtn}
                  onPress={() => handleSimulateToll(vehicle)}
                >
                  <Ionicons name="speedometer-outline" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={styles.simBtnText}>Simulate Toll (-₹250)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.simBtn}
                  onPress={() => router.push(`/transport-office/vehicles/${vehicle.id}` as any)}
                >
                  <Text style={styles.simBtnText}>View Asset Details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* RECHARGE FASTAG MODAL */}
      <Modal
        visible={showRechargeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRechargeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Recharge Vehicle FASTag</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedVehicle?.vehicleNumber} • Tag {selectedVehicle?.fastag?.id}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowRechargeModal(false)}
              >
                <Ionicons name="close" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>

            {rechargeSuccessMsg ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={48} color={colors.green} />
                <Text style={styles.successTitle}>FASTag Recharged!</Text>
                <Text style={styles.successSubtitle}>{rechargeSuccessMsg}</Text>
              </View>
            ) : (
              <View style={styles.modalBody}>
                <View style={styles.currentBalanceBox}>
                  <Text style={styles.currBalanceLabel}>Current Vehicle FASTag Balance</Text>
                  <Text style={styles.currBalanceAmount}>
                    ₹{(selectedVehicle?.fastag?.balance || 0).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.officeBalSub}>
                    Debited from Office Balance (Available: ₹{financials.availableBalance.toLocaleString('en-IN')})
                  </Text>
                </View>

                <Text style={styles.inputLabel}>Select Top-up Amount</Text>
                <View style={styles.quickPresetGrid}>
                  {['500', '1000', '2000', '5000'].map((amt) => {
                    const isSelected = rechargeAmount === amt;
                    return (
                      <TouchableOpacity
                        key={amt}
                        style={[styles.rechargePresetPill, isSelected && styles.rechargePresetActive]}
                        onPress={() => setRechargeAmount(amt)}
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
                  value={rechargeAmount}
                  onChangeText={setRechargeAmount}
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                />

                <TouchableOpacity
                  style={styles.confirmRechargeBtn}
                  onPress={handleConfirmRecharge}
                >
                  <Text style={styles.confirmRechargeText}>
                    Confirm Recharge (₹{parseInt(rechargeAmount || '0', 10).toLocaleString('en-IN')})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* FASTAG TRANSACTIONS MODAL */}
      <Modal
        visible={!!selectedTxnVehicle}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTxnVehicle(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>FASTag Transactions</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedTxnVehicle?.vehicleNumber} • Tag {selectedTxnVehicle?.fastag?.id}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setSelectedTxnVehicle(null)}
              >
                <Ionicons name="close" size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
              {selectedTxnVehicle?.fastag?.transactions.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptySubtitle}>No transaction logs found for this FASTag.</Text>
                </View>
              ) : (
                selectedTxnVehicle?.fastag?.transactions.map((tx) => {
                  const isRecharge = tx.type === 'RECHARGE';
                  return (
                    <View key={tx.id} style={styles.txnItemRow}>
                      <View
                        style={[
                          styles.txnIconCircle,
                          { backgroundColor: isRecharge ? '#DCFCE7' : '#FEE2E2' },
                        ]}
                      >
                        <Ionicons
                          name={isRecharge ? 'add' : 'remove'}
                          size={16}
                          color={isRecharge ? '#15803D' : '#DC2626'}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.txnLocation}>{tx.locationOrMethod}</Text>
                        <Text style={styles.txnDate}>{tx.date}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text
                          style={[
                            styles.txnAmountText,
                            { color: isRecharge ? colors.green : '#DC2626' },
                          ]}
                        >
                          {isRecharge ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                        </Text>
                        <Text style={styles.txnBalanceAfter}>
                          Bal: ₹{tx.balanceAfter.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.confirmRechargeBtn, { marginTop: spacing.md }]}
              onPress={() => setSelectedTxnVehicle(null)}
            >
              <Text style={styles.confirmRechargeText}>Close</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
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
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  heroFastagCard: {
    backgroundColor: '#0F172A',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroUnitsCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  statVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  alertBannerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
  },
  alertBannerSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  fastagCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  vehicleFastagCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  vehicleCardLow: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  vehHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  vehNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  vehModel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tagStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  tagStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  tagStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  tagSpecsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tagSpecItem: {
    width: '48%',
  },
  specLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
    marginTop: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  balanceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  actionsBtnGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  viewTxnBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.md,
  },
  viewTxnBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.navy,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.md,
  },
  rechargeBtnUrgent: {
    backgroundColor: '#D97706',
  },
  rechargeBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  simRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs + 2,
    paddingTop: 4,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simBtnText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 420,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.navy,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
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
  txnItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txnIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  txnLocation: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  txnDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  txnAmountText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  txnBalanceAfter: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  emptyContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
