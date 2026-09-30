import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { mechanicProfile } from '@/constants/mechanicMockData';

export default function EditProfileScreen() {
  const [name, setName] = useState(mechanicProfile.name);
  const [workshop, setWorkshop] = useState(mechanicProfile.title);
  const [experience, setExperience] = useState('12+ Years');
  const [address, setAddress] = useState('Shop 14, Haul360 Commercial Fleet Plaza');
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{padding: spacing.lg, paddingBottom: spacing.xxl}} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Specialization Title</Text>
          <TextInput style={styles.input} value={workshop} onChangeText={setWorkshop} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Experience</Text>
          <TextInput style={styles.input} value={experience} onChangeText={setExperience} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />
        </View>

        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.chipsRow}>
          {['Engine', 'Air Brakes', 'Electrical', 'Tyre'].map(s => (
            <View key={s} style={styles.chipActive}><Text style={styles.chipActiveText}>{s}</Text></View>
          ))}
          <TouchableOpacity style={styles.chipInactive} activeOpacity={0.8}>
            <Ionicons name="add" size={14} color="#64748B" style={{ marginRight: 2 }} />
            <Text style={styles.chipInactiveText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Vehicle Types</Text>
        <View style={styles.chipsRow}>
          {['Heavy Multi-axle', 'LCV', 'Buses'].map(s => (
            <View key={s} style={styles.chipActive}><Text style={styles.chipActiveText}>{s}</Text></View>
          ))}
        </View>

        {isSaved && (
          <View style={styles.successMsg}>
            <Ionicons name="checkmark-circle" size={18} color="#166534" style={{ marginRight: 6 }} />
            <Text style={styles.successText}>Profile updated successfully</Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

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
  
  inputGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: 'bold', color: colors.navy, marginBottom: spacing.xs },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: spacing.md, borderRadius: 8, fontSize: 15, color: colors.navy },
  
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: colors.navy, marginTop: spacing.md, marginBottom: spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  chipActive: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipActiveText: { color: '#1E3A8A', fontSize: 12, fontWeight: 'bold' },
  chipInactive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipInactiveText: { color: '#64748B', fontSize: 12 },
  
  successMsg: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCFCE7', padding: spacing.md, borderRadius: 8, marginBottom: spacing.lg },
  successText: { color: '#166534', fontWeight: 'bold' },
  
  saveBtn: { backgroundColor: colors.navy, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xxl },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
