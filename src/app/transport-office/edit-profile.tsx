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
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function EditTransportOfficeProfile() {
  const { office, updateOfficeProfile } = useTransportOffice();

  const [officeName, setOfficeName] = useState(office.name);
  const [managerName, setManagerName] = useState(office.managerName);
  const [phone, setPhone] = useState(office.phone);
  const [email, setEmail] = useState(office.email);
  const [address, setAddress] = useState(office.address);
  const [city, setCity] = useState(office.city);
  const [stateName, setStateName] = useState(office.state);
  const [pincode, setPincode] = useState(office.pincode);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
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
    setIsSaved(true);
    setTimeout(() => {
      router.back();
    }, 600);
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Office Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {isSaved && (
            <View style={styles.savedBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginRight: 6 }} />
              <Text style={styles.savedText}>Profile updated successfully!</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Office & Hub Information</Text>

            <Input
              label="Office / Transport Company Name"
              value={officeName}
              onChangeText={setOfficeName}
            />

            <Input
              label="Operations Manager Name"
              value={managerName}
              onChangeText={setManagerName}
            />

            <Input
              label="Official Mobile Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label="Dispatch Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Facility / Yard Address"
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
          </View>

          <Button
            title="Save Profile Changes"
            onPress={handleSave}
            style={styles.saveBtn}
          />
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
  saveBtn: {
    backgroundColor: colors.navy,
    marginBottom: spacing.lg,
  },
});
