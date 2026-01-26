import { Tabs } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Colors } from '@/constants/colors'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.border,
        },
        tabBarActiveTintColor: Colors.brand.primary,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
      }}
    >
      {/* The index redirects to the checkin screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check-In',
          tabBarIcon: ({ color }) => (
            <UiIconSymbol size={28} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <UiIconSymbol size={28} name="wallet.pass.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      {/* Hide demo tab in production - keep for development */}
      <Tabs.Screen
        name="demo"
        options={{
          title: 'Demo',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="ladybug.fill" color={color} />,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  )
}
