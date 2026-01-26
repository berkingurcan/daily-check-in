import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Colors } from '@/constants/colors'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.aurora.tabBar.active,
        tabBarInactiveTintColor: Colors.aurora.tabBar.inactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
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
              style={focused ? styles.activeIcon : undefined}
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
              style={focused ? styles.activeIcon : undefined}
            />
          ),
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
              style={focused ? styles.activeIcon : undefined}
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.aurora.tabBar.background,
    borderTopColor: Colors.aurora.tabBar.border,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 4,
    height: 88,
  },
  tabBarLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    marginTop: 4,
  },
  tabBarItem: {
    paddingTop: 4,
  },
  activeIcon: {
    shadowColor: Colors.aurora.primary.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
})
