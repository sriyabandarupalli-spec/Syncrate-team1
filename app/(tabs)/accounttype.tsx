// Account Type Screen — after signing up, user picks if they are a Warehouse Owner or Merchant Seller
// this is the dual role system — different roles get different access in the app

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountTypeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* background gradient */}
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

      {/* title and subtitle */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Choose Account Type</Text>
        <Text style={styles.subtitle}>Select the option that best describes your business</Text>
      </View>

      {/* warehouse owner button → goes to workspaces */}
      <TouchableOpacity style={styles.optionButton} onPress={() => router.push('/workspaces')}>
        <View style={styles.optionIcon}>
          <Text style={styles.optionEmoji}>🏭</Text>
        </View>
        <Text style={styles.optionText}>Sign Up as Warehouse Owner</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* merchant seller button → goes to join workspace */}
      <TouchableOpacity style={styles.optionButton} onPress={() => router.push('/joinworkspace')}>
        <View style={styles.optionIcon}>
          <Text style={styles.optionEmoji}>🛍️</Text>
        </View>
        <Text style={styles.optionText}>Sign Up as Merchant Seller</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
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
    top: 0, left: 0, right: 0, bottom: 0,
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
  headerSection: {
    marginBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0035',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#8B2FC9',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#8B2FC9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  arrow: {
    color: '#8B2FC9',
    fontSize: 24,
  },
});