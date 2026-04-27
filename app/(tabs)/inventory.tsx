// Inventory List Screen — fetches real items from Supabase for the selected workspace

import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

type Item = {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  category: string;
  location: string;
  low_stock_threshold: number;
};

export default function InventoryListScreen() {
  const router = useRouter();

  const { workspaceId, workspaceName } = useLocalSearchParams<{
    workspaceId: string;
    workspaceName: string;
  }>();

  const [items, setItems] = useState<Item[]>([]);
  const [filtered, setFiltered] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    if (!workspaceId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      console.error('Error fetching items:', error);
      return;
    }

    setItems(data || []);
    setFiltered(data || []);
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [workspaceId])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(items);
      return;
    }
    const lower = text.toLowerCase();
    setFiltered(items.filter(item =>
      item.product_name.toLowerCase().includes(lower) ||
      item.sku.toLowerCase().includes(lower)
    ));
  };

  const getStatusColor = (item: Item) => {
    if (item.quantity === 0) return '#f87171';
    if (item.quantity <= item.low_stock_threshold) return '#facc15';
    return '#4ade80';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/workspaces')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workspaceName || 'Inventory'}</Text>
        <TouchableOpacity onPress={() => router.push({
          pathname: '/additem',
          params: { workspaceId, workspaceName }
        })}>
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

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or SKU..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#C850C0" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySubtext}>Add items manually or scan a QR code to get started</Text>
          <View style={styles.emptyButtons}>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/additem',
              params: { workspaceId, workspaceName }
            })}>
              <LinearGradient
                colors={['#C850C0', '#8B2FC9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>+ Add Item</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/scanner')}>
              <Text style={styles.outlineButtonText}>📷 Scan QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => router.push({
                pathname: '/scanresult',
                params: { itemId: item.id, workspaceId, workspaceName }
              })}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <Text style={styles.itemSku}>{item.sku}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemQty}>{item.quantity}</Text>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item) }]} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
  },
  backText: { color: 'white', fontSize: 24 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  addButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  addButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  searchWrap: { paddingHorizontal: 20, marginBottom: 12 },
  searchInput: {
    backgroundColor: '#ffffff10', borderRadius: 12, padding: 12,
    color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySubtext: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  emptyButtons: { width: '100%', gap: 12 },
  button: { padding: 16, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  outlineButton: { padding: 16, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#ffffff30' },
  outlineButtonText: { color: 'white', fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  itemCard: {
    backgroundColor: '#ffffff10', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#ffffff20', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  itemLeft: { flex: 1 },
  itemName: { color: 'white', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemSku: { color: '#888', fontSize: 12 },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  itemQty: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});