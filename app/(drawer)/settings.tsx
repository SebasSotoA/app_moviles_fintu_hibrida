import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { settingsStyles } from "../../src/shared/styles/components/settings";
import { colors } from "../../src/shared/styles/tokens";

// Mapa de íconos locales
const ICONS: Record<string, any> = {
  "arrow-back": require("../../assets/icons/arrow-back.svg"),
  menu: require("../../assets/icons/menu.svg"),
};

export default function Settings() {
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(drawer)/");
    }
  };

  return (
    <View style={settingsStyles.container}>
      {/* Área superior con color del header */}
      <View style={[settingsStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={settingsStyles.header}>
        <TouchableOpacity onPress={goBack} style={settingsStyles.backButton}>
          <Image
            source={ICONS["arrow-back"]}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={settingsStyles.headerCenter}>
          <Text style={settingsStyles.headerTitle}>Ajustes</Text>
        </View>
        <View style={settingsStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={settingsStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <View style={settingsStyles.content}>
          <Text style={settingsStyles.title}>Ajustes</Text>
          <Text style={settingsStyles.subtitle}>Próximamente...</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
