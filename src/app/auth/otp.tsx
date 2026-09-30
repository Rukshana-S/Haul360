import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';

export default function OTPScreen() {
  const { role, identifier } = useLocalSearchParams<{ role: string; identifier?: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [countdown, setCountdown] = useState(30);

  const displayRole = role || 'Driver';
  const displayIdentifier = identifier || '+91 ******1234';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError(undefined);
    // Mock successful OTP verification
    router.push(`/auth/reset-password?role=${encodeURIComponent(displayRole)}` as any);
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(30);
      setOtp('');
      setError(undefined);
      // In a real app, trigger resend OTP here
    }
  };

  return (
    <Screen safeArea scrollable style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Image source={brand.logo} style={styles.logo} contentFit="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.description}>
            Enter the verification code sent to your registered mobile number/email.
          </Text>

          <View style={styles.identifierContainer}>
            <Text style={styles.identifierText}>{displayIdentifier}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="OTP Code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, '');
                if (numeric.length <= 6) {
                  setOtp(numeric);
                  if (error) setError(undefined);
                }
              }}
              error={error}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              style={styles.otpInput}
            />

            <Button 
              title="Verify" 
              onPress={handleVerify} 
              style={styles.verifyButton} 
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
                <Text style={[styles.resendLink, countdown > 0 && styles.resendLinkDisabled]}>
                  Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}
                </Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: spacing.sm,
  },
  logo: {
    width: 130,
    height: 40,
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
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  identifierContainer: {
    backgroundColor: '#F1F5F9',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  identifierText: {
    fontSize: typography.sizes.body,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  form: {
    gap: spacing.md,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: colors.navy,
    marginTop: spacing.md,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodyMedium,
  },
  resendLink: {
    color: colors.blue,
    fontSize: typography.sizes.bodyMedium,
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: colors.textSecondary,
  },
});
