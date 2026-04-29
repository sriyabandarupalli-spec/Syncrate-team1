// Forgot Password Screen — sends a reset link via Supabase

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'exp://localhost:19000/--/reset-password',
      });

      if (error) throw error;

      Alert.alert('Email Sent', 'A password reset link has been sent to your email.', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* back → goes to login not further back */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/login')}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your account and we'll send you a reset link.
          </Text>

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

          <TouchableOpacity onPress={handleResetRequest} disabled={loading}>
            <LinearGradient
              colors={loading ? ['#444', '#333'] : ['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={styles.buttonText}>Send Reset Link</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backToLogin} onPress={() => router.push('/login')}>
            <Text style={styles.backToLoginText}>← Back to Log In</Text>
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
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#aaa', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#ffffff10', borderRadius: 10, padding: 14, color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20' },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 24 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  backToLogin: { alignItems: 'center', marginTop: 20 },
  backToLoginText: { color: '#C850C0', fontSize: 14 },
});
