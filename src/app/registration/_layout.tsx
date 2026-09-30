import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function RegistrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="driver" />
      <Stack.Screen name="organization" />
      <Stack.Screen name="transport-office" />
      <Stack.Screen name="mechanic" />
    </Stack>
  );
}
