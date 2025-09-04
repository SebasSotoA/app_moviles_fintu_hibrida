import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    headerButton: {
      padding: 5,
    },
    totalSection: {
      alignItems: 'center',
      paddingVertical: 30,
      backgroundColor: colors.white,
    },
    totalSubtitle: {
      fontSize: 14,
      color: colors.grayMedium,
      marginTop: 8,
      fontStyle: 'italic',
    },
    filtersSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.notCompletelyLightGray, // no exact token; close to notCompletelyLightGray
    },
    filterGroup: {
      flex: 1,
      marginHorizontal: 5,
    },
    filterButton: {
      backgroundColor: lighten(0.10, colors.notCompletelyLightGray),
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    filterButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.almostBlack,
      flex: 1,
      textAlign: 'center',
    },
    transactionsList: {
      paddingBottom: 100,
    },
    dateGroup: {
      marginBottom: 20,
    },
    dateHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.grayMedium,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.notCompletelyLightGray, // no exact token; subtle light gray
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.notCompletelyLightGray, // no exact token
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.almostBlack,
      marginBottom: 4,
    },
    accountInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    accountSymbol: {
      fontSize: 16,
      fontWeight: '600',
    },
    transactionAccount: {
      fontSize: 14,
      color: colors.grayMedium,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    expenseAmount: {
      color: '#FF6B6B',
    },
    incomeAmount: {
      color: '#4ECDC4',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      marginTop: 15,
      fontSize: 16,
      color: colors.grayMedium,
      textAlign: 'center',
      paddingHorizontal: 30,
    },
    resetFilterButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginTop: 15,
    },
    resetFilterButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FFD700',
      justifyContent: 'center',
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
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: 20,
      margin: 20,
      maxHeight: '80%',
      width: '90%',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },
    modalBody: {
      padding: 20,
    },
    modeSelector: {
      flexDirection: 'row',
      backgroundColor: '#F8F9FA', // no exact token
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
    },
    modeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      gap: 8,
    },
    activeModeButton: {
      backgroundColor: colors.primary,
    },
    modeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.grayMedium,
    },
    activeModeButtonText: {
      color: colors.white,
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.notCompletelyLightGray
    },
    selectedFilterOption: {
      backgroundColor: darken(0.15, colors.notCompletelyLightGray), // no exact token
      borderWidth: 1,
      borderColor: colors.primary,
    },
    filterOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    filterOptionText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.almostBlack,
    },
    selectedFilterOptionText: {
      color: colors.primary,
      fontWeight: '600',
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: darken(0.15, colors.notCompletelyLightGray), // no exact token
      padding: 16,
      borderRadius: 12,
      gap: 12,
    },
    infoText: {
      fontSize: 14,
      color: colors.primary,
      flex: 1,
      lineHeight: 20,
    },
  }) 
};

export default styles;