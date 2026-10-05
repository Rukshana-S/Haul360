import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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

export default function TransportOfficeRegistrationScreen() {
  const { updateOfficeProfile } = useTransportOffice();

  const [officeName, setOfficeName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!officeName.trim()) newErrors.officeName = 'Office / Company Name is required';
    if (!managerName.trim()) newErrors.managerName = 'Manager / Contact Person Name is required';

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!address.trim()) newErrors.address = 'Office address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!stateName.trim()) newErrors.stateName = 'State is required';

    const cleanPincode = pincode.replace(/\D/g, '');
    if (!cleanPincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (cleanPincode.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian pincode';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      updateOfficeProfile({
        name: officeName.trim(),
        managerName: managerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
      });
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  if (isSuccess) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          </View>

          <Text style={styles.successTitle}>Transport Office Registered Successfully</Text>
          <Text style={styles.successSubtitle}>
            Your transport office hub account for <Text style={{ fontWeight: 'bold', color: colors.navy }}>{officeName}</Text> has been created in the Haul360 freight network.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Office ID</Text>
              <Text style={styles.summaryValue}>OFFICE-001</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Manager</Text>
              <Text style={styles.summaryValue}>{managerName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Operating Hub</Text>
              <Text style={styles.summaryValue}>{city}, {stateName}</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Status</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color={colors.green} />
                <Text style={styles.verifiedText}>Network Verified</Text>
              </View>
            </View>
          </View>

          <Button
            title="Continue to Login"
            onPress={() => router.replace('/auth/login?role=Transport%20Office' as any)}
            style={styles.continueButton}
          />
        </View>
      </Screen>
    );
  }

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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <View style={styles.headerBadge}>
              <Ionicons name="business-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.headerBadgeText}>FLEET DISPATCH HUB</Text>
            </View>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Register Transport Office</Text>
            <Text style={styles.subtitle}>
              Manage your drivers, vehicle assets, and dispatch assignments.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Office Details</Text>

            <Input
              label="Transport Office / Company Name"
              placeholder="e.g. Apex Freight Solutions"
              value={officeName}
              onChangeText={setOfficeName}
              error={errors.officeName}
            />

            <Input
              label="Manager / Contact Person Name"
              placeholder="e.g. Ramesh Chandran"
              value={managerName}
              onChangeText={setManagerName}
              error={errors.managerName}
            />

            <Input
              label="Official Mobile Number"
              placeholder="10-digit mobile number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
            />

            <Input
              label="Dispatch Email Address"
              placeholder="dispatch@company.in"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Location & Operating Hub</Text>

            <Input
              label="Office Address"
              placeholder="Street address, Industrial area"
              value={address}
              onChangeText={setAddress}
              error={errors.address}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Input
                  label="City"
                  placeholder="Chennai"
                  value={city}
                  onChangeText={setCity}
                  error={errors.city}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Input
                  label="State"
                  placeholder="Tamil Nadu"
                  value={stateName}
                  onChangeText={setStateName}
                  error={errors.stateName}
                />
              </View>
            </View>

            <Input
              label="Pincode"
              placeholder="6-digit PIN code"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
              error={errors.pincode}
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Security Credentials</Text>

            <View style={styles.passwordWrapper}>
              <Input
                label="Password (min 8 chars)"
                placeholder="Enter strong password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
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
                label="Confirm Password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
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
          </View>

          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={20} color={colors.blue} style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Transport Office drivers are added directly from your dashboard after registration. Drivers do not self-register.
            </Text>
          </View>

          <Button
            title={isLoading ? 'Registering Office...' : 'Complete Registration →'}
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
            style={styles.submitButton}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginRowText}>Already registered your office? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login?role=Transport%20Office' as any)}>
              <Text style={styles.loginRowLink}>Sign In</Text>
            </TouchableOpacity>
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
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.navy,
    letterSpacing: 0.5,
  },
  titleSection: {
    marginBottom: spacing.lg,
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
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.navy,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: colors.navy,
    marginBottom: spacing.lg,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  loginRowText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loginRowLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    textDecorationLine: 'underline',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.green,
    marginLeft: 4,
  },
  continueButton: {
    width: '100%',
    backgroundColor: colors.navy,
  },
});
