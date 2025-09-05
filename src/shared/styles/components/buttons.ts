/**
 * Componentes de estilo para botones
 * Basados en los patrones existentes del proyecto
 */

import { StyleSheet } from 'react-native';
import { borders, colors, shadows, spacing, typography } from '../tokens';

export const buttonStyles = StyleSheet.create({
  // Botón principal - basado en createButton, confirmButton
  primary: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.component.buttonPadding,
    paddingHorizontal: spacing[4],
    borderRadius: borders.specific.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.specific.button,
  },

  // Botón secundario - basado en cancelButton
  secondary: {
    backgroundColor: colors.neutral.gray[100],
    paddingVertical: spacing.component.buttonPadding,
    paddingHorizontal: spacing[4],
    borderRadius: borders.specific.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  // Botón outline - basado en editButton
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.component.buttonPadding,
    paddingHorizontal: spacing[4],
    borderRadius: borders.specific.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: borders.width[2],
    borderColor: colors.primary[500],
  },

  // Botón ghost - sin fondo
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.component.buttonPadding,
    paddingHorizontal: spacing[4],
    borderRadius: borders.specific.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Botón deshabilitado
  disabled: {
    backgroundColor: colors.neutral.gray[400],
    paddingVertical: spacing.component.buttonPadding,
    paddingHorizontal: spacing[4],
    borderRadius: borders.specific.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Tamaños de botón
  small: {
    paddingVertical: spacing.component.buttonPaddingSmall,
    paddingHorizontal: spacing[3],
    borderRadius: borders.specific.buttonSmall,
  },

  large: {
    paddingVertical: spacing.component.buttonPaddingLarge,
    paddingHorizontal: spacing[6],
    borderRadius: borders.specific.buttonLarge,
  },

  // Botón de acción flotante - basado en newButton
  floating: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borders.specific.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.specific.floating,
  },

  // Botón de toggle - basado en toggleButton
  toggle: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    borderRadius: borders.specific.button,
  },

  // Botón de toggle activo - basado en activeToggleButton
  toggleActive: {
    backgroundColor: colors.primary[500],
  },

  // Botón de navegación - basado en backButton, menuButton
  nav: {
    padding: spacing[1],
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borders.radius.full,
  },

  // Botón de cierre - basado en closeButton
  close: {
    padding: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Estilos de texto para botones
export const buttonTextStyles = StyleSheet.create({
  primary: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  secondary: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },

  outline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
  },

  ghost: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[500],
  },

  disabled: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  small: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  large: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },

  toggle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.tertiary,
  },

  toggleActive: {
    color: colors.neutral.white,
  },
});

export default buttonStyles;
