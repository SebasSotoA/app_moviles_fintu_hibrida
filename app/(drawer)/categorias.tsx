import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

export default function Categorias() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { categories, isLoading } = useApp();
  
  const styles = useStyles(() => ({
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
    menuButton: headerStyles.menuButton,
    placeholder: headerStyles.placeholder,
    contentContainer: {
      flex: 1,
      paddingVertical: spacing[4],
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.layout.screenPadding,
    },
    section: {
      marginBottom: spacing[6],
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing[3],
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.component.cardPadding,
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.light,
      marginBottom: spacing[2],
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
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       marginBottom: spacing[0],
     },
     categoryType: {
       fontSize: typography.fontSize.sm,
       color: colors.text.tertiary,
     },
     chevronIcon: {
       marginLeft: spacing[2],
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
   }));
  
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);

  // Mapa de íconos locales
  const ICONS: Record<string, any> = {
    'list-outline': require('../../assets/icons/list-outline.svg'),
    'menu': require('../../assets/icons/menu.svg'),
    'chevron-forward': require('../../assets/icons/chevron-forward.svg'),
    'add-circle-outline': require('../../assets/icons/add-circle-outline.svg'),
    'remove-circle-outline': require('../../assets/icons/remove-circle-outline.svg'),
    'arrow-back': require('../../assets/icons/arrow-back.svg'),
    'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
    'game-controller-outline': require('../../assets/icons/game-controller-outline.svg'),
    'receipt-outline': require('../../assets/icons/receipt-outline.svg'),
    'briefcase-outline': require('../../assets/icons/briefcase-outline.svg'),
    'laptop-outline': require('../../assets/icons/laptop-outline.svg'),
    'trending-up-outline': require('../../assets/icons/trending-up-outline.svg'),
    'gift-outline': require('../../assets/icons/gift-outline.svg'),
    'checkmark': require('../../assets/icons/checkmark.svg'),
    'wallet-outline': require('../../assets/icons/wallet-outline.svg'),
    'cart-outline': require('../../assets/icons/cart-outline.svg'),
    'car-outline': require('../../assets/icons/car-outline.svg'),
    'home-outline': require('../../assets/icons/home-outline.svg'),
    'restaurant-outline': require('../../assets/icons/restaurant-outline.svg'),
    'medical-outline': require('../../assets/icons/medical-outline.svg'),
    'bus-outline': require('../../assets/icons/bus-outline.svg'),
    'airplane-outline': require('../../assets/icons/airplane-outline.svg'),
  };

  useEffect(() => {
    // Separar categorías por tipo
    const expenses = categories.filter(cat => cat.type === 'GASTO');
    const incomes = categories.filter(cat => cat.type === 'INGRESO');
    
    setExpenseCategories(expenses);
    setIncomeCategories(incomes);
  }, [categories]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCreateCategory = (type: 'GASTO' | 'INGRESO') => {
    router.push({
      pathname: '/(drawer)/create-category',
      params: { type, returnPath: '/(drawer)/categorias' }
    });
  };

  const handleEditCategory = (category: any) => {
    router.push({
      pathname: '/(drawer)/create-category',
      params: {
        categoryId: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        isMonthlyExpense: String(!!category.isMonthlyExpense),
        monthlyAmount: category.monthlyAmount !== undefined && category.monthlyAmount !== null ? String(category.monthlyAmount) : '',
        returnPath: '/(drawer)/categorias',
      },
    });
  };

  const renderCategoryItem = (category: any, isLast: boolean = false) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem
      ]}
      onPress={() => handleEditCategory(category)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Image
          source={ICONS[category.icon] || ICONS['list-outline']}
          style={{ width: 24, height: 24, tintColor: colors.neutral.white }}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {category.isMonthlyExpense && category.monthlyAmount && (
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
            {category.monthlyAmount.toLocaleString('es-CO')} COP/mes
          </Text>
        )}
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {category.isMonthlyExpense && (
          <View style={{ backgroundColor: colors.primary[100], paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: 12, marginRight: spacing[2] }}>
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.primary[600], fontWeight: typography.fontWeight.semibold }}>Mensual</Text>
          </View>
        )}
        <Image
          source={ICONS['chevron-forward']}
          style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  const renderCategorySection = (title: string, categories: any[], type: 'GASTO' | 'INGRESO') => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>{categories.length} categorías</Text>
      </View>
      
      {categories.length > 0 ? (
        <View>
          {categories.map((category, index) => 
            renderCategoryItem(category, index === categories.length - 1)
          )}
          
          {/* Botón crear categoría */}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.component.cardPadding, backgroundColor: colors.neutral.gray[100], borderRadius: 12, marginTop: spacing[2] }}
            onPress={() => handleCreateCategory(type)}
          >
            <Image
              source={ICONS['add-circle-outline']}
              style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.primary[500], fontWeight: typography.fontWeight.semibold, marginLeft: spacing[2] }}>Crear nueva categoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={type === 'GASTO' ? ICONS['remove-circle-outline'] : ICONS['add-circle-outline']}
            style={{ width: 40, height: 40, tintColor: colors.text.tertiary }}
            resizeMode="contain"
          />
          <Text style={styles.emptyStateText}>
            No tienes categorías de {type.toLowerCase()} creadas
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: colors.primary[500], paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderRadius: 25 }}
            onPress={() => handleCreateCategory(type)}
          >
            <Text style={{ fontSize: typography.fontSize.base, color: colors.neutral.white, fontWeight: typography.fontWeight.semibold }}>
              Crear primera categoría
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
          
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Image
            source={ICONS['menu']}
            style={{ width: 35, height: 35, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Categorías</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Resumen de categorías */}
          <View style={{ backgroundColor: colors.neutral.gray[100], padding: spacing[4], borderRadius: 12, marginBottom: spacing[6] }}>
            <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, marginBottom: spacing[2] }}>Gestión de Categorías</Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, lineHeight: 20, marginBottom: spacing[4] }}>
              Organiza tus gastos e ingresos en categorías personalizadas
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.primary[500] }}>{expenseCategories.length}</Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>Gastos</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: colors.border.light, marginHorizontal: spacing[4] }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.primary[500] }}>{incomeCategories.length}</Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>Ingresos</Text>
              </View>
            </View>
          </View>

          {/* Sección GASTOS */}
          {renderCategorySection('GASTOS', expenseCategories, 'GASTO')}

          {/* Sección INGRESOS */}
          {renderCategorySection('INGRESOS', incomeCategories, 'INGRESO')}

          {/* Espacio inferior */}
          <View style={{ height: spacing[8] }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
