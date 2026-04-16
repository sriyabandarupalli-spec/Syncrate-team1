// Create Workspace Screen — user sets up a new warehouse workspace

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateWorkspaceScreen() {
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

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🏭</Text>
        </View>

        <Text style={styles.heading}>Create a Workspace</Text>
        <Text style={styles.subheading}>
          Set up your warehouse workspace. You can invite team members after it's created.
        </Text>

        {/* form card */}
        <View style={styles.card}>
          {/* workspace name */}
          <Text style={styles.label}>Workspace Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Main Warehouse"
            placeholderTextColor="#666"
          />

          {/* location */}
          <Text style={styles.label}>Location (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Los Angeles, CA"
            placeholderTextColor="#666"
          />

          {/* industry */}
          <Text style={styles.label}>Industry</Text>
          <View style={styles.pillRow}>
            {['Retail', 'E-commerce', 'Logistics', 'Manufacturing', 'Other'].map((item) => (
              <TouchableOpacity key={item} style={styles.pill}>
                <Text style={styles.pillText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* team size */}
          <Text style={styles.label}>Team Size</Text>
          <View style={styles.pillRow}>
            {['1–5', '6–20', '21–50', '50+'].map((item) => (
              <TouchableOpacity key={item} style={styles.pill}>
                <Text style={styles.pillText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* create button → goes to workspaces */}
          <TouchableOpacity onPress={() => router.push('/workspaces')}>
            <LinearGradient
              colors={['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Create Workspace</Text>
            </LinearGradient>
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
    paddingHorizontal: 30,
    paddingTop: 120,
    paddingBottom: 60,
    alignItems: 'center',
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 30,
  },
  heading: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ffffff20',
    width: '100%',
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 16,
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
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  pillText: {
    color: 'white',
    fontSize: 13,
  },
  button: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
