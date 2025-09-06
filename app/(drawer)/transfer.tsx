import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import { useStyles } from '../../src/shared/hooks';
import type { DatabaseAccount } from '../../src/shared/services/database';
import { headerStyles } from '../../src/shared/styles/components';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

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
  
  const styles = useStyles(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    statusBarArea: {
      backgroundColor: colors.background.dark,
    },
    header: headerStyles.standard,
    headerCenter: headerStyles.center,
    headerTitle: headerStyles.title,
    backButton: headerStyles.actionButton,
    placeholder: headerStyles.placeholder,
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.layout.screenPadding,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing[12],
    },
         loadingText: {
       marginTop: spacing[4],
       fontSize: typography.fontSize.base,
       color: colors.text.secondary,
     },
     summaryCard: {
       backgroundColor: colors.neutral.white,
       borderRadius: 12,
       padding: spacing[4],
       marginBottom: spacing[4],
       borderWidth: 1,
       borderColor: colors.border.light,
     },
     transferFlow: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       marginBottom: spacing[4],
     },
     accountSummary: {
       alignItems: 'center',
       flex: 1,
     },
     accountSummarySymbol: {
       fontSize: typography.fontSize['3xl'],
       marginBottom: spacing[1],
     },
     accountSummaryName: {
       fontSize: typography.fontSize.sm,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       textAlign: 'center',
       marginBottom: spacing[0],
     },
     accountSummaryBalance: {
       fontSize: typography.fontSize.xs,
       color: colors.text.tertiary,
       textAlign: 'center',
     },
     transferArrow: {
       marginHorizontal: spacing[2],
     },
     transferAmount: {
       alignItems: 'center',
       paddingTop: spacing[3],
       borderTopWidth: 1,
       borderTopColor: colors.border.light,
     },
     transferAmountLabel: {
       fontSize: typography.fontSize.sm,
       color: colors.text.tertiary,
       marginBottom: spacing[1],
     },
     transferAmountValue: {
       fontSize: typography.fontSize.xl,
       fontWeight: typography.fontWeight.bold,
       color: colors.primary[500],
     },
     section: {
       marginBottom: spacing[4],
     },
     sectionTitle: {
       fontSize: typography.fontSize.sm,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       marginBottom: spacing[2],
     },
     accountSelector: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: spacing.component.inputPadding,
       backgroundColor: colors.neutral.gray[100],
       borderRadius: 12,
       borderWidth: 1,
       borderColor: colors.border.light,
     },
     accountSelectorLeft: {
       flexDirection: 'row',
       alignItems: 'center',
       flex: 1,
     },
     accountSelectorSymbol: {
       fontSize: typography.fontSize['2xl'],
       marginRight: spacing[3],
     },
     accountSelectorInfo: {
       flex: 1,
     },
     accountSelectorName: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       marginBottom: spacing[0],
     },
     accountSelectorBalance: {
       fontSize: typography.fontSize.sm,
       color: colors.text.tertiary,
     },
     amountInputContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: colors.neutral.gray[100],
       borderRadius: 12,
       borderWidth: 1,
       borderColor: colors.border.light,
       paddingHorizontal: spacing[4],
     },
     amountInput: {
       flex: 1,
       fontSize: typography.fontSize.xl,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.primary,
       paddingVertical: spacing[4],
     },
     currencyLabel: {
       fontSize: typography.fontSize.base,
       color: colors.text.tertiary,
       marginLeft: spacing[2],
     },
     balanceInfo: {
       fontSize: typography.fontSize.sm,
       color: colors.text.tertiary,
       marginTop: spacing[1],
     },
     errorText: {
       fontSize: typography.fontSize.sm,
       color: colors.semantic.error,
       marginTop: spacing[1],
     },
     transferButton: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: colors.primary[500],
       marginHorizontal: spacing.layout.screenPadding,
       marginBottom: spacing.layout.screenPadding,
       paddingVertical: spacing.component.buttonPadding,
       borderRadius: 25,
       gap: spacing[2],
     },
     transferButtonText: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.neutral.white,
     },
     disabledButton: {
       backgroundColor: colors.neutral.gray[300],
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
       zIndex: 1000,
     },
     accountSelectorModal: {
       backgroundColor: colors.neutral.white,
       borderRadius: 12,
       margin: spacing[4],
       maxHeight: '80%',
       minWidth: 300,
     },
     modalHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: spacing[4],
       borderBottomWidth: 1,
       borderBottomColor: colors.border.light,
     },
     modalTitle: {
       fontSize: typography.fontSize.lg,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.primary,
     },
     closeButton: {
       padding: spacing[1],
     },
     accountsList: {
       maxHeight: 400,
     },
     accountItem: {
       flexDirection: 'row',
       alignItems: 'center',
       padding: spacing[4],
       borderBottomWidth: 1,
       borderBottomColor: colors.border.light,
     },
     selectedAccountItem: {
       backgroundColor: colors.secondary[50],
     },
     disabledAccountItem: {
       opacity: 0.5,
     },
     accountItemLeft: {
       flexDirection: 'row',
       alignItems: 'center',
       flex: 1,
     },
     accountItemSymbol: {
       fontSize: typography.fontSize['2xl'],
       marginRight: spacing[3],
     },
     accountItemInfo: {
       flex: 1,
     },
     accountItemName: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       marginBottom: spacing[0],
     },
     accountItemBalance: {
       fontSize: typography.fontSize.sm,
       color: colors.text.tertiary,
     },
     confirmModal: {
       backgroundColor: colors.neutral.white,
       borderRadius: 12,
       padding: spacing[6],
       margin: spacing[4],
       minWidth: 300,
     },
     confirmText: {
       fontSize: typography.fontSize.base,
       color: colors.text.secondary,
       textAlign: 'center',
       marginBottom: spacing[6],
       lineHeight: 24,
     },
     confirmActions: {
       flexDirection: 'row',
       gap: spacing[3],
     },
     confirmButton: {
       flex: 1,
       paddingVertical: spacing[3],
       borderRadius: 8,
       alignItems: 'center',
     },
     cancelButton: {
       backgroundColor: colors.neutral.gray[100],
     },
     cancelButtonText: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
     },
     acceptButton: {
       backgroundColor: colors.primary[500],
     },
     acceptButtonText: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.neutral.white,
     },
   }));
  
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
                  style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
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
                style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
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
                style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
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
                placeholderTextColor={colors.text.tertiary}
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
                style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
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
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
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
                      style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
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
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
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
                        style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
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