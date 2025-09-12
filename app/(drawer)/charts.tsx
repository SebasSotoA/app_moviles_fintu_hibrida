import { chartsStyles } from "@/src/shared/styles/components/charts";
import { colors } from "@/src/shared/styles/tokens";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

// Importar SVGs
import ArrowBackIcon from "../../assets/icons/arrow-back.svg";

export default function Charts() {
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(drawer)/");
    }
  };

  return (
    <View style={chartsStyles.container}>
      {/* Área superior con color del header */}
      <View style={[chartsStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={chartsStyles.header}>
        <TouchableOpacity onPress={goBack} style={chartsStyles.backButton}>
          <ArrowBackIcon
            width={28}
            height={28}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={chartsStyles.headerCenter}>
          <Text style={chartsStyles.headerTitle}>Gráficos</Text>
        </View>
        <View style={chartsStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={chartsStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <View style={chartsStyles.content}>
          <Text style={chartsStyles.title}>Gráficos</Text>
          <Text style={chartsStyles.subtitle}>Próximamente...</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
