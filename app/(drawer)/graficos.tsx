import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ModernFinancialChart from '../../components/ModernFinancialChart';
import { useApp } from '../../src/shared/context/AppProvider';

const { width } = Dimensions.get('window');

type QuickFilter = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface QuickStats {
  totalTransactions: number;
  avgTransaction: number;
  highestIncome: number;
  highestExpense: number;
  netFlow: number;
}

export default function Graficos() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { getTransactionsByDateRange, currentAccount } = useApp();
  
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter>('month');
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalTransactions: 0,
    avgTransaction: 0,
    highestIncome: 0,
    highestExpense: 0,
    netFlow: 0
  });
  const [statsAnim] = useState(new Animated.Value(0));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadQuickStats();
  }, [activeQuickFilter, currentAccount?.id]);

  useEffect(() => {
    // Animate stats cards
    Animated.timing(statsAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [quickStats]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const getQuickFilterDateRange = (filter: QuickFilter) => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (filter) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        start.setMonth(currentQuarter * 3, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(currentQuarter * 3 + 3, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        return { startDate: start, endDate: end };
    }

    return { startDate: start, endDate: end };
  };

  const loadQuickStats = async () => {
    if (!currentAccount?.id) return;

    try {
      const { startDate, endDate } = getQuickFilterDateRange(activeQuickFilter);
      const transactions = await getTransactionsByDateRange(startDate.toISOString(), endDate.toISOString());
      
      const incomes = transactions.filter(t => t.type === 'INGRESO');
      const expenses = transactions.filter(t => t.type === 'GASTO');
      
      const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
      
      const stats: QuickStats = {
        totalTransactions: transactions.length,
        avgTransaction: transactions.length > 0 ? (totalIncome + totalExpense) / transactions.length : 0,
        highestIncome: incomes.length > 0 ? Math.max(...incomes.map(t => t.amount)) : 0,
        highestExpense: expenses.length > 0 ? Math.max(...expenses.map(t => t.amount)) : 0,
        netFlow: totalIncome - totalExpense
      };

      setQuickStats(stats);
    } catch (error) {
      console.error('Error loading quick stats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={35} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Análisis Avanzado</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Ionicons 
            name={showAdvancedFilters ? "options" : "filter"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Quick Filters */}
          <View style={styles.quickFiltersContainer}>
            <Text style={styles.sectionTitle}>Filtros Rápidos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              {[
                { key: 'today', label: 'Hoy', icon: 'today' },
                { key: 'week', label: 'Semana', icon: 'calendar' },
                { key: 'month', label: 'Mes', icon: 'calendar-outline' },
                { key: 'quarter', label: 'Trimestre', icon: 'stats-chart' },
                { key: 'year', label: 'Año', icon: 'time' }
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.quickFilterButton,
                    activeQuickFilter === filter.key && styles.activeQuickFilter
                  ]}
                  onPress={() => setActiveQuickFilter(filter.key as QuickFilter)}
                >
                  <Ionicons 
                    name={filter.icon as any} 
                    size={18} 
                    color={activeQuickFilter === filter.key ? '#FFFFFF' : '#3A7691'} 
                  />
                  <Text style={[
                    styles.quickFilterText,
                    activeQuickFilter === filter.key && styles.activeQuickFilterText
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStatsContainer}>
            <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>
            <View style={styles.statsGrid}>
              <Animated.View style={[
                styles.statCard,
                { opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]}
              ]}>
                <Ionicons name="receipt" size={24} color="#3A7691" />
                <Text style={styles.statValue}>{quickStats.totalTransactions}</Text>
                <Text style={styles.statLabel}>Transacciones</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                { opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]}
              ]}>
                <Ionicons name="calculator" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>${quickStats.avgTransaction.toFixed(0)}</Text>
                <Text style={styles.statLabel}>Promedio</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                { opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]}
              ]}>
                <Ionicons name="trending-up" size={24} color="#2196F3" />
                <Text style={styles.statValue}>${quickStats.highestIncome.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Mayor Ingreso</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                { opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]}
              ]}>
                <Ionicons name="trending-down" size={24} color="#F44336" />
                <Text style={styles.statValue}>${quickStats.highestExpense.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Mayor Gasto</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                styles.netFlowCard,
                { opacity: statsAnim, transform: [{ translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]}
              ]}>
                <Ionicons 
                  name={quickStats.netFlow >= 0 ? "wallet" : "alert-circle"} 
                  size={24} 
                  color={quickStats.netFlow >= 0 ? "#4CAF50" : "#FF9800"} 
                />
                <Text style={[
                  styles.statValue,
                  { color: quickStats.netFlow >= 0 ? "#4CAF50" : "#FF9800" }
                ]}>
                  ${Math.abs(quickStats.netFlow).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>
                  {quickStats.netFlow >= 0 ? "Ganancia Neta" : "Pérdida Neta"}
                </Text>
              </Animated.View>
            </View>
          </View>

          {/* Chart Component */}
          <ModernFinancialChart />
        </ScrollView>
      </SafeAreaView>
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
  filterToggle: {
    padding: 5,
    width: 38,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  quickFiltersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#30353D',
    marginBottom: 12,
  },
  filtersScroll: {
    paddingVertical: 4,
  },
  quickFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  activeQuickFilter: {
    backgroundColor: '#3A7691',
    borderColor: '#3A7691',
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  activeQuickFilterText: {
    color: '#FFFFFF',
  },
  quickStatsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3A7691',
  },
  netFlowCard: {
    width: '100%',
    borderLeftColor: '#4CAF50',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#30353D',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '500',
    textAlign: 'center',
  },
});

