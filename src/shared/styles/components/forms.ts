/**
 * Componentes de estilo para formularios
 * Basados en los patrones existentes del proyecto
 */

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";

export const formStyles = StyleSheet.create({
  // Label de formulario
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },

  // Texto de ayuda
  helperText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },

  // Grupo de campos
  fieldGroup: {
    marginBottom: spacing[0],
  },
});

// Estilos para íconos
export const iconStyles = StyleSheet.create({
  small: {
    width: 20,
    height: 20,
  },
  medium: {
    width: 28,
    height: 28,
  },
  large: {
    width: 40,
    height: 40,
  },
  primary: {
    width: 24,
    height: 24,
    tintColor: colors.primary[500],
  },
  white: {
    width: 24,
    height: 24,
    tintColor: colors.neutral.white,
  },
  tertiary: {
    width: 20,
    height: 20,
    tintColor: colors.text.tertiary,
  },
});

export default formStyles;
