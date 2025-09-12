import { StyleSheet } from "react-native";
import { borders, colors, shadows, spacing, typography } from "../tokens";

export const welcomeModalStyles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 350,
  },
  modal: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius["3xl"],
    padding: spacing[8],
    alignItems: "center",
    ...shadows.xl,
  },
  iconContainer: {
    width: 110, // Aumentado para acomodar logo de 85px
    height: 110, // Aumentado para acomodar logo de 85px
    borderRadius: borders.radius.full,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing[6],
    borderWidth: borders.width[2],
    borderColor: colors.primary[500],
    // Removido overflow: "hidden" para evitar recortes
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing[3],
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.background.toggleUnpressed,
    textAlign: "center",
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[4],
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: "center",
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    marginBottom: spacing[8],
    paddingHorizontal: spacing[2],
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: borders.specific.button,
    width: "100%",
    ...shadows.specific.button,
  },
  continueButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginRight: spacing[2],
  },
});
