import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

export default function WithdrawScreen() {
  const { withdrawableBalance, withdrawMoney } = useDriver();
  const [amountInput, setAmountInput] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const parsedAmount = parseFloat(amountInput) || 0;

  const handlePreSubmit = () => {
    if (parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than ₹0.');
      return;
    }
    if (parsedAmount > withdrawableBalance) {
      Alert.alert('Insufficient Balance', `You can withdraw up to ₹${withdrawableBalance.toLocaleString('en-IN')}.`);
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      const res = withdrawMoney(parsedAmount, 'HDFC Bank ****4821');
      setSubmitting(false);
      setConfirmModalVisible(false);
      if (res.success) {
        Alert.alert(
          'Withdrawal Initiated',
          `₹${parsedAmount.toLocaleString('en-IN')} has been transferred to your registered bank account via IMPS.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', res.message);
      }
    }, 600);
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Withdraw Funds</Text>
          <Text style={styles.headerSubtitle}>Direct IMPS Transfer to Registered Bank</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Available Balance Box */}
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
          <Text style={styles.balanceAmount}>₹{withdrawableBalance.toLocaleString('en-IN')}</Text>
          <Text style={styles.settlementSub}>Settled earnings available for immediate payout</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Enter Withdrawal Amount</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              value={amountInput}
              onChangeText={setAmountInput}
            />
          </View>

          {/* Presets */}
          <View style={styles.presetRow}>
            {[2000, 5000, 10000, withdrawableBalance].map((val, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetBtn}
                onPress={() => setAmountInput(val.toString())}
              >
                <Text style={styles.presetBtnText}>
                  {val === withdrawableBalance ? 'All' : `₹${(val / 1000).toFixed(0)}k`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Destination Bank Details */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Receiving Bank Account</Text>
          <View style={styles.bankRow}>
            <View style={styles.bankIconCircle}>
              <Ionicons name="business" size={20} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankName}>HDFC Bank Ltd.</Text>
              <Text style={styles.accountText}>Account: **********4821</Text>
              <Text style={styles.ifscText}>IFSC: HDFC0001249 • Name: Arun Kumar</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color={colors.green} />
          </View>
        </View>

        {/* Important notes */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.navy} />
          <Text style={styles.noteText}>
            IMPS transfers are credited within 15 minutes 24/7. No processing fee applied.
          </Text>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (parsedAmount <= 0 || parsedAmount > withdrawableBalance) && styles.submitBtnDisabled,
          ]}
          disabled={parsedAmount <= 0 || parsedAmount > withdrawableBalance}
          onPress={handlePreSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>
            Withdraw ₹{parsedAmount.toLocaleString('en-IN')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirm Bank Withdrawal"
        message={`Transfer ₹${parsedAmount.toLocaleString('en-IN')} to HDFC Bank ****4821?`}
        confirmText="Confirm Transfer"
        cancelText="Cancel"
        loading={submitting}
        iconName="wallet-outline"
        iconColor={colors.navy}
        onConfirm={handleConfirm}
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
  balanceBox: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    marginVertical: 2,
  },
  settlementSub: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
    marginBottom: spacing.sm,
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
    paddingVertical: 0,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bankIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  accountText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  ifscText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: colors.navy,
    lineHeight: 16,
  },
  submitBtn: {
    backgroundColor: colors.navy,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
