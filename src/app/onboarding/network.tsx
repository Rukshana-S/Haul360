import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';

import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';

export default function OnboardingNetworkScreen() {
  return (
    <Screen safeArea scrollable style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/onboarding/confidence')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Image source={brand.logo} style={styles.logo} contentFit="contain" />
        <TouchableOpacity onPress={() => router.replace('/onboarding/role-selection')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.illustrationContainer}>
        <Image 
          source={require('@/assets/images/onboarding/onboarding-network.png')} 
          style={styles.illustration} 
          contentFit="contain" 
        />
      </View>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>One Connected Logistics{'\n'}Network</Text>
        <Text style={styles.description}>
          Connect drivers, organizations, transport{'\n'}offices and mechanics in real-time freight{'\n'}synchronization.
        </Text>

        <View style={styles.stripContainer}>
          <View style={styles.stripItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.green} style={{ marginRight: 6 }} />
            <Text style={styles.stripText}>360° Sync Live</Text>
          </View>
          <View style={styles.stripItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.green} style={{ marginRight: 6 }} />
            <Text style={styles.stripText}>End-to-End Ready</Text>
          </View>
        </View>

        <Button 
          title="Get Started →" 
          onPress={() => router.push('/onboarding/role-selection')} 
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
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  logo: {
    width: 80,
    height: 24,
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
    fontSize: typography.sizes.display - 4, // slightly smaller for multi-line
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
  stripContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  stripItem: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stripText: {
    fontSize: typography.sizes.bodyMedium,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium as any,
  },
  button: {
    backgroundColor: colors.orange, // Primary orange as requested
    marginBottom: spacing.xxl,
  },
});
