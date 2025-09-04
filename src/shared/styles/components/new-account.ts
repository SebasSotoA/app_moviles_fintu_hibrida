import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    accountPreview: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginVertical: 20,
      borderRadius: 16,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    previewSymbol: {
      fontSize: 32,
      marginBottom: 8,
    },
    previewName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 4,
    },
    previewBalance: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.white,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.grayDark,
      backgroundColor: colors.notCompletelyLightGray,
    },
    balanceInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.grayDark,
      backgroundColor: colors.notCompletelyLightGray,
      marginRight: 12,
    },
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      backgroundColor: colors.notCompletelyLightGray,
    },
    currencyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginRight: 4,
    },
    symbolGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    symbolOption: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.notCompletelyLightGray,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedSymbolOption: {
      borderColor: colors.primary,
      backgroundColor: colors.tertiary,
    },
    colorOption: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColorOption: {
      borderColor: colors.grayDark,
      borderWidth: 3,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.notCompletelyLightGray,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    checkedCheckbox: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.grayDark,
    },
    checkboxDescription: {
      fontSize: 14,
      color: colors.grayMedium,
      marginLeft: 36,
    },
    createButton: {
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
    currencySelectorModal: {
      backgroundColor: colors.white,
      borderRadius: 20,
      margin: 20,
      maxHeight: '70%',
      width: '90%',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    currencyList: {
      maxHeight: 300,
    },
    currencyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.notCompletelyLightGray,
    },
    selectedCurrencyItem: {
      backgroundColor: colors.tertiary,
    },
    currencyItemInfo: {
      flex: 1,
    },
    currencyItemCode: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.grayDark,
      marginBottom: 2,
    },
    currencyItemName: {
      fontSize: 14,
      color: colors.grayMedium,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
  }) 
  };

export default styles;