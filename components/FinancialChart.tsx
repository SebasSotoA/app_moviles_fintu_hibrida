import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useApp } from '../src/shared/context/AppProvider';
import breakpoints from '../src/shared/styles/breakpoints';

const { width } = Dimensions.get('window');
const isTablet = width >= breakpoints.tablet;

type FilterPeriod = 'Día' | 'Semana' | 'Mes' | 'Año';
type ChartType = 'bar' | 'line';
type DataType = 'Ingresos' | 'Gastos' | 'Beneficios' | 'Pérdida';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface FinancialData {
  ingresos: number;
  gastos: number;
  beneficios: number;
  perdida: number;
}

export default function FinancialChart() {
  const { getTransactionsByDateRange, currentAccount } = useApp();
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('Mes');
  const [activeDataType, setActiveDataType] = useState<DataType>('Beneficios');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [summaryData, setSummaryData] = useState<FinancialData>({
    ingresos: 0,
    gastos: 0,
    beneficios: 0,
    perdida: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadChartData();
  }, [activePeriod, activeDataType, currentDate, currentAccount?.id]);

  const getDateRange = (date: Date, period: FilterPeriod) => {
    const start = new Date(date);
    const end = new Date(date);

    switch (period) {
      case 'Día':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Semana':
        start.setDate(date.getDate() - date.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Mes':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(date.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Año':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  };

  const generateLabelsForPeriod = (date: Date, period: FilterPeriod): string[] => {
    const labels: string[] = [];
    
    switch (period) {
      case 'Día':
        // Horas del día
        for (let i = 0; i < 24; i += 4) {
          labels.push(`${i}:00`);
        }
        break;
      case 'Semana':
        // Días de la semana
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        labels.push(...days);
        break;
      case 'Mes':
        // Semanas del mes
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i += Math.ceil(daysInMonth / 6)) {
          labels.push(`${i}`);
        }
        break;
      case 'Año':
        // Meses del año
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        labels.push(...months);
        break;
    }
    
    return labels;
  };

  const aggregateDataByPeriod = (transactions: any[], period: FilterPeriod, labels: string[]) => {
    const data = new Array(labels.length).fill(0);
    const incomeData = new Array(labels.length).fill(0);
    const expenseData = new Array(labels.length).fill(0);

    transactions.forEach(transaction => {
      const txDate = new Date(transaction.date);
      let index = 0;

      switch (period) {
        case 'Día':
          index = Math.floor(txDate.getHours() / 4);
          break;
        case 'Semana':
          index = txDate.getDay();
          break;
        case 'Mes':
          index = Math.floor((txDate.getDate() - 1) / Math.ceil(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() / 6));
          break;
        case 'Año':
          index = txDate.getMonth();
          break;
      }

      if (index >= 0 && index < labels.length) {
        if (transaction.type === 'INGRESO') {
          incomeData[index] += transaction.amount;
        } else {
          expenseData[index] += transaction.amount;
        }
      }
    });

    // Calcular datos según el tipo seleccionado
    switch (activeDataType) {
      case 'Ingresos':
        return incomeData;
      case 'Gastos':
        return expenseData;
      case 'Beneficios':
        return incomeData.map((income, i) => Math.max(0, income - expenseData[i]));
      case 'Pérdida':
        return expenseData.map((expense, i) => Math.max(0, expense - incomeData[i]));
      default:
        return data;
    }
  };

  const loadChartData = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateRange(currentDate, activePeriod);
      const transactions = await getTransactionsByDateRange(startDate, endDate);
      
      // Filtrar por cuenta actual
      const accountTransactions = transactions.filter(tx => tx.accountId === currentAccount.id);
      
      // Calcular resumen
      const totalIngresos = accountTransactions
        .filter(tx => tx.type === 'INGRESO')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      const totalGastos = accountTransactions
        .filter(tx => tx.type === 'GASTO')
        .reduce((sum, tx) => sum + tx.amount, 0);

      const beneficios = Math.max(0, totalIngresos - totalGastos);
      const perdida = Math.max(0, totalGastos - totalIngresos);

      setSummaryData({
        ingresos: totalIngresos,
        gastos: totalGastos,
        beneficios,
        perdida
      });

      // Generar datos del gráfico
      const labels = generateLabelsForPeriod(currentDate, activePeriod);
      const data = aggregateDataByPeriod(accountTransactions, activePeriod, labels);

      setChartData({
        labels,
        datasets: [{
          data,
          color: (opacity = 1) => getDataTypeColor(activeDataType, opacity),
          strokeWidth: 2
        }]
      });

    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataTypeColor = (dataType: DataType, opacity: number = 1) => {
    switch (dataType) {
      case 'Ingresos':
        return `rgba(76, 175, 80, ${opacity})`;
      case 'Gastos':
        return `rgba(244, 67, 54, ${opacity})`;
      case 'Beneficios':
        return `rgba(58, 118, 145, ${opacity})`;
      case 'Pérdida':
        return `rgba(255, 152, 0, ${opacity})`;
      default:
        return `rgba(158, 158, 158, ${opacity})`;
    }
  };

  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (activePeriod) {
      case 'Día':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'Semana':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'Mes':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'Año':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const formatDateForPeriod = (date: Date, period: FilterPeriod): string => {
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    
    switch (period) {
      case 'Día': {
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day} de ${month}`;
      }
      case 'Semana': {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startDay = startOfWeek.getDate();
        const startMonth = months[startOfWeek.getMonth()];
        const endDay = endOfWeek.getDate();
        const endMonth = months[endOfWeek.getMonth()];
        
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      }
      case 'Mes': {
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
      }
      case 'Año': {
        return date.getFullYear().toString();
      }
      default:
        return '';
    }
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => getDataTypeColor(activeDataType, opacity),
    labelColor: (opacity = 1) => `rgba(48, 53, 61, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: getDataTypeColor(activeDataType)
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E9ECEF',
      strokeWidth: 1
    }
  };

  if (!currentAccount) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="bar-chart-outline" size={60} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>Selecciona una cuenta para ver los gráficos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Resumen financiero */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Resumen Financiero</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { borderLeftColor: '#4CAF50' }]}>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
              {summaryData.ingresos.toLocaleString('es-CO')}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#F44336' }]}>
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>
              {summaryData.gastos.toLocaleString('es-CO')}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#3A7691' }]}>
            <Text style={styles.summaryLabel}>Beneficios</Text>
            <Text style={[styles.summaryValue, { color: '#3A7691' }]}>
              {summaryData.beneficios.toLocaleString('es-CO')}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#FF9800' }]}>
            <Text style={styles.summaryLabel}>Pérdida</Text>
            <Text style={[styles.summaryValue, { color: '#FF9800' }]}>
              {summaryData.perdida.toLocaleString('es-CO')}
            </Text>
          </View>
        </View>
      </View>

      {/* Filtros de período */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.periodFilterContainer}
      >
        {(['Día', 'Semana', 'Mes', 'Año'] as FilterPeriod[]).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              activePeriod === period && styles.activePeriodButton,
            ]}
            onPress={() => setActivePeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                activePeriod === period && styles.activePeriodText,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtros de tipo de datos */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dataTypeFilterContainer}
      >
        {(['Ingresos', 'Gastos', 'Beneficios', 'Pérdida'] as DataType[]).map((dataType) => (
          <TouchableOpacity
            key={dataType}
            style={[
              styles.dataTypeButton,
              activeDataType === dataType && styles.activeDataTypeButton,
              { borderColor: getDataTypeColor(dataType) }
            ]}
            onPress={() => setActiveDataType(dataType)}
          >
            <Text
              style={[
                styles.dataTypeText,
                activeDataType === dataType && { color: getDataTypeColor(dataType) },
              ]}
            >
              {dataType}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navegación temporal */}
      <View style={styles.dateHeader}>
        <TouchableOpacity 
          onPress={() => navigateTime('prev')}
          style={styles.dateNavButton}
        >
          <Ionicons name="chevron-back" size={20} color="#3A7691" />
        </TouchableOpacity>
        
        <Text style={styles.currentDate}>
          {formatDateForPeriod(currentDate, activePeriod)}
        </Text>
        
        <TouchableOpacity 
          onPress={() => navigateTime('next')}
          style={styles.dateNavButton}
        >
          <Ionicons name="chevron-forward" size={20} color="#3A7691" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setCurrentDate(new Date())}
          style={styles.todayButton}
        >
          <Ionicons name="today" size={20} color="#3A7691" />
        </TouchableOpacity>
      </View>

      {/* Selector de tipo de gráfico */}
      <View style={styles.chartTypeSelector}>
        <TouchableOpacity
          style={[styles.chartTypeButton, chartType === 'bar' && styles.activeChartTypeButton]}
          onPress={() => setChartType('bar')}
        >
          <Ionicons name="bar-chart" size={20} color={chartType === 'bar' ? '#FFFFFF' : '#666666'} />
          <Text style={[styles.chartTypeText, chartType === 'bar' && styles.activeChartTypeText]}>
            Barras
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chartTypeButton, chartType === 'line' && styles.activeChartTypeButton]}
          onPress={() => setChartType('line')}
        >
          <Ionicons name="trending-up" size={20} color={chartType === 'line' ? '#FFFFFF' : '#666666'} />
          <Text style={[styles.chartTypeText, chartType === 'line' && styles.activeChartTypeText]}>
            Líneas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico */}
      <View style={styles.chartContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3A7691" />
            <Text style={styles.loadingText}>Cargando gráfico...</Text>
          </View>
        ) : chartData && chartData.datasets[0].data.some(value => value > 0) ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chartWrapper}>
              {chartType === 'bar' ? (
                <BarChart
                  data={chartData}
                  width={Math.max(width - 40, chartData.labels.length * 60)}
                  height={220}
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
                  width={Math.max(width - 40, chartData.labels.length * 60)}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  fromZero
                />
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyChart}>
            <Ionicons name="bar-chart-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyChartText}>
              No hay datos de {activeDataType.toLowerCase()} para mostrar en este período
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30353D',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: isTablet ? 150 : 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  periodFilterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  activePeriodButton: {
    backgroundColor: '#3A7691',
  },
  periodText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  dataTypeFilterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    backgroundColor: '#F0F8FF',
  },
  dataTypeText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  dateNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  todayButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginLeft: 10,
  },
  currentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  activeChartTypeButton: {
    backgroundColor: '#3A7691',
  },
  chartTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeChartTypeText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
