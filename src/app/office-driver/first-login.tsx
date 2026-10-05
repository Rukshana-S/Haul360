import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function DriverFirstLoginScreen() {
  const { currentDriverUser, updateDriverPassword } = useTransportOffice();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = () => {
    setError(null);

    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (currentDriverUser) {
        updateDriverPassword(currentDriverUser.id, newPassword);
      }
      setIsLoading(false);
      router.replace('/office-driver' as any);
    }, 600);
  };

  return (
    <Screen safeArea style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="key" size={40} color={colors.navy} />
          </View>

          <Text style={styles.title}>Welcome, {currentDriverUser?.name || 'Driver'}</Text>
          <Text style={styles.subtitle}>
            Your transport office registered your fleet credentials. Please create your permanent security password to continue to your dashboard.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.accountBox}>
              <Text style={styles.accountLabel}>DRIVER ACCOUNT</Text>
              <Text style={styles.accountValue}>{currentDriverUser?.id || 'H360-D-1045'}</Text>
              <Text style={styles.accountSub}>Transport Hub: Apex Freight Solutions</Text>
            </View>

            <View style={styles.passwordWrapper}>
              <Input
                label="Create New Password (min 8 chars)"
                placeholder="Enter strong password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                containerStyle={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.passwordWrapper, { marginTop: spacing.md }]}>
              <Input
                label="Confirm New Password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                containerStyle={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Button
              title={isLoading ? 'Updating Password...' : 'Save Password & Go to Dashboard →'}
              onPress={handleUpdate}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    padding: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  accountValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  accountSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 38,
    padding: 4,
  },
  submitBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.lg,
  },
});
