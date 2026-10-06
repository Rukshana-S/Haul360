import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export default function TransportOfficeSettingsScreen() {
  const [sosAlerts, setSosAlerts] = useState(true);
  const [tripNotifs, setTripNotifs] = useState(true);
  const [smsBackup, setSmsBackup] = useState(false);

  const handleLogout = () => {
    router.replace('/auth/login?role=Transport%20Office' as any);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/transport-office/profile' as any);
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transport Hub Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* NOTIFICATION PREFERENCES */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Dispatch Alerts & Notifications</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>SOS & Breakdown Emergency Audio</Text>
              <Text style={styles.settingDesc}>High priority tone when drivers trigger roadside assistance</Text>
            </View>
            <Switch
              value={sosAlerts}
              onValueChange={setSosAlerts}
              trackColor={{ false: '#E2E8F0', true: colors.navy }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Driver Trip Milestones</Text>
              <Text style={styles.settingDesc}>Alerts on acceptance, transit departure and delivery</Text>
            </View>
            <Switch
              value={tripNotifs}
              onValueChange={setTripNotifs}
              trackColor={{ false: '#E2E8F0', true: colors.navy }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>SMS Backup Alerts</Text>
              <Text style={styles.settingDesc}>Receive SMS notifications on manager mobile</Text>
            </View>
            <Switch
              value={smsBackup}
              onValueChange={setSmsBackup}
              trackColor={{ false: '#E2E8F0', true: colors.navy }}
            />
          </View>
        </View>

        {/* SECURITY & TELEMATICS */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Security & Fleet Access</Text>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/transport-office/change-password' as any)}
          >
            <Text style={styles.linkTitle}>Change Master Password</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkTitle}>Driver Credential Vault</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.linkTitle}>Two-Factor Authentication (2FA)</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* COMPLIANCE & LEGAL */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Compliance & Support</Text>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkTitle}>Haul360 24x7 Dispatch Support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkTitle}>Terms of Freight Carriage</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.linkTitle}>Data Privacy & Telematics Protection</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out of Transport Office</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  settingDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    paddingRight: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.navy,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
