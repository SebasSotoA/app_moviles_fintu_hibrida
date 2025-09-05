/**
 * Estilos específicos para el componente de categorías
 * Migrado del sistema anterior al nuevo sistema de tokens
 */

import { StyleSheet } from 'react-native';
import { borders, colors, shadows, spacing, typography } from '../tokens';

export const categoriesStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },

  // Área de estado
  statusBarArea: {
    backgroundColor: colors.background.dark,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.layout.screenPadding,
    paddingVertical: spacing[3],
    backgroundColor: colors.background.dark,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.dark,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  menuButton: {
    padding: spacing[1],
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borders.radius.full,
  },

  placeholder: {
    width: 38,
  },

  // Contenedor de contenido
  contentContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
  },

  // Sección de categorías
  section: {
    marginVertical: spacing.layout.sectionMargin,
  },

  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },

  // Lista de categorías
  categoriesList: {
    gap: spacing.component.listItemGap,
  },

  // Item de categoría
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.component.listItemPadding,
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.cardSmall,
    marginBottom: spacing.component.listItemGap,
    ...shadows.specific.card,
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },

  categoryType: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing[0],
  },

  // Botón de nueva categoría
  newCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    margin: spacing.layout.screenPadding,
    paddingVertical: spacing[3],
    borderRadius: borders.specific.input,
  },

  newCategoryButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginLeft: spacing[2],
  },

  // Contenedor de carga
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },

  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },

  // Estado vacío
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[20],
    gap: spacing[4],
  },

  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[300],
    textAlign: 'center',
  },
});

export default categoriesStyles;
