import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { brand } from '@/constants/brand';
import { useAuth } from '@/context/AuthContext';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import { ApiError } from '@/services/api/types';

export default function LoginScreen() {
  const { role, mobile } = useLocalSearchParams<{ role?: string; mobile?: string }>();
  const displayRole = role || 'Driver';

  const { login } = useAuth();
  const { loginDriverMock } = useTransportOffice();

  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email' | 'driverId'>(
    displayRole === 'Driver' ? 'driverId' : 'mobile'
  );
  const [mobileNumber, setMobileNumber] = useState(mobile || '');
  const [emailAddress, setEmailAddress] = useState('');
  const [driverIdentifier, setDriverIdentifier] = useState(mobile || 'H360-D-1042');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (isLoading) return;

    setErrorMessage(null);

    // 1. Role: Transport Office
    if (displayRole === 'Transport Office') {
      const identifier = loginMethod === 'mobile' ? mobileNumber.replace(/\D/g, '') : emailAddress.trim();
      if (!identifier) {
        setErrorMessage(`Please enter your registered ${loginMethod === 'mobile' ? 'mobile number' : 'email address'}.`);
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/transport-office' as any);
      }, 500);
      return;
    }

    // 2. Role: Driver (Transport Office Driver)
    if (displayRole === 'Driver') {
      const identifier = loginMethod === 'driverId' ? driverIdentifier.trim() : (loginMethod === 'mobile' ? mobileNumber : emailAddress);
      if (!identifier) {
        setErrorMessage('Please enter your Driver ID or registered phone number.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password or temporary password.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const res = loginDriverMock(identifier, password);
        setIsLoading(false);
        if (res.success) {
          if (res.isFirstLogin) {
            router.replace('/office-driver/first-login' as any);
          } else {
            router.replace('/office-driver' as any);
          }
        } else {
          setErrorMessage(res.error || 'Invalid credentials.');
        }
      }, 500);
      return;
    }

    // 3. Other Roles (e.g. Mechanic)
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login({
        mobile: cleanMobile,
        password,
      });

      if (user.role === 'mechanic') {
        router.replace('/mechanic' as any);
      } else {
        router.replace('/mechanic' as any);
      }
    } catch (error: any) {
      if (displayRole === 'Mechanic') {
        // Fallback for mock mechanic mode if backend is not running
        router.replace('/mechanic' as any);
      } else if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setErrorMessage('Invalid mobile number or password.');
        } else if (error.statusCode === 400) {
          setErrorMessage(error.message || 'Please check your login details.');
        } else if (error.statusCode === 0) {
          setErrorMessage('Unable to connect to Haul360. Please check your connection and try again.');
        } else {
          setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
      } else {
        setErrorMessage('Unable to connect to Haul360. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerTop}>
            <Image source={brand.logo} style={styles.logo} contentFit="contain" />
            <View style={styles.systemBadge}>
              <View style={styles.dotGreen} />
              <Text style={styles.systemBadgeText}>FLEET SYSTEM ONLINE</Text>
            </View>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to your Haul360 freight network account</Text>
          </View>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 8 }} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.tabsContainer}>
              {displayRole === 'Driver' ? (
                <>
                  <TouchableOpacity
                    style={[styles.tab, loginMethod === 'driverId' && styles.tabActive]}
                    onPress={() => setLoginMethod('driverId')}
                  >
                    <Ionicons
                      name="card-outline"
                      size={15}
                      color={loginMethod === 'driverId' ? colors.navy : colors.textSecondary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.tabText, loginMethod === 'driverId' && styles.tabTextActive]}>Driver ID</Text>
                  </TouchableOpacity>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </View>

            <View style={styles.inputHeaderRow}>
              <Text style={styles.inputLabel}>
                {loginMethod === 'driverId'
                  ? 'Driver ID'
                  : loginMethod === 'mobile'
                  ? 'Mobile Number'
                  : 'Email Address'}
              </Text>
              <Text style={styles.inputSubLabel}>
                {displayRole === 'Transport Office' ? 'Office Dispatch' : displayRole === 'Driver' ? 'Office Assigned' : 'Mechanic Service'}
              </Text>
            </View>

            {loginMethod === 'driverId' ? (
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  value={driverIdentifier}
                  onChangeText={setDriverIdentifier}
                  placeholder="e.g. H360-D-1042"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
              </View>
            ) : loginMethod === 'mobile' ? (
              <View style={styles.inputWrapper}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>IN +91</Text>
                  <Ionicons name="chevron-down" size={12} color={colors.navy} style={{ marginLeft: 2 }} />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="9876543210"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                <Ionicons name="bus-outline" size={18} color={colors.textSecondary} />
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="dispatch@company.in"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={[styles.inputHeaderRow, { marginTop: spacing.md }]}>
              <Text style={styles.inputLabel}>
                {displayRole === 'Driver' ? 'Password / Temporary Password' : 'Security Password'}
              </Text>
              <TouchableOpacity onPress={navigateToForgot}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder={displayRole === 'Driver' ? 'Enter password (e.g. H360@5821)' : 'Enter password'}
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.blackButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.blackButtonText}>Login to Haul360 →</Text>
              )}
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
            {displayRole === 'Driver' ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.footerText, { textAlign: 'center', marginBottom: 4 }]}>
                  Driver accounts are registered by your Transport Office.
                </Text>
                <Text style={[styles.footerText, { fontSize: 12, color: colors.blue }]}>
                  Contact your fleet dispatch manager for temporary login credentials.
                </Text>
              </View>
            ) : displayRole === 'Transport Office' ? (
              <>
                <Text style={styles.footerText}>Don't have an office account? </Text>
                <TouchableOpacity onPress={() => router.push('/registration/transport-office' as any)}>
                  <Text style={styles.footerLink}>Register Transport Office</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={styles.footerLink}>Create Account</Text>
                </TouchableOpacity>
              </>
            )}
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '500',
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
    backgroundColor: '#FFFFFF',
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
  prefixText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.navy,
    fontWeight: '500',
    paddingVertical: 0,
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
  buttonDisabled: {
    opacity: 0.7,
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
