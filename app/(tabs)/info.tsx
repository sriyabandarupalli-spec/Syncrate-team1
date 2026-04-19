import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function ScannerScreen() {
  const router = useRouter();
  const { scannedData } = route.params;

  return (
    <View>
      <Text>Product Info</Text>
      <Text>{scannedData}</Text>
    </View>
  );
}