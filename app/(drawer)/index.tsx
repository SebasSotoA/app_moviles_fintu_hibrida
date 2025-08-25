import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import WelcomeModal from '../../components/WelcomeModal';
import { useApp } from '../../src/shared/context/AppProvider';

const { width } = Dimensions.get('window');

type TransactionType = 'GASTOS' | 'INGRESOS';
type FilterPeriod = 'Día' | 'Semana' | 'Mes' | 'Año' | 'Período';

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
  color: string;
}

export default function Home() {
  const navigation = useNavigation();
  const { currentAccount, isLoading, getTransactionStats, accounts, setCurrentAccount } = useApp();
  const [activeType, setActiveType] = useState<TransactionType>('GASTOS');
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('Día');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Valores animados para el deslizamiento
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Mostrar modal de bienvenida después de un breve delay
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Cargar estadísticas cuando cambien los filtros
  useEffect(() => {
    loadCategoryStats();
  }, [activeType, activePeriod, currentDate]);

  const loadCategoryStats = async () => {
    if (!currentAccount) return;
    
    setIsLoadingStats(true);
    try {
      const { startDate, endDate } = getDateRange(currentDate, activePeriod);
      const stats = await getTransactionStats(
        startDate, 
        endDate, 
        activeType === 'GASTOS' ? 'GASTO' : 'INGRESO'
      );

      // Calcular total y porcentajes
      const total = stats.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0);
      const categoriesWithPercentage = stats.map(stat => ({
        id: stat.id,
        name: stat.name,
        icon: stat.icon,
        amount: stat.totalAmount || 0,
        percentage: total > 0 ? Math.round((stat.totalAmount / total) * 100) : 0,
        color: stat.color
      }));

      setCategoryStats(categoriesWithPercentage);
    } catch (error) {
      console.error('Error loading category stats:', error);
      setCategoryStats([]);
    } finally {
      setIsLoadingStats(false);
    }
  };

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
      default:
        break;
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  };

  const currentCategories = categoryStats;
  const totalAmount = currentCategories.reduce((sum, cat) => sum + cat.amount, 0);

  // Función para formatear fechas según el período
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
      case 'Período': {
        return 'Período personalizado';
      }
      default:
        return '';
    }
  };

  // Función para navegar en el tiempo
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

  // Función para crear path de sector de torta
  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', centerX, centerY,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Preparar datos para el gráfico de torta
  const pieData = currentCategories.map((category, index) => {
    let startAngle = 0;
    for (let i = 0; i < index; i++) {
      startAngle += (currentCategories[i].percentage / 100) * 360;
    }
    const endAngle = startAngle + (category.percentage / 100) * 360;
    
    return {
      ...category,
      startAngle,
      endAngle,
      path: createArcPath(80, 80, 70, startAngle, endAngle)
    };
  });

  // Gesto de deslizamiento
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const threshold = 50;
      
      if (e.translationX > threshold) {
        // Deslizar hacia la derecha (ir hacia atrás en el tiempo)
        runOnJS(navigateTime)('prev');
      } else if (e.translationX < -threshold) {
        // Deslizar hacia la izquierda (ir hacia adelante en el tiempo)
        runOnJS(navigateTime)('next');
      }
      
      translateX.value = withSpring(0);
    });

  // Estilo animado para el contenedor del gráfico
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderCategoryCard = (category: CategoryData) => (
    <TouchableOpacity key={category.id} style={styles.categoryCard}>
      {/* Ícono de la categoría */}
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon as any} size={24} color="#FFFFFF" />
      </View>
      
      {/* Información de la categoría */}
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryAmount}>{category.amount.toLocaleString('es-CO')} COP</Text>
      </View>
      
      {/* Porcentaje */}
      <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
    </TouchableOpacity>
  );

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
                     <Text style={styles.headerTitle}>FintuApp</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selector de cuenta activa y saldo */}
        <TouchableOpacity 
          style={styles.accountSection}
          onPress={() => setShowAccountSelector(true)}
          activeOpacity={0.7}
        >
          <View style={styles.accountHeader}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Cuenta actual</Text>
              <View style={styles.accountNameContainer}>
                <Text style={styles.accountSymbol}>{currentAccount?.symbol || '💰'}</Text>
                <Text style={styles.accountName}>
                  {currentAccount?.name || 'Cargando...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </View>
          </View>
          <Text style={styles.balance}>
            {currentAccount?.balance?.toLocaleString('es-CO') || '0'} {currentAccount?.currency || 'COP'}
          </Text>
        </TouchableOpacity>

        {/* Toggle Gastos/Ingresos */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeType === 'GASTOS' && styles.activeToggleButton,
            ]}
            onPress={() => setActiveType('GASTOS')}
          >
            <Text
              style={[
                styles.toggleText,
                activeType === 'GASTOS' && styles.activeToggleText,
              ]}
            >
              GASTOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeType === 'INGRESOS' && styles.activeToggleButton,
            ]}
            onPress={() => setActiveType('INGRESOS')}
          >
            <Text
              style={[
                styles.toggleText,
                activeType === 'INGRESOS' && styles.activeToggleText,
              ]}
            >
              INGRESOS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtro temporal */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodFilterContainer}
        >
          {(['Día', 'Semana', 'Mes', 'Año', 'Período'] as FilterPeriod[]).map((period) => (
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

        {/* Sección del gráfico de torta con navegación temporal */}
        <View style={styles.chartSection}>
          {/* Fecha actual según período - Solo esta parte se anima */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.dateHeader, animatedStyle]}>
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
              
              {/* Botón para volver a fecha actual */}
              <TouchableOpacity 
                onPress={() => setCurrentDate(new Date())}
                style={styles.todayButton}
              >
                <Ionicons name="today" size={20} color="#3A7691" />
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>

          {/* Gráfico de torta */}
          <View style={styles.pieChartContainer}>
            {isLoadingStats ? (
              <View style={styles.loadingChart}>
                <ActivityIndicator size="large" color="#3A7691" />
                <Text style={styles.loadingText}>Cargando datos...</Text>
              </View>
            ) : pieData.length > 0 ? (
              <View style={styles.chartWrapper}>
                {/* Gráfico de torta SVG */}
                <Svg width={160} height={160} style={styles.svgChart}>
                  {pieData.map((slice, index) => (
                    <Path
                      key={slice.id}
                      d={slice.path}
                      fill={slice.color}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                  {/* Círculo central */}
                  <Circle
                    cx={80}
                    cy={80}
                    r={35}
                    fill="#FFFFFF"
                    stroke="#F0F0F0"
                    strokeWidth={1}
                  />
                </Svg>
                
                {/* Valor total en el centro */}
                <View style={styles.centerValue}>
                  <Text style={styles.centerAmount}>
                    {totalAmount.toLocaleString('es-CO')}
                  </Text>
                  <Text style={styles.centerCurrency}>{currentAccount?.currency || 'COP'}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="pie-chart-outline" size={60} color="#CCCCCC" />
                <Text style={styles.emptyChartText}>
                  {activeType === 'GASTOS' ? 'No hay gastos' : 'No hay ingresos'} para mostrar
                </Text>
              </View>
            )}
            </View>

          {/* Instrucción de deslizamiento */}
          <Text style={styles.swipeHint}>
            Desliza sobre la fecha para navegar entre períodos
          </Text>
        </View>

        {/* Tarjetas de categorías */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>
            Categorías de {activeType.charAt(0).toUpperCase() + activeType.slice(1).toLowerCase()}
          </Text>
          {isLoadingStats ? (
            <View style={styles.loadingCategories}>
              <ActivityIndicator size="small" color="#3A7691" />
              <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
          ) : currentCategories.length > 0 ? (
            <View style={styles.categoriesGrid}>
              {currentCategories.map(renderCategoryCard)}
            </View>
          ) : (
            <View style={styles.emptyCategories}>
              <Ionicons name="folder-open-outline" size={40} color="#CCCCCC" />
              <Text style={styles.emptyCategoriesText}>
                No hay {activeType.toLowerCase()} registrados para este período
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

                 {/* Botón Nuevo + */}
         <TouchableOpacity 
           style={styles.newButton}
           onPress={() => router.push('/(drawer)/add-transaction')}
         >
           <Text style={styles.newButtonText}>Nuevo +</Text>
         </TouchableOpacity>
       </SafeAreaView>

       {/* Modal de Bienvenida */}
       <WelcomeModal 
         visible={showWelcomeModal}
         onClose={() => setShowWelcomeModal(false)}
       />

       {/* Modal Selector de Cuenta */}
       {showAccountSelector && (
         <View style={styles.modalOverlay}>
           <View style={styles.accountSelectorModal}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Seleccionar Cuenta</Text>
               <TouchableOpacity 
                 onPress={() => setShowAccountSelector(false)}
                 style={styles.closeButton}
               >
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
             </View>

             <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
               {accounts.map((account) => (
                 <TouchableOpacity
                   key={account.id}
                   style={[
                     styles.accountItem,
                     currentAccount?.id === account.id && styles.selectedAccountItem
                   ]}
                   onPress={() => {
                     setCurrentAccount(account.id);
                     setShowAccountSelector(false);
                   }}
                 >
                   <View style={styles.accountItemLeft}>
                     <Text style={styles.accountItemSymbol}>{account.symbol}</Text>
                     <View style={styles.accountItemInfo}>
                       <Text style={styles.accountItemName}>{account.name}</Text>
                       <Text style={styles.accountItemBalance}>
                         {account.balance.toLocaleString('es-CO')} {account.currency}
                       </Text>
                     </View>
                   </View>
                   {currentAccount?.id === account.id && (
                     <Ionicons name="checkmark-circle" size={24} color="#3A7691" />
                   )}
                 </TouchableOpacity>
               ))}
             </ScrollView>

             <TouchableOpacity 
               style={styles.newAccountButton}
               onPress={() => {
                 setShowAccountSelector(false);
                 router.push('/(drawer)/new-account');
               }}
             >
               <Ionicons name="add" size={20} color="#FFFFFF" />
               <Text style={styles.newAccountButtonText}>Crear Nueva Cuenta</Text>
             </TouchableOpacity>
           </View>
         </View>
       )}
     </View>
   );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#30353D', // Mismo color del header
  },
  statusBarArea: {
    backgroundColor: '#30353D', // Área del status bar con color del header
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
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accountSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  accountName: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    marginBottom: 20,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeToggleButton: {
    backgroundColor: '#3A7691',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  periodFilterContainer: {
    marginBottom: 20,
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
  chartSection: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  chartWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgChart: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerValue: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    width: 70,
    height: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  centerAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#30353D',
    textAlign: 'center',
  },
  centerCurrency: {
    fontSize: 10,
    color: '#666666',
    marginTop: 1,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    marginTop: 10,
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  loadingChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 5,
  },
  loadingCategories: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 10,
  },
  emptyCategories: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 10,
  },
  emptyCategoriesText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  swipeHint: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categoriesSection: {
    marginBottom: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'column',
  },
  categoryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#3A7691',
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#30353D',
    marginLeft: 12,
  },
  newButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#3A7691',
    paddingVertical: 15,
    borderRadius: 25,
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
  newButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Account Selector Styles
  accountHeader: {
    marginBottom: 8,
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  accountNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountSymbol: {
    fontSize: 20,
    marginRight: 8,
  },
  // Modal Styles
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
  newAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A7691',
    margin: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  newAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
