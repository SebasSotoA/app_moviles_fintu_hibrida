/**
 * Estilos específicos para el componente EditAccountModal
 * Migrado del sistema anterior al nuevo sistema de tokens
 */

import { StyleSheet } from 'react-native';
import { borders, colors, shadows, spacing, typography } from '../tokens';

export const editAccountModalStyles = StyleSheet.create({
  // Modal overlay
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal container
  modalContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    margin: spacing.component.modalMargin,
    maxHeight: '80%',
    width: '90%',
    ...shadows.specific.modal,
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.component.modalPadding,
    borderBottomWidth: borders.width[1],
    borderBottomColor: colors.border.light,
  },

  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },

  closeButton: {
    padding: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  modalContent: {
    padding: spacing.component.modalPadding,
  },

  // Form fields
  fieldGroup: {
    marginBottom: spacing[4],
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },

  input: {
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    borderRadius: borders.specific.input,
    padding: spacing.component.inputPadding,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    backgroundColor: colors.neutral.gray[100],
  },

  inputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.neutral.white,
  },

  // Symbol selector
  symbolSelector: {
    marginTop: spacing[2],
  },

  symbolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[2],
  },

  symbolButton: {
    width: 50,
    height: 50,
    borderRadius: borders.radius.full,
    backgroundColor: colors.neutral.gray[100],
    borderWidth: borders.width[2],
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing[1],
  },

  selectedSymbolButton: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.primary[500],
  },

  symbolText: {
    fontSize: typography.fontSize.lg,
  },

  // Actions
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
    marginTop: spacing[4],
    width: '100%',
  },

  actionButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: borders.specific.input,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: colors.neutral.gray[100],
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  saveButton: {
    backgroundColor: colors.primary[500],
  },

  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },

  cancelButtonText: {
    color: colors.text.secondary,
  },

  saveButtonText: {
    color: colors.neutral.white,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[8],
  },

  loadingText: {
    marginTop: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});

export default editAccountModalStyles;
