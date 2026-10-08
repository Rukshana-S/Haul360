import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

type DriverCategory = 'INDEPENDENT' | 'OFFICE';

export default function DriverTypeSelectionScreen() {
  const [selectedType, setSelectedType] = useState<DriverCategory>('INDEPENDENT');

  const options: {
    id: DriverCategory;
    title: string;
    badge?: string;
    iconName: keyof typeof Ionicons.glyphMap;
    description: string;
    buttonLabel: string;
    action: () => void;
  }[] = [
    {
      id: 'INDEPENDENT',
      title: 'Register as Independent Driver',
      badge: 'Self-Employed',
      iconName: 'car-sport-outline',
      description: 'For self-employed / independent drivers who manage their own vehicle, find freight shipments, and place bids.',
      buttonLabel: 'Register as Independent Driver',
      action: () => router.push('/registration/driver' as any),
    },
    {
      id: 'OFFICE',
      title: 'Transport Office Driver Login',
      badge: 'Office Fleet',
      iconName: 'business-outline',
      description: 'For drivers whose credentials are provided by a Transport Office. Office drivers do not self-register.',
      buttonLabel: 'Transport Office Driver Login',
      action: () => router.push('/auth/login?role=Office%20Driver' as any),
    },
  ];

  const handleContinue = () => {
    const selected = options.find((o) => o.id === selectedType);
    if (selected) {
      selected.action();
    }
  };

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headingBadge}>REGISTER</Text>
        <Text style={styles.title}>Choose your driver type</Text>
        <Text style={styles.subtitle}>
          Select the category that matches how your commercial transport operations are structured.
        </Text>
      </View>

      <ScrollView
        style={styles.optionsContainer}
        contentContainerStyle={styles.optionsContent}
        showsVerticalScrollIndicator={false}
      >
        {options.map((item) => {
          const isSelected = selectedType === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => setSelectedType(item.id)}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Ionicons
                    name={item.iconName}
                    size={22}
                    color={isSelected ? colors.orange : colors.navy}
                  />
                </View>
                <View style={styles.titleContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>
                  {item.badge && (
                    <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                      <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
              </View>

              <Text style={styles.cardDescription}>{item.description}</Text>

              <TouchableOpacity
                style={[styles.cardButton, isSelected ? styles.cardButtonActive : styles.cardButtonInactive]}
                onPress={item.action}
                activeOpacity={0.8}
              >
                <Text style={[styles.cardButtonText, isSelected && styles.cardButtonTextActive]}>
                  {item.buttonLabel} →
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            Continue with Selected Option →
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login?role=Driver' as any)}>
            <Text style={styles.loginLink}>Driver Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  headingBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.orange,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.navy,
    backgroundColor: '#F8FAFC',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: '#FEF3C7',
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeSelected: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.blue,
  },
  badgeTextSelected: {
    color: '#B45309',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  cardButton: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButtonActive: {
    backgroundColor: colors.navy,
  },
  cardButtonInactive: {
    backgroundColor: '#E2E8F0',
  },
  cardButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate,
  },
  cardButtonTextActive: {
    color: colors.white,
  },
  footer: {
    paddingVertical: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.navy,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
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
