import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

interface IllustrationPlaceholderProps {
  id: string;
  description: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function IllustrationPlaceholder({ id, description, height = 240, style }: IllustrationPlaceholderProps) {
  return (
    <View style={[styles.container, { height }, style]}>
      <Text style={styles.idText}>MISSING ASSET: {id}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.border,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.slate,
    borderStyle: 'dashed',
  },
  idText: {
    color: colors.slate,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  descriptionText: {
    color: colors.slate,
    textAlign: 'center',
    fontSize: 12,
  },
});
