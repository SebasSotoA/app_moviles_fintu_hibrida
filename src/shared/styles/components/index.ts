import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    accountSection: {
      alignItems: 'center',
      paddingVertical: 30,
    },
    balance: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.almostBlack,
    },
    toggleText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.grayMedium,
    },
    activeToggleText: {
      color: colors.white,
    },
    periodFilterContainer: {
      marginBottom: 20,
    },
    periodFilterGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
  
    periodButton: {
      flex: 1,
      paddingHorizontal: 3,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.notCompletelyLightGray,
      alignItems: 'center',
    },
    activePeriodButton: {
      backgroundColor: colors.primary,
    },
    periodText: {
      fontSize: 14,
      color: colors.grayMedium,
      fontWeight: '500',
    },
    activePeriodText: {
      color: colors.white,
    },
    chartSection: {
      marginBottom: 30,
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    dateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    dateNavButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.notCompletelyLightGray,
    },
    todayButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.notCompletelyLightGray,
      marginLeft: 10,
    },
    currentDate: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.almostBlack,
      textAlign: 'center',
      flex: 1,
    },
    pieChartContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    chartWrapper: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    svgChart: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    centerValue: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 35,
      width: 70,
      height: 70,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    centerAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.grayDark,
      textAlign: 'center',
    },
    centerCurrency: {
      fontSize: 10,
      color: colors.grayMedium,
      marginTop: 1,
    },
    emptyChart: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyChartText: {
      marginTop: 10,
      fontSize: 14,
      color: colors.gray,
      textAlign: 'center',
    },
    loadingChart: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    loadingCategories: {
      paddingVertical: 30,
      alignItems: 'center',
      gap: 10,
    },
    emptyCategories: {
      paddingVertical: 30,
      alignItems: 'center',
      gap: 10,
    },
    emptyCategoriesText: {
      fontSize: 14,
      color: colors.gray,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    swipeHint: {
      fontSize: 12,
      color: colors.grayMedium,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    categoriesSection: {
      marginBottom: 100,
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    categoriesTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.almostBlack,
      marginBottom: 15,
    },
    categoriesGrid: {
      flexDirection: 'column',
    },
    categoryCard: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryAmount: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
    categoryPercentage: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.grayDark,
      marginLeft: 12,
    },
    
    
    newButtonContainer: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      zIndex: 1000,
    },
    newButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 25,
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    newButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
    // Account Selector Styles
    accountHeader: {
      marginBottom: 8,
    },
    accountLabel: {
      fontSize: 12,
      color: colors.grayMedium,
      marginBottom: 4,
    },
    accountNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    newAccountButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      margin: 20,
      paddingVertical: 14,
      borderRadius: 12,
    },
    newAccountButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
      marginLeft: 8,
    },
    // Period Selector Modal Styles
    periodSelectorModal: {
      backgroundColor: colors.white,
      borderRadius: 20,
      margin: 20,
      width: '95%',
      maxHeight: '80%',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    fixedIncludeAllSection: {
      paddingHorizontal: 20,
      paddingTop: 0,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.notCompletelyLightGray,
      backgroundColor: colors.notCompletelyLightGray,
    },
    periodSelectorContent: {
      padding: 20,
    },
    // Calendar Styles
    calendarScrollView: {
      maxHeight: 400,
    },
    calendarScrollContent: {
      paddingBottom: 20,
    },
    calendarContainer: {
      alignItems: 'center',
    },
    calendarHeader: {
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    includeAllRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 6,
      borderRadius: 10,
      backgroundColor: colors.notCompletelyLightGray,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      marginBottom: 12,
    },
    includeAllText: {
      fontSize: 14,
      color: colors.grayDark,
      fontWeight: '500',
    },
    calendarNavButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.notCompletelyLightGray,
    },
    calendarMonthYear: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.grayDark,
      textTransform: 'capitalize',
      marginBottom: 8,
    },
    calendarScrollHint: {
      fontSize: 12,
      color: colors.grayMedium,
      fontStyle: 'italic',
    },
    calendarDaysHeader: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 10,
    },
    calendarDayHeader: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '600',
      color: colors.grayMedium,
      paddingVertical: 8,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
    },
    calendarDay: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    calendarDayCurrentMonth: {
      backgroundColor: colors.white,
    },
    calendarDaySelected: {
      backgroundColor: colors.tertiary,
    },
    calendarDayInRange: {
      backgroundColor: colors.tertiary,
    },
    calendarDayStart: {
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    calendarDayEnd: {
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    calendarDayText: {
      fontSize: 14,
      color: colors.gray,
    },
    calendarDayTextCurrentMonth: {
      color: colors.grayDark,
    },
    calendarDayTextSelected: {
      color: colors.white,
      fontWeight: '600',
    },
    dateRangeInfo: {
      marginTop: 20,
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      width: '100%',
    },
    dateRangeLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.grayMedium,
      marginBottom: 4,
    },
    dateRangeText: {
      fontSize: 16,
      color: colors.grayDark,
      textAlign: 'center',
    },
    allPeriodsInfo: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    allPeriodsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.grayDark,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    allPeriodsDescription: {
      fontSize: 14,
      color: colors.grayMedium,
      textAlign: 'center',
      lineHeight: 20,
    },
    calendarLoadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    calendarLoadingText: {
      fontSize: 16,
      color: colors.grayMedium,
      marginTop: 16,
      textAlign: 'center',
    },
    clearDatesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.notCompletelyLightGray,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    clearDatesText: {
      fontSize: 12,
      color: colors.grayMedium,
      marginLeft: 6,
    },
    calendarInfo: {
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 16,
      backgroundColor: colors.notCompletelyLightGray,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    calendarInfoText: {
      fontSize: 12,
      color: colors.grayMedium,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    periodSelectorActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 20,
      width: '100%',
    },
    periodSelectorButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.notCompletelyLightGray,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
  }) 
  };

export default styles;