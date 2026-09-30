import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const displayRole = role || 'Driver';

  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [identifier, setIdentifier] = useState('98765 43210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (displayRole === 'Mechanic') {
      router.replace('/mechanic' as any);
    } else {
      alert(`Login Successful for ${displayRole} (Mock)`);
    }
  };

  const navigateToForgot = () => {
    router.push(`/auth/forgot-password?role=${encodeURIComponent(displayRole)}` as any);
  };

  const navigateToRegister = () => {
    router.push(`/registration?role=${encodeURIComponent(displayRole)}` as any);
  };

  return (
    <Screen safeArea style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerTop}>
            <Image 
              source={brand.logo} 
              style={styles.logo} 
              contentFit="contain" 
            />
            <View style={styles.systemBadge}>
              <View style={styles.dotGreen} />
              <Text style={styles.systemBadgeText}>FLEET SYSTEM ONLINE</Text>
            </View>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to your Haul360 freight network account</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tab, loginMethod === 'mobile' && styles.tabActive]}
                onPress={() => setLoginMethod('mobile')}
              >
                <Ionicons 
                  name="phone-portrait-outline" 
                  size={15} 
                  color={loginMethod === 'mobile' ? colors.navy : colors.textSecondary} 
                  style={{ marginRight: 6 }} 
                />
                <Text style={[styles.tabText, loginMethod === 'mobile' && styles.tabTextActive]}>Mobile No.</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, loginMethod === 'email' && styles.tabActive]}
                onPress={() => setLoginMethod('email')}
              >
                <Ionicons 
                  name="mail-outline" 
                  size={15} 
                  color={loginMethod === 'email' ? colors.navy : colors.textSecondary} 
                  style={{ marginRight: 6 }} 
                />
                <Text style={[styles.tabText, loginMethod === 'email' && styles.tabTextActive]}>Email Address</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputHeaderRow}>
              <Text style={styles.inputLabel}>{loginMethod === 'mobile' ? 'Mobile Number' : 'Email Address'}</Text>
              <Text style={styles.inputSubLabel}>Driver & Fleet Dispatch</Text>
            </View>

            {loginMethod === 'mobile' ? (
              <View style={styles.inputWrapper}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>IN +91</Text>
                  <Ionicons name="chevron-down" size={12} color={colors.navy} style={{ marginLeft: 2 }} />
                </View>
                <Text style={styles.inputText}>{identifier}</Text>
                <Ionicons name="bus-outline" size={18} color={colors.textSecondary} />
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <Text style={styles.inputText}>driver@haul360.com</Text>
              </View>
            )}

            <View style={[styles.inputHeaderRow, {marginTop: spacing.md}]}>
              <Text style={styles.inputLabel}>Security Password</Text>
              <TouchableOpacity onPress={navigateToForgot}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.passwordDots}>{showPassword ? password : '••••••••••••'}</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={18} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.blackButton} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.blackButtonText}>Login to Haul360 →</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.quickLoginButton}
              onPress={() => router.push(`/auth/otp?role=${encodeURIComponent(displayRole)}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.quickLoginLeft}>
                <Ionicons name="flash-outline" size={18} color={colors.navy} style={{ marginRight: 8 }} />
                <Text style={styles.quickLoginText}>Login with Quick OTP</Text>
              </View>
              <View style={styles.fastTrackBadge}>
                <Text style={styles.fastTrackText}>Fast Track</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.securityBox}>
            <View style={styles.securityIconBox}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.blue} />
            </View>
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>256-bit Encrypted Telematics</Text>
              <Text style={styles.securityDesc}>Authorized Indian National Permit & Carrier Access</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 150,
    height: 48,
    marginBottom: spacing.sm,
  },
  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  systemBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
    elevation: 2,
    marginBottom: spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  tabIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.navy,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  inputSubLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  forgotText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: '#FFFFFF', // For the mobile one, the image shows very faint background or white
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  prefixIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  prefixText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  prefixCaret: {
    fontSize: 12,
    color: colors.navy,
    marginLeft: 4,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: colors.navy,
  },
  inputRightIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  passwordDots: {
    flex: 1,
    fontSize: 18,
    color: colors.navy,
    letterSpacing: 2,
    paddingTop: 6, // to align dots
  },
  blackButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  blackButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    letterSpacing: 0.5,
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    padding: spacing.md,
  },
  quickLoginLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickLoginIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  quickLoginText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  fastTrackBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fastTrackText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.navy,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  securityIconBox: {
    marginRight: spacing.sm,
  },
  securityIcon: {
    fontSize: 20,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  securityDesc: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    textDecorationLine: 'underline',
  },
});
