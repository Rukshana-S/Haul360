import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { useTransportOffice } from '@/context/TransportOfficeContext';

export default function TransportOfficeLayout() {
  const insets = useSafeAreaInsets();
  const { breakdowns, shipments } = useTransportOffice();

  const activeBreakdownsCount = breakdowns.filter(
    (b) => b.status !== 'RESOLVED' && b.status !== 'REPAIRED'
  ).length;
  const pendingShipmentsCount = shipments.filter(
    (s) => s.status === 'PENDING_ASSIGNMENT' || s.status === 'ASSIGNMENT_PENDING'
  ).length;

  const bottomInset = Math.max(insets.bottom, 8);

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
          tabBarBadge: activeBreakdownsCount > 0 ? activeBreakdownsCount : undefined,
        }}
      />

      {/* 2. DRIVERS */}
      <Tabs.Screen
        name="drivers/index"
        options={{
          title: 'Drivers',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 3. SHIPMENTS */}
      <Tabs.Screen
        name="shipments/index"
        options={{
          title: 'Shipments',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={22} color={color} />
          ),
          tabBarBadge: pendingShipmentsCount > 0 ? pendingShipmentsCount : undefined,
        }}
      />

      {/* 4. VEHICLES */}
      <Tabs.Screen
        name="vehicles/index"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bus' : 'bus-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* HIDE ALL SECONDARY & NESTED SCREENS FROM TAB BAR */}
      <Tabs.Screen name="drivers/add" options={{ href: null }} />
      <Tabs.Screen name="drivers/[id]" options={{ href: null }} />
      <Tabs.Screen name="shipments/assign" options={{ href: null }} />
      <Tabs.Screen name="shipments/[id]" options={{ href: null }} />
      <Tabs.Screen name="vehicles/add" options={{ href: null }} />
      <Tabs.Screen name="vehicles/[id]" options={{ href: null }} />
      <Tabs.Screen name="breakdowns/index" options={{ href: null }} />
      <Tabs.Screen name="breakdowns/find-mechanic" options={{ href: null }} />
      <Tabs.Screen name="breakdowns/mechanic-status" options={{ href: null }} />
      <Tabs.Screen name="breakdowns/replace-vehicle" options={{ href: null }} />
      <Tabs.Screen name="breakdowns/[id]" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  );
}
