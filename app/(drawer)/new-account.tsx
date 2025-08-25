import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';

const CURRENCY_OPTIONS = [
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
];

const SYMBOL_OPTIONS = [
  '💰', '🏦', '💳', '💎', '🪙', '💵', '💸', '🎯', '📊', '⭐',
  '🔥', '💜', '❤️', '💚', '💙', '🧡', '💛', '🤍', '🖤', '🤎',
];

const COLOR_OPTIONS = [
  '#3A7691', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#FF9800', '#9C27B0', '#E91E63',
];

export default function NewAccount() {
  const navigation = useNavigation();
  const { addAccount } = useApp();
  const insets = useSafeAreaInsets();
  
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('💰');
  const [selectedColor, setSelectedColor] = useState('#3A7691');
  const [selectedCurrency, setSelectedCurrency] = useState('COP');
  const [includeInTotal, setIncludeInTotal] = useState(true);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!accountName.trim()) {
      Alert.alert('Error', 'El nombre de la cuenta es obligatorio');
      return false;
    }
    
    const balance = parseFloat(initialBalance) || 0;
    if (balance < 0) {
      Alert.alert('Error', 'El balance inicial no puede ser negativo');
      return false;
    }

    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      await addAccount({
        name: accountName.trim(),
        balance: parseFloat(initialBalance) || 0,
        currency: selectedCurrency,
        symbol: selectedSymbol,
        color: selectedColor,
        includeInTotal: includeInTotal,
      });

      Alert.alert(
        'Éxito',
        'Cuenta creada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/(drawer)/cuentas');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(drawer)/cuentas');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nueva Cuenta</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Vista previa de la cuenta */}
          <View style={[styles.accountPreview, { backgroundColor: selectedColor }]}>
            <Text style={styles.previewSymbol}>{selectedSymbol}</Text>
            <Text style={styles.previewName}>
              {accountName || 'Nombre de cuenta'}
            </Text>
            <Text style={styles.previewBalance}>
              {parseFloat(initialBalance || '0').toLocaleString('es-CO')} {selectedCurrency}
            </Text>
          </View>

          {/* Campo nombre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre de cuenta *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: Cuenta Principal, Ahorros..."
              placeholderTextColor="#ADADAD"
              value={accountName}
              onChangeText={setAccountName}
              maxLength={30}
            />
          </View>

          {/* Campo balance inicial */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Balance inicial</Text>
            <View style={styles.balanceInputContainer}>
              <TextInput
                style={styles.balanceInput}
                placeholder="0"
                placeholderTextColor="#ADADAD"
                value={initialBalance}
                onChangeText={setInitialBalance}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={styles.currencyButton}
                onPress={() => setShowCurrencySelector(true)}
              >
                <Text style={styles.currencyButtonText}>{selectedCurrency}</Text>
                <Ionicons name="chevron-down" size={16} color="#3A7691" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Selector de símbolo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Símbolo *</Text>
            <View style={styles.symbolGrid}>
              {SYMBOL_OPTIONS.map((symbol, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.symbolOption,
                    selectedSymbol === symbol && styles.selectedSymbolOption
                  ]}
                  onPress={() => setSelectedSymbol(symbol)}
                >
                  <Text style={styles.symbolText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selector de color */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color *</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Checkbox incluir en total */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIncludeInTotal(!includeInTotal)}
            >
              <View style={[styles.checkbox, includeInTotal && styles.checkedCheckbox]}>
                {includeInTotal && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Incluir en balance total</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxDescription}>
              Si está habilitado, esta cuenta se incluirá en el cálculo del balance total
            </Text>
          </View>

        </ScrollView>

        {/* Botón Crear Cuenta */}
        <TouchableOpacity 
          style={[
            styles.createButton,
            (!accountName.trim() || isLoading) && styles.disabledButton
          ]}
          onPress={handleCreateAccount}
          disabled={!accountName.trim() || isLoading}
        >
          {isLoading ? (
            <Text style={styles.createButtonText}>Creando...</Text>
          ) : (
            <>
              <Text style={styles.createButtonText}>Crear Cuenta</Text>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Modal Selector de Divisa */}
      {showCurrencySelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.currencySelectorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Divisa</Text>
              <TouchableOpacity 
                onPress={() => setShowCurrencySelector(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.currencyList} showsVerticalScrollIndicator={false}>
              {CURRENCY_OPTIONS.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    selectedCurrency === currency.code && styles.selectedCurrencyItem
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency.code);
                    setShowCurrencySelector(false);
                  }}
                >
                  <View style={styles.currencyItemInfo}>
                    <Text style={styles.currencyItemCode}>{currency.code}</Text>
                    <Text style={styles.currencyItemName}>{currency.name}</Text>
                  </View>
                  {selectedCurrency === currency.code && (
                    <Ionicons name="checkmark-circle" size={24} color="#3A7691" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
    paddingHorizontal: 20,
  },
  accountPreview: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewSymbol: {
    fontSize: 32,
    marginBottom: 8,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  previewBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#30353D',
    backgroundColor: '#F8F9FA',
  },
  balanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#30353D',
    backgroundColor: '#F8F9FA',
    marginRight: 12,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A7691',
    marginRight: 4,
  },
  symbolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  symbolOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSymbolOption: {
    borderColor: '#3A7691',
    backgroundColor: '#E3F2FD',
  },
  symbolText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#30353D',
    borderWidth: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedCheckbox: {
    backgroundColor: '#3A7691',
    borderColor: '#3A7691',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#30353D',
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 36,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A7691',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#ADADAD',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySelectorModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '70%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#30353D',
  },
  closeButton: {
    padding: 4,
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  selectedCurrencyItem: {
    backgroundColor: '#F0F8FF',
  },
  currencyItemInfo: {
    flex: 1,
  },
  currencyItemCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  currencyItemName: {
    fontSize: 14,
    color: '#666666',
  },
});


