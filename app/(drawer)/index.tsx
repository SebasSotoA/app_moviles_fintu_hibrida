import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import WelcomeModal from "../../components/WelcomeModal";
import { useApp } from "../../src/shared/context/AppProvider";
import { dashboardStyles } from "../../src/shared/styles/components/dashboard";
import { dateRangeCalendarStyles } from "../../src/shared/styles/components/date-range-calendar";
import { colors } from "../../src/shared/styles/tokens";

// Importar SVGs
import AddIcon from "../../assets/icons/add.svg";
import AirplaneOutlineIcon from "../../assets/icons/airplane-outline.svg";
import ArrowForwardOutlineIcon from "../../assets/icons/arrow-forward-outline.svg";
import ArrowForwardIcon from "../../assets/icons/arrow-forward.svg";
import BarChartOutlineIcon from "../../assets/icons/bar-chart-outline.svg";
import BriefcaseOutlineIcon from "../../assets/icons/briefcase-outline.svg";
import BusOutlineIcon from "../../assets/icons/bus-outline.svg";
import CalendarOutlineIcon from "../../assets/icons/calendar-outline.svg";
import CarOutlineIcon from "../../assets/icons/car-outline.svg";
import CartOutlineIcon from "../../assets/icons/cart-outline.svg";
import CheckmarkCircleIcon from "../../assets/icons/checkmark-circle.svg";
import ChevronBackIcon from "../../assets/icons/chevron-back.svg";
import ChevronDownIcon from "../../assets/icons/chevron-down.svg";
import ChevronForwardIcon from "../../assets/icons/chevron-forward.svg";
import CloseIcon from "../../assets/icons/close.svg";
import FintuLogoIcon from "../../assets/icons/fintu-logo.svg";
import FolderOpenOutlineIcon from "../../assets/icons/folder-open-outline.svg";
import GameControllerOutlineIcon from "../../assets/icons/game-controller-outline.svg";
import GiftOutlineIcon from "../../assets/icons/gift-outline.svg";
import HomeOutlineIcon from "../../assets/icons/home-outline.svg";
import LaptopOutlineIcon from "../../assets/icons/laptop-outline.svg";
import ListOutlineIcon from "../../assets/icons/list-outline.svg";
import MedicalOutlineIcon from "../../assets/icons/medical-outline.svg";
import MenuIcon from "../../assets/icons/menu.svg";
import PersonCircleOutlineIcon from "../../assets/icons/person-circle-outline.svg";
import PieChartOutlineIcon from "../../assets/icons/pie-chart-outline.svg";
import ReceiptOutlineIcon from "../../assets/icons/receipt-outline.svg";
import RestaurantOutlineIcon from "../../assets/icons/restaurant-outline.svg";
import SchoolOutlineIcon from "../../assets/icons/school-outline.svg";
import SchoolIcon from "../../assets/icons/school.svg";
import SettingsOutlineIcon from "../../assets/icons/settings-outline.svg";
import TodayIcon from "../../assets/icons/today.svg";
import TrendingUpOutlineIcon from "../../assets/icons/trending-up-outline.svg";
import WalletOutlineIcon from "../../assets/icons/wallet-outline.svg";

// Mapa de componentes SVG
const ICON_COMPONENTS: Record<string, any> = {
  "list-outline": ListOutlineIcon,
  "arrow-forward": ArrowForwardIcon,
  "arrow-forward-outline": ArrowForwardOutlineIcon,
  "chevron-down": ChevronDownIcon,
  close: CloseIcon,
  "checkmark-circle": CheckmarkCircleIcon,
  "wallet-outline": WalletOutlineIcon,
  "home-outline": HomeOutlineIcon,
  "bar-chart-outline": BarChartOutlineIcon,
  "person-circle-outline": PersonCircleOutlineIcon,
  "settings-outline": SettingsOutlineIcon,
  "calendar-outline": CalendarOutlineIcon,
  menu: MenuIcon,
  "chevron-back": ChevronBackIcon,
  "chevron-forward": ChevronForwardIcon,
  today: TodayIcon,
  "pie-chart-outline": PieChartOutlineIcon,
  "folder-open-outline": FolderOpenOutlineIcon,
  add: AddIcon,
  // Íconos de categorías
  "cart-outline": CartOutlineIcon,
  "car-outline": CarOutlineIcon,
  "restaurant-outline": RestaurantOutlineIcon,
  "medical-outline": MedicalOutlineIcon,
  "bus-outline": BusOutlineIcon,
  "airplane-outline": AirplaneOutlineIcon,
  school: SchoolIcon,
  "school-outline": SchoolOutlineIcon,
  "game-controller-outline": GameControllerOutlineIcon,
  "receipt-outline": ReceiptOutlineIcon,
  "briefcase-outline": BriefcaseOutlineIcon,
  "laptop-outline": LaptopOutlineIcon,
  "trending-up-outline": TrendingUpOutlineIcon,
  "gift-outline": GiftOutlineIcon,
};

// Helper para renderizar íconos locales con tamaño y color
const renderIcon = (
  name: string,
  size: number,
  color?: string,
  style?: any,
) => {
  const IconComponent = ICON_COMPONENTS[name] || ListOutlineIcon;
  return (
    <IconComponent
      width={size}
      height={size}
      color={color}
      style={style}
    />
  );
};

type TransactionType = "GASTOS" | "INGRESOS";
type FilterPeriod = "Día" | "Semana" | "Mes" | "Año" | "Período";

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
  color: string;
}

// Componente optimizado para renderizar un mes del calendario
const CalendarMonth = React.memo(
  ({
    month,
    onDateSelection,
    customStartDate,
    customEndDate,
  }: {
    month: Date;
    onDateSelection: (date: Date) => void;
    customStartDate: Date | null;
    customEndDate: Date | null;
  }) => {
    // Función para obtener los días del calendario
    const getCalendarDaysFor = useCallback(
      (baseDate: Date) => {
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
        const daysFromNextMonth =
          totalDaysToShow - daysFromPreviousMonth - lastDayOfMonth.getDate();

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
            isSelected:
              customStartDate &&
              customEndDate &&
              date >= customStartDate &&
              date <= customEndDate,
            isStartDate:
              customStartDate && date.getTime() === customStartDate.getTime(),
            isEndDate:
              customEndDate && date.getTime() === customEndDate.getTime(),
            isInRange:
              customStartDate &&
              customEndDate &&
              date > customStartDate &&
              date < customEndDate,
          });
        }

        // Agregar días del mes actual
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
          const date = new Date(year, month, day);
          days.push({
            date,
            isCurrentMonth: true,
            isSelected:
              customStartDate &&
              customEndDate &&
              date >= customStartDate &&
              date <= customEndDate,
            isStartDate:
              customStartDate && date.getTime() === customStartDate.getTime(),
            isEndDate:
              customEndDate && date.getTime() === customEndDate.getTime(),
            isInRange:
              customStartDate &&
              customEndDate &&
              date > customStartDate &&
              date < customEndDate,
          });
        }

        // Agregar días del mes siguiente
        for (let day = 1; day <= daysFromNextMonth; day++) {
          const date = new Date(year, month + 1, day);
          days.push({
            date,
            isCurrentMonth: false,
            isSelected:
              customStartDate &&
              customEndDate &&
              date >= customStartDate &&
              date <= customEndDate,
            isStartDate:
              customStartDate && date.getTime() === customStartDate.getTime(),
            isEndDate:
              customEndDate && date.getTime() === customEndDate.getTime(),
            isInRange:
              customStartDate &&
              customEndDate &&
              date > customStartDate &&
              date < customEndDate,
          });
        }

        return days;
      },
      [customStartDate, customEndDate],
    );

    return (
      <View style={dateRangeCalendarStyles.calendarContainer}>
        <View style={dateRangeCalendarStyles.calendarHeader}>
          <Text style={dateRangeCalendarStyles.calendarMonthYear}>
            {month.toLocaleDateString("es-CO", {
              month: "long",
              year: "numeric",
            }).replace(/^\w/, c => c.toUpperCase())}
          </Text>
        </View>

        <View style={dateRangeCalendarStyles.calendarDaysHeader}>
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <Text key={day} style={dateRangeCalendarStyles.calendarDayHeader}>
              {day}
            </Text>
          ))}
        </View>

        <View style={dateRangeCalendarStyles.calendarGrid}>
          {getCalendarDaysFor(month).map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                dateRangeCalendarStyles.calendarDay,
                day.isCurrentMonth &&
                  dateRangeCalendarStyles.calendarDayCurrentMonth,
                day.isSelected && dateRangeCalendarStyles.calendarDaySelected,
                day.isInRange && dateRangeCalendarStyles.calendarDayInRange,
                day.isStartDate && dateRangeCalendarStyles.calendarDayStart,
                day.isEndDate && dateRangeCalendarStyles.calendarDayEnd,
              ]}
              onPress={() => onDateSelection(day.date)}
              disabled={!day.isCurrentMonth}
            >
              <Text
                style={[
                  dateRangeCalendarStyles.calendarDayText,
                  day.isCurrentMonth &&
                    dateRangeCalendarStyles.calendarDayTextCurrentMonth,
                  day.isSelected &&
                    dateRangeCalendarStyles.calendarDayTextSelected,
                  day.isInRange &&
                    dateRangeCalendarStyles.calendarDayTextInRange,
                ]}
              >
                {day.date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  },
);

CalendarMonth.displayName = "CalendarMonth";

export default function Home() {
  const navigation = useNavigation();
  const {
    currentAccount,
    getTransactionStats,
    accounts,
    setCurrentAccount,
    isLoading,
  } = useApp();

  // Usar estilos importados del sistema de componentes
  const params = useLocalSearchParams();
  const [activeType, setActiveType] = useState<TransactionType>("GASTOS");
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>("Día");
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
      setActivePeriod("Período");
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
    if (accountCreated === "true") {
      if (Platform.OS === "web") {
        window.alert("Cuenta creada exitosamente");
      } else {
        Alert.alert("Éxito", "Cuenta creada exitosamente");
      }
      // Limpiar la URL para evitar repetir el mensaje
      router.replace("/(drawer)");
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

  const getDateRange = useCallback(
    (date: Date, period: FilterPeriod) => {
      const start = new Date(date);
      const end = new Date(date);

      switch (period) {
        case "Día":
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case "Semana":
          start.setDate(date.getDate() - date.getDay());
          start.setHours(0, 0, 0, 0);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;
        case "Mes":
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(date.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case "Año":
          start.setMonth(0, 1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(11, 31);
          end.setHours(23, 59, 59, 999);
          break;
        case "Período":
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
        endDate: end.toISOString(),
      };
    },
    [includeAllPeriods, customStartDate, customEndDate],
  );

  const loadCategoryStats = useCallback(async () => {
    if (!currentAccount) return;

    setIsLoadingStats(true);
    try {
      const { startDate, endDate } = getDateRange(currentDate, activePeriod);

      const stats = await getTransactionStats(
        startDate,
        endDate,
        activeType === "GASTOS" ? "GASTO" : "INGRESO",
        currentAccount.id,
      );

      // Calcular total y porcentajes
      const total = stats.reduce(
        (sum, stat) => sum + (stat.totalAmount || 0),
        0,
      );

      // Calcular porcentajes con precisión decimal
      const categoriesWithRawPercentage = stats.map((stat) => ({
        id: stat.id,
        name: stat.name,
        icon: stat.icon,
        amount: stat.totalAmount || 0,
        rawPercentage: total > 0 ? (stat.totalAmount / total) * 100 : 0,
        color: stat.color,
      }));

      // Ajustar porcentajes para que sumen exactamente 100%
      const totalRawPercentage = categoriesWithRawPercentage.reduce(
        (sum, cat) => sum + cat.rawPercentage,
        0,
      );
      const adjustment = 100 - totalRawPercentage;

      const categoriesWithPercentage = categoriesWithRawPercentage.map(
        (cat, index) => ({
          ...cat,
          percentage:
            index === categoriesWithRawPercentage.length - 1
              ? Math.round(cat.rawPercentage + adjustment) // Ajustar el último elemento
              : Math.round(cat.rawPercentage),
        }),
      );

      setCategoryStats(categoriesWithPercentage);

      // Debug logs para temporalidad de "Día"
      if (activePeriod === "Día") {
        console.log("=== DEBUG GRÁFICO DÍA ===");
        console.log("Fecha:", currentDate.toISOString().split("T")[0]);
        console.log("Rango:", { startDate, endDate });
        console.log("Stats raw:", stats);
        console.log("Total:", total);
        console.log("Categorías con porcentaje:", categoriesWithPercentage);
        console.log("========================");
      }
    } catch (error) {
      console.error("Error loading category stats:", error);
      setCategoryStats([]);
    } finally {
      setIsLoadingStats(false);
    }
  }, [
    currentAccount,
    currentDate,
    activePeriod,
    activeType,
    getTransactionStats,
    getDateRange,
  ]);

  // Cargar estadísticas cuando cambien los filtros
  useEffect(() => {
    loadCategoryStats();
  }, [
    activeType,
    activePeriod,
    currentDate,
    currentAccount?.id,
    loadCategoryStats,
  ]);

  // Recargar cuando la pantalla toma foco (p. ej., al volver de crear transacción)
  useFocusEffect(
    useCallback(() => {
      loadCategoryStats();
      return () => {};
    }, [loadCategoryStats]),
  );

  const currentCategories = categoryStats;
  const totalAmount = currentCategories.reduce(
    (sum, cat) => sum + cat.amount,
    0,
  );

  // Función para formatear fechas según el período
  const formatDateForPeriod = (date: Date, period: FilterPeriod): string => {
    const months = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];

    switch (period) {
      case "Día": {
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day} de ${month}`;
      }
      case "Semana": {
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
      case "Mes": {
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
      }
      case "Año": {
        return date.getFullYear().toString();
      }
      case "Período": {
        if (customStartDate && customEndDate) {
          const startDay = customStartDate.getDate();
          const startMonth = months[customStartDate.getMonth()];
          const endDay = customEndDate.getDate();
          const endMonth = months[customEndDate.getMonth()];
          return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
        } else {
          return "Período personalizado";
        }
      }
      default:
        return "";
    }
  };

  // Función para navegar en el tiempo
  const navigateTime = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    switch (activePeriod) {
      case "Día":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "Semana":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "Mes":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "Año":
        newDate.setFullYear(
          newDate.getFullYear() + (direction === "next" ? 1 : -1),
        );
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
    endAngle: number,
  ) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      centerX,
      centerY,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Filtrar categorías con porcentajes válidos (> 0)
  const validCategories = currentCategories.filter((cat) => cat.percentage > 0);

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
        isFullCircle: true, // 👈 marcador especial
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
        runOnJS(navigateTime)("prev");
      } else if (e.translationX < -threshold) {
        // Deslizar hacia la izquierda (ir hacia adelante en el tiempo)
        runOnJS(navigateTime)("next");
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
      style={dashboardStyles.categoryCard}
      onPress={() => {
        // Navegar al historial de la categoría
        router.push({
          pathname: "/(drawer)/category-history",
          params: {
            categoryId: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            transactionType: activeType,
          },
        });
      }}
    >
      {/* Ícono de la categoría */}
      <View
        style={[
          dashboardStyles.categoryIcon,
          { backgroundColor: category.color },
        ]}
      >
        {renderIcon(category.icon, 24, colors.neutral.white)}
      </View>

      {/* Información de la categoría */}
      <View style={dashboardStyles.categoryInfo}>
        <Text style={dashboardStyles.categoryName}>{category.name}</Text>
        <Text style={dashboardStyles.categoryAmount}>
          {category.amount.toLocaleString("es-CO")} COP
        </Text>
      </View>

      {/* Porcentaje */}
      <Text style={dashboardStyles.categoryPercentage}>
        {category.percentage}%
      </Text>
    </TouchableOpacity>
  );

  // Mostrar pantalla de carga solo si no hay cuenta actual
  if (isLoading || !currentAccount) {
    return (
      <View style={dashboardStyles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background.dark}
        />
        <View style={[dashboardStyles.statusBarArea, { height: insets.top }]} />
        <View style={dashboardStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={dashboardStyles.loadingText}>
            {isLoading ? "Inicializando aplicación..." : "Cargando cuenta..."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={dashboardStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View style={[dashboardStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={dashboardStyles.header}>
        <TouchableOpacity
          onPress={openDrawer}
          style={dashboardStyles.menuButton}
        >
          <MenuIcon
            width={35}
            height={35}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={dashboardStyles.headerCenter}>
          <View style={dashboardStyles.logoContainer}>
            <FintuLogoIcon
              width="100%" 
              height="100%"
              color={colors.neutral.white}
            />
          </View>
        </View>
        <View style={dashboardStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={dashboardStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={dashboardStyles.content}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Selector de cuenta activa y saldo */}
          <View style={dashboardStyles.accountSection}>
            <Text style={dashboardStyles.accountLabel}>Cuenta actual</Text>
            <TouchableOpacity
              style={dashboardStyles.accountSelector}
              onPress={() => setShowAccountSelector(true)}
              activeOpacity={0.7}
            >
              <Text style={dashboardStyles.accountSymbol}>
                {currentAccount?.symbol || "💰"}
              </Text>
              <Text style={dashboardStyles.accountName}>
                {currentAccount?.name || "Cargando..."}
              </Text>
              {renderIcon("chevron-down", 20, colors.text.tertiary)}
            </TouchableOpacity>
            <Text style={dashboardStyles.balance}>
              {currentAccount?.balance?.toLocaleString("es-CO") || "0"}{" "}
              {currentAccount?.currency || "COP"}
            </Text>
          </View>

          {/* Toggle Gastos/Ingresos */}
          <View style={dashboardStyles.toggleContainer}>
            <TouchableOpacity
              style={[
                dashboardStyles.toggleButton,
                activeType === "GASTOS" && dashboardStyles.activeToggleButton,
              ]}
              onPress={() => setActiveType("GASTOS")}
            >
              <Text
                style={[
                  dashboardStyles.toggleText,
                  activeType === "GASTOS" && dashboardStyles.activeToggleText,
                ]}
              >
                GASTOS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dashboardStyles.toggleButton,
                activeType === "INGRESOS" && dashboardStyles.activeToggleButton,
              ]}
              onPress={() => setActiveType("INGRESOS")}
            >
              <Text
                style={[
                  dashboardStyles.toggleText,
                  activeType === "INGRESOS" && dashboardStyles.activeToggleText,
                ]}
              >
                INGRESOS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filtro temporal - Grid responsivo */}
          <View style={dashboardStyles.periodFilterContainer}>
            <View style={dashboardStyles.periodFilterGrid}>
              {(["Día", "Semana", "Mes", "Año"] as FilterPeriod[]).map(
                (period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      dashboardStyles.periodButton,
                      activePeriod === period &&
                        dashboardStyles.activePeriodButton,
                    ]}
                    onPress={() => setActivePeriod(period)}
                  >
                    <Text
                      style={[
                        dashboardStyles.periodText,
                        activePeriod === period &&
                          dashboardStyles.activePeriodText,
                      ]}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
              <TouchableOpacity
                style={[
                  dashboardStyles.periodButton,
                  activePeriod === "Período" &&
                    dashboardStyles.activePeriodButton,
                ]}
                onPress={() => setShowPeriodSelector(true)}
              >
                <Text
                  style={[
                    dashboardStyles.periodText,
                    activePeriod === "Período" &&
                      dashboardStyles.activePeriodText,
                  ]}
                >
                  Período
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección del gráfico de torta con navegación temporal */}
          <View style={dashboardStyles.chartSection}>
            {/* Fecha actual según período - Solo esta parte se anima */}
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[dashboardStyles.dateHeader, animatedStyle]}
              >
                <TouchableOpacity
                  onPress={() => navigateTime("prev")}
                  style={dashboardStyles.dateNavButton}
                >
                  {renderIcon(
                    "chevron-back",
                    20,
                    colors.background.toggleUnpressed,
                  )}
                </TouchableOpacity>

                <Text style={dashboardStyles.currentDate}>
                  {formatDateForPeriod(currentDate, activePeriod)}
                </Text>

                <TouchableOpacity
                  onPress={() => navigateTime("next")}
                  style={dashboardStyles.dateNavButton}
                >
                  {renderIcon(
                    "chevron-forward",
                    20,
                    colors.background.toggleUnpressed,
                  )}
                </TouchableOpacity>

                {/* Botón para volver a fecha actual */}
                <TouchableOpacity
                  onPress={() => setCurrentDate(new Date())}
                  style={dashboardStyles.todayButton}
                >
                  {renderIcon("today", 20, colors.background.toggleUnpressed)}
                </TouchableOpacity>
              </Animated.View>
            </GestureDetector>

            {/* Gráfico de torta */}
            <View style={dashboardStyles.pieChartContainer}>
              {isLoadingStats ? (
                <View style={dashboardStyles.loadingChart}>
                  <ActivityIndicator size="large" color={colors.primary[500]} />
                  <Text style={dashboardStyles.loadingText}>
                    Cargando datos...
                  </Text>
                </View>
              ) : pieData.length > 0 ? (
                <View style={dashboardStyles.chartWrapper}>
                  {/* Gráfico de torta SVG */}
                  <Svg
                    width={160}
                    height={160}
                    style={dashboardStyles.svgChart}
                  >
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
                          d={(slice as any).path || ""}
                          fill={slice.color}
                          stroke={colors.neutral.white}
                          strokeWidth={2}
                        />
                      ),
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
                  <View style={dashboardStyles.centerValue}>
                    <Text style={dashboardStyles.centerAmount}>
                      {totalAmount.toLocaleString("es-CO")}
                    </Text>
                    <Text style={dashboardStyles.centerCurrency}>
                      {currentAccount?.currency || "COP"}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={dashboardStyles.emptyChart}>
                  {renderIcon("pie-chart-outline", 60, colors.text.tertiary)}
                  <Text style={dashboardStyles.emptyChartText}>
                    {activeType === "GASTOS"
                      ? "No hay gastos"
                      : "No hay ingresos"}{" "}
                    para mostrar
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Tarjetas de categorías */}
          <View style={dashboardStyles.categoriesSection}>
            <Text style={dashboardStyles.categoriesTitle}>
              Categorías de{" "}
              {activeType.charAt(0).toUpperCase() +
                activeType.slice(1).toLowerCase()}
            </Text>
            {isLoadingStats ? (
              <View style={dashboardStyles.loadingCategories}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
                <Text style={dashboardStyles.loadingText}>
                  Cargando categorías...
                </Text>
              </View>
            ) : currentCategories.length > 0 ? (
              <View style={dashboardStyles.categoriesGrid}>
                {currentCategories.map(renderCategoryCard)}
              </View>
            ) : (
              <View style={dashboardStyles.emptyCategories}>
                {renderIcon("folder-open-outline", 40, colors.text.tertiary)}
                <Text style={dashboardStyles.emptyCategoriesText}>
                  No hay {activeType.toLowerCase()} registrados para este
                  período
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Botón Nuevo + - Cambiado a posicionamiento relativo */}
        <View style={dashboardStyles.newButtonContainer}>
          <TouchableOpacity
            style={dashboardStyles.newButton}
            onPress={() => router.push("/(drawer)/add-transaction")}
          >
            <Text style={dashboardStyles.newButtonText}>
              + Nueva Transacción
            </Text>
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
        <View style={dashboardStyles.modalOverlay}>
          <View style={dashboardStyles.periodSelectorModal}>
            <View style={dashboardStyles.modalHeader}>
              <Text style={dashboardStyles.modalTitle}>
                Seleccionar Período
              </Text>
              <TouchableOpacity
                onPress={() => setShowPeriodSelector(false)}
                style={dashboardStyles.closeButton}
              >
                {renderIcon("close", 24, colors.text.tertiary)}
              </TouchableOpacity>
            </View>

            {/* Control fijo: Incluir todos los períodos */}
            <View style={dashboardStyles.fixedIncludeAllSection}>
              <TouchableOpacity
                style={dashboardStyles.includeAllRow}
                onPress={
                  Platform.OS === "web"
                    ? () => handleIncludeAllToggle(!includeAllPeriods)
                    : undefined
                }
                accessibilityRole={
                  Platform.OS === "web" ? "checkbox" : "switch"
                }
                accessibilityState={{ checked: includeAllPeriods }}
                accessibilityLabel="Incluir todos los períodos"
                activeOpacity={0.7}
              >
                <Text style={dashboardStyles.includeAllText}>
                  Incluir todos los períodos
                </Text>
                {Platform.OS === "web" ? (
                  renderIcon(
                    includeAllPeriods ? "checkmark-circle" : "list-outline",
                    22,
                    includeAllPeriods
                      ? colors.primary[500]
                      : colors.text.tertiary,
                  )
                ) : (
                  <Switch
                    value={includeAllPeriods}
                    onValueChange={handleIncludeAllToggle}
                    thumbColor={
                      includeAllPeriods ? colors.primary[500] : undefined
                    }
                    trackColor={{
                      false: colors.border.light,
                      true: colors.primary[200],
                    }}
                    accessibilityLabel="Interruptor incluir todos los períodos"
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Rango seleccionado - Fijo debajo del control de incluir todos */}
            {!includeAllPeriods && (customStartDate || customEndDate) && (
              <View style={dashboardStyles.fixedDateRangeSection}>
                <Text style={dashboardStyles.dateRangeLabel}>
                  Rango seleccionado:
                </Text>
                <Text style={dashboardStyles.dateRangeText}>
                  {customStartDate && customEndDate
                    ? `${customStartDate.toLocaleDateString("es-CO")} - ${customEndDate.toLocaleDateString("es-CO")}`
                    : customStartDate
                      ? `${customStartDate.toLocaleDateString("es-CO")} - Selecciona fecha final`
                      : "Selecciona fecha inicial"}
                </Text>
                {(customStartDate || customEndDate) && (
                  <TouchableOpacity
                    style={dashboardStyles.clearDatesButton}
                    onPress={() => {
                      setCustomStartDate(null);
                      setCustomEndDate(null);
                    }}
                  >
                    {renderIcon("close", 16, colors.text.tertiary)}
                    <Text style={dashboardStyles.clearDatesText}>
                      Limpiar fechas
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={dashboardStyles.periodSelectorContent}>
              {!includeAllPeriods ? (
                <>
                  {isCalendarLoading ? (
                    <View style={dashboardStyles.calendarLoadingContainer}>
                      <ActivityIndicator
                        size="large"
                        color={colors.primary[500]}
                      />
                      <Text style={dashboardStyles.calendarLoadingText}>
                        Cargando calendario...
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      style={dashboardStyles.calendarScrollView}
                      showsVerticalScrollIndicator={false}
                      scrollEnabled={true}
                      contentContainerStyle={
                        dashboardStyles.calendarScrollContent
                      }
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
                <View style={dashboardStyles.allPeriodsInfo}>
                  {renderIcon("calendar-outline", 48, colors.primary[500])}
                  <Text style={dashboardStyles.allPeriodsTitle}>
                    Todos los períodos
                  </Text>
                  <Text style={dashboardStyles.allPeriodsDescription}>
                    Se incluirán todas las transacciones registradas en la
                    aplicación
                  </Text>
                </View>
              )}

              <View style={dashboardStyles.periodSelectorActions}>
                <TouchableOpacity
                  style={[
                    dashboardStyles.periodSelectorButton,
                    dashboardStyles.cancelButton,
                  ]}
                  onPress={() => {
                    setShowPeriodSelector(false);
                  }}
                >
                  <Text style={dashboardStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    dashboardStyles.periodSelectorButton,
                    dashboardStyles.confirmButton,
                  ]}
                  onPress={() => {
                    if (
                      includeAllPeriods ||
                      (customStartDate && customEndDate)
                    ) {
                      setActivePeriod("Período");
                      setShowPeriodSelector(false);
                    }
                  }}
                  disabled={
                    !(includeAllPeriods || (customStartDate && customEndDate))
                  }
                >
                  <Text style={dashboardStyles.confirmButtonText}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Modal Selector de Cuenta */}
      {showAccountSelector && (
        <View style={dashboardStyles.modalOverlay}>
          <View style={dashboardStyles.accountSelectorModal}>
            <View style={dashboardStyles.modalHeader}>
              <Text style={dashboardStyles.modalTitle}>Seleccionar Cuenta</Text>
              <TouchableOpacity
                onPress={() => setShowAccountSelector(false)}
                style={dashboardStyles.closeButton}
              >
                {renderIcon("close", 24, colors.text.tertiary)}
              </TouchableOpacity>
            </View>

            <ScrollView
              style={dashboardStyles.accountsList}
              showsVerticalScrollIndicator={false}
            >
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    dashboardStyles.accountItem,
                    currentAccount?.id === account.id &&
                      dashboardStyles.selectedAccountItem,
                  ]}
                  onPress={() => {
                    setCurrentAccount(account.id);
                    setShowAccountSelector(false);
                  }}
                >
                  <View style={dashboardStyles.accountItemLeft}>
                    <Text style={dashboardStyles.accountItemSymbol}>
                      {account.symbol}
                    </Text>
                    <View style={dashboardStyles.accountItemInfo}>
                      <Text style={dashboardStyles.accountItemName}>
                        {account.name}
                      </Text>
                      <Text style={dashboardStyles.accountItemBalance}>
                        {account.balance.toLocaleString("es-CO")}{" "}
                        {account.currency}
                      </Text>
                    </View>
                  </View>
                  {currentAccount?.id === account.id &&
                    renderIcon("checkmark-circle", 24, colors.primary[500])}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={dashboardStyles.newAccountButton}
              onPress={() => {
                setShowAccountSelector(false);
                router.push({
                  pathname: "/(drawer)/new-account",
                  params: { returnPath: "/(drawer)/accounts" },
                });
              }}
            >
              {renderIcon("add", 20, colors.neutral.white)}
              <Text style={dashboardStyles.newAccountButtonText}>
                Crear Nueva Cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
