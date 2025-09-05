/**
 * Componentes de estilo para layout
 * Basados en los patrones existentes del proyecto
 */

import { StyleSheet } from 'react-native';
import { borders, colors, spacing, typography } from '../tokens';

export const layoutStyles = StyleSheet.create({
  // Contenedor principal - basado en container
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },

  // Contenedor de contenido - basado en contentContainer
  contentContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },

  // Contenido principal - basado en content
  content: {
    flex: 1,
    paddingHorizontal: spacing.layout.screenPadding,
  },

  // Header - basado en header
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

  // Centro del header - basado en headerCenter
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  // Lado derecho del header - basado en headerRight
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },

  // Título del header - basado en headerTitle
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  // Área de estado - basado en statusBarArea
  statusBarArea: {
    backgroundColor: colors.background.dark,
  },

  // Sección - basado en section
  section: {
    marginVertical: spacing.layout.sectionMargin,
  },

  // Título de sección - basado en sectionTitle
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },

  // Lista - basado en accountsList
  list: {
    gap: spacing.component.listItemGap,
  },

  // Item de lista - basado en accountItem, categoryItem
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.component.listItemPadding,
    backgroundColor: colors.neutral.white,
  },

  // Item de lista con borde - basado en accountItem con borderBottom
  listItemBordered: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.component.listItemPadding,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },

  // Item de lista seleccionado - basado en selectedAccountItem
  listItemSelected: {
    backgroundColor: colors.secondary[50], // tertiary original
  },

  // Contenedor de carga - basado en loadingContainer
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },

  // Texto de carga - basado en loadingText
  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },

  // Estado vacío - basado en emptyState
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[20],
    gap: spacing[4],
  },

  // Texto de estado vacío - basado en emptyStateText
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[300],
    textAlign: 'center',
  },

  // Contenedor de botones de acción - basado en actionButtons
  actionButtons: {
    flexDirection: 'row',
    marginBottom: spacing[8],
    gap: spacing[3],
  },

  // Botón de acción - basado en actionButton
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderRadius: 25,
    gap: spacing[2],
  },

  // Botón de transferencia - basado en transferButton
  transferButton: {
    backgroundColor: colors.primary[600], // darken(0.15, colors.primary)
  },

  // Botón de agregar - basado en addButton
  addButton: {
    backgroundColor: colors.primary[500],
  },

  // Texto del botón de acción - basado en actionButtonText
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  // Contenedor de total - basado en totalSection
  totalSection: {
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.card,
    padding: spacing[6],
    marginVertical: spacing[5],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  // Título principal - basado en title
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  // Subtítulo - basado en subtitle
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },

  // Cantidad total - basado en totalAmount
  totalAmount: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },

  // Placeholder - basado en placeholder
  placeholder: {
    width: 38,
  },
});

export default layoutStyles;
