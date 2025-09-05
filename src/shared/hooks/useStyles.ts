/**
 * Hook para crear estilos dinámicos
 * Proporciona utilidades para crear estilos basados en tokens
 */

import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { borders, shadows, spacing, typography } from '../styles/tokens';
import { useTheme } from './useTheme';

export interface StyleFunction<T> {
  (theme: ReturnType<typeof useTheme>): T;
}

export const useStyles = <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  styleFunction: StyleFunction<T>
): T => {
  const theme = useTheme();
  
  return useMemo(() => {
    return StyleSheet.create(styleFunction(theme));
  }, [theme, styleFunction]);
};

// Hook para estilos condicionales
export const useConditionalStyles = <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  styleFunction: StyleFunction<T>,
  condition: boolean
): T => {
  const theme = useTheme();
  
  return useMemo(() => {
    if (!condition) return {} as T;
    return StyleSheet.create(styleFunction(theme));
  }, [theme, condition, styleFunction]);
};

// Hook para estilos responsivos
export const useResponsiveStyles = <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  styleFunction: StyleFunction<T>,
  breakpoint: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
): T => {
  const theme = useTheme();
  
  return useMemo(() => {
    return StyleSheet.create(styleFunction(theme));
  }, [theme, styleFunction]);
};

// Hook para estilos de botones
export const useButtonStyles = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') => {
  const theme = useTheme();
  
  return useMemo(() => {
    const baseStyle: ViewStyle = {
      paddingVertical: spacing.component.buttonPadding,
      paddingHorizontal: spacing[4],
      borderRadius: borders.specific.button,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const textStyle: TextStyle = {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
    };

    switch (variant) {
      case 'primary':
        return {
          button: {
            ...baseStyle,
            backgroundColor: theme.colors.primary[500],
            ...shadows.specific.button,
          },
          text: {
            ...textStyle,
            color: theme.colors.neutral.white,
          },
        };
      case 'secondary':
        return {
          button: {
            ...baseStyle,
            backgroundColor: theme.colors.neutral.gray[100],
            borderWidth: borders.width[1],
            borderColor: theme.colors.border.light,
          },
          text: {
            ...textStyle,
            color: theme.colors.text.secondary,
          },
        };
      case 'outline':
        return {
          button: {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderWidth: borders.width[2],
            borderColor: theme.colors.primary[500],
          },
          text: {
            ...textStyle,
            color: theme.colors.primary[500],
          },
        };
      case 'ghost':
        return {
          button: {
            ...baseStyle,
            backgroundColor: 'transparent',
          },
          text: {
            ...textStyle,
            color: theme.colors.primary[500],
          },
        };
      default:
        return {
          button: baseStyle,
          text: textStyle,
        };
    }
  }, [theme, variant]);
};

// Hook para estilos de tarjetas
export const useCardStyles = (variant: 'base' | 'bordered' | 'selected' | 'summary' = 'base') => {
  const theme = useTheme();
  
  return useMemo(() => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.neutral.white,
      borderRadius: borders.specific.card,
      padding: spacing.component.cardPadding,
      ...shadows.specific.card,
    };

    switch (variant) {
      case 'bordered':
        return {
          ...baseStyle,
          borderWidth: borders.width[2],
          borderColor: theme.colors.border.light,
        };
      case 'selected':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary[50],
          borderWidth: borders.width[2],
          borderColor: theme.colors.primary[500],
        };
      case 'summary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.neutral.gray[100],
          borderWidth: borders.width[1],
          borderColor: theme.colors.border.light,
          alignItems: 'center',
        };
      default:
        return baseStyle;
    }
  }, [theme, variant]);
};

// Hook para estilos de formularios
export const useFormStyles = (variant: 'base' | 'focused' | 'error' | 'disabled' = 'base') => {
  const theme = useTheme();
  
  return useMemo(() => {
    const baseStyle: ViewStyle = {
      borderWidth: borders.width[1],
      borderColor: theme.colors.border.light,
      borderRadius: borders.specific.input,
      padding: spacing.component.inputPadding,
      backgroundColor: theme.colors.neutral.gray[100],
    };

    const textStyle: TextStyle = {
      fontSize: typography.fontSize.base,
      color: theme.colors.text.secondary,
    };

    switch (variant) {
      case 'focused':
        return {
          container: {
            ...baseStyle,
            borderColor: theme.colors.primary[500],
            backgroundColor: theme.colors.neutral.white,
          },
          text: textStyle,
        };
      case 'error':
        return {
          container: {
            ...baseStyle,
            borderColor: theme.colors.semantic.error,
            backgroundColor: theme.colors.neutral.white,
          },
          text: textStyle,
        };
      case 'disabled':
        return {
          container: {
            ...baseStyle,
            borderColor: theme.colors.border.light,
            backgroundColor: theme.colors.neutral.gray[100],
          },
          text: {
            ...textStyle,
            color: theme.colors.text.disabled,
          },
        };
      default:
        return {
          container: baseStyle,
          text: textStyle,
        };
    }
  }, [theme, variant]);
};

export default useStyles;
