// Add Item Screen — saves a new inventory item to Supabase

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AddItemScreen() {
  const router = useRouter();

  // one state variable per form field so we can read the values when save is pressed
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [threshold, setThreshold] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    // validate required fields before even touching Supabase
    if (!productName.trim()) {
      setError('Item name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required.');
      return;
    }

    setLoading(true);

    // get the logged in user — we need their ID to find their workspace
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to add items.');
      setLoading(false);
      return;
    }

    // find which workspace this user owns so we can attach the item to it
    // .single() means we expect exactly one result back
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (workspaceError || !workspace) {
      setError('No workspace found. Please create a workspace first.');
      setLoading(false);
      return;
    }

    // insert the item — parseInt/parseFloat convert string inputs to numbers
    // because TextInput always returns strings but the DB columns are numeric
    const { error: insertError } = await supabase.from('items').insert({
      workspace_id: workspace.id,
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
      { text: 'OK', onPress: () => router.push('/inventory') }
    ]);
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
        <Text style={styles.title}>Add Item</Text>

        {/* error banner — only shows if something went wrong */}
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
              {loading ? 'Saving...' : 'Save Item'}
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
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  errorBox: {
    backgroundColor: '#f8717120',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f8717140',
  },
  errorText: { color: '#f87171', fontSize: 14 },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff20',
    marginBottom: 20,
  },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#ffffff10',
    borderRadius: 10,
    padding: 14,
    color: 'white',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  skuRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  scanBtn: {
    backgroundColor: '#ffffff10',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  scanBtnText: { fontSize: 20 },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  button: { padding: 16, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { padding: 16, alignItems: 'center' },
  cancelText: { color: '#888', fontSize: 15 },
});
