import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
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
import { useAuth } from '@/context/AuthContext';

export default function DriverSettingsScreen() {
  const { availability, setAvailability } = useDriver();
  const { logout } = useAuth();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [returnLoadAutoAlert, setReturnLoadAutoAlert] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/auth/login' as any);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <Text style={styles.headerSubtitle}>App Preferences & Security</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECURITY SETTINGS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Security & Access</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/driver/settings/change-password' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="key-outline" size={18} color={colors.navy} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Change Password</Text>
                <Text style={styles.menuSub}>Update your login credentials</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* NOTIFICATION PREFERENCES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Notification Preferences</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.switchTitle}>Push Notifications</Text>
              <Text style={styles.switchSub}>Instant alerts for new load requests and bid updates</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.switchTitle}>SMS Load Alerts</Text>
              <Text style={styles.switchSub}>Receive urgent assignment and toll text messages</Text>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.switchTitle}>Return Load Auto-Matches</Text>
              <Text style={styles.switchSub}>Recommend high-paying backhauls near your dropoff</Text>
            </View>
            <Switch
              value={returnLoadAutoAlert}
              onValueChange={setReturnLoadAutoAlert}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* DUTY & LOCATION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Duty & Dispatch</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.switchTitle}>Live GPS Telematics</Text>
              <Text style={styles.switchSub}>Broadcast truck location for highway mechanic rescue & shipper tracking</Text>
            </View>
            <Switch
              value={gpsTracking}
              onValueChange={setGpsTracking}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>

          <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Duty Status</Text>
              <Text style={styles.switchSub}>Current: {availability}</Text>
            </View>
            <TouchableOpacity
              style={styles.dutyChangeBtn}
              onPress={() => {
                const next = availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
                setAvailability(next);
                Alert.alert('Availability Updated', `You are now marked as ${next}.`);
              }}
            >
              <Text style={styles.dutyChangeBtnText}>Toggle Duty</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 6 }} />
          <Text style={styles.logoutButtonText}>Log Out Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out Account?"
        message="Are you sure you want to sign out of your Haul360 Driver session?"
        confirmText="Log Out"
        cancelText="Cancel"
        confirmVariant="outline"
        iconName="log-out-outline"
        iconColor="#DC2626"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
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
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  switchSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  dutyChangeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  dutyChangeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
});
