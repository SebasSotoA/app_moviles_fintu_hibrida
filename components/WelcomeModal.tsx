import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../src/shared/styles/tokens';
import FintuLogo from './FintuLogo';

const { width } = Dimensions.get('window');

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

// Mapa de íconos locales con nombres exactos de Ionicons
const ICONS: Record<string, any> = {
  'wallet-outline': require('../assets/icons/wallet-outline.svg'),
  'arrow-forward': require('../assets/icons/arrow-forward.svg'),
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
      <BlurView intensity={20} style={styles.blurContainer}>
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          {/* Modal Content */}
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.modal}>
                {/* Logo de Fintu */}
                <View style={styles.iconContainer}>
                  <FintuLogo size={115} />
                </View>

                {/* Título principal */}
                <Text style={styles.title}>¡Bienvenido a Fintu!</Text>
                
                {/* Subtítulo */}
                <Text style={styles.subtitle}>
                  Tomemos el control de tu vida financiera
                </Text>

                {/* Descripción adicional */}
                <Text style={styles.description}>
                  Gestiona tus gastos e ingresos de manera simple y efectiva
                </Text>

                {/* Botón de continuar */}
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.continueButtonText}>Comenzar</Text>
                  <Image
                    source={ICONS['arrow-forward']}
                    style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
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

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
  },
  modal: {
    backgroundColor: colors.neutral.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary[500],
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.background.toggleUnpressed,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '100%',
    shadowColor: colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    marginRight: 8,
  },
})
;

