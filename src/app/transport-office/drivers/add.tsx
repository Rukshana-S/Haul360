import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function AddDriverScreen() {
  const { addDriver, drivers } = useTransportOffice();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');

  // Step 2: Document info
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2029-12-31');

  // Step 3: Generated credentials
  const [generatedDriverId, setGeneratedDriverId] = useState('');
  const [generatedTempPassword, setGeneratedTempPassword] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setStep(1);
    setFullName('');
    setPhone('');
    setEmail('');
    setAge('');
    setAddress('');
    setLicenseNumber('');
    setLicenseExpiry('2029-12-31');
    setGeneratedDriverId('');
    setGeneratedTempPassword('');
    setCopiedField(null);
    setErrors({});
  }, []);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile number is required';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    } else if (drivers.some((d) => d.phone.replace(/\D/g, '') === cleanPhone)) {
      errs.phone = 'Driver with this mobile number already exists in your fleet';
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 20 || ageNum > 65) {
      errs.age = 'Enter valid age (20 - 65)';
    }

    if (!address.trim()) errs.address = 'Residential address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    const cleanLicense = licenseNumber.trim().toUpperCase();

    if (!cleanLicense) {
      errs.licenseNumber = 'Commercial Driving License Number is required';
    } else if (cleanLicense.length < 8) {
      errs.licenseNumber = 'Please enter a valid DL number (min 8 chars)';
    } else if (drivers.some((d) => d.licenseNumber.toUpperCase().trim() === cleanLicense)) {
      errs.licenseNumber = 'Driver with this license number already exists in your fleet';
    }

    if (!licenseExpiry.trim()) {
      errs.licenseExpiry = 'License validity date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        const result = addDriver({
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          age: parseInt(age, 10),
          address: address.trim(),
          licenseNumber: licenseNumber.toUpperCase().trim(),
          licenseExpiry: licenseExpiry.trim(),
          documentStatus: 'VERIFIED',
        });

        setGeneratedDriverId(result.driver.id);
        setGeneratedTempPassword(result.tempPassword);
        setStep(3);
      }
    }
  };

  const handleCopy = (type: 'id' | 'password', value: string) => {
    setCopiedField(type);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
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
            <TouchableOpacity
              onPress={() => {
                if (step === 3) {
                  resetForm();
                  router.back();
                } else if (step > 1) {
                  setStep((step - 1) as any);
                } else {
                  router.back();
                }
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Transport Driver</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* STEP PROGRESS BAR */}
          <View style={styles.stepProgressContainer}>
            <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
              <Text style={[styles.stepDotNumber, step >= 1 && styles.stepDotNumberActive]}>1</Text>
            </View>
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
              <Text style={[styles.stepDotNumber, step >= 2 && styles.stepDotNumberActive]}>2</Text>
            </View>
            <View style={[styles.stepLine, step === 3 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step === 3 && styles.stepDotActive]}>
              <Text style={[styles.stepDotNumber, step === 3 && styles.stepDotNumberActive]}>3</Text>
            </View>
          </View>

          <View style={styles.stepLabelsRow}>
            <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>Personal</Text>
            <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>DL Compliance</Text>
            <Text style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>Credentials</Text>
          </View>

          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <View style={styles.formSection}>
              <View style={styles.noticeBox}>
                <Ionicons name="information-circle-outline" size={18} color={colors.blue} style={{ marginRight: 6 }} />
                <Text style={styles.noticeText}>
                  Drivers are personnel of your Transport Office. Vehicles are assigned during dispatch, not here.
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Driver Personal Details</Text>

              <Input
                label="Full Name (as per Driving License)"
                placeholder="e.g. Kumar Shanmugam"
                value={fullName}
                onChangeText={(val) => {
                  setFullName(val);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                error={errors.fullName}
              />

              <Input
                label="Mobile Number (Login Identifier)"
                placeholder="10-digit mobile number"
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.phone}
              />

              <Input
                label="Email Address (Optional)"
                placeholder="driver@company.in"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Age"
                placeholder="e.g. 34"
                value={age}
                onChangeText={(val) => {
                  setAge(val);
                  if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
                }}
                keyboardType="number-pad"
                maxLength={2}
                error={errors.age}
              />

              <Input
                label="Residential Address"
                placeholder="Full address, City, District"
                value={address}
                onChangeText={(val) => {
                  setAddress(val);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                error={errors.address}
              />

              <Button
                title="Continue to Documents →"
                onPress={handleNextStep}
                style={styles.continueButton}
              />
            </View>
          )}

          {/* STEP 2: DRIVER DOCUMENT INFORMATION */}
          {step === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>License & Compliance</Text>

              <Input
                label="Commercial Driving License Number"
                placeholder="e.g. TN-59-2015-0084321"
                value={licenseNumber}
                onChangeText={(val) => {
                  setLicenseNumber(val);
                  if (errors.licenseNumber) setErrors((prev) => ({ ...prev, licenseNumber: '' }));
                }}
                autoCapitalize="characters"
                error={errors.licenseNumber}
              />

              <Input
                label="License Validity Expiry"
                placeholder="YYYY-MM-DD (e.g. 2029-12-31)"
                value={licenseExpiry}
                onChangeText={(val) => {
                  setLicenseExpiry(val);
                  if (errors.licenseExpiry) setErrors((prev) => ({ ...prev, licenseExpiry: '' }));
                }}
                error={errors.licenseExpiry}
              />

              <View style={styles.uploadCard}>
                <View style={styles.uploadHeader}>
                  <Ionicons name="document-text-outline" size={24} color={colors.navy} />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.uploadTitle}>Driving License Scan / Photo</Text>
                    <Text style={styles.uploadSubtitle}>Verification check verified</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={22} color={colors.green} />
                </View>
                <View style={styles.uploadBadge}>
                  <Text style={styles.uploadBadgeText}>DL FRONT & BACK ATTACHED</Text>
                </View>
              </View>

              <Button
                title="Generate Credentials & Create Driver →"
                onPress={handleNextStep}
                style={styles.continueButton}
              />
            </View>
          )}

          {/* STEP 3: ACCOUNT CREDENTIALS GENERATED */}
          {step === 3 && (
            <View style={styles.credentialsSection}>
              <View style={styles.successIconCircle}>
                <Ionicons name="shield-checkmark" size={48} color={colors.green} />
              </View>

              <Text style={styles.credentialsTitle}>Driver Account Created</Text>
              <Text style={styles.credentialsSubtitle}>
                {fullName} has been registered to your transport office. Provide these temporary credentials to the driver.
              </Text>

              <View style={styles.credentialsCard}>
                <View style={styles.credentialRow}>
                  <View>
                    <Text style={styles.credentialLabel}>DRIVER ID</Text>
                    <Text style={styles.credentialValue}>{generatedDriverId}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy('id', generatedDriverId)}
                  >
                    <Ionicons
                      name={copiedField === 'id' ? 'checkmark' : 'copy-outline'}
                      size={16}
                      color={copiedField === 'id' ? colors.green : colors.navy}
                    />
                    <Text style={[styles.copyBtnText, copiedField === 'id' && { color: colors.green }]}>
                      {copiedField === 'id' ? 'COPIED' : 'COPY'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.credentialRow, { borderBottomWidth: 0 }]}>
                  <View>
                    <Text style={styles.credentialLabel}>TEMPORARY PASSWORD</Text>
                    <Text style={[styles.credentialValue, { color: colors.orange }]}>
                      {generatedTempPassword}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy('password', generatedTempPassword)}
                  >
                    <Ionicons
                      name={copiedField === 'password' ? 'checkmark' : 'copy-outline'}
                      size={16}
                      color={copiedField === 'password' ? colors.green : colors.navy}
                    />
                    <Text style={[styles.copyBtnText, copiedField === 'password' && { color: colors.green }]}>
                      {copiedField === 'password' ? 'COPIED' : 'COPY'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.securityNote}>
                <Ionicons name="lock-closed" size={16} color={colors.slate} style={{ marginRight: 6 }} />
                <Text style={styles.securityNoteText}>
                  The driver will be prompted to create a personal permanent password upon first login into the Haul360 Driver app.
                </Text>
              </View>

              <Button
                title="+ Add Another Driver"
                variant="outline"
                onPress={resetForm}
                style={{ marginBottom: spacing.sm }}
              />

              <Button
                title="Done (Return to Fleet List)"
                onPress={() => {
                  resetForm();
                  router.replace('/transport-office/drivers' as any);
                }}
                style={styles.continueButton}
              />
            </View>
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
  stepProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.navy,
  },
  stepDotNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  stepDotNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  stepLineActive: {
    backgroundColor: colors.navy,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: colors.navy,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  uploadCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  uploadBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginTop: 4,
  },
  uploadBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  continueButton: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
  },
  credentialsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  credentialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  credentialsSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  credentialsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  credentialLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  credentialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
    marginLeft: 4,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 11,
    color: colors.slate,
    lineHeight: 16,
  },
});
