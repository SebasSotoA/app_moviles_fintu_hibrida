import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { DatabaseAccount } from '../src/shared/services/database';

interface EditAccountModalProps {
  visible: boolean;
  account: DatabaseAccount | null;
  onClose: () => void;
  onSave: (accountId: string, updates: { name: string; symbol: string }) => Promise<void>;
}

const AVAILABLE_SYMBOLS = [
  '💰', '🏦', '💳', '💵', '💴', '💶', '💷', '🪙',
  '💎', '🏧', '📱', '💻', '🏠', '🚗', '✈️', '🎯',
  '⭐', '🔥', '💡', '🎨', '🎵', '🎮', '📚', '🎓',
  '💼', '🔧', '⚡', '🌟', '🎪', '🎭', '🎨', '🎯'
];

export default function EditAccountModal({ visible, account, onClose, onSave }: EditAccountModalProps) {
  const [name, setName] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('💰');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (account && visible) {
      setName(account.name);
      setSelectedSymbol(account.symbol);
    }
  }, [account, visible]);

  const handleSave = async () => {
    if (!account) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      if (Platform.OS === 'web') {
        window.alert('El nombre de la cuenta es requerido');
      } else {
        Alert.alert('Error', 'El nombre de la cuenta es requerido');
      }
      return;
    }

    if (trimmedName.length < 2) {
      if (Platform.OS === 'web') {
        window.alert('El nombre debe tener al menos 2 caracteres');
      } else {
        Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
      }
      return;
    }

    setIsLoading(true);
    try {
      await onSave(account.id, {
        name: trimmedName,
        symbol: selectedSymbol
      });
      onClose();
    } catch (error: any) {
      let errorMessage = 'Error al actualizar la cuenta';
      
      if (error.message === 'DUPLICATE_ACCOUNT_NAME') {
        errorMessage = 'Ya existe una cuenta con ese nombre';
      } else if (error.message === 'DUPLICATE_ACCOUNT_SYMBOL') {
        errorMessage = 'Ya existe una cuenta con ese símbolo';
      }

      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
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

  if (!account) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Editar Cuenta</Text>
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.closeButton}
              disabled={isLoading}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Información no editable */}
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Saldo actual (no editable)</Text>
              <Text style={styles.infoValue}>
                {account.balance.toLocaleString('es-CO')} {account.currency}
              </Text>
            </View>

            {/* Campo de nombre */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Nombre de la cuenta *</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Ej: Cuenta de ahorros"
                maxLength={50}
                editable={!isLoading}
              />
            </View>

            {/* Selector de símbolo */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Símbolo de la cuenta *</Text>
              <View style={styles.symbolGrid}>
                {AVAILABLE_SYMBOLS.map((symbol) => (
                  <TouchableOpacity
                    key={symbol}
                    style={[
                      styles.symbolButton,
                      selectedSymbol === symbol && styles.selectedSymbolButton,
                    ]}
                    onPress={() => setSelectedSymbol(symbol)}
                    disabled={isLoading}
                  >
                    <Text style={styles.symbolText}>{symbol}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.label}>Vista previa</Text>
              <View style={styles.previewCard}>
                <View style={[styles.previewSymbol, { backgroundColor: account.color }]}>
                  <Text style={styles.previewSymbolText}>{selectedSymbol}</Text>
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>{name || 'Nombre de la cuenta'}</Text>
                  <Text style={styles.previewCurrency}>{account.currency}</Text>
                </View>
                <View style={styles.previewBalance}>
                  <Text style={styles.previewBalanceAmount}>
                    {account.balance.toLocaleString('es-CO')}
                  </Text>
                  <Text style={styles.previewBalanceCurrency}>{account.currency}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.disabledButton]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30353D',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 400,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
  },
  inputSection: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  symbolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symbolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSymbolButton: {
    borderColor: '#3A7691',
    backgroundColor: '#F0F8FF',
  },
  symbolText: {
    fontSize: 20,
  },
  previewSection: {
    padding: 20,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewSymbol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewSymbolText: {
    fontSize: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  previewCurrency: {
    fontSize: 12,
    color: '#666666',
  },
  previewBalance: {
    alignItems: 'flex-end',
  },
  previewBalanceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  previewBalanceCurrency: {
    fontSize: 10,
    color: '#666666',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#3A7691',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
