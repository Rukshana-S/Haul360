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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

export default function FastagHubScreen() {
  const {
    vehicles,
    activeVehicleId,
    vehicle,
    selectVehicle,
    fastagBalance,
    fastagTransactions,
    rechargeFastag,
  } = useDriver();

  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('1000');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLowBalance = fastagBalance < 500;

  const handlePreRecharge = () => {
    const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid recharge amount.');
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleConfirmRecharge = () => {
    setSubmitting(true);
    const amt = parseFloat(rechargeAmount);
    setTimeout(() => {
      const res = rechargeFastag(amt, activeVehicleId);
      setSubmitting(false);
      setConfirmModalVisible(false);
      setRechargeModalVisible(false);
      if (res.success) {
        Alert.alert('FASTag Recharged', res.message);
      }
    }, 500);
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>FASTag Electronic Toll</Text>
          <Text style={styles.headerSubtitle}>NHAI & NETC Highway ETC Wallet</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TRUCK SWITCHER */}
        {vehicles.length > 1 && (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={styles.switcherHeaderLabel}>Select Truck for FASTag Wallet:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {vehicles.map((v) => {
                const isSelected = v.id === activeVehicleId;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vehTab, isSelected && styles.vehTabActive]}
                    onPress={() => selectVehicle(v.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="car-sport"
                      size={14}
                      color={isSelected ? colors.white : colors.navy}
                    />
                    <Text style={[styles.vehTabText, isSelected && styles.vehTabTextActive]}>
                      {v.vehicleNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Low Balance Warning Banner */}
        {isLowBalance && (
          <View style={styles.lowBalanceBanner}>
            <Ionicons name="warning" size={20} color="#B91C1C" />
            <View style={{ flex: 1 }}>
              <Text style={styles.lowBalanceTitle}>Low FASTag Balance Alert</Text>
              <Text style={styles.lowBalanceSub}>
                Balance is below ₹500. Top up to prevent 2x cash penalty at toll plazas.
              </Text>
            </View>
          </View>
        )}

        {/* FASTag Card */}
        <View style={styles.fastagCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.tagBrand}>NETC FASTag</Text>
              <Text style={styles.tagId}>Tag ID: {vehicle.fastagTagId}</Text>
            </View>
            <View style={styles.activeTagBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.activeTagText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.cardMiddle}>
            <Text style={styles.balanceLabel}>Current Toll Wallet Balance</Text>
            <Text style={styles.balanceVal}>₹{fastagBalance.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.vehLabel}>Linked Commercial Vehicle</Text>
              <Text style={styles.vehVal}>{vehicle.vehicleNumber} ({vehicle.model.split(' ')[0]})</Text>
            </View>
            <TouchableOpacity
              style={styles.rechargeBtn}
              onPress={() => setRechargeModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={16} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.rechargeBtnText}>Recharge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Toll Plaza Passbook Transactions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Toll Plaza Passbook & Deductions</Text>

          {fastagTransactions.map((txn) => (
            <View key={txn.id} style={styles.tollRow}>
              <View style={styles.tollIconBox}>
                <Ionicons
                  name={txn.type === 'CREDIT' ? 'wallet' : 'cash-outline'}
                  size={18}
                  color={txn.type === 'CREDIT' ? colors.green : colors.navy}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.plazaName}>{txn.plazaName}</Text>
                <Text style={styles.tollMeta}>
                  {txn.lane} • {txn.date} {txn.time}
                </Text>
              </View>
              <Text
                style={[
                  styles.tollAmount,
                  { color: txn.type === 'CREDIT' ? colors.green : colors.navy },
                ]}
              >
                {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Recharge Modal */}
      <Modal
        visible={rechargeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRechargeModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Recharge FASTag Wallet</Text>
              <TouchableOpacity onPress={() => setRechargeModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSub}>
              Instantly top up {vehicle.vehicleNumber} from your Haul360 Wallet or UPI.
            </Text>

            <Text style={styles.inputLabel}>Select or Enter Amount</Text>
            <View style={styles.presetGrid}>
              {['500', '1000', '2000', '5000'].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.presetBtn,
                    rechargeAmount === amt && styles.presetBtnActive,
                  ]}
                  onPress={() => setRechargeAmount(amt)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      rechargeAmount === amt && styles.presetTextActive,
                    ]}
                  >
                    ₹{parseInt(amt).toLocaleString('en-IN')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={rechargeAmount}
                onChangeText={setRechargeAmount}
              />
            </View>

            <TouchableOpacity
              style={styles.submitRechargeBtn}
              onPress={handlePreRecharge}
              activeOpacity={0.85}
            >
              <Text style={styles.submitRechargeBtnText}>
                Top Up ₹{parseFloat(rechargeAmount || '0').toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Recharge Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirm FASTag Top-Up"
        message={`Deduct ₹${parseFloat(rechargeAmount || '0').toLocaleString('en-IN')} from Haul360 account balance to recharge FASTag for ${vehicle.vehicleNumber}?`}
        confirmText="Confirm Recharge"
        cancelText="Cancel"
        loading={submitting}
        iconName="card-outline"
        iconColor={colors.navy}
        onConfirm={handleConfirmRecharge}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  lowBalanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  lowBalanceTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  lowBalanceSub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 1,
    lineHeight: 16,
  },
  fastagCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagBrand: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  tagId: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  activeTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  cardMiddle: {
    marginVertical: spacing.md,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  balanceVal: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#334155',
    paddingTop: spacing.sm,
  },
  vehLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  vehVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 1,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  rechargeBtnText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  tollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: spacing.sm,
  },
  tollIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plazaName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  tollMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tollAmount: {
    fontSize: 13,
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
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 6,
  },
  presetGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: colors.navy,
  },
  presetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  presetTextActive: {
    color: colors.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
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
  submitRechargeBtn: {
    backgroundColor: colors.navy,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitRechargeBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  switcherHeaderLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  vehTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    gap: 6,
  },
  vehTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  vehTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  vehTabTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
