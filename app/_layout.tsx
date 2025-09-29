import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import 'react-native-url-polyfill/auto';

// Import Firebase functions and UserProfile type
// NOTE: Ensure you have installed @react-native-async-storage/async-storage
import { auth, getUserProfile, onAuthStateChanged, signOut, UserProfile } from '../Firebase';
import { colors, fonts } from './constants/theme';

// --- 1. Auth Context (Central State) ---
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null; // Added UserProfile to context
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  logout: async () => {},
});

// Hook for accessing Auth context easily
export const useAuth = () => useContext(AuthContext);

// --- 2. Auth Context Provider (Handles Firebase Listener & Profile Fetch) ---
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle both auth state and profile fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch the user's profile immediately after login/sign up
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- 3. Redirect Logic and Font Checker Component ---
function RootLayoutNav() {
  // Your original font loading logic
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const { user, userProfile, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // App is loading if fonts aren't ready OR if we are checking auth/profile status
  const appIsLoading = isLoading || !fontsLoaded;
  
  // This effect handles navigation and hiding the splash screen
  useEffect(() => {
    if (appIsLoading) return;

    // Hide the splash screen once everything is loaded
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';
    
    // --- Onboarding Check ---
    // User is new if they exist, their profile is loaded, and 'setupComplete' is false.
    const isNewUserFlowRequired = user && userProfile && !userProfile.setupComplete;

    if (user) {
        if (isNewUserFlowRequired) {
            // New user, ensure they are in the onboarding flow path
            const inNewUserFlow = segments[0] === '(app)' as any && segments[1] === 'new-user-flow' as any;
            if (!inNewUserFlow) { 
                // Navigate to the first step of the onboarding flow
                router.replace('/(app)/new-user-flow/create-skill' as any);
            }
        } else if (inAuthGroup) {
            // Existing user OR new user setup is complete, redirect away from login screens
            router.replace('/(tabs)/index' as any);
        }
    } else if (!user && !inAuthGroup) {
        // User is NOT logged in, redirect to the login screen
        router.replace('/(auth)/login');
    }
  }, [user, userProfile, appIsLoading, segments]);

  // Show a loading indicator while checking auth status OR loading fonts
  if (appIsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading App Data...</Text>
      </View>
    );
  }

  // The Slot renders the entire screen content based on the current path ((tabs), (auth), or (app))
  return <Slot />;
}

// --- 4. Root Export (Wraps app in Auth Provider) ---
export default function Root() {
  // Prevent native splash screen from auto-hiding before asset loading is complete
  SplashScreen.preventAutoHideAsync();

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});
