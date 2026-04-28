import * as AuthSession from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Start loading as false so the button is visible by default
  const [loading, setLoading] = useState(false);

  // 1. AUTO-REDIRECT logic
  useEffect(() => {
    const checkUser = async () => {
      // Optional: setLoading(true) if you want to hide the form during check
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/workspaces');
      }
      setLoading(false); 
    };
    checkUser();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectTo = AuthSession.makeRedirectUri();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error || !data.url) {
        Alert.alert('Error', error?.message ?? 'Could not open Google sign in');
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') {
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
        if (sessionError) {
          Alert.alert('Google Sign In Failed', sessionError.message);
        } else {
          router.replace('/workspaces');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
      setLoading(false); // Stop spinning if login fails
    } else {
      router.replace('/workspaces');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>Log In</Text>
            <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={loading ? ['#444', '#333'] : ['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.or}>or</Text>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={loading}>
            <Text style={styles.googleText}>🔵 Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backText: { color: 'white', fontSize: 24 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingTop: 100, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff10', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ffffff20' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  forgotText: { color: '#C850C0', fontSize: 13 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#ffffff10', borderRadius: 10, padding: 14, color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20' },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 24 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  or: { color: '#ffffff50', textAlign: 'center', marginVertical: 12 },
  googleButton: { padding: 16, borderRadius: 30, alignItems: 'center', backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20' },
  googleText: { color: 'white', fontSize: 15 },
});