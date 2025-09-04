import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { TransactionType } from '../../types/transaction';
import globalStyles from '../../src/shared/styles/globalStyles';
import colors from '../../src/shared/styles/themes';

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
        styles.categoryItem,
        selectedCategory === category.id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Image
          source={ICONS[category.icon as string]}
          style={{ width: 28, height: 28, tintColor: colors.white }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
      {selectedCategory === category.id && (
        <Image
          source={ICONS['checkmark-circle']}
          style={{ width: 24, height: 24, tintColor: colors.primary }}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.grayDark} />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 28, height: 28, tintColor: colors.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Elegir Categoría de {transactionType === 'GASTO' ? 'Gasto' : 'Ingreso'}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        {/* Resumen de la transacción */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tipo:</Text>
            <Text style={[
              styles.summaryValue,
              { color: transactionType === 'GASTO' ? colors.error : colors.success }
            ]}>
              {transactionType}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monto:</Text>
            <Text style={styles.summaryValue}>
              {parseFloat(amount).toLocaleString('es-CO')} {currentAccount?.currency || 'COP'}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Título de sección */}
          <Text style={styles.sectionTitle}>
            Selecciona una categoría:
          </Text>

          {/* Grid de categorías */}
          <View style={styles.categoriesGrid}>
            {filteredCategories.map(renderCategoryItem)}
          </View>

          {/* Opción de crear nueva categoría */}
          <TouchableOpacity 
            style={styles.createCategoryButton}
            onPress={handleCreateCategory}
          >
            <Image
              source={ICONS['add-circle-outline']}
              style={{ width: 24, height: 24, tintColor: colors.primary }}
              resizeMode="contain"
            />
            <Text style={styles.createCategoryText}>Crear Nueva Categoría</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Botón Confirmar */}
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            (!selectedCategory || isLoading) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedCategory || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Text style={[
                styles.confirmButtonText,
                (!selectedCategory || isLoading) && styles.disabledButtonText
              ]}>
                Confirmar
              </Text>
              <Image
                source={ICONS['checkmark']}
                style={{ width: 20, height: 20, tintColor: colors.white }}
                resizeMode="contain"
              />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = { ...globalStyles, ...StyleSheet.create({
  summaryContainer: {
    backgroundColor: colors.notCompletelyLightGray,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.grayMedium,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: colors.grayDark,
    fontWeight: '600',
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.notCompletelyLightGray,
    marginBottom: 8,
  },
  selectedCategoryItem: {
    borderColor: colors.primary,
    backgroundColor: colors.tertiary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
}) 
};