import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import WelcomeModal from '../../components/WelcomeModal';
import { useApp } from '../../src/shared/context/AppProvider';




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

// Componente optimizado para renderizar un mes del calendario
const CalendarMonth = React.memo(({ 
  month, 
  onDateSelection, 
  customStartDate, 
  customEndDate 
}: {
  month: Date;
  onDateSelection: (date: Date) => void;
  customStartDate: Date | null;
  customEndDate: Date | null;
}) => {
  const getCalendarDaysFor = React.useCallback((baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const daysFromPreviousMonth = firstDayWeekday;
    const totalDaysToShow = 42;
    const daysFromNextMonth = totalDaysToShow - daysFromPreviousMonth - lastDayOfMonth.getDate();
    
    const days = [];
    
    // Días del mes anterior
    for (let i = daysFromPreviousMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: customStartDate && customEndDate && 
          date >= customStartDate && date <= customEndDate,
        isStartDate: customStartDate && date.getTime() === customStartDate.getTime(),
        isEndDate: customEndDate && date.getTime() === customEndDate.getTime(),
        isInRange: customStartDate && customEndDate && 
          date > customStartDate && date < customEndDate,
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isSelected: customStartDate && customEndDate && 
          date >= customStartDate && date <= customEndDate,
        isStartDate: customStartDate && date.getTime() === customStartDate.getTime(),
        isEndDate: customEndDate && date.getTime() === customEndDate.getTime(),
        isInRange: customStartDate && customEndDate && 
          date > customStartDate && date < customEndDate,
      });
    }
    
    // Días del mes siguiente
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: customStartDate && customEndDate && 
          date >= customStartDate && date <= customEndDate,
        isStartDate: customStartDate && date.getTime() === customStartDate.getTime(),
        isEndDate: customEndDate && date.getTime() === customEndDate.getTime(),
        isInRange: customStartDate && customEndDate && 
          date > customStartDate && date < customEndDate,
      });
    }
    
    return days;
  }, [customStartDate, customEndDate]);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <Text
          style={styles.calendarMonthYear}
          accessibilityRole="header"
          accessibilityLabel={`Mes ${month.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}`}
        >
          {month.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <View style={styles.calendarDaysHeader}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <Text key={day} style={styles.calendarDayHeader}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {getCalendarDaysFor(month).map((day, index) => (
          <TouchableOpacity
            key={`${month.getFullYear()}-${month.getMonth()}-${index}`}
            style={[
              styles.calendarDay,
              day.isCurrentMonth && styles.calendarDayCurrentMonth,
              day.isSelected && styles.calendarDaySelected,
              day.isInRange && styles.calendarDayInRange,
              day.isStartDate && styles.calendarDayStart,
              day.isEndDate && styles.calendarDayEnd,
            ]}
            onPress={() => onDateSelection(day.date)}
            disabled={!day.isCurrentMonth}
            accessibilityRole="button"
            accessibilityLabel={`Día ${day.date.getDate()}${day.isCurrentMonth ? '' : ' (fuera de mes)'}`}
          >
            <Text style={[
              styles.calendarDayText,
              day.isCurrentMonth && styles.calendarDayTextCurrentMonth,
              day.isSelected && styles.calendarDayTextSelected,
            ]}>
              {day.date.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

export default function Home() {
  const navigation = useNavigation();
  const { currentAccount, getTransactionStats, accounts, setCurrentAccount, isLoading, isInitialized } = useApp();
  const params = useLocalSearchParams();
  const [activeType, setActiveType] = useState<TransactionType>('GASTOS');
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('Día');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [includeAllPeriods, setIncludeAllPeriods] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  
  const insets = useSafeAreaInsets();

  // Ajuste de mes desde JS para usar con runOnJS
  const adjustCalendarBy = useCallback((delta: number) => {
    setCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  }, []);
  
  // Función para obtener los días del calendario (optimizada)
  const getCalendarDaysFor = React.useCallback((baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    
    // Obtener el primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Obtener el último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Calcular cuántos días del mes anterior mostrar
    const daysFromPreviousMonth = firstDayWeekday;
    
    // Calcular cuántos días del mes siguiente mostrar para completar 6 semanas
    const totalDaysToShow = 42; // 6 semanas * 7 días
    const daysFromNextMonth = totalDaysToShow - daysFromPreviousMonth - lastDayOfMonth.getDate();
    
    const days = [];
    
    // Agregar días del mes anterior
    for (let i = daysFromPreviousMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: customStartDate && customEndDate && 
          date >= customStartDate && date <= customEndDate,
        isStartDate: customStartDate && date.getTime() === customStartDate.getTime(),
        isEndDate: customEndDate && date.getTime() === customEndDate.getTime(),
        isInRange: customStartDate && customEndDate && 
          date > customStartDate && date < customEndDate,
      });
    }
    
    // Agregar días del mes actual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isSelected: customStartDate && customEndDate && 
          date >= customStartDate && date <= customEndDate,
        isStartDate: customStartDate && date.getTime() === customStartDate.getTime(),
        isEndDate: customEndDate && date.getTime() === customEndDate.getTime(),
        isInRange: customStartDate && customEndDate && 
          date > customStartDate && date < customEndDate,
      });
    }
    
    // Agregar días del mes siguiente
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: customStartDate && customEndDate && 
          date >= customStartDate && date <= customEndDate,
        isStartDate: customStartDate && date.getTime() === customStartDate.getTime(),
        isEndDate: customEndDate && date.getTime() === customEndDate.getTime(),
        isInRange: customStartDate && customEndDate && 
          date > customStartDate && date < customEndDate,
      });
    }
    
    return days;
  }, [customStartDate, customEndDate]);

  // Generar lista de meses alredor del mes actual para scroll continuo
  const monthsForScroll = React.useMemo(() => {
    const center = new Date(calendarDate);
    const list: Date[] = [];
    const range = 12; // Reducido de 24 a 12 meses (6 atrás, 6 adelante)
    for (let i = -6; i <= 6; i++) {
      const d = new Date(center);
      d.setDate(1);
      d.setMonth(center.getMonth() + i);
      list.push(d);
    }
    return list;
  }, [calendarDate]);

  // Handler para activar inmediatamente el período completo
  const handleIncludeAllToggle = useCallback((val: boolean) => {
    setIncludeAllPeriods(val);
    if (val) {
      setCustomStartDate(null);
      setCustomEndDate(null);
      setActivePeriod('Período');
      setShowPeriodSelector(false);
    }
  }, []);

  // Función para manejar la selección de fechas
  const handleDateSelection = (selectedDate: Date) => {
    // Si "incluir todos los períodos" está activo, desactivarlo
    if (includeAllPeriods) {
      setIncludeAllPeriods(false);
    }

    if (!customStartDate || (customStartDate && customEndDate)) {
      // Primera selección o nueva selección
      setCustomStartDate(selectedDate);
      setCustomEndDate(null);
    } else {
      // Segunda selección
      if (selectedDate < customStartDate) {
        setCustomEndDate(customStartDate);
        setCustomStartDate(selectedDate);
      } else {
        setCustomEndDate(selectedDate);
      }
    }
  };
  
  // Valores animados para el deslizamiento horizontal en header de fecha
  const translateX = useSharedValue(0);

  // Deshabilitamos gesto/anims para usar scroll nativo de meses pre-renderizados
  const calendarPanGesture = undefined as unknown as ReturnType<typeof Gesture.Pan>;

  useEffect(() => {
    // Mostrar modal de bienvenida después de un breve delay
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar mensaje de éxito si venimos de crear cuenta desde Inicio
  useEffect(() => {
    const accountCreated = params.accountCreated as string | undefined;
    if (accountCreated === 'true') {
      if (Platform.OS === 'web') {
        window.alert('Cuenta creada exitosamente');
      } else {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
      }
      // Limpiar la URL para evitar repetir el mensaje
      router.replace('/(drawer)');
    }
  }, [params.accountCreated]);

  // Efecto para manejar la carga del calendario
  useEffect(() => {
    if (showPeriodSelector) {
      setIsCalendarLoading(true);
      // Simular un pequeño delay para mostrar el indicador de carga
      const timer = setTimeout(() => {
        setIsCalendarLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showPeriodSelector]);

  // Cargar estadísticas cuando cambien los filtros
  useEffect(() => {
    loadCategoryStats();
  }, [activeType, activePeriod, currentDate, currentAccount?.id]);

  // Recargar cuando la pantalla toma foco (p. ej., al volver de crear transacción)
  useFocusEffect(
    useCallback(() => {
      loadCategoryStats();
      return () => {};
    }, [activeType, activePeriod, currentDate, currentAccount?.id])
  );

  const loadCategoryStats = async () => {
    if (!currentAccount) return;
    
    setIsLoadingStats(true);
    try {
      const { startDate, endDate } = getDateRange(currentDate, activePeriod);
      
      const stats = await getTransactionStats(
        startDate, 
        endDate, 
        activeType === 'GASTOS' ? 'GASTO' : 'INGRESO',
        currentAccount.id
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
      case 'Período':
        if (includeAllPeriods) {
          // Incluir todos los períodos: desde el inicio de los tiempos hasta ahora
          start.setTime(new Date(1970, 0, 1).getTime());
          end.setTime(new Date().getTime());
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        } else if (customStartDate && customEndDate) {
          start.setTime(customStartDate.getTime());
          end.setTime(customEndDate.getTime());
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        } else {
          // Si no hay fechas personalizadas, usar el mes actual
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(date.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
        }
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
        if (customStartDate && customEndDate) {
          const startDay = customStartDate.getDate();
          const startMonth = months[customStartDate.getMonth()];
          const endDay = customEndDate.getDate();
          const endMonth = months[customEndDate.getMonth()];
          return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
        } else {
          return 'Período personalizado';
        }
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

  const handleAddTransaction = () => {
    router.push('/(drawer)/add-transaction');
  };

  const renderCategoryCard = (category: CategoryData) => (
    <TouchableOpacity 
      key={category.id} 
      style={styles.categoryCard}
      onPress={() => {
        // Navegar al historial de la categoría
        router.push({
          pathname: '/(drawer)/category-history',
          params: { 
            categoryId: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            transactionType: activeType
          }
        });
      }}
    >
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

  // Mostrar pantalla de carga solo si no hay cuenta actual
  if (isLoading || !currentAccount) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#30353D" />
        <View style={[styles.statusBarArea, { height: insets.top }]} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3A7691" />
          <Text style={styles.loadingText}>
            {isLoading ? 'Inicializando aplicación...' : 'Cargando cuenta...'}
          </Text>
        </View>
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
          <Ionicons name="menu" size={35} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>FintuApp</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          {/* Selector de cuenta activa y saldo */}
          <View style={styles.accountSection}>
            <Text style={styles.accountLabel}>Cuenta actual</Text>
            <TouchableOpacity 
              style={styles.accountSelector}
              onPress={() => setShowAccountSelector(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.accountSymbol}>{currentAccount?.symbol || '💰'}</Text>
              <Text style={styles.accountName}>
                {currentAccount?.name || 'Cargando...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            <Text style={styles.balance}>
              {currentAccount?.balance?.toLocaleString('es-CO') || '0'} {currentAccount?.currency || 'COP'}
            </Text>
          </View>

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

                            {/* Filtro temporal - Grid responsivo */}
          <View style={styles.periodFilterContainer}>
            <View style={styles.periodFilterGrid}>
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
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  activePeriod === 'Período' && styles.activePeriodButton,
                ]}
                onPress={() => setShowPeriodSelector(true)}
              >
                <Text
                  style={[
                    styles.periodText,
                    activePeriod === 'Período' && styles.activePeriodText,
                  ]}
                >
                  Período
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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

        {/* Botón Nuevo + - Cambiado a posicionamiento relativo */}
        <View style={styles.newButtonContainer}>
          <TouchableOpacity 
            style={styles.newButton}
            onPress={() => router.push('/(drawer)/add-transaction')}
          >
            <Text style={styles.newButtonText}>Nuevo +</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

       {/* Modal de Bienvenida */}
       <WelcomeModal 
         visible={showWelcomeModal}
         onClose={() => setShowWelcomeModal(false)}
       />

       {/* Modal Selector de Período */}
       {showPeriodSelector && (
         <View style={styles.modalOverlay}>
           <View style={styles.periodSelectorModal}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Seleccionar Período</Text>
               <TouchableOpacity 
                 onPress={() => setShowPeriodSelector(false)}
                 style={styles.closeButton}
               >
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
             </View>

             {/* Control fijo: Incluir todos los períodos */}
             <View style={styles.fixedIncludeAllSection}>
               <TouchableOpacity
                 style={styles.includeAllRow}
                 onPress={Platform.OS === 'web' ? () => handleIncludeAllToggle(!includeAllPeriods) : undefined}
                 accessibilityRole={Platform.OS === 'web' ? 'checkbox' : 'switch'}
                 accessibilityState={{ checked: includeAllPeriods }}
                 accessibilityLabel="Incluir todos los períodos"
                 activeOpacity={0.7}
               >
                 <Text style={styles.includeAllText}>Incluir todos los períodos</Text>
                 {Platform.OS === 'web' ? (
                   <Ionicons
                     name={includeAllPeriods ? 'checkbox' : 'square-outline'}
                     size={22}
                     color={includeAllPeriods ? '#3A7691' : '#666666'}
                   />
                 ) : (
                   <Switch
                     value={includeAllPeriods}
                     onValueChange={handleIncludeAllToggle}
                     thumbColor={includeAllPeriods ? '#3A7691' : undefined}
                     trackColor={{ false: '#D0D5DA', true: '#A9C7D4' }}
                     accessibilityLabel="Interruptor incluir todos los períodos"
                   />
                 )}
               </TouchableOpacity>
             </View>

             <View style={styles.periodSelectorContent}>
               {!includeAllPeriods ? (
                 <>
                   {isCalendarLoading ? (
                     <View style={styles.calendarLoadingContainer}>
                       <ActivityIndicator size="large" color="#3A7691" />
                       <Text style={styles.calendarLoadingText}>Cargando calendario...</Text>
                     </View>
                   ) : (
                     <ScrollView 
                       style={styles.calendarScrollView}
                       showsVerticalScrollIndicator={false}
                       scrollEnabled={true}
                       contentContainerStyle={styles.calendarScrollContent}
                     >
                       {/* Lista de meses optimizada */}
                       <View style={styles.calendarInfo}>
                         <Text style={styles.calendarInfoText}>
                           Mostrando {monthsForScroll.length} meses ({monthsForScroll[0]?.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })} - {monthsForScroll[monthsForScroll.length - 1]?.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })})
                         </Text>
                       </View>
                       {monthsForScroll.map((m, idx) => (
                         <CalendarMonth
                           key={`${m.getFullYear()}-${m.getMonth()}`}
                           month={m}
                           onDateSelection={handleDateSelection}
                           customStartDate={customStartDate}
                           customEndDate={customEndDate}
                         />
                       ))}

                       <View style={styles.dateRangeInfo}>
                         <Text style={styles.dateRangeLabel}>Rango seleccionado:</Text>
                         <Text style={styles.dateRangeText}>
                           {customStartDate && customEndDate 
                             ? `${customStartDate.toLocaleDateString('es-CO')} - ${customEndDate.toLocaleDateString('es-CO')}`
                               : 'Selecciona las fechas'
                           }
                         </Text>
                         {customStartDate && customEndDate && (
                           <TouchableOpacity
                             style={styles.clearDatesButton}
                             onPress={() => {
                               setCustomStartDate(null);
                               setCustomEndDate(null);
                             }}
                           >
                             <Ionicons name="close-circle" size={16} color="#666666" />
                             <Text style={styles.clearDatesText}>Limpiar fechas</Text>
                           </TouchableOpacity>
                         )}
                       </View>
                     </ScrollView>
                   )}
                 </>
               ) : (
                 <View style={styles.allPeriodsInfo}>
                   <Ionicons name="calendar-outline" size={48} color="#3A7691" />
                   <Text style={styles.allPeriodsTitle}>Todos los períodos</Text>
                   <Text style={styles.allPeriodsDescription}>
                     Se incluirán todas las transacciones registradas en la aplicación
                   </Text>
                 </View>
               )}

               <View style={styles.periodSelectorActions}>
                 <TouchableOpacity 
                   style={[styles.periodSelectorButton, styles.cancelButton]}
                   onPress={() => {
                     setShowPeriodSelector(false);
                   }}
                 >
                   <Text style={styles.cancelButtonText}>Cancelar</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity 
                   style={[styles.periodSelectorButton, styles.confirmButton]}
                   onPress={() => {
                     if (includeAllPeriods || (customStartDate && customEndDate)) {
                       setActivePeriod('Período');
                       setShowPeriodSelector(false);
                     }
                   }}
                   disabled={!(includeAllPeriods || (customStartDate && customEndDate))}
                 >
                   <Text style={styles.confirmButtonText}>Confirmar</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </View>
       )}

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
                 router.push({ pathname: '/(drawer)/new-account', params: { returnPath: '/(drawer)' } });
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
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  accountName: {
    fontSize: 16,
    color: '#666666',
    marginHorizontal: 8,
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
  periodFilterGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  periodButton: {
    flex: 1,
    paddingHorizontal: 3,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
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
  
  
  newButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  newButton: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  accountNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountSymbol: {
    fontSize: 20,
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
  // Period Selector Modal Styles
  periodSelectorModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    width: '95%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fixedIncludeAllSection: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  periodSelectorContent: {
    padding: 20,
  },
  // Calendar Styles
  calendarScrollView: {
    maxHeight: 400,
  },
  calendarScrollContent: {
    paddingBottom: 20,
  },
  calendarContainer: {
    alignItems: 'center',
  },
  calendarHeader: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  includeAllRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 12,
  },
  includeAllText: {
    fontSize: 14,
    color: '#30353D',
    fontWeight: '500',
  },
  calendarNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#30353D',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  calendarScrollHint: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  calendarDayCurrentMonth: {
    backgroundColor: '#FFFFFF',
  },
  calendarDaySelected: {
    backgroundColor: '#E3F2FD',
  },
  calendarDayInRange: {
    backgroundColor: '#F0F8FF',
  },
  calendarDayStart: {
    backgroundColor: '#3A7691',
    borderRadius: 20,
  },
  calendarDayEnd: {
    backgroundColor: '#3A7691',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  calendarDayTextCurrentMonth: {
    color: '#30353D',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateRangeInfo: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    width: '100%',
  },
  dateRangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  dateRangeText: {
    fontSize: 16,
    color: '#30353D',
    textAlign: 'center',
  },
  allPeriodsInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  allPeriodsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#30353D',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  allPeriodsDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  calendarLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  calendarLoadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
  clearDatesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  clearDatesText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  calendarInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  calendarInfoText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  periodSelectorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  periodSelectorButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  confirmButton: {
    backgroundColor: '#3A7691',
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

});
