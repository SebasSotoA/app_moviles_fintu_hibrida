import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import EditAccountModal from '../../components/EditAccountModal';
import { useApp } from '../../src/shared/context/AppProvider';
import { DatabaseAccount } from '../../src/shared/services/database';

import { useStyles } from '../../src/shared/hooks';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

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

  const accountsStyles = useStyles(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    statusBarArea: {
      backgroundColor: colors.background.dark,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background.dark,
    },
    menuButton: {
      padding: 8,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
    },
    placeholder: {
      width: 44,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      padding: spacing[4],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.neutral.white,
    },
    loadingText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      marginTop: spacing[2],
    },
    totalSection: {
      backgroundColor: colors.primary[50],
      padding: spacing[4],
      borderRadius: 12,
      marginBottom: spacing[4],
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.primary[600],
      marginBottom: spacing[1],
    },
    totalAmount: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.primary[600],
    },
    totalSubtext: {
      fontSize: typography.fontSize.xs,
      color: colors.primary[500],
      marginTop: spacing[1],
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[6],
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      borderRadius: 12,
      gap: spacing[2],
    },
    transferButton: {
      backgroundColor: colors.primary[500],
    },
    addButton: {
      backgroundColor: colors.semantic.success,
    },
    actionButtonText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
    accountsSection: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing[4],
    },
    accountsList: {
      gap: spacing[3],
    },
    accountCard: {
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      padding: spacing[4],
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    activeAccountCard: {
      borderColor: colors.primary[500],
      borderWidth: 2,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    accountSymbol: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    symbolText: {
      fontSize: typography.fontSize.lg,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
    },
    accountCurrency: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    accountActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    editButton: {
      padding: spacing[2],
    },
    accountBalance: {
      alignItems: 'flex-end',
    },
    balanceAmount: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
    },
    balanceCurrency: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    activeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[2],
      gap: spacing[2],
    },
    activeText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary[500],
      fontWeight: typography.fontWeight.medium,
    },
    excludedIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[2],
      gap: spacing[2],
    },
    excludedText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing[8],
    },
    emptyStateText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      marginTop: spacing[2],
      textAlign: 'center',
    },
    createFirstAccountButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderRadius: 12,
      marginTop: spacing[4],
    },
    createFirstAccountText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
  }));

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
        accountsStyles.accountCard,
        currentAccount?.id === account.id && accountsStyles.activeAccountCard,
      ]}
      onPress={() => handleAccountPress(account.id)}
    >
      <View style={accountsStyles.accountHeader}>
        <View style={[accountsStyles.accountSymbol, { backgroundColor: account.color }]}>
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
            source={ICONS['create-outline']}
            style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
            resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={accountsStyles.accountBalance}>
            <Text style={[
              accountsStyles.balanceAmount,
              { color: account.balance >= 0 ? '#4CAF50' : '#FF6B6B' }
            ]}>
              {account.balance.toLocaleString('es-CO')}
            </Text>
            <Text style={accountsStyles.balanceCurrency}>{account.currency}</Text>
          </View>
        </View>
      </View>
      
      {currentAccount?.id === account.id && (
        <View style={accountsStyles.activeIndicator}>
          <Image
            source={ICONS['checkmark-circle']}
            style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
            resizeMode="contain"
          />
          <Text style={accountsStyles.activeText}>Cuenta activa</Text>
        </View>
      )}
      
      {!account.includeInTotal && (
        <View style={accountsStyles.excludedIndicator}>
          <Image
            source={ICONS['eye-off-outline']}
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
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      
      {/* Área superior con color del header */}
      <View style={[accountsStyles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={accountsStyles.header}>
        <TouchableOpacity onPress={openDrawer} style={accountsStyles.menuButton}>
          <Image
            source={ICONS['menu']}
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
      <SafeAreaView style={accountsStyles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={accountsStyles.content} showsVerticalScrollIndicator={false}>
          
          {/* Saldo total (concatenado por divisa) */}
          <View style={accountsStyles.totalSection}>
            <Text style={accountsStyles.totalLabel}>Saldo Total</Text>
            <Text style={accountsStyles.totalAmount}>{totalsSummary}</Text>
            <Text style={accountsStyles.totalSubtext}>
              {accounts.filter(acc => acc.includeInTotal).length} cuentas incluidas
            </Text>
          </View>

          {/* Botones de acción */}
          <View style={accountsStyles.actionButtons}>
            <TouchableOpacity 
              style={[accountsStyles.actionButton, accountsStyles.transferButton]}
              onPress={handleTransfer}
            >
              <Image
                source={ICONS['swap-horizontal']}
                style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
                resizeMode="contain"
              />
              <Text style={accountsStyles.actionButtonText}>Transferir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[accountsStyles.actionButton, accountsStyles.addButton]}
              onPress={handleAddAccount}
            >
              <Image
                source={ICONS['add-circle']}
                style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
                resizeMode="contain"
              />
              <Text style={accountsStyles.actionButtonText}>Añadir</Text>
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
                  source={ICONS['wallet-outline']}
                  style={{ width: 60, height: 60, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
                <Text style={accountsStyles.emptyStateText}>No tienes cuentas creadas</Text>
                <TouchableOpacity style={accountsStyles.createFirstAccountButton} onPress={handleAddAccount}>
                  <Text style={accountsStyles.createFirstAccountText}>Crear primera cuenta</Text>
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
