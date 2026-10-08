import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useDriver } from '@/context/DriverContext';

type RegistrationStep = 'SELECTION' | 'FORM' | 'SUCCESS';

const VEHICLE_TYPES = [
  '10-Wheeler Multi-Axle Truck',
  '6-Wheeler Medium Haul Truck',
  '14-Wheeler Heavy Trailer',
  'Closed Container / Dry Van',
  'Open High-Side Flatbed',
  'Refrigerated Container',
];

export default function DriverRegistrationScreen() {
  const { registerDriver } = useDriver();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>('SELECTION');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [preferredCorridor, setPreferredCorridor] = useState('Chennai - Coimbatore');

  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0]);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('10');
  const [vehicleModel, setVehicleModel] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Attached Documents Simulation
  const [attachedDocs, setAttachedDocs] = useState<{
    drivingLicense: boolean;
    rcBook: boolean;
    insurance: boolean;
    permit: boolean;
  }>({
    drivingLicense: true,
    rcBook: true,
    insurance: true,
    permit: false,
  });

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone.trim().replace(/\D/g, ''))) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!licenseNumber.trim()) {
      errs.licenseNumber = 'Commercial Driving License number is required';
    }

    if (!vehicleNumber.trim()) {
      errs.vehicleNumber = 'Commercial vehicle number is required (e.g. TN 38 AB 1234)';
    }

    const capNum = parseFloat(vehicleCapacity);
    if (!vehicleCapacity.trim() || isNaN(capNum) || capNum <= 0) {
      errs.vehicleCapacity = 'Valid payload capacity in tonnes is required';
    }

    if (!vehicleModel.trim()) {
      errs.vehicleModel = 'Vehicle model is required (e.g. Tata Prima 2830.K)';
    }

    if (!attachedDocs.drivingLicense) {
      errs.drivingLicense = 'Driving License copy is required';
    }
    if (!attachedDocs.rcBook) {
      errs.rcBook = 'Vehicle RC Book copy is required';
    }
    if (!attachedDocs.insurance) {
      errs.insurance = 'Commercial Insurance copy is required';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setTimeout(() => {
      const capTonnes = parseFloat(vehicleCapacity) || 10;
      registerDriver({
        name: fullName,
        phone: phone,
        email: email || undefined,
        licenseNumber: licenseNumber,
        experienceYears: parseInt(experienceYears) || 5,
        vehicleType: vehicleType,
        vehicleNumber: vehicleNumber,
        capacityKg: Math.round(capTonnes * 1000),
        model: vehicleModel,
        city: city || 'Chennai',
        state: 'Tamil Nadu',
      });
      setSubmitting(false);
      setCurrentStep('SUCCESS');
    }, 800);
  };

  // STEP 1: CATEGORY SELECTION
  if (currentStep === 'SELECTION') {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="car-sport-outline" size={48} color={colors.navy} />
          </View>
          <Text style={styles.title}>Driver Account Registration</Text>
          <Text style={styles.subtitle}>
            Choose your driver category to proceed with account setup.
          </Text>

          <View style={styles.choiceCard}>
            <View style={styles.choiceHeader}>
              <View style={styles.choiceIconBox}>
                <Ionicons name="person-outline" size={20} color={colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.choiceTitle}>Independent Fleet Driver</Text>
                <Text style={styles.choiceSub}>
                  Self-register to find freight loads, place bids, and manage your commercial vehicle.
                </Text>
              </View>
            </View>
            <Button
              title="Register as Independent Driver →"
              onPress={() => setCurrentStep('FORM')}
              style={{ marginTop: spacing.sm }}
            />
          </View>

          <View style={[styles.choiceCard, { marginTop: spacing.md }]}>
            <View style={styles.choiceHeader}>
              <View style={[styles.choiceIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="business-outline" size={20} color={colors.slate} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.choiceTitle}>Transport Office Driver</Text>
                <Text style={styles.choiceSub}>
                  Accounts are managed by your fleet office. Use credentials provided by your dispatcher.
                </Text>
              </View>
            </View>
            <Button
              title="Go to Office Driver Login"
              variant="outline"
              onPress={() => router.replace('/auth/login?role=Driver' as any)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </Screen>
    );
  }

  // STEP 3: REGISTRATION SUCCESS
  if (currentStep === 'SUCCESS') {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-done" size={48} color={colors.green} />
          </View>

          <Text style={styles.successTitle}>Registration Completed</Text>
          <Text style={styles.successWelcome}>Welcome to Haul360</Text>

          <Text style={styles.successSubtitle}>
            Your Independent Driver account has been successfully created. You can now access verified freight loads, bid on shipments, and manage trips.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Driver Name</Text>
              <Text style={styles.summaryVal}>{fullName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mobile Number</Text>
              <Text style={styles.summaryVal}>{phone}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Driving License</Text>
              <Text style={styles.summaryVal}>{licenseNumber.toUpperCase()}</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Vehicle Registered</Text>
              <Text style={[styles.summaryVal, { color: colors.blue }]}>
                {vehicleNumber.toUpperCase()} ({vehicleCapacity}T)
              </Text>
            </View>
          </View>

          <Button
            title="Continue to Dashboard →"
            onPress={() => router.replace('/driver' as any)}
            style={styles.continueBtn}
          />
        </View>
      </Screen>
    );
  }

  // STEP 2: INDEPENDENT DRIVER REGISTRATION FORM
  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={() => setCurrentStep('SELECTION')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.formHeaderTitle}>Independent Driver Registration</Text>
          <Text style={styles.formHeaderSub}>Complete your verified driver & truck profile</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: PERSONAL INFORMATION */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="person-outline" size={18} color={colors.navy} />
            <Text style={styles.sectionTitle}>1. Personal Information</Text>
          </View>

          <Input
            label="Full Name *"
            placeholder="e.g. Arun Kumar"
            value={fullName}
            onChangeText={(v) => {
              setFullName(v);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            error={errors.fullName}
          />

          <Input
            label="Mobile Phone Number *"
            placeholder="e.g. 9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            error={errors.phone}
          />

          <Input
            label="Email Address"
            placeholder="e.g. arun.freight@gmail.com (Optional)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={errors.email}
          />

          <View style={styles.rowTwoCol}>
            <View style={{ flex: 1 }}>
              <Input
                label="Age / DOB"
                placeholder="e.g. 34"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Home Base City"
                placeholder="e.g. Coimbatore"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: DRIVER INFORMATION */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="card-outline" size={18} color={colors.navy} />
            <Text style={styles.sectionTitle}>2. Driver License & Credentials</Text>
          </View>

          <Input
            label="Commercial Driving License (DL) Number *"
            placeholder="e.g. TN-38-2018-0094821"
            autoCapitalize="characters"
            value={licenseNumber}
            onChangeText={(v) => {
              setLicenseNumber(v);
              if (errors.licenseNumber) setErrors((prev) => ({ ...prev, licenseNumber: '' }));
            }}
            error={errors.licenseNumber}
          />

          <View style={styles.rowTwoCol}>
            <View style={{ flex: 1 }}>
              <Input
                label="Driving Experience (Years)"
                placeholder="e.g. 6"
                keyboardType="numeric"
                value={experienceYears}
                onChangeText={setExperienceYears}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Preferred Route Corridor"
                placeholder="e.g. Chennai - Salem"
                value={preferredCorridor}
                onChangeText={setPreferredCorridor}
              />
            </View>
          </View>
        </View>

        {/* SECTION 3: VEHICLE INFORMATION */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="car-sport-outline" size={18} color={colors.navy} />
            <Text style={styles.sectionTitle}>3. Primary Commercial Vehicle</Text>
          </View>

          <Text style={styles.fieldLabel}>Vehicle Body / Type *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typePillScroll}>
            {VEHICLE_TYPES.map((t) => {
              const isSelected = vehicleType === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.typePill, isSelected && styles.typePillActive]}
                  onPress={() => setVehicleType(t)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.typePillText, isSelected && styles.typePillTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Input
            label="Commercial Vehicle Number *"
            placeholder="e.g. TN 38 AB 1234"
            autoCapitalize="characters"
            value={vehicleNumber}
            onChangeText={(v) => {
              setVehicleNumber(v);
              if (errors.vehicleNumber) setErrors((prev) => ({ ...prev, vehicleNumber: '' }));
            }}
            error={errors.vehicleNumber}
          />

          <View style={styles.rowTwoCol}>
            <View style={{ flex: 1 }}>
              <Input
                label="Payload Capacity (Tonnes) *"
                placeholder="e.g. 10"
                keyboardType="numeric"
                value={vehicleCapacity}
                onChangeText={(v) => {
                  setVehicleCapacity(v);
                  if (errors.vehicleCapacity) setErrors((prev) => ({ ...prev, vehicleCapacity: '' }));
                }}
                error={errors.vehicleCapacity}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Make & Model *"
                placeholder="e.g. Tata Prima 2830.K"
                value={vehicleModel}
                onChangeText={(v) => {
                  setVehicleModel(v);
                  if (errors.vehicleModel) setErrors((prev) => ({ ...prev, vehicleModel: '' }));
                }}
                error={errors.vehicleModel}
              />
            </View>
          </View>
        </View>

        {/* SECTION 4: REQUIRED COMPLIANCE DOCUMENTS */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="document-attach-outline" size={18} color={colors.navy} />
            <Text style={styles.sectionTitle}>4. Compliance Documents (Frontend Select)</Text>
          </View>

          <Text style={styles.docSectionSub}>
            Select or attach compliance credentials for instant driver verification.
          </Text>

          {/* Doc 1: Driving License */}
          <TouchableOpacity
            style={[styles.docItem, attachedDocs.drivingLicense && styles.docItemAttached]}
            onPress={() =>
              setAttachedDocs((prev) => ({ ...prev, drivingLicense: !prev.drivingLicense }))
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name={attachedDocs.drivingLicense ? 'checkmark-circle' : 'add-circle-outline'}
              size={22}
              color={attachedDocs.drivingLicense ? colors.green : colors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.docItemTitle}>Commercial Driving License *</Text>
              <Text style={styles.docItemStatus}>
                {attachedDocs.drivingLicense ? 'Attached: DL_Document_Scan.pdf' : 'Tap to attach document'}
              </Text>
            </View>
          </TouchableOpacity>
          {errors.drivingLicense && <Text style={styles.errorText}>{errors.drivingLicense}</Text>}

          {/* Doc 2: RC Book */}
          <TouchableOpacity
            style={[styles.docItem, attachedDocs.rcBook && styles.docItemAttached]}
            onPress={() => setAttachedDocs((prev) => ({ ...prev, rcBook: !prev.rcBook }))}
            activeOpacity={0.8}
          >
            <Ionicons
              name={attachedDocs.rcBook ? 'checkmark-circle' : 'add-circle-outline'}
              size={22}
              color={attachedDocs.rcBook ? colors.green : colors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.docItemTitle}>Vehicle Registration Certificate (RC Book) *</Text>
              <Text style={styles.docItemStatus}>
                {attachedDocs.rcBook ? 'Attached: RC_Book_Front_Back.pdf' : 'Tap to attach document'}
              </Text>
            </View>
          </TouchableOpacity>
          {errors.rcBook && <Text style={styles.errorText}>{errors.rcBook}</Text>}

          {/* Doc 3: Insurance */}
          <TouchableOpacity
            style={[styles.docItem, attachedDocs.insurance && styles.docItemAttached]}
            onPress={() => setAttachedDocs((prev) => ({ ...prev, insurance: !prev.insurance }))}
            activeOpacity={0.8}
          >
            <Ionicons
              name={attachedDocs.insurance ? 'checkmark-circle' : 'add-circle-outline'}
              size={22}
              color={attachedDocs.insurance ? colors.green : colors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.docItemTitle}>Commercial Comprehensive Insurance *</Text>
              <Text style={styles.docItemStatus}>
                {attachedDocs.insurance ? 'Attached: Insurance_Policy_Copy.pdf' : 'Tap to attach document'}
              </Text>
            </View>
          </TouchableOpacity>
          {errors.insurance && <Text style={styles.errorText}>{errors.insurance}</Text>}

          {/* Doc 4: National Permit */}
          <TouchableOpacity
            style={[styles.docItem, attachedDocs.permit && styles.docItemAttached]}
            onPress={() => setAttachedDocs((prev) => ({ ...prev, permit: !prev.permit }))}
            activeOpacity={0.8}
          >
            <Ionicons
              name={attachedDocs.permit ? 'checkmark-circle' : 'add-circle-outline'}
              size={22}
              color={attachedDocs.permit ? colors.green : colors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.docItemTitle}>National / State Commercial Permit</Text>
              <Text style={styles.docItemStatus}>
                {attachedDocs.permit ? 'Attached: National_Permit_AITP.pdf' : 'Optional - Tap to attach'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION 5: ACCOUNT PASSWORD */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.navy} />
            <Text style={styles.sectionTitle}>5. Security & Password</Text>
          </View>

          <Input
            label="Create Password *"
            placeholder="Enter at least 6 characters"
            secureTextEntry
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={errors.password}
          />

          <Input
            label="Confirm Password *"
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <View style={styles.submitContainer}>
          <Button
            title={submitting ? 'Registering Account...' : 'Complete Registration'}
            onPress={handleRegisterSubmit}
            disabled={submitting}
            style={styles.submitBtn}
          />
          {submitting && <ActivityIndicator size="small" color={colors.navy} style={{ marginTop: 8 }} />}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.heading2,
    color: colors.navy,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  choiceCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  choiceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  choiceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  choiceSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  formHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  formHeaderSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  rowTwoCol: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: typography.sizes.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: typography.weights.medium as any,
  },
  typePillScroll: {
    marginBottom: spacing.md,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  typePillText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  typePillTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  docSectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  docItemAttached: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  docItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  docItemStatus: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.bodySmall,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  submitContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  submitBtn: {
    backgroundColor: colors.navy,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 60,
  },
  successIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.sizes.heading2,
    fontWeight: '900',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 4,
  },
  successWelcome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: colors.navy,
  },
});
