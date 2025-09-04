import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grayDark,
    },
    statusBarArea: {
      backgroundColor: colors.grayDark,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.grayDark,
      borderBottomWidth: 1,
      borderBottomColor: colors.black,
    },
    backButton: {
      padding: 5,
      width: 38,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.white,
    },
    placeholder: {
      width: 38,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.grayDark,
      marginBottom: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      backgroundColor: colors.notCompletelyLightGray,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.notCompletelyLightGray,
      borderRadius: 25,
      padding: 4,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 20,
    },
    activeToggleButton: {
      backgroundColor: colors.primary,
    },
    toggleText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.grayMedium,
    },
    activeToggleText: {
      color: colors.white,
    },
    iconList: {
      flexDirection: 'row',
      marginHorizontal: -8,
    },
    iconButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.notCompletelyLightGray,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    selectedIconButton: {
      backgroundColor: colors.primary,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    monthlyExpenseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    switch: {
      width: 51,
      height: 31,
      borderRadius: 15.5,
      backgroundColor: colors.notCompletelyLightGray,
      padding: 3,
    },
    switchActive: {
      backgroundColor: colors.primary,
    },
    switchKnob: {
      width: 25,
      height: 25,
      borderRadius: 12.5,
      backgroundColor: colors.white,
    },
    switchKnobActive: {
      transform: [{ translateX: 20 }],
    },
    createButton: {
      backgroundColor: colors.primary,
      marginHorizontal: 20,
      marginBottom: 20,
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
    disabledButton: {
      backgroundColor: colors.gray, // approximated
    },
    deleteButton: {
      backgroundColor: lighten(0.45, colors.error),
      borderWidth: 1,
      borderColor: lighten(0.2, colors.error),
      marginHorizontal: 20,
      marginBottom: 20,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
    },
    deleteButtonText: {
      color: colors.error,
      fontWeight: '700',
      fontSize: 16,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirmModal: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      width: '85%',
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.grayDark,
    },
    confirmText: {
      fontSize: 14,
      color: colors.grayDark,
      marginTop: 8,
      marginBottom: 12,
    },
    confirmInstruction: {
      fontSize: 12,
      color: colors.grayMedium,
      marginBottom: 8,
    },
    confirmInput: {
      borderWidth: 1,
      borderColor: colors.notCompletelyLightGray,
      borderRadius: 10,
      padding: 12,
      backgroundColor: colors.notCompletelyLightGray,
      marginBottom: 14,
    },
    confirmActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    confirmButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: colors.notCompletelyLightGray,
    },
    cancelButtonText: {
      color: colors.grayDark,
      fontWeight: '600',
    },
    deleteConfirmButton: {
      backgroundColor: colors.error,
    },
    disabledDeleteButton: {
      backgroundColor: lighten(0.3, colors.error),
    },
    deleteConfirmButtonText: {
      color: colors.white,
      fontWeight: '700',
    },
  }) 
};

export default styles;