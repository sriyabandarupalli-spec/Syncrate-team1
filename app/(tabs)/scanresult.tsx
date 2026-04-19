// Scan Result Screen — shows item details after a QR code is scanned
// item data will come from Supabase lookup using the scanned SKU

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanResultScreen() {
  const router = useRouter();

  // this will be replaced with real data from Supabase once backend is connected
  // for now showing placeholder so the screen layout is visible
  const item = {
    name: 'Item Name',
    sku: 'SKU-000',
    qty: 0,
    location: '—',
    category: '—',
    lastUpdated: '—',
    status: 'Unknown',
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
        {/* success indicator */}
        <View style={styles.successRow}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successText}>Scan Successful</Text>
        </View>

        {/* item name + status badge */}
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📦</Text>
          </View>
          <View style={styles.topInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSku}>{item.sku}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* quantity card with + and - buttons */}
        <View style={styles.qtyCard}>
          <Text style={styles.qtyLabel}>Current Quantity</Text>
          <Text style={styles.qtyValue}>{item.qty}</Text>
          <View style={styles.qtyActions}>
            {/* decrease quantity */}
            <TouchableOpacity style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            {/* increase quantity */}
            <TouchableOpacity style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* item detail rows */}
        <View style={styles.card}>
          {[
            { label: 'Location', value: item.location },
            { label: 'Category', value: item.category },
            { label: 'Last Updated', value: item.lastUpdated },
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* edit item → goes to add/edit item screen */}
        <TouchableOpacity onPress={() => router.push('/additem')}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Edit Item</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* scan again → goes back to scanner */}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/scanner')}>
          <Text style={styles.secondaryButtonText}>📷 Scan Again</Text>
        </TouchableOpacity>

        {/* remove item — will hook up to Supabase delete later */}
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Remove Item</Text>
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
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
  },
  successCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C850C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successText: {
    color: '#C850C0',
    fontSize: 16,
    fontWeight: '600',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  topInfo: {
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemSku: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#ffffff15',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  statusText: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '600',
  },
  qtyCard: {
    backgroundColor: '#ffffff10',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ffffff20',
    alignItems: 'center',
    marginBottom: 16,
  },
  qtyLabel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
  },
  qtyValue: {
    color: 'white',
    fontSize: 52,
    fontWeight: 'bold',
    lineHeight: 60,
  },
  qtyActions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff15',
    borderWidth: 1,
    borderColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff20',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff20',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 15,
  },
  dangerButton: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#f8717115',
    borderWidth: 1,
    borderColor: '#f8717130',
  },
  dangerButtonText: {
    color: '#f87171',
    fontSize: 15,
  },
});