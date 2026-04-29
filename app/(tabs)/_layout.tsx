import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>

      {/* all hidden screens — no tab bar */}
      <Tabs.Screen name="index" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="login" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="signup" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="accounttype" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="forgotpassword" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="joinworkspace" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="createworkspace" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="scanresult" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="additem" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="settings" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="profile" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="explore" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="resetconfirmation" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="resetpasswordscreen" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="sidebar" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="scanner" options={{ href: null, tabBarStyle: { display: 'none' } }} />

      {/* main app screens — home and inventory only */}
      <Tabs.Screen
        name="workspaces"
        options={{
          tabBarStyle: { backgroundColor: '#0A0010', borderTopColor: '#2a0040' },
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
          tabBarActiveTintColor: '#C850C0',
          tabBarInactiveTintColor: '#555',
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          tabBarStyle: { backgroundColor: '#0A0010', borderTopColor: '#2a0040' },
          tabBarLabel: 'Inventory',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📦</Text>,
          tabBarActiveTintColor: '#C850C0',
          tabBarInactiveTintColor: '#555',
        }}
      />
    </Tabs>
  );
}