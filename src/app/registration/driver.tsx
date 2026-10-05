import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function DriverRegistrationScreen() {
  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="card-outline" size={48} color={colors.navy} />
        </View>
        <Text style={styles.title}>Transport Office Driver</Text>
        <Text style={styles.subtitle}>
          Driver accounts are created and managed directly by your Transport Office. Drivers do not self-register.
        </Text>
        <Text style={[styles.subtitle, { marginTop: spacing.sm, fontSize: 13, color: colors.slate }]}>
          Please contact your Fleet Dispatch Manager to receive your temporary Driver ID and credentials.
        </Text>

        <Button
          title="Go to Driver Login"
          onPress={() => router.replace('/auth/login?role=Driver' as any)}
          style={{ marginTop: spacing.xl, width: '100%' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.heading2,
    color: colors.navy,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
