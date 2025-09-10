import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { iconStyles } from "../src/shared/styles/components";
import { welcomeModalStyles } from "../src/shared/styles/components/welcome-modal";
import { colors } from "../src/shared/styles/tokens";
import FintuLogo from "./FintuLogo";

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

// Mapa de íconos locales con nombres exactos de Ionicons
const ICONS: Record<string, any> = {
  "wallet-outline": require("../assets/icons/wallet-outline.svg"),
  "arrow-forward": require("../assets/icons/arrow-forward.svg"),
};

export default function WelcomeModal({ visible, onClose }: WelcomeModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Reset animaciones
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      slideAnim.setValue(50);
    }
  }, [visible, fadeAnim, scaleAnim, slideAnim]);

  const handleClose = () => {
    // Animación de salida
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* Fondo borroso */}
      <BlurView intensity={20} style={welcomeModalStyles.blurContainer}>
        <TouchableOpacity
          style={welcomeModalStyles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          {/* Modal Content */}
          <Animated.View
            style={[
              welcomeModalStyles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={welcomeModalStyles.modal}>
                {/* Logo de Fintu */}
                <View style={welcomeModalStyles.iconContainer}>
                  <FintuLogo size={115} />
                </View>

                {/* Título principal */}
                <Text style={welcomeModalStyles.title}>
                  ¡Bienvenido a Fintu!
                </Text>

                {/* Subtítulo */}
                <Text style={welcomeModalStyles.subtitle}>
                  Tomemos el control de tu vida financiera
                </Text>

                {/* Descripción adicional */}
                <Text style={welcomeModalStyles.description}>
                  Gestiona tus gastos e ingresos de manera simple y efectiva
                </Text>

                {/* Botón de continuar */}
                <TouchableOpacity
                  style={welcomeModalStyles.continueButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <Text style={welcomeModalStyles.continueButtonText}>
                    Comenzar
                  </Text>
                  <Image
                    source={ICONS["arrow-forward"]}
                    style={[
                      iconStyles.small,
                      { tintColor: colors.neutral.white },
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
}
