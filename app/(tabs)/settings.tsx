// Settings Screen — app and account settings

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const Section = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const ToggleRow = ({
    label,
    sub,
    value,
    onToggle,
  }: {
    label: string;
    sub?: string;
    value: boolean;
    onToggle: (v: boolean) => void;
  }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#ffffff20', true: '#8B2FC9' }}
        thumbColor={value ? '#C850C0' : '#888'}
      />
    </View>
  );

  const LinkRow = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* notifications */}
        <Section title="Notifications" />
        <View style={styles.card}>
          <ToggleRow
            label="Push Notifications"
            sub="Get alerts on your device"
            value={notifications}
            onToggle={setNotifications}
          />
          <ToggleRow
            label="Low Stock Alerts"
            sub="Notify when items drop below threshold"
            value={lowStockAlerts}
            onToggle={setLowStockAlerts}
          />
        </View>

        {/* appearance */}
        <Section title="Appearance" />
        <View style={styles.card}>
          <ToggleRow
            label="Dark Mode"
            value={darkMode}
            onToggle={setDarkMode}
          />
        </View>

        {/* security */}
        <Section title="Security" />
        <View style={styles.card}>
          <ToggleRow
            label="Face ID / Biometrics"
            sub="Use biometrics to unlock app"
            value={biometrics}
            onToggle={setBiometrics}
          />
          <LinkRow
            label="Change Password"
            onPress={() => router.push('/forgotpassword')}
          />
        </View>

        {/* workspace */}
        <Section title="Workspace" />
        <View style={styles.card}>
          <LinkRow label="Manage Members" onPress={() => {}} />
          <LinkRow label="Invite Code" onPress={() => {}} />
          <LinkRow label="Workspace Settings" onPress={() => {}} />
        </View>

        {/* about */}
        <Section title="About" />
        <View style={styles.card}>
          <LinkRow label="Privacy Policy" onPress={() => {}} />
          <LinkRow label="Terms of Service" onPress={() => {}} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowSub}>1.0.0</Text>
          </View>
        </View>

        {/* danger zone */}
        <View style={styles.dangerCard}>
          <TouchableOpacity style={styles.dangerRow} onPress={() => router.replace('/login')}>
            <Text style={styles.dangerText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerRow}>
            <Text style={[styles.dangerText, { color: '#f87171' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff20',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
  },
  rowLeft: {
    flex: 1,
    paddingRight: 12,
  },
  rowLabel: {
    color: 'white',
    fontSize: 15,
  },
  rowSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: '#666',
    fontSize: 20,
  },
  dangerCard: {
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff20',
    overflow: 'hidden',
    marginTop: 24,
  },
  dangerRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff10',
    alignItems: 'center',
  },
  dangerText: {
    color: '#aaa',
    fontSize: 15,
  },
});
