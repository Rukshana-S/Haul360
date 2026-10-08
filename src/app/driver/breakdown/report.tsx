import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { BreakdownSeverity } from '@/constants/driverMockData';

const BREAKDOWN_CATEGORIES = [
  { id: 'ENGINE', label: 'Engine / Overheating', icon: 'speedometer-outline' },
  { id: 'TIRE', label: 'Flat Tire / Puncture', icon: 'disc-outline' },
  { id: 'BRAKES', label: 'Brake System Failure', icon: 'alert-circle-outline' },
  { id: 'BATTERY', label: 'Battery / Electricals', icon: 'flash-outline' },
  { id: 'COOLANT', label: 'Coolant / Radiator Leak', icon: 'water-outline' },
  { id: 'TRANSMISSION', label: 'Gear / Transmission', icon: 'settings-outline' },
  { id: 'OTHER', label: 'Other Mechanical Issue', icon: 'construct-outline' },
];

const SEVERITY_LEVELS: { id: BreakdownSeverity; label: string; desc: string; color: string }[] = [
  { id: 'LOW', label: 'Minor', desc: 'Can drive slowly to nearest garage', color: '#15803D' },
  { id: 'MEDIUM', label: 'Moderate', desc: 'Stationary on highway shoulder', color: '#B45309' },
  { id: 'HIGH', label: 'High', desc: 'Total immobilisation / unsafe', color: '#C2410C' },
  { id: 'CRITICAL', label: 'Emergency', desc: 'Blocking traffic or hazardous', color: '#DC2626' },
];

export default function ReportBreakdownScreen() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const { vehicle, activeTrip, reportBreakdown } = useDriver();

  const [category, setCategory] = useState('Engine / Overheating');
  const [severity, setSeverity] = useState<BreakdownSeverity>('MEDIUM');
  const [locationAddress, setLocationAddress] = useState(
    'NH 44, Near Omalur Toll Plaza, Salem District (11.7291° N, 78.0722° E)'
  );
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Details Required', 'Please provide a brief description of the vehicle issue.');
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleConfirmReport = () => {
    setSubmitting(true);
    setTimeout(() => {
      const record = reportBreakdown({
        category,
        severity,
        description,
        locationAddress,
        tripId: tripId || activeTrip?.id,
      });
      setSubmitting(false);
      setConfirmModalVisible(false);
      router.replace(`/driver/breakdown/${record.id}` as any);
    }, 600);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Report Vehicle Breakdown</Text>
          <Text style={styles.headerSubtitle}>Request certified highway mechanic assistance</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Vehicle & Trip context */}
        <View style={styles.vehicleBanner}>
          <Ionicons name="car-sport" size={20} color={colors.navy} />
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleNum}>{vehicle.vehicleNumber} • {vehicle.vehicleType}</Text>
            {activeTrip && (
              <Text style={styles.tripRef}>
                Active Trip: {activeTrip.tripNumber} ({activeTrip.pickupLocation.city} → {activeTrip.destinationLocation.city})
              </Text>
            )}
          </View>
        </View>

        {/* Breakdown Category Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>1. Select Issue Category</Text>
          <View style={styles.categoryGrid}>
            {BREAKDOWN_CATEGORIES.map((cat) => {
              const isSelected = category === cat.label;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                  onPress={() => setCategory(cat.label)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={18}
                    color={isSelected ? colors.white : colors.navy}
                  />
                  <Text
                    style={[
                      styles.categoryBtnText,
                      isSelected && styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Severity Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>2. Breakdown Severity</Text>
          <View style={styles.severityGrid}>
            {SEVERITY_LEVELS.map((sev) => {
              const isSelected = severity === sev.id;
              return (
                <TouchableOpacity
                  key={sev.id}
                  style={[
                    styles.severityBtn,
                    isSelected && { borderColor: sev.color, backgroundColor: `${sev.color}10` },
                  ]}
                  onPress={() => setSeverity(sev.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.severityTop}>
                    <Text style={[styles.severityLabel, { color: sev.color }]}>{sev.label}</Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={sev.color} />
                    )}
                  </View>
                  <Text style={styles.severityDesc}>{sev.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Location Verification */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>3. Breakdown Location (GPS)</Text>
          <View style={styles.locationInputBox}>
            <Ionicons name="location" size={20} color="#DC2626" style={{ marginTop: 2 }} />
            <TextInput
              style={styles.locationInput}
              value={locationAddress}
              onChangeText={setLocationAddress}
              multiline
              placeholder="Enter exact landmark or highway milestone"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Issue Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>4. Describe the Issue</Text>
          <TextInput
            style={styles.descInput}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what happened (e.g. Engine temperature spiked, coolant smell, tire blowout on left rear axle...)"
            placeholderTextColor="#94A3B8"
          />

          {/* Optional Photo Attachment */}
          <TouchableOpacity
            style={[styles.photoAttachBox, hasPhoto && styles.photoAttachBoxActive]}
            onPress={() => setHasPhoto(!hasPhoto)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={hasPhoto ? 'image' : 'camera-outline'}
              size={20}
              color={hasPhoto ? colors.green : colors.navy}
            />
            <Text style={[styles.photoAttachText, hasPhoto && { color: colors.green, fontWeight: 'bold' }]}>
              {hasPhoto ? 'Photo Attached (engine_leak_01.jpg)' : 'Attach Photo of Damage / Part (Optional)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Action */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Ionicons name="construct" size={18} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.submitBtnText}>Dispatch Emergency Mechanic</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Request Mechanic Dispatch?"
        message={`Confirm request for ${category} assistance at ${locationAddress.slice(0, 40)}...?`}
        confirmText="Dispatch Mechanic"
        cancelText="Review"
        loading={submitting}
        iconName="construct"
        iconColor="#DC2626"
        onConfirm={handleConfirmReport}
        onCancel={() => setConfirmModalVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
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
  vehicleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  vehicleNum: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  tripRef: {
    fontSize: 11,
    color: colors.slate,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  categoryBtnActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  categoryBtnTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  severityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  severityBtn: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  severityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  severityDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  locationInputBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  locationInput: {
    flex: 1,
    fontSize: 12,
    color: colors.navy,
    lineHeight: 18,
    paddingVertical: 0,
  },
  descInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 12,
    color: colors.navy,
    textAlignVertical: 'top',
    height: 80,
    marginBottom: spacing.sm,
  },
  photoAttachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: 6,
    backgroundColor: '#F8FAFC',
  },
  photoAttachBoxActive: {
    borderColor: colors.green,
    backgroundColor: '#DCFCE7',
    borderStyle: 'solid',
  },
  photoAttachText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: radius.md,
    height: 50,
    marginTop: spacing.xs,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
});
