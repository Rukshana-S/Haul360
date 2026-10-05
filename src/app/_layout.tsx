import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { colors } from '@/theme/colors';
import { AuthProvider } from '@/context/AuthContext';
import { TransportOfficeProvider } from '@/context/TransportOfficeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <TransportOfficeProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="registration" />
          <Stack.Screen name="transport-office" />
          <Stack.Screen name="office-driver" />
          <Stack.Screen name="mechanic" />
        </Stack>
      </TransportOfficeProvider>
    </AuthProvider>
  );
}
