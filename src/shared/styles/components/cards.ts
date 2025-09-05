/**
 * Componentes de estilo para tarjetas
 * Basados en los patrones existentes del proyecto
 */

import { StyleSheet } from 'react-native';
import { borders, colors, shadows, spacing } from '../tokens';

export const cardStyles = StyleSheet.create({
  // Tarjeta base - basada en accountCard, categoryCard
  base: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    ...shadows.specific.card,
  },

  // Tarjeta pequeña
  small: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.cardSmall,
    padding: spacing.component.cardPaddingSmall,
    ...shadows.specific.card,
  },

  // Tarjeta grande
  large: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.cardLarge,
    padding: spacing.component.cardPaddingLarge,
    ...shadows.specific.card,
  },

  // Tarjeta con borde - basada en accountCard con borderColor
  bordered: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    borderWidth: borders.width[2],
    borderColor: colors.border.light,
    ...shadows.specific.card,
  },

  // Tarjeta seleccionada - basada en activeAccountCard, selectedCategoryItem
  selected: {
    backgroundColor: colors.secondary[50], // tertiary original
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    borderWidth: borders.width[2],
    borderColor: colors.primary[500],
    ...shadows.specific.card,
  },

  // Tarjeta de resumen - basada en totalSection, summaryContainer
  summary: {
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    alignItems: 'center',
  },

  // Tarjeta de gráfico - basada en chartSection, categoriesSection
  chart: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    ...shadows.specific.card,
  },

  // Tarjeta de categoría - basada en categoryCard
  category: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.cardSmall,
    padding: spacing.component.cardPaddingSmall,
    marginBottom: spacing.component.listItemGap,
    ...shadows.specific.card,
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Tarjeta de cuenta - basada en accountCard
  account: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.card,
    padding: spacing.component.cardPadding,
    borderWidth: borders.width[2],
    borderColor: colors.border.light,
    ...shadows.specific.card,
  },

  // Tarjeta de cuenta activa - basada en activeAccountCard
  accountActive: {
    backgroundColor: colors.secondary[50], // tertiary original
    borderColor: colors.primary[500],
  },

  // Tarjeta de modal - basada en confirmModal, accountSelectorModal
  modal: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.specific.modal,
    padding: spacing.component.modalPadding,
    width: '85%',
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    ...shadows.specific.modal,
  },

  // Tarjeta de selector de cuenta - basada en accountSelector
  selector: {
    backgroundColor: colors.neutral.gray[100],
    borderRadius: borders.specific.cardSmall,
    padding: spacing.component.cardPadding,
    borderWidth: borders.width[1],
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default cardStyles;
