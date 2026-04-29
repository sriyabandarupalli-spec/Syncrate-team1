// Scan Result Screen — fetches real item data from Supabase using itemId from route params

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

type Item = {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  location: string;
  category: string;
  supplier: string;
  cost_per_unit: number;
  date_recieved: string;
  expected_ship_date: string;
  created_at: string;
  low_stock_threshold: number;
  workspace_id: string;
  notes: string;
};

export default function ScanResultScreen() {
  const router = useRouter();

  const { itemId, workspaceId, workspaceName } = useLocalSearchParams<{
    itemId: string;
    workspaceId: string;
    workspaceName: string;
  }>();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [savingQty, setSavingQty] = useState(false);

  // clear and refetch every time itemId changes — prevents stale data bug
  useEffect(() => {
    setItem(null);
    setLoading(true);
    if (!itemId) return;
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    setLoading(false);

    if (error || !data) {
      Alert.alert('Error', 'Could not load item details.');
      router.back();
      return;
    }

    setItem(data);
    setQuantity(data.quantity);
  };

  const updateQuantity = async (newQty: number) => {
    if (newQty < 0) return;
    setQuantity(newQty);
    setSavingQty(true);

    const { error } = await supabase
      .from('items')
      .update({ quantity: newQty })
      .eq('id', itemId);

    setSavingQty(false);

    if (error) {
      Alert.alert('Error', 'Could not update quantity.');
      setQuantity(quantity);
    }
  };

  const handleRemove = async () => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to delete this item from inventory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('items').delete().eq('id', itemId);
            router.push({
              pathname: '/inventory',
              params: { workspaceId, workspaceName }
            });
          },
        },
      ]
    );
  };

  const getStatus = () => {
    if (!item) return 'Unknown';
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= item.low_stock_threshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = () => {
    const s = getStatus();
    if (s === 'In Stock') return '#4ade80';
    if (s === 'Low Stock') return '#facc15';
    return '#f87171';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C850C0" />
        <Text style={styles.loadingText}>Loading item...</Text>
      </View>
    );
  }

  if (!item) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3D0040', '#1a0035', '#0A0010']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* success header */}
        <View style={styles.successRow}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successText}>Item Found</Text>
        </View>

        {/* item name + status */}
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📦</Text>
          </View>
          <View style={styles.topInfo}>
            <Text style={styles.itemName}>{item.product_name}</Text>
            <Text style={styles.itemSku}>{item.sku}</Text>
          </View>
          <View style={[styles.statusBadge, {
            borderColor: getStatusColor() + '40',
            backgroundColor: getStatusColor() + '20'
          }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatus()}
            </Text>
          </View>
        </View>

        {/* quantity card with + and - */}
        <View style={styles.qtyCard}>
          <Text style={styles.qtyLabel}>
            Current Quantity {savingQty ? '(saving...)' : ''}
          </Text>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <View style={styles.qtyActions}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(quantity - 1)}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(quantity + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* all item details */}
        <View style={styles.card}>
          {[
            { label: 'Location', value: item.location || '—' },
            { label: 'Category', value: item.category || '—' },
            { label: 'Supplier', value: item.supplier || '—' },
            { label: 'Cost Per Unit', value: item.cost_per_unit ? `$${item.cost_per_unit}` : '—' },
            { label: 'Date Received', value: formatDate(item.date_recieved) },
            { label: 'Expected Ship Date', value: formatDate(item.expected_ship_date) },
            { label: 'Low Stock At', value: `${item.low_stock_threshold} units` },
            { label: 'Date Added', value: formatDate(item.created_at) },
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}

          {/* notes — only show if there are notes */}
          {item.notes ? (
            <View style={styles.notesRow}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesValue}>{item.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* edit button */}
        <TouchableOpacity onPress={() => router.push({
          pathname: '/additem',
          params: {
            itemId: item.id,
            workspaceId: item.workspace_id,
            workspaceName: workspaceName,
          }
        })}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Edit Item</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push({
            pathname: '/scanner',
            params: { workspaceId, workspaceName }
          })}
        >
          <Text style={styles.secondaryButtonText}>📷 Scan Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={handleRemove}>
          <Text style={styles.dangerButtonText}>Remove Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  loadingContainer: {
    flex: 1, backgroundColor: '#0A0010',
    justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  loadingText: { color: 'white', fontSize: 16 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backText: { color: 'white', fontSize: 24 },
  scroll: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 60 },
  successRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginBottom: 24, gap: 10,
  },
  successCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#C850C0', alignItems: 'center', justifyContent: 'center',
  },
  successIcon: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  successText: { color: '#C850C0', fontSize: 16, fontWeight: '600' },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  iconText: { fontSize: 22 },
  topInfo: { flex: 1 },
  itemName: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  itemSku: { color: '#888', fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '600' },
  qtyCard: {
    backgroundColor: '#ffffff10', borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: '#ffffff20', alignItems: 'center', marginBottom: 16,
  },
  qtyLabel: { color: '#aaa', fontSize: 13, marginBottom: 6 },
  qtyValue: { color: 'white', fontSize: 52, fontWeight: 'bold', lineHeight: 60 },
  qtyActions: { flexDirection: 'row', gap: 20, marginTop: 16 },
  qtyBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#ffffff15', borderWidth: 1, borderColor: '#ffffff20',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  card: {
    backgroundColor: '#ffffff10', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#ffffff20', marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ffffff10',
  },
  detailLabel: { color: '#888', fontSize: 14 },
  detailValue: { color: 'white', fontSize: 14, maxWidth: '60%', textAlign: 'right' },
  notesRow: { paddingVertical: 10 },
  notesValue: { color: 'white', fontSize: 14, marginTop: 6, lineHeight: 20 },
  primaryButton: { padding: 16, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    padding: 16, borderRadius: 30, alignItems: 'center',
    backgroundColor: '#ffffff10', borderWidth: 1, borderColor: '#ffffff20', marginBottom: 12,
  },
  secondaryButtonText: { color: 'white', fontSize: 15 },
  dangerButton: {
    padding: 16, borderRadius: 30, alignItems: 'center',
    backgroundColor: '#f8717115', borderWidth: 1, borderColor: '#f8717130',
  },
  dangerButtonText: { color: '#f87171', fontSize: 15 },
});
