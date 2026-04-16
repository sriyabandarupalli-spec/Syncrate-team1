// Login Screen — existing users enter their email and password to log in

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* background gradient — same as splash */}
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* back arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* form card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>Log In</Text>
            {/* forgot password link → goes to forgot password screen */}
            <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* email input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
          />

          {/* password input */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
          />

          {/* log in button → goes to workspaces screen */}
          <TouchableOpacity onPress={() => router.push('/workspaces')}>
            <LinearGradient
              colors={['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.or}>or</Text>

          {/* google button */}
          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleText}>🔵 Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0010',
  },
  background: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: 'white',
    fontSize: 24,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#C850C0',
    fontSize: 13,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#ffffff10',
    borderRadius: 10,
    padding: 14,
    color: 'white',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ffffff20',
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
    color: '#ffffff50',
    textAlign: 'center',
    marginVertical: 12,
  },
  googleButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  googleText: {
    color: 'white',
    fontSize: 15,
  },
});