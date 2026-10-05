import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeLayout() {
  const { officeNotifications, breakdowns, shipments } = useTransportOffice();

  const unreadNotifCount = officeNotifications.filter((n) => !n.read).length;
  const activeBreakdownsCount = breakdowns.filter(
    (b) => b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  ).length;
  const pendingShipmentsCount = shipments.filter(
    (s) => s.status === 'PENDING_ASSIGNMENT' || s.status === 'ASSIGNMENT_PENDING'
  ).length;

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
          tabBarBadge: activeBreakdownsCount > 0 ? activeBreakdownsCount : undefined,
        }}
      />

      <Tabs.Screen
        name="drivers"
        options={{
          title: 'Drivers',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="shipments"
        options={{
          title: 'Shipments',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={22} color={color} />
          ),
          tabBarBadge: pendingShipmentsCount > 0 ? pendingShipmentsCount : undefined,
        }}
      />

      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bus' : 'bus-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* Hidden sub-screens */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="breakdowns" options={{ href: null }} />
    </Tabs>
  );
}
