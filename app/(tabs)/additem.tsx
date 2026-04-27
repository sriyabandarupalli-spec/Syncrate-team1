// Add Item Screen — adds a new item OR edits an existing one
// if itemId is in params → edit mode (update), otherwise → add mode (insert)

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AddItemScreen() {
  const router = useRouter();

  const { workspaceId, workspaceName, itemId } = useLocalSearchParams<{
    workspaceId: string;
    workspaceName: string;
    itemId: string;
  }>();

  // if itemId exists we are editing, if not we are adding
  const isEditing = !!itemId;

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [threshold, setThreshold] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // if editing, fetch the existing item and pre-fill the form fields
  // this way the user sees the current values and can change only what they want
  useEffect(() => {
    if (!itemId) return;
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error || !data) return;

      // pre-fill all fields with current values
      setProductName(data.product_name || '');
      setSku(data.sku || '');
      setQuantity(String(data.quantity || 0));
      setLocation(data.location || '');
      setCategory(data.category || '');
      setThreshold(String(data.low_stock_threshold || 0));
      setNotes(data.notes || '');
    };
    fetchItem();
  }, [itemId]);

  const handleSave = async () => {
    setError('');

    if (!productName.trim()) {
      setError('Item name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required.');
      return;
    }
    if (!workspaceId) {
      setError('No workspace selected. Go back and tap a workspace first.');
      return;
    }

    setLoading(true);

    if (isEditing) {
      // update the existing item row instead of creating a new one
      const { error: updateError } = await supabase
        .from('items')
        .update({
          product_name: productName.trim(),
          sku: sku.trim().toUpperCase(),
          quantity: parseInt(quantity) || 0,
          location: location.trim(),
          category: category.trim(),
          low_stock_threshold: parseInt(threshold) || 0,
          notes: notes.trim(),
        })
        .eq('id', itemId);

      setLoading(false);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      Alert.alert('Success', 'Item updated!', [
        {
          text: 'OK', onPress: () => router.push({
            pathname: '/inventory',
            params: { workspaceId, workspaceName }
          })
        }
      ]);
    } else {
      // insert a brand new item
      const { error: insertError } = await supabase.from('items').insert({
        workspace_id: workspaceId,
        product_name: productName.trim(),
        sku: sku.trim().toUpperCase(),
        quantity: parseInt(quantity) || 0,
        location: location.trim(),
        category: category.trim(),
        low_stock_threshold: parseInt(threshold) || 0,
        notes: notes.trim(),
      });

      setLoading(false);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      Alert.alert('Success', 'Item added to inventory!', [
        {
          text: 'OK', onPress: () => router.push({
            pathname: '/inventory',
            params: { workspaceId, workspaceName }
          })
        }
      ]);
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

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* title changes based on whether we're adding or editing */}
        <Text style={styles.title}>{isEditing ? 'Edit Item' : 'Add Item'}</Text>
        {workspaceName ? (
          <Text style={styles.workspaceLabel}>
            {isEditing ? 'Editing in:' : 'Adding to:'} {workspaceName}
          </Text>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Blue Widget A"
            placeholderTextColor="#666"
            value={productName}
            onChangeText={(text) => { setProductName(text); setError(''); }}
          />

          <Text style={styles.label}>SKU / Barcode *</Text>
          <View style={styles.skuRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="e.g. BWA-001"
              placeholderTextColor="#666"
              autoCapitalize="characters"
              value={sku}
              onChangeText={(text) => { setSku(text); setError(''); }}
            />
            <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/scanner')}>
              <Text style={styles.scanBtnText}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Warehouse Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Aisle 3, Shelf B"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Electronics, Apparel..."
            placeholderTextColor="#666"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Low Stock Alert Threshold</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={threshold}
            onChangeText={setThreshold}
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Any additional details..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <LinearGradient
            colors={loading ? ['#888', '#666'] : ['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Item'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
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
  scroll: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 60 },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  workspaceLabel: { color: '#C850C0', fontSize: 13, marginBottom: 20 },
  errorBox: {
    backgroundColor: '#f8717120', borderRadius: 10, padding: 12,
    marginBottom: 16, borderWidth: 1, borderColor: '#f8717140',
  },
  errorText: { color: '#f87171', fontSize: 14 },
  card: {
    backgroundColor: '#ffffff10', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#ffffff20', marginBottom: 20,
  },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#ffffff10', borderRadius: 10, padding: 14,
    color: 'white', fontSize: 15, borderWidth: 1, borderColor: '#ffffff20',
  },
  skuRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  scanBtn: {
    backgroundColor: '#ffffff10', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#ffffff20',
  },
  scanBtnText: { fontSize: 20 },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { padding: 16, alignItems: 'center' },
  cancelText: { color: '#888', fontSize: 15 },
});