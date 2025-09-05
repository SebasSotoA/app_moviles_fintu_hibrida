/**
 * Punto de entrada para todos los hooks de estilo
 * Exporta todos los hooks de manera organizada
 */

export {
    default as useBreakpoint, useIsBreakpointDown, useIsBreakpointUp, useResponsiveValue
} from './useBreakpoint';
export {
    useButtonStyles,
    useCardStyles, useConditionalStyles, useFormStyles, useResponsiveStyles, default as useStyles
} from './useStyles';
export { useLegacyColors, useSemanticColors, useStateColors, default as useTheme } from './useTheme';

// Re-exportar para compatibilidad
export { useStyles as useStyleSheet } from './useStyles';
export { useTheme as useColors } from './useTheme';

