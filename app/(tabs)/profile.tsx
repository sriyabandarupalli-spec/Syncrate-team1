// Profile Screen — shows real user info from Supabase

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [user, setUser] = useState({
    name: '', email: '', memberSince: '—', initials: '👤',
  });

  useEffect(() => { fetchUser(); }, []);

  async function fetchUser() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) { Alert.alert('Error', error.message); return; }

      const authUser = data.user;
      if (!authUser) { router.replace('/login'); return; }

      const displayName =
        authUser.user_metadata?.display_name ||
        authUser.email?.split('@')[0] || 'User';

      setUser({
        name: displayName,
        email: authUser.email || '—',
        memberSince: authUser.created_at
          ? new Date(authUser.created_at).toLocaleDateString() : '—',
        initials: displayName[0]?.toUpperCase() || '👤',
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  function handleEditProfile() {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(true);
  }

  async function handleSaveProfile() {
    if (!editName.trim()) { Alert.alert('Missing name', 'Please enter a display name.'); return; }
    if (!editEmail.trim()) { Alert.alert('Missing email', 'Please enter an email.'); return; }

    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        email: editEmail.trim(),
        data: { display_name: editName.trim() },
      });
      if (error) { Alert.alert('Update failed', error.message); return; }
      await fetchUser();
      setIsEditing(false);
      Alert.alert('Profile updated', 'Your profile was updated successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) { Alert.alert('Sign out failed', error.message); return; }
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <View style={styles.header}>
        {/* back → goes to workspaces not login */}
        <TouchableOpacity onPress={() => router.push('/workspaces')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{loading ? '...' : user.initials}</Text>
          </LinearGradient>
          <Text style={styles.userName}>{loading ? 'Loading...' : user.name}</Text>

          {isEditing && (
            <View style={styles.editCard}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter display name"
                placeholderTextColor="#777"
              />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter email"
                placeholderTextColor="#777"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                  disabled={saving}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          {[
            { label: 'Email', value: user.email },
            { label: 'Member Since', value: user.memberSince },
          ].map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{loading ? 'Loading...' : row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          {[
            { label: '✏️  Edit Profile', onPress: handleEditProfile },
            { label: '🔑  Change Password', onPress: () => router.push('/forgotpassword') },
            { label: '🔔  Notifications', onPress: () => {} },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.actionRow} onPress={item.onPress}>
              <Text style={styles.actionText}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10,
  },
  backText: { color: 'white', fontSize: 24 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  settingsIcon: { fontSize: 20 },
  scroll: { paddingHorizontal: 24, paddingBottom: 80 },
  avatarWrap: { alignItems: 'center', marginVertical: 28 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  userName: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  card: {
    backgroundColor: '#ffffff10', borderRadius: 16,
    borderWidth: 1, borderColor: '#ffffff20', marginBottom: 16, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#ffffff10',
  },
  rowLabel: { color: '#888', fontSize: 14 },
  rowValue: { color: 'white', fontSize: 14, maxWidth: '60%', textAlign: 'right' },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#ffffff10',
  },
  actionText: { color: 'white', fontSize: 15 },
  chevron: { color: '#666', fontSize: 20 },
  signOutButton: {
    padding: 16, borderRadius: 30, alignItems: 'center',
    backgroundColor: '#f8717115', borderWidth: 1, borderColor: '#f8717130', marginTop: 8,
  },
  signOutText: { color: '#f87171', fontSize: 15, fontWeight: '600' },
  editCard: {
    width: '100%', backgroundColor: '#ffffff10', borderRadius: 16,
    borderWidth: 1, borderColor: '#ffffff20', padding: 16, marginTop: 20,
  },
  inputLabel: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 8 },
  input: {
    color: 'white', backgroundColor: '#00000030', borderWidth: 1,
    borderColor: '#ffffff20', borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15,
  },
  editButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  cancelButton: {
    flex: 1, padding: 14, borderRadius: 24, alignItems: 'center',
    backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20',
  },
  cancelText: { color: '#ddd', fontSize: 14, fontWeight: '600' },
  saveButton: {
    flex: 1, padding: 14, borderRadius: 24, alignItems: 'center',
    backgroundColor: '#C850C030', borderWidth: 1, borderColor: '#C850C060',
  },
  saveText: { color: '#C850C0', fontSize: 14, fontWeight: '700' },
});
