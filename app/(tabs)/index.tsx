// Splash Screen — first screen users see when they open the app

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* full screen diagonal gradient — dark version of the button colors */}
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* logo icon, app name, tagline */}
      <View style={styles.logoSection}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🛡️</Text>
        </View>
        <Text style={styles.logoText}>Syncrate</Text>
        <Text style={styles.tagline}>Inventory · Reimagined</Text>
      </View>

      {/* main headline and description */}
      <View style={styles.headlineSection}>
        <Text style={styles.headline}>
          Track every{' '}
          <Text style={styles.headlinePurple}>product, in real time.</Text>
        </Text>
        <Text style={styles.subtext}>
          Streamline your inventory management with powerful insights and seamless real-time synchronization.
        </Text>
      </View>

      {/* log in, create account, and google buttons */}
      <View style={styles.buttonSection}>

        {/* gradient log in button → goes to login screen */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* outline create account button → goes to signup screen */}
        <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/signup')}>
          <Text style={styles.outlineButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.or}>or</Text>

        {/* google sign in button */}
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
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#8B2FC9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 28,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tagline: {
    color: '#C850C0',
    fontSize: 13,
    letterSpacing: 1,
  },
  headlineSection: {
    marginBottom: 50,
  },
  headline: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  headlinePurple: {
    color: '#C850C0',
  },
  subtext: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
  buttonSection: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  outlineButtonText: {
    color: 'white',
    fontSize: 16,
  },
  or: {
    color: '#ffffff60',
    textAlign: 'center',
  },
  googleButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff15',
  },
  googleText: {
    color: 'white',
    fontSize: 15,
  },
});