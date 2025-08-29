import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EditAccountModal from '../../components/EditAccountModal';
import { useApp } from '../../src/shared/context/AppProvider';

// Mapa de íconos locales siguiendo el patrón de add-transaction.tsx
const ICONS: Record<string, any> = {
  'menu': require('../../assets/icons/menu.svg'),
  'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
  'eye-off-outline': require('../../assets/icons/eye-off-outline.svg'),
  'swap-horizontal': require('../../assets/icons/swap-horizontal.svg'),
  'add-circle': require('../../assets/icons/add-circle.svg'),
  'wallet-outline': require('../../assets/icons/wallet-outline.svg'),
};
import { DatabaseAccount } from '../../src/shared/services/database';

export default function Cuentas() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { accounts, currentAccount, setCurrentAccount, isLoading, updateAccount } = useApp();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<DatabaseAccount | null>(null);

  // Calcular totales por divisa, memo permite que solo se calcule cuando se actualice.
  const totalsByCurrency = React.useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    accounts.forEach(acc => {
      if (!acc.includeInTotal) return;
      const curr = acc.currency;
      const prev = map.get(curr) || { total: 0, count: 0 };
      map.set(curr, { total: prev.total + acc.balance, count: prev.count + 1 });
    });
    return Array.from(map.entries());
  }, [accounts]);

  // Label para mostrar en pantalla.
  const totalsSummary = React.useMemo(() => {
    const parts = totalsByCurrency.map(([currency, info]) => `${info.total.toLocaleString('es-CO')} ${currency} 💸`);
    return parts.length > 0 ? parts.join(' + ') : '0';
  }, [totalsByCurrency]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleAccountPress = (accountId: string) => {
    setCurrentAccount(accountId);
  };

  // Viaja a vista de creación de cuenta con el returnPath de la vista actual
  const handleAddAccount = () => {
    router.push({ pathname: '/(drawer)/new-account', params: { returnPath: '/(drawer)/cuentas' } });
  };

  // Viaja a vista de transferencia con el returnPath de la vista actual
  const handleTransfer = () => {
    if (accounts.length < 2) {
      Alert.alert('Información', 'Necesitas al menos 2 cuentas para realizar transferencias');
      return;
    }
    router.push('/(drawer)/transfer');
  };

  const handleEditAccount = (account: DatabaseAccount) => {
    setAccountToEdit(account);
    setEditModalVisible(true);
  };

  const handleSaveAccount = async (accountId: string, updates: { name: string; symbol: string }) => {
    await updateAccount(accountId, updates);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setAccountToEdit(null);
  };

  const renderAccountCard = (account: any) => (
    <TouchableOpacity
      key={account.id}
      style={[
        styles.accountCard,
        currentAccount?.id === account.id && styles.activeAccountCard,
      ]}
      onPress={() => handleAccountPress(account.id)}
    >
      <View style={styles.accountHeader}>
        <View style={[styles.accountSymbol, { backgroundColor: account.color }]}>
          <Text style={styles.symbolText}>{account.symbol}</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountCurrency}>{account.currency}</Text>
        </View>
        <View style={styles.accountActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditAccount(account)}
          >
            <Ionicons name="create-outline" size={20} color="#3A7691" />
          </TouchableOpacity>
          <View style={styles.accountBalance}>
            <Text style={[
              styles.balanceAmount,
              { color: account.balance >= 0 ? '#4CAF50' : '#FF6B6B' }
            ]}>
              {account.balance.toLocaleString('es-CO')}
            </Text>
            <Text style={styles.balanceCurrency}>{account.currency}</Text>
          </View>
        </View>
      </View>
      
      {currentAccount?.id === account.id && (
        <View style={styles.activeIndicator}>
          <Image
            source={ICONS['checkmark-circle']}
            style={{ width: 20, height: 20, tintColor: '#3A7691' }}
            resizeMode="contain"
          />
          <Text style={styles.activeText}>Cuenta activa</Text>
        </View>
      )}
      
      {!account.includeInTotal && (
        <View style={styles.excludedIndicator}>
          <Image
            source={ICONS['eye-off-outline']}
            style={{ width: 16, height: 16, tintColor: '#999999' }}
            resizeMode="contain"
          />
          <Text style={styles.excludedText}>Excluida del total</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3A7691" />
        <Text style={styles.loadingText}>Cargando cuentas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Image
            source={ICONS['menu']}
            style={{ width: 35, height: 35, tintColor: '#FFFFFF' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cuentas</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Saldo total (concatenado por divisa) */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Saldo Total</Text>
            <Text style={styles.totalAmount}>{totalsSummary}</Text>
            <Text style={styles.totalSubtext}>
              {accounts.filter(acc => acc.includeInTotal).length} cuentas incluidas
            </Text>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.transferButton]}
              onPress={handleTransfer}
            >
              <Image
                source={ICONS['swap-horizontal']}
                style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
                resizeMode="contain"
              />
              <Text style={styles.actionButtonText}>Transferir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.addButton]}
              onPress={handleAddAccount}
            >
              <Image
                source={ICONS['add-circle']}
                style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
                resizeMode="contain"
              />
              <Text style={styles.actionButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de cuentas */}
          <View style={styles.accountsSection}>
            <Text style={styles.sectionTitle}>Mis Cuentas</Text>
            
            {accounts.length > 0 ? (
              <View style={styles.accountsList}>
                {accounts.map(renderAccountCard)}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Image
                  source={ICONS['wallet-outline']}
                  style={{ width: 60, height: 60, tintColor: '#CCCCCC' }}
                  resizeMode="contain"
                />
                <Text style={styles.emptyStateText}>No tienes cuentas creadas</Text>
                <TouchableOpacity style={styles.createFirstAccountButton} onPress={handleAddAccount}>
                  <Text style={styles.createFirstAccountText}>Crear primera cuenta</Text>
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
  menuButton: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
  },
  totalSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#30353D',
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  currencyRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
  },
  currencyTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A7691',
  },
  currencyCount: {
    fontSize: 12,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  transferButton: {
    backgroundColor: '#39515C',
  },
  addButton: {
    backgroundColor: '#3A7691',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  accountsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30353D',
    marginBottom: 16,
  },
  accountsList: {
    gap: 12,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeAccountCard: {
    borderColor: '#3A7691',
    backgroundColor: '#F0F8FF',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountSymbol: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  symbolText: {
    fontSize: 20,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  accountCurrency: {
    fontSize: 12,
    color: '#666666',
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#3A7691',
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceCurrency: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 6,
  },
  activeText: {
    fontSize: 12,
    color: '#3A7691',
    fontWeight: '500',
  },
  excludedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  excludedText: {
    fontSize: 11,
    color: '#999999',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  createFirstAccountButton: {
    backgroundColor: '#3A7691',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createFirstAccountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
