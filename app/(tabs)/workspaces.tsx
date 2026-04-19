// Workspaces Screen — main home screen after logging in
// shows all the user's warehouses/workspaces — empty until they create one

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WorkspacesScreen() {
  const router = useRouter();

  // this will eventually be replaced with real data from Supabase
  const workspaces: any[] = [];

  return (
    <View style={styles.container}>
      {/* background gradient */}
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* top bar — menu opens sidebar, + creates new workspace */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/sidebar')}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Work Spaces</Text>
        <TouchableOpacity onPress={() => router.push('/createworkspace')}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* empty state or list */}
      {workspaces.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No workspaces yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create your first workspace</Text>
          <TouchableOpacity onPress={() => router.push('/createworkspace')}>
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
      ) : (
        <ScrollView style={styles.list}>
          {workspaces.map((workspace) => (
            <TouchableOpacity
              key={workspace.id}
              style={styles.card}
              onPress={() => router.push('/inventory')}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.workspaceName}>{workspace.name}</Text>
                <Text style={styles.companyName}>{workspace.company}</Text>
                <Text style={styles.itemCount}>{workspace.items} items</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.arrow}>›</Text>
                <Text style={styles.lastUpdated}>{workspace.lastUpdated}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuIcon: {
    color: 'white',
    fontSize: 22,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addIcon: {
    color: '#C850C0',
    fontSize: 26,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a0035',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardLeft: {
    flex: 1,
  },
  workspaceName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    color: '#C850C0',
    fontSize: 13,
    marginBottom: 4,
  },
  itemCount: {
    color: '#aaa',
    fontSize: 12,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  arrow: {
    color: '#8B2FC9',
    fontSize: 24,
  },
  lastUpdated: {
    color: '#555',
    fontSize: 11,
    marginTop: 4,
  },
});