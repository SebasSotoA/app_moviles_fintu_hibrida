import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../tokens";

export const singleDateCalendarStyles = StyleSheet.create({
  calendarContainer: {
    marginBottom: spacing[4],
  },
  calendarHeader: {
    alignItems: "center",
    marginBottom: spacing[2],
  },
  calendarMonthYear: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  calendarDaysHeader: {
    flexDirection: "row",
    marginBottom: spacing[2],
  },
  calendarDayHeader: {
    flexBasis: "14.285714%",
    textAlign: "center",
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    paddingVertical: spacing[2],
  } as any,
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    flexBasis: "14.285714%",
    flexGrow: 0,
    flexShrink: 0,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: spacing[1],
  },
  calendarDayCurrentMonth: {
    backgroundColor: colors.neutral.white,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary[500],
  },
  calendarDayText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  } as any,
  calendarDayTextCurrentMonth: {
    color: colors.text.primary,
  } as any,
  calendarDayTextSelected: {
    color: colors.neutral.white,
  } as any,
  calendarScrollView: {
    maxHeight: 400,
  },
});
