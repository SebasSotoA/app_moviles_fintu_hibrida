/**
 * Hook para manejar temas y colores
 * Proporciona acceso a los tokens de diseño con soporte para temas
 */

import { useColorScheme } from 'react-native';
import { colors, legacyColors } from '../styles/tokens';

export interface Theme {
  colors: typeof colors;
  isDark: boolean;
  isLight: boolean;
}

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isLight = colorScheme === 'light';

  return {
    colors,
    isDark,
    isLight,
  };
};

// Hook para colores legacy (compatibilidad)
export const useLegacyColors = () => {
  return legacyColors;
};

// Hook para colores semánticos
export const useSemanticColors = () => {
  return colors.semantic;
};

// Hook para colores de estado
export const useStateColors = () => {
  return colors.state;
};

export default useTheme;
