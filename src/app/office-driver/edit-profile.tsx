import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function OfficeDriverEditProfileScreen() {
  const { currentDriverUser, updateDriverProfile, office } = useTransportOffice();
  const driver = currentDriverUser;

  const [name, setName] = useState(driver?.name || 'Kumar S.');
  const [phone, setPhone] = useState(driver?.phone || '9876543210');
  const [email, setEmail] = useState(driver?.email || 'kumar.driver@haul360.com');
  const [dateOfBirth, setDateOfBirth] = useState(driver?.dateOfBirth || '1992-05-14');
  const [address, setAddress] = useState(driver?.address || '14, Cross Cut Road, Gandhipuram');
  const [city, setCity] = useState(driver?.city || 'Coimbatore');
  const [stateName, setStateName] = useState(driver?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(driver?.pincode || '641012');
  const [licenseExpiry, setLicenseExpiry] = useState(driver?.licenseExpiry || '2028-11-20');

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (driver) {
      updateDriverProfile(driver.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dateOfBirth: dateOfBirth.trim(),
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        licenseExpiry: licenseExpiry.trim(),
      });
    }
    setIsSaved(true);
    setTimeout(() => {
      router.back();
    }, 700);
  };

  const handleCancel = () => {
    router.back();
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
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Driver Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {isSaved && (
            <View style={styles.savedBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginRight: 6 }} />
              <Text style={styles.savedText}>Profile Updated Successfully</Text>
            </View>
          )}

          {/* READ-ONLY / PROTECTED OPERATIONAL DATA */}
          <View style={styles.protectedCard}>
            <View style={styles.protectedHeaderRow}>
              <Ionicons name="lock-closed" size={16} color={colors.navy} />
              <Text style={styles.protectedHeaderTitle}>Protected Operational Info</Text>
            </View>
            <Text style={styles.protectedNotice}>
              These fields are managed by your transport office dispatcher and cannot be edited.
            </Text>

            <View style={styles.protectedFieldRow}>
              <Text style={styles.protectedLabel}>Transport Office:</Text>
              <Text style={styles.protectedVal}>{office.name}</Text>
            </View>

            <View style={styles.protectedFieldRow}>
              <Text style={styles.protectedLabel}>Driver ID:</Text>
              <Text style={styles.protectedVal}>{driver?.id || 'H360-D-1042'}</Text>
            </View>

            <View style={styles.protectedFieldRow}>
              <Text style={styles.protectedLabel}>Driver Status:</Text>
              <View style={styles.badgePillGreen}>
                <Text style={styles.badgePillGreenText}>
                  {driver?.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>
            </View>

            <View style={[styles.protectedFieldRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.protectedLabel}>Operational Availability:</Text>
              <View style={styles.badgePillBlue}>
                <Text style={styles.badgePillBlueText}>{driver?.availability || 'AVAILABLE'}</Text>
              </View>
            </View>
          </View>

          {/* EDITABLE PERSONAL & CONTACT INFO */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal & Contact Details</Text>

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Mobile Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <Input
              label="Residential Address"
              value={address}
              onChangeText={setAddress}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: spacing.xs }}>
                <Input label="City" value={city} onChangeText={setCity} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.xs }}>
                <Input label="State" value={stateName} onChangeText={setStateName} />
              </View>
            </View>

            <Input
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
            />

            <Input
              label="License Expiry Date (YYYY-MM-DD)"
              value={licenseExpiry}
              onChangeText={setLicenseExpiry}
            />
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
  },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  savedText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.green,
  },
  protectedCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: spacing.md,
  },
  protectedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  protectedHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  protectedNotice: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 15,
  },
  protectedFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  protectedLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  protectedVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  badgePillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgePillGreenText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  badgePillBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgePillBlueText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  sectionTitle: {
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
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xxl,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
