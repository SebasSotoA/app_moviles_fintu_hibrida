import { transferStyles } from "@/src/shared/styles/components/transfer";
import { colors } from "@/src/shared/styles/tokens";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import type { DatabaseAccount } from "../../src/shared/services/database";

// Mapa de íconos locales con nombres exactos de Ionicons
const ICONS: Record<string, any> = {
  "arrow-back": require("../../assets/icons/arrow-back.svg"),
  "arrow-forward": require("../../assets/icons/arrow-forward.svg"),
  "chevron-down": require("../../assets/icons/chevron-down.svg"),
  send: require("../../assets/icons/send.svg"),
  close: require("../../assets/icons/close.svg"),
  "checkmark-circle": require("../../assets/icons/checkmark-circle.svg"),
};

export default function Transfer() {
  const { accounts, currentAccount, refreshData } = useApp();
  const insets = useSafeAreaInsets();

  const [fromAccount, setFromAccount] = useState<DatabaseAccount | null>(
    currentAccount ?? null,
  );
  const [toAccount, setToAccount] = useState<DatabaseAccount | null>(null);
  const [amount, setAmount] = useState("");
  const [showFromAccountSelector, setShowFromAccountSelector] = useState(false);
  const [showToAccountSelector, setShowToAccountSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Derivados para validación visual
  const parsedAmount = parseFloat(amount) || 0;
  const isOverBalance = !!fromAccount && parsedAmount > fromAccount.balance;
  // Nota: la validación de misma divisa se hace en validateTransfer y en el listado de destino

  // Sincronizar cuenta de origen cuando cambie la cuenta actual
  useEffect(() => {
    if (currentAccount) {
      setFromAccount(currentAccount);
    }
  }, [currentAccount]);

  // Filtrar cuentas disponibles para transferir
  const getAvailableToAccounts = () => {
    return accounts.filter((account) => account.id !== fromAccount?.id);
  };

  const getAvailableFromAccounts = () => {
    return accounts.filter((account) => account.id !== toAccount?.id);
  };

  const validateTransfer = () => {
    if (!fromAccount) {
      Alert.alert("Error", "Selecciona una cuenta de origen");
      return false;
    }

    if (!toAccount) {
      Alert.alert("Error", "Selecciona una cuenta de destino");
      return false;
    }

    if (fromAccount.currency !== toAccount.currency) {
      Alert.alert(
        "Error",
        "Solo puedes transferir entre cuentas de la misma divisa",
      );
      return false;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert("Error", "Ingresa un monto válido mayor a 0");
      return false;
    }

    if (transferAmount > fromAccount.balance) {
      Alert.alert("Error", "Saldo insuficiente en la cuenta de origen");
      return false;
    }

    if (fromAccount.id === toAccount.id) {
      Alert.alert("Error", "No puedes transferir a la misma cuenta");
      return false;
    }

    return true;
  };

  const resetTransferForm = () => {
    setAmount("");
    setToAccount(null);
    setShowFromAccountSelector(false);
    setShowToAccountSelector(false);
    setIsLoading(false);
  };

  const performTransfer = async () => {
    try {
      setIsLoading(true);

      // Crear transferencia usando el servicio de base de datos
      const { databaseService } = await import(
        "../../src/shared/services/database"
      );

      const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await databaseService.createTransfer({
        id: transferId,
        fromAccountId: fromAccount!.id,
        toAccountId: toAccount!.id,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
      });

      // Refrescar datos
      await refreshData();

      const successMsg = `Se transfirieron ${parseFloat(amount).toLocaleString("es-CO")} ${fromAccount!.currency} de ${fromAccount!.name} a ${toAccount!.name}`;

      // Limpiar formulario antes de navegar
      resetTransferForm();
      if (Platform.OS === "web") {
        // En web, Alert no soporta callbacks; usamos window.alert y navegamos inmediatamente
        window.alert(`Transferencia Exitosa\n\n${successMsg}`);
        router.replace("/(drawer)/accounts");
      } else {
        Alert.alert("Transferencia Exitosa", successMsg, [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(drawer)/accounts");
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating transfer:", error);
      Alert.alert(
        "Error",
        "No se pudo realizar la transferencia. Intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = () => {
    if (!validateTransfer()) return;
    setShowConfirm(true);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(drawer)/accounts");
    }
  };

  return (
    <View style={transferStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View style={[transferStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={transferStyles.header}>
        <TouchableOpacity onPress={goBack} style={transferStyles.backButton}>
          <Image
            source={ICONS["arrow-back"]}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={transferStyles.headerCenter}>
          <Text style={transferStyles.headerTitle}>Transferir</Text>
        </View>
        <View style={transferStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={transferStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={transferStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Resumen de transferencia */}
          <View style={transferStyles.summaryCard}>
            <View style={transferStyles.transferFlow}>
              <View style={transferStyles.accountSummary}>
                <Text style={transferStyles.accountSummarySymbol}>
                  {fromAccount?.symbol || "💰"}
                </Text>
                <Text style={transferStyles.accountSummaryName}>
                  {fromAccount?.name || "Cuenta origen"}
                </Text>
                <Text style={transferStyles.accountSummaryBalance}>
                  {fromAccount?.balance?.toLocaleString("es-CO") || "0"}{" "}
                  {fromAccount?.currency || "COP"}
                </Text>
              </View>

              <View style={transferStyles.transferArrow}>
                <Image
                  source={ICONS["arrow-forward"]}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: colors.primary[500],
                  }}
                  resizeMode="contain"
                />
              </View>

              <View style={transferStyles.accountSummary}>
                <Text style={transferStyles.accountSummarySymbol}>
                  {toAccount?.symbol || "💼"}
                </Text>
                <Text style={transferStyles.accountSummaryName}>
                  {toAccount?.name || "Cuenta destino"}
                </Text>
                <Text style={transferStyles.accountSummaryBalance}>
                  {toAccount?.balance?.toLocaleString("es-CO") || "0"}{" "}
                  {toAccount?.currency || "COP"}
                </Text>
              </View>
            </View>

            {parseFloat(amount) > 0 && (
              <View style={transferStyles.transferAmount}>
                <Text style={transferStyles.transferAmountLabel}>
                  Monto a transferir
                </Text>
                <Text style={transferStyles.transferAmountValue}>
                  {parseFloat(amount).toLocaleString("es-CO")}{" "}
                  {fromAccount?.currency || "COP"}
                </Text>
              </View>
            )}
          </View>

          {/* Selector de cuenta de origen */}
          <View style={transferStyles.section}>
            <Text style={transferStyles.sectionTitle}>Desde</Text>
            <TouchableOpacity
              style={transferStyles.accountSelector}
              onPress={() => setShowFromAccountSelector(true)}
            >
              <View style={transferStyles.accountSelectorLeft}>
                <Text style={transferStyles.accountSelectorSymbol}>
                  {fromAccount?.symbol || "💰"}
                </Text>
                <View style={transferStyles.accountSelectorInfo}>
                  <Text style={transferStyles.accountSelectorName}>
                    {fromAccount?.name || "Seleccionar cuenta de origen"}
                  </Text>
                  <Text style={transferStyles.accountSelectorBalance}>
                    Balance:{" "}
                    {fromAccount?.balance?.toLocaleString("es-CO") || "0"}{" "}
                    {fromAccount?.currency || "COP"}
                  </Text>
                </View>
              </View>
              <Image
                source={ICONS["chevron-down"]}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: colors.primary[500],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Selector de cuenta de destino */}
          <View style={transferStyles.section}>
            <Text style={transferStyles.sectionTitle}>Hacia</Text>
            <TouchableOpacity
              style={transferStyles.accountSelector}
              onPress={() => setShowToAccountSelector(true)}
            >
              <View style={transferStyles.accountSelectorLeft}>
                <Text style={transferStyles.accountSelectorSymbol}>
                  {toAccount?.symbol || "💼"}
                </Text>
                <View style={transferStyles.accountSelectorInfo}>
                  <Text style={transferStyles.accountSelectorName}>
                    {toAccount?.name || "Seleccionar cuenta de destino"}
                  </Text>
                  {toAccount && (
                    <Text style={transferStyles.accountSelectorBalance}>
                      Balance:{" "}
                      {toAccount.balance?.toLocaleString("es-CO") || "0"}{" "}
                      {toAccount.currency || "COP"}
                    </Text>
                  )}
                </View>
              </View>
              <Image
                source={ICONS["chevron-down"]}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: colors.primary[500],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Campo de monto */}
          <View style={transferStyles.section}>
            <Text style={transferStyles.sectionTitle}>Monto</Text>
            <View style={transferStyles.amountInputContainer}>
              <TextInput
                style={transferStyles.amountInput}
                placeholder="0"
                placeholderTextColor={colors.text.tertiary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={transferStyles.currencyLabel}>
                {fromAccount?.currency || "COP"}
              </Text>
            </View>
            {fromAccount && parsedAmount > 0 && !isOverBalance && (
              <Text style={transferStyles.balanceInfo}>
                Saldo restante:{" "}
                {(fromAccount.balance - parsedAmount).toLocaleString("es-CO")}{" "}
                {fromAccount.currency}
              </Text>
            )}
            {fromAccount && parsedAmount > 0 && isOverBalance && (
              <Text style={transferStyles.errorText}>
                No es posible realizar la transferencia: monto excede el saldo
                disponible
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Botón Transferir */}
        <TouchableOpacity
          style={[
            transferStyles.transferButton,
            (!fromAccount || !toAccount || parsedAmount <= 0 || isLoading) &&
              transferStyles.disabledButton,
          ]}
          onPress={handleTransfer}
          disabled={
            !fromAccount || !toAccount || parsedAmount <= 0 || isLoading
          }
        >
          {isLoading ? (
            <Text style={transferStyles.transferButtonText}>
              Transfiriendo...
            </Text>
          ) : (
            <>
              <Text style={transferStyles.transferButtonText}>Transferir</Text>
              <Image
                source={ICONS["send"]}
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

      {/* Modal Selector de Cuenta Origen */}
      {showFromAccountSelector && (
        <View style={transferStyles.modalOverlay}>
          <View style={transferStyles.accountSelectorModal}>
            <View style={transferStyles.modalHeader}>
              <Text style={transferStyles.modalTitle}>Cuenta de Origen</Text>
              <TouchableOpacity
                onPress={() => setShowFromAccountSelector(false)}
                style={transferStyles.closeButton}
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
              style={transferStyles.accountsList}
              showsVerticalScrollIndicator={false}
            >
              {getAvailableFromAccounts().map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    transferStyles.accountItem,
                    fromAccount?.id === account.id &&
                      transferStyles.selectedAccountItem,
                  ]}
                  onPress={() => {
                    setFromAccount(account);
                    setShowFromAccountSelector(false);
                  }}
                >
                  <View style={transferStyles.accountItemLeft}>
                    <Text style={transferStyles.accountItemSymbol}>
                      {account.symbol}
                    </Text>
                    <View style={transferStyles.accountItemInfo}>
                      <Text style={transferStyles.accountItemName}>
                        {account.name}
                      </Text>
                      <Text style={transferStyles.accountItemBalance}>
                        Balance: {account.balance.toLocaleString("es-CO")}{" "}
                        {account.currency}
                      </Text>
                    </View>
                  </View>
                  {fromAccount?.id === account.id && (
                    <Image
                      source={ICONS["checkmark-circle"]}
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: colors.primary[500],
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

      {/* Modal Selector de Cuenta Destino */}
      {showToAccountSelector && (
        <View style={transferStyles.modalOverlay}>
          <View style={transferStyles.accountSelectorModal}>
            <View style={transferStyles.modalHeader}>
              <Text style={transferStyles.modalTitle}>Cuenta de Destino</Text>
              <TouchableOpacity
                onPress={() => setShowToAccountSelector(false)}
                style={transferStyles.closeButton}
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
              style={transferStyles.accountsList}
              showsVerticalScrollIndicator={false}
            >
              {getAvailableToAccounts().map((account) => {
                const isSame =
                  !fromAccount || account.currency === fromAccount.currency;
                return (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      transferStyles.accountItem,
                      toAccount?.id === account.id &&
                        transferStyles.selectedAccountItem,
                      !isSame && transferStyles.disabledAccountItem,
                    ]}
                    disabled={!isSame}
                    onPress={() => {
                      if (!isSame) return;
                      setToAccount(account);
                      setShowToAccountSelector(false);
                    }}
                  >
                    <View style={transferStyles.accountItemLeft}>
                      <Text style={transferStyles.accountItemSymbol}>
                        {account.symbol}
                      </Text>
                      <View style={transferStyles.accountItemInfo}>
                        <Text style={transferStyles.accountItemName}>
                          {account.name}
                        </Text>
                        <Text style={transferStyles.accountItemBalance}>
                          Balance: {account.balance.toLocaleString("es-CO")}{" "}
                          {account.currency}
                        </Text>
                      </View>
                    </View>
                    {toAccount?.id === account.id && (
                      <Image
                        source={ICONS["checkmark-circle"]}
                        style={{
                          width: 24,
                          height: 24,
                          tintColor: colors.primary[500],
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal de confirmación */}
      {showConfirm && (
        <View style={transferStyles.modalOverlay}>
          <View style={transferStyles.confirmModal}>
            <Text style={transferStyles.modalTitle}>
              Confirmar transferencia
            </Text>
            <Text style={transferStyles.confirmText}>
              ¿Seguro de que quieres transferir{" "}
              {parseFloat(amount).toLocaleString("es-CO")}{" "}
              {fromAccount?.currency} desde {fromAccount?.name} hasta{" "}
              {toAccount?.name}?
            </Text>
            <View style={transferStyles.confirmActions}>
              <TouchableOpacity
                style={[
                  transferStyles.confirmButton,
                  transferStyles.cancelButton,
                ]}
                onPress={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                <Text style={transferStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  transferStyles.confirmButton,
                  transferStyles.acceptButton,
                ]}
                onPress={async () => {
                  setShowConfirm(false);
                  await performTransfer();
                }}
                disabled={isLoading}
              >
                <Text style={transferStyles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
