import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';

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
          style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
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
          style={{ width: 20, height: 20, tintColor: '#CCCCCC' }}
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
              style={{ width: 24, height: 24, tintColor: '#3A7691' }}
              resizeMode="contain"
            />
            <Text style={styles.createCategoryText}>Crear nueva categoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCategorySection}>
          <Image
            source={type === 'GASTO' ? ICONS['remove-circle-outline'] : ICONS['add-circle-outline']}
            style={{ width: 40, height: 40, tintColor: '#CCCCCC' }}
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
        <ActivityIndicator size="large" color="#3A7691" />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Image
            source={ICONS['menu']}
            style={{ width: 35, height: 35, tintColor: '#FFFFFF' }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#30353D',
  },
  statusBarArea: {
    backgroundColor: '#30353D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#30353D',
    borderBottomWidth: 1,
    borderBottomColor: '#101215',
  },
  menuButton: {
    padding: 5,
    width: 38,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 38,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
  },
  summarySection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30353D',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A7691',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30353D',
  },
  sectionCount: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  categoryItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  monthlyAmount: {
    fontSize: 12,
    color: '#3A7691',
    fontWeight: '500',
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthlyBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  monthlyBadgeText: {
    fontSize: 10,
    color: '#3A7691',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  createCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    gap: 8,
  },
  createCategoryText: {
    fontSize: 14,
    color: '#3A7691',
    fontWeight: '600',
  },
  emptyCategorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  createFirstCategoryButton: {
    backgroundColor: '#3A7691',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createFirstCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpace: {
    height: 30,
  },
});

