import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import styles from '@/src/shared/styles/components/categorias';
import colors from '../../src/shared/styles/themes';
import { lighten } from 'polished';

export default function Categorias() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { categories, isLoading } = useApp();
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
        styles.categoryItem,
        !isLast && styles.categoryItemBorder
      ]}
      onPress={() => handleEditCategory(category)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Image
          source={ICONS[category.icon] || ICONS['list-outline']}
          style={{ width: 24, height: 24, tintColor: colors.white }}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {category.isMonthlyExpense && category.monthlyAmount && (
          <Text style={styles.monthlyAmount}>
            {category.monthlyAmount.toLocaleString('es-CO')} COP/mes
          </Text>
        )}
      </View>
      
      <View style={styles.categoryActions}>
        {category.isMonthlyExpense && (
          <View style={styles.monthlyBadge}>
            <Text style={styles.monthlyBadgeText}>Mensual</Text>
          </View>
        )}
        <Image
          source={ICONS['chevron-forward']}
          style={{ width: 20, height: 20, tintColor: colors.gray }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  const renderCategorySection = (title: string, categories: any[], type: 'GASTO' | 'INGRESO') => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{categories.length} categorías</Text>
      </View>
      
      {categories.length > 0 ? (
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => 
            renderCategoryItem(category, index === categories.length - 1)
          )}
          
          {/* Botón crear categoría */}
          <TouchableOpacity
            style={styles.createCategoryButton}
            onPress={() => handleCreateCategory(type)}
          >
            <Image
              source={ICONS['add-circle-outline']}
              style={{ width: 24, height: 24, tintColor: colors.primary }}
              resizeMode="contain"
            />
            <Text style={styles.createCategoryText}>Crear nueva categoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCategorySection}>
          <Image
            source={type === 'GASTO' ? ICONS['remove-circle-outline'] : ICONS['add-circle-outline']}
            style={{ width: 40, height: 40, tintColor: colors.gray }}
            resizeMode="contain"
          />
          <Text style={styles.emptyCategoryText}>
            No tienes categorías de {type.toLowerCase()} creadas
          </Text>
          <TouchableOpacity
            style={styles.createFirstCategoryButton}
            onPress={() => handleCreateCategory(type)}
          >
            <Text style={styles.createFirstCategoryText}>
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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.grayDark} />
          
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Image
            source={ICONS['menu']}
            style={{ width: 35, height: 35, tintColor: colors.white }}
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
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Gestión de Categorías</Text>
            <Text style={styles.summaryText}>
              Organiza tus gastos e ingresos en categorías personalizadas
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{expenseCategories.length}</Text>
                <Text style={styles.statLabel}>Gastos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{incomeCategories.length}</Text>
                <Text style={styles.statLabel}>Ingresos</Text>
              </View>
            </View>
          </View>

          {/* Sección GASTOS */}
          {renderCategorySection('GASTOS', expenseCategories, 'GASTO')}

          {/* Sección INGRESOS */}
          {renderCategorySection('INGRESOS', incomeCategories, 'INGRESO')}

          {/* Espacio inferior */}
          <View style={styles.bottomSpace} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}