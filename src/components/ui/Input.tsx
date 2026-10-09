import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  disabled,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          disabled ? styles.inputDisabled : null,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        editable={!disabled}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium as any,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.bodySmall,
    marginTop: spacing.xs,
  },
});
