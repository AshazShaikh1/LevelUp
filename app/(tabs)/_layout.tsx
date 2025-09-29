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
          backgroundColor: colors.bg,
          borderTopWidth: 0.2,
          borderTopColor: colors.secondary,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
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
