import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import { useStyles } from '../../src/shared/hooks';
import { headerStyles } from '../../src/shared/styles/components';
import { colors, shadows, spacing, typography } from '../../src/shared/styles/tokens';
import { TransactionType } from '../../types/transaction';

// Mapa de íconos locales con nombres exactos de Ionicons
const ICONS: Record<string, any> = {
  'arrow-back': require('../../assets/icons/arrow-back.svg'),
  'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
  'add-circle-outline': require('../../assets/icons/add-circle-outline.svg'),
  'checkmark': require('../../assets/icons/checkmark.svg'),
  'wallet-outline': require('../../assets/icons/wallet-outline.svg'),
  'cart-outline': require('../../assets/icons/cart-outline.svg'),
  'car-outline': require('../../assets/icons/car-outline.svg'),
  'home-outline': require('../../assets/icons/home-outline.svg'),
  'restaurant-outline': require('../../assets/icons/restaurant-outline.svg'),
  'medical-outline': require('../../assets/icons/medical-outline.svg'),
  'bus-outline': require('../../assets/icons/bus-outline.svg'),
  'airplane-outline': require('../../assets/icons/airplane-outline.svg'),
  'list-outline': require('../../assets/icons/list-outline.svg'),
  'school': require('../../assets/icons/school.svg'),
  'school-outline': require('../../assets/icons/school-outline.svg'),
  'game-controller-outline': require('../../assets/icons/game-controller-outline.svg'),
  'receipt-outline': require('../../assets/icons/receipt-outline.svg'),
  'briefcase-outline': require('../../assets/icons/briefcase-outline.svg'),
  'laptop-outline': require('../../assets/icons/laptop-outline.svg'),
  'trending-up-outline': require('../../assets/icons/trending-up-outline.svg'),
  'gift-outline': require('../../assets/icons/gift-outline.svg'),
};

export default function ChooseCategory() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const chooseCategoryStyles = useStyles(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    statusBarArea: {
      backgroundColor: colors.background.dark,
    },
    header: headerStyles.standard,
    headerCenter: headerStyles.center,
    headerTitle: headerStyles.title,
    backButton: headerStyles.actionButton,
    placeholder: headerStyles.placeholder,
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.layout.screenPadding,
    },
    summaryContainer: {
      backgroundColor: colors.neutral.gray[100],
      margin: spacing.layout.screenPadding,
      padding: spacing.component.cardPadding,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    summaryLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
      fontWeight: typography.fontWeight.medium,
    },
    summaryValue: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.semibold,
    },
    categoriesGrid: {
      gap: spacing.component.listItemGap,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.component.cardPadding,
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border.light,
      marginBottom: spacing[2],
    },
    selectedCategoryItem: {
      borderColor: colors.primary[500],
      backgroundColor: colors.secondary[50],
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
    confirmButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary[500],
      marginHorizontal: spacing.layout.screenPadding,
      marginBottom: spacing.layout.screenPadding,
      paddingVertical: spacing.component.buttonPadding,
      borderRadius: 25,
      ...shadows.specific.button,
    },
    confirmButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
      marginRight: spacing[2],
    },
    createCategoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.component.cardPadding,
      backgroundColor: colors.neutral.gray[100],
      gap: spacing[2],
      marginBottom: spacing[4],
    },
    createCategoryText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary[500],
      fontWeight: typography.fontWeight.semibold,
    },
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
         emptyState: {
       alignItems: 'center',
       paddingVertical: spacing[12],
       gap: spacing[4],
     },
         emptyStateText: {
       fontSize: typography.fontSize.base,
       color: colors.neutral.gray[300],
       textAlign: 'center',
     },
     sectionTitle: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.primary,
       marginBottom: spacing[4],
     },
     disabledButton: {
       backgroundColor: colors.neutral.gray[300],
     },
     disabledButtonText: {
       color: colors.neutral.gray[500],
     },
   }));
  const { categories, addTransaction, currentAccount } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener parámetros de la pantalla anterior
  const transactionType = params.type as TransactionType;
  const amount = params.amount as string;
  const date = params.date as string;
  const note = params.note as string;
  const accountId = params.accountId as string;

  // Filtrar categorías según el tipo (usando datos reales de la base de datos)
  const filteredCategories = categories.filter(
    category => category.type === transactionType
  );

  const goBack = () => {
    router.back();
  };

  // Add this function to handle navigation to create category
  const handleCreateCategory = () => {
    router.push({
      pathname: '/(drawer)/create-category',
      params: {
        type: transactionType,
        amount,
        date,
        note,
        accountId,
        returnPath: '/(drawer)/choose-category'
      }
    });
  };

  // Modify handleConfirm to ensure proper navigation
  const handleConfirm = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Por favor selecciona una categoría');
      return;
    }

    if (!currentAccount) {
      Alert.alert('Error', 'No hay cuenta seleccionada');
      return;
    }

    setIsLoading(true);
    try {
      await addTransaction({
        accountId: accountId,
        categoryId: selectedCategory,
        type: transactionType,
        amount: parseFloat(amount),
        date: date,
        note: note || undefined,
      });

      const categoryName = filteredCategories.find(c => c.id === selectedCategory)?.name;
      
      // Replace the Alert with immediate navigation and then show the alert
      router.replace('/(drawer)/');
      setTimeout(() => {
        Alert.alert(
          '¡Transacción guardada!',
          `${transactionType}: ${parseFloat(amount).toLocaleString('es-CO')} ${currentAccount.currency}\nCategoría: ${categoryName}${note ? `\nNota: ${note}` : ''}`
        );
      }, 100);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        chooseCategoryStyles.categoryItem,
        selectedCategory === category.id && chooseCategoryStyles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <View style={[chooseCategoryStyles.categoryIcon, { backgroundColor: category.color }]}>
        <Image
          source={ICONS[category.icon as string]}
                     style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
          resizeMode="contain"
        />
      </View>
      <Text style={chooseCategoryStyles.categoryName}>{category.name}</Text>
      {selectedCategory === category.id && (
        <Image
          source={ICONS['checkmark-circle']}
                         style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={chooseCategoryStyles.container}>
             <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      
      {/* Área superior con color del header */}
      <View style={[chooseCategoryStyles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={chooseCategoryStyles.header}>
        <TouchableOpacity onPress={goBack} style={chooseCategoryStyles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={chooseCategoryStyles.headerCenter}>
          <Text style={chooseCategoryStyles.headerTitle}>
            Elegir Categoría de {transactionType === 'GASTO' ? 'Gasto' : 'Ingreso'}
          </Text>
        </View>
        <View style={chooseCategoryStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={chooseCategoryStyles.contentContainer} edges={['left', 'right', 'bottom']}>
        {/* Resumen de la transacción */}
        <View style={chooseCategoryStyles.summaryContainer}>
          <View style={chooseCategoryStyles.summaryRow}>
            <Text style={chooseCategoryStyles.summaryLabel}>Tipo:</Text>
                         <Text style={[
               chooseCategoryStyles.summaryValue,
               { color: transactionType === 'GASTO' ? colors.semantic.error : colors.semantic.success }
             ]}>
              {transactionType}
            </Text>
          </View>
          <View style={chooseCategoryStyles.summaryRow}>
            <Text style={chooseCategoryStyles.summaryLabel}>Monto:</Text>
            <Text style={chooseCategoryStyles.summaryValue}>
              {parseFloat(amount).toLocaleString('es-CO')} {currentAccount?.currency || 'COP'}
            </Text>
          </View>
        </View>

        <ScrollView style={chooseCategoryStyles.content} showsVerticalScrollIndicator={false}>
          
          {/* Título de sección */}
          <Text style={chooseCategoryStyles.sectionTitle}>
            Selecciona una categoría:
          </Text>

          {/* Grid de categorías */}
          <View style={chooseCategoryStyles.categoriesGrid}>
            {filteredCategories.map(renderCategoryItem)}
          </View>

          {/* Opción de crear nueva categoría */}
          <TouchableOpacity 
            style={chooseCategoryStyles.createCategoryButton}
            onPress={handleCreateCategory}
          >
            <Image
              source={ICONS['add-circle-outline']}
                             style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
              resizeMode="contain"
            />
            <Text style={chooseCategoryStyles.createCategoryText}>Crear Nueva Categoría</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Botón Confirmar */}
        <TouchableOpacity 
          style={[
            chooseCategoryStyles.confirmButton,
            (!selectedCategory || isLoading) && chooseCategoryStyles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedCategory || isLoading}
        >
          {isLoading ? (
                         <ActivityIndicator size="small" color={colors.neutral.white} />
          ) : (
            <>
              <Text style={[
                chooseCategoryStyles.confirmButtonText,
                (!selectedCategory || isLoading) && chooseCategoryStyles.disabledButtonText
              ]}>
                Confirmar
              </Text>
              <Image
                source={ICONS['checkmark']}
                                 style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
                resizeMode="contain"
              />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
