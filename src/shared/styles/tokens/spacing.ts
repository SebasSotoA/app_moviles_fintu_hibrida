/**
 * Sistema de espaciado basado en múltiplos de 4
 * Proporciona espaciados consistentes para toda la aplicación
 */

export const spacing = {
  // Sistema base - múltiplos de 4
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  64: 256,

  // Espaciados semánticos - basados en los patrones existentes
  semantic: {
    xs: 4,      // padding muy pequeño
    sm: 8,      // padding pequeño
    md: 16,     // padding estándar
    lg: 24,     // padding grande
    xl: 32,     // padding extra grande
    '2xl': 48,  // padding muy grande
    '3xl': 64,  // padding enorme
  },

  // Espaciados específicos para componentes
  component: {
    // Botones
    buttonPadding: 16,
    buttonPaddingSmall: 12,
    buttonPaddingLarge: 20,
    
    // Tarjetas
    cardPadding: 20,
    cardPaddingSmall: 16,
    cardPaddingLarge: 24,
    
    // Inputs
    inputPadding: 16,
    inputPaddingSmall: 12,
    
    // Headers
    headerPadding: 20,
    headerPaddingVertical: 12,
    
    // Modales
    modalPadding: 20,
    modalMargin: 20,
    
    // Listas
    listItemPadding: 16,
    listItemGap: 12,
  },

  // Espaciados de layout
  layout: {
    containerPadding: 20,
    sectionMargin: 16,
    sectionMarginLarge: 30,
    screenPadding: 20,
  }
} as const;

export default spacing;
