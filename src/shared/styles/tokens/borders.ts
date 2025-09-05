/**
 * Sistema de bordes basado en los patrones existentes
 * Proporciona bordes y radios consistentes para toda la aplicación
 */

export const borders = {
  // Radios de borde - basados en los existentes
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 25,    // borderRadius: 25 (patrón común en botones)
    full: 9999,
  },

  // Anchos de borde
  width: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    8: 8,
  },

  // Estilos de borde
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },

  // Bordes específicos basados en los patrones existentes
  specific: {
    // Botones
    button: 25,
    buttonSmall: 20,
    buttonLarge: 30,
    
    // Tarjetas
    card: 16,
    cardSmall: 12,
    cardLarge: 20,
    
    // Inputs
    input: 12,
    inputSmall: 8,
    
    // Modales
    modal: 20,
    modalSmall: 16,
    
    // Elementos redondos
    round: 9999,
    roundSmall: 20,
    roundMedium: 25,
    roundLarge: 35,
  }
} as const;

export default borders;
