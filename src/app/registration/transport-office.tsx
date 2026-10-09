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

  const [managerAadhaar, setManagerAadhaar] = useState('');
  const [managerAadhaarDoc, setManagerAadhaarDoc] = useState<{ name: string; size: string; status: 'PENDING' | 'VERIFIED' | 'REJECTED' } | null>(null);
  const [gstNumber, setGstNumber] = useState('');
  const [gstDoc, setGstDoc] = useState<{ name: string; size: string; status: 'PENDING' | 'VERIFIED' | 'REJECTED' } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectAadhaar = () => {
    setManagerAadhaarDoc({
      name: 'Manager_Aadhaar_Card.pdf',
      size: '1.4 MB',
      status: 'PENDING',
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.managerAadhaarDoc;
      return next;
    });
  };

  const handleSelectGst = () => {
    setGstDoc({
      name: 'GST_Registration_Certificate.pdf',
      size: '2.1 MB',
      status: 'PENDING',
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.gstDoc;
      return next;
    });
  };

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

    // Manager Aadhaar Validation
    const cleanAadhaar = managerAadhaar.replace(/\D/g, '');
    if (!cleanAadhaar) {
      newErrors.managerAadhaar = 'Manager 12-digit Aadhaar number is required';
    } else if (cleanAadhaar.length !== 12) {
      newErrors.managerAadhaar = 'Aadhaar must be exactly 12 digits';
    }
    if (!managerAadhaarDoc) {
      newErrors.managerAadhaarDoc = 'Manager Aadhaar document file is required';
    }

    // GST Validation
    const cleanGst = gstNumber.trim().toUpperCase();
    if (!cleanGst) {
      newErrors.gstNumber = 'GST Registration number (GSTIN) is required';
    } else if (cleanGst.length !== 15) {
      newErrors.gstNumber = 'GSTIN must be 15 alphanumeric characters (e.g. 33AABCT1332L1Z5)';
    }
    if (!gstDoc) {
      newErrors.gstDoc = 'GST Registration certificate document is required';
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
        managerAadhaar: managerAadhaar.trim(),
        managerAadhaarStatus: managerAadhaarDoc?.status || 'PENDING',
        gstNumber: gstNumber.toUpperCase().trim(),
        gstStatus: gstDoc?.status || 'PENDING',
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

          <Text style={styles.successTitle}>Transport Office Registered</Text>
          <Text style={styles.successSubtitle}>
            Your transport office hub account for <Text style={{ fontWeight: 'bold', color: colors.navy }}>{officeName}</Text> has been created with verified business documents.
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
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Manager Aadhaar</Text>
              <View style={styles.pendingBadge}>
                <Ionicons name="time-outline" size={12} color="#B45309" />
                <Text style={styles.pendingText}>Pending Review</Text>
              </View>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>GST Certificate</Text>
              <View style={styles.pendingBadge}>
                <Ionicons name="time-outline" size={12} color="#B45309" />
                <Text style={styles.pendingText}>Pending Review</Text>
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
              Provide your official business details and mandatory regulatory documents.
            </Text>
          </View>

          {/* 1. OFFICE DETAILS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>1. Office Details</Text>

            <Input
              label="Transport Office / Company Name *"
              placeholder="e.g. Haul360 Southern Logistics"
              value={officeName}
              onChangeText={setOfficeName}
              error={errors.officeName}
            />

            <Input
              label="Manager / Contact Person Name *"
              placeholder="e.g. Ramesh Chandran"
              value={managerName}
              onChangeText={setManagerName}
              error={errors.managerName}
            />

            <Input
              label="Official Mobile Number *"
              placeholder="10-digit mobile number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
            />

            <Input
              label="Dispatch Email Address *"
              placeholder="dispatch@company.in"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </View>

          {/* 2. LOCATION & OPERATING HUB */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>2. Location & Operating Hub</Text>

            <Input
              label="Office Address *"
              placeholder="Street address, Industrial area"
              value={address}
              onChangeText={setAddress}
              error={errors.address}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Input
                  label="City *"
                  placeholder="Chennai"
                  value={city}
                  onChangeText={setCity}
                  error={errors.city}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Input
                  label="State *"
                  placeholder="Tamil Nadu"
                  value={stateName}
                  onChangeText={setStateName}
                  error={errors.stateName}
                />
              </View>
            </View>

            <Input
              label="Pincode *"
              placeholder="6-digit PIN code"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
              error={errors.pincode}
            />
          </View>

          {/* 3. MANDATORY BUSINESS DOCUMENTS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>3. Mandatory Business Documents</Text>
            <Text style={styles.docSectionSubtitle}>
              Required for government compliance and freight network verification.
            </Text>

            {/* MANAGER AADHAAR */}
            <View style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.docIconBox}>
                  <Ionicons name="card-outline" size={20} color={colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docTitle}>Manager Aadhaar *</Text>
                  <Text style={styles.docSub}>Identity proof of the registered fleet manager</Text>
                </View>
                <View style={[styles.docStatusBadge, { backgroundColor: managerAadhaarDoc ? '#FEF3C7' : '#F1F5F9' }]}>
                  <Text style={[styles.docStatusText, { color: managerAadhaarDoc ? '#B45309' : '#64748B' }]}>
                    {managerAadhaarDoc ? 'Status: Pending' : 'Required'}
                  </Text>
                </View>
              </View>

              <Input
                label="Manager Aadhaar Number (12 digits) *"
                placeholder="XXXX XXXX XXXX"
                value={managerAadhaar}
                onChangeText={setManagerAadhaar}
                keyboardType="number-pad"
                maxLength={12}
                error={errors.managerAadhaar}
                containerStyle={{ marginTop: spacing.sm }}
              />

              {managerAadhaarDoc ? (
                <View style={styles.uploadedDocRow}>
                  <Ionicons name="document-attach" size={18} color={colors.green} style={{ marginRight: 6 }} />
                  <Text style={styles.uploadedDocName} numberOfLines={1}>
                    {managerAadhaarDoc.name} ({managerAadhaarDoc.size})
                  </Text>
                  <TouchableOpacity onPress={() => setManagerAadhaarDoc(null)} style={styles.removeDocBtn}>
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={handleSelectAadhaar} activeOpacity={0.8}>
                  <Ionicons name="cloud-upload-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
                  <Text style={styles.uploadButtonText}>Upload Manager Aadhaar Document</Text>
                </TouchableOpacity>
              )}
              {errors.managerAadhaarDoc && (
                <Text style={styles.fieldErrorText}>{errors.managerAadhaarDoc}</Text>
              )}
            </View>

            {/* GST REGISTRATION CERTIFICATE */}
            <View style={[styles.docCard, { marginTop: spacing.md }]}>
              <View style={styles.docHeader}>
                <View style={styles.docIconBox}>
                  <Ionicons name="receipt-outline" size={20} color={colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docTitle}>GST Registration Certificate *</Text>
                  <Text style={styles.docSub}>Official 15-character GSTIN business certificate</Text>
                </View>
                <View style={[styles.docStatusBadge, { backgroundColor: gstDoc ? '#FEF3C7' : '#F1F5F9' }]}>
                  <Text style={[styles.docStatusText, { color: gstDoc ? '#B45309' : '#64748B' }]}>
                    {gstDoc ? 'Status: Pending' : 'Required'}
                  </Text>
                </View>
              </View>

              <Input
                label="GSTIN Number (15 chars) *"
                placeholder="e.g. 33AABCT1332L1Z5"
                value={gstNumber}
                onChangeText={(t) => setGstNumber(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={15}
                error={errors.gstNumber}
                containerStyle={{ marginTop: spacing.sm }}
              />

              {gstDoc ? (
                <View style={styles.uploadedDocRow}>
                  <Ionicons name="document-attach" size={18} color={colors.green} style={{ marginRight: 6 }} />
                  <Text style={styles.uploadedDocName} numberOfLines={1}>
                    {gstDoc.name} ({gstDoc.size})
                  </Text>
                  <TouchableOpacity onPress={() => setGstDoc(null)} style={styles.removeDocBtn}>
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={handleSelectGst} activeOpacity={0.8}>
                  <Ionicons name="cloud-upload-outline" size={18} color={colors.navy} style={{ marginRight: 6 }} />
                  <Text style={styles.uploadButtonText}>Upload GST Registration Certificate</Text>
                </TouchableOpacity>
              )}
              {errors.gstDoc && (
                <Text style={styles.fieldErrorText}>{errors.gstDoc}</Text>
              )}
            </View>
          </View>

          {/* 4. SECURITY CREDENTIALS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>4. Security Credentials</Text>

            <View style={styles.passwordWrapper}>
              <Input
                label="Password (min 8 chars) *"
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
                label="Confirm Password *"
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
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.blue} style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Business documents are verified by Haul360 fleet operations. Drivers are registered securely inside your office portal.
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
  docSectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  docCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  docSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  docStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  docStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: 10,
    marginTop: spacing.sm,
  },
  uploadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  uploadedDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  uploadedDocName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  removeDocBtn: {
    padding: 2,
  },
  fieldErrorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
    fontWeight: '500',
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
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B45309',
    marginLeft: 4,
  },
  continueButton: {
    width: '100%',
    backgroundColor: colors.navy,
  },
});
