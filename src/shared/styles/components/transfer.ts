import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const transferStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  statusBarArea: {
    backgroundColor: colors.background.dark,
  },
  header: headerStyles.standard,
  headerCenter: headerStyles.center,
  headerTitle: headerStyles.title,
  backButton: headerStyles.actionButton,
  placeholder: headerStyles.placeholder,
  contentContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
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
  summaryCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  transferFlow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[4],
  },
  accountSummary: {
    alignItems: "center",
    flex: 1,
  },
  accountSummarySymbol: {
    fontSize: typography.fontSize["3xl"],
    marginBottom: spacing[1],
  },
  accountSummaryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[0],
  },
  accountSummaryBalance: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: "center",
  },
  transferArrow: {
    marginHorizontal: spacing[2],
  },
  transferAmount: {
    alignItems: "center",
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  transferAmountLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },
  transferAmountValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  accountSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.component.inputPadding,
    backgroundColor: colors.neutral.gray[100],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  accountSelectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountSelectorSymbol: {
    fontSize: typography.fontSize["2xl"],
    marginRight: spacing[3],
  },
  accountSelectorInfo: {
    flex: 1,
  },
  accountSelectorName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[0],
  },
  accountSelectorBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.gray[100],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing[4],
  },
  amountInput: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    paddingVertical: spacing[4],
  },
  currencyLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    marginLeft: spacing[2],
  },
  balanceInfo: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginTop: spacing[1],
  },
  transferButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    paddingVertical: spacing.component.buttonPadding,
    borderRadius: 25,
    gap: spacing[2],
  },
  transferButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  disabledButton: {
    backgroundColor: colors.neutral.gray[300],
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  accountSelectorModal: {
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
  accountsList: {
    maxHeight: 400,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  selectedAccountItem: {
    backgroundColor: colors.secondary[50],
  },
  disabledAccountItem: {
    opacity: 0.5,
  },
  accountItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountItemSymbol: {
    fontSize: typography.fontSize["2xl"],
    marginRight: spacing[3],
  },
  accountItemInfo: {
    flex: 1,
  },
  accountItemName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[0],
  },
  accountItemBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  confirmModal: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing[6],
    margin: spacing[4],
    minWidth: 300,
  },
  confirmText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing[6],
    lineHeight: 24,
  },
  confirmActions: {
    flexDirection: "row",
    gap: spacing[3],
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.neutral.gray[100],
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  acceptButton: {
    backgroundColor: colors.primary[500],
  },
  acceptButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
});
