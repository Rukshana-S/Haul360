import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  desc?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  desc,
  iconName,
  iconColor = colors.navy,
  iconBgColor = '#F1F5F9',
  onPress,
  style,
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={`${title}: ${value}`}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
          <Ionicons name={iconName} size={16} color={iconColor} />
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {subValue ? <Text style={styles.subValue}>{subValue}</Text> : null}
      </View>
      {desc ? <Text style={styles.desc}>{desc}</Text> : null}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.navy,
  },
  subValue: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  desc: {
    fontSize: 11,
    color: '#64748B',
  },
});

export default StatCard;
