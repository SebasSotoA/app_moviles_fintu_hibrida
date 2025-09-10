import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AppProvider } from "../src/shared/context/AppProvider";
import { layoutStyles } from "../src/shared/styles/components";

export default function RootLayout() {
  return (
    <AppProvider>
      <GestureHandlerRootView style={layoutStyles.fullHeight}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </GestureHandlerRootView>
    </AppProvider>
  );
}
