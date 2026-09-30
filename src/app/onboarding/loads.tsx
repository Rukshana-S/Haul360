import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';

import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';

export default function OnboardingLoadsScreen() {
  return (
    <Screen safeArea scrollable style={styles.container}>
      <View style={styles.header}>
        <Image source={brand.logo} style={styles.logo} contentFit="contain" />
        <TouchableOpacity onPress={() => router.replace('/onboarding/role-selection')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.illustrationContainer}>
        <Image 
          source={require('@/assets/images/onboarding/onboarding-loads.png')} 
          style={styles.illustration} 
          contentFit="contain" 
        />
      </View>

      <View style={styles.pagination}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Find Loads Faster</Text>
        <Text style={styles.description}>
          Discover suitable freight loads and reduce{'\n'}empty return trips with precision algorithm{'\n'}dispatch.
        </Text>

        <View style={styles.cardsContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Instant Book</Text>
            <Text style={styles.cardSubtitle}>No phone tag</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>+34% Margin</Text>
            <Text style={styles.cardSubtitle}>Optimal routing</Text>
          </View>
        </View>

        <Button 
          title="Continue →" 
          onPress={() => router.push('/onboarding/confidence')} 
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logo: {
    width: 100,
    height: 30,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodyMedium,
    fontWeight: typography.weights.medium as any,
  },
  illustrationContainer: {
    marginVertical: spacing.xl,
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.navy,
    width: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: typography.sizes.bodyMedium,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.sizes.bodySmall,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.navy,
    marginBottom: spacing.xxl,
  },
});
