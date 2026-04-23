// Profile Screen — shows user info and account details

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react'; // Added useEffect import
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'User',
    workspace: '—',
    memberSince: '—',
    initials: '👤',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      const authUser = data.user;

      if (!authUser) {
        router.replace('/login');
        return;
      }

      const displayName =
        authUser.user_metadata?.display_name ||
        authUser.email?.split('@')[0] ||
        'User';

      const email = authUser.email || '—';

      const memberSince = authUser.created_at
        ? new Date(authUser.created_at).toLocaleDateString()
        : '—';

      const initials =
        displayName.length > 0 ? displayName[0].toUpperCase() : '👤';

      setUser({
        name: displayName,
        email,
        role: authUser.user_metadata?.role || 'User',
        workspace: authUser.user_metadata?.workspace || '—',
        memberSince,
        initials,
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Sign out failed', error.message);
      return;
    }

    router.replace('/login');
  }

  // The stray "});" that was here has been removed.

  return (
    <View style={styles.container}>
      {/* background gradient */}
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* avatar */}
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{user.initials}</Text>
          </LinearGradient>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        </View>

        {/* info card */}
        <View style={styles.card}>
          {[
            { label: 'Email', value: user.email },
            { label: 'Workspace', value: user.workspace },
            { label: 'Member Since', value: user.memberSince },
          ].map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* action buttons */}
        <View style={styles.card}>
          {[
            { label: '✏️  Edit Profile', onPress: () => {} },
            { label: '🔑  Change Password', onPress: () => router.push('/forgotpassword') },
            { label: '🔔  Notifications', onPress: () => {} },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.actionRow} onPress={item.onPress}>
              <Text style={styles.actionText}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* sign out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut} // Updated to call the actual function
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backText: {
    color: 'white',
    fontSize: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsIcon: {
    fontSize: 20,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  avatarWrap: {
    alignItems: 'center',
    marginVertical: 28,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#C850C020',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#C850C040',
  },
  roleText: {
    color: '#C850C0',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff20',
    marginBottom: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
  },
  rowLabel: {
    color: '#888',
    fontSize: 14,
  },
  rowValue: {
    color: 'white',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
  },
  actionText: {
    color: 'white',
    fontSize: 15,
  },
  chevron: {
    color: '#666',
    fontSize: 20,
  },
  signOutButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#f8717115',
    borderWidth: 1,
    borderColor: '#f8717130',
    marginTop: 8,
  },
  signOutText: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '600',
  },
});