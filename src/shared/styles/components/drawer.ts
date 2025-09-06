import { StyleSheet } from 'react-native';
import { borders, colors, spacing, typography } from '../tokens';

/**
 * Estilos para el componente Drawer
 * Siguiendo el sistema de diseño Fintu
 */
export const drawerStyles = StyleSheet.create({
  // Contenedor principal del drawer
  container: {
    flex: 1,
    backgroundColor: colors.background.header,
  },

  // Header del drawer
  header: {
    padding: spacing.layout.screenPadding,
    paddingTop: spacing[8],
    borderBottomWidth: 1,
    borderBottomColor: colors.background.dark,
  },

  // Contenedor del logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },

  // Logo
  logo: {
    width: 90,
    height: 90,
    marginBottom: spacing[1],
  },

  // Nombre de la aplicación
  appName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },

  // Texto del usuario
  userText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginTop: spacing[2],
  },

  // Contenido del drawer
  content: {
    flex: 1,
  },

  // Contenedor de elementos del menú
  menuItems: {
    flex: 1,
    paddingTop: spacing[0],
  },

  // Elemento del drawer (estado normal)
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing.layout.screenPadding,
    marginHorizontal: spacing[1],
    borderRadius: borders.radius.md,
  },

  // Elemento del drawer (estado activo)
  activeItem: {
    backgroundColor: colors.primary[500],
  },

  // Icono del elemento del drawer
  itemIcon: {
    marginRight: spacing[3],
  },

  // Texto del elemento del drawer (estado normal)
  itemText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.medium,
  },

  // Texto del elemento del drawer (estado activo)
  activeItemText: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },

  // Label del drawer (estado normal)
  label: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.medium,
  },

  // Label del drawer (estado activo)
  activeLabel: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },
});

/**
 * Estilos de texto para el drawer
 */
export const drawerTextStyles = StyleSheet.create({
  appName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  userText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginTop: spacing[2],
  },
  itemText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.medium,
  },
  activeItemText: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.medium,
  },
  activeLabel: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold,
  },
});

/**
 * Variantes de estilos para diferentes estados del drawer
 */
export const drawerVariants = {
  container: {
    light: {
      backgroundColor: colors.background.light,
    },
    dark: {
      backgroundColor: colors.background.dark,
    },
  },
  item: {
    normal: {
      backgroundColor: 'transparent',
    },
    active: {
      backgroundColor: colors.primary[500],
    },
    hover: {
      backgroundColor: colors.neutral.gray[800],
    },
  },
} as const;

