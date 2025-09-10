import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const chartsStyles = StyleSheet.create({
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
    padding: spacing.layout.screenPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
});
