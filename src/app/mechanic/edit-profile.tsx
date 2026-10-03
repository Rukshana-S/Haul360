import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAuth } from '@/context/AuthContext';
import { useMechanic } from '@/context/MechanicContext';

const AVAILABLE_SERVICES = [
  'Engine & Powertrain Diagnostics',
  'Air Brakes & Pneumatic Overhaul',
  'Heavy Electricals & Alternators',
  'Hydraulic Steering & Suspension',
  'Tyre Replacement & 50T Jacking',
  'BS-VI DEF & Exhaust SCR Service',
  'Differential & Gearbox Repair',
  'Radiator & Cooling System Flush',
  'Leaf Spring & Bushing Replacement',
];

const AVAILABLE_VEHICLE_TYPES = [
  '16-22 Wheeler Multi-Axle',
  'Heavy Dumpers & Tippers',
  'Tractor Trailers & Pullers',
  'LCVs & Cargo Vans',
  'Commercial Buses',
  'Tankers & Hazardous Cargo',
];

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { profile, updateProfile } = useMechanic();

  const [firstName, setFirstName] = useState(profile.firstName || user?.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || user?.lastName || '');
  const [email, setEmail] = useState(profile.email || user?.email || '');
  const [mobile, setMobile] = useState(profile.mobile || user?.mobile || '');
  const [workshopName, setWorkshopName] = useState(profile.workshopName || '');
  const [workshopAddress, setWorkshopAddress] = useState(profile.workshopAddress || '');
  const [city, setCity] = useState(profile.city || '');
  const [state, setState] = useState(profile.state || '');
  const [pincode, setPincode] = useState(profile.pincode || '');
  const [yearsOfExperience, setYearsOfExperience] = useState(profile.yearsOfExperience || '');
  const [mechanicType, setMechanicType] = useState(profile.mechanicType || '');
  const [coverageRadius, setCoverageRadius] = useState(profile.coverageRadius || '35 km Patrol Ring');

  const [selectedServices, setSelectedServices] = useState<string[]>(profile.services || []);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>(profile.vehicleTypes || []);

  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const toggleVehicleType = (vType: string) => {
    setSelectedVehicleTypes((prev) =>
      prev.includes(vType) ? prev.filter((v) => v !== vType) : [...prev, vType]
    );
  };

  const handleSave = () => {
    if (!firstName.trim()) {
      setErrorMsg('Please enter your first name.');
      return;
    }
    if (!workshopName.trim()) {
      setErrorMsg('Please enter your workshop name.');
      return;
    }

    setErrorMsg(null);

    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      workshopName: workshopName.trim(),
      workshopAddress: workshopAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      yearsOfExperience: yearsOfExperience.trim(),
      mechanicType: mechanicType.trim(),
      coverageRadius: coverageRadius.trim(),
      services: selectedServices.length > 0 ? selectedServices : profile.services,
      vehicleTypes: selectedVehicleTypes.length > 0 ? selectedVehicleTypes : profile.vehicleTypes,
    });

    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      router.back();
    }, 1200);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update workshop details & specialized skills</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notice Banner */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.blue} style={styles.noticeIcon} />
          <Text style={styles.noticeText}>
            Profile changes are saved locally for this terminal session. Verification status remains linked to your authenticated phone number.
          </Text>
        </View>

        {/* Success / Error Message */}
        {isSaved && (
          <View style={styles.successMsg}>
            <Ionicons name="checkmark-circle" size={18} color="#166534" style={{ marginRight: 6 }} />
            <Text style={styles.successText}>Profile updated successfully! Returning...</Text>
          </View>
        )}

        {errorMsg && (
          <View style={styles.errorMsg}>
            <Ionicons name="alert-circle" size={18} color="#991B1B" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Section: Personal Info */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Personal Information</Text>

          <View style={styles.rowTwoCols}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.xs }]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.xs }]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number (Registered)</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={mobile}
              editable={false}
              placeholder="Mobile Number"
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.fieldNote}>Mobile number is bound to your authenticated Haul360 account.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="name@example.com"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Section: Workshop Info */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Workshop & Hub Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workshop Name *</Text>
            <TextInput
              style={styles.input}
              value={workshopName}
              onChangeText={setWorkshopName}
              placeholder="e.g. Verma Commercial Fleet Hub"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workshop Address</Text>
            <TextInput
              style={styles.input}
              value={workshopAddress}
              onChangeText={setWorkshopAddress}
              placeholder="Street / Plaza address"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.rowThreeCols}>
            <View style={[styles.inputGroup, { flex: 1.2, marginRight: 4 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1.2, marginHorizontal: 4 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="State"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 4 }]}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
                placeholder="Pincode"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patrol Ring / Dispatch Coverage Radius</Text>
            <TextInput
              style={styles.input}
              value={coverageRadius}
              onChangeText={setCoverageRadius}
              placeholder="e.g. 35 km Patrol Ring"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Section: Experience */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Experience & Specialization</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              placeholder="e.g. 12+ Years"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialization Title / Mechanic Type</Text>
            <TextInput
              style={styles.input}
              value={mechanicType}
              onChangeText={setMechanicType}
              placeholder="e.g. Master Diesel & Pneumatics Specialist"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Section: Services Offered */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Services Offered</Text>
          <Text style={styles.fieldNote}>Select the breakdown and overhaul services you provide:</Text>

          <View style={styles.chipsWrap}>
            {AVAILABLE_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service);
              return (
                <TouchableOpacity
                  key={service}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleService(service)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`Toggle service ${service}`}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                    size={14}
                    color={isSelected ? '#1E3A8A' : '#64748B'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.chipText, isSelected && styles.chipActiveText]}>{service}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section: Vehicle Types */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Supported Vehicle Types</Text>
          <Text style={styles.fieldNote}>Select heavy vehicle categories supported in your mobile workshop:</Text>

          <View style={styles.chipsWrap}>
            {AVAILABLE_VEHICLE_TYPES.map((vType) => {
              const isSelected = selectedVehicleTypes.includes(vType);
              return (
                <TouchableOpacity
                  key={vType}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleVehicleType(vType)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`Toggle vehicle type ${vType}`}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                    size={14}
                    color={isSelected ? '#1E3A8A' : '#64748B'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.chipText, isSelected && styles.chipActiveText]}>{vType}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cancel editing"
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Save profile changes"
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: spacing.md,
    padding: 4,
  },
  headerTitleBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: spacing.sm,
    borderRadius: 10,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  noticeIcon: {
    marginRight: spacing.xs,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 15,
  },
  successMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successText: {
    color: '#166534',
    fontWeight: '700',
    fontSize: 13,
  },
  errorMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#991B1B',
    fontWeight: '700',
    fontSize: 13,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 13,
    color: colors.navy,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  fieldNote: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  rowThreeCols: {
    flexDirection: 'row',
  },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: colors.blue,
  },
  chipText: {
    fontSize: 11,
    color: '#475569',
  },
  chipActiveText: {
    color: '#1E3A8A',
    fontWeight: '700',
  },

  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: colors.navy,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
