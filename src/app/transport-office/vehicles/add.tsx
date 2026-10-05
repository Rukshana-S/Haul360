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

const VEHICLE_TYPES = [
  '6-Wheeler Medium (5,000 KG)',
  '10-Wheeler Heavy (10,000 KG)',
  '12-Wheeler Container (14,000 KG)',
  '14-Wheeler Heavy (15,000 KG)',
  '18-Wheeler Multi-Axle (20,000 KG)',
];

export default function AddVehicleScreen() {
  const { addVehicle } = useTransportOffice();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectedType, setSelectedType] = useState('10-Wheeler Heavy (10,000 KG)');
  const [model, setModel] = useState('');
  const [capacityKg, setCapacityKg] = useState('10000');
  const [fuelType, setFuelType] = useState<'Diesel' | 'CNG' | 'Electric'>('Diesel');
  const [rcNumber, setRcNumber] = useState('');
  const [insuranceStatus, setInsuranceStatus] = useState<'VALID' | 'EXPIRING_SOON' | 'EXPIRED'>('VALID');
  const [permitStatus, setPermitStatus] = useState<'NATIONAL_PERMIT' | 'STATE_PERMIT'>('NATIONAL_PERMIT');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectType = (typeStr: string) => {
    setSelectedType(typeStr);
    if (typeStr.includes('5,000')) setCapacityKg('5000');
    else if (typeStr.includes('10,000')) setCapacityKg('10000');
    else if (typeStr.includes('14,000')) setCapacityKg('14000');
    else if (typeStr.includes('15,000')) setCapacityKg('15000');
    else if (typeStr.includes('20,000')) setCapacityKg('20000');
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    const cleanNumber = vehicleNumber.replace(/\s+/g, '').toUpperCase();
    if (!cleanNumber) {
      errs.vehicleNumber = 'Registration vehicle number is required';
    } else if (cleanNumber.length < 6) {
      errs.vehicleNumber = 'Enter a valid vehicle registration number (e.g. TN38AB1234)';
    }

    if (!model.trim()) errs.model = 'Model / Chassis name is required';

    const capNum = parseInt(capacityKg, 10);
    if (!capacityKg || isNaN(capNum) || capNum <= 0) {
      errs.capacityKg = 'Enter valid payload capacity in KG';
    }

    if (!rcNumber.trim()) {
      errs.rcNumber = 'RC Registration certificate number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    addVehicle({
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleType: selectedType.split('(')[0].trim(),
      model: model.trim(),
      capacityKg: parseInt(capacityKg, 10),
      fuelType,
      rcNumber: rcNumber.toUpperCase().trim(),
      insuranceStatus,
      permitStatus,
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          </View>
          <Text style={styles.successTitle}>Vehicle Added Successfully</Text>
          <Text style={styles.successSubtitle}>
            Vehicle <Text style={{ fontWeight: 'bold', color: colors.navy }}>{vehicleNumber.toUpperCase()}</Text> is registered to your transport office fleet as an available dispatch asset.
          </Text>

          <Button
            title="Return to Vehicle Assets"
            onPress={() => router.replace('/transport-office/vehicles' as any)}
            style={styles.returnButton}
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
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register New Vehicle</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.noticeBox}>
            <Ionicons name="information-circle-outline" size={18} color={colors.blue} style={{ marginRight: 6 }} />
            <Text style={styles.noticeText}>
              Vehicles are independent fleet assets. Drivers are assigned to vehicles dynamically per shipment dispatch.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Vehicle Identification</Text>

            <Input
              label="Vehicle Registration Number"
              placeholder="e.g. TN38AB1234"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              autoCapitalize="characters"
              error={errors.vehicleNumber}
            />

            <Input
              label="Vehicle Make & Model"
              placeholder="e.g. Tata Signa 2823.K / Ashok Leyland 3520"
              value={model}
              onChangeText={setModel}
              error={errors.model}
            />

            {/* VEHICLE TYPE SELECTOR */}
            <Text style={styles.selectorLabel}>Vehicle Classification & Body</Text>
            <View style={styles.typeOptionsContainer}>
              {VEHICLE_TYPES.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeOptionCard, isSelected && styles.typeOptionCardActive]}
                    onPress={() => handleSelectType(type)}
                  >
                    <View style={[styles.typeRadio, isSelected && styles.typeRadioActive]}>
                      {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.typeOptionText, isSelected && styles.typeOptionTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Payload Capacity (in KG)"
              placeholder="e.g. 10000"
              value={capacityKg}
              onChangeText={setCapacityKg}
              keyboardType="number-pad"
              error={errors.capacityKg}
            />

            {/* FUEL TYPE */}
            <Text style={styles.selectorLabel}>Fuel Type</Text>
            <View style={styles.fuelTypesRow}>
              {(['Diesel', 'CNG', 'Electric'] as const).map((fuel) => {
                const isSelected = fuelType === fuel;
                return (
                  <TouchableOpacity
                    key={fuel}
                    style={[styles.fuelBtn, isSelected && styles.fuelBtnActive]}
                    onPress={() => setFuelType(fuel)}
                  >
                    <Text style={[styles.fuelBtnText, isSelected && styles.fuelBtnTextActive]}>
                      {fuel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Compliance & Permits</Text>

            <Input
              label="RC Certificate Number"
              placeholder="e.g. RC-TN38-2021-9988"
              value={rcNumber}
              onChangeText={setRcNumber}
              autoCapitalize="characters"
              error={errors.rcNumber}
            />

            {/* PERMIT STATUS */}
            <Text style={styles.selectorLabel}>Commercial Road Permit</Text>
            <View style={styles.fuelTypesRow}>
              <TouchableOpacity
                style={[styles.fuelBtn, permitStatus === 'NATIONAL_PERMIT' && styles.fuelBtnActive]}
                onPress={() => setPermitStatus('NATIONAL_PERMIT')}
              >
                <Text
                  style={[
                    styles.fuelBtnText,
                    permitStatus === 'NATIONAL_PERMIT' && styles.fuelBtnTextActive,
                  ]}
                >
                  National Permit (All India)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fuelBtn, permitStatus === 'STATE_PERMIT' && styles.fuelBtnActive]}
                onPress={() => setPermitStatus('STATE_PERMIT')}
              >
                <Text
                  style={[
                    styles.fuelBtnText,
                    permitStatus === 'STATE_PERMIT' && styles.fuelBtnTextActive,
                  ]}
                >
                  State Permit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Register Vehicle Asset →"
            onPress={handleAdd}
            style={styles.submitButton}
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
  formSection: {
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
  selectorLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  typeOptionsContainer: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  typeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  typeOptionCardActive: {
    borderColor: colors.navy,
    backgroundColor: '#EEF2FF',
  },
  typeRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRadioActive: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  typeOptionText: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '500',
  },
  typeOptionTextActive: {
    fontWeight: 'bold',
  },
  fuelTypesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  fuelBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuelBtnActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  fuelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  fuelBtnTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: colors.navy,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
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
  returnButton: {
    width: '100%',
    backgroundColor: colors.navy,
  },
});
