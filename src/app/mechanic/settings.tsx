import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [sosTone, setSosTone] = useState(true);

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.lg, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={18} color={colors.navy} style={styles.rowIcon} />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="volume-high-outline" size={18} color={colors.navy} style={styles.rowIcon} />
              <Text style={styles.rowText}>Emergency SOS Tone</Text>
            </View>
            <Switch 
              value={sosTone} 
              onValueChange={setSosTone}
              trackColor={{ false: '#CBD5E1', true: colors.navy }}
              thumbColor={colors.white}
            />
          </View>
          <TouchableOpacity style={styles.row} activeOpacity={0.8}>
            <View style={styles.rowLeft}>
              <Ionicons name="language-outline" size={18} color={colors.navy} style={styles.rowIcon} />
              <Text style={styles.rowText}>App Interface Language</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.rowValue}>English (EN)</Text>
              <Ionicons name="chevron-forward" size={16} color="#64748B" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Support & Legal</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} activeOpacity={0.8}>
            <View style={styles.rowLeft}>
              <Ionicons name="help-circle-outline" size={18} color={colors.navy} style={styles.rowIcon} />
              <Text style={styles.rowText}>Help & Support Desk</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} activeOpacity={0.8}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.navy} style={styles.rowIcon} />
              <Text style={styles.rowText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} activeOpacity={0.8}>
            <View style={styles.rowLeft}>
              <Ionicons name="document-text-outline" size={18} color={colors.navy} style={styles.rowIcon} />
              <Text style={styles.rowText}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },
  backBtn: { marginRight: spacing.md, padding: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.navy },
  content: { flex: 1 },
  
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#64748B', marginBottom: spacing.sm, marginTop: spacing.md, marginLeft: spacing.xs },
  section: { backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: spacing.sm },
  rowText: { fontSize: 14, color: colors.navy, fontWeight: '500' },
  rowValue: { fontSize: 13, color: '#64748B' },
});
