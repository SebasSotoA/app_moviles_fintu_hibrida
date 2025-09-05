/**
 * Sistema de breakpoints para diseño responsivo
 * Basado en los breakpoints existentes del proyecto
 */

export const breakpoints = {
  // Breakpoints base
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  large: 1440,

  // Breakpoints específicos para React Native
  small: 320,    // iPhone SE
  medium: 375,   // iPhone estándar
  largeMobile: 414,    // iPhone Plus
  xlarge: 768,   // iPad
  xxlarge: 1024, // iPad Pro
} as const;

// Hook para usar breakpoints (se implementará en hooks)
export const useBreakpoint = () => {
  // Esta función se implementará en el hook useBreakpoint
  return 'mobile'; // placeholder
};

export default breakpoints;
