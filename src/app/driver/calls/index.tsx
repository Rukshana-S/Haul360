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
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { CallLogItem } from '@/constants/driverMockData';

type CallTab = 'DIRECTORY' | 'LOGS';

interface DirectoryContact {
  id: string;
  name: string;
  role: CallLogItem['role'];
  phone: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function DriverCallsScreen() {
  const { callLogs, logCall, activeTrip, activeBreakdown } = useDriver();
  const [activeTab, setActiveTab] = useState<CallTab>('DIRECTORY');
  const [selectedContactToCall, setSelectedContactToCall] = useState<DirectoryContact | null>(null);

  const directoryContacts: DirectoryContact[] = [
    {
      id: 'DIR-01',
      name: activeTrip?.shipperName || 'Suresh Narayanan',
      role: 'Shipper',
      phone: activeTrip?.shipperPhone || '+91 94432 11223',
      desc: activeTrip ? `Current Load Shipper (${activeTrip.shipperCompany})` : 'Active Cargo Shipper',
      icon: 'business-outline',
    },
    {
      id: 'DIR-02',
      name: activeBreakdown?.mechanic?.name || 'Ramesh Kumar (Mechanic)',
      role: 'Mechanic',
      phone: activeBreakdown?.mechanic?.phone || '+91 98422 66778',
      desc: activeBreakdown ? activeBreakdown.mechanic?.workshopName || 'Assigned Highway Rescue' : 'Highway Breakdown Workshop',
      icon: 'construct-outline',
    },
    {
      id: 'DIR-03',
      name: 'Haul360 Driver Support Desk',
      role: 'Haul360 Support',
      phone: '1800-428-5360',
      desc: '24/7 Toll-Free Freight & Settlement Assistance',
      icon: 'headset-outline',
    },
    {
      id: 'DIR-04',
      name: 'Highway Police & Emergency Dispatch',
      role: 'Emergency Dispatch',
      phone: '112',
      desc: 'National Emergency Highway Control Room',
      icon: 'shield-outline',
    },
  ];

  const handleConfirmCall = () => {
    if (selectedContactToCall) {
      logCall(
        selectedContactToCall.name,
        selectedContactToCall.role,
        selectedContactToCall.phone,
        'OUTGOING',
        'Dialed',
        activeTrip?.tripNumber
      );
      const phoneToDial = selectedContactToCall.phone.replace(/[^\d+]/g, '');
      setSelectedContactToCall(null);
      Linking.openURL(`tel:${phoneToDial}`).catch(() => {
        Alert.alert('Error', `Could not open dialer for ${selectedContactToCall.phone}`);
      });
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Communications & Calls</Text>
          <Text style={styles.headerSubtitle}>Directory & Dispatch Communication Logs</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'DIRECTORY' && styles.tabBtnActive]}
          onPress={() => setActiveTab('DIRECTORY')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'DIRECTORY' && styles.tabBtnTextActive]}>
            Contacts Directory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'LOGS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('LOGS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'LOGS' && styles.tabBtnTextActive]}>
            Call History ({callLogs.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'DIRECTORY' ? (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Key Trip & Support Contacts</Text>
            {directoryContacts.map((c) => (
              <View key={c.id} style={styles.contactItem}>
                <View style={styles.contactIconCircle}>
                  <Ionicons name={c.icon} size={20} color={colors.navy} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactDesc}>{c.desc}</Text>
                  <Text style={styles.contactPhone}>{c.phone}</Text>
                </View>

                <TouchableOpacity
                  style={styles.callCircleBtn}
                  onPress={() => setSelectedContactToCall(c)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Recent Call Logs</Text>
            {callLogs.map((log) => (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logIconBox}>
                  <Ionicons
                    name={
                      log.callType === 'OUTGOING'
                        ? 'call-outline'
                        : log.callType === 'INCOMING'
                        ? 'arrow-down-outline'
                        : 'close-outline'
                    }
                    size={18}
                    color={
                      log.callType === 'MISSED'
                        ? '#DC2626'
                        : log.callType === 'OUTGOING'
                        ? colors.navy
                        : colors.green
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.logName}>{log.contactName}</Text>
                  <Text style={styles.logMeta}>
                    {log.role} • {log.date} {log.time} {log.duration ? `(${log.duration})` : ''}
                  </Text>
                  {log.relatedTripNumber && (
                    <Text style={styles.tripTag}>Ref: {log.relatedTripNumber}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.reDialBtn}
                  onPress={() =>
                    setSelectedContactToCall({
                      id: log.id,
                      name: log.contactName,
                      role: log.role,
                      phone: log.phoneNumber,
                      desc: `${log.role} Contact`,
                      icon: 'call-outline',
                    })
                  }
                >
                  <Ionicons name="call" size={14} color={colors.navy} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Call Confirmation Modal */}
      {selectedContactToCall && (
        <ConfirmModal
          visible={!!selectedContactToCall}
          title={`Call ${selectedContactToCall.name}?`}
          message={`Initiate call to ${selectedContactToCall.phone} (${selectedContactToCall.role})?`}
          confirmText="Call"
          cancelText="Cancel"
          iconName="call-outline"
          iconColor={colors.navy}
          onConfirm={handleConfirmCall}
          onCancel={() => setSelectedContactToCall(null)}
        />
      )}
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.navy,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
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
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: spacing.sm,
  },
  contactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  contactDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  contactPhone: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.blue,
    marginTop: 2,
  },
  callCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: spacing.sm,
  },
  logIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  logMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  tripTag: {
    fontSize: 9,
    color: colors.blue,
    fontWeight: '600',
    marginTop: 1,
  },
  reDialBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
