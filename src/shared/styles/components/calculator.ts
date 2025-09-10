import { StyleSheet } from "react-native";
import { borders, colors, shadows, spacing, typography } from "../tokens";

export const calculatorStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.light,
    borderRadius: borders.radius["3xl"],
    padding: spacing[5],
    marginBottom: spacing[10], // Se modifica si se quiere ver la nota o no
  },
  calculatorContainer: {
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  displayContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius.none,
    paddingVertical: spacing[0],
    paddingHorizontal: spacing[3],
    marginBottom: spacing[2],
    marginTop: -spacing[5], // Mueve el display hacia arriba para alinearse con el input
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    borderWidth: borders.width[2],
    borderColor: colors.border.medium,
  },
  displayText: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
    textAlign: "right",
    marginRight: spacing[3],
  },
  backspaceButton: {
    padding: spacing[1],
  },
  keypad: {
    gap: spacing[2],
  },
  row: {
    flexDirection: "row",
    gap: spacing[3],
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: borders.width[1],
    borderColor: colors.border.medium,
    ...shadows.sm,
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  operationButton: {
    backgroundColor: colors.primary[500],
  },
  operationText: {
    color: colors.neutral.white,
    fontSize: typography.fontSize.xl,
  },
  equalsButton: {
    backgroundColor: colors.text.primary,
  },
  equalsText: {
    color: colors.neutral.white,
    fontSize: typography.fontSize.xl,
  },
});
