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

export default function ResetPasswordScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const displayRole = role || 'Driver';

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 7) strength += 1;
    if (pwd.match(/[a-z]+/)) strength += 1;
    if (pwd.match(/[A-Z]+/)) strength += 1;
    if (pwd.match(/[0-9]+/)) strength += 1;
    if (pwd.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const strength = calculateStrength(password);

  const getStrengthColor = () => {
    if (password.length === 0) return colors.border;
    if (strength <= 2) return colors.error; // Weak
    if (strength <= 4) return colors.orange; // Medium
    return colors.green; // Strong
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const handleReset = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Mock successful password reset
    alert('Password Reset Successfully!');
    router.replace(`/auth/login?role=${encodeURIComponent(displayRole)}` as any);
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
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.description}>
            Your new password must be different from previous used passwords.
          </Text>

          <View style={styles.form}>
            <View style={styles.passwordContainer}>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                error={errors.password}
                secureTextEntry={!showPassword}
                containerStyle={styles.passwordInput}
              />
              <TouchableOpacity 
                style={styles.showHideButton} 
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  <View style={[styles.strengthBar, strength >= 1 && { backgroundColor: getStrengthColor() }]} />
                  <View style={[styles.strengthBar, strength >= 3 && { backgroundColor: getStrengthColor() }]} />
                  <View style={[styles.strengthBar, strength >= 5 && { backgroundColor: getStrengthColor() }]} />
                </View>
                <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{getStrengthLabel()}</Text>
              </View>
            )}

            <View style={styles.passwordContainer}>
              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                error={errors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                containerStyle={styles.passwordInput}
              />
              <TouchableOpacity 
                style={styles.showHideButton} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <Button 
              title="Reset Password" 
              onPress={handleReset} 
              style={styles.submitButton} 
            />
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    marginBottom: 0,
  },
  showHideButton: {
    position: 'absolute',
    right: spacing.md,
    top: 36, // Adjust based on label + padding
  },
  showHideText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    fontWeight: '500',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  strengthBars: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.xs,
    marginRight: spacing.md,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: typography.sizes.caption,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: colors.navy,
    marginTop: spacing.lg,
  },
});
