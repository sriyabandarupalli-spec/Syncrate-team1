
// Sign Up Screen — new users create an account with email, password, and display name

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* purple glow in background */}
      <View style={styles.glow} />

      {/* back arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* form card */}
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        {/* email input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          keyboardType="email-address"
        />

        {/* password input */}
        <Text style={styles.label}>Create Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#666"
          secureTextEntry
        />

        {/* repeat password input */}
        <Text style={styles.label}>Repeat Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeat your password"
          placeholderTextColor="#666"
          secureTextEntry
        />

        {/* display name input */}
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your display name"
          placeholderTextColor="#666"
        />

        {/* sign up button → goes to choose account type screen */}
        <TouchableOpacity onPress={() => router.push('/accounttype')}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.or}>or</Text>

        {/* google button */}
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>🔵 Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0010',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#6B00B6',
    opacity: 0.25,
    alignSelf: 'center',
    top: '10%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backText: {
    color: 'white',
    fontSize: 24,
  },
  card: {
    backgroundColor: '#110022',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    color: 'white',
    fontSize: 15,
  },
  button: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  or: {
    color: '#555',
    textAlign: 'center',
    marginVertical: 12,
  },
  googleButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  googleText: {
    color: 'white',
    fontSize: 15,
  },
});