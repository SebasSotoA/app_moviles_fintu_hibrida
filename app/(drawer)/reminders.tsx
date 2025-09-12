import { remindersStyles } from "@/src/shared/styles/components/reminders";
import { colors } from "@/src/shared/styles/tokens";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

// Importar SVGs
import ArrowBackIcon from "../../assets/icons/arrow-back.svg";

export default function Recordatorios() {
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(drawer)/");
    }
  };

  return (
    <View style={remindersStyles.container}>
      {/* Área superior con color del header */}
      <View style={[remindersStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={remindersStyles.header}>
        <TouchableOpacity onPress={goBack} style={remindersStyles.backButton}>
          <ArrowBackIcon
            width={28}
            height={28}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={remindersStyles.headerCenter}>
          <Text style={remindersStyles.headerTitle}>Recordatorios</Text>
        </View>
        <View style={remindersStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={remindersStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <View style={remindersStyles.content}>
          <Text style={remindersStyles.title}>Recordatorios</Text>
          <Text style={remindersStyles.subtitle}>Próximamente...</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
