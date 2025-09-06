import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal, Platform, StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import { useStyles } from '../../src/shared/hooks';
import { DatabaseTransaction } from '../../src/shared/services/database';
import { deleteTransaction, getTransactionsByCategory } from '../../src/shared/services/transactions';
import { headerStyles } from '../../src/shared/styles/components';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

interface TransactionWithAccount extends DatabaseTransaction {
  accountName: string;
  accountSymbol: string;
  accountColor: string;
}

type SortOption = 'amount' | 'date' | 'account';

export default function CategoryHistory() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { accounts } = useApp();
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
    backButton: {
      ...headerStyles.actionButton,
      marginRight: spacing[3],
    },
    headerCenter: headerStyles.center,
    headerTitle: headerStyles.title,
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    totalSection: {
      backgroundColor: colors.primary[500],
      padding: spacing[6],
      alignItems: 'center',
    },
    totalAmount: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
    },
    totalSubtitle: {
      fontSize: typography.fontSize.sm,
      color: colors.neutral.white,
      marginTop: spacing[1],
    },
    filtersSection: {
      flexDirection: 'row',
      padding: spacing[4],
      gap: spacing[3],
    },
    filterGroup: {
      flex: 1,
    },
    filterButton: {
      backgroundColor: colors.neutral.gray[100],
      borderRadius: 12,
      padding: spacing[3],
    },
    filterButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterButtonText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      flex: 1,
      marginHorizontal: spacing[2],
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
    transactionsList: {
      padding: spacing[4],
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing[8],
    },
    emptyText: {
      fontSize: typography.fontSize.base,
      color: colors.text.tertiary,
      textAlign: 'center',
      marginTop: spacing[4],
    },
    resetFilterButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderRadius: 25,
      marginTop: spacing[4],
    },
    resetFilterButtonText: {
      fontSize: typography.fontSize.base,
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.semibold,
    },
    fab: {
      position: 'absolute',
      bottom: spacing[6],
      right: spacing[6],
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
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
    modalBody: {
      padding: spacing[4],
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[3],
      borderRadius: 8,
      marginBottom: spacing[2],
    },
    selectedFilterOption: {
      backgroundColor: colors.primary[50],
    },
    filterOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    filterOptionText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      marginLeft: spacing[3],
    },
    selectedFilterOptionText: {
      color: colors.primary[600],
      fontWeight: typography.fontWeight.semibold,
    },
    accountSymbol: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
    },
    modeSelector: {
      flexDirection: 'row',
      backgroundColor: colors.neutral.gray[100],
      borderRadius: 12,
      padding: spacing[1],
      marginBottom: spacing[4],
    },
    modeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[3],
      borderRadius: 8,
    },
    activeModeButton: {
      backgroundColor: colors.primary[500],
    },
    modeButtonText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
      marginLeft: spacing[2],
    },
    activeModeButtonText: {
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.semibold,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[50],
      padding: spacing[4],
      borderRadius: 8,
    },
    infoText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing[3],
      flex: 1,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      marginBottom: spacing[2],
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing[1],
    },
    accountInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transactionAccount: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
      marginLeft: spacing[2],
    },
    transactionAmount: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
    },
    expenseAmount: {
      color: colors.semantic.error,
    },
    incomeAmount: {
      color: colors.semantic.success,
    },
    dateGroup: {
      marginBottom: spacing[6],
    },
    dateHeader: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.tertiary,
      marginBottom: spacing[3],
      paddingHorizontal: spacing[2],
    },
    // Estilos para modal de detalles de transacción
    transactionModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    transactionModalContainer: {
      backgroundColor: colors.neutral.white,
      borderRadius: 16,
      margin: spacing[4],
      maxWidth: '90%',
      minWidth: 300,
      ...Platform.select({
        ios: {
          shadowColor: colors.neutral.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    transactionModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    transactionModalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
    },
    transactionModalCloseButton: {
      padding: spacing[1],
    },
    transactionModalContent: {
      padding: spacing[4],
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    detailLabel: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
    },
    detailValue: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      flex: 1,
      textAlign: 'right',
    },
    detailAmount: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
    },
    detailAmountExpense: {
      color: colors.semantic.error,
    },
    detailAmountIncome: {
      color: colors.semantic.success,
    },
    modalActions: {
      flexDirection: 'row',
      padding: spacing[4],
      gap: spacing[3],
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing[3],
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.neutral.gray[100],
    },
    cancelButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
    },
    deleteButton: {
      backgroundColor: colors.semantic.error,
    },
    deleteButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
  }));
  
  // Mapa de íconos locales (puedes agregar los SVG/PNG luego en assets/icons)
  const ICONS: Record<string, any> = {
    'arrow-back': require('../../assets/icons/arrow-back.svg'),
    'card': require('../../assets/icons/home-outline.svg'),
    'chevron-down': require('../../assets/icons/chevron-down.svg'),
    'calendar': require('../../assets/icons/calendar-outline.svg'),
    'trending-up': require('../../assets/icons/bar-chart-outline.svg'),
    'receipt-outline': require('../../assets/icons/wallet-outline.svg'),
    'close': require('../../assets/icons/close.svg'),
    'apps': require('../../assets/icons/person-circle-outline.svg'),
    'checkmark': require('../../assets/icons/checkmark-circle.svg'),
    'infinite': require('../../assets/icons/arrow-forward.svg'),
    'today': require('../../assets/icons/arrow-forward-outline.svg'),
    'calendar-outline': require('../../assets/icons/calendar-outline.svg'),
    'calendar-number': require('../../assets/icons/calendar-outline.svg'),
    'information-circle': require('../../assets/icons/settings-outline.svg'),
    'add': require('../../assets/icons/arrow-forward-outline.svg'),
    'list-outline': require('../../assets/icons/list-outline.svg'),
  };

  // Parámetros de la categoría con validación
  const categoryId = params.categoryId as string | undefined;
  const categoryName = params.categoryName as string || 'Categoría';
  const categoryIcon = params.categoryIcon as string || 'list-outline';
  const categoryColor = params.categoryColor as string || colors.text.tertiary;
  
  // Validez del ID de categoría
  const isValidCategoryId = !!categoryId;
  
  // Notificar y salir si el ID es inválido (sin romper orden de hooks)
  useEffect(() => {
    if (!isValidCategoryId) {
      console.warn('No categoryId provided');
      Alert.alert('Error', 'ID de categoría no válido', [
        {
          text: 'OK',
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              router.replace('/(drawer)');
            }
          }
        }
      ]);
    }
  }, [isValidCategoryId, navigation]);
  
  // Estados
  const [transactions, setTransactions] = useState<TransactionWithAccount[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);
  
  // Estados de filtros
  const [filterMode, setFilterMode] = useState<'date' | 'amount'>('date');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState<{startDate: Date, endDate: Date}>({
    startDate: new Date(),
    endDate: new Date()
  });
  
  // Estados de modales
  const [showAccountFilter, setShowAccountFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // Estados para modal de detalles
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithAccount | null>(null);
  
  // Clave para persistencia
  const STORAGE_KEY = `category_history_filters_${categoryId}`;

  // Storage wrapper más robusto para Android (memoizado)
  const storageWrapper = useMemo(() => ({
    async getItem(key: string): Promise<string | null> {
      try {
        if (Platform.OS === 'web') {
          return localStorage.getItem(key);
        }
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.warn('Storage getItem failed:', error);
        return null;
      }
    },
    async setItem(key: string, value: string): Promise<void> {
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem(key, value);
        } else {
          await AsyncStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn('Storage setItem failed:', error);
      }
    }
  }), []);

  // Cargar filtros guardados
  const loadSavedFilters = useCallback(async () => {
    try {
      const savedFilters = await storageWrapper.getItem(STORAGE_KEY);
      if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        setSelectedAccount(filters.selectedAccount || 'all');
        setFilterMode(filters.filterMode || 'date');
        setDateFilter(filters.dateFilter || 'all');
        if (filters.customDateRange) {
          setCustomDateRange({
            startDate: new Date(filters.customDateRange.startDate),
            endDate: new Date(filters.customDateRange.endDate)
          });
        }
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  }, [STORAGE_KEY, storageWrapper]);

  // Guardar filtros
  const saveFilters = useCallback(async () => {
    try {
      const filters = {
        selectedAccount,
        filterMode,
        dateFilter,
        customDateRange
      };
      await storageWrapper.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [selectedAccount, filterMode, dateFilter, customDateRange, STORAGE_KEY, storageWrapper]);

  // Cargar transacciones de la categoría con información de cuentas
  const loadCategoryTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!isValidCategoryId) {
        setTransactions([]);
        setFilteredTotalAmount(0);
        return;
      }
      // Obtener transacciones de la categoría
      const categoryTransactions = await getTransactionsByCategory(categoryId);
      
      if (!categoryTransactions || !Array.isArray(categoryTransactions)) {
        console.warn('No transactions returned or invalid format');
        setTransactions([]);
        return;
      }
      
      // Enriquecer transacciones con información de cuentas
      const transactionsWithAccounts: TransactionWithAccount[] = categoryTransactions.map(transaction => {
        const account = accounts.find(acc => acc.id === transaction.accountId);
        return {
          ...transaction,
          accountName: account?.name || 'Cuenta desconocida',
          accountSymbol: account?.symbol || '💰',
          accountColor: account?.color || colors.text.tertiary
        };
      });
      
      setTransactions(transactionsWithAccounts);
      
      // Nota: ya no calculamos totalAmount global no usado
    } catch (error) {
      console.error('Error loading transactions:', error);
      // En Android, mostrar un mensaje más amigable
      if (Platform.OS === 'android') {
        Alert.alert(
          'Error de Carga',
          'No se pudieron cargar las transacciones. Verifica tu conexión e intenta de nuevo.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', 'No se pudieron cargar las transacciones');
      }
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, accounts, isValidCategoryId]);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    try {
      if (!transactions || !Array.isArray(transactions)) {
        setFilteredTransactions([]);
        setFilteredTotalAmount(0);
        return;
      }
      
      let filtered = [...transactions];
      
      // Filtrar por cuenta
      if (selectedAccount !== 'all') {
        filtered = filtered.filter(t => t.accountId === selectedAccount);
      }
      
      // Filtrar por fecha
      if (filterMode === 'date' && dateFilter !== 'all') {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;
        
        try {
          switch (dateFilter) {
            case 'today':
              startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
              break;
            case 'week':
              const dayOfWeek = now.getDay();
              startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
              endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - dayOfWeek), 23, 59, 59);
              break;
            case 'month':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
              break;
            case 'custom':
              startDate = customDateRange.startDate;
              endDate = customDateRange.endDate;
              break;
            default:
              startDate = new Date(0);
              endDate = new Date();
          }
          
          filtered = filtered.filter(t => {
            try {
              const transactionDate = new Date(t.date);
              return transactionDate >= startDate && transactionDate <= endDate;
            } catch {
              console.warn('Invalid transaction date:', t.date);
              return false;
            }
          });
        } catch (dateFilterError) {
          console.warn('Date filter error:', dateFilterError);
        }
      }
      
      // Ordenar
      try {
        filtered.sort((a, b) => {
          let comparison = 0;
          
          switch (sortBy) {
            case 'amount':
              comparison = (a.amount || 0) - (b.amount || 0);
              break;
            case 'date':
              try {
                const dateA = new Date(a.date || 0).getTime();
                const dateB = new Date(b.date || 0).getTime();
                comparison = dateA - dateB;
              } catch {
                comparison = 0;
              }
              break;
            case 'account':
              comparison = (a.accountName || '').localeCompare(b.accountName || '');
              break;
          }
          
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      } catch (sortError) {
        console.warn('Sort error:', sortError);
      }
      
      setFilteredTransactions(filtered);
      
      // Calcular total filtrado
      try {
        const filteredTotal = filtered.reduce((sum, t) => {
          const amount = t.amount || 0;
          if (t.type === 'GASTO') {
            return sum - amount;
          } else {
            return sum + amount;
          }
        }, 0);
        
        setFilteredTotalAmount(Math.abs(filteredTotal));
      } catch (totalError) {
        console.warn('Total calculation error:', totalError);
        setFilteredTotalAmount(0);
      }
    } catch (error) {
      console.error('Filter application error:', error);
      setFilteredTransactions([]);
      setFilteredTotalAmount(0);
    }
  }, [transactions, selectedAccount, filterMode, dateFilter, customDateRange, sortBy, sortDirection]);

  // Guardar filtros cuando cambien
  useEffect(() => {
    saveFilters();
  }, [selectedAccount, filterMode, dateFilter, customDateRange, saveFilters]);

  // Cargar datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (!isValidCategoryId) return;
      loadSavedFilters();
      loadCategoryTransactions();
    }, [isValidCategoryId, loadSavedFilters, loadCategoryTransactions])
  );

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-CO', { month: 'long' });
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  // Función para eliminar transacción
  const handleDeleteTransaction = async (transactionId: string) => {
    console.log('🔴 handleDeleteTransaction called with ID:', transactionId);
    try {
      // Mostrar confirmación usando window.confirm para web
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.'
      );
      
      if (confirmed) {
        console.log('🔴 User confirmed deletion');
        try {
          // Eliminar de la base de datos
          console.log('🔴 Calling deleteTransaction...');
          await deleteTransaction(transactionId);
          console.log('🔴 Transaction deleted successfully');
          
          // Actualizar el estado local
          const updatedTransactions = transactions.filter(t => t.id !== transactionId);
          setTransactions(updatedTransactions);
          
          // Cerrar modal
          setShowTransactionModal(false);
          setSelectedTransaction(null);
          
          // Mostrar confirmación de éxito
          alert('Transacción eliminada correctamente');
        } catch (error) {
          console.error('Error deleting transaction:', error);
          alert('No se pudo eliminar la transacción');
        }
      } else {
        console.log('🔴 User cancelled deletion');
      }
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  };

  // Agrupar transacciones por fecha
  const groupTransactionsByDate = () => {
    const groups: { [key: string]: TransactionWithAccount[] } = {};
    
    filteredTransactions.forEach(transaction => {
      const date = formatDate(transaction.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });
    
    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions
    }));
  };

  const groupedTransactions = groupTransactionsByDate();

  // Función para cambiar filtro de cuenta
  const handleAccountFilterChange = (accountId: string) => {
    setSelectedAccount(accountId);
    setShowAccountFilter(false);
  };

  // Función para cambiar filtro de fecha
  const handleDateFilterChange = (filter: 'all' | 'today' | 'week' | 'month' | 'custom') => {
    setDateFilter(filter);
    setShowDateFilter(false);
  };

  // Función para cambiar modo de filtro
  const handleFilterModeChange = (mode: 'date' | 'amount') => {
    setFilterMode(mode);
    if (mode === 'amount') {
      setSortBy('amount');
      setSortDirection('desc');
    } else {
      setSortBy('date');
      setSortDirection('desc');
    }
  };

  // Obtener texto del filtro de cuenta
  const getAccountFilterText = () => {
    if (selectedAccount === 'all') {
      return 'Total';
    }
    const account = accounts.find(acc => acc.id === selectedAccount);
    return account ? `${account.symbol} ${account.name}` : 'Cuenta seleccionada';
  };

  // Obtener texto del filtro de fecha
  const getDateFilterText = () => {
    switch (dateFilter) {
      case 'today':
        return 'Hoy';
      case 'week':
        return 'Esta semana';
      case 'month':
        return 'Este mes';
      case 'custom':
        return 'Rango personalizado';
      default:
        return 'Todas';
    }
  };

  const renderTransactionItem = ({ item }: { item: TransactionWithAccount }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => {
        setSelectedTransaction(item);
        setShowTransactionModal(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: categoryColor }]}>
          <Image
            source={ICONS[categoryIcon] || ICONS['list-outline']}
            style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>
            {categoryName}
          </Text>
          <View style={styles.accountInfo}>
            <Text style={[styles.accountSymbol, { color: item.accountColor }]}>
              {item.accountSymbol}
            </Text>
            <Text style={styles.transactionAccount}>{item.accountName}</Text>
          </View>
        </View>
      </View>
      <Text style={[
        styles.transactionAmount,
        item.type === 'GASTO' ? styles.expenseAmount : styles.incomeAmount
      ]}>
        {item.type === 'GASTO' ? '-' : '+'}
        {item.amount.toLocaleString('es-CO')} COL$
      </Text>
    </TouchableOpacity>
  );

  const renderDateGroup = ({ item }: { item: { date: string; transactions: TransactionWithAccount[] } }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{item.date}</Text>
      {item.transactions.map(transaction => (
        <View key={transaction.id}>
          {renderTransactionItem({ item: transaction })}
        </View>
      ))}
    </View>
  );



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            router.replace('/(drawer)');
          }
        }} style={styles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 24, height: 24, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
        </View>
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        {/* Total de la categoría */}
        <View style={styles.totalSection}>
          <Text style={styles.totalAmount}>
            {filteredTotalAmount.toLocaleString('es-CO')} COL$
          </Text>
          {selectedAccount !== 'all' && (
            <Text style={styles.totalSubtitle}>
              Filtrado por cuenta específica
            </Text>
          )}
        </View>

        {/* Filtros */}
        <View style={styles.filtersSection}>
          {/* Filtro por cuenta */}
          <View style={styles.filterGroup}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowAccountFilter(true)}
            >
              <View style={styles.filterButtonContent}>
                <Image
                  source={ICONS['card']}
                  style={{ width: 16, height: 16, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
                <Text style={styles.filterButtonText}>{getAccountFilterText()}</Text>
                <Image
                  source={ICONS['chevron-down']}
                  style={{ width: 16, height: 16, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Filtro por fecha/cantidad */}
          <View style={styles.filterGroup}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowDateFilter(true)}
            >
              <View style={styles.filterButtonContent}>
                <Image
                  source={ICONS[filterMode === 'date' ? 'calendar' : 'trending-up']}
                  style={{ width: 16, height: 16, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
                <Text style={styles.filterButtonText}>
                  {filterMode === 'date' ? getDateFilterText() : 'Por cantidad'}
                </Text>
                <Image
                  source={ICONS['chevron-down']}
                  style={{ width: 16, height: 16, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de transacciones */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={styles.loadingText}>Cargando transacciones...</Text>
          </View>
        ) : filteredTransactions.length > 0 ? (
          <FlatList
            data={groupedTransactions}
            renderItem={renderDateGroup}
            keyExtractor={(item) => item.date}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={ICONS['receipt-outline']}
              style={{ width: 60, height: 60, tintColor: colors.text.tertiary }}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>
              {selectedAccount !== 'all' 
                ? 'No hay transacciones en esta cuenta para esta categoría'
                : 'No hay transacciones para mostrar en esta categoría'
              }
            </Text>
            {selectedAccount !== 'all' && (
              <TouchableOpacity
                style={styles.resetFilterButton}
                onPress={() => setSelectedAccount('all')}
              >
                <Text style={styles.resetFilterButtonText}>
                  Ver todas las cuentas
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Botón flotante para agregar transacción */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('/(drawer)/add-transaction')}
        >
          <Image
            source={ICONS['add']}
            style={{ width: 24, height: 24, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Modal Filtro por Cuenta */}
      <Modal
        visible={showAccountFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAccountFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por cuenta</Text>
              <TouchableOpacity 
                onPress={() => setShowAccountFilter(false)}
                style={styles.closeButton}
              >
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedAccount === 'all' && styles.selectedFilterOption
                ]}
                onPress={() => handleAccountFilterChange('all')}
              >
                <View style={styles.filterOptionContent}>
                  <Image
                    source={ICONS['apps']}
                    style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
                    resizeMode="contain"
                  />
                  <Text style={[
                    styles.filterOptionText,
                    selectedAccount === 'all' && styles.selectedFilterOptionText
                  ]}>
                    Total
                  </Text>
                </View>
                {selectedAccount === 'all' && (
                  <Image
                    source={ICONS['checkmark']}
                    style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.filterOption,
                    selectedAccount === account.id && styles.selectedFilterOption
                  ]}
                  onPress={() => handleAccountFilterChange(account.id)}
                >
                  <View style={styles.filterOptionContent}>
                    <Text style={[styles.accountSymbol, { color: account.color }]}>
                      {account.symbol}
                    </Text>
                    <Text style={[
                      styles.filterOptionText,
                      selectedAccount === account.id && styles.selectedFilterOptionText
                    ]}>
                      {account.name}
                    </Text>
                  </View>
                  {selectedAccount === account.id && (
                    <Image
                      source={ICONS['checkmark']}
                      style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Filtro por Fecha/Cantidad */}
      <Modal
        visible={showDateFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity 
                onPress={() => setShowDateFilter(false)}
                style={styles.closeButton}
              >
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              {/* Selector de modo */}
              <View style={styles.modeSelector}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    filterMode === 'date' && styles.activeModeButton
                  ]}
                  onPress={() => handleFilterModeChange('date')}
                >
                  <Image
                    source={ICONS['calendar']}
                    style={{ width: 16, height: 16, tintColor: filterMode === 'date' ? '#FFFFFF' : '#666666' }}
                    resizeMode="contain"
                  />
                  <Text style={[
                    styles.modeButtonText,
                    filterMode === 'date' && styles.activeModeButtonText
                  ]}>
                    Fecha
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    filterMode === 'amount' && styles.activeModeButton
                  ]}
                  onPress={() => handleFilterModeChange('amount')}
                >
                  <Image
                    source={ICONS['trending-up']}
                    style={{ width: 16, height: 16, tintColor: filterMode === 'date' ? '#FFFFFF' : '#666666' }}
                    resizeMode="contain"
                  />
                  <Text style={[
                    styles.modeButtonText,
                    filterMode === 'amount' && styles.activeModeButtonText
                  ]}>
                    Cantidad
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Opciones de filtro por fecha */}
              {filterMode === 'date' && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      dateFilter === 'all' && styles.selectedFilterOption
                    ]}
                    onPress={() => handleDateFilterChange('all')}
                  >
                    <View style={styles.filterOptionContent}>
                      <Image
                        source={ICONS['infinite']}
                        style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.filterOptionText,
                        dateFilter === 'all' && styles.selectedFilterOptionText
                      ]}>
                        Todas
                      </Text>
                    </View>
                    {dateFilter === 'all' && (
                      <Image
                        source={ICONS['checkmark']}
                        style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      dateFilter === 'today' && styles.selectedFilterOption
                    ]}
                    onPress={() => handleDateFilterChange('today')}
                  >
                    <View style={styles.filterOptionContent}>
                      <Image
                        source={ICONS['today']}
                        style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.filterOptionText,
                        dateFilter === 'today' && styles.selectedFilterOptionText
                      ]}>
                        Hoy
                      </Text>
                    </View>
                    {dateFilter === 'today' && (
                      <Image
                        source={ICONS['checkmark']}
                        style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      dateFilter === 'week' && styles.selectedFilterOption
                    ]}
                    onPress={() => handleDateFilterChange('week')}
                  >
                    <View style={styles.filterOptionContent}>
                      <Image
                        source={ICONS['calendar-outline']}
                        style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.filterOptionText,
                        dateFilter === 'week' && styles.selectedFilterOptionText
                      ]}>
                        Esta semana
                      </Text>
                    </View>
                    {dateFilter === 'week' && (
                      <Image
                        source={ICONS['checkmark']}
                        style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      dateFilter === 'month' && styles.selectedFilterOption
                    ]}
                    onPress={() => handleDateFilterChange('month')}
                  >
                    <View style={styles.filterOptionContent}>
                      <Image
                        source={ICONS['calendar']}
                        style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.filterOptionText,
                        dateFilter === 'month' && styles.selectedFilterOptionText
                      ]}>
                        Este mes
                      </Text>
                    </View>
                    {dateFilter === 'month' && (
                      <Image
                        source={ICONS['checkmark']}
                        style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      dateFilter === 'custom' && styles.selectedFilterOption
                    ]}
                    onPress={() => handleDateFilterChange('custom')}
                  >
                    <View style={styles.filterOptionContent}>
                      <Image
                        source={ICONS['calendar-number']}
                        style={{ width: 20, height: 20, tintColor: colors.text.tertiary }}
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.filterOptionText,
                        dateFilter === 'custom' && styles.selectedFilterOptionText
                      ]}>
                        Rango personalizado
                      </Text>
                    </View>
                    {dateFilter === 'custom' && (
                      <Image
                        source={ICONS['checkmark']}
                        style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                </>
              )}

              {/* Información del modo cantidad */}
              {filterMode === 'amount' && (
                <View style={styles.infoBox}>
                  <Image
                    source={ICONS['information-circle']}
                    style={{ width: 20, height: 20, tintColor: colors.primary[500] }}
                    resizeMode="contain"
                  />
                  <Text style={styles.infoText}>
                    Las transacciones se ordenarán por cantidad de mayor a menor, agrupadas por fecha
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de detalles de transacción */}
      <Modal
        visible={showTransactionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTransactionModal(false)}
        accessibilityViewIsModal={true}
        accessibilityLabel="Detalles de la transacción"
      >
        <View style={styles.transactionModalOverlay}>
          <View 
            style={styles.transactionModalContainer}
            accessibilityLabel="Detalles de la transacción"
            accessible={true}
          >
            {/* Header del modal */}
            <View style={styles.transactionModalHeader}>
              <Text style={styles.transactionModalTitle}>Detalles de Transacción</Text>
              <TouchableOpacity
                style={styles.transactionModalCloseButton}
                onPress={() => setShowTransactionModal(false)}
              >
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Contenido del modal */}
            {selectedTransaction && (
              <View style={styles.transactionModalContent}>
                {/* Cantidad */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cantidad</Text>
                  <Text style={[
                    styles.detailValue,
                    styles.detailAmount,
                    selectedTransaction.type === 'GASTO' 
                      ? styles.detailAmountExpense 
                      : styles.detailAmountIncome
                  ]}>
                    {selectedTransaction.type === 'GASTO' ? '-' : '+'}
                    {selectedTransaction.amount.toLocaleString('es-CO')} COL$
                  </Text>
                </View>

                {/* Cuenta */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cuenta</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <Text style={[styles.detailValue, { color: selectedTransaction.accountColor, marginRight: spacing[2] }]}>
                      {selectedTransaction.accountSymbol}
                    </Text>
                    <Text style={styles.detailValue}>
                      {selectedTransaction.accountName}
                    </Text>
                  </View>
                </View>

                {/* Categoría */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Categoría</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={[styles.transactionIcon, { backgroundColor: categoryColor, width: 24, height: 24, marginRight: spacing[4] }]}>
                      <Image
                        source={ICONS[categoryIcon] || ICONS['list-outline']}
                        style={{ width: 12, height: 12, tintColor: colors.neutral.white }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.detailValue}>
                      {categoryName}
                    </Text>
                  </View>
                </View>

                {/* Fecha */}
                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedTransaction.date)}
                  </Text>
                </View>

                {/* Nota (si existe) */}
                {selectedTransaction.note && (
                  <View style={[styles.detailRow, { borderBottomWidth: 0, marginTop: spacing[2] }]}>
                    <Text style={styles.detailLabel}>Nota</Text>
                    <Text style={[styles.detailValue, { textAlign: 'right', flex: 1 }]}>
                      {selectedTransaction.note}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setShowTransactionModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cerrar modal"
                accessibilityHint="Cierra el modal de detalles de transacción"
              >
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => {
                  console.log('🔴 Delete button pressed, selectedTransaction:', selectedTransaction);
                  if (selectedTransaction) {
                    handleDeleteTransaction(selectedTransaction.id);
                  } else {
                    console.log('🔴 No selectedTransaction found');
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel="Eliminar transacción"
                accessibilityHint="Elimina esta transacción permanentemente"
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
