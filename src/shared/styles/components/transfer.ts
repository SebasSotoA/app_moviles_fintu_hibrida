import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    disabledAccountItem: {
      opacity: 0.5,
    },
    accountSummary: {
      flex: 1,
      alignItems: 'center',
    },
    summaryCard: {
      backgroundColor: colors.notCompletelyLightGray,
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    transferFlow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accountSummarySymbol: {
      fontSize: 32,
      marginBottom: 8,
    },
    accountSummaryName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.grayDark,
      textAlign: 'center',
      marginBottom: 4,
    },
    accountSummaryBalance: {
      fontSize: 12,
      color: colors.grayMedium,
      textAlign: 'center',
    },
    transferArrow: {
      marginHorizontal: 16,
    },
    transferAmount: {
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.notCompletelyLightGray,
    },
    transferAmountLabel: {
      fontSize: 14,
      color: colors.grayMedium,
      marginBottom: 4,
    },
    transferAmountValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    amountInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    amountInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      fontWeight: '600',
      color: colors.grayDark,
      backgroundColor: colors.notCompletelyLightGray,
      marginRight: 12,
      textAlign: 'right',
    },
    currencyLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      minWidth: 40,
    },
    balanceInfo: {
      fontSize: 14,
      color: colors.grayMedium,
      marginTop: 8,
      textAlign: 'right',
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      marginTop: 8,
      textAlign: 'right',
      fontWeight: '600',
    },
    commentInput: {
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.grayDark,
      backgroundColor: colors.notCompletelyLightGray,
      textAlignVertical: 'top',
      minHeight: 80,
    },
    transferButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      marginHorizontal: 20,
      marginBottom: 20,
      paddingVertical: 16,
      borderRadius: 25,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    transferButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
      marginRight: 8,
    },
    acceptButton: {
      backgroundColor: colors.primary,
    },
    acceptButtonText: {
      color: colors.white,
      fontWeight: '600',
    },
  }) 
  };

export default styles;