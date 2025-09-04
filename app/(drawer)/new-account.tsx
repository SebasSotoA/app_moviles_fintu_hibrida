import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import styles from '@/src/shared/styles/components/new-account';
import colors from '../../src/shared/styles/themes';

// Mapa de íconos locales usando los mismos nombres de Ionicons
const ICONS: Record<string, any> = {
  'arrow-back': require('../../assets/icons/arrow-back.svg'),
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'checkmark': require('../../assets/icons/checkmark.svg'),
  'add': require('../../assets/icons/add.svg'),
  'close': require('../../assets/icons/close.svg'),
  'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
};

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
  // Traer funciones desde el AppProvider, contexto de la aplicación.
  const { addAccount, accounts } = useApp();

  // Obtener paddings para una pantalla de celular.
  const insets = useSafeAreaInsets();
  
  const params = useLocalSearchParams();
  
  // Inicialización de estados para el formulario
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('💰');
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [selectedCurrency, setSelectedCurrency] = useState('COP');
  const [includeInTotal, setIncludeInTotal] = useState(true);

  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Alerta multiplataforma.
  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const validateForm = () => {
    if (!accountName.trim()) {
      showAlert('Error', 'El nombre de la cuenta es obligatorio');
      return false;
    }
    
    const balance = parseFloat(initialBalance) || 0;
    if (balance < 0) {
      showAlert('Error', 'El balance inicial no puede ser negativo');
      return false;
    }

    // Duplicate name (case-insensitive)
    const normalizedName = accountName.trim().toLowerCase();
    const nameExists = accounts.some(a => a.name.trim().toLowerCase() === normalizedName);
    if (nameExists) {
      showAlert('Nombre duplicado', 'Ya existe una cuenta con ese nombre. Usa otro nombre.');
      return false;
    }

    // Duplicate emoji/symbol exact match
    const symbolExists = accounts.some(a => a.symbol === selectedSymbol);
    if (symbolExists) {
      showAlert('Símbolo duplicado', 'Ese emoji ya está en uso por otra cuenta. Elige otro.');
      return false;
    }

    return true;
  };

  const resetForm = useCallback(() => {
    setAccountName('');
    setInitialBalance('');
    setSelectedSymbol('💰');
    setSelectedColor(colors.primary);
    setSelectedCurrency('COP');
    setIncludeInTotal(true);
    setShowCurrencySelector(false);
    setIsLoading(false);
  }, []);

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

      resetForm();

      // Navegar según returnPath si viene definido; si no, a cuentas
      const returnPath = params.returnPath as string | undefined;
      if (returnPath) {
        if (returnPath === '/(drawer)') {
          router.replace({ pathname: returnPath, params: { accountCreated: 'true' } });
        } else {
          router.replace({ pathname: returnPath });
        }
      } else {
        router.replace('/(drawer)/cuentas');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      if (error instanceof Error) {
        if (error.message === 'DUPLICATE_ACCOUNT_NAME') {
          showAlert('Nombre duplicado', 'Ya existe una cuenta con ese nombre. Usa otro nombre.');
        } else if (error.message === 'DUPLICATE_ACCOUNT_SYMBOL') {
          showAlert('Símbolo duplicado', 'Ese emoji ya está en uso por otra cuenta. Elige otro.');
        } else {
          showAlert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
        }
      } else {
        showAlert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
      }
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
              placeholderTextColor={colors.gray}
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
                placeholderTextColor={colors.gray}
                value={initialBalance}
                onChangeText={setInitialBalance}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={styles.currencyButton}
                onPress={() => setShowCurrencySelector(true)}
              >
                <Text style={styles.currencyButtonText}>{selectedCurrency}</Text>
                <Image
                  source={ICONS['chevron-down']}
                  style={{ width: 16, height: 16, tintColor: colors.primary }}
                  resizeMode="contain"
                />
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
                    <Image
                      source={ICONS['checkmark']}
                      style={{ width: 20, height: 20, tintColor: colors.white }}
                      resizeMode="contain"
                    />
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
                  <Image
                    source={ICONS['checkmark']}
                    style={{ width: 16, height: 16, tintColor: colors.white }}
                    resizeMode="contain"
                  />
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
              <Image
                source={ICONS['add']}
                style={{ width: 20, height: 20, tintColor: colors.white }}
                resizeMode="contain"
              />
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
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: colors.gray }}
                  resizeMode="contain"
                />
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
                    <Image
                      source={ICONS['checkmark-circle']}
                      style={{ width: 24, height: 24, tintColor: colors.gray }}
                      resizeMode="contain"
                    />
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