// BottomTabBar — persistent nav bar for main app screens
// Usage: import and render at the bottom of Workspaces, Scanner, Inventory, Profile screens

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
  { label: 'Workspaces', icon: '🏭', route: '/workspaces' },
  { label: 'Inventory', icon: '📦', route: '/inventorylist' },
  { label: 'Scan', icon: '⬛', route: '/scanner', isScan: true },
  { label: 'Profile', icon: '👤', route: '/profile' },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* blurred glass bar */}
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.route;

          if (tab.isScan) {
            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.scanWrap}
                onPress={() => router.push(tab.route as any)}
              >
                <LinearGradient
                  colors={['#C850C0', '#8B2FC9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scanButton}
                >
                  <Text style={styles.scanIcon}>⬛</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              onPress={() => router.push(tab.route as any)}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#1a003599',
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
    paddingBottom: 28,
    paddingTop: 10,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: '#ffffff60',
    fontSize: 10,
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#C850C0',
    fontWeight: '600',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C850C0',
    marginTop: 3,
  },
  scanWrap: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    fontSize: 22,
  },
});
