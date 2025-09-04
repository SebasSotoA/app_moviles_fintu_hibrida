import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    totalLabel: {
      fontSize: 14,
      color: colors.grayMedium,
      marginBottom: 8,
    },
    totalAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.grayDark,
      marginBottom: 4,
    },
    totalSubtext: {
      fontSize: 12,
      color: colors.gray,
    },
    currencyRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.notCompletelyLightGray,
    },
    currencyCode: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.grayDark,
    },
    currencyTotal: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    currencyCount: {
      fontSize: 12,
      color: colors.grayMedium,
    },
    actionButtons: {
      flexDirection: 'row',
      marginBottom: 30,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 25,
      gap: 8,
    },
    transferButton: {
      backgroundColor: darken(0.15, colors.primary),
    },
    addButton: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    accountsSection: {
      marginBottom: 30,
    },
    accountsList: {
      gap: 12,
    },
    accountCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: colors.notCompletelyLightGray,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    activeAccountCard: {
      borderColor: colors.primary,
      backgroundColor: colors.tertiary,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    accountSymbol: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    accountCurrency: {
      fontSize: 12,
      color: colors.grayMedium,
    },
    accountActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    editButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.tertiary,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    accountBalance: {
      alignItems: 'flex-end',
    },
    balanceAmount: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    balanceCurrency: {
      fontSize: 12,
      color: colors.grayMedium,
      marginTop: 2,
    },
    activeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.notCompletelyLightGray,
      gap: 6,
    },
    activeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    excludedIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 4,
    },
    excludedText: {
      fontSize: 11,
      color: colors.gray,
      fontStyle: 'italic',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
      gap: 16,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
    },
    createFirstAccountButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 20,
    },
    createFirstAccountText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
  }) 
};

export default styles;