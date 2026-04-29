// Join Workspace Screen — Merchant Seller enters an invite code to join a workspace

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function JoinWorkspaceScreen() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Required', 'Please enter an invite code.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in.');
        setLoading(false);
        return;
      }

      // look up workspace by invite code
      const { data: workspace, error: findError } = await supabase
        .from('workspaces')
        .select('id, name')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (findError || !workspace) {
        Alert.alert('Not Found', 'No workspace found with that invite code. Check with your manager.');
        setLoading(false);
        return;
      }

      // add user as a member
      const { error: joinError } = await supabase.from('workspace_members').insert({
        workspace_id: workspace.id,
        user_id: user.id,
      });

      if (joinError) throw joinError;

      Alert.alert('Joined!', `You've joined ${workspace.name}`, [
        { text: 'OK', onPress: () => router.replace('/workspaces') }
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

      {/* back → goes to workspaces not login */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/workspaces')}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🔗</Text>
        </View>

        <Text style={styles.heading}>Join a Workspace</Text>
        <Text style={styles.subheading}>
          Enter the invite code shared by your warehouse admin to join their workspace.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Invite Code</Text>
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="e.g. SYNC-4829"
            placeholderTextColor="#666"
            autoCapitalize="characters"
            maxLength={12}
            value={inviteCode}
            onChangeText={setInviteCode}
          />

          <Text style={styles.hint}>
            Ask your warehouse manager for the invite code. Codes are case-insensitive.
          </Text>

          <TouchableOpacity onPress={handleJoin} disabled={loading}>
            <LinearGradient
              colors={loading ? ['#444', '#333'] : ['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Join Workspace</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.qrButton} onPress={() => router.push('/scanner')}>
          <Text style={styles.qrButtonText}>📷  Scan QR Code Instead</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backText: { color: 'white', fontSize: 24 },
  scroll: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 120, paddingBottom: 60, alignItems: 'center' },
  iconWrap: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  icon: { fontSize: 30 },
  heading: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subheading: { color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 28, paddingHorizontal: 10 },
  card: { backgroundColor: '#ffffff10', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ffffff20', width: '100%' },
  label: { color: '#aaa', fontSize: 13, marginBottom: 8 },
  input: { backgroundColor: '#ffffff10', borderRadius: 10, padding: 14, color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20' },
  codeInput: { fontSize: 20, letterSpacing: 4, textAlign: 'center', fontWeight: 'bold' },
  hint: { color: '#666', fontSize: 12, marginTop: 8, lineHeight: 18 },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, width: '100%' },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ffffff20' },
  dividerText: { color: '#ffffff50', marginHorizontal: 12, fontSize: 14 },
  qrButton: { padding: 16, borderRadius: 30, alignItems: 'center', backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20', width: '100%' },
  qrButtonText: { color: 'white', fontSize: 15 },
});
