// Add Item Screen — user manually adds a new inventory item

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddItemScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // simulate save with loading state — will hook up to Supabase later
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/inventory');
    }, 800);
  };

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
        <Text style={styles.title}>Add Item</Text>

        <View style={styles.card}>
          {/* item name */}
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Blue Widget A"
            placeholderTextColor="#666"
          />

          {/* SKU — camera button opens scanner */}
          <Text style={styles.label}>SKU / Barcode *</Text>
          <View style={styles.skuRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="e.g. BWA-001"
              placeholderTextColor="#666"
              autoCapitalize="characters"
            />
            {/* tap to scan instead of typing */}
            <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/scanner')}>
              <Text style={styles.scanBtnText}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* quantity */}
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />

          {/* location */}
          <Text style={styles.label}>Warehouse Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Aisle 3, Shelf B"
            placeholderTextColor="#666"
          />

          {/* category */}
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Electronics, Apparel..."
            placeholderTextColor="#666"
          />

          {/* low stock threshold */}
          <Text style={styles.label}>Low Stock Alert Threshold</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />

          {/* notes */}
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Any additional details..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* save button with loading state */}
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
    paddingTop: 110,
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff20',
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 14,
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
  skuRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  scanBtn: {
    backgroundColor: '#ffffff10',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  scanBtnText: {
    fontSize: 20,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#888',
    fontSize: 15,
  },
});