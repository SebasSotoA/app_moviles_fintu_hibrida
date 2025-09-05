/**
 * Sistema de colores basado en los colores existentes del proyecto
 * Proporciona una paleta completa y consistente para toda la aplicación
 */

export const colors = {
  // Colores primarios - basados en el color principal #38837c
  primary: {
    50: '#F0F9F8',   // Muy claro
    100: '#E1F2F0',
    200: '#C3E5E1',
    300: '#85D1C7',
    400: '#47BDAD',
    500: '#38837C',  // Color principal
    600: '#2D6963',
    700: '#224F4A',
    800: '#173531',
    900: '#0C1B18',
  },

  // Colores secundarios - complementario al primario #38837c
  secondary: {
    50: '#F0F8FF',   // Alice Blue (mantener para compatibilidad)
    100: '#E6F3FF',
    200: '#CCE7FF',
    300: '#99CFFF',
    400: '#66B7FF',
    500: '#4A90E2',  // Azul complementario
    600: '#3A7BD5',
    700: '#2E5F73',
    800: '#224755',
    900: '#162F37',
  },

  // Colores semánticos - basados en los existentes
  semantic: {
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
  },

  // Colores neutros - basados en la paleta existente
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F8F9FA',        // backgroundLight original
      100: '#E9ECEF',       // notCompletelyLightGray original
      200: '#DEE2E6',
      300: '#CCCCCC',       // gray original
      400: '#ADADAD',       // disabledButton original
      500: '#666666',       // grayMedium original
      600: '#495057',
      700: '#30363D',       // grayDark original
      800: '#212529',
      900: '#121212',       // backgroundDark original
    }
  },

  // Colores de fondo
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    surface: '#F8F9FA',
    card: '#FFFFFF',
    elevated: '#CCCAD9',
    lighter: '#E0E0E6',
    header: '#0b131a',
    togglePressed: '#38837c',
    toggleUnpressed: '#1d423e'
  },

  // Colores de texto
  text: {
    primary: '#000000',      // almostBlack original
    secondary: '#30363D',    // grayDark original
    tertiary: '#666666',     // grayMedium original
    disabled: '#ADADAD',
    inverse: '#FFFFFF',
  },

  // Colores de borde
  border: {
    light: '#E9ECEF',        // notCompletelyLightGray original
    medium: '#CCCCCC',       // gray original
    dark: '#30363D',         // grayDark original
  },

  // Colores de estado
  state: {
    hover: '#F0F9F8',        // primary 50
    active: '#38837C',       // primary 500
    disabled: '#ADADAD',
    focus: '#38837C',        // primary 500
  }
} as const;

// Alias para compatibilidad con el sistema existente
export const legacyColors = {
  primary: colors.primary[500],        // #38837C
  tertiary: colors.secondary[50],      // Alice Blue
  black: colors.neutral.black,
  almostBlack: colors.text.primary,
  white: colors.neutral.white,
  notCompletelyLightGray: colors.neutral.gray[100],
  gray: colors.neutral.gray[300],
  grayMedium: colors.neutral.gray[500],
  grayDark: colors.neutral.gray[700],
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
  backgroundLight: colors.background.light,
  backgroundDark: colors.background.dark,
} as const;

export default colors;
