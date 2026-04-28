// Account Type Screen — after signing up, user picks if they are a Warehouse Owner or Merchant Seller
// this is the dual role system — different roles get different access in the app

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

type AccountRole = 'warehouse_owner' | 'merchant_seller';
type NextRoute = '/workspaces' | '/joinworkspace';

export default function AccountTypeScreen() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<AccountRole | null>(null);

  async function handleChooseRole(role: AccountRole, nextRoute: NextRoute) {
    try {
      setLoadingRole(role);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        Alert.alert('Error', userError.message);
        return;
      }

      const authUser = userData.user;

      if (!authUser) {
        Alert.alert(
          'Not logged in',
          'Please log in before choosing an account type.'
        );
        router.replace('/login');
        return;
      }

      const displayName =
        authUser.user_metadata?.display_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'User';

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: authUser.id,
            display_name: displayName,
            role,
          },
          {
            onConflict: 'user_id',
          }
        );

      if (profileError) {
        Alert.alert('Error', profileError.message);
        return;
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          role,
        },
      });

      if (metadataError) {
        Alert.alert('Error', metadataError.message);
        return;
      }

      router.replace(nextRoute);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save account type.');
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loadingRole !== null}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.title}>Choose Account Type</Text>
        <Text style={styles.subtitle}>
          Select the option that best describes your business
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.optionButton,
          loadingRole !== null && styles.disabledButton,
        ]}
        disabled={loadingRole !== null}
        onPress={() => handleChooseRole('warehouse_owner', '/workspaces')}
      >
        <View style={styles.optionIcon}>
          <Text style={styles.optionEmoji}>🏭</Text>
        </View>

        <Text style={styles.optionText}>
          {loadingRole === 'warehouse_owner'
            ? 'Saving...'
            : 'Sign Up as Warehouse Owner'}
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          loadingRole !== null && styles.disabledButton,
        ]}
        disabled={loadingRole !== null}
        onPress={() => handleChooseRole('merchant_seller', '/joinworkspace')}
      >
        <View style={styles.optionIcon}>
          <Text style={styles.optionEmoji}>🛍️</Text>
        </View>

        <Text style={styles.optionText}>
          {loadingRole === 'merchant_seller'
            ? 'Saving...'
            : 'Sign Up as Merchant Seller'}
        </Text>

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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  disabledButton: {
    opacity: 0.6,
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