import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { DriverAvailability } from '@/constants/driverMockData';

interface DriverHeaderProps {
  title?: string;
  subtitle?: string;
  showAvailability?: boolean;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  title,
  subtitle,
  showAvailability = true,
}) => {
  const { profile, availability, setAvailability, unreadAlertsCount } = useDriver();
  const [modalVisible, setModalVisible] = useState(false);

  const getAvailabilityConfig = (status: DriverAvailability) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'AVAILABLE', bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' };
      case 'BUSY':
        return { label: 'ON TRIP / BUSY', bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' };
      case 'OFFLINE':
      default:
        return { label: 'OFFLINE', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
  };

  const availConfig = getAvailabilityConfig(availability);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftColumn}>
          <TouchableOpacity
            style={styles.profileRow}
            activeOpacity={0.8}
            onPress={() => router.push('/driver/(tabs)/profile' as any)}
          >
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color={colors.white} />
            </View>
            <View>
              <Text style={styles.greetingText}>
                {title || `Namaste, ${profile.name.split(' ')[0]}`}
              </Text>
              <Text style={styles.vehicleText}>
                {subtitle || `${profile.city} • ${profile.licenseNumber.slice(0, 8)}...`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          {showAvailability && (
            <TouchableOpacity
              style={[styles.availBadge, { backgroundColor: availConfig.bg }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.statusDot, { backgroundColor: availConfig.dot }]} />
              <Text style={[styles.availText, { color: availConfig.text }]}>
                {availConfig.label}
              </Text>
              <Ionicons name="chevron-down" size={12} color={availConfig.text} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/driver/alerts' as any)}
            activeOpacity={0.8}
            accessibilityLabel="Alerts and notifications"
          >
            <Ionicons name="notifications-outline" size={22} color={colors.navy} />
            {unreadAlertsCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>
                  {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => router.push('/driver/sos' as any)}
            activeOpacity={0.8}
            accessibilityLabel="Emergency SOS"
          >
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Availability Selector Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Duty Availability</Text>
            <Text style={styles.modalSubtitle}>
              Let shippers know if you are open to receiving shipment load invitations.
            </Text>

            {(['AVAILABLE', 'BUSY', 'OFFLINE'] as DriverAvailability[]).map((status) => {
              const cfg = getAvailabilityConfig(status);
              const isSelected = availability === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    setAvailability(status);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.modalOptionLeft}>
                    <View style={[styles.statusDotLarge, { backgroundColor: cfg.dot }]} />
                    <View>
                      <Text style={styles.optionTitle}>{status}</Text>
                      <Text style={styles.optionDesc}>
                        {status === 'AVAILABLE' && 'Ready for new shipments & bids'}
                        {status === 'BUSY' && 'Currently on active trip or unavailable'}
                        {status === 'OFFLINE' && 'Resting or off-duty'}
                      </Text>
                    </View>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.navy} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftColumn: {
    flex: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  greetingText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold as any,
    color: colors.navy,
  },
  vehicleText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  statusDotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  availText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sosButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  modalTitle: {
    fontSize: typography.sizes.heading3,
    fontWeight: typography.weights.bold as any,
    color: colors.navy,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: typography.sizes.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  modalOptionSelected: {
    borderColor: colors.navy,
    backgroundColor: '#F8FAFC',
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold as any,
    color: colors.navy,
  },
  optionDesc: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
});
