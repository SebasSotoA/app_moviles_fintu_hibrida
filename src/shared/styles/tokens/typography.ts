/**
 * Sistema tipográfico basado en los tamaños y pesos existentes
 * Proporciona escalas consistentes para toda la aplicación
 */

export const typography = {
  // Familias de fuentes
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  // Tamaños de fuente - basados en los existentes
  fontSize: {
    xs: 12,      // caption, small text
    sm: 14,      // body small, labels
    base: 16,    // body text
    lg: 18,      // body large, headers
    xl: 20,      // h3, large headers
    '2xl': 24,   // h2, section titles
    '3xl': 28,   // h1, main titles
    '4xl': 32,   // display text, large amounts
    '5xl': 36,   // hero text
  },

  // Pesos de fuente - basados en los existentes
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Altura de línea
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Estilos predefinidos - basados en los patrones existentes
  styles: {
    // Headers
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.3,
    },
    
    // Body text
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    
    // Labels y captions
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
    },
    
    // Botones
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.2,
    },
    
    // Especiales
    display: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    amount: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
    },
    amountLarge: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 1.2,
    },
  }
} as const;

export default typography;
