/**
 * Sistema de sombras basado en los patrones existentes
 * Proporciona sombras consistentes para toda la aplicación
 * Compatible con web (boxShadow) y móvil (shadow*)
 */

import { Platform } from 'react-native';

// Helper para crear sombras compatibles con web
const createShadow = (shadowColor: string, shadowOffset: { width: number; height: number }, shadowOpacity: number, shadowRadius: number, elevation: number) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`,
    };
  }
  
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

export const shadows = {
  // Sin sombra
  none: createShadow('transparent', { width: 0, height: 0 }, 0, 0, 0),

  // Sombras pequeñas - para elementos sutiles
  sm: createShadow('#000', { width: 0, height: 1 }, 0.1, 2, 2),

  // Sombras medianas - para tarjetas y botones
  md: createShadow('#000', { width: 0, height: 2 }, 0.15, 4, 4),

  // Sombras grandes - para modales y elementos importantes
  lg: createShadow('#000', { width: 0, height: 4 }, 0.2, 8, 8),

  // Sombras extra grandes - para elementos destacados
  xl: createShadow('#000', { width: 0, height: 8 }, 0.25, 16, 16),

  // Sombras específicas basadas en los patrones existentes
  specific: {
    // Botones principales
    button: createShadow('#000', { width: 0, height: 4 }, 0.3, 6, 8),
    
    // Tarjetas
    card: createShadow('#000', { width: 0, height: 2 }, 0.1, 4, 3),
    
    // Modales
    modal: createShadow('#000', { width: 0, height: 2 }, 0.25, 4, 5),
    
    // Elementos flotantes
    floating: createShadow('#000', { width: 0, height: 4 }, 0.3, 6, 8),
  }
} as const;

export default shadows;
