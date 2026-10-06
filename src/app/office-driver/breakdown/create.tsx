import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';
import {
  BreakdownIssueType,
  BREAKDOWN_ISSUE_OPTIONS,
} from '@/constants/transportOfficeDriverMockData';

export default function DriverCreateBreakdownScreen() {
  const {
    currentDriverUser,
    shipments,
    vehicles,
    reportBreakdown,
  } = useTransportOffice();

  const driverId = currentDriverUser?.id || 'H360-D-1042';

  // Find active or assigned trip
  const activeTrip = shipments.find(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT' || s.status === 'ASSIGNMENT_PENDING')
  ) || shipments[0];

  const assignedVehicle = activeTrip?.assignedVehicleId
    ? vehicles.find((v) => v.id === activeTrip.assignedVehicleId)
    : vehicles[0];

  const [selectedIssue, setSelectedIssue] = useState<BreakdownIssueType>('Engine Problem');
  const [details, setDetails] = useState('');
  const [mockLocation, setMockLocation] = useState('NH-44 Highway, Km 148 near Salem Toll Plaza');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      const incident = reportBreakdown({
        driverId: driverId,
        vehicleId: assignedVehicle?.id || 'VEH-001',
        shipmentId: activeTrip?.id || 'HS1024',
        issueType: selectedIssue,
        description: details.trim() || `${selectedIssue} reported on highway transit.`,
        location: mockLocation.trim(),
      });
      setIsLoading(false);
      router.replace('/office-driver/breakdown/status' as any);
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
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/office-driver/trips/current');
                }
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.navy} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Emergency / SOS Breakdown</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* AUTO-FILLED INCIDENT CONTEXT */}
          <View style={styles.contextCard}>
            <Text style={styles.contextHeader}>AUTO-ATTACHED DISPATCH CONTEXT</Text>

            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Driver:</Text>
              <Text style={styles.contextVal}>{currentDriverUser?.name || 'Kumar S.'} ({driverId})</Text>
            </View>

            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Vehicle Asset:</Text>
              <Text style={styles.contextVal}>{assignedVehicle?.vehicleNumber} ({assignedVehicle?.vehicleType})</Text>
            </View>

            <View style={styles.contextRow}>
              <Text style={styles.contextLabel}>Active Haul:</Text>
              <Text style={styles.contextVal}>#{activeTrip?.id} ({activeTrip?.origin} → {activeTrip?.destination})</Text>
            </View>
          </View>

          {/* ISSUE SELECTOR */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What Happened? (Select Issue)</Text>

            <View style={styles.issueGrid}>
              {BREAKDOWN_ISSUE_OPTIONS.map((item) => {
                const isSelected = selectedIssue === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.issueBtn, isSelected && styles.issueBtnSelected]}
                    onPress={() => setSelectedIssue(item.id as BreakdownIssueType)}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={isSelected ? colors.navy : colors.textSecondary}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.issueBtnText, isSelected && styles.issueBtnTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ADDITIONAL DETAILS & LOCATION */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Details & Roadside Location</Text>

            <Text style={styles.inputLabel}>Additional Description / Symptoms</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the problem (e.g. Engine temperature alarm, coolant leakage, loss of acceleration...)"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={details}
              onChangeText={setDetails}
            />

            <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Current GPS / Highway Location</Text>
            <View style={styles.locationWrapper}>
              <Ionicons name="location" size={18} color="#DC2626" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.locationInput}
                value={mockLocation}
                onChangeText={setMockLocation}
              />
            </View>
          </View>

          {/* SUBMIT SOS BUTTON */}
          <TouchableOpacity
            style={[styles.transmitBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Ionicons name="warning" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.transmitBtnText}>
              {isLoading ? 'Transmitting SOS Alert...' : 'SEND BREAKDOWN REQUEST →'}
            </Text>
          </TouchableOpacity>
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  contextCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contextHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 4,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  contextLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  contextVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  issueGrid: {
    gap: spacing.xs,
  },
  issueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  issueBtnSelected: {
    borderColor: colors.navy,
    backgroundColor: '#EEF2FF',
  },
  issueBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  issueBtnTextSelected: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 12,
    color: colors.navy,
    textAlignVertical: 'top',
    minHeight: 64,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
  },
  locationInput: {
    flex: 1,
    fontSize: 12,
    color: colors.navy,
    fontWeight: '500',
    paddingVertical: 0,
  },
  transmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  transmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
