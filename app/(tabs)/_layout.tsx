import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Colors } from '@/constants/colors'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  // Add extra padding for Android navigation buttons
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 8) + 4 : insets.bottom + 4

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.aurora.tabBar.background,
          borderTopColor: Colors.aurora.tabBar.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: 60 + bottomPadding,
        },
        tabBarActiveTintColor: Colors.aurora.tabBar.active,
        tabBarInactiveTintColor: Colors.aurora.tabBar.inactive,
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      {/* The index redirects to the checkin screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check-In',
          tabBarIcon: ({ color, focused }) => (
            <UiIconSymbol
              size={26}
              name="checkmark.circle.fill"
              color={color}
              style={focused ? {
                shadowColor: Colors.aurora.primary.default,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
              } : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <UiIconSymbol
              size={26}
              name="wallet.pass.fill"
              color={color}
              style={focused ? {
                shadowColor: Colors.aurora.primary.default,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
              } : undefined}
            />
          ),
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <UiIconSymbol
              size={26}
              name="gearshape.fill"
              color={color}
              style={focused ? {
                shadowColor: Colors.aurora.primary.default,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
              } : undefined}
            />
          ),
        }}
      />
      {/* Hide demo tab in production - keep for development */}
      <Tabs.Screen
        name="demo"
        options={{
          title: 'Demo',
          tabBarIcon: ({ color }) => <UiIconSymbol size={26} name="ladybug.fill" color={color} />,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  )
}
