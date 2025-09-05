/**
 * Componentes de estilo para formularios
 * Basados en los patrones existentes del proyecto
 */

import { StyleSheet } from 'react-native';
import { borders, colors, spacing, typography } from '../tokens';

export const formStyles = StyleSheet.create({
  // Input base - basado en noteInput
  input: {
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    borderRadius: borders.specific.input,
    padding: spacing.component.inputPadding,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    backgroundColor: colors.neutral.gray[100],
  },

  // Input pequeño
  inputSmall: {
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    borderRadius: borders.specific.inputSmall,
    padding: spacing.component.inputPaddingSmall,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    backgroundColor: colors.neutral.gray[100],
  },

  // Input con foco
  inputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.neutral.white,
  },

  // Input con error
  inputError: {
    borderColor: colors.semantic.error,
    backgroundColor: colors.neutral.white,
  },

  // Input deshabilitado
  inputDisabled: {
    borderColor: colors.border.light,
    backgroundColor: colors.neutral.gray[100],
    color: colors.text.disabled,
  },

  // Input de texto multilínea - basado en noteInput
  textArea: {
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    borderRadius: borders.specific.input,
    padding: spacing.component.inputPadding,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    backgroundColor: colors.neutral.gray[100],
    textAlignVertical: 'top',
    minHeight: 80,
  },

  // Selector de fecha - basado en dateSelector
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.component.inputPadding,
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.input,
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  // Selector de cuenta - basado en accountSelector
  accountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.component.inputPadding,
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.input,
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  // Toggle switch - basado en toggleContainer
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.button,
    padding: spacing[1],
  },

  // Toggle button - basado en toggleButton
  toggleButton: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    borderRadius: borders.specific.button,
  },

  // Toggle button activo - basado en activeToggleButton
  toggleButtonActive: {
    backgroundColor: colors.primary[500],
  },

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
    marginTop: spacing[1],
  },

  // Texto de error
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.semantic.error,
    marginTop: spacing[1],
  },

  // Contenedor de formulario
  formContainer: {
    padding: spacing.component.cardPadding,
  },

  // Grupo de campos
  fieldGroup: {
    marginBottom: spacing[4],
  },

  // Botones de acción del formulario
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3],
    marginTop: spacing[4],
  },
});

export default formStyles;
