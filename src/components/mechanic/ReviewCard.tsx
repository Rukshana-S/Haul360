import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Review } from '@/constants/mechanicMockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface ReviewCardProps {
  review: Review & { service?: string };
  style?: StyleProp<ViewStyle>;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{review.customer}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= review.rating ? 'star' : 'star-outline'}
              size={14}
              color={colors.orange}
            />
          ))}
        </View>
      </View>
      {review.service ? <Text style={styles.serviceTag}>{review.service}</Text> : null}
      <Text style={styles.comment}>"{review.comment}"</Text>
      <Text style={styles.date}>{review.date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  serviceTag: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: spacing.sm,
  },
  comment: {
    fontSize: 13,
    color: colors.navy,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'right',
  },
});

export default ReviewCard;
