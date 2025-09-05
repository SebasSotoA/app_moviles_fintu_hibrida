/**
 * Estilos específicos para el componente Dashboard/Home
 * Separados del componente para mejor mantenibilidad y reutilización
 */

import { colors, spacing, typography } from '../tokens';

export const dashboardStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  statusBarArea: {
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background.header,
  },
  menuButton: {
    padding: 8,
    width: 70,      // same as placeholder
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center' as const,
  },
  placeholder: {
    width: 70,
  },
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.neutral.white,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
  },
  accountSection: {
    marginBottom: spacing[3],
    alignItems: 'center' as const,
  },
  accountLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    textAlign: 'center' as const,
  },
  accountSelector: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: colors.background.lighter,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    marginBottom: spacing[2],
    width: '80%',           // 👈 centrado relativo al padre
    maxWidth: 300,          // 👈 opcional, no crecer demasiado
  },
  accountSymbol: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing[2],
  },
  accountName: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  balance: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center' as const,
  },
  toggleContainer: {
    flexDirection: 'row' as const,
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing[4],
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center' as const,
    borderRadius: 8,
    backgroundColor: colors.background.lighter,
  },
  activeToggleButton: {
    backgroundColor: colors.background.togglePressed,
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  activeToggleText: {
    color: colors.neutral.white,
  },
  periodFilterContainer: {
    marginBottom: spacing[4],
    alignItems: 'center' as const,
  },
  periodFilterGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'nowrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: spacing[2],
    maxWidth: '90%',
    paddingHorizontal: spacing[4],
    alignSelf: 'center' as const,
  },
  periodButton: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderRadius: 8,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 60,
    flex: 0,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  activePeriodButton: {
    backgroundColor: colors.background.togglePressed,
    borderColor: colors.primary[500],
  },
  periodText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  activePeriodText: {
    color: colors.neutral.white,
  },
  chartSection: {
    marginBottom: spacing[6],
  },
  dateHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: spacing[4],
    gap: spacing[4],
  },
  dateNavButton: {
    padding: spacing[2],
  },
  currentDate: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  todayButton: {
    padding: spacing[2],
  },
  pieChartContainer: {
    alignItems: 'center' as const,
    marginBottom: spacing[4],
  },
  loadingChart: {
    alignItems: 'center' as const,
    paddingVertical: spacing[8],
  },
  chartWrapper: {
    position: 'relative' as const,
    alignItems: 'center' as const,
  },
  svgChart: {
    marginBottom: spacing[4],
  },
  centerValue: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAmount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  centerCurrency: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  emptyChart: {
    alignItems: 'center' as const,
    paddingVertical: spacing[8],
  },
  emptyChartText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: 'center' as const,
  },
  swipeHint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center' as const,
  },
  categoriesSection: {
    flex: 1,
  },
  categoriesTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  loadingCategories: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  categoriesGrid: {
    gap: spacing[3],
  },
  categoryCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.neutral.white,
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: spacing[3],
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  categoryAmount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  categoryPercentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  emptyCategories: {
    alignItems: 'center' as const,
    paddingVertical: spacing[8],
  },
  emptyCategoriesText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: 'center' as const,
  },
  newButtonContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    paddingTop: spacing[4],
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  newButton: {
    backgroundColor: colors.background.toggleUnpressed,
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  periodSelectorModal: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    margin: spacing[4],
    maxHeight: '80%',
    width: '90%',
    maxWidth: 400,
  },
  accountSelectorModal: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    margin: spacing[4],
    maxHeight: '80%',
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing[2],
  },
  fixedIncludeAllSection: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  includeAllRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: spacing[2],
  },
  includeAllText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  periodSelectorContent: {
    flex: 1,
  },
  calendarLoadingContainer: {
    alignItems: 'center' as const,
    paddingVertical: spacing[8],
  },
  calendarLoadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
  },
  calendarScrollView: {
    maxHeight: 400,
  },
  calendarScrollContent: {
    padding: spacing[4],
  },
  calendarInfo: {
    padding: spacing[2],
    backgroundColor: colors.background.light,
    borderRadius: 8,
    marginBottom: spacing[4],
  },
  calendarInfoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center' as const,
  },
  calendarContainer: {
    marginBottom: spacing[4],
  },
  calendarHeader: {
    alignItems: 'center' as const,
    marginBottom: spacing[2],
  },
  calendarMonthYear: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  calendarDaysHeader: {
    flexDirection: 'row' as const,
    marginBottom: spacing[2],
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    paddingVertical: spacing[2],
  },
  calendarGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 8,
    margin: 1,
  },
  calendarDayCurrentMonth: {
    backgroundColor: colors.neutral.white,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary[500],
  },
  calendarDayInRange: {
    backgroundColor: colors.primary[50],
  },
  calendarDayStart: {
    backgroundColor: colors.primary[500],
  },
  calendarDayEnd: {
    backgroundColor: colors.primary[500],
  },
  calendarDayText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  calendarDayTextCurrentMonth: {
    color: colors.text.primary,
  },
  calendarDayTextSelected: {
    color: colors.neutral.white,
  },
  dateRangeInfo: {
    padding: spacing[4],
    backgroundColor: colors.background.light,
    borderRadius: 8,
    marginTop: spacing[4],
  },
  dateRangeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  dateRangeText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  clearDatesButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing[2],
  },
  clearDatesText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  allPeriodsInfo: {
    alignItems: 'center' as const,
    padding: spacing[6],
  },
  allPeriodsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  allPeriodsDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center' as const,
  },
  periodSelectorActions: {
    flexDirection: 'row' as const,
    gap: spacing[3],
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  periodSelectorButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 12,
    alignItems: 'center' as const,
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
  confirmButton: {
    backgroundColor: colors.primary[500],
  },
  confirmButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral.white,
  },
  accountsList: {
    maxHeight: 300,
  },
  accountItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  selectedAccountItem: {
    backgroundColor: colors.primary[50],
  },
  accountItemLeft: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  accountItemSymbol: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing[3],
  },
  accountItemInfo: {
    flex: 1,
  },
  accountItemName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  accountItemBalance: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  newAccountButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[3],
    margin: spacing[4],
    borderRadius: 12,
    gap: spacing[2],
  },
  newAccountButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral.white,
  },
  fixedDateRangeSection: {
    backgroundColor: colors.background.light,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
} as const;