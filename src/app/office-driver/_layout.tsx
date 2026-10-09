import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function OfficeDriverLayout() {
  const insets = useSafeAreaInsets();
  const { shipments, currentDriverUser } = useTransportOffice();

  const driverId = currentDriverUser?.id;
  const pendingAssignmentsCount = shipments.filter(
    (s) => s.assignedDriverId === driverId && s.status === 'ASSIGNMENT_PENDING'
  ).length;

  const activeTrip = shipments.find(
    (s) =>
      s.assignedDriverId === driverId &&
      (s.status === 'ACCEPTED' || s.status === 'IN_TRANSIT')
  );

  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          height: 58 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarBadgeStyle: {
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          fontSize: 9,
          fontWeight: '700',
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          lineHeight: 14,
          paddingHorizontal: 3,
        },
      }}
    >
      {/* 1. HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 2. ASSIGNMENTS */}
      <Tabs.Screen
        name="assignments/index"
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'mail-unread' : 'mail-unread-outline'} size={22} color={color} />
          ),
          tabBarBadge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
        }}
      />

      {/* 3. TRIPS */}
      <Tabs.Screen
        name="trips/index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'navigate' : 'navigate-outline'} size={22} color={color} />
          ),
          tabBarBadge: activeTrip ? '●' : undefined,
        }}
      />

      {/* 4. PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* HIDE ALL SECONDARY & NESTED SCREENS FROM TAB BAR */}
      <Tabs.Screen name="assignments/[id]" options={{ href: null }} />
      <Tabs.Screen name="trips/current" options={{ href: null }} />
      <Tabs.Screen name="trips/history" options={{ href: null }} />
      <Tabs.Screen name="trips/[id]" options={{ href: null }} />
      <Tabs.Screen name="breakdown/create" options={{ href: null }} />
      <Tabs.Screen name="breakdown/status" options={{ href: null }} />
      <Tabs.Screen name="first-login" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="change-password" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="earnings" options={{ href: null }} />
    </Tabs>
  );
}
