// Inventory List Screen — shows all items in the current workspace

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MOCK_ITEMS = [
  { id: '1', name: 'Blue Widget A', sku: 'BWA-001', qty: 142, status: 'In Stock' },
  { id: '2', name: 'Red Widget B', sku: 'RWB-002', qty: 8, status: 'Low Stock' },
  { id: '3', name: 'Green Gear C', sku: 'GGC-003', qty: 0, status: 'Out of Stock' },
  { id: '4', name: 'Yellow Box D', sku: 'YBD-004', qty: 55, status: 'In Stock' },
  { id: '5', name: 'Silver Part E', sku: 'SPE-005', qty: 3, status: 'Low Stock' },
  { id: '6', name: 'Black Case F', sku: 'BCF-006', qty: 210, status: 'In Stock' },
];

const STATUS_COLORS: Record<string, string> = {
  'In Stock': '#4ade80',
  'Low Stock': '#facc15',
  'Out of Stock': '#f87171',
};

export default function InventoryListScreen() {
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

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
        {/* add item button */}
        <TouchableOpacity onPress={() => router.push('/additem')}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* search bar */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or SKU..."
          placeholderTextColor="#666"
        />
      </View>

      {/* summary pills */}
      <View style={styles.pillRow}>
        {[
          { label: 'All', count: 6 },
          { label: 'In Stock', count: 3 },
          { label: 'Low Stock', count: 2 },
          { label: 'Out of Stock', count: 1 },
        ].map((p) => (
          <TouchableOpacity key={p.label} style={styles.pill}>
            <Text style={styles.pillText}>{p.label} ({p.count})</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* item list */}
      <FlatList
        data={MOCK_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => router.push('/scanresult')}
          >
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSku}>{item.sku}</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemQty}>{item.qty}</Text>
              <Text style={[styles.itemStatus, { color: STATUS_COLORS[item.status] }]}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    paddingBottom: 16,
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
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#ffffff10',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  pillRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  pillText: {
    color: '#ccc',
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: '#ffffff10',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffffff20',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSku: {
    color: '#888',
    fontSize: 12,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemQty: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
});
