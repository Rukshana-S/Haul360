import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function FindMechanicScreen() {
  const { breakdownId } = useLocalSearchParams<{ breakdownId?: string }>();
  const { breakdowns, mechanics, requestMechanic, getBreakdownById } = useTransportOffice();

  const incident = breakdownId
    ? getBreakdownById(breakdownId)
    : breakdowns[0];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/breakdowns');
    }
  };

  if (!incident) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.notFoundTitle}>No Incident Selected</Text>
          <Button title="Back to Breakdowns" onPress={handleBack} style={{ marginTop: spacing.md }} />
        </View>
      </Screen>
    );
  }

  const handleRequest = (mechanicId: string) => {
    requestMechanic(incident.id, mechanicId);
    router.replace({
      pathname: '/transport-office/breakdowns/mechanic-status',
      params: { breakdownId: incident.id },
    } as any);
  };

  return (
    <Screen safeArea style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Nearby Mechanic</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* INCIDENT CONTEXT (SANITIZED - NO UNNECESSARY COMMERCIAL INFO) */}
        <View style={styles.contextCard}>
          <Text style={styles.contextHeader}>DISPATCH REPAIR MANIFEST</Text>

          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Vehicle:</Text>
            <Text style={styles.contextValue}>{incident.vehicleNumber} ({incident.vehicleType})</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Reported Issue:</Text>
            <Text style={[styles.contextValue, { color: '#991B1B', fontWeight: 'bold' }]}>
              {incident.issueType}
            </Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Breakdown Location:</Text>
            <Text style={styles.contextValue}>{incident.location}</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Driver on Site:</Text>
            <Text style={styles.contextValue}>{incident.driverName} (+91 {incident.driverPhone})</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Route Corridor:</Text>
            <Text style={styles.contextValue}>{incident.route}</Text>
          </View>
        </View>

        {/* NEARBY MECHANICS LIST */}
        <View style={styles.mechanicsSection}>
          <Text style={styles.sectionTitle}>Available Roadside Mechanics</Text>
          <Text style={styles.sectionSubtitle}>
            Ranked by GPS distance and heavy vehicle specialization
          </Text>

          <View style={styles.mechanicsList}>
            {mechanics.map((mech) => {
              const isAvailable = mech.isAvailable;

              return (
                <View
                  key={mech.id}
                  style={[
                    styles.mechCard,
                    !isAvailable && styles.mechCardDisabled,
                  ]}
                >
                  <View style={styles.mechCardHeader}>
                    <View style={styles.mechIconCircle}>
                      <Ionicons name="construct" size={20} color={colors.navy} />
                    </View>

                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={styles.mechName}>{mech.name}</Text>
                      <Text style={styles.workshopName}>{mech.workshopName}</Text>
                      <Text style={styles.specialtyText}>{mech.specialty}</Text>
                    </View>

                    <View style={styles.mechMetaRight}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.ratingText}>{mech.rating.toFixed(1)}</Text>
                      </View>
                      <Text style={styles.distanceText}>{mech.distanceKm} km away</Text>
                    </View>
                  </View>

                  <View style={styles.mechCardFooter}>
                    <View style={styles.etaBox}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.etaText}>ETA: ~{mech.etaMinutes} mins</Text>
                    </View>

                    {isAvailable ? (
                      <TouchableOpacity
                        style={styles.requestButton}
                        onPress={() => handleRequest(mech.id)}
                      >
                        <Text style={styles.requestButtonText}>Request Mechanic</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.busyBadge}>
                        <Text style={styles.busyBadgeText}>Currently Busy</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
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
  contextCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  contextHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 4,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  contextLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  contextValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    maxWidth: '65%',
    textAlign: 'right',
  },
  mechanicsSection: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginTop: 2,
  },
  mechanicsList: {
    gap: spacing.md,
  },
  mechCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mechCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  mechCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  mechIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mechName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
  },
  workshopName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  specialtyText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.blue,
    marginTop: 2,
  },
  mechMetaRight: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B45309',
  },
  distanceText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  mechCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  requestButton: {
    backgroundColor: colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  busyBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  busyBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.md,
  },
});
