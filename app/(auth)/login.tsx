import { Stack, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../../Firebase';
import { colors, fonts } from '../constants/theme';

const LoginScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    setLoading(true);
    setError('');
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Auth listener in _layout.tsx handles redirection upon success
    } catch (e) {
        // Simple error parsing for user feedback
        const errorMessage = (e as any).code?.replace('auth/', '').replace(/-/g, ' ') || "Login failed. Check your credentials.";
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your leveling journey.</Text>

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
          placeholder="Password"
          placeholderTextColor={colors.light}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
          <Text style={styles.switchText}>Don't have an account? <Text style={styles.linkText}>Sign up</Text></Text>
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

export default LoginScreen;
