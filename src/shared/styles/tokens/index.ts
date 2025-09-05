/**
 * Punto de entrada para todos los tokens de diseño
 * Exporta todos los tokens de manera organizada
 */

export { default as borders } from './borders';
export { default as breakpoints } from './breakpoints';
export { default as colors, legacyColors } from './colors';
export { default as shadows } from './shadows';
export { default as spacing } from './spacing';
export { default as typography } from './typography';

// Re-exportar para compatibilidad
export { colors as theme } from './colors';
