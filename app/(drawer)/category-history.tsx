import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal, Platform, StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import { DatabaseTransaction } from '../../src/shared/services/database';
import { getTransactionsByCategory } from '../../src/shared/services/transactions';

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
  const categoryColor = params.categoryColor as string || '#666666';
  
  // Validez del ID de categoría
  const isValidCategoryId = !!categoryId;
  
  // Notificar y salir si el ID es inválido (sin romper orden de hooks)
  useEffect(() => {
    if (!isValidCategoryId) {
      console.error('No categoryId provided');
      Alert.alert('Error', 'ID de categoría no válido');
      navigation.goBack();
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
          accountColor: account?.color || '#666666'
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
              } catch (dateError) {
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
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: categoryColor }]}>
          <Image
            source={ICONS[categoryIcon] || ICONS['list-outline']}
            style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>
            {item.note || categoryName}
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
    </View>
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
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
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
                  style={{ width: 16, height: 16, tintColor: '#666666' }}
                  resizeMode="contain"
                />
                <Text style={styles.filterButtonText}>{getAccountFilterText()}</Text>
                <Image
                  source={ICONS['chevron-down']}
                  style={{ width: 16, height: 16, tintColor: '#666666' }}
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
                  style={{ width: 16, height: 16, tintColor: '#666666' }}
                  resizeMode="contain"
                />
                <Text style={styles.filterButtonText}>
                  {filterMode === 'date' ? getDateFilterText() : 'Por cantidad'}
                </Text>
                <Image
                  source={ICONS['chevron-down']}
                  style={{ width: 16, height: 16, tintColor: '#666666' }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de transacciones */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3A7691" />
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
              style={{ width: 60, height: 60, tintColor: '#CCCCCC' }}
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
            style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
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
                  style={{ width: 24, height: 24, tintColor: '#666666' }}
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
                    style={{ width: 20, height: 20, tintColor: '#666666' }}
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
                    style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                      style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                  style={{ width: 24, height: 24, tintColor: '#666666' }}
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
                    style={{ width: 16, height: 16, tintColor: filterMode === 'amount' ? '#FFFFFF' : '#666666' }}
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
                        style={{ width: 20, height: 20, tintColor: '#666666' }}
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
                        style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                        style={{ width: 20, height: 20, tintColor: '#666666' }}
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
                        style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                        style={{ width: 20, height: 20, tintColor: '#666666' }}
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
                        style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                        style={{ width: 20, height: 20, tintColor: '#666666' }}
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
                        style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                        style={{ width: 20, height: 20, tintColor: '#666666' }}
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
                        style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
                    style={{ width: 20, height: 20, tintColor: '#3A7691' }}
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
    borderBottomColor: 'black',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  totalSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  filtersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  transactionsList: {
    paddingBottom: 100,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountSymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionAccount: {
    fontSize: 14,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: '#FF6B6B',
  },
  incomeAmount: {
    color: '#4ECDC4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  resetFilterButton: {
    backgroundColor: '#3A7691',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  resetFilterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
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
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeModeButton: {
    backgroundColor: '#3A7691',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeModeButtonText: {
    color: '#FFFFFF',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  selectedFilterOption: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#3A7691',
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  selectedFilterOptionText: {
    color: '#3A7691',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#3A7691',
    flex: 1,
    lineHeight: 20,
  },
});
