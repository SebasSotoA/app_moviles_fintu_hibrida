/**
 * Estilos centralizados para headers de la aplicación
 * Mantiene consistencia en tamaño, color y tipografía
 */

import { colors, spacing, typography } from '../tokens';

export const headerStyles = {
  // Header estándar para todas las pantallas (excepto dashboard)
  standard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[3],
    backgroundColor: colors.background.header,
    borderBottomWidth: 1,
  },
  
  // Header del dashboard (con logo)
  dashboard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[4],
    backgroundColor: colors.background.header,
  },

  // Centro del header (para títulos)
  center: {
    flex: 1,
    alignItems: 'center' as const,
  },

  // Título del header
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  // Botón de menú (izquierda)
  menuButton: {
    padding: spacing[1],
    width: 38,
    height: 38,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Placeholder para mantener centrado el título
  placeholder: {
    width: 38,
  },

  // Botón de acción (derecha)
  actionButton: {
    padding: spacing[1],
    width: 38,
    height: 38,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
} as const;

export default headerStyles;

