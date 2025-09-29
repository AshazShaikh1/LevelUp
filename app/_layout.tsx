import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import { auth, getUserProfile, onAuthStateChanged, signOut, UserProfile } from '../Firebase';
import { colors, fonts } from './constants/theme';

// --- 1. Auth Context ---
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// --- 2. AuthProvider ---
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
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

// --- 3. RootLayoutNav ---
function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const { user, userProfile, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const appIsLoading = isLoading || !fontsLoaded;

  useEffect(() => {
    if (appIsLoading) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';

    // If user logged in
    if (user) {
      // Onboarding required
      if (!userProfile?.setupComplete) {
        const inNewUserFlow = segments[0] === '(app)' && segments[1] === 'new-user-flow';
        if (!inNewUserFlow) {
          console.log("➡ Redirecting to onboarding createSkill");
          router.replace('/(app)/new-user-flow/createSkill');
        }
      } else if (inAuthGroup) {
        console.log("➡ Redirecting to tabs index");
        router.replace('/(tabs)');
      }
    } else if (!user && !inAuthGroup) {
      console.log("➡ Redirecting to login");
      router.replace('/(auth)/login');
    }
  }, [user, userProfile, fontsLoaded, isLoading, segments]);

  if (appIsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading App Data...</Text>
      </View>
    );
  }

  return <Slot />;
}

// --- 4. Root ---
export default function Root() {
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
