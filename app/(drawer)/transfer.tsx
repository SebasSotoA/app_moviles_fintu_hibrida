import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import type { DatabaseAccount } from '../../src/shared/services/database';
import globalStyles from '../../src/shared/styles/globalStyles';
import colors from '../../src/shared/styles/themes';

// Mapa de íconos locales con nombres exactos de Ionicons
const ICONS: Record<string, any> = {
  'arrow-back': require('../../assets/icons/arrow-back.svg'),
  'arrow-forward': require('../../assets/icons/arrow-forward.svg'),
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'send': require('../../assets/icons/send.svg'),
  'close': require('../../assets/icons/close.svg'),
  'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
};

export default function Transfer() {
  const { accounts, currentAccount, refreshData } = useApp();
  const insets = useSafeAreaInsets();
  
  const [fromAccount, setFromAccount] = useState<DatabaseAccount | null>(currentAccount ?? null);
  const [toAccount, setToAccount] = useState<DatabaseAccount | null>(null);
  const [amount, setAmount] = useState('');
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
    return accounts.filter(account => account.id !== fromAccount?.id);
  };

  const getAvailableFromAccounts = () => {
    return accounts.filter(account => account.id !== toAccount?.id);
  };

  const validateTransfer = () => {
    if (!fromAccount) {
      Alert.alert('Error', 'Selecciona una cuenta de origen');
      return false;
    }

    if (!toAccount) {
      Alert.alert('Error', 'Selecciona una cuenta de destino');
      return false;
    }

    if (fromAccount.currency !== toAccount.currency) {
      Alert.alert('Error', 'Solo puedes transferir entre cuentas de la misma divisa');
      return false;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0');
      return false;
    }

    if (transferAmount > fromAccount.balance) {
      Alert.alert('Error', 'Saldo insuficiente en la cuenta de origen');
      return false;
    }

    if (fromAccount.id === toAccount.id) {
      Alert.alert('Error', 'No puedes transferir a la misma cuenta');
      return false;
    }

    return true;
  };

  const resetTransferForm = () => {
    setAmount('');
    setToAccount(null);
    setShowFromAccountSelector(false);
    setShowToAccountSelector(false);
    setIsLoading(false);
  };

  const performTransfer = async () => {
    try {
      setIsLoading(true);

      // Crear transferencia usando el servicio de base de datos
      const { databaseService } = await import('../../src/shared/services/database');
      
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

      const successMsg = `Se transfirieron ${parseFloat(amount).toLocaleString('es-CO')} ${fromAccount!.currency} de ${fromAccount!.name} a ${toAccount!.name}`;

      // Limpiar formulario antes de navegar
      resetTransferForm();
      if (Platform.OS === 'web') {
        // En web, Alert no soporta callbacks; usamos window.alert y navegamos inmediatamente
        window.alert(`Transferencia Exitosa\n\n${successMsg}`);
        router.replace('/(drawer)/cuentas');
      } else {
        Alert.alert(
          'Transferencia Exitosa',
          successMsg,
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(drawer)/cuentas');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      Alert.alert('Error', 'No se pudo realizar la transferencia. Intenta nuevamente.');
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
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 28, height: 28, tintColor: '#FFFFFF' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Transferir</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Resumen de transferencia */}
          <View style={styles.summaryCard}>
            <View style={styles.transferFlow}>
              <View style={styles.accountSummary}>
                <Text style={styles.accountSummarySymbol}>{fromAccount?.symbol || '💰'}</Text>
                <Text style={styles.accountSummaryName}>{fromAccount?.name || 'Cuenta origen'}</Text>
                <Text style={styles.accountSummaryBalance}>
                  {fromAccount?.balance?.toLocaleString('es-CO') || '0'} {fromAccount?.currency || 'COP'}
                </Text>
              </View>
              
              <View style={styles.transferArrow}>
                <Image
                  source={ICONS['arrow-forward']}
                  style={{ width: 24, height: 24, tintColor: '#3A7691' }}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.accountSummary}>
                <Text style={styles.accountSummarySymbol}>{toAccount?.symbol || '💼'}</Text>
                <Text style={styles.accountSummaryName}>{toAccount?.name || 'Cuenta destino'}</Text>
                <Text style={styles.accountSummaryBalance}>
                  {toAccount?.balance?.toLocaleString('es-CO') || '0'} {toAccount?.currency || 'COP'}
                </Text>
              </View>
            </View>
            
            {parseFloat(amount) > 0 && (
              <View style={styles.transferAmount}>
                <Text style={styles.transferAmountLabel}>Monto a transferir</Text>
                <Text style={styles.transferAmountValue}>
                  {parseFloat(amount).toLocaleString('es-CO')} {fromAccount?.currency || 'COP'}
                </Text>
              </View>
            )}
          </View>

          {/* Selector de cuenta de origen */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desde</Text>
            <TouchableOpacity 
              style={styles.accountSelector}
              onPress={() => setShowFromAccountSelector(true)}
            >
              <View style={styles.accountSelectorLeft}>
                <Text style={styles.accountSelectorSymbol}>{fromAccount?.symbol || '💰'}</Text>
                <View style={styles.accountSelectorInfo}>
                  <Text style={styles.accountSelectorName}>
                    {fromAccount?.name || 'Seleccionar cuenta de origen'}
                  </Text>
                  <Text style={styles.accountSelectorBalance}>
                    Balance: {fromAccount?.balance?.toLocaleString('es-CO') || '0'} {fromAccount?.currency || 'COP'}
                  </Text>
                </View>
              </View>
              <Image
                source={ICONS['chevron-down']}
                style={{ width: 24, height: 24, tintColor: '#3A7691' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Selector de cuenta de destino */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hacia</Text>
            <TouchableOpacity 
              style={styles.accountSelector}
              onPress={() => setShowToAccountSelector(true)}
            >
              <View style={styles.accountSelectorLeft}>
                <Text style={styles.accountSelectorSymbol}>{toAccount?.symbol || '💼'}</Text>
                <View style={styles.accountSelectorInfo}>
                  <Text style={styles.accountSelectorName}>
                    {toAccount?.name || 'Seleccionar cuenta de destino'}
                  </Text>
                  {toAccount && (
                    <Text style={styles.accountSelectorBalance}>
                      Balance: {toAccount.balance?.toLocaleString('es-CO') || '0'} {toAccount.currency || 'COP'}
                    </Text>
                  )}
                </View>
              </View>
              <Image
                source={ICONS['chevron-down']}
                style={{ width: 24, height: 24, tintColor: '#3A7691' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Campo de monto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monto</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#ADADAD"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.currencyLabel}>{fromAccount?.currency || 'COP'}</Text>
            </View>
            {fromAccount && parsedAmount > 0 && !isOverBalance && (
              <Text style={styles.balanceInfo}>
                Saldo restante: {(fromAccount.balance - parsedAmount).toLocaleString('es-CO')} {fromAccount.currency}
              </Text>
            )}
            {fromAccount && parsedAmount > 0 && isOverBalance && (
              <Text style={styles.errorText}>
                No es posible realizar la transferencia: monto excede el saldo disponible
              </Text>
            )}
          </View>

        </ScrollView>

        {/* Botón Transferir */}
        <TouchableOpacity 
          style={[
            styles.transferButton,
            (!fromAccount || !toAccount || parsedAmount <= 0 || isLoading) && styles.disabledButton
          ]}
          onPress={handleTransfer}
          disabled={!fromAccount || !toAccount || parsedAmount <= 0 || isLoading}
        >
          {isLoading ? (
            <Text style={styles.transferButtonText}>Transfiriendo...</Text>
          ) : (
            <>
              <Text style={styles.transferButtonText}>Transferir</Text>
              <Image
                source={ICONS['send']}
                style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
                resizeMode="contain"
              />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Modal Selector de Cuenta Origen */}
      {showFromAccountSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.accountSelectorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cuenta de Origen</Text>
              <TouchableOpacity 
                onPress={() => setShowFromAccountSelector(false)}
                style={styles.closeButton}
              >
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: '#666' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
              {getAvailableFromAccounts().map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountItem,
                    fromAccount?.id === account.id && styles.selectedAccountItem
                  ]}
                  onPress={() => {
                    setFromAccount(account);
                    setShowFromAccountSelector(false);
                  }}
                >
                  <View style={styles.accountItemLeft}>
                    <Text style={styles.accountItemSymbol}>{account.symbol}</Text>
                    <View style={styles.accountItemInfo}>
                      <Text style={styles.accountItemName}>{account.name}</Text>
                      <Text style={styles.accountItemBalance}>
                        Balance: {account.balance.toLocaleString('es-CO')} {account.currency}
                      </Text>
                    </View>
                  </View>
                  {fromAccount?.id === account.id && (
                    <Image
                      source={ICONS['checkmark-circle']}
                      style={{ width: 24, height: 24, tintColor: '#3A7691' }}
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
        <View style={styles.modalOverlay}>
          <View style={styles.accountSelectorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cuenta de Destino</Text>
              <TouchableOpacity 
                onPress={() => setShowToAccountSelector(false)}
                style={styles.closeButton}
              >
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: '#666' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
              {getAvailableToAccounts().map((account) => {
                const isSame = !fromAccount || account.currency === fromAccount.currency;
                return (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountItem,
                      toAccount?.id === account.id && styles.selectedAccountItem,
                      !isSame && styles.disabledAccountItem,
                    ]}
                    disabled={!isSame}
                    onPress={() => {
                      if (!isSame) return;
                      setToAccount(account);
                      setShowToAccountSelector(false);
                    }}
                  >
                    <View style={styles.accountItemLeft}>
                      <Text style={styles.accountItemSymbol}>{account.symbol}</Text>
                      <View style={styles.accountItemInfo}>
                        <Text style={styles.accountItemName}>{account.name}</Text>
                        <Text style={styles.accountItemBalance}>
                          Balance: {account.balance.toLocaleString('es-CO')} {account.currency}
                        </Text>
                      </View>
                    </View>
                    {toAccount?.id === account.id && (
                      <Image
                        source={ICONS['checkmark-circle']}
                        style={{ width: 24, height: 24, tintColor: '#3A7691' }}
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
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.modalTitle}>Confirmar transferencia</Text>
            <Text style={styles.confirmText}>
              ¿Seguro de que quieres transferir {parseFloat(amount).toLocaleString('es-CO')} {fromAccount?.currency} desde {fromAccount?.name} hasta {toAccount?.name}?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.acceptButton]}
                onPress={async () => {
                  setShowConfirm(false);
                  await performTransfer();
                }}
                disabled={isLoading}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = { ...globalStyles, ...StyleSheet.create({
  disabledAccountItem: {
    opacity: 0.5,
  },
  accountSummary: {
    flex: 1,
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: colors.notCompletelyLightGray,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
  },
  transferFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountSummarySymbol: {
    fontSize: 32,
    marginBottom: 8,
  },
  accountSummaryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grayDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  accountSummaryBalance: {
    fontSize: 12,
    color: colors.grayMedium,
    textAlign: 'center',
  },
  transferArrow: {
    marginHorizontal: 16,
  },
  transferAmount: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.notCompletelyLightGray,
  },
  transferAmountLabel: {
    fontSize: 14,
    color: colors.grayMedium,
    marginBottom: 4,
  },
  transferAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.grayDark,
    backgroundColor: colors.notCompletelyLightGray,
    marginRight: 12,
    textAlign: 'right',
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 40,
  },
  balanceInfo: {
    fontSize: 14,
    color: colors.grayMedium,
    marginTop: 8,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 8,
    textAlign: 'right',
    fontWeight: '600',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.notCompletelyLightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.grayDark,
    backgroundColor: colors.notCompletelyLightGray,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  transferButton: {
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
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  acceptButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
}) 
};


