import { Platform, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const categoryHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  statusBarArea: {
    backgroundColor: colors.background.dark,
  },
  header: headerStyles.standard,
  backButton: headerStyles.actionButton,
  headerCenter: headerStyles.center,
  headerTitle: headerStyles.title,
  placeholder: headerStyles.placeholder,
  contentContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  totalSection: {
    backgroundColor: colors.primary[500],
    padding: spacing[6],
    alignItems: "center",
  },
  totalAmount: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  totalSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    marginTop: spacing[1],
  },
  filtersSection: {
    flexDirection: "row",
    padding: spacing[4],
    gap: spacing[3],
  },
  filterGroup: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: colors.neutral.gray[100],
    borderRadius: 12,
    padding: spacing[3],
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
    marginHorizontal: spacing[2],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing[12],
  },
  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  transactionsList: {
    padding: spacing[4],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[8],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing[4],
  },
  resetFilterButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 25,
    marginTop: spacing[4],
  },
  resetFilterButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },
  fab: {
    position: "absolute",
    bottom: spacing[6],
    right: spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    margin: spacing[4],
    maxHeight: "80%",
    minWidth: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing[1],
  },
  modalBody: {
    padding: spacing[4],
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[2],
  },
  selectedFilterOption: {
    backgroundColor: colors.primary[50],
  },
  filterOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  filterOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginLeft: spacing[3],
  },
  selectedFilterOptionText: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
  },
  accountSymbol: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: colors.neutral.gray[100],
    borderRadius: 12,
    padding: spacing[1],
    marginBottom: spacing[4],
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[3],
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: colors.primary[500],
  },
  modeButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing[2],
  },
  activeModeButtonText: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    padding: spacing[4],
    borderRadius: 8,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing[3],
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[3],
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionAccount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing[2],
  },
  transactionAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  expenseAmount: {
    color: colors.semantic.error,
  },
  incomeAmount: {
    color: colors.semantic.success,
  },
  dateGroup: {
    marginBottom: spacing[6],
  },
  dateHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.tertiary,
    marginBottom: spacing[3],
    paddingHorizontal: spacing[2],
  },
  // Estilos para modal de detalles de transacción
  transactionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionModalContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    margin: spacing[4],
    maxWidth: "90%",
    minWidth: 300,
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  transactionModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  transactionModalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  transactionModalCloseButton: {
    padding: spacing[1],
  },
  transactionModalContent: {
    padding: spacing[4],
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  detailLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
    textAlign: "right",
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  detailAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  detailAmountExpense: {
    color: colors.semantic.error,
  },
  detailAmountIncome: {
    color: colors.semantic.success,
  },
  modalActions: {
    flexDirection: "row",
    padding: spacing[4],
    gap: spacing[3],
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.neutral.gray[100],
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  deleteButton: {
    backgroundColor: colors.semantic.error,
  },
  deleteButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
});
