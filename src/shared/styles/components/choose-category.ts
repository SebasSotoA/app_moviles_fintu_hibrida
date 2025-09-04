import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    summaryContainer: {
      backgroundColor: colors.notCompletelyLightGray,
      margin: 20,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.grayMedium,
      fontWeight: '500',
    },
    summaryValue: {
      fontSize: 16,
      color: colors.grayDark,
      fontWeight: '600',
    },
    categoriesGrid: {
      gap: 12,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.white,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.notCompletelyLightGray,
      marginBottom: 8,
    },
    selectedCategoryItem: {
      borderColor: colors.primary,
      backgroundColor: colors.tertiary,
    },
    confirmButton: {
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
    confirmButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
      marginRight: 8,
    },
  }) 
};

export default styles;