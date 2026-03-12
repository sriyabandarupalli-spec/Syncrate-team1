// Imports
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// Memory for screen: creating a screen called ScannerScreen then asking for permission to scan, has somethign been scanned yet?, default to False
export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);


  // if permission has not been granted yet: load blank screen, show button to grant permission
   if (!permission) { // if permission hasn't loaded yet show a blank screen
    return <View />;
  }

  if (!permission.granted) { // if user hasn't given camera access yet show this message, creating a button when pressed gives access
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

  //open the camera pointing backwards, watch for QR code, stop scanning so it doesn't infinite loop, show what was scanned, show a scan again button
  return (
    <View style={styles.container}>
      {!scanned && ( // only show camera if nothing has been scanned yet
        <CameraView // renders the camera feed on screen
          style={styles.camera} // makes the camera fill the screen
          facing="back"
          onBarcodeScanned={({ data }) => { // waits & looks for a QR code then runs when it sees one
            setScanned(true);
            setScannedData(data);
          }}
        />
      )}
      {scanned && scannedData && ( // show only if scanned is true, white card appears after something has been scanned
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Item Scanned!</Text>
            <Text style={styles.resultData}>{scannedData}</Text>
            <TouchableOpacity onPress={() => { setScanned(false); setScannedData(null); }}> 
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0010',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0A0010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  message: {
    color: 'white',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
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
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A0010',
  },
  resultData: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});