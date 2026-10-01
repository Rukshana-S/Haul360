import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { brand } from '@/constants/brand';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreenComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        // Authenticated role-based routing
        if (user.role === 'mechanic') {
          router.replace('/mechanic' as any);
        } else {
          // For other roles when connected later
          router.replace('/onboarding/loads' as any);
        }
      } else {
        // Unauthenticated initial onboarding flow
        router.replace('/onboarding/loads' as any);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isLoading]);

  return (
    <Screen safeArea style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>● FLEET CORE SYNC</Text>
        </View>
      </View>
      
      <View style={styles.centerArea}>
        <Image 
          source={brand.logo} 
          style={styles.logo} 
          contentFit="contain" 
        />
        <Text style={styles.tagline}>{brand.tagline}</Text>
        
        <View style={styles.loadingContainer}>
          <View style={styles.progressLine} />
          <Text style={styles.loadingText}>Connecting to dispatch{'\n'}hub...</Text>
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Text style={styles.bottomTextMain}>HAUL360 ENTERPRISE  •  v1.0.0</Text>
        <Text style={styles.bottomTextSub}>Authorized Freight Network Access</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  topArea: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeText: {
    fontSize: typography.sizes.caption,
    color: colors.slate,
    fontWeight: typography.weights.medium as any,
    letterSpacing: 0.5,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 80,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium as any,
    marginBottom: spacing.huge,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: colors.blue,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: typography.sizes.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomArea: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  bottomTextMain: {
    fontSize: typography.sizes.caption,
    color: colors.slate,
    fontWeight: typography.weights.bold as any,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bottomTextSub: {
    fontSize: typography.sizes.caption,
    color: colors.slate,
  },
});
