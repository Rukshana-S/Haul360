import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  safeArea?: boolean;
}

export function Screen({ children, scrollable = false, style, safeArea = true }: ScreenProps) {
  const Container = safeArea ? SafeAreaView : View;
  
  const content = scrollable ? (
    <ScrollView contentContainerStyle={[styles.scrollContent, style]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  return (
    <Container style={styles.container}>
      {content}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
