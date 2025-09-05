/**
 * Punto de entrada principal para el sistema de estilos
 * Exporta todos los tokens, componentes y hooks de manera organizada
 */

// Tokens de diseño
export * from './tokens';

// Componentes de estilo
export * from './components';

// Hooks de estilo
export * from '../hooks';

// Utilidades de migración (archivo eliminado)

// Re-exportar para compatibilidad
export { default as globalStyles } from './globalStyles';
export { default as themes } from './themes';

