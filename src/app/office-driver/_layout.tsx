import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function OfficeDriverLayout() {
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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 8,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="assignments"
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'mail-unread' : 'mail-unread-outline'} size={22} color={color} />
          ),
          tabBarBadge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: 'My Trip',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'navigate' : 'navigate-outline'} size={22} color={color} />
          ),
          tabBarBadge: activeTrip ? '●' : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* Hidden sub-screens */}
      <Tabs.Screen name="first-login" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="breakdown" options={{ href: null }} />
    </Tabs>
  );
}
