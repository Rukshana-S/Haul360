import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

type Role = 'Driver' | 'Organization' | 'Transport Office' | 'Mechanic';

export default function RegistrationRoleSelectionScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [selectedRole, setSelectedRole] = useState<Role>((role as Role) || 'Driver');

  const roles: {
    id: Role;
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    description: string;
    route: string;
  }[] = [
    {
      id: 'Driver',
      title: 'Driver',
      iconName: 'car-sport-outline',
      description: 'Register as an individual driver to find loads and manage trips.',
      route: '/registration/driver'
    },
    {
      id: 'Organization',
      title: 'Organization',
      iconName: 'business-outline',
      description: 'Register a business to post freight and manage logistics.',
      route: '/registration/organization'
    },
    {
      id: 'Transport Office',
      title: 'Transport Office',
      iconName: 'calendar-outline',
      description: 'Register as a fleet manager to coordinate drivers and schedules.',
      route: '/registration/transport-office'
    },
    {
      id: 'Mechanic',
      title: 'Mechanic',
      iconName: 'construct-outline',
      description: 'Register as a mechanic to handle vehicle repairs and inspections.',
      route: '/registration/mechanic'
    },
  ];

  const handleContinue = () => {
    const selected = roles.find(r => r.id === selectedRole);
    if (selected) {
      router.push(selected.route as any);
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Your Haul360 Account</Text>
        <Text style={styles.subtitle}>
          Choose the account type that matches how you use Haul360.
        </Text>
      </View>

      <ScrollView style={styles.rolesContainer} contentContainerStyle={styles.rolesContent} showsVerticalScrollIndicator={false}>
        {roles.map((roleItem) => {
          const isSelected = selectedRole === roleItem.id;
          return (
            <TouchableOpacity 
              key={roleItem.id}
              activeOpacity={0.8}
              onPress={() => setSelectedRole(roleItem.id)}
              style={[
                styles.roleCard,
                isSelected && styles.roleCardSelected
              ]}
            >
              <View style={styles.roleHeader}>
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Ionicons 
                    name={roleItem.iconName} 
                    size={20} 
                    color={isSelected ? colors.orange : colors.navy} 
                  />
                </View>
                <View style={styles.roleTitleContainer}>
                  <Text style={styles.roleTitle}>{roleItem.title}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
              </View>
              <Text style={styles.roleDescription}>{roleItem.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue} 
          style={styles.button}
        />
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 24,
    color: colors.textPrimary,
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
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#F1F5F9',
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
  },
  roleTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
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
    paddingLeft: 40 + spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  button: {
    backgroundColor: colors.navy,
    marginBottom: spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodyMedium,
  },
  loginLink: {
    color: colors.blue,
    fontSize: typography.sizes.bodyMedium,
    fontWeight: 'bold',
  },
});
