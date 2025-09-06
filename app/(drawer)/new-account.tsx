import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import { useStyles } from '../../src/shared/hooks';
import { headerStyles } from '../../src/shared/styles/components';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';


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
  '#e0bb38', '#DDA0DD', '#FF9800', '#9C27B0', '#E91E63',
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
  const [selectedColor, setSelectedColor] = useState(colors.primary[500]);
  const [selectedCurrency, setSelectedCurrency] = useState('COP');
  const [includeInTotal, setIncludeInTotal] = useState(true);

  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const styles = useStyles(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    statusBarArea: {
      backgroundColor: colors.background.dark,
    },
    header: headerStyles.standard,
    backButton: headerStyles.actionButton,
    headerCenter: headerStyles.center,
    headerTitle: headerStyles.title,
    placeholder: headerStyles.placeholder,
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      padding: spacing[4],
    },
    accountPreview: {
      alignItems: 'center',
      padding: spacing[6],
      borderRadius: 16,
      marginBottom: spacing[6],
    },
    previewSymbol: {
      fontSize: typography.fontSize['4xl'],
      marginBottom: spacing[2],
    },
    previewName: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
      marginBottom: spacing[1],
    },
    previewBalance: {
      fontSize: typography.fontSize.base,
      color: colors.neutral.white,
    },
    section: {
      marginBottom: spacing[6],
    },
    sectionTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.secondary,
      marginBottom: spacing[2],
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 12,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      fontSize: typography.fontSize.base,
      backgroundColor: colors.neutral.white,
    },
    balanceInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    balanceInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 12,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      fontSize: typography.fontSize.base,
      backgroundColor: colors.neutral.white,
    },
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 12,
      backgroundColor: colors.neutral.white,
      gap: spacing[2],
    },
    currencyButtonText: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
    },
    symbolGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      alignContent: 'center',
      justifyContent: 'space-between',
    },
    symbolOption: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border.light,
    },
    selectedSymbolOption: {
      borderColor: colors.primary[500],
      backgroundColor: colors.primary[50],
    },
    symbolText: {
      fontSize: typography.fontSize.lg,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border.light,
    },
    selectedColorOption: {
      borderColor: colors.neutral.black,
      borderWidth: 3,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.border.light,
      marginRight: spacing[2],
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkedCheckbox: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    checkboxLabel: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
    },
    checkboxDescription: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    createButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      borderRadius: 25,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing[2],
      marginHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    disabledButton: {
      backgroundColor: colors.text.tertiary,
    },
    createButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
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
      backgroundColor: colors.neutral.white,
      borderRadius: 20,
      margin: spacing[4],
      maxHeight: '80%',
      width: '90%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    closeButton: {
      padding: spacing[2],
    },
    currencyList: {
      maxHeight: 300,
    },
    currencyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    selectedCurrencyItem: {
      backgroundColor: colors.primary[50],
    },
    currencyCode: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.primary,
      marginRight: spacing[2],
    },
    currencyName: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    currencyItemInfo: {
      flex: 1,
    },
    currencyItemCode: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.primary,
      marginRight: spacing[2],
    },
    currencyItemName: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
  }));

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
    setSelectedColor(colors.primary[500]);
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
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
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
              placeholderTextColor={colors.text.tertiary}
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
                placeholderTextColor={colors.text.tertiary}
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
                  style={{ width: 16, height: 16, tintColor: colors.primary[500] }}
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
                  onPress={() => setSelectedColor(color as any)}
                >
                  {selectedColor === color && (
                    <Image
                      source={ICONS['checkmark']}
                      style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
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
                    style={{ width: 16, height: 16, tintColor: colors.neutral.white }}
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
                style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
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
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
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
                      style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
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
