import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
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
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useApp } from "../../src/shared/context/AppProvider";
import { newAccountStyles } from "../../src/shared/styles/components/new-account";
import { colors } from "../../src/shared/styles/tokens";

// Mapa de íconos locales usando los mismos nombres de Ionicons
const ICONS: Record<string, any> = {
  "arrow-back": require("../../assets/icons/arrow-back.svg"),
  "chevron-down": require("../../assets/icons/chevron-down.svg"),
  checkmark: require("../../assets/icons/checkmark.svg"),
  add: require("../../assets/icons/add.svg"),
  close: require("../../assets/icons/close.svg"),
  "checkmark-circle": require("../../assets/icons/checkmark-circle.svg"),
};

const CURRENCY_OPTIONS = [
  { code: "COP", name: "Peso Colombiano", symbol: "$" },
  { code: "USD", name: "Dólar Americano", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "MXN", name: "Peso Mexicano", symbol: "$" },
  { code: "ARS", name: "Peso Argentino", symbol: "$" },
];

const SYMBOL_OPTIONS = [
  "💰",
  "🏦",
  "💳",
  "💎",
  "🪙",
  "💵",
  "💸",
  "🎯",
  "📊",
  "⭐",
  "🔥",
  "💜",
  "❤️",
  "💚",
  "💙",
  "🧡",
  "💛",
  "🤍",
  "🖤",
  "🤎",
];

const COLOR_OPTIONS = [
  "#3A7691",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#e0bb38",
  "#DDA0DD",
  "#FF9800",
  "#9C27B0",
  "#E91E63",
];

export default function NewAccount() {
  // Traer funciones desde el AppProvider, contexto de la aplicación.
  const { addAccount, accounts } = useApp();

  // Obtener paddings para una pantalla de celular.
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams();

  // Inicialización de estados para el formulario
  const [accountName, setAccountName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("💰");
  const [selectedColor, setSelectedColor] = useState(colors.primary[500]);
  const [selectedCurrency, setSelectedCurrency] = useState("COP");
  const [includeInTotal, setIncludeInTotal] = useState(true);

  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Alerta multiplataforma.
  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const validateForm = () => {
    if (!accountName.trim()) {
      showAlert("Error", "El nombre de la cuenta es obligatorio");
      return false;
    }

    const balance = parseFloat(initialBalance) || 0;
    if (balance < 0) {
      showAlert("Error", "El balance inicial no puede ser negativo");
      return false;
    }

    // Duplicate name (case-insensitive)
    const normalizedName = accountName.trim().toLowerCase();
    const nameExists = accounts.some(
      (a) => a.name.trim().toLowerCase() === normalizedName,
    );
    if (nameExists) {
      showAlert(
        "Nombre duplicado",
        "Ya existe una cuenta con ese nombre. Usa otro nombre.",
      );
      return false;
    }

    // Duplicate emoji/symbol exact match
    const symbolExists = accounts.some((a) => a.symbol === selectedSymbol);
    if (symbolExists) {
      showAlert(
        "Símbolo duplicado",
        "Ese emoji ya está en uso por otra cuenta. Elige otro.",
      );
      return false;
    }

    return true;
  };

  const resetForm = useCallback(() => {
    setAccountName("");
    setInitialBalance("");
    setSelectedSymbol("💰");
    setSelectedColor(colors.primary[500]);
    setSelectedCurrency("COP");
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
        if (returnPath === "/(drawer)") {
          router.replace({
            pathname: returnPath,
            params: { accountCreated: "true" },
          });
        } else {
          router.replace({ pathname: returnPath });
        }
      } else {
        router.replace("/(drawer)/accounts");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      if (error instanceof Error) {
        if (error.message === "DUPLICATE_ACCOUNT_NAME") {
          showAlert(
            "Nombre duplicado",
            "Ya existe una cuenta con ese nombre. Usa otro nombre.",
          );
        } else if (error.message === "DUPLICATE_ACCOUNT_SYMBOL") {
          showAlert(
            "Símbolo duplicado",
            "Ese emoji ya está en uso por otra cuenta. Elige otro.",
          );
        } else {
          showAlert("Error", "No se pudo crear la cuenta. Intenta nuevamente.");
        }
      } else {
        showAlert("Error", "No se pudo crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    const returnPath = params.returnPath as string | undefined;
    if (returnPath) {
      router.push({ pathname: returnPath });
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(drawer)/accounts");
    }
  };

  return (
    <View style={newAccountStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View style={[newAccountStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={newAccountStyles.header}>
        <TouchableOpacity onPress={goBack} style={newAccountStyles.backButton}>
          <Image
            source={ICONS["arrow-back"]}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={newAccountStyles.headerCenter}>
          <Text style={newAccountStyles.headerTitle}>Nueva Cuenta</Text>
        </View>
        <View style={newAccountStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={newAccountStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={newAccountStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Vista previa de la cuenta */}
          <View
            style={[
              newAccountStyles.accountPreview,
              { backgroundColor: selectedColor },
            ]}
          >
            <Text style={newAccountStyles.previewSymbol}>{selectedSymbol}</Text>
            <Text style={newAccountStyles.previewName}>
              {accountName || "Nombre de cuenta"}
            </Text>
            <Text style={newAccountStyles.previewBalance}>
              {parseFloat(initialBalance || "0").toLocaleString("es-CO")}{" "}
              {selectedCurrency}
            </Text>
          </View>

          {/* Campo nombre */}
          <View style={newAccountStyles.section}>
            <Text style={newAccountStyles.sectionTitle}>
              Nombre de cuenta *
            </Text>
            <TextInput
              style={newAccountStyles.textInput}
              placeholder="Ej: Cuenta Principal, Ahorros..."
              placeholderTextColor={colors.text.tertiary}
              value={accountName}
              onChangeText={setAccountName}
              maxLength={30}
            />
          </View>

          {/* Campo balance inicial */}
          <View style={newAccountStyles.section}>
            <Text style={newAccountStyles.sectionTitle}>Balance inicial</Text>
            <View style={newAccountStyles.balanceInputContainer}>
              <TextInput
                style={newAccountStyles.balanceInput}
                placeholder="0"
                placeholderTextColor={colors.text.tertiary}
                value={initialBalance}
                onChangeText={setInitialBalance}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={newAccountStyles.currencyButton}
                onPress={() => setShowCurrencySelector(true)}
              >
                <Text style={newAccountStyles.currencyButtonText}>
                  {selectedCurrency}
                </Text>
                <Image
                  source={ICONS["chevron-down"]}
                  style={{
                    width: 16,
                    height: 16,
                    tintColor: colors.primary[500],
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Selector de símbolo */}
          <View style={newAccountStyles.section}>
            <Text style={newAccountStyles.sectionTitle}>Símbolo *</Text>
            <View style={newAccountStyles.symbolGrid}>
              {SYMBOL_OPTIONS.map((symbol, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    newAccountStyles.symbolOption,
                    selectedSymbol === symbol &&
                      newAccountStyles.selectedSymbolOption,
                  ]}
                  onPress={() => setSelectedSymbol(symbol)}
                >
                  <Text style={newAccountStyles.symbolText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selector de color */}
          <View style={newAccountStyles.section}>
            <Text style={newAccountStyles.sectionTitle}>Color *</Text>
            <View style={newAccountStyles.colorGrid}>
              {COLOR_OPTIONS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    newAccountStyles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color &&
                      newAccountStyles.selectedColorOption,
                  ]}
                  onPress={() => setSelectedColor(color as any)}
                >
                  {selectedColor === color && (
                    <Image
                      source={ICONS["checkmark"]}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: colors.neutral.white,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Checkbox incluir en total */}
          <View style={newAccountStyles.section}>
            <TouchableOpacity
              style={newAccountStyles.checkboxContainer}
              onPress={() => setIncludeInTotal(!includeInTotal)}
            >
              <View
                style={[
                  newAccountStyles.checkbox,
                  includeInTotal && newAccountStyles.checkedCheckbox,
                ]}
              >
                {includeInTotal && (
                  <Image
                    source={ICONS["checkmark"]}
                    style={{
                      width: 16,
                      height: 16,
                      tintColor: colors.neutral.white,
                    }}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text style={newAccountStyles.checkboxLabel}>
                Incluir en balance total
              </Text>
            </TouchableOpacity>
            <Text style={newAccountStyles.checkboxDescription}>
              Si está habilitado, esta cuenta se incluirá en el cálculo del
              balance total
            </Text>
          </View>
        </ScrollView>

        {/* Botón Crear Cuenta */}
        <TouchableOpacity
          style={[
            newAccountStyles.createButton,
            (!accountName.trim() || isLoading) &&
              newAccountStyles.disabledButton,
          ]}
          onPress={handleCreateAccount}
          disabled={!accountName.trim() || isLoading}
        >
          {isLoading ? (
            <Text style={newAccountStyles.createButtonText}>Creando...</Text>
          ) : (
            <>
              <Text style={newAccountStyles.createButtonText}>
                Crear Cuenta
              </Text>
              <Image
                source={ICONS["add"]}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: colors.neutral.white,
                }}
                resizeMode="contain"
              />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Modal Selector de Divisa */}
      {showCurrencySelector && (
        <View style={newAccountStyles.modalOverlay}>
          <View style={newAccountStyles.currencySelectorModal}>
            <View style={newAccountStyles.modalHeader}>
              <Text style={newAccountStyles.modalTitle}>
                Seleccionar Divisa
              </Text>
              <TouchableOpacity
                onPress={() => setShowCurrencySelector(false)}
                style={newAccountStyles.closeButton}
              >
                <Image
                  source={ICONS["close"]}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: colors.text.tertiary,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={newAccountStyles.currencyList}
              showsVerticalScrollIndicator={false}
            >
              {CURRENCY_OPTIONS.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    newAccountStyles.currencyItem,
                    selectedCurrency === currency.code &&
                      newAccountStyles.selectedCurrencyItem,
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency.code);
                    setShowCurrencySelector(false);
                  }}
                >
                  <View style={newAccountStyles.currencyItemInfo}>
                    <Text style={newAccountStyles.currencyItemCode}>
                      {currency.code}
                    </Text>
                    <Text style={newAccountStyles.currencyItemName}>
                      {currency.name}
                    </Text>
                  </View>
                  {selectedCurrency === currency.code && (
                    <Image
                      source={ICONS["checkmark-circle"]}
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: colors.text.tertiary,
                      }}
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
