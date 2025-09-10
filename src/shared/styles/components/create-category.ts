import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";
import { headerStyles } from "./headers";

export const createCategoryStyles = StyleSheet.create({
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
  content: {
    flex: 1,
    padding: spacing[4],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.fontSize.base,
    backgroundColor: colors.neutral.white,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.background.lighter,
  },
  activeToggleButton: {
    backgroundColor: colors.primary[500],
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  activeToggleText: {
    color: colors.neutral.white,
  },
  iconList: {
    flexDirection: "row",
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[2],
  },
  selectedIconButton: {
    backgroundColor: colors.primary[500],
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[1],
  },
  createButton: {
    flex: 1,
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderRadius: 25,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.text.tertiary,
  },
  createButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.semantic.error,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderRadius: 25,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
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
