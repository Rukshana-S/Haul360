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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
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
  const { addVehicle, vehicles } = useTransportOffice();

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
  const [createdVehicleNumber, setCreatedVehicleNumber] = useState('');

  const resetForm = useCallback(() => {
    setVehicleNumber('');
    setSelectedType('10-Wheeler Heavy (10,000 KG)');
    setModel('');
    setCapacityKg('10000');
    setFuelType('Diesel');
    setRcNumber('');
    setInsuranceStatus('VALID');
    setPermitStatus('NATIONAL_PERMIT');
    setErrors({});
    setIsSuccess(false);
    setCreatedVehicleNumber('');
  }, []);

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
    } else if (vehicles.some((v) => v.vehicleNumber.replace(/\s+/g, '').toUpperCase() === cleanNumber)) {
      errs.vehicleNumber = `Vehicle ${cleanNumber} is already registered in your fleet.`;
    }

    if (!model.trim()) errs.model = 'Model / Chassis name is required';

    const capNum = parseInt(capacityKg, 10);
    if (!capacityKg || isNaN(capNum) || capNum <= 0) {
      errs.capacityKg = 'Enter valid payload capacity in KG';
    }

    const cleanRc = rcNumber.replace(/\s+/g, '').toUpperCase();
    if (!cleanRc) {
      errs.rcNumber = 'RC Registration certificate number is required';
    } else if (vehicles.some((v) => v.rcNumber.replace(/\s+/g, '').toUpperCase() === cleanRc)) {
      errs.rcNumber = `Vehicle with RC ${cleanRc} is already registered in your fleet.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    const num = vehicleNumber.toUpperCase().trim();
    addVehicle({
      vehicleNumber: num,
      vehicleType: selectedType.split('(')[0].trim(),
      model: model.trim(),
      capacityKg: parseInt(capacityKg, 10),
      fuelType,
      rcNumber: rcNumber.toUpperCase().trim(),
      insuranceStatus,
      permitStatus,
    });

    setCreatedVehicleNumber(num);
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
            Vehicle <Text style={{ fontWeight: 'bold', color: colors.navy }}>{createdVehicleNumber}</Text> is registered to your transport office fleet as an available dispatch asset.
          </Text>

          <Button
            title="+ Add Another Vehicle"
            variant="outline"
            onPress={resetForm}
            style={{ width: '100%', marginBottom: spacing.sm }}
          />

          <Button
            title="Return to Vehicle Assets"
            onPress={() => {
              resetForm();
              router.replace('/transport-office/vehicles' as any);
            }}
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
            <TouchableOpacity
              onPress={() => {
                resetForm();
                router.back();
              }}
              style={styles.backButton}
            >
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
              onChangeText={(val) => {
                setVehicleNumber(val);
                if (errors.vehicleNumber) setErrors((prev) => ({ ...prev, vehicleNumber: '' }));
              }}
              autoCapitalize="characters"
              error={errors.vehicleNumber}
            />

            <Input
              label="Make & Model / Chassis"
              placeholder="e.g. Tata Signa 2823.K"
              value={model}
              onChangeText={(val) => {
                setModel(val);
                if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
              }}
              error={errors.model}
            />

            <Text style={styles.fieldLabel}>Vehicle Body Category & Class</Text>
            <View style={styles.typeSelectorGrid}>
              {VEHICLE_TYPES.map((typeStr) => {
                const isSelected = selectedType === typeStr;
                return (
                  <TouchableOpacity
                    key={typeStr}
                    style={[styles.typeButton, isSelected && styles.typeButtonSelected]}
                    onPress={() => handleSelectType(typeStr)}
                  >
                    <Ionicons
                      name="bus-outline"
                      size={16}
                      color={isSelected ? colors.blue : colors.textSecondary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.typeButtonText, isSelected && styles.typeButtonTextSelected]}>
                      {typeStr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Certified Payload Capacity (in KG)"
              placeholder="10000"
              value={capacityKg}
              onChangeText={(val) => {
                setCapacityKg(val);
                if (errors.capacityKg) setErrors((prev) => ({ ...prev, capacityKg: '' }));
              }}
              keyboardType="number-pad"
              error={errors.capacityKg}
            />

            {/* FUEL TYPE SELECTION */}
            <Text style={styles.fieldLabel}>Fuel Type</Text>
            <View style={styles.segmentRow}>
              {(['Diesel', 'CNG', 'Electric'] as const).map((fuel) => {
                const isSelected = fuelType === fuel;
                return (
                  <TouchableOpacity
                    key={fuel}
                    style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                    onPress={() => setFuelType(fuel)}
                  >
                    <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                      {fuel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* COMPLIANCE & PERMITS */}
          <View style={[styles.formSection, { marginTop: spacing.md }]}>
            <Text style={styles.sectionTitle}>Compliance & Registration</Text>

            <Input
              label="RC Certificate Number"
              placeholder="e.g. RC-TN38-2023-9988"
              value={rcNumber}
              onChangeText={(val) => {
                setRcNumber(val);
                if (errors.rcNumber) setErrors((prev) => ({ ...prev, rcNumber: '' }));
              }}
              autoCapitalize="characters"
              error={errors.rcNumber}
            />

            <Text style={styles.fieldLabel}>Permit Coverage</Text>
            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[styles.segmentBtn, permitStatus === 'NATIONAL_PERMIT' && styles.segmentBtnActive]}
                onPress={() => setPermitStatus('NATIONAL_PERMIT')}
              >
                <Text style={[styles.segmentBtnText, permitStatus === 'NATIONAL_PERMIT' && styles.segmentBtnTextActive]}>
                  National (All-India)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentBtn, permitStatus === 'STATE_PERMIT' && styles.segmentBtnActive]}
                onPress={() => setPermitStatus('STATE_PERMIT')}
              >
                <Text style={[styles.segmentBtnText, permitStatus === 'STATE_PERMIT' && styles.segmentBtnTextActive]}>
                  State Permit
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Insurance Status</Text>
            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[styles.segmentBtn, insuranceStatus === 'VALID' && styles.segmentBtnActive]}
                onPress={() => setInsuranceStatus('VALID')}
              >
                <Text style={[styles.segmentBtnText, insuranceStatus === 'VALID' && styles.segmentBtnTextActive]}>
                  Valid Policy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentBtn, insuranceStatus === 'EXPIRING_SOON' && styles.segmentBtnActive]}
                onPress={() => setInsuranceStatus('EXPIRING_SOON')}
              >
                <Text style={[styles.segmentBtnText, insuranceStatus === 'EXPIRING_SOON' && styles.segmentBtnTextActive]}>
                  Expiring Soon
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  typeSelectorGrid: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeButtonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.blue,
  },
  typeButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIconCircle: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.xs,
    textAlign: 'center',
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
    borderRadius: radius.md,
  },
});
