import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAuth } from '@/context/AuthContext';
import { useMechanic } from '@/context/MechanicContext';
import {
  AvailabilitySelector,
  statusConfig,
} from '@/components/mechanic/AvailabilitySelector';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const {
    profile,
    availability,
    setAvailability,
    sosMode,
    setSosMode,
  } = useMechanic();

  // Local settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sosTone, setSosTone] = useState(true);
  const [autoAcceptEmergency, setAutoAcceptEmergency] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  // Modals
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [safetyModalVisible, setSafetyModalVisible] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = () => {
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(true);

    setTimeout(() => {
      setPasswordSuccess(false);
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/auth/login?role=Mechanic' as any);
  };

  const currentStatus = statusConfig[availability];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Terminal preferences & security</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION: ACCOUNT */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('/mechanic/edit-profile')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="person-outline" size={18} color={colors.blue} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Edit Profile</Text>
                <Text style={styles.rowSubtitle}>Workshop, specialization & services</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.green} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Terminal Verification</Text>
                <Text style={styles.rowSubtitle}>Authorized Haul360 Partner</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>{profile.verificationStatus}</Text>
            </View>
          </View>
        </View>

        {/* SECTION: WORK & DISPATCH */}
        <Text style={styles.sectionHeader}>WORK & DISPATCH</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setAvailabilityModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Change Dispatch Availability"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: currentStatus.bgColor }]}>
                <Ionicons name={currentStatus.icon} size={18} color={currentStatus.color} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Availability Status</Text>
                <Text style={styles.rowSubtitle}>{currentStatus.label} • Tap to change</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: currentStatus.bgColor }]}>
              <Text style={[styles.statusBadgeText, { color: currentStatus.color }]}>
                {currentStatus.label}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="navigate-circle-outline" size={18} color={colors.orange} />
              </View>
              <View style={{ flex: 1, paddingRight: spacing.sm }}>
                <Text style={styles.rowTitle}>24/7 SOS Patrol Mode</Text>
                <Text style={styles.rowSubtitle}>Accept urgent highway dispatches</Text>
              </View>
            </View>
            <Switch
              value={sosMode}
              onValueChange={setSosMode}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Toggle 24/7 SOS Patrol Mode"
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="flash-outline" size={18} color={colors.navy} />
              </View>
              <View style={{ flex: 1, paddingRight: spacing.sm }}>
                <Text style={styles.rowTitle}>Auto-Acknowledge SOS</Text>
                <Text style={styles.rowSubtitle}>Instant 15-second reservation lock</Text>
              </View>
            </View>
            <Switch
              value={autoAcceptEmergency}
              onValueChange={setAutoAcceptEmergency}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Toggle Auto-Acknowledge SOS"
            />
          </View>
        </View>

        {/* SECTION: PREFERENCES */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.sectionCard}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="notifications-outline" size={18} color={colors.blue} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Push Notifications</Text>
                <Text style={styles.rowSubtitle}>New request & status alerts</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Toggle Push Notifications"
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="volume-high-outline" size={18} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Emergency Siren Tone</Text>
                <Text style={styles.rowSubtitle}>High-decibel audio alert for urgent SOS</Text>
              </View>
            </View>
            <Switch
              value={sosTone}
              onValueChange={setSosTone}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Toggle Emergency Siren Tone"
            />
          </View>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => setLanguageModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Change App Interface Language"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="language-outline" size={18} color={colors.navy} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Interface Language</Text>
                <Text style={styles.rowSubtitle}>Regional language options</Text>
              </View>
            </View>
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>{selectedLanguage}</Text>
              <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION: SECURITY */}
        <Text style={styles.sectionHeader}>SECURITY</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setPasswordError(null);
              setPasswordSuccess(false);
              setPasswordModalVisible(true);
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Change Password"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="key-outline" size={18} color={colors.navy} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Change Password</Text>
                <Text style={styles.rowSubtitle}>Update your login security credentials</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="shield-outline" size={18} color={colors.navy} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Session Information</Text>
                <Text style={styles.rowSubtitle}>NH-48 Sector 34 Gateway • SSL 256-bit</Text>
              </View>
            </View>
            <View style={styles.activeSessionBadge}>
              <Text style={styles.activeSessionText}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* SECTION: SUPPORT & LEGAL */}
        <Text style={styles.sectionHeader}>SUPPORT & LEGAL</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setHelpModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Help and Support Desk"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="headset-outline" size={18} color={colors.blue} />
              </View>
              <View>
                <Text style={styles.rowTitle}>24/7 Mechanic Desk Support</Text>
                <Text style={styles.rowSubtitle}>Highway corridor dispatch center</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => setSafetyModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Roadside Safety Standards"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="warning-outline" size={18} color={colors.green} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Roadside Safety Guidelines</Text>
                <Text style={styles.rowSubtitle}>Cones, reflective gear & ISO safety steps</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => setPolicyModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Terms and Privacy Policy"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="document-text-outline" size={18} color={colors.navy} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Terms & Privacy Policy</Text>
                <Text style={styles.rowSubtitle}>Haul360 platform terms & SLA rules</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* SECTION: ACCOUNT ACTION */}
        <Text style={styles.sectionHeader}>ACCOUNT ACTION</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Log out from terminal"
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Log Out from Terminal</Text>
        </TouchableOpacity>

        <Text style={styles.versionFooter}>
          Haul360 Mechanic Terminal v2.14.0 (Build 9042){'\n'}
          Smart Freight. Smarter Hauling.
        </Text>
      </ScrollView>

      {/* Availability Selector Modal */}
      <AvailabilitySelector
        status={availability}
        visible={availabilityModalVisible}
        onSelect={(newStatus) => setAvailability(newStatus)}
        onClose={() => setAvailabilityModalVisible(false)}
      />

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Ionicons name="log-out" size={26} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Log Out of Terminal?</Text>
            <Text style={styles.modalDesc}>
              You will be signed out of your mechanic account. You can log back in at any time with your credentials.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cancel logout"
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnLogout}
                onPress={confirmLogout}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Confirm logout"
              >
                <Text style={styles.modalBtnLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={passwordModalVisible} transparent animationType="fade" onRequestClose={() => setPasswordModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalDesc}>Update your security password for local terminal access.</Text>

            {passwordSuccess && (
              <View style={styles.modalSuccessMsg}>
                <Ionicons name="checkmark-circle" size={16} color="#166534" style={{ marginRight: 4 }} />
                <Text style={styles.modalSuccessText}>Password updated successfully!</Text>
              </View>
            )}

            {passwordError && (
              <View style={styles.modalErrorMsg}>
                <Ionicons name="alert-circle" size={16} color="#991B1B" style={{ marginRight: 4 }} />
                <Text style={styles.modalErrorText}>{passwordError}</Text>
              </View>
            )}

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Current Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>New Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Min 6 characters"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setPasswordModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={handlePasswordChange}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnSaveText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selector Modal */}
      <Modal visible={languageModalVisible} transparent animationType="fade" onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>App Interface Language</Text>
            <Text style={styles.modalDesc}>Select your preferred terminal language.</Text>

            {(['English', 'Hindi', 'Punjabi'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langItem, selectedLanguage === lang && styles.langItemActive]}
                onPress={() => {
                  setSelectedLanguage(lang);
                  setLanguageModalVisible(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.langItemText, selectedLanguage === lang && styles.langItemTextActive]}>
                  {lang === 'English' ? 'English (EN)' : lang === 'Hindi' ? 'हिन्दी (Hindi)' : 'ਪੰਜਾਬੀ (Punjabi)'}
                </Text>
                {selectedLanguage === lang && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.navy} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalBtnCancel, { width: '100%', marginTop: spacing.md }]}
              onPress={() => setLanguageModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 24/7 Desk Help Modal */}
      <Modal visible={helpModalVisible} transparent animationType="fade" onRequestClose={() => setHelpModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="headset" size={26} color={colors.blue} />
            </View>
            <Text style={styles.modalTitle}>Haul360 Dispatch Hub</Text>
            <Text style={styles.modalDesc}>
              Priority 24/7 highway response line for mechanic dispatchers and expressway emergencies.
            </Text>

            <View style={styles.hotlineCard}>
              <Text style={styles.hotlineLabel}>Toll-Free SOS Dispatch Line</Text>
              <Text style={styles.hotlineNumber}>1800-360-HAUL (4285)</Text>
              <Text style={styles.hotlineSub}>Available 24 hours across Golden Quadrilateral & NH-48</Text>
            </View>

            <TouchableOpacity
              style={[styles.modalBtnSave, { width: '100%' }]}
              onPress={() => setHelpModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnSaveText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Safety Guidelines Modal */}
      <Modal visible={safetyModalVisible} transparent animationType="fade" onRequestClose={() => setSafetyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="shield-checkmark" size={26} color={colors.green} />
            </View>
            <Text style={styles.modalTitle}>Roadside Safety Protocol</Text>
            <Text style={styles.modalDesc}>Mandatory guidelines before servicing vehicles on highway shoulders:</Text>

            <View style={styles.safetyList}>
              <Text style={styles.safetyBullet}>1. Place reflective warning triangles 50m behind disabled vehicle.</Text>
              <Text style={styles.safetyBullet}>2. Wear high-visibility fluorescent safety vest at all times.</Text>
              <Text style={styles.safetyBullet}>3. Always use safety wheel chocks before jacking heavy multi-axle trucks.</Text>
              <Text style={styles.safetyBullet}>4. Release airbrake line pressure before loosening pneumatic couplings.</Text>
            </View>

            <TouchableOpacity
              style={[styles.modalBtnSave, { width: '100%', marginTop: spacing.md }]}
              onPress={() => setSafetyModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnSaveText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms & Privacy Modal */}
      <Modal visible={policyModalVisible} transparent animationType="fade" onRequestClose={() => setPolicyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terms & Privacy Notice</Text>
            <Text style={styles.modalDesc}>
              Haul360 protects your workshop identity and transaction records under Indian Information Technology laws and platform SLAs.
            </Text>
            <View style={styles.policyBox}>
              <Text style={styles.policyText}>
                • Direct GST & Instant Bank Settlement for verified roadside dispatches.{'\n'}
                • Encrypted real-time geolocation tracking only during active dispatch assignments.{'\n'}
                • Transparent driver rating and review dispute resolution system.
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.modalBtnSave, { width: '100%', marginTop: spacing.md }]}
              onPress={() => setPolicyModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnSaveText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    marginRight: spacing.md,
    padding: 4,
  },
  headerTitleBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 48,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  rowSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  activeSessionBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeSessionText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.blue,
  },

  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  versionFooter: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: spacing.xl,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  modalDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
  modalBtnCancel: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: colors.navy,
    fontWeight: '700',
    fontSize: 13,
  },
  modalBtnLogout: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnLogoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalBtnSave: {
    flex: 1,
    backgroundColor: colors.navy,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  // Password fields
  modalInputGroup: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 13,
    color: colors.navy,
  },
  modalSuccessMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: spacing.xs,
    borderRadius: 6,
    marginBottom: spacing.sm,
    width: '100%',
  },
  modalSuccessText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  modalErrorMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: spacing.xs,
    borderRadius: 6,
    marginBottom: spacing.sm,
    width: '100%',
  },
  modalErrorText: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '600',
  },

  // Language items
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xs,
  },
  langItemActive: {
    borderColor: colors.navy,
    backgroundColor: '#F1F5F9',
  },
  langItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.navy,
  },
  langItemTextActive: {
    fontWeight: '700',
  },

  // Hotline card
  hotlineCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hotlineLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  hotlineNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 4,
  },
  hotlineSub: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },

  // Safety list
  safetyList: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 8,
    width: '100%',
    gap: 6,
  },
  safetyBullet: {
    fontSize: 11,
    color: colors.navy,
    lineHeight: 15,
  },

  // Policy box
  policyBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 8,
    width: '100%',
  },
  policyText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
});
