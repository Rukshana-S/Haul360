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

import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function DriverSettingsScreen() {
  const { office } = useTransportOffice();
  const [loudAlerts, setLoudAlerts] = useState(true);
  const [vibrateOnDispatch, setVibrateOnDispatch] = useState(true);
  const [highwayNightMode, setHighwayNightMode] = useState(false);

  const handleLogout = () => {
    router.replace('/auth/login?role=Driver' as any);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/office-driver/profile' as any);
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver App Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* DISPATCH AUDIO & NOTIFICATIONS */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Dispatch Alerts & Sound</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>High Priority Dispatch Ringtone</Text>
              <Text style={styles.settingDesc}>Play loud alert when new shipment is assigned</Text>
            </View>
            <Switch
              value={loudAlerts}
              onValueChange={setLoudAlerts}
              trackColor={{ false: '#E2E8F0', true: colors.navy }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Vibration for Roadside SOS Updates</Text>
              <Text style={styles.settingDesc}>Vibrate when mechanic status updates</Text>
            </View>
            <Switch
              value={vibrateOnDispatch}
              onValueChange={setVibrateOnDispatch}
              trackColor={{ false: '#E2E8F0', true: colors.navy }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Night Driving Navigation Mode</Text>
              <Text style={styles.settingDesc}>High contrast road display for night transit</Text>
            </View>
            <Switch
              value={highwayNightMode}
              onValueChange={setHighwayNightMode}
              trackColor={{ false: '#E2E8F0', true: colors.navy }}
            />
          </View>
        </View>

        {/* SECURITY & CREDENTIALS */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Security & Credentials</Text>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/office-driver/change-password' as any)}
          >
            <Text style={styles.linkTitle}>Change Permanent Driver Password</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkTitle}>DL Document Verification Status</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.linkTitle}>Biometric / Quick Face Unlock</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* FLEET RELATIONSHIP & SUPPORT */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Transport Hub & Support</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Affiliated Transport Office:</Text>
            <Text style={styles.infoVal}>{office.name}</Text>
          </View>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkTitle}>24x7 Roadside Fleet Helpline</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkTitle}>Commercial Driver Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.linkTitle}>Privacy Policy & Location Permissions</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out of Driver Account</Text>
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
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
