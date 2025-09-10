/**
 * Estilos específicos para el componente de cuentas
 * Migrado del sistema anterior al nuevo sistema de tokens
 */

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const accountsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  statusBarArea: {
    backgroundColor: colors.background.dark,
  },
  header: headerStyles.standard,
  menuButton: headerStyles.menuButton,
  headerCenter: headerStyles.center,
  headerTitle: headerStyles.title,
  placeholder: headerStyles.placeholder,
  contentContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    padding: spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral.white,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
  },
  totalSection: {
    backgroundColor: colors.primary[50],
    padding: spacing[4],
    borderRadius: 12,
    marginBottom: spacing[4],
    alignItems: "center",
  },
  totalLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    marginBottom: spacing[1],
  },
  totalAmount: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  totalSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[500],
    marginTop: spacing[1],
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 12,
    gap: spacing[2],
  },
  transferButton: {
    backgroundColor: colors.primary[500],
  },
  addButton: {
    backgroundColor: colors.background.toggleUnpressed,
  },
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  newButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  accountsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  accountsList: {
    gap: spacing[3],
  },
  accountCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  activeAccountCard: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountSymbol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[3],
  },
  symbolText: {
    fontSize: typography.fontSize.lg,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  accountCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  accountActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  editButton: {
    padding: spacing[2],
  },
  deleteButton: {
    padding: spacing[2],
  },
  accountBalance: {
    alignItems: "flex-end",
  },
  balanceAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  balanceCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[2],
    gap: spacing[2],
  },
  activeText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },
  excludedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[2],
    gap: spacing[2],
  },
  excludedText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[8],
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: "center",
  },
  createFirstAccountButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    marginTop: spacing[4],
  },
  createFirstAccountText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  // Modal de confirmación de eliminación
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModal: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: spacing[6],
    margin: spacing[4],
    maxWidth: 400,
    width: "90%",
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  confirmText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  confirmInstruction: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[4],
  },
  confirmInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.fontSize.base,
    backgroundColor: colors.neutral.white,
    marginBottom: spacing[4],
  },
  confirmActions: {
    flexDirection: "row",
    gap: spacing[3],
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  deleteConfirmButton: {
    backgroundColor: colors.semantic.error,
  },
  disabledDeleteButton: {
    backgroundColor: colors.text.tertiary,
  },
  deleteConfirmButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral.white,
  },
});
