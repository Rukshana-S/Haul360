import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export default function ForgotPasswordScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | undefined>();

  const displayRole = role || 'Driver';

  const handleSendOTP = () => {
    if (!identifier.trim()) {
      setError('Mobile Number / Email is required');
      return;
    }

    setError(undefined);
    // Mock navigating to OTP screen
    router.push(`/auth/otp?role=${encodeURIComponent(displayRole)}&identifier=${encodeURIComponent(identifier)}` as any);
  };

  return (
    <Screen safeArea scrollable style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.description}>
            Enter your registered mobile number or email to receive a verification code.
          </Text>

          <View style={styles.form}>
            <Input
              label="Mobile Number / Email"
              placeholder="Enter mobile number or email"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (error) setError(undefined);
              }}
              error={error}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Button 
              title="Send OTP" 
              onPress={handleSendOTP} 
              style={styles.submitButton} 
            />

            <TouchableOpacity onPress={() => router.back()} style={styles.backToLogin}>
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  backText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.heading2,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  form: {
    gap: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.navy,
    marginTop: spacing.md,
  },
  backToLogin: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  backToLoginText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodyMedium,
    fontWeight: '500',
  },
});
