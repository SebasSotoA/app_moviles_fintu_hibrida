import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';

const ICONS = [
  'wallet-outline',
  'cart-outline',
  'car-outline',
  'home-outline',
  'restaurant-outline',
  'medical-outline',
  'bus-outline',
  'airplane-outline'
];

const COLORS = ['#FF6B6B', '#4CAF50', '#3A7691', '#FF9F43', '#845EC2', '#30353D'];

export default function CreateCategory() {
  const { addCategory } = useApp();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [type, setType] = useState(params.type as 'GASTO' | 'INGRESO' || 'GASTO');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [monthlyExpense, setMonthlyExpense] = useState(false);
  const [monthlyAmount, setMonthlyAmount] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es requerido');
      return;
    }

    try {
      const newCategory = {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type,
        isMonthlyExpense: monthlyExpense,
        monthlyAmount: monthlyExpense && monthlyAmount ? parseFloat(monthlyAmount) : undefined,
      };

      await addCategory(newCategory);
      
      // Instead of router.back(), explicitly navigate to choose-category
      router.replace({
        pathname: '/(drawer)/choose-category',
        params: {
          type: params.type,
          amount: params.amount,
          date: params.date,
          note: params.note,
          accountId: params.accountId
        }
      });

    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'No se pudo crear la categoría');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Crear Categoría</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre de la categoría"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'GASTO' && styles.activeToggleButton]}
                onPress={() => setType('GASTO')}
              >
                <Text style={[styles.toggleText, type === 'GASTO' && styles.activeToggleText]}>
                  GASTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'INGRESO' && styles.activeToggleButton]}
                onPress={() => setType('INGRESO')}
              >
                <Text style={[styles.toggleText, type === 'INGRESO' && styles.activeToggleText]}>
                  INGRESO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ícono</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconList}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconButton, selectedIcon === icon && styles.selectedIconButton]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons 
                    name={icon as any} 
                    size={24} 
                    color={selectedIcon === icon ? '#FFFFFF' : '#30353D'} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorButton, { backgroundColor: color }]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {type === 'GASTO' && (
            <View style={styles.section}>
              <View style={styles.monthlyExpenseHeader}>
                <Text style={styles.sectionTitle}>Gasto programado</Text>
                <TouchableOpacity
                  style={[styles.switch, monthlyExpense && styles.switchActive]}
                  onPress={() => setMonthlyExpense(!monthlyExpense)}
                >
                  <View style={[styles.switchKnob, monthlyExpense && styles.switchKnobActive]} />
                </TouchableOpacity>
              </View>
              
              {monthlyExpense && (
                <TextInput
                  style={styles.input}
                  value={monthlyAmount}
                  onChangeText={setMonthlyAmount}
                  placeholder="Monto mensual"
                  keyboardType="numeric"
                />
              )}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.createButton, !name && styles.disabledButton]}
          onPress={handleCreate}
          disabled={!name}
        >
          <Text style={styles.createButtonText}>Crear Categoría</Text>
        </TouchableOpacity>
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
  backButton: {
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
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeToggleButton: {
    backgroundColor: '#3A7691',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  iconList: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedIconButton: {
    backgroundColor: '#3A7691',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthlyExpenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switch: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: '#E9ECEF',
    padding: 3,
  },
  switchActive: {
    backgroundColor: '#3A7691',
  },
  switchKnob: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFFFFF',
  },
  switchKnobActive: {
    transform: [{ translateX: 20 }],
  },
  createButton: {
    backgroundColor: '#3A7691',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#ADADAD',
  },
});