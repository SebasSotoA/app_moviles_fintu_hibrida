import 'react-native-reanimated';
import { Stack } from "expo-router";
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '../src/shared/context/AppProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </GestureHandlerRootView>
    </AppProvider>
  );
}
