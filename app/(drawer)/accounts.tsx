import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import EditAccountModal from "../../components/EditAccountModal";
import { useApp } from "../../src/shared/context/AppProvider";
import { DatabaseAccount } from "../../src/shared/services/database";
import { accountsStyles } from "../../src/shared/styles/components/accounts";
import { colors } from "../../src/shared/styles/tokens";

// Mapa de íconos locales siguiendo el patrón de add-transaction.tsx
const ICONS: Record<string, any> = {
  menu: require("../../assets/icons/menu.svg"),
  "checkmark-circle": require("../../assets/icons/checkmark-circle.svg"),
  "eye-off-outline": require("../../assets/icons/eye-off-outline.svg"),
  "swap-horizontal": require("../../assets/icons/swap-horizontal.svg"),
  "add-circle": require("../../assets/icons/add-circle.svg"),
  "wallet-outline": require("../../assets/icons/wallet-outline.svg"),
  "create-outline": require("../../assets/icons/create-outline.svg"),
  "remove-circle-outline": require("../../assets/icons/remove-circle-outline.svg"),
};

export default function Accounts() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    accounts,
    currentAccount,
    setCurrentAccount,
    isLoading,
    updateAccount,
    deleteAccount,
  } = useApp();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<DatabaseAccount | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] =
    useState<DatabaseAccount | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Calcular totales por divisa, memo permite que solo se calcule cuando se actualice.
  const totalsByCurrency = React.useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    accounts.forEach((acc) => {
      if (!acc.includeInTotal) return;
      const curr = acc.currency;
      const prev = map.get(curr) || { total: 0, count: 0 };
      map.set(curr, { total: prev.total + acc.balance, count: prev.count + 1 });
    });
    return Array.from(map.entries());
  }, [accounts]);

  // Label para mostrar en pantalla.
  const totalsSummary = React.useMemo(() => {
    const parts = totalsByCurrency.map(
      ([currency, info]) =>
        `${info.total.toLocaleString("es-CO")} ${currency} 💸`,
    );
    return parts.length > 0 ? parts.join(" + ") : "0";
  }, [totalsByCurrency]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleAccountPress = (accountId: string) => {
    setCurrentAccount(accountId);
  };

  // Viaja a vista de creación de cuenta con el returnPath de la vista actual
  const handleAddAccount = () => {
    router.push({
      pathname: "/(drawer)/new-account",
      params: { returnPath: "/(drawer)/accounts" },
    });
  };

  // Viaja a vista de transferencia con el returnPath de la vista actual
  const handleTransfer = () => {
    if (accounts.length < 2) {
      Alert.alert(
        "Información",
        "Necesitas al menos 2 cuentas para realizar transferencias",
      );
      return;
    }
    router.push("/(drawer)/transfer");
  };

  const handleEditAccount = (account: DatabaseAccount) => {
    setAccountToEdit(account);
    setEditModalVisible(true);
  };

  const handleSaveAccount = async (
    accountId: string,
    updates: { name: string; symbol: string },
  ) => {
    try {
      // Agregar timeout de 5 segundos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: La operación tardó demasiado")),
          5000,
        ),
      );

      const updatePromise = updateAccount(accountId, updates);

      await Promise.race([updatePromise, timeoutPromise]);
    } catch (error) {
      console.error("Error al actualizar cuenta:", error);
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setAccountToEdit(null);
  };

  const handleDeleteAccount = (account: DatabaseAccount) => {
    setAccountToDelete(account);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      setIsDeleting(true);
      await deleteAccount(accountToDelete.id);
      setShowDeleteConfirm(false);
      setAccountToDelete(null);
      setDeleteConfirmInput("");
      Alert.alert("Éxito", "Cuenta eliminada correctamente");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "No se pudo eliminar la cuenta");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAccountToDelete(null);
    setDeleteConfirmInput("");
  };

  const renderAccountCard = (account: any) => (
    <TouchableOpacity
      key={account.id}
      style={[
        accountsStyles.accountCard,
        currentAccount?.id === account.id && accountsStyles.activeAccountCard,
      ]}
      onPress={() => handleAccountPress(account.id)}
    >
      <View style={accountsStyles.accountHeader}>
        <View
          style={[
            accountsStyles.accountSymbol,
            { backgroundColor: account.color },
          ]}
        >
          <Text style={accountsStyles.symbolText}>{account.symbol}</Text>
        </View>
        <View style={accountsStyles.accountInfo}>
          <Text style={accountsStyles.accountName}>{account.name}</Text>
          <Text style={accountsStyles.accountCurrency}>{account.currency}</Text>
        </View>
        <View style={accountsStyles.accountActions}>
          <TouchableOpacity
            style={accountsStyles.editButton}
            onPress={() => handleEditAccount(account)}
          >
            <Image
              source={ICONS["create-outline"]}
              style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={accountsStyles.deleteButton}
            onPress={() => handleDeleteAccount(account)}
          >
            <Image
              source={ICONS["remove-circle-outline"]}
              style={{
                width: 20,
                height: 20,
                tintColor: colors.semantic.error,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={accountsStyles.accountBalance}>
            <Text
              style={[
                accountsStyles.balanceAmount,
                { color: account.balance >= 0 ? "#4CAF50" : "#FF6B6B" },
              ]}
            >
              {account.balance.toLocaleString("es-CO")}
            </Text>
            <Text style={accountsStyles.balanceCurrency}>
              {account.currency}
            </Text>
          </View>
        </View>
      </View>

      {currentAccount?.id === account.id && (
        <View style={accountsStyles.activeIndicator}>
          <Image
            source={ICONS["checkmark-circle"]}
            style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
            resizeMode="contain"
          />
          <Text style={accountsStyles.activeText}>Cuenta activa</Text>
        </View>
      )}

      {!account.includeInTotal && (
        <View style={accountsStyles.excludedIndicator}>
          <Image
            source={ICONS["eye-off-outline"]}
            style={{ width: 16, height: 16, tintColor: colors.text.tertiary }}
            resizeMode="contain"
          />
          <Text style={accountsStyles.excludedText}>Excluida del total</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={accountsStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={accountsStyles.loadingText}>Cargando cuentas...</Text>
      </View>
    );
  }

  return (
    <View style={accountsStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View style={[accountsStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={accountsStyles.header}>
        <TouchableOpacity
          onPress={openDrawer}
          style={accountsStyles.menuButton}
        >
          <Image
            source={ICONS["menu"]}
            style={{ width: 35, height: 35, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={accountsStyles.headerCenter}>
          <Text style={accountsStyles.headerTitle}>Cuentas</Text>
        </View>
        <View style={accountsStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={accountsStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={accountsStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Saldo total (concatenado por divisa) */}
          <View style={accountsStyles.totalSection}>
            <Text style={accountsStyles.totalLabel}>Saldo Total</Text>
            <Text style={accountsStyles.totalAmount}>{totalsSummary}</Text>
            <Text style={accountsStyles.totalSubtext}>
              {accounts.filter((acc) => acc.includeInTotal).length} cuentas
              incluidas
            </Text>
          </View>

          {/* Botones de acción */}
          <View style={accountsStyles.actionButtons}>
            <TouchableOpacity
              style={[
                accountsStyles.actionButton,
                accountsStyles.transferButton,
              ]}
              onPress={handleTransfer}
            >
              <Image
                source={ICONS["swap-horizontal"]}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: colors.neutral.white,
                }}
                resizeMode="contain"
              />
              <Text style={accountsStyles.actionButtonText}>Transferir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[accountsStyles.actionButton, accountsStyles.addButton]}
              onPress={handleAddAccount}
            >
              <Image
                source={ICONS["add-circle"]}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: colors.neutral.white,
                }}
                resizeMode="contain"
              />
              <Text style={accountsStyles.newButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de cuentas */}
          <View style={accountsStyles.accountsSection}>
            <Text style={accountsStyles.sectionTitle}>Mis Cuentas</Text>

            {accounts.length > 0 ? (
              <View style={accountsStyles.accountsList}>
                {accounts.map(renderAccountCard)}
              </View>
            ) : (
              <View style={accountsStyles.emptyState}>
                <Image
                  source={ICONS["wallet-outline"]}
                  style={{
                    width: 60,
                    height: 60,
                    tintColor: colors.text.tertiary,
                  }}
                  resizeMode="contain"
                />
                <Text style={accountsStyles.emptyStateText}>
                  No tienes cuentas creadas
                </Text>
                <TouchableOpacity
                  style={accountsStyles.createFirstAccountButton}
                  onPress={handleAddAccount}
                >
                  <Text style={accountsStyles.createFirstAccountText}>
                    Crear primera cuenta
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de edición de cuenta */}
      <EditAccountModal
        visible={editModalVisible}
        account={accountToEdit}
        onClose={handleCloseEditModal}
        onSave={handleSaveAccount}
      />

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <View style={accountsStyles.modalOverlay}>
          <View style={accountsStyles.confirmModal}>
            <Text style={accountsStyles.modalTitle}>Eliminar cuenta</Text>
            <Text style={accountsStyles.confirmText}>
              Esta acción eliminará la cuenta &quot;{accountToDelete?.name}&quot; y todas
              sus transacciones asociadas. Esta acción no se puede deshacer.
            </Text>
            <Text style={accountsStyles.confirmInstruction}>
              Para confirmar, escribe exactamente: ELIMINAR
            </Text>
            <TextInput
              style={accountsStyles.confirmInput}
              placeholder="ELIMINAR"
              placeholderTextColor={colors.text.tertiary}
              value={deleteConfirmInput}
              onChangeText={setDeleteConfirmInput}
              autoCapitalize="characters"
            />
            <View style={accountsStyles.confirmActions}>
              <TouchableOpacity
                style={[
                  accountsStyles.confirmButton,
                  accountsStyles.cancelButton,
                ]}
                onPress={handleCancelDelete}
                disabled={isDeleting}
              >
                <Text style={accountsStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  accountsStyles.confirmButton,
                  accountsStyles.deleteConfirmButton,
                  (deleteConfirmInput.trim().toUpperCase() !== "ELIMINAR" ||
                    isDeleting) &&
                    accountsStyles.disabledDeleteButton,
                ]}
                onPress={handleConfirmDelete}
                disabled={
                  deleteConfirmInput.trim().toUpperCase() !== "ELIMINAR" ||
                  isDeleting
                }
              >
                <Text style={accountsStyles.deleteConfirmButtonText}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
