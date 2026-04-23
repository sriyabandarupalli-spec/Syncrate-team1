// Scanner Screen — scans a QR code then looks up the item in Supabase

import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [looking, setLooking] = useState(false); // true while we're querying Supabase
  const [errorMsg, setErrorMsg] = useState('');

  // useRef prevents the scan handler from firing multiple times
  // the camera fires onBarcodeScanned many times per second when it sees a code
  // without this lock you'd make dozens of Supabase requests in one second
  const isProcessing = useRef(false);

  const handleBarcodeScan = async ({ data }: { data: string }) => {
    // if we're already processing a scan, ignore this duplicate fire
    if (isProcessing.current) return;
    isProcessing.current = true;
    setScanned(true);
    setLooking(true);
    setErrorMsg('');

    // look up the scanned SKU in the items table
    // .single() returns one item or an error — never an array
    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('sku', data.toUpperCase())
      .single();

    setLooking(false);

    if (error || !item) {
      // item not found — show error and let them scan again
      setErrorMsg(`No item found for SKU: ${data}`);
      isProcessing.current = false;
      setScanned(false);
      return;
    }

    // item found — navigate to scan result and pass the item ID
    // we pass the ID and let scanresult.tsx fetch the full details
    // this way scanresult always shows the freshest data from the DB
    router.push({ pathname: '/scanresult', params: { itemId: item.id } });

    // reset after a short delay so the scanner is ready if they come back
    setTimeout(() => {
      isProcessing.current = false;
      setScanned(false);
    }, 1000);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setErrorMsg('');
    isProcessing.current = false;
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
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

  return (
    <View style={styles.container}>
      {/* show camera only when not currently processing a scan */}
      {!scanned && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScan}
        />
      )}

      {/* overlay UI on top of camera — scan frame + label */}
      {!scanned && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.scanFrame} />
          <Text style={styles.scanHint}>Point at a QR code to scan</Text>
        </View>
      )}

      {/* loading state while Supabase query runs */}
      {looking && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C850C0" />
          <Text style={styles.loadingText}>Looking up item...</Text>
        </View>
      )}

      {/* error state — item not found in DB */}
      {errorMsg ? (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.errorTitle}>Item Not Found</Text>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <TouchableOpacity onPress={handleScanAgain}>
              <LinearGradient
                colors={['#C850C0', '#8B2FC9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Scan Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0010' },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0A0010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backText: { color: 'white', fontSize: 24 },
  scanFrame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: '#C850C0',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scanHint: {
    color: 'white',
    marginTop: 20,
    fontSize: 15,
    opacity: 0.8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0A0010',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: { color: 'white', fontSize: 16 },
  message: { color: 'white', textAlign: 'center', margin: 20, fontSize: 16 },
  resultContainer: {
    flex: 1,
    backgroundColor: '#0A0010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  errorTitle: { fontSize: 22, fontWeight: 'bold', color: '#0A0010' },
  errorMsg: { fontSize: 14, color: '#f87171', textAlign: 'center' },
  button: {
    padding: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
