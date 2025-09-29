import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { colors, fonts } from "../constants/theme";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          borderTopWidth: 0,
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: fonts.regular,
        },
        headerShown: false,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name='index'
        options={{
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Explore */}
      <Tabs.Screen
        name='explore'
        options={{
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="compass-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* History */}
      <Tabs.Screen
        name='history'
        options={{
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="history"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Profile / Type Icon */}
      <Tabs.Screen
        name='profile'
        options={{
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
