import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

interface AvailabilitySelectorProps {
  status: AvailabilityStatus;
  visible: boolean;
  onSelect: (status: AvailabilityStatus) => void;
  onClose: () => void;
}

export const statusConfig: Record<
  AvailabilityStatus,
  {
    label: string;
    sublabel: string;
    color: string;
    bgColor: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  AVAILABLE: {
    label: 'Available',
    sublabel: 'Ready for emergency SOS & live roadside dispatches',
    color: colors.green,
    bgColor: '#DCFCE7',
    icon: 'checkmark-circle',
  },
  BUSY: {
    label: 'Busy / On Job',
    sublabel: 'Currently working on a repair ticket or en route',
    color: colors.orange,
    bgColor: '#FEF3C7',
    icon: 'time',
  },
  OFFLINE: {
    label: 'Offline',
    sublabel: 'Off-duty, pause inbound dispatch queue',
    color: '#64748B',
    bgColor: '#F1F5F9',
    icon: 'power',
  },
};

export const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  status,
  visible,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close availability selector"
      >
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Mechanic Availability</Text>
              <Text style={styles.modalSubtitle}>Set your live roadside dispatch status</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <Ionicons name="close" size={20} color={colors.navy} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {(['AVAILABLE', 'BUSY', 'OFFLINE'] as AvailabilityStatus[]).map((key) => {
              const item = statusConfig[key];
              const isSelected = status === key;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionItem,
                    isSelected && { borderColor: item.color, backgroundColor: item.bgColor + '40' },
                  ]}
                  onPress={() => {
                    onSelect(key);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.label}`}
                >
                  <View style={[styles.statusIconBox, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <View style={styles.optionTitleRow}>
                      <Text style={[styles.optionLabel, isSelected && { color: colors.navy, fontWeight: '700' }]}>
                        {item.label}
                      </Text>
                      {isSelected && (
                        <View style={[styles.currentBadge, { backgroundColor: item.bgColor }]}>
                          <Text style={[styles.currentBadgeText, { color: item.color }]}>ACTIVE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.optionSublabel}>{item.sublabel}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  statusIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.navy,
  },
  optionSublabel: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
});

export default AvailabilitySelector;
