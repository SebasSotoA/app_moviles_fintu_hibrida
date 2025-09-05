
/**
 * Estilos específicos para el componente de cuentas
 * Migrado del sistema anterior al nuevo sistema de tokens
 */

import { StyleSheet } from 'react-native';
import { borders, colors, shadows, spacing, typography } from '../tokens';

export const accountsStyles = StyleSheet.create({
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

  // Sección de totales
  totalSection: {
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.card,
    padding: spacing[6],
    marginVertical: spacing[5],
    alignItems: 'center',
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
  },

  totalLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[2],
  },

  totalAmount: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  totalSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.gray[300],
  },

  // Filas de divisa
  currencyRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    borderBottomWidth: borders.width[1],
    borderBottomColor: colors.border.light,
  },

  currencyCode: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },

  currencyTotal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },

  currencyCount: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },

  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    marginBottom: spacing[8],
    gap: spacing[3],
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderRadius: borders.specific.button,
    gap: spacing[2],
  },

  transferButton: {
    backgroundColor: colors.primary[600], // darken(0.15, colors.primary)
  },

  addButton: {
    backgroundColor: colors.primary[500],
  },

  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  // Sección de cuentas
  accountsSection: {
    marginBottom: spacing[8],
  },

  accountsList: {
    gap: spacing.component.listItemGap,
  },

  // Tarjetas de cuenta
  accountCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    borderWidth: borders.width[2],
    borderColor: colors.border.light,
    ...shadows.specific.card,
  },

  activeAccountCard: {
    borderColor: colors.primary[500],
    backgroundColor: colors.secondary[50],
  },

  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  accountSymbol: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },

  accountInfo: {
    flex: 1,
  },

  accountName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[0],
  },

  accountCurrency: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },

  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },

  editButton: {
    padding: spacing[2],
    borderRadius: borders.specific.button,
    backgroundColor: colors.secondary[50],
    borderWidth: borders.width[1],
    borderColor: colors.primary[500],
  },

  accountBalance: {
    alignItems: 'flex-end',
  },

  balanceAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  balanceCurrency: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing[0],
  },

  // Indicador activo
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: borders.width[1],
    borderTopColor: colors.border.light,
    gap: spacing[1],
  },

  activeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },

  // Indicador excluido
  excludedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    gap: spacing[1],
  },

  excludedText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.gray[300],
    fontStyle: 'italic',
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

  createFirstAccountButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borders.specific.button,
  },

  createFirstAccountText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },

  // Botón de nueva cuenta
  newAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    margin: spacing.layout.screenPadding,
    paddingVertical: spacing[3],
    borderRadius: borders.specific.input,
  },

  newAccountButtonText: {
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
});

export default accountsStyles;
