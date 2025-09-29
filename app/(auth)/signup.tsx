import { Stack, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, createInitialUserProfile, createUserWithEmailAndPassword } from '../../Firebase';
import { colors, fonts } from '../constants/theme';

const SignupScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignup = async () => {
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setLoading(true);
    setError('');
    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. CREATE USER PROFILE IN FIRESTORE: This flags them as a new user.
        await createInitialUserProfile(user.uid);
        
        // The root layout will now see the new user + the new user profile and redirect.
        
    } catch (e) {
        const errorMessage = (e as any).code?.replace('auth/', '').replace(/-/g, ' ') || "Sign up failed.";
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Level Up Your Life</Text>
        <Text style={styles.subtitle}>Create an account and start your quest!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.light}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 chars)"
          placeholderTextColor={colors.light}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
          <Text style={styles.switchText}>Already have an account? <Text style={styles.linkText}>Log in</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: colors.bg },
  title: { fontFamily: fonts.bold, fontSize: 32, color: colors.text, marginBottom: 10 },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.light, marginBottom: 40 },
  input: { backgroundColor: colors.bg, padding: 15, borderRadius: 12, marginBottom: 15, fontFamily: fonts.regular, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.light + '30' },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 20 },
  buttonText: { fontFamily: fonts.bold, fontSize: 18, color: colors.bg },
  errorText: { fontFamily: fonts.regular, fontSize: 14, color: '#EF4444', marginBottom: 10, textAlign: 'center' },
  switchText: { fontFamily: fonts.regular, fontSize: 14, color: colors.light, textAlign: 'center' },
  linkText: { fontFamily: fonts.medium, color: colors.primary },
});

export default SignupScreen;