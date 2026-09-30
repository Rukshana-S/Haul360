import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';

export default function MechanicRegistrationScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '98765 43210',
    aadhaar: '',
    pan: '',
    address: '',
    landmark: '',
    specialization: {
      heavy: true,
      lcv: true,
      reefer: false,
      tipper: false,
    },
    support247: true,
  });

  const toggleSpec = (key: keyof typeof form.specialization) => {
    setForm(prev => ({
      ...prev,
      specialization: { ...prev.specialization, [key]: !prev.specialization[key] }
    }));
  };

  if (submitted) {
    return (
      <Screen safeArea style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registration Complete</Text>
          <View style={styles.headerRight}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.successTop}>
            <View style={styles.shieldIconContainer}>
              <Ionicons name="shield-checkmark" size={48} color={colors.blue} />
            </View>
            <View style={styles.fastTrackBadge}>
              <View style={styles.dotBlack} />
              <Text style={styles.fastTrackText}>FAST-TRACK MANIFEST ACTIVE</Text>
            </View>
            <Text style={styles.successTitle}>Application Submitted Successfully!</Text>
            <Text style={styles.successSubtitle}>Your fleet documents and profile are being reviewed by Haul360 Verification Desk.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.detailsRow}>
              <View style={styles.detailsLabelRow}>
                <Ionicons name="document-text-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.detailsLabel}>Application Reference</Text>
              </View>
              <View style={styles.tagBlue}>
                <Text style={styles.tagBlueText}>#H360-REG-84920</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsRow}>
              <View style={styles.detailsLabelRow}>
                <Ionicons name="car-sport-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.detailsLabel}>Role Registered</Text>
              </View>
              <Text style={styles.detailsValue}>Commercial Heavy Fleet</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsRow}>
              <View style={styles.detailsLabelRow}>
                <Ionicons name="time-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.detailsLabel}>Verification SLA</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.detailsValue}>2 - 4 business hours</Text>
                <Text style={styles.detailsSubValue}>Today before 6:30 PM</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsRow}>
              <View style={styles.detailsLabelRow}>
                <Ionicons name="flash-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.detailsLabel}>Processing Level</Text>
              </View>
              <View style={styles.tagBlueLight}>
                <View style={styles.dotBlack} />
                <Text style={styles.tagBlueLightText}>Under Fast-Track Review</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineTitle}>Compliance Pipeline</Text>
              <Text style={styles.pipelineStep}>Step 2 of 3 Active</Text>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconActive}>
                <Ionicons name="checkmark" size={16} color={colors.white} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTitleRow}>
                  <Text style={styles.timelineTitle}>DigiLocker & VAHAN RC Check</Text>
                  <Text style={styles.timelineStatusText}>Instant</Text>
                </View>
                <Text style={styles.timelineDesc}>National permit & vehicle registration verified.</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineIconLoading}>
                <Ionicons name="sync-outline" size={16} color={colors.navy} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTitleRow}>
                  <Text style={styles.timelineTitle}>Background & KYC Audit</Text>
                  <View style={styles.tagBlueLight}>
                    <Text style={styles.tagBlueLightText}>In Progress</Text>
                  </View>
                </View>
                <Text style={styles.timelineDesc}>Commercial driving license & insurance validation underway.</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineIconPending}>
                <Ionicons name="notifications-outline" size={16} color={colors.textSecondary} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTitleRow}>
                  <Text style={styles.timelineTitlePending}>Approval & Trip Activation</Text>
                  <Text style={styles.timelineStatusText}>Pending</Text>
                </View>
                <Text style={styles.timelineDesc}>SMS, WhatsApp & app notification sent upon green flag.</Text>
              </View>
            </View>
          </View>

          <View style={styles.securityBox}>
            <View style={styles.securityIconBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.blue} />
            </View>
            <View style={styles.securityTextBox}>
              <Text style={styles.securityTitle}>Official Freight Carrier Protocol</Text>
              <Text style={styles.securityDesc}>Encrypted data sharing under MV Act & ISO 27001</Text>
            </View>
            <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
          </View>

          <TouchableOpacity style={styles.blackButton} onPress={() => router.replace('/auth/login?role=Mechanic' as any)} activeOpacity={0.8}>
            <Text style={styles.blackButtonText}>Go to Dashboard Preview →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpButton} activeOpacity={0.8}>
            <Ionicons name="headset-outline" size={16} color={colors.navy} style={{ marginRight: 6 }} />
            <Text style={styles.helpButtonText}>Need help? Contact Dispatch Desk</Text>
          </TouchableOpacity>

          <View style={styles.footerBranding}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.footerBrandingTitle}>HAUL360 SECURE FREIGHT PLATFORM</Text>
            </View>
            <Text style={styles.footerBrandingDesc}>Version 4.12.0 • Encrypted Telematics Engine</Text>
          </View>

        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen safeArea style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registration Form</Text>
          <View style={styles.headerRight}>
            <Image source={brand.logo} style={styles.headerLogo} contentFit="contain" />
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.introSection}>
            <View style={styles.networkBadge}>
              <Ionicons name="construct" size={14} color={colors.orange} style={{ marginRight: 6 }} />
              <Text style={styles.networkText}>HAUL360 NETWORK <Text style={styles.dotOrange}>•</Text> Priority Verification</Text>
            </View>
            <Text style={styles.pageTitle}>Mechanic Partner Onboarding</Text>
            <Text style={styles.pageSubtitle}>Join the 24/7 on-demand highway breakdown and fast repair network.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="id-card-outline" size={18} color={colors.navy} />
                <Text style={styles.cardTitle}>Technician Identity</Text>
              </View>
              <View style={styles.tagLightBlue}>
                <Text style={styles.tagLightBlueText}>Mandatory</Text>
              </View>
            </View>

            <View style={styles.profileBox}>
              <View style={styles.uploadSquare}>
                <Ionicons name="camera-outline" size={24} color="#3B82F6" style={{ marginBottom: 4 }} />
                <Text style={styles.uploadText}>Upload</Text>
              </View>
              <View style={styles.profileBoxRight}>
                <Text style={styles.profileTitle}>Profile Picture</Text>
                <Text style={styles.profileDesc}>Clear front-facing passport style photo for driver identification badge.</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Select Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.inputLabel}>Full Legal Name (as per Govt ID)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.placeholderText}>e.g. Ramesh Chandra Verma</Text>
            </View>

            <Text style={styles.inputLabel}>Registered Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="phone-portrait-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.inputText}>+91 98765 43210</Text>
              <View style={styles.otpBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#92400E" style={{ marginRight: 4 }} />
                <Text style={styles.otpBadgeText}>OTP Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.navy} />
                <Text style={styles.cardTitle}>Government KYC Documents</Text>
              </View>
              <View style={styles.tagLightBlue}>
                <Text style={styles.tagLightBlueText}>Secure 256-Bit</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Aadhaar Card Number (12 Digits)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.placeholderText}>4521 8934 1029</Text>
            </View>

            <View style={styles.attachBox}>
              <View style={styles.attachBoxIcon}>
                <Ionicons name="id-card-outline" size={20} color={colors.navy} />
              </View>
              <View style={styles.attachBoxContent}>
                <Text style={styles.attachTitle}>Aadhaar Card (Front & Back)</Text>
                <Text style={styles.attachDesc}>PDF, JPG up to 5MB</Text>
              </View>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
                <Text style={styles.attachButtonText}>Attach</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>PAN Card (10 Characters)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.placeholderText}>ABCDE1234F</Text>
            </View>

            <View style={styles.attachBox}>
              <View style={styles.attachBoxIcon}>
                <Ionicons name="document-outline" size={20} color={colors.navy} />
              </View>
              <View style={styles.attachBoxContent}>
                <Text style={styles.attachTitle}>PAN Card Copy</Text>
                <Text style={styles.attachDesc}>Clear photo of PAN document</Text>
              </View>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach-outline" size={14} color={colors.navy} style={{ marginRight: 4 }} />
                <Text style={styles.attachButtonText}>Attach</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="location-outline" size={18} color={colors.navy} />
                <Text style={styles.cardTitle}>Workshop & Garage Hub</Text>
              </View>
              <View style={styles.tagTransparent}>
                <Ionicons name="navigate-outline" size={13} color={colors.blue} style={{ marginRight: 4 }} />
                <Text style={styles.tagTransparentText}>Auto-Detect</Text>
              </View>
            </View>
            
            <View style={styles.mapPlaceholder}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" size={14} color={colors.orange} style={{ marginRight: 4 }} />
                <Text style={styles.mapText}>NH-48, Sector 34 Breakdown Post, KMP Express</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Garage / Workshop Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.placeholderText}>Shop 14, Haul360 Commercial Fleet Plaza</Text>
            </View>

            <Text style={styles.inputLabel}>Nearest Highway & Milestone / Landmark</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="trail-sign-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.placeholderText}>e.g. NH-48 Km Stone 42, Opposite Toll Post</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="car-sport-outline" size={18} color={colors.navy} />
                <Text style={styles.cardTitle}>Vehicle Specialization</Text>
              </View>
            </View>
            <Text style={styles.sectionDesc}>Select all commercial fleets you service for breakdown dispatch.</Text>

            <View style={styles.grid}>
              <TouchableOpacity style={styles.gridItem} onPress={() => toggleSpec('heavy')} activeOpacity={0.8}>
                <View style={styles.checkboxRow}>
                  <View style={[styles.checkbox, form.specialization.heavy && styles.checkboxActive]}>
                    {form.specialization.heavy && <Ionicons name="checkmark" size={12} color={colors.white} />}
                  </View>
                  <Text style={styles.gridItemTitle}>Heavy Multi-axle</Text>
                </View>
                <Text style={styles.gridItemDesc}>16-32 Wheeler, Trailers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => toggleSpec('lcv')} activeOpacity={0.8}>
                <View style={styles.checkboxRow}>
                  <View style={[styles.checkbox, form.specialization.lcv && styles.checkboxActive]}>
                    {form.specialization.lcv && <Ionicons name="checkmark" size={12} color={colors.white} />}
                  </View>
                  <Text style={styles.gridItemTitle}>LCV Fleets</Text>
                </View>
                <Text style={styles.gridItemDesc}>Tata 407, Bolero Maxi</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => toggleSpec('reefer')} activeOpacity={0.8}>
                <View style={styles.checkboxRow}>
                  <View style={[styles.checkbox, form.specialization.reefer && styles.checkboxActive]}>
                    {form.specialization.reefer && <Ionicons name="checkmark" size={12} color={colors.white} />}
                  </View>
                  <Text style={styles.gridItemTitle}>Reefer Units</Text>
                </View>
                <Text style={styles.gridItemDesc}>Cold-chain chillers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => toggleSpec('tipper')} activeOpacity={0.8}>
                <View style={styles.checkboxRow}>
                  <View style={[styles.checkbox, form.specialization.tipper && styles.checkboxActive]}>
                    {form.specialization.tipper && <Ionicons name="checkmark" size={12} color={colors.white} />}
                  </View>
                  <Text style={styles.gridItemTitle}>Hydraulics / Tippers</Text>
                </View>
                <Text style={styles.gridItemDesc}>Dumps, Cranes, Rams</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="settings-outline" size={18} color={colors.navy} />
                <Text style={styles.cardTitle}>Operations & Availability</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Mechanic Operational Model</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-circle-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.inputText}>Highway Mobile Patrol / SOS Unit (Quick Van)</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
            </View>

            <View style={styles.toggleBox}>
              <View style={styles.toggleBoxIcon}>
                <Ionicons name="flash-outline" size={18} color={colors.blue} />
              </View>
              <View style={styles.toggleBoxContent}>
                <Text style={styles.toggleTitle}>24/7 Highway Emergency Support</Text>
                <Text style={styles.toggleDesc}>Earn 1.8x night bonus dispatch tariffs</Text>
              </View>
              <Switch 
                value={form.support247} 
                onValueChange={(val) => setForm(prev => ({...prev, support247: val}))} 
                trackColor={{ false: colors.border, true: colors.navy }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="ribbon-outline" size={18} color={colors.navy} />
                <Text style={styles.cardTitle}>Experience Certificate</Text>
              </View>
              <View style={styles.tagLightBlue}>
                <Text style={styles.tagLightBlueText}>Optional</Text>
              </View>
            </View>
            <Text style={styles.sectionDesc}>Upload OEM credentials (Bosch, Cummins, Tata Motors, Ashok Leyland) to unlock the Gold Verified Pro Mechanic badge on fleet dispatch screens.</Text>

            <View style={styles.dragDropBox}>
              <View style={styles.dragDropIconBox}>
                <Ionicons name="cloud-upload-outline" size={28} color={colors.blue} />
              </View>
              <Text style={styles.dragDropTitle}>Add certification or training badge</Text>
              <Text style={styles.dragDropDesc}>Drag & drop document or tap to browse</Text>
            </View>
          </View>

          <View style={styles.activationBox}>
            <View style={styles.activationIconBox}>
              <Ionicons name="shield-checkmark" size={20} color={colors.blue} />
            </View>
            <View style={styles.activationContent}>
              <Text style={styles.activationTitle}>Express 2-Hour Activation</Text>
              <Text style={styles.activationDesc}>Our highway field officer will review KYC and approve breakdown beacon access immediately.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.orangeButton} onPress={() => setSubmitted(true)} activeOpacity={0.8}>
            <Text style={styles.orangeButtonText}>Register Mechanic Profile →</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>By registering, you agree to Haul360 Roadside Protocol & SLA Terms</Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 90,
    height: 26,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  introSection: {
    marginBottom: spacing.lg,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  networkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dotOrange: {
    color: colors.orange,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.02)',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  tagLightBlue: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagLightBlueText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3730A3',
  },
  tagTransparent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagTransparentText: {
    fontSize: 12,
    color: colors.blue,
    fontWeight: 'bold',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  uploadSquare: {
    width: 80,
    height: 80,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  uploadText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  profileBoxRight: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 2,
  },
  profileDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  linkText: {
    fontSize: 12,
    color: colors.blue,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
  },
  placeholderText: {
    fontSize: 14,
    color: '#94A3B8',
    flex: 1,
  },
  inputText: {
    fontSize: 14,
    color: colors.navy,
    fontWeight: 'bold',
    flex: 1,
  },
  otpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  otpBadgeText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: 'bold',
  },
  attachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  attachBoxIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  attachBoxContent: {
    flex: 1,
  },
  attachTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 2,
  },
  attachDesc: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  attachButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  mapPlaceholder: {
    height: 90,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  mapText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 10,
    padding: spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  gridItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  gridItemDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    paddingLeft: 24,
  },
  toggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: spacing.md,
  },
  toggleBoxIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  toggleBoxContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  toggleDesc: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dragDropBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: spacing.xl,
    alignItems: 'center',
  },
  dragDropIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dragDropTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  dragDropDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activationBox: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  activationIconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  activationContent: {
    flex: 1,
  },
  activationTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3730A3',
    marginBottom: 2,
  },
  activationDesc: {
    fontSize: 12,
    color: '#4F46E5',
    lineHeight: 16,
  },
  orangeButton: {
    backgroundColor: colors.orange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orangeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  termsText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // SUCCESS SCREEN
  successTop: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.xl,
  },
  shieldIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 6,
    borderColor: '#DBEAFE',
  },
  fastTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  dotBlack: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.navy,
    marginRight: 6,
  },
  fastTrackText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailsValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  detailsSubValue: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tagBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBlueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.blue,
  },
  tagBlueLight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagBlueLightText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.blue,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  pipelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pipelineTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.navy,
  },
  pipelineStep: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineIconActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  timelineIconLoading: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  timelineIconPending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  timelineTitlePending: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  timelineStatusText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timelineDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  securityIconBox: {
    marginRight: spacing.sm,
  },
  securityTextBox: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  securityDesc: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  blackButton: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  blackButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: spacing.xl,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  footerBranding: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  footerBrandingTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  footerBrandingDesc: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
