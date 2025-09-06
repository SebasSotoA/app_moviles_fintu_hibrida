import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import HeaderLogo from '../../components/HeaderLogo';
import WelcomeModal from '../../components/WelcomeModal';
import { useApp } from '../../src/shared/context/AppProvider';

import { useStyles } from '../../src/shared/hooks';
import { dashboardStyles } from '../../src/shared/styles/components';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

// Mapa de íconos locales siguiendo el patrón de _layout.tsx
const ICONS: Record<string, any> = {
  // Generales
  'list-outline': require('../../assets/icons/list-outline.svg'),
  'arrow-forward': require('../../assets/icons/arrow-forward.svg'),
  'arrow-forward-outline': require('../../assets/icons/arrow-forward-outline.svg'),
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'close': require('../../assets/icons/close.svg'),
  'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
  'wallet-outline': require('../../assets/icons/wallet-outline.svg'),
  'home-outline': require('../../assets/icons/home-outline.svg'),
  'bar-chart-outline': require('../../assets/icons/bar-chart-outline.svg'),
  'person-circle-outline': require('../../assets/icons/person-circle-outline.svg'),
  'settings-outline': require('../../assets/icons/settings-outline.svg'),
  'calendar-outline': require('../../assets/icons/calendar-outline.svg'),
  'menu': require('../../assets/icons/menu.svg'),
  'chevron-back': require('../../assets/icons/chevron-back.svg'),
  'chevron-forward': require('../../assets/icons/chevron-forward.svg'),
  'today': require('../../assets/icons/today.svg'),
  'pie-chart-outline': require('../../assets/icons/pie-chart-outline.svg'),
  'folder-open-outline': require('../../assets/icons/folder-open-outline.svg'),
  'add': require('../../assets/icons/add.svg'),
};

// Helper para renderizar íconos locales con tamaño y color
const renderIcon = (
  name: string,
  size: number,
  color?: string,
  style?: any
) => (
  <Image
    source={ICONS[name] || ICONS['list-outline']}
    style={[{ width: size, height: size }, style]}
    tintColor={color}
    resizeMode="contain"
  />
);

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
  const calendarStyles = useStyles(() => ({
    calendarContainer: {
      marginBottom: spacing[4],
    },
    calendarHeader: {
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    calendarMonthYear: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
    },
    calendarDaysHeader: {
      flexDirection: 'row',
      marginBottom: spacing[2],
    },
    calendarDayHeader: {
      flexBasis: '14.285714%',   // exactly 100 / 7
      textAlign: 'center',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
      paddingVertical: spacing[2],
    } as any,
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    calendarDay: {
      flexBasis: '14.285714%',   // match header
      flexGrow: 0,
      flexShrink: 0,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      padding: spacing[1],       // internal spacing instead of margin
    },
    calendarDayCurrentMonth: {
      backgroundColor: colors.neutral.white,
    },
    calendarDaySelected: {
      backgroundColor: colors.primary[500],
    },
    calendarDayInRange: {
      backgroundColor: colors.primary[50],
    },
    calendarDayStart: {
      backgroundColor: colors.primary[500],
    },
    calendarDayEnd: {
      backgroundColor: colors.primary[500],
    },
    calendarDayText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
    } as any,
    calendarDayTextCurrentMonth: {
      color: colors.text.primary,
    } as any,
    calendarDayTextSelected: {
      color: colors.neutral.white,
    } as any,
  }));

    // Función para obtener los días del calendario
    const getCalendarDaysFor = useCallback((baseDate: Date) => {
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
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      
      // Agregar días del mes anterior
      // Agregar días del mes anterior
for (let i = daysFromPreviousMonth - 1; i >= 0; i--) {
  const day = prevMonthLastDay - i;
  const date = new Date(year, month - 1, day);
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
  

    return (
      <View style={calendarStyles.calendarContainer}>
        <View style={calendarStyles.calendarHeader}>
          <Text style={calendarStyles.calendarMonthYear}>
            {month.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
  
        <View style={calendarStyles.calendarDaysHeader}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <Text key={day} style={calendarStyles.calendarDayHeader}>{day}</Text>
          ))}
        </View>
  
        <View style={calendarStyles.calendarGrid}>
          {getCalendarDaysFor(month).map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                calendarStyles.calendarDay,
                day.isCurrentMonth && calendarStyles.calendarDayCurrentMonth,
                day.isSelected && calendarStyles.calendarDaySelected,
                day.isInRange && calendarStyles.calendarDayInRange,
                day.isStartDate && calendarStyles.calendarDayStart,
                day.isEndDate && calendarStyles.calendarDayEnd,
              ]}
              onPress={() => onDateSelection(day.date)}
              disabled={!day.isCurrentMonth}
            >
              <Text style={[
                calendarStyles.calendarDayText,
                day.isCurrentMonth && calendarStyles.calendarDayTextCurrentMonth,
                day.isSelected && calendarStyles.calendarDayTextSelected,
              ]}>
                {day.date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  });

CalendarMonth.displayName = 'CalendarMonth';

export default function Home() {
  const navigation = useNavigation();
  const { currentAccount, getTransactionStats, accounts, setCurrentAccount, isLoading } = useApp();
  
  // Usar estilos importados del sistema de componentes
  const styles = dashboardStyles;
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
  const [calendarDate] = useState(new Date());
  const [includeAllPeriods, setIncludeAllPeriods] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  
  const insets = useSafeAreaInsets();
  
  // Generar lista de meses alredor del mes actual para scroll continuo
  const monthsForScroll = React.useMemo(() => {
    const center = new Date(calendarDate);
    const list: Date[] = [];
    // Reducido de 24 a 12 meses (6 atrás, 6 adelante)
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

  const getDateRange = useCallback((date: Date, period: FilterPeriod) => {
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
  }, [includeAllPeriods, customStartDate, customEndDate]);

  const loadCategoryStats = useCallback(async () => {
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
      
      // Calcular porcentajes con precisión decimal
      const categoriesWithRawPercentage = stats.map(stat => ({
        id: stat.id,
        name: stat.name,
        icon: stat.icon,
        amount: stat.totalAmount || 0,
        rawPercentage: total > 0 ? (stat.totalAmount / total) * 100 : 0,
        color: stat.color
      }));
      
      // Ajustar porcentajes para que sumen exactamente 100%
      const totalRawPercentage = categoriesWithRawPercentage.reduce((sum, cat) => sum + cat.rawPercentage, 0);
      const adjustment = 100 - totalRawPercentage;
      
      const categoriesWithPercentage = categoriesWithRawPercentage.map((cat, index) => ({
        ...cat,
        percentage: index === categoriesWithRawPercentage.length - 1 
          ? Math.round(cat.rawPercentage + adjustment) // Ajustar el último elemento
          : Math.round(cat.rawPercentage)
      }));

      setCategoryStats(categoriesWithPercentage);
      
      // Debug logs para temporalidad de "Día"
      if (activePeriod === 'Día') {
        console.log('=== DEBUG GRÁFICO DÍA ===');
        console.log('Fecha:', currentDate.toISOString().split('T')[0]);
        console.log('Rango:', { startDate, endDate });
        console.log('Stats raw:', stats);
        console.log('Total:', total);
        console.log('Categorías con porcentaje:', categoriesWithPercentage);
        console.log('========================');
      }
    } catch (error) {
      console.error('Error loading category stats:', error);
      setCategoryStats([]);
    } finally {
      setIsLoadingStats(false);
    }
  }, [currentAccount, currentDate, activePeriod, activeType, getTransactionStats, getDateRange]);

  // Cargar estadísticas cuando cambien los filtros
  useEffect(() => {
    loadCategoryStats();
  }, [activeType, activePeriod, currentDate, currentAccount?.id, loadCategoryStats]);

  // Recargar cuando la pantalla toma foco (p. ej., al volver de crear transacción)
  useFocusEffect(
    useCallback(() => {
      loadCategoryStats();
      return () => {};
    }, [loadCategoryStats])
  );

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

  // Filtrar categorías con porcentajes válidos (> 0)
const validCategories = currentCategories.filter(cat => cat.percentage > 0);

// Preparar datos para el gráfico de torta
const pieData = validCategories.map((category, index) => {
  let startAngle = 0;
  for (let i = 0; i < index; i++) {
    startAngle += (validCategories[i].percentage / 100) * 360;
  }
  const endAngle = startAngle + (category.percentage / 100) * 360;

  // Caso especial: si solo hay una categoría
  if (validCategories.length === 1) {
    return {
      ...category,
      isFullCircle: true,   // 👈 marcador especial
    };
  }

  // Asegurar que el último sector cierre el círculo (360°)
  const finalEndAngle = index === validCategories.length - 1 ? 360 : endAngle;

  return {
    ...category,
    startAngle,
    endAngle: finalEndAngle,
    path: createArcPath(80, 80, 70, startAngle, finalEndAngle),
    isFullCircle: false,
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
        {renderIcon(category.icon, 24, colors.neutral.white)}
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
        <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
        <View style={[styles.statusBarArea, { height: insets.top }]} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>
            {isLoading ? 'Inicializando aplicación...' : 'Cargando cuenta...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          {renderIcon('menu', 35, colors.neutral.white)}
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <HeaderLogo size={140} color={colors.neutral.white} />
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: 100 }}
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
              {renderIcon('chevron-down', 20, colors.text.tertiary)}
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
                {renderIcon('chevron-back', 20, colors.background.toggleUnpressed)}
              </TouchableOpacity>
              
              <Text style={styles.currentDate}>
                {formatDateForPeriod(currentDate, activePeriod)}
              </Text>
              
              <TouchableOpacity 
                onPress={() => navigateTime('next')}
                style={styles.dateNavButton}
              >
                {renderIcon('chevron-forward', 20, colors.background.toggleUnpressed)}
              </TouchableOpacity>
              
              {/* Botón para volver a fecha actual */}
              <TouchableOpacity 
                onPress={() => setCurrentDate(new Date())}
                style={styles.todayButton}
              >
                {renderIcon('today', 20, colors.background.toggleUnpressed)}
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>

          {/* Gráfico de torta */}
<View style={styles.pieChartContainer}>
  {isLoadingStats ? (
    <View style={styles.loadingChart}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={styles.loadingText}>Cargando datos...</Text>
    </View>
  ) : pieData.length > 0 ? (
    <View style={styles.chartWrapper}>
      {/* Gráfico de torta SVG */}
      <Svg width={160} height={160} style={styles.svgChart}>
        {pieData.map((slice) =>
          slice.isFullCircle ? (
            <Circle
              key={slice.id}
              cx={80}
              cy={80}
              r={70}
              fill={slice.color}
              stroke={colors.neutral.white}
              strokeWidth={1}
            />
          ) : (
            <Path
              key={slice.id}
              d={(slice as any).path || ''}
              fill={slice.color}
              stroke={colors.neutral.white}
              strokeWidth={2}
            />
          )
        )}

        {/* Círculo central */}
        <Circle
          cx={80}
          cy={80}
          r={45}
          fill={colors.neutral.white}
          stroke={colors.border.light}
          strokeWidth={1}
        />
      </Svg>

      {/* Valor total en el centro */}
      <View style={styles.centerValue}>
        <Text style={styles.centerAmount}>
          {totalAmount.toLocaleString('es-CO')}
        </Text>
        <Text style={styles.centerCurrency}>
          {currentAccount?.currency || 'COP'}
        </Text>
      </View>
    </View>
  ) : (
    <View style={styles.emptyChart}>
      {renderIcon('pie-chart-outline', 60, colors.text.tertiary)}
      <Text style={styles.emptyChartText}>
        {activeType === 'GASTOS' ? 'No hay gastos' : 'No hay ingresos'} para
        mostrar
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
              <ActivityIndicator size="small" color={colors.primary[500]} />
              <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
          ) : currentCategories.length > 0 ? (
            <View style={styles.categoriesGrid}>
              {currentCategories.map(renderCategoryCard)}
            </View>
          ) : (
            <View style={styles.emptyCategories}>
              {renderIcon('folder-open-outline', 40, colors.text.tertiary)}
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
            <Text style={dashboardStyles.newButtonText}>+ Nueva Transacción</Text>
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
                    {renderIcon('close', 24, colors.text.tertiary)}
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
                   renderIcon(includeAllPeriods ? 'checkmark-circle' : 'list-outline', 22, includeAllPeriods ? colors.primary[500] : colors.text.tertiary)
                 ) : (
                   <Switch
                     value={includeAllPeriods}
                     onValueChange={handleIncludeAllToggle}
                     thumbColor={includeAllPeriods ? colors.primary[500] : undefined}
                     trackColor={{ false: colors.border.light, true: colors.primary[200] }}
                     accessibilityLabel="Interruptor incluir todos los períodos"
                   />
                 )}
               </TouchableOpacity>
             </View>

             {/* Rango seleccionado - Fijo debajo del control de incluir todos */}
             {!includeAllPeriods && (customStartDate || customEndDate) && (
               <View style={styles.fixedDateRangeSection}>
                 <Text style={styles.dateRangeLabel}>Rango seleccionado:</Text>
                 <Text style={styles.dateRangeText}>
                   {customStartDate && customEndDate 
                     ? `${customStartDate.toLocaleDateString('es-CO')} - ${customEndDate.toLocaleDateString('es-CO')}`
                     : customStartDate 
                       ? `${customStartDate.toLocaleDateString('es-CO')} - Selecciona fecha final`
                       : 'Selecciona fecha inicial'
                   }
                 </Text>
                 {(customStartDate || customEndDate) && (
                   <TouchableOpacity
                     style={styles.clearDatesButton}
                     onPress={() => {
                       setCustomStartDate(null);
                       setCustomEndDate(null);
                     }}
                   >
                     {renderIcon('close', 16, colors.text.tertiary)}
                     <Text style={styles.clearDatesText}>Limpiar fechas</Text>
                   </TouchableOpacity>
                 )}
               </View>
             )}

             <View style={styles.periodSelectorContent}>
               {!includeAllPeriods ? (
                 <>
                   {isCalendarLoading ? (
                     <View style={styles.calendarLoadingContainer}>
                       <ActivityIndicator size="large" color={colors.primary[500]} />
                       <Text style={styles.calendarLoadingText}>Cargando calendario...</Text>
                     </View>
                   ) : (
                     <ScrollView 
                       style={styles.calendarScrollView}
                       showsVerticalScrollIndicator={false}
                       scrollEnabled={true}
                       contentContainerStyle={styles.calendarScrollContent}
                     >
                       {monthsForScroll.map((m, idx) => (
                         <CalendarMonth
                           key={`${m.getFullYear()}-${m.getMonth()}`}
                           month={m}
                           onDateSelection={handleDateSelection}
                           customStartDate={customStartDate}
                           customEndDate={customEndDate}
                         />
                       ))}

                     </ScrollView>
                   )}
                 </>
               ) : (
                 <View style={styles.allPeriodsInfo}>
                   {renderIcon('calendar-outline', 48, colors.primary[500])}
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
                 {renderIcon('close', 24, colors.text.tertiary)}
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
                    renderIcon('checkmark-circle', 24, colors.primary[500])
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
              {renderIcon('add', 20, colors.neutral.white)}
              <Text style={styles.newAccountButtonText}>Crear Nueva Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
     </View>
   );
 }
