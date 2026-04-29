// Sidebar — slides in from the left when user taps the ☰ menu icon

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function SidebarScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [initials, setInitials] = useState('👤');

  // fetch real user data from Supabase on load
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      const displayName =
        user.user_metadata?.display_name ||
        user.email?.split('@')[0] ||
        'User';

      setEmail(user.email || '');
      setName(displayName);
      setInitials(displayName[0]?.toUpperCase() || '👤');
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* close button → goes back to workspaces */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/workspaces')}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* real user info */}
      <View style={styles.userSection}>
        <LinearGradient
          colors={['#C850C0', '#8B2FC9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      {/* nav links */}
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/workspaces')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>My Workspaces</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* sign out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutIcon}>↩️</Text>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0010',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  closeButton: { alignSelf: 'flex-end', padding: 8, marginBottom: 20 },
  closeText: { color: 'white', fontSize: 20 },
  userSection: { alignItems: 'center', marginBottom: 36 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  userName: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { color: '#888', fontSize: 13 },
  navSection: { gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 14 },
  navIcon: { fontSize: 20 },
  navText: { color: 'white', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#ffffff20', marginVertical: 20 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
  signOutIcon: { fontSize: 20 },
  signOutText: { color: '#f87171', fontSize: 16 },
});
