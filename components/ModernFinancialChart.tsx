import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Modal,
} from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { useApp } from '../src/shared/context/AppProvider';
import breakpoints from '../src/shared/styles/breakpoints';

const { width } = Dimensions.get('window');
const isTablet = width >= breakpoints.tablet;

type FilterPeriod = 'Día' | 'Semana' | 'Mes' | 'Año';
type ChartType = 'bar' | 'line' | 'pie';
type DataType = 'Ingresos' | 'Gastos' | 'Beneficios' | 'Pérdida' | 'Resumen';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface PieChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface FinancialData {
  ingresos: number;
  gastos: number;
  beneficios: number;
  perdida: number;
}

export default function ModernFinancialChart() {
  const { getTransactionsByDateRange, currentAccount } = useApp();
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('Mes');
  const [activeDataType, setActiveDataType] = useState<DataType>('Resumen');
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [summaryData, setSummaryData] = useState<FinancialData>({
    ingresos: 0,
    gastos: 0,
    beneficios: 0,
    perdida: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<{x: number, y: number, value: string, label: string} | null>(null);
  const summaryCardsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  useEffect(() => {
    loadChartData();
  }, [activePeriod, activeDataType, currentDate, currentAccount?.id]);

  useEffect(() => {
    // Reset animations when data type changes
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    slideAnim.setValue(50);
  }, [activeDataType, chartType]);

  useEffect(() => {
    // Animate summary cards on mount
    const animations = summaryCardsAnim.map((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, [summaryData]);

  const getDateRange = (date: Date, period: FilterPeriod) => {
    const start = new Date(date);
    const end = new Date(date);

    switch (period) {
      case 'Día':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Semana':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Mes':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Año':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { startDate: start, endDate: end };
  };

  const generateLabelsForPeriod = (date: Date, period: FilterPeriod): string[] => {
    const labels: string[] = [];
    
    switch (period) {
      case 'Día':
        for (let i = 0; i < 24; i += 4) {
          labels.push(`${i}:00`);
        }
        break;
      case 'Semana':
        const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        labels.push(...weekDays);
        break;
      case 'Mes':
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const step = Math.ceil(daysInMonth / 8);
        for (let i = 1; i <= daysInMonth; i += step) {
          labels.push(`${i}`);
        }
        break;
      case 'Año':
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        labels.push(...months);
        break;
    }
    
    return labels;
  };

  const aggregateDataByPeriod = (transactions: any[], period: FilterPeriod, labels: string[]): number[] => {
    const data = new Array(labels.length).fill(0);
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      let index = 0;
      
      switch (period) {
        case 'Día':
          index = Math.floor(transactionDate.getHours() / 4);
          break;
        case 'Semana':
          index = transactionDate.getDay();
          break;
        case 'Mes':
          const dayOfMonth = transactionDate.getDate();
          const step = Math.ceil(new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0).getDate() / 8);
          index = Math.min(Math.floor((dayOfMonth - 1) / step), labels.length - 1);
          break;
        case 'Año':
          index = transactionDate.getMonth();
          break;
      }
      
      if (index >= 0 && index < data.length) {
        if (activeDataType === 'Ingresos' && transaction.type === 'INGRESO') {
          data[index] += transaction.amount;
        } else if (activeDataType === 'Gastos' && transaction.type === 'GASTO') {
          data[index] += transaction.amount;
        }
      }
    });
    
    return data;
  };

  const getDataTypeColor = (dataType: DataType, opacity: number = 1): string => {
    const colors = {
      'Ingresos': `rgba(76, 175, 80, ${opacity})`,
      'Gastos': `rgba(244, 67, 54, ${opacity})`,
      'Beneficios': `rgba(58, 118, 145, ${opacity})`,
      'Pérdida': `rgba(255, 152, 0, ${opacity})`,
      'Resumen': `rgba(103, 58, 183, ${opacity})`
    };
    return colors[dataType] || `rgba(158, 158, 158, ${opacity})`;
  };

  const processTransactionData = (transactions: any[], period: FilterPeriod) => {
    const labels = generateLabelsForPeriod(currentDate, period);
    
    const totalIngresos = transactions
      .filter(tx => tx.type === 'INGRESO')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalGastos = transactions
      .filter(tx => tx.type === 'GASTO')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const beneficios = Math.max(0, totalIngresos - totalGastos);
    const perdida = Math.max(0, totalGastos - totalIngresos);

    let data: number[] = [];
    
    if (activeDataType === 'Resumen') {
      data = [totalIngresos, totalGastos];
    } else {
      data = aggregateDataByPeriod(transactions, period, labels);
    }

    const chartData: ChartData = {
      labels: activeDataType === 'Resumen' ? ['Ingresos', 'Gastos'] : labels,
      datasets: [{
        data,
        color: (opacity = 1) => getDataTypeColor(activeDataType, opacity),
        strokeWidth: 3
      }]
    };

    const summaryData: FinancialData = {
      ingresos: totalIngresos,
      gastos: totalGastos,
      beneficios,
      perdida
    };

    const pieChartData: PieChartData[] = [
      {
        name: 'Ingresos',
        amount: totalIngresos,
        color: getDataTypeColor('Ingresos'),
        legendFontColor: '#666666',
        legendFontSize: 14
      },
      {
        name: 'Gastos',
        amount: totalGastos,
        color: getDataTypeColor('Gastos'),
        legendFontColor: '#666666',
        legendFontSize: 14
      }
    ].filter(item => item.amount > 0);

    return { chartData, summaryData, pieChartData };
  };

  const loadChartData = async () => {
    if (!currentAccount?.id) return;
    
    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateRange(currentDate, activePeriod);
      const transactions = await getTransactionsByDateRange(startDate.toISOString(), endDate.toISOString());
      
      const data = processTransactionData(transactions, activePeriod);
      setChartData(data.chartData);
      setSummaryData(data.summaryData);
      setPieChartData(data.pieChartData);
      
      // Animate chart appearance with multiple animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    // Add smooth transition animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    const newDate = new Date(currentDate);
    
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }
    
    const multiplier = direction === 'next' ? 1 : -1;
    
    switch (activePeriod) {
      case 'Día':
        newDate.setDate(newDate.getDate() + multiplier);
        break;
      case 'Semana':
        newDate.setDate(newDate.getDate() + (7 * multiplier));
        break;
      case 'Mes':
        newDate.setMonth(newDate.getMonth() + multiplier);
        break;
      case 'Año':
        newDate.setFullYear(newDate.getFullYear() + multiplier);
        break;
    }
    
    setCurrentDate(newDate);
  };

  const handleChartPress = (data: { index: number; value: number; dataset: any; x: number; y: number; getColor: (opacity: number) => string; }) => {
    if (!data || !chartData) return;
    
    const value = data.value;
    const label = chartData.labels[data.index];
    
    setTooltipData({
      x: data.x,
      y: data.y - 50,
      value: `$${value.toLocaleString()}`,
      label: label
    });
    setTooltipVisible(true);
    
    // Auto hide tooltip after 3 seconds
    setTimeout(() => setTooltipVisible(false), 3000);
  };

  const formatDateDisplay = (): string => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (activePeriod) {
      case 'Día':
        options.weekday = 'long';
        options.day = 'numeric';
        options.month = 'long';
        break;
      case 'Semana':
        const { startDate } = getDateRange(currentDate, 'Semana');
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return `${startDate.getDate()} - ${endDate.getDate()} ${endDate.toLocaleDateString('es-ES', { month: 'long' })}`;
      case 'Mes':
        options.month = 'long';
        options.year = 'numeric';
        break;
      case 'Año':
        options.year = 'numeric';
        break;
    }
    
    return currentDate.toLocaleDateString('es-ES', options);
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => getDataTypeColor(activeDataType, opacity),
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: getDataTypeColor(activeDataType)
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#f0f0f0',
      strokeWidth: 1
    }
  };

  if (!currentAccount) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="analytics-outline" size={80} color="#E0E0E0" />
        <Text style={styles.emptyStateTitle}>Selecciona una cuenta</Text>
        <Text style={styles.emptyStateText}>Elige una cuenta para ver los análisis financieros</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Análisis Financiero</Text>
        <Text style={styles.accountName}>{currentAccount.name}</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Animated.View style={[
            styles.summaryCard, 
            styles.incomeCard,
            {
              opacity: summaryCardsAnim[0],
              transform: [
                { translateY: summaryCardsAnim[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })},
                { scale: summaryCardsAnim[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })}
              ]
            }
          ]}>
            <Ionicons name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.summaryValue}>${summaryData.ingresos.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Ingresos</Text>
          </Animated.View>
          <Animated.View style={[
            styles.summaryCard, 
            styles.expenseCard,
            {
              opacity: summaryCardsAnim[1],
              transform: [
                { translateY: summaryCardsAnim[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })},
                { scale: summaryCardsAnim[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })}
              ]
            }
          ]}>
            <Ionicons name="trending-down" size={24} color="#F44336" />
            <Text style={styles.summaryValue}>${summaryData.gastos.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Gastos</Text>
          </Animated.View>
        </View>
        <View style={styles.summaryRow}>
          <Animated.View style={[
            styles.summaryCard, 
            styles.profitCard,
            {
              opacity: summaryCardsAnim[2],
              transform: [
                { translateY: summaryCardsAnim[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })},
                { scale: summaryCardsAnim[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })}
              ]
            }
          ]}>
            <Ionicons name="wallet" size={24} color="#3A7691" />
            <Text style={styles.summaryValue}>${summaryData.beneficios.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Beneficios</Text>
          </Animated.View>
          <Animated.View style={[
            styles.summaryCard, 
            styles.lossCard,
            {
              opacity: summaryCardsAnim[3],
              transform: [
                { translateY: summaryCardsAnim[3].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })},
                { scale: summaryCardsAnim[3].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })}
              ]
            }
          ]}>
            <Ionicons name="alert-circle" size={24} color="#FF9800" />
            <Text style={styles.summaryValue}>${summaryData.perdida.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Pérdidas</Text>
          </Animated.View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodContainer}
        >
          {(['Día', 'Semana', 'Mes', 'Año'] as FilterPeriod[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                activePeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setActivePeriod(period)}
              accessibilityLabel={`Filtrar por ${period.toLowerCase()}`}
              accessibilityRole="button"
              accessibilityState={{ selected: activePeriod === period }}
            >
              <Text style={[
                styles.periodText,
                activePeriod === period && styles.activePeriodText
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.dataTypeContainer}
        >
          {(['Resumen', 'Ingresos', 'Gastos', 'Beneficios', 'Pérdida'] as DataType[]).map((dataType) => (
            <TouchableOpacity
              key={dataType}
              style={[
                styles.dataTypeButton,
                activeDataType === dataType && styles.activeDataTypeButton,
                { borderColor: getDataTypeColor(dataType) }
              ]}
              onPress={() => setActiveDataType(dataType)}
            >
              <Text style={[
                styles.dataTypeText,
                activeDataType === dataType && { color: getDataTypeColor(dataType) }
              ]}>
                {dataType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateDate('prev')}>
          <Ionicons name="chevron-back" size={24} color="#3A7691" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dateDisplay} onPress={() => navigateDate('today')}>
          <Text style={styles.dateText}>{formatDateDisplay()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigateDate('next')}>
          <Ionicons name="chevron-forward" size={24} color="#3A7691" />
        </TouchableOpacity>
      </View>

      {/* Chart Type Selector */}
      <View style={styles.chartTypeContainer}>
        {(['pie', 'bar', 'line'] as ChartType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.chartTypeButton,
              chartType === type && styles.activeChartTypeButton
            ]}
            onPress={() => setChartType(type)}
          >
            <Ionicons 
              name={type === 'pie' ? 'pie-chart' : type === 'bar' ? 'bar-chart' : 'analytics'} 
              size={20} 
              color={chartType === type ? '#FFFFFF' : '#666666'} 
            />
            <Text style={[
              styles.chartTypeText,
              chartType === type && styles.activeChartTypeText
            ]}>
              {type === 'pie' ? 'Circular' : type === 'bar' ? 'Barras' : 'Líneas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3A7691" />
            <Text style={styles.loadingText}>Cargando análisis...</Text>
          </View>
        ) : chartData && (
          activeDataType === 'Resumen' && chartType === 'pie' ? (
            pieChartData.length > 0 ? (
              <Animated.View style={[styles.chartWrapper, { opacity: fadeAnim }]}>
                <PieChart
                  data={pieChartData}
                  width={width - 40}
                  height={280}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[10, 10]}
                  absolute
                />
              </Animated.View>
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="pie-chart-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyChartText}>No hay datos para mostrar</Text>
              </View>
            )
          ) : chartData.datasets[0].data.some(value => value > 0) ? (
            <Animated.View style={[
              styles.chartWrapper, 
              { 
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}>
              {chartType === 'bar' ? (
                <BarChart
                  data={chartData}
                  width={width - 40}
                  height={280}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  showValuesOnTopOfBars
                  fromZero
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              ) : (
                <LineChart
                  data={chartData}
                  width={width - 40}
                  height={280}
                  chartConfig={chartConfig}
                  bezier
                  fromZero
                  onDataPointClick={handleChartPress}
                />
              )}
            </Animated.View>
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons name="analytics-outline" size={60} color="#E0E0E0" />
              <Text style={styles.emptyChartText}>
                No hay datos de {activeDataType.toLowerCase()} para este período
              </Text>
            </View>
          )
        )}
      </View>

      {/* Tooltip Modal */}
      <Modal
        visible={tooltipVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTooltipVisible(false)}
      >
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={() => setTooltipVisible(false)}
        >
          {tooltipData && (
            <View style={[
              styles.tooltipContainer,
              {
                left: Math.max(20, Math.min(tooltipData.x - 75, width - 170)),
                top: tooltipData.y
              }
            ]}>
              <View style={styles.tooltipArrow} />
              <Text style={styles.tooltipLabel}>{tooltipData.label}</Text>
              <Text style={styles.tooltipValue}>{tooltipData.value}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#30353D',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
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
  },
  incomeCard: {
    borderLeftColor: '#4CAF50',
  },
  expenseCard: {
    borderLeftColor: '#F44336',
  },
  profitCard: {
    borderLeftColor: '#3A7691',
  },
  lossCard: {
    borderLeftColor: '#FF9800',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#30353D',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 12,
  },
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePeriodButton: {
    backgroundColor: '#3A7691',
    borderColor: '#3A7691',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  dataTypeContainer: {
    paddingHorizontal: 20,
  },
  dataTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  activeDataTypeButton: {
    backgroundColor: '#F8F9FA',
  },
  dataTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    textAlign: 'center',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    gap: 12,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  activeChartTypeButton: {
    backgroundColor: '#3A7691',
  },
  chartTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  activeChartTypeText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyChartText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#30353D',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: '#30353D',
    borderRadius: 12,
    padding: 12,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#30353D',
  },
  tooltipLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
});
