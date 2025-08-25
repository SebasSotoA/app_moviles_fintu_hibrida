import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';

export default function Transfer() {
  const navigation = useNavigation();
  const { accounts, currentAccount, refreshData } = useApp();
  const insets = useSafeAreaInsets();
  
  const [fromAccount, setFromAccount] = useState(currentAccount);
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [showFromAccountSelector, setShowFromAccountSelector] = useState(false);
  const [showToAccountSelector, setShowToAccountSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar cuenta de origen cuando cambie la cuenta actual
  useEffect(() => {
    if (currentAccount && !fromAccount) {
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

  const handleTransfer = async () => {
    if (!validateTransfer()) return;

    try {
      setIsLoading(true);

      // Crear transferencia usando el servicio de base de datos
      const { databaseService } = await import('../../src/shared/services/database');
      
      const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await databaseService.createTransfer({
        id: transferId,
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        comment: comment.trim() || null,
      });

      // Refrescar datos
      await refreshData();

      Alert.alert(
        'Transferencia Exitosa',
        `Se transfirieron ${parseFloat(amount).toLocaleString('es-CO')} ${fromAccount.currency} de ${fromAccount.name} a ${toAccount.name}`,
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
      console.error('Error creating transfer:', error);
      Alert.alert('Error', 'No se pudo realizar la transferencia. Intenta nuevamente.');
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
                <Ionicons name="arrow-forward" size={24} color="#3A7691" />
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
              <Ionicons name="chevron-down" size={24} color="#3A7691" />
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
              <Ionicons name="chevron-down" size={24} color="#3A7691" />
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
            {fromAccount && parseFloat(amount) > 0 && (
              <Text style={styles.balanceInfo}>
                Saldo restante: {(fromAccount.balance - parseFloat(amount)).toLocaleString('es-CO')} {fromAccount.currency}
              </Text>
            )}
          </View>

          {/* Campo de comentario */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comentario (opcional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Motivo de la transferencia..."
              placeholderTextColor="#ADADAD"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

        </ScrollView>

        {/* Botón Transferir */}
        <TouchableOpacity 
          style={[
            styles.transferButton,
            (!fromAccount || !toAccount || parseFloat(amount) <= 0 || isLoading) && styles.disabledButton
          ]}
          onPress={handleTransfer}
          disabled={!fromAccount || !toAccount || parseFloat(amount) <= 0 || isLoading}
        >
          {isLoading ? (
            <Text style={styles.transferButtonText}>Transfiriendo...</Text>
          ) : (
            <>
              <Text style={styles.transferButtonText}>Transferir</Text>
              <Ionicons name="send" size={20} color="#FFFFFF" />
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
                <Ionicons name="close" size={24} color="#666" />
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
                    <Ionicons name="checkmark-circle" size={24} color="#3A7691" />
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
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
              {getAvailableToAccounts().map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountItem,
                    toAccount?.id === account.id && styles.selectedAccountItem
                  ]}
                  onPress={() => {
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
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  transferFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  accountSummary: {
    flex: 1,
    alignItems: 'center',
  },
  accountSummarySymbol: {
    fontSize: 32,
    marginBottom: 8,
  },
  accountSummaryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30353D',
    textAlign: 'center',
    marginBottom: 4,
  },
  accountSummaryBalance: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  transferArrow: {
    marginHorizontal: 16,
  },
  transferAmount: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  transferAmountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  transferAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A7691',
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
  accountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  accountSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountSelectorSymbol: {
    fontSize: 24,
    marginRight: 12,
  },
  accountSelectorInfo: {
    flex: 1,
  },
  accountSelectorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  accountSelectorBalance: {
    fontSize: 14,
    color: '#666666',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#30353D',
    backgroundColor: '#F8F9FA',
    marginRight: 12,
    textAlign: 'right',
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A7691',
    minWidth: 40,
  },
  balanceInfo: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'right',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#30353D',
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  transferButton: {
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
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  // Modal Styles (reused)
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
  accountSelectorModal: {
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
  accountsList: {
    maxHeight: 300,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  selectedAccountItem: {
    backgroundColor: '#F0F8FF',
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountItemSymbol: {
    fontSize: 24,
    marginRight: 12,
  },
  accountItemInfo: {
    flex: 1,
  },
  accountItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  accountItemBalance: {
    fontSize: 14,
    color: '#666666',
  },
});


