// Scanner Screen — scans a QR code then looks up the item in Supabase
// Case 1: item found → go to scan result
// Case 2: item not found → offer to add it with SKU pre-filled
// Case 3: camera permission not granted → show permission screen
// Case 4: loading while querying → show spinner

import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ScannerScreen() {
  const router = useRouter();

  // if coming from inventory, we have workspaceId/workspaceName to pass along
  const { workspaceId, workspaceName } = useLocalSearchParams<{
    workspaceId: string;
    workspaceName: string;
  }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [looking, setLooking] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [scannedSku, setScannedSku] = useState('');

  // ref lock prevents the camera firing the handler dozens of times per second
  const isProcessing = useRef(false);

  const handleBarcodeScan = async ({ data }: { data: string }) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setScanned(true);
    setLooking(true);
    setNotFound(false);

    const sku = data.trim().toUpperCase();
    setScannedSku(sku);

    // look up the SKU in Supabase
    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('sku', sku)
      .single();

    setLooking(false);

    if (error || !item) {
      // item not found — show options to add it or scan again
      setNotFound(true);
      return;
    }

    // item found — go to scan result with full context
    router.push({
      pathname: '/scanresult',
      params: {
        itemId: item.id,
        workspaceId: workspaceId || item.workspace_id,
        workspaceName: workspaceName || '',
      }
    });

    setTimeout(() => {
      isProcessing.current = false;
      setScanned(false);
      setNotFound(false);
    }, 1000);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setNotFound(false);
    setScannedSku('');
    isProcessing.current = false;
  };

  const handleAddItem = () => {
    // go to add item with the scanned SKU pre-filled
    router.push({
      pathname: '/additem',
      params: {
        workspaceId: workspaceId || '',
        workspaceName: workspaceName || '',
        prefillSku: scannedSku,
      }
    });
  };

  // permission not loaded yet
  if (!permission) return <View style={styles.container} />;

  // permission denied
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionEmoji}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.message}>We need camera access to scan QR codes</Text>
        <TouchableOpacity onPress={requestPermission}>
          <LinearGradient
            colors={['#C850C0', '#8B2FC9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // loading while querying Supabase
  if (looking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C850C0" />
        <Text style={styles.loadingText}>Looking up item...</Text>
      </View>
    );
  }

  // item not found in DB — offer to add or scan again
  if (notFound) {
    return (
      <View style={styles.notFoundContainer}>
        <LinearGradient
          colors={['#3D0040', '#1a0035', '#0A0010']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundEmoji}>🔍</Text>
          <Text style={styles.notFoundTitle}>Item Not Found</Text>
          <Text style={styles.notFoundSku}>SKU: {scannedSku}</Text>
          <Text style={styles.notFoundMsg}>
            This item doesn't exist in your inventory yet. Would you like to add it?
          </Text>

          {/* add item with SKU pre-filled */}
          <TouchableOpacity onPress={handleAddItem}>
            <LinearGradient
              colors={['#C850C0', '#8B2FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>+ Add This Item</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* scan again */}
          <TouchableOpacity style={styles.outlineButton} onPress={handleScanAgain}>
            <Text style={styles.outlineButtonText}>Scan Again</Text>
          </TouchableOpacity>

          {/* go back */}
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // default — show camera with scan frame overlay
  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScan}
        />
      )}

      {!scanned && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* dark overlay around scan frame */}
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame}>
              {/* corner accents */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.scanHint}>Point at a QR code to scan</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const CORNER_SIZE = 20;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  camera: { flex: 1 },

  // permission screen
  permissionContainer: {
    flex: 1, backgroundColor: '#0A0010',
    justifyContent: 'center', alignItems: 'center', padding: 30, gap: 16,
  },
  permissionEmoji: { fontSize: 60 },
  permissionTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  message: { color: '#aaa', fontSize: 15, textAlign: 'center' },

  // loading screen
  loadingContainer: {
    flex: 1, backgroundColor: '#0A0010',
    justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  loadingText: { color: 'white', fontSize: 16 },

  // not found screen
  notFoundContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  notFoundCard: {
    backgroundColor: '#ffffff10', borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: '#ffffff20', width: '100%',
    alignItems: 'center', gap: 12,
  },
  notFoundEmoji: { fontSize: 48 },
  notFoundTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  notFoundSku: { color: '#C850C0', fontSize: 14, fontWeight: '600' },
  notFoundMsg: { color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // camera overlay
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backText: { color: 'white', fontSize: 24 },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayMiddle: { flexDirection: 'row', height: 260 },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayBottom: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', paddingTop: 24,
  },
  scanFrame: {
    width: 260, height: 260,
    backgroundColor: 'transparent',
  },
  scanHint: { color: 'white', fontSize: 15, opacity: 0.9 },

  // corner accents on scan frame
  corner: {
    position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE,
    borderColor: '#C850C0',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },

  // shared buttons
  button: { padding: 16, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center', width: '100%' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  outlineButton: {
    padding: 16, borderRadius: 30, alignItems: 'center',
    borderWidth: 1, borderColor: '#ffffff30', width: '100%',
  },
  outlineButtonText: { color: 'white', fontSize: 15 },
  cancelButton: { padding: 12, alignItems: 'center' },
  cancelText: { color: '#888', fontSize: 14 },
});
