import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';

export default function DriverDocumentsScreen() {
  const { documents } = useDriver();

  const handleUploadNewDoc = () => {
    Alert.alert(
      'Document Upload',
      'Select document category (Driving License, RC, Insurance, National Permit, or PUC) to upload photo/PDF for verification.'
    );
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Driver Documents & KYC</Text>
          <Text style={styles.headerSubtitle}>Verified Fleet Credentials & Permits</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleUploadNewDoc}>
          <Ionicons name="cloud-upload-outline" size={16} color={colors.navy} />
          <Text style={styles.addBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Verification Overview Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.shieldIconCircle}>
              <Ionicons name="shield-checkmark" size={24} color="#15803D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>KYC Verified Independent Driver</Text>
              <Text style={styles.heroSub}>
                Authorized for interstate heavy freight transport across India.
              </Text>
            </View>
          </View>
        </View>

        {/* Document Cards */}
        {documents.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docHeader}>
              <View style={styles.docIconBox}>
                <Ionicons
                  name={
                    doc.type === 'DRIVING_LICENSE'
                      ? 'card-outline'
                      : doc.type === 'RC'
                      ? 'car-outline'
                      : doc.type === 'INSURANCE'
                      ? 'shield-outline'
                      : doc.type === 'NATIONAL_PERMIT'
                      ? 'map-outline'
                      : 'leaf-outline'
                  }
                  size={20}
                  color={colors.navy}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docNumber}>Ref: {doc.documentNumber.slice(0, 10)}****</Text>
              </View>

              <StatusBadge status={doc.status} size="sm" />
            </View>

            <View style={styles.docMetaRow}>
              <Text style={styles.metaText}>Issued: {doc.issueDate}</Text>
              <Text style={[styles.metaText, doc.status === 'EXPIRING' && { color: '#DC2626', fontWeight: 'bold' }]}>
                Valid Until: {doc.expiryDate}
              </Text>
            </View>

            <View style={styles.verificationMsgBox}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.verificationMsgText}>{doc.verificationMessage}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shieldIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#14532D',
  },
  heroSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  docCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  docNumber: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  docMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  verificationMsgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
    gap: 6,
  },
  verificationMsgText: {
    fontSize: 11,
    color: colors.slate,
    flex: 1,
  },
});
