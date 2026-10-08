import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { ConfirmModal } from '@/components/driver/ConfirmModal';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

const SOS_EMERGENCY_TYPES = [
  { id: 'ACCIDENT', label: 'Accident', desc: 'Highway collision, rollover, or road impact', icon: 'car-sport-outline' },
  { id: 'BREAKDOWN', label: 'Vehicle Breakdown', desc: 'Critical mechanical failure, engine heat, tire blow', icon: 'construct-outline' },
  { id: 'MEDICAL', label: 'Medical Emergency', desc: 'Driver acute illness, sudden injury, medical rescue', icon: 'medkit-outline' },
  { id: 'SECURITY', label: 'Security Emergency', desc: 'Theft attempt, cargo threat, highway harassment', icon: 'shield-outline' },
  { id: 'OTHER', label: 'Other Highway Emergency', desc: 'Hazardous roadblock, extreme fire, flash weather', icon: 'alert-circle-outline' },
];

export default function EmergencySosScreen() {
  const { activeSos, triggerSos, resolveSos, activeTrip, vehicle } = useDriver();
  const [selectedType, setSelectedType] = useState('Accident');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const currentLocation = 'NH 44 Highway Milestone 184 (Near Omalur, Tamil Nadu)';

  const handleConfirmTrigger = () => {
    triggerSos(selectedType, currentLocation);
    setConfirmModalVisible(false);
  };

  const handleResolve = () => {
    Alert.alert(
      'Resolve SOS Incident',
      'Are you sure you want to mark this emergency broadcast as RESOLVED?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Resolved',
          style: 'destructive',
          onPress: () => {
            resolveSos();
          },
        },
      ]
    );
  };

  const isSosActive = !!activeSos && activeSos.status === 'ACTIVE';

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Emergency SOS Broadcast</Text>
          <Text style={styles.headerSubtitle}>Roadside Safety & Incident Response</Text>
        </View>
        {activeSos && (
          <StatusBadge
            status={activeSos.status}
            size="sm"
          />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isSosActive ? (
          <View style={styles.sosActiveCard}>
            <View style={styles.sosActiveIconBox}>
              <Ionicons name="radio" size={36} color="#DC2626" />
            </View>
            <Text style={styles.sosActiveTitle}>EMERGENCY SOS BROADCAST ACTIVE</Text>
            
            <View style={styles.sosDetailsGrid}>
              <View style={styles.sosDetailRow}>
                <Text style={styles.sosDetailLabel}>SOS Incident ID:</Text>
                <Text style={styles.sosDetailVal}>{activeSos.id}</Text>
              </View>
              <View style={styles.sosDetailRow}>
                <Text style={styles.sosDetailLabel}>Emergency Type:</Text>
                <Text style={styles.sosDetailVal}>{activeSos.reason}</Text>
              </View>
              <View style={styles.sosDetailRow}>
                <Text style={styles.sosDetailLabel}>Broadcast Time:</Text>
                <Text style={styles.sosDetailVal}>{activeSos.timestamp}</Text>
              </View>
              <View style={styles.sosDetailRow}>
                <Text style={styles.sosDetailLabel}>Vehicle:</Text>
                <Text style={styles.sosDetailVal}>{vehicle.vehicleNumber}</Text>
              </View>
              <View style={[styles.sosDetailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.sosDetailLabel}>Status:</Text>
                <Text style={[styles.sosDetailVal, { color: '#DC2626' }]}>ACTIVE BROADCAST</Text>
              </View>
            </View>

            <Text style={styles.sosActiveDesc}>
              Simulated coordinates ({currentLocation}) and vehicle details ({vehicle.vehicleNumber}) have been logged in local emergency dispatch.
            </Text>

            <View style={styles.sosCallList}>
              <TouchableOpacity
                style={styles.emergencyDialBtn}
                onPress={() => Linking.openURL('tel:112').catch(() => Alert.alert('Error', 'Unable to launch phone dialer for 112.'))}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={18} color={colors.white} />
                <Text style={styles.emergencyDialText}>Call Highway Police (112)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.emergencyDialBtn, { backgroundColor: '#B91C1C' }]}
                onPress={() => Linking.openURL('tel:108').catch(() => Alert.alert('Error', 'Unable to launch phone dialer for 108.'))}
                activeOpacity={0.8}
              >
                <Ionicons name="medkit" size={18} color={colors.white} />
                <Text style={styles.emergencyDialText}>Call Ambulance (108)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resolveBtn}
                onPress={handleResolve}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.green} />
                <Text style={styles.resolveBtnText}>Mark SOS Incident as Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Warning Info */}
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={24} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningTitle}>Controlled Emergency Action</Text>
                <Text style={styles.warningDesc}>
                  Only trigger in genuine highway emergencies. This creates an immediate high-priority alert for emergency response.
                </Text>
              </View>
            </View>

            {/* Emergency Category */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>1. Select Emergency Type</Text>
              {SOS_EMERGENCY_TYPES.map((r) => {
                const isSelected = selectedType === r.label;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.reasonItem, isSelected && styles.reasonItemActive]}
                    onPress={() => setSelectedType(r.label)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={r.icon as any}
                      size={20}
                      color={isSelected ? '#DC2626' : colors.navy}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reasonText, isSelected && styles.reasonTextActive]}>
                        {r.label}
                      </Text>
                      <Text style={styles.reasonSub}>{r.desc}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#DC2626" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Current Broadcast Location */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>2. Simulated Location to Broadcast</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={20} color="#DC2626" />
                <Text style={styles.locationAddressText}>{currentLocation}</Text>
              </View>
              <Text style={styles.truckContextText}>
                Assigned Truck: {vehicle.vehicleNumber} ({vehicle.model})
              </Text>
              {activeTrip && (
                <Text style={styles.tripContextText}>
                  Active Trip: {activeTrip.tripNumber} • Cargo: {activeTrip.cargoType}
                </Text>
              )}
            </View>

            {/* SOS Trigger Button */}
            <TouchableOpacity
              style={styles.sosTriggerBtn}
              onPress={() => setConfirmModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="alert-circle" size={22} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.sosTriggerBtnText}>TRIGGER EMERGENCY SOS</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Confirmation Modal to avoid accidental triggers */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirm Emergency SOS?"
        message={`Are you sure you want to broadcast an emergency for "${selectedType}"? This will log an active SOS alert with vehicle details ${vehicle.vehicleNumber}.`}
        confirmText="CONFIRM SOS BROADCAST"
        cancelText="Cancel"
        iconName="alert-circle"
        iconColor="#DC2626"
        onConfirm={handleConfirmTrigger}
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
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  warningDesc: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  reasonItemActive: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  reasonText: {
    fontSize: 13,
    color: colors.navy,
    fontWeight: '600',
  },
  reasonTextActive: {
    fontWeight: 'bold',
    color: '#991B1B',
  },
  reasonSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationAddressText: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '600',
    flex: 1,
  },
  truckContextText: {
    fontSize: 11,
    color: colors.slate,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  tripContextText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sosTriggerBtn: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    elevation: 4,
  },
  sosTriggerBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sosActiveCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sosActiveIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  sosActiveTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sosDetailsGrid: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sosDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sosDetailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sosDetailVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sosActiveDesc: {
    fontSize: 11,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing.lg,
  },
  sosCallList: {
    width: '100%',
    gap: spacing.sm,
  },
  emergencyDialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  emergencyDialText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.green,
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  resolveBtnText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
