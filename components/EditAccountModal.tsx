import React, { useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DatabaseAccount } from "../src/shared/services/database";
import { editAccountModalStyles } from "../src/shared/styles/components/edit-account-modal";

interface EditAccountModalProps {
  visible: boolean;
  account: DatabaseAccount | null;
  onClose: () => void;
  onSave: (
    accountId: string,
    updates: { name: string; symbol: string },
  ) => Promise<void>;
}

const AVAILABLE_SYMBOLS = [
  "💰",
  "🏦",
  "💳",
  "💵",
  "💴",
  "💶",
  "💷",
  "🪙",
  "💎",
  "🏧",
  "📱",
  "💻",
  "🏠",
  "🚗",
  "✈️",
  "🎯",
  "⭐",
  "🔥",
  "💡",
  "🎨",
  "🎵",
  "🎮",
  "📚",
  "🎓",
  "💼",
  "🔧",
  "⚡",
  "🌟",
  "🎪",
  "🎭",
  "🏆",
  "🎲",
];

export default function EditAccountModal({
  visible,
  account,
  onClose,
  onSave,
}: EditAccountModalProps) {
  const [name, setName] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("💰");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (account && visible && !isInitialized) {
      // Usar setTimeout para evitar bloqueos en el render
      const timer = setTimeout(() => {
        setName(account.name);
        setSelectedSymbol(account.symbol);
        setIsInitialized(true);
      }, 0);

      return () => clearTimeout(timer);
    } else if (!visible) {
      setIsInitialized(false);
    }
  }, [account, visible, isInitialized]);

  const handleSave = async () => {
    if (!account) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      if (Platform.OS === "web") {
        window.alert("El nombre de la cuenta es requerido");
      } else {
        Alert.alert("Error", "El nombre de la cuenta es requerido");
      }
      return;
    }

    if (trimmedName.length < 2) {
      if (Platform.OS === "web") {
        window.alert("El nombre debe tener al menos 2 caracteres");
      } else {
        Alert.alert("Error", "El nombre debe tener al menos 2 caracteres");
      }
      return;
    }

    setIsLoading(true);
    try {
      await Promise.race([
        onSave(account.id, {
          name: trimmedName,
          symbol: selectedSymbol,
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout: onSave tardó más de 5 segundos")),
            5000,
          ),
        ),
      ]);
      onClose();
    } catch (error: any) {
      let errorMessage = "Error al actualizar la cuenta";

      if (error.message === "DUPLICATE_ACCOUNT_NAME") {
        errorMessage = "Ya existe una cuenta con ese nombre";
      } else if (error.message === "DUPLICATE_ACCOUNT_SYMBOL") {
        errorMessage = "Ya existe una cuenta con ese símbolo";
      } else if (error.message.includes("Timeout")) {
        errorMessage = "La operación tardó demasiado. Inténtalo de nuevo.";
      }

      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!account || !isInitialized) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Modal de editar cuenta"
    >
      <View style={editAccountModalStyles.overlay}>
        <View style={editAccountModalStyles.modalContainer}>
          {/* Header */}
          <View style={editAccountModalStyles.header}>
            <Text style={editAccountModalStyles.title}>Editar Cuenta</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={editAccountModalStyles.closeButton}
              disabled={isLoading}
            >
              <Text style={editAccountModalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={editAccountModalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Información no editable */}
            <View style={editAccountModalStyles.infoSection}>
              <Text style={editAccountModalStyles.infoLabel}>
                Saldo actual (No editable)
              </Text>
              <Text style={editAccountModalStyles.infoValue}>
                {account.balance.toLocaleString("es-CO")} {account.currency}
              </Text>
            </View>

            {/* Campo de nombre */}
            <View style={editAccountModalStyles.inputSection}>
              <Text style={editAccountModalStyles.label}>
                Nombre de la cuenta *
              </Text>
              <TextInput
                style={editAccountModalStyles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Ej: Cuenta de ahorros"
                maxLength={50}
                editable={!isLoading}
              />
            </View>

            {/* Selector de símbolo */}
            <View style={editAccountModalStyles.inputSection}>
              <Text style={editAccountModalStyles.label}>
                Símbolo de la cuenta *
              </Text>
              <View style={editAccountModalStyles.symbolGrid}>
                {AVAILABLE_SYMBOLS.map((symbol) => (
                  <TouchableOpacity
                    key={symbol}
                    style={[
                      editAccountModalStyles.symbolButton,
                      selectedSymbol === symbol &&
                        editAccountModalStyles.selectedSymbolButton,
                    ]}
                    onPress={() => setSelectedSymbol(symbol)}
                    disabled={isLoading}
                  >
                    <Text style={editAccountModalStyles.symbolText}>
                      {symbol}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={editAccountModalStyles.previewSection}>
              <Text style={editAccountModalStyles.label}>Vista previa</Text>
              <View style={editAccountModalStyles.previewCard}>
                <View
                  style={[
                    editAccountModalStyles.previewSymbol,
                    { backgroundColor: account.color },
                  ]}
                >
                  <Text style={editAccountModalStyles.previewSymbolText}>
                    {selectedSymbol}
                  </Text>
                </View>
                <View style={editAccountModalStyles.previewInfo}>
                  <Text style={editAccountModalStyles.previewName}>
                    {name || "Nombre de la cuenta"}
                  </Text>
                  <Text style={editAccountModalStyles.previewCurrency}>
                    {account.currency}
                  </Text>
                </View>
                <View style={editAccountModalStyles.previewBalance}>
                  <Text style={editAccountModalStyles.previewBalanceAmount}>
                    {account.balance.toLocaleString("es-CO")}
                  </Text>
                  <Text style={editAccountModalStyles.previewBalanceCurrency}>
                    {account.currency}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={editAccountModalStyles.actions}>
            <TouchableOpacity
              style={editAccountModalStyles.cancelButton}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={editAccountModalStyles.cancelButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                editAccountModalStyles.saveButton,
                isLoading && editAccountModalStyles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={editAccountModalStyles.saveButtonText}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
