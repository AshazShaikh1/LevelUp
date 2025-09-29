import { Stack } from 'expo-router';
import React from 'react';

const NewUserFlowLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The only screen in the onboarding flow */}
      <Stack.Screen name="createSkill" />
    </Stack>
  );
};

export default NewUserFlowLayout;