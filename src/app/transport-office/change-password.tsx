import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export default function TransportOfficeChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/profile' as any);
    }
  };

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorBanner(null);
    setIsSuccess(false);
  };

  const validateAndSubmit = () => {
    setErrorBanner(null);

    if (!currentPassword.trim()) {
      setErrorBanner('Current password is required.');
      return;
    }

    if (!newPassword) {
      setErrorBanner('New password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorBanner('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorBanner('New password cannot be identical to current password.');
      return;
    }

    if (!confirmPassword) {
      setErrorBanner('Please confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorBanner('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    // Simulate secure credential update
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSuccess(true);
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
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Master Password</Text>
            <View style={{ width: 24 }} />
          </View>

          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={64} color={colors.green} />
              </View>
              <Text style={styles.successTitle}>Password Changed Successfully</Text>
              <Text style={styles.successSubtitle}>
                Your transport office manager credentials have been updated securely. Use your new password on your next login.
              </Text>

              <Button
                title="Done (Return to Hub Profile)"
                onPress={handleBack}
                style={styles.actionBtn}
              />
              <Button
                title="Update Password Again"
                variant="outline"
                onPress={handleResetForm}
                style={{ marginTop: spacing.sm, width: '100%' }}
              />
            </View>
          ) : (
            <>
              {/* SECURITY ADVISORY */}
              <View style={styles.advisoryCard}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.blue} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.advisoryTitle}>Transport Office Security</Text>
                  <Text style={styles.advisoryText}>
                    Ensure your password is at least 8 characters long with a combination of letters, numbers, and symbols.
                  </Text>
                </View>
              </View>

              {errorBanner && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{errorBanner}</Text>
                </View>
              )}

              {/* FORM CARD */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Update Credentials</Text>

                {/* CURRENT PASSWORD */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Current Password</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your current password"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showCurrentPassword}
                      value={currentPassword}
                      onChangeText={(val) => {
                        setCurrentPassword(val);
                        if (errorBanner) setErrorBanner(null);
                      }}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      <Ionicons
                        name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* NEW PASSWORD */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Minimum 8 characters"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={(val) => {
                        setNewPassword(val);
                        if (errorBanner) setErrorBanner(null);
                      }}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Ionicons
                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CONFIRM NEW PASSWORD */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Re-enter your new password"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={(val) => {
                        setConfirmPassword(val);
                        if (errorBanner) setErrorBanner(null);
                      }}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  title={isLoading ? 'Updating Password...' : 'Change Password →'}
                  onPress={validateAndSubmit}
                  disabled={isLoading}
                  style={styles.submitBtn}
                />
              </View>
            </>
          )}
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
  advisoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: spacing.md,
  },
  advisoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  advisoryText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 6,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    backgroundColor: colors.navy,
    marginTop: spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: spacing.md,
  },
  successIconCircle: {
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    width: '100%',
    backgroundColor: colors.navy,
  },
});
