import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // hide tab bar by default
      }}>
      
      {/* auth screens — no tab bar */}
      <Tabs.Screen name="index" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="login" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="signup" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="accounttype" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="forgotpassword" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="joinworkspace" options={{ tabBarStyle: { display: 'none' } }} />

      {/* main app screens — show tab bar */}
      <Tabs.Screen name="workspaces" options={{ tabBarStyle: { backgroundColor: '#0A0010', borderTopColor: '#333' } }} />
      <Tabs.Screen name="inventory" options={{ tabBarStyle: { backgroundColor: '#0A0010', borderTopColor: '#333' } }} />
      <Tabs.Screen name="scanner" options={{ tabBarStyle: { backgroundColor: '#0A0010', borderTopColor: '#333' } }} />
      <Tabs.Screen name="scanresult" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="profile" options={{ tabBarStyle: { backgroundColor: '#0A0010', borderTopColor: '#333' } }} />
      <Tabs.Screen name="settings" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="createworkspace" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="additem" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="explore" options={{ tabBarStyle: { display: 'none' }, href: null }} />
    </Tabs>
  );
}