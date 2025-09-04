import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const styles = { ...globalStyles, ...StyleSheet.create({
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA', // no close match in theme; keeping subtle light gray
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
  },
  dateText: {
    fontSize: 16,
    color: colors.grayDark, // closest to #30353D
    fontWeight: '500',
  },
  amountContainer: {
    padding: 20,
    backgroundColor: '#F8F9FA', // no close match in theme; keeping
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.grayDark, // closest to #30353D
    backgroundColor: '#F8F9FA', // no close match in theme; keeping
    textAlignVertical: 'top',
    minHeight: 80,
  },

  continueButton: {
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  // Date Picker Modal Styles
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // overlay uses transparency; not in theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '80%',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.grayDark,
    marginBottom: 20,
  },
  datePickerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: '#F8F9FA', // no close match in theme; keeping
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
  },
  datePickerButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grayDark,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  todayButton: {
    backgroundColor: '#F8F9FA', // no close match in theme; keeping
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
  },
  todayButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grayDark,
  },
}) 
};
export default styles;