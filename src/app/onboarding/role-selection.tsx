import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

type Role = 'Driver' | 'Organization' | 'Transport Office' | 'Mechanic';

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<Role>('Driver');

  const roles: {
    id: Role;
    title: string;
    badge?: string;
    iconName: keyof typeof Ionicons.glyphMap;
    description: string;
  }[] = [
    {
      id: 'Driver',
      title: 'Driver',
      badge: 'Primary',
      iconName: 'car-sport-outline',
      description: 'Find loads, navigate optimized routes, and receive fast payouts.',
    },
    {
      id: 'Organization',
      title: 'Organization',
      iconName: 'business-outline',
      description: 'Post freight requirements, manage enterprise supply chain, and monitor...',
    },
    {
      id: 'Transport Office',
      title: 'Transport Office',
      iconName: 'calendar-outline',
      description: 'Coordinate fleet schedules, assign drivers, and manage compliance.',
    },
    {
      id: 'Mechanic',
      title: 'Mechanic',
      iconName: 'construct-outline',
      description: 'Inspect vehicles, handle repair requests, and certify fleet...',
    },
  ];

  const handleContinue = () => {
    router.push(`/auth/login?role=${encodeURIComponent(selectedRole)}` as any);
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select how you'll be using Haul360 to customize{'\n'}your experience
        </Text>
      </View>

      <ScrollView style={styles.rolesContainer} contentContainerStyle={styles.rolesContent} showsVerticalScrollIndicator={false}>
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <TouchableOpacity 
              key={role.id}
              activeOpacity={0.8}
              onPress={() => setSelectedRole(role.id)}
              style={[
                styles.roleCard,
                isSelected && styles.roleCardSelected
              ]}
            >
              <View style={styles.roleHeader}>
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Ionicons 
                    name={role.iconName} 
                    size={20} 
                    color={isSelected ? colors.orange : colors.navy} 
                  />
                </View>
                <View style={styles.roleTitleContainer}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  {role.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{role.badge}</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
              </View>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>{selectedRole} Workspace Ready</Text>
          <Text style={styles.infoBoxSubtitle}>
            Instant trip load boards, real-time weighing & turn
          </Text>
        </View>

        <Button 
          title={`Continue as ${selectedRole} →`} 
          onPress={handleContinue} 
          style={styles.button}
        />
        
        <Text style={styles.helperText}>
          You can change or add secondary roles later in settings.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.heading1,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  rolesContainer: {
    flex: 1,
  },
  rolesContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleCardSelected: {
    borderColor: colors.navy,
    borderWidth: 2,
    backgroundColor: '#F8FAFC', // slightly tinted background for selection
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9', // light slate background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: '#FEF3C7',
  },
  icon: {
    fontSize: 20,
  },
  roleTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  roleTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: '#EFF6FF', // light blue
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: typography.sizes.caption,
    color: colors.blue,
    fontWeight: typography.weights.semiBold as any,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  arrowText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  roleDescription: {
    fontSize: typography.sizes.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingLeft: 40 + spacing.md, // align with text
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  infoBoxTitle: {
    fontSize: typography.sizes.bodyMedium,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoBoxSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.navy,
    marginBottom: spacing.md,
  },
  helperText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
