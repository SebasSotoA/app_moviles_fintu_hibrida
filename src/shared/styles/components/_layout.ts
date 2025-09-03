import globalStyles from '@/src/shared/styles/globalStyles';
import colors from '@/src/shared/styles/themes';
import { StyleSheet } from 'react-native';
import { darken } from 'polished';

const layoutStyles = { ...globalStyles, ...StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: colors.grayDark, // closest to #30353D
    },
    drawerContent: {
      flex: 1,
    },
    drawerHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.almostBlack, // no close match in theme; keeping custom shade
      marginBottom: 10,
    },
    userText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
      marginTop: 10,
    },
    menuItems: {
      flex: 1,
      paddingTop: 10,
    },
    drawerItem: {
      marginVertical: 2,
      marginHorizontal: 10,
      borderRadius: 8,
    },
    activeDrawerItem: {
      backgroundColor: darken(0.1, colors.primary)
    },
    drawerLabel: {
      fontSize: 16,
      color: colors.white,
      marginLeft: 10,
    },
    activeDrawerLabel: {
      color: colors.primary,
      fontWeight: '600',
    },
  }) 
  };

export default layoutStyles;