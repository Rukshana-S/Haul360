import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function DriverLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="shipment/[id]" />
      <Stack.Screen name="bid/[id]" />
      <Stack.Screen name="trip/[id]" />
      <Stack.Screen name="trip/tracking" />
      <Stack.Screen name="breakdown/report" />
      <Stack.Screen name="breakdown/[id]" />
      <Stack.Screen name="return-load/index" />
      <Stack.Screen name="return-load/[id]" />
      <Stack.Screen name="money/index" />
      <Stack.Screen name="money/withdraw" />
      <Stack.Screen name="money/passbook" />
      <Stack.Screen name="fastag/index" />
      <Stack.Screen name="alerts/index" />
      <Stack.Screen name="calls/index" />
      <Stack.Screen name="help/index" />
      <Stack.Screen name="sos/index" />
      <Stack.Screen name="vehicle/index" />
      <Stack.Screen name="documents/index" />
      <Stack.Screen name="ratings/index" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/change-password" />
    </Stack>
  );
}
