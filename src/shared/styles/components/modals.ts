/**
 * Componentes de estilo para modales
 * Basados en los patrones existentes del proyecto
 */

import { StyleSheet } from 'react-native';
import { borders, colors, shadows, spacing, typography } from '../tokens';

export const modalStyles = StyleSheet.create({
  // Overlay base - basado en modalOverlay, datePickerOverlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal base - basado en confirmModal, accountSelectorModal
  base: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    padding: spacing.component.modalPadding,
    width: '85%',
    maxHeight: '70%',
    ...shadows.specific.modal,
  },

  // Modal pequeño
  small: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modalSmall,
    padding: spacing.component.modalPadding,
    width: '80%',
    maxHeight: '60%',
    ...shadows.specific.modal,
  },

  // Modal grande
  large: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    padding: spacing.component.modalPadding,
    width: '95%',
    maxHeight: '80%',
    ...shadows.specific.modal,
  },

  // Modal de confirmación - basado en confirmModal
  confirmation: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    padding: spacing.component.modalPadding,
    width: '85%',
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    ...shadows.specific.modal,
  },

  // Modal de selector de cuenta - basado en accountSelectorModal
  accountSelector: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    margin: spacing.component.modalMargin,
    maxHeight: '70%',
    width: '90%',
    ...shadows.specific.modal,
  },

  // Modal de selector de período - basado en periodSelectorModal
  periodSelector: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    margin: spacing.component.modalMargin,
    width: '95%',
    maxHeight: '80%',
    ...shadows.specific.modal,
  },

  // Modal de selector de fecha - basado en datePickerModal
  datePicker: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    padding: spacing.component.modalPadding,
    margin: spacing.component.modalMargin,
    width: '80%',
    ...shadows.specific.modal,
  },

  // Header del modal - basado en modalHeader
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.component.modalPadding,
    borderBottomWidth: borders.width[1],
    borderBottomColor: colors.border.light,
  },

  // Título del modal - basado en modalTitle
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },

  // Contenido del modal
  content: {
    padding: spacing.component.modalPadding,
  },

  // Acciones del modal - basado en confirmActions, periodSelectorActions
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
    marginTop: spacing[4],
    width: '100%',
  },

  // Botón de acción del modal
  actionButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: borders.specific.input,
    alignItems: 'center',
  },

  // Botón de cancelar - basado en cancelButton
  cancelButton: {
    backgroundColor: colors.neutral.gray[100],
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  // Botón de confirmar - basado en confirmButton
  confirmButton: {
    backgroundColor: colors.primary[500],
  },

  // Lista del modal - basado en accountsList
  list: {
    maxHeight: 300,
  },

  // Texto de confirmación - basado en confirmText
  confirmationText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
});

export default modalStyles;
