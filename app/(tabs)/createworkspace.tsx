// Create Workspace Screen — creates a new workspace in Supabase

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function CreateWorkspaceScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a workspace name.');
      return;
    }

    setLoading(true);

    try {
      // get the logged in user so we can set owner_id
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'You must be logged in to create a workspace.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('workspaces').insert([{
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        industry: selectedIndustry,
        team_size: selectedTeamSize,
        owner_id: user.id,
      }]);

      if (error) throw error;

      router.replace('/workspaces');
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
          <Text style={styles.icon}>🏭</Text>
        </View>

        <Text style={styles.heading}>Create a Workspace</Text>
        <Text style={styles.subheading}>
          Set up your warehouse workspace. You can invite team members after it's created.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Workspace Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Main Warehouse"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Location (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Los Angeles, CA"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What is this workspace for?"
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Industry</Text>
          <View style={styles.pillRow}>
            {['Retail', 'E-commerce', 'Logistics', 'Manufacturing', 'Other'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.pill, selectedIndustry === item && styles.pillSelected]}
                onPress={() => setSelectedIndustry(item)}
              >
                <Text style={[styles.pillText, selectedIndustry === item && styles.pillTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Team Size</Text>
          <View style={styles.pillRow}>
            {['1–5', '6–20', '21–50', '51–100', '100+'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.pill, selectedTeamSize === item && styles.pillSelected]}
                onPress={() => setSelectedTeamSize(item)}
              >
                <Text style={[styles.pillText, selectedTeamSize === item && styles.pillTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleCreate} disabled={loading}>
            <LinearGradient
              colors={loading ? ['#444', '#333'] : ['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Workspace</Text>
              )}
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
  label: { color: '#aaa', fontSize: 13, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#ffffff10', borderRadius: 10, padding: 14, color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20' },
  textArea: { height: 80, textAlignVertical: 'top' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20' },
  pillSelected: { backgroundColor: '#8B2FC9', borderColor: '#C850C0' },
  pillText: { color: '#aaa', fontSize: 13 },
  pillTextSelected: { color: 'white', fontWeight: 'bold' },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 28 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
