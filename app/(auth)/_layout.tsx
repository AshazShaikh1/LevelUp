import { Stack } from 'expo-router';
import React from 'react';

// This layout is for unauthorized users (Login/Signup screens)
const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* These will match the files (auth)/login.tsx and (auth)/signup.tsx */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
};

export default AuthLayout;
