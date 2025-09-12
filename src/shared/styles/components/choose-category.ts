import { StyleSheet } from "react-native";
import { colors, shadows, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const chooseCategoryStyles = StyleSheet.create({
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
  summaryContainer: {
    backgroundColor: colors.neutral.gray[100],
    margin: spacing.layout.screenPadding,
    padding: spacing.component.cardPadding,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.medium,
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semibold,
  },
  categoriesGrid: {
    gap: spacing[1],
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.component.cardPadding,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
    marginBottom: spacing[2],
  },
  selectedCategoryItem: {
    borderColor: colors.primary[500],
    backgroundColor: colors.secondary[50],
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[4],
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.layout.screenPadding,
    marginBottom: spacing.layout.screenPadding,
    paddingVertical: spacing.component.buttonPadding,
    borderRadius: 25,
    ...shadows.specific.button,
  },
  confirmButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginRight: spacing[2],
  },
  createCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.component.cardPadding,
    backgroundColor: colors.neutral.gray[100],
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  createCategoryText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.semibold,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing[12],
    gap: spacing[4],
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[300],
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  disabledButton: {
    backgroundColor: colors.neutral.gray[300],
  },
  disabledButtonText: {
    color: colors.neutral.gray[500],
  },
});
