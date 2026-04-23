import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase'; // Adjust path if needed

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    // This updates the user's password using the session 
    // established by the email recovery link
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    } else {
      Alert.alert('Success', 'Your password has been updated!', [
        { text: 'Log In', onPress: () => router.replace('/login') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>New Password</Text>
          <Text style={styles.subtitle}>
            Enter a new password for your account.
          </Text>

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Min 6 characters"
            placeholderTextColor="#666"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-type password"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity onPress={handleUpdatePassword} disabled={loading}>
            <LinearGradient
              colors={loading ? ['#444', '#333'] : ['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Update Password</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30 },
  card: { backgroundColor: '#ffffff10', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ffffff20' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 20 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#ffffff10', borderRadius: 10, padding: 14, color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20' },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 24 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});