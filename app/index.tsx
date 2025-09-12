import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { layoutStyles } from "../src/shared/styles/components";
import { colors } from "../src/shared/styles/tokens";

export default function Index() {
  useEffect(() => {
    // Siempre ir al Home, el popup de bienvenida se maneja desde allí
    const timer = setTimeout(() => {
      router.replace("/(drawer)/" as any);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading mientras se verifica el estado
  return (
    <View
      style={[
        layoutStyles.fullHeight,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary[500],
        },
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}
