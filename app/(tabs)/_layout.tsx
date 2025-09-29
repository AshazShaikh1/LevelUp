import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { colors, fonts } from "../constants/theme";

// The layout file should be minimal and only import components needed for the tab bar structure itself.

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.light,
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
      {/* 1. DASHBOARD / HOME (Skill Analysis Summary) */}
      <Tabs.Screen
        name='index'
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 2. QUESTS & SKILLS MANAGEMENT (Now using the correct file name) */}
      <Tabs.Screen
        name='quests-skills'
        options={{
          title: "Quests",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "list-circle" : "list-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      
      {/* Note: 'explore' and 'history' screens have been commented out or removed here */}

    </Tabs>
  );
};

export default TabsLayout;
