import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EditAccountModal from '../../components/EditAccountModal';
import { useApp } from '../../src/shared/context/AppProvider';
import { DatabaseAccount } from '../../src/shared/services/database';
import styles from '@/src/shared/styles/components/cuentas';
import colors from '../../src/shared/styles/themes';
import { darken } from 'polished';

// Mapa de íconos locales siguiendo el patrón de add-transaction.tsx
const ICONS: Record<string, any> = {
  'menu': require('../../assets/icons/menu.svg'),
  'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
  'eye-off-outline': require('../../assets/icons/eye-off-outline.svg'),
  'swap-horizontal': require('../../assets/icons/swap-horizontal.svg'),
  'add-circle': require('../../assets/icons/add-circle.svg'),
  'wallet-outline': require('../../assets/icons/wallet-outline.svg'),
  'create-outline': require('../../assets/icons/create-outline.svg'),
};

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
            <Image
            source={ICONS['create-outline']}
            style={{ width: 20, height: 20, tintColor: colors.primary }}
            resizeMode="contain"
            />
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
            style={{ width: 20, height: 20, tintColor: colors.primary }}
            resizeMode="contain"
          />
          <Text style={styles.activeText}>Cuenta activa</Text>
        </View>
      )}
      
      {!account.includeInTotal && (
        <View style={styles.excludedIndicator}>
          <Image
            source={ICONS['eye-off-outline']}
            style={{ width: 16, height: 16, tintColor: colors.gray }}
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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando cuentas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.grayDark} />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Image
            source={ICONS['menu']}
            style={{ width: 35, height: 35, tintColor: colors.white }}
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
                style={{ width: 20, height: 20, tintColor: colors.white }}
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
                style={{ width: 20, height: 20, tintColor: colors.white }}
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
                  style={{ width: 60, height: 60, tintColor: colors.gray }}
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