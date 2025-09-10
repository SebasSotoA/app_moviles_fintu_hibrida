/**
 * Estilos específicos para el componente de categorías
 * Migrado del sistema anterior al nuevo sistema de tokens
 */

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const categoriesStyles = StyleSheet.create({
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
  menuButton: headerStyles.menuButton,
  placeholder: headerStyles.placeholder,
  contentContainer: {
    flex: 1,
    paddingVertical: spacing[4],
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.component.cardPadding,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing[2],
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
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[0],
  },
  categoryType: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  chevronIcon: {
    marginLeft: spacing[2],
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
});
