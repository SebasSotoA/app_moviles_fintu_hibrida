import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    summarySection: {
      backgroundColor: lighten(0.10, colors.notCompletelyLightGray),
      borderRadius: 16,
      padding: 24,
      marginVertical: 20,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.grayDark, // closest to #30353D
      marginBottom: 8,
      textAlign: 'center',
    },
    summaryText: {
      fontSize: 14,
      color: colors.grayMedium,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    summaryStats: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.grayMedium,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.notCompletelyLightGray,
      marginHorizontal: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
  
    sectionCount: {
      fontSize: 12,
      color: colors.grayMedium,
      backgroundColor: lighten(0.10, colors.notCompletelyLightGray),
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoriesContainer: {
      backgroundColor: colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      overflow: 'hidden',
    },
    categoryItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.notCompletelyLightGray, // very light border; not in theme, kept
    },
    monthlyAmount: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    categoryActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    monthlyBadge: {
      backgroundColor: colors.tertiary, // light info blue; closest theme is tertiary but a bit different; keeping
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    monthlyBadgeText: {
      fontSize: 10,
      color: colors.primary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    emptyCategorySection: {
      backgroundColor: colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      padding: 40,
      alignItems: 'center',
      gap: 16,
    },
    emptyCategoryText: {
      fontSize: 14,
      color: colors.gray,
      textAlign: 'center',
      lineHeight: 20,
    },
    createFirstCategoryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    createFirstCategoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    bottomSpace: {
      height: 30,
    },
  }) 
};

export default styles;