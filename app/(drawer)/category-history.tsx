import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useApp } from "../../src/shared/context/AppProvider";
import { DatabaseTransaction } from "../../src/shared/services/database";
import {
  deleteTransaction,
  getTransactionsByCategory,
} from "../../src/shared/services/transactions";
import { categoryHistoryStyles } from "../../src/shared/styles/components/category-history";
import { colors, spacing } from "../../src/shared/styles/tokens";

// Importar SVGs
import AirplaneOutlineIcon from "../../assets/icons/airplane-outline.svg";
import ArrowBackIcon from "../../assets/icons/arrow-back.svg";
import ArrowForwardOutlineIcon from "../../assets/icons/arrow-forward-outline.svg";
import ArrowForwardIcon from "../../assets/icons/arrow-forward.svg";
import BarChartOutlineIcon from "../../assets/icons/bar-chart-outline.svg";
import BriefcaseOutlineIcon from "../../assets/icons/briefcase-outline.svg";
import BusOutlineIcon from "../../assets/icons/bus-outline.svg";
import CalendarOutlineIcon from "../../assets/icons/calendar-outline.svg";
import CarOutlineIcon from "../../assets/icons/car-outline.svg";
import CartOutlineIcon from "../../assets/icons/cart-outline.svg";
import CheckmarkCircleIcon from "../../assets/icons/checkmark-circle.svg";
import ChevronDownIcon from "../../assets/icons/chevron-down.svg";
import CloseIcon from "../../assets/icons/close.svg";
import GameControllerOutlineIcon from "../../assets/icons/game-controller-outline.svg";
import GiftOutlineIcon from "../../assets/icons/gift-outline.svg";
import HomeOutlineIcon from "../../assets/icons/home-outline.svg";
import LaptopOutlineIcon from "../../assets/icons/laptop-outline.svg";
import ListOutlineIcon from "../../assets/icons/list-outline.svg";
import MedicalOutlineIcon from "../../assets/icons/medical-outline.svg";
import PersonCircleOutlineIcon from "../../assets/icons/person-circle-outline.svg";
import ReceiptOutlineIcon from "../../assets/icons/receipt-outline.svg";
import RestaurantOutlineIcon from "../../assets/icons/restaurant-outline.svg";
import SchoolOutlineIcon from "../../assets/icons/school-outline.svg";
import SchoolIcon from "../../assets/icons/school.svg";
import SettingsOutlineIcon from "../../assets/icons/settings-outline.svg";
import TrendingUpOutlineIcon from "../../assets/icons/trending-up-outline.svg";
import WalletOutlineIcon from "../../assets/icons/wallet-outline.svg";

interface TransactionWithAccount extends DatabaseTransaction {
  accountName: string;
  accountSymbol: string;
  accountColor: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

type SortOption = "amount" | "date" | "account";

export default function CategoryHistory() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { accounts } = useApp();
  const insets = useSafeAreaInsets();

  // Mapa de componentes SVG
  const ICON_COMPONENTS: Record<string, any> = {
    "arrow-back": ArrowBackIcon,
    "chevron-down": ChevronDownIcon,
    close: CloseIcon,
    checkmark: CheckmarkCircleIcon,
    "list-outline": ListOutlineIcon,
    // Categorías de gastos
    "airplane-outline": AirplaneOutlineIcon,
    "briefcase-outline": BriefcaseOutlineIcon,
    "bus-outline": BusOutlineIcon,
    "car-outline": CarOutlineIcon,
    "cart-outline": CartOutlineIcon,
    "game-controller-outline": GameControllerOutlineIcon,
    "gift-outline": GiftOutlineIcon,
    "laptop-outline": LaptopOutlineIcon,
    "medical-outline": MedicalOutlineIcon,
    "receipt-outline": ReceiptOutlineIcon,
    "restaurant-outline": RestaurantOutlineIcon,
    "school-outline": SchoolOutlineIcon,
    "school": SchoolIcon,
    "trending-up-outline": TrendingUpOutlineIcon,
    // Categorías de ingresos
    "wallet-outline": WalletOutlineIcon,
    "home-outline": HomeOutlineIcon,
    // Otros
    "calendar-outline": CalendarOutlineIcon,
    "bar-chart-outline": BarChartOutlineIcon,
    "settings-outline": SettingsOutlineIcon,
    "person-circle-outline": PersonCircleOutlineIcon,
  };

  // Parámetros de la categoría con validación
  const categoryId = params.categoryId as string | undefined;
  const categoryName = (params.categoryName as string) || "Categoría";
  const categoryIcon = (params.categoryIcon as string) || "list-outline";
  const categoryColor =
    (params.categoryColor as string) || colors.text.tertiary;

  // Validez del ID de categoría
  const isValidCategoryId = !!categoryId;

  // Notificar y salir si el ID es inválido (sin romper orden de hooks)
  useEffect(() => {
    if (!isValidCategoryId) {
      console.warn("No categoryId provided");
      Alert.alert("Error", "ID de categoría no válido", [
        {
          text: "OK",
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              router.replace("/(drawer)");
            }
          },
        },
      ]);
    }
  }, [isValidCategoryId, navigation]);

  // Estados
  const [transactions, setTransactions] = useState<TransactionWithAccount[]>(
    [],
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionWithAccount[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);

  // Estados de filtros
  const [filterMode, setFilterMode] = useState<"date" | "amount">("date");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  // Estados de modales
  const [showAccountFilter, setShowAccountFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Estados para modal de detalles
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionWithAccount | null>(null);

  // Clave para persistencia
  const STORAGE_KEY = `category_history_filters_${categoryId}`;

  // Storage wrapper más robusto para Android (memoizado)
  const storageWrapper = useMemo(
    () => ({
      async getItem(key: string): Promise<string | null> {
        try {
          if (Platform.OS === "web") {
            return localStorage.getItem(key);
          }
          return await AsyncStorage.getItem(key);
        } catch (error) {
          console.warn("Storage getItem failed:", error);
          return null;
        }
      },
      async setItem(key: string, value: string): Promise<void> {
        try {
          if (Platform.OS === "web") {
            localStorage.setItem(key, value);
          } else {
            await AsyncStorage.setItem(key, value);
          }
        } catch (error) {
          console.warn("Storage setItem failed:", error);
        }
      },
    }),
    [],
  );

  // Cargar filtros guardados
  const loadSavedFilters = useCallback(async () => {
    try {
      const savedFilters = await storageWrapper.getItem(STORAGE_KEY);
      if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        setSelectedAccount(filters.selectedAccount || "all");
        setFilterMode(filters.filterMode || "date");
        setDateFilter(filters.dateFilter || "all");
      }
    } catch (error) {
      console.error("Error loading saved filters:", error);
    }
  }, [STORAGE_KEY, storageWrapper]);

  // Guardar filtros
  const saveFilters = useCallback(async () => {
    try {
      const filters = {
        selectedAccount,
        filterMode,
        dateFilter,
      };
      await storageWrapper.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  }, [
    selectedAccount,
    filterMode,
    dateFilter,
    STORAGE_KEY,
    storageWrapper,
  ]);

  // Cargar transacciones de la categoría con información de cuentas y categorías
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
        console.warn("No transactions returned or invalid format");
        setTransactions([]);
        return;
      }

      // Obtener todas las categorías para enriquecer las transacciones
      const { databaseService } = await import("../../src/shared/services/database");
      const allCategories = await databaseService.getCategories();

      // Enriquecer transacciones con información de cuentas y categorías
      const transactionsWithAccounts: TransactionWithAccount[] =
        categoryTransactions.map((transaction) => {
          const account = accounts.find(
            (acc) => acc.id === transaction.accountId,
          );
          const category = allCategories.find(
            (cat) => cat.id === transaction.categoryId,
          );
          return {
            ...transaction,
            accountName: account?.name || "Cuenta desconocida",
            accountSymbol: account?.symbol || "💰",
            accountColor: account?.color || colors.text.tertiary,
            categoryName: category?.name || "Categoría desconocida",
            categoryIcon: category?.icon || "list-outline",
            categoryColor: category?.color || colors.text.tertiary,
          };
        });

      setTransactions(transactionsWithAccounts);

      // Nota: ya no calculamos totalAmount global no usado
    } catch (error) {
      console.error("Error loading transactions:", error);
      // En Android, mostrar un mensaje más amigable
      if (Platform.OS === "android") {
        Alert.alert(
          "Error de Carga",
          "No se pudieron cargar las transacciones. Verifica tu conexión e intenta de nuevo.",
          [{ text: "OK", style: "default" }],
        );
      } else {
        Alert.alert("Error", "No se pudieron cargar las transacciones");
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
      if (selectedAccount !== "all") {
        filtered = filtered.filter((t) => t.accountId === selectedAccount);
      }

      // Filtrar por fecha
      if (filterMode === "date" && dateFilter !== "all") {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        try {
          switch (dateFilter) {
            case "today":
              startDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
              );
              endDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59,
              );
              break;
            case "week":
              const dayOfWeek = now.getDay();
              startDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - dayOfWeek,
              );
              endDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + (6 - dayOfWeek),
                23,
                59,
                59,
              );
              break;
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
              );
              break;
            default:
              startDate = new Date(0);
              endDate = new Date();
          }

          filtered = filtered.filter((t) => {
            try {
              const transactionDate = new Date(t.date);
              return transactionDate >= startDate && transactionDate <= endDate;
            } catch {
              console.warn("Invalid transaction date:", t.date);
              return false;
            }
          });
        } catch (dateFilterError) {
          console.warn("Date filter error:", dateFilterError);
        }
      }

      // Ordenar
      try {
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "amount":
              comparison = (a.amount || 0) - (b.amount || 0);
              break;
            case "date":
              try {
                const dateA = new Date(a.date || 0).getTime();
                const dateB = new Date(b.date || 0).getTime();
                comparison = dateA - dateB;
              } catch {
                comparison = 0;
              }
              break;
            case "account":
              comparison = (a.accountName || "").localeCompare(
                b.accountName || "",
              );
              break;
          }

          return sortDirection === "asc" ? comparison : -comparison;
        });
      } catch (sortError) {
        console.warn("Sort error:", sortError);
      }

      setFilteredTransactions(filtered);

      // Calcular total filtrado
      try {
        const filteredTotal = filtered.reduce((sum, t) => {
          const amount = t.amount || 0;
          if (t.type === "GASTO") {
            return sum - amount;
          } else {
            return sum + amount;
          }
        }, 0);

        setFilteredTotalAmount(Math.abs(filteredTotal));
      } catch (totalError) {
        console.warn("Total calculation error:", totalError);
        setFilteredTotalAmount(0);
      }
    } catch (error) {
      console.error("Filter application error:", error);
      setFilteredTransactions([]);
      setFilteredTotalAmount(0);
    }
  }, [
    transactions,
    selectedAccount,
    filterMode,
    dateFilter,
    sortBy,
    sortDirection,
  ]);

  // Guardar filtros cuando cambien
  useEffect(() => {
    saveFilters();
  }, [selectedAccount, filterMode, dateFilter, saveFilters]);

  // Cargar datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (!isValidCategoryId) return;
      loadSavedFilters();
      loadCategoryTransactions();
    }, [isValidCategoryId, loadSavedFilters, loadCategoryTransactions]),
  );

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("es-CO", { month: "long" });
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  // Función para eliminar transacción
  const handleDeleteTransaction = async (transactionId: string) => {
    console.log("🔴 handleDeleteTransaction called with ID:", transactionId);
    
    Alert.alert(
      "Eliminar Transacción",
      "¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("🔴 User cancelled deletion"),
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            console.log("🔴 User confirmed deletion");
            try {
              // Eliminar de la base de datos
              console.log("🔴 Calling deleteTransaction...");
              await deleteTransaction(transactionId);
              console.log("🔴 Transaction deleted successfully");

              // Actualizar el estado local
              const updatedTransactions = transactions.filter(
                (t) => t.id !== transactionId,
              );
              setTransactions(updatedTransactions);

              // Cerrar modal
              setShowTransactionModal(false);
              setSelectedTransaction(null);

              // Mostrar confirmación de éxito
              Alert.alert("Éxito", "Transacción eliminada correctamente");
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Alert.alert("Error", "No se pudo eliminar la transacción");
            }
          },
        },
      ]
    );
  };

  // Agrupar transacciones por fecha
  const groupTransactionsByDate = () => {
    const groups: { [key: string]: TransactionWithAccount[] } = {};

    filteredTransactions.forEach((transaction) => {
      const date = formatDate(transaction.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions,
    }));
  };

  const groupedTransactions = groupTransactionsByDate();

  // Función para cambiar filtro de cuenta
  const handleAccountFilterChange = (accountId: string) => {
    setSelectedAccount(accountId);
    setShowAccountFilter(false);
  };

  // Función para cambiar filtro de fecha
  const handleDateFilterChange = (
    filter: "all" | "today" | "week" | "month",
  ) => {
    setDateFilter(filter);
    setShowDateFilter(false);
  };

  // Función para cambiar modo de filtro
  const handleFilterModeChange = (mode: "date" | "amount") => {
    setFilterMode(mode);
    if (mode === "amount") {
      setSortBy("amount");
      setSortDirection("desc");
    } else {
      setSortBy("date");
      setSortDirection("desc");
    }
  };

  // Obtener texto del filtro de cuenta
  const getAccountFilterText = () => {
    if (selectedAccount === "all") {
      return "Total";
    }
    const account = accounts.find((acc) => acc.id === selectedAccount);
    return account
      ? `${account.symbol} ${account.name}`
      : "Cuenta seleccionada";
  };

  // Obtener texto del filtro de fecha
  const getDateFilterText = () => {
    switch (dateFilter) {
      case "today":
        return "Hoy";
      case "week":
        return "Esta semana";
      case "month":
        return "Este mes";
      default:
        return "Todas";
    }
  };

  const renderTransactionItem = ({
    item,
  }: {
    item: TransactionWithAccount;
  }) => {
    const IconComponent = ICON_COMPONENTS[item.categoryIcon] || ListOutlineIcon;
    
    return (
      <TouchableOpacity
        style={categoryHistoryStyles.transactionItem}
        onPress={() => {
          setSelectedTransaction(item);
          setShowTransactionModal(true);
        }}
        activeOpacity={0.7}
      >
        <View style={categoryHistoryStyles.transactionLeft}>
          <View
            style={[
              categoryHistoryStyles.transactionIcon,
              { backgroundColor: item.categoryColor },
            ]}
          >
            <IconComponent
              width={20}
              height={20}
              color={colors.neutral.white}
            />
          </View>
        <View style={categoryHistoryStyles.transactionInfo}>
          <Text style={categoryHistoryStyles.transactionDescription}>
            {item.categoryName}
          </Text>
          <View style={categoryHistoryStyles.accountInfo}>
            <Text
              style={[
                categoryHistoryStyles.accountSymbol,
                { color: item.accountColor },
              ]}
            >
              {item.accountSymbol}
            </Text>
            <Text style={categoryHistoryStyles.transactionAccount}>
              {item.accountName}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={[
          categoryHistoryStyles.transactionAmount,
          item.type === "GASTO"
            ? categoryHistoryStyles.expenseAmount
            : categoryHistoryStyles.incomeAmount,
        ]}
      >
        {item.type === "GASTO" ? "-" : "+"}
        {item.amount.toLocaleString("es-CO")} COL$
      </Text>
    </TouchableOpacity>
    );
  };

  const renderDateGroup = ({
    item,
  }: {
    item: { date: string; transactions: TransactionWithAccount[] };
  }) => (
    <View style={categoryHistoryStyles.dateGroup}>
      <Text style={categoryHistoryStyles.dateHeader}>{item.date}</Text>
      {item.transactions.map((transaction) => (
        <View key={transaction.id}>
          {renderTransactionItem({ item: transaction })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={categoryHistoryStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View
        style={[categoryHistoryStyles.statusBarArea, { height: insets.top }]}
      />

      {/* Header */}
      <View style={categoryHistoryStyles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              router.replace("/(drawer)");
            }
          }}
          style={categoryHistoryStyles.backButton}
        >
          <ArrowBackIcon
            width={24}
            height={24}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={categoryHistoryStyles.headerCenter}>
          <Text style={categoryHistoryStyles.headerTitle}>{categoryName}</Text>
        </View>
        <View style={categoryHistoryStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={categoryHistoryStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        {/* Total de la categoría */}
        <View style={categoryHistoryStyles.totalSection}>
          <Text style={categoryHistoryStyles.totalAmount}>
            {filteredTotalAmount.toLocaleString("es-CO")} COL$
          </Text>
          {selectedAccount !== "all" && (
            <Text style={categoryHistoryStyles.totalSubtitle}>
              Filtrado por cuenta específica
            </Text>
          )}
        </View>

        {/* Filtros */}
        <View style={categoryHistoryStyles.filtersSection}>
          {/* Filtro por cuenta */}
          <View style={categoryHistoryStyles.filterGroup}>
            <TouchableOpacity
              style={categoryHistoryStyles.filterButton}
              onPress={() => setShowAccountFilter(true)}
            >
              <View style={categoryHistoryStyles.filterButtonContent}>
                <HomeOutlineIcon
                  width={16}
                  height={16}
                  color={colors.text.tertiary}
                />
                <Text style={categoryHistoryStyles.filterButtonText}>
                  {getAccountFilterText()}
                </Text>
                <ChevronDownIcon
                  width={16}
                  height={16}
                  color={colors.text.tertiary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Filtro por fecha/cantidad */}
          <View style={categoryHistoryStyles.filterGroup}>
            <TouchableOpacity
              style={categoryHistoryStyles.filterButton}
              onPress={() => setShowDateFilter(true)}
            >
              <View style={categoryHistoryStyles.filterButtonContent}>
                {filterMode === "date" ? (
                  <CalendarOutlineIcon
                    width={16}
                    height={16}
                    color={colors.text.tertiary}
                  />
                ) : (
                  <BarChartOutlineIcon
                    width={16}
                    height={16}
                    color={colors.text.tertiary}
                  />
                )}
                <Text style={categoryHistoryStyles.filterButtonText}>
                  {filterMode === "date" ? getDateFilterText() : "Por cantidad"}
                </Text>
                <ChevronDownIcon
                  width={16}
                  height={16}
                  color={colors.text.tertiary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de transacciones */}
        {isLoading ? (
          <View style={categoryHistoryStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={categoryHistoryStyles.loadingText}>
              Cargando transacciones...
            </Text>
          </View>
        ) : filteredTransactions.length > 0 ? (
          <FlatList
            data={groupedTransactions}
            renderItem={renderDateGroup}
            keyExtractor={(item) => item.date}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={categoryHistoryStyles.transactionsList}
          />
        ) : (
          <View style={categoryHistoryStyles.emptyContainer}>
            <WalletOutlineIcon
              width={60}
              height={60}
                    color={colors.text.tertiary}
            />
            <Text style={categoryHistoryStyles.emptyText}>
              {selectedAccount !== "all"
                ? "No hay transacciones en esta cuenta para esta categoría"
                : "No hay transacciones para mostrar en esta categoría"}
            </Text>
            {selectedAccount !== "all" && (
              <TouchableOpacity
                style={categoryHistoryStyles.resetFilterButton}
                onPress={() => setSelectedAccount("all")}
              >
                <Text style={categoryHistoryStyles.resetFilterButtonText}>
                  Ver todas las cuentas
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Botón flotante para agregar transacción */}
        <TouchableOpacity
          style={categoryHistoryStyles.fab}
          onPress={() => router.push("/(drawer)/add-transaction")}
        >
          <ArrowForwardOutlineIcon
            width={24}
            height={24}
            color={colors.neutral.white}
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
        <View style={categoryHistoryStyles.modalOverlay}>
          <View style={categoryHistoryStyles.modalContent}>
            <View style={categoryHistoryStyles.modalHeader}>
              <Text style={categoryHistoryStyles.modalTitle}>
                Filtrar por cuenta
              </Text>
              <TouchableOpacity
                onPress={() => setShowAccountFilter(false)}
                style={categoryHistoryStyles.closeButton}
              >
                <CloseIcon
                  width={24}
                  height={24}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>

            <View style={categoryHistoryStyles.modalBody}>
              <TouchableOpacity
                style={[
                  categoryHistoryStyles.filterOption,
                  selectedAccount === "all" &&
                    categoryHistoryStyles.selectedFilterOption,
                ]}
                onPress={() => handleAccountFilterChange("all")}
              >
                <View style={categoryHistoryStyles.filterOptionContent}>
                  <PersonCircleOutlineIcon
                    width={20}
                    height={20}
                    color={colors.text.tertiary}
                  />
                  <Text
                    style={[
                      categoryHistoryStyles.filterOptionText,
                      selectedAccount === "all" &&
                        categoryHistoryStyles.selectedFilterOptionText,
                    ]}
                  >
                    Total
                  </Text>
                </View>
                {selectedAccount === "all" && (
                  <CheckmarkCircleIcon
                    width={20}
                    height={20}
                    color={colors.primary[500]}
                  />
                )}
              </TouchableOpacity>

              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    categoryHistoryStyles.filterOption,
                    selectedAccount === account.id &&
                      categoryHistoryStyles.selectedFilterOption,
                  ]}
                  onPress={() => handleAccountFilterChange(account.id)}
                >
                  <View style={categoryHistoryStyles.filterOptionContent}>
                    <Text
                      style={[
                        categoryHistoryStyles.accountSymbol,
                        { color: account.color },
                      ]}
                    >
                      {account.symbol}
                    </Text>
                    <Text
                      style={[
                        categoryHistoryStyles.filterOptionText,
                        selectedAccount === account.id &&
                          categoryHistoryStyles.selectedFilterOptionText,
                      ]}
                    >
                      {account.name}
                    </Text>
                  </View>
                  {selectedAccount === account.id && (
                    <CheckmarkCircleIcon
                      width={20}
                      height={20}
                      color={colors.primary[500]}
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
        <View style={categoryHistoryStyles.modalOverlay}>
          <View style={categoryHistoryStyles.modalContent}>
            <View style={categoryHistoryStyles.modalHeader}>
              <Text style={categoryHistoryStyles.modalTitle}>Filtros</Text>
              <TouchableOpacity
                onPress={() => setShowDateFilter(false)}
                style={categoryHistoryStyles.closeButton}
              >
                <CloseIcon
                  width={24}
                  height={24}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>

            <View style={categoryHistoryStyles.modalBody}>
              {/* Selector de modo */}
              <View style={categoryHistoryStyles.modeSelector}>
                <TouchableOpacity
                  style={[
                    categoryHistoryStyles.modeButton,
                    filterMode === "date" &&
                      categoryHistoryStyles.activeModeButton,
                  ]}
                  onPress={() => handleFilterModeChange("date")}
                >
                  <CalendarOutlineIcon
                    width={16}
                    height={16}
                    fill={filterMode === "date" ? "#FFFFFF" : "#666666"}
                  />
                  <Text
                    style={[
                      categoryHistoryStyles.modeButtonText,
                      filterMode === "date" &&
                        categoryHistoryStyles.activeModeButtonText,
                    ]}
                  >
                    Fecha
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    categoryHistoryStyles.modeButton,
                    filterMode === "amount" &&
                      categoryHistoryStyles.activeModeButton,
                  ]}
                  onPress={() => handleFilterModeChange("amount")}
                >
                  <BarChartOutlineIcon
                    width={16}
                    height={16}
                    fill={filterMode === "amount" ? "#FFFFFF" : "#666666"}
                  />
                  <Text
                    style={[
                      categoryHistoryStyles.modeButtonText,
                      filterMode === "amount" &&
                        categoryHistoryStyles.activeModeButtonText,
                    ]}
                  >
                    Cantidad
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Opciones de filtro por fecha */}
              {filterMode === "date" && (
                <>
                  <TouchableOpacity
                    style={[
                      categoryHistoryStyles.filterOption,
                      dateFilter === "all" &&
                        categoryHistoryStyles.selectedFilterOption,
                    ]}
                    onPress={() => handleDateFilterChange("all")}
                  >
                    <View style={categoryHistoryStyles.filterOptionContent}>
                      <ArrowForwardIcon
                        width={20}
                        height={20}
                        color={colors.text.tertiary}
                      />
                      <Text
                        style={[
                          categoryHistoryStyles.filterOptionText,
                          dateFilter === "all" &&
                            categoryHistoryStyles.selectedFilterOptionText,
                        ]}
                      >
                        Todas
                      </Text>
                    </View>
                    {dateFilter === "all" && (
                      <CheckmarkCircleIcon
                        width={20}
                        height={20}
                        color={colors.primary[500]}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      categoryHistoryStyles.filterOption,
                      dateFilter === "today" &&
                        categoryHistoryStyles.selectedFilterOption,
                    ]}
                    onPress={() => handleDateFilterChange("today")}
                  >
                    <View style={categoryHistoryStyles.filterOptionContent}>
                      <ArrowForwardOutlineIcon
                        width={20}
                        height={20}
                        color={colors.text.tertiary}
                      />
                      <Text
                        style={[
                          categoryHistoryStyles.filterOptionText,
                          dateFilter === "today" &&
                            categoryHistoryStyles.selectedFilterOptionText,
                        ]}
                      >
                        Hoy
                      </Text>
                    </View>
                    {dateFilter === "today" && (
                      <CheckmarkCircleIcon
                        width={20}
                        height={20}
                        color={colors.primary[500]}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      categoryHistoryStyles.filterOption,
                      dateFilter === "week" &&
                        categoryHistoryStyles.selectedFilterOption,
                    ]}
                    onPress={() => handleDateFilterChange("week")}
                  >
                    <View style={categoryHistoryStyles.filterOptionContent}>
                      <CalendarOutlineIcon
                        width={20}
                        height={20}
                        color={colors.text.tertiary}
                      />
                      <Text
                        style={[
                          categoryHistoryStyles.filterOptionText,
                          dateFilter === "week" &&
                            categoryHistoryStyles.selectedFilterOptionText,
                        ]}
                      >
                        Esta semana
                      </Text>
                    </View>
                    {dateFilter === "week" && (
                      <CheckmarkCircleIcon
                        width={20}
                        height={20}
                        color={colors.primary[500]}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      categoryHistoryStyles.filterOption,
                      dateFilter === "month" &&
                        categoryHistoryStyles.selectedFilterOption,
                    ]}
                    onPress={() => handleDateFilterChange("month")}
                  >
                    <View style={categoryHistoryStyles.filterOptionContent}>
                      <CalendarOutlineIcon
                        width={20}
                        height={20}
                        color={colors.text.tertiary}
                      />
                      <Text
                        style={[
                          categoryHistoryStyles.filterOptionText,
                          dateFilter === "month" &&
                            categoryHistoryStyles.selectedFilterOptionText,
                        ]}
                      >
                        Este mes
                      </Text>
                    </View>
                    {dateFilter === "month" && (
                      <CheckmarkCircleIcon
                        width={20}
                        height={20}
                        color={colors.primary[500]}
                      />
                    )}
                  </TouchableOpacity>

                </>
              )}

              {/* Información del modo cantidad */}
              {filterMode === "amount" && (
                <View style={categoryHistoryStyles.infoBox}>
                  <SettingsOutlineIcon
                    width={20}
                    height={20}
                    color={colors.primary[500]}
                  />
                  <Text style={categoryHistoryStyles.infoText}>
                    Las transacciones se ordenarán por cantidad de mayor a
                    menor, agrupadas por fecha
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
        <View style={categoryHistoryStyles.transactionModalOverlay}>
          <View
            style={categoryHistoryStyles.transactionModalContainer}
            accessibilityLabel="Detalles de la transacción"
            accessible={true}
          >
            {/* Header del modal */}
            <View style={categoryHistoryStyles.transactionModalHeader}>
              <Text style={categoryHistoryStyles.transactionModalTitle}>
                Detalles de Transacción
              </Text>
              <TouchableOpacity
                style={categoryHistoryStyles.transactionModalCloseButton}
                onPress={() => setShowTransactionModal(false)}
              >
                <CloseIcon
                  width={24}
                  height={24}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>

            {/* Contenido del modal */}
            {selectedTransaction && (
              <View style={categoryHistoryStyles.transactionModalContent}>
                {/* Cantidad */}
                <View style={categoryHistoryStyles.detailRow}>
                  <Text style={categoryHistoryStyles.detailLabel}>
                    Cantidad
                  </Text>
                  <Text
                    style={[
                      categoryHistoryStyles.detailValue,
                      categoryHistoryStyles.detailAmount,
                      selectedTransaction.type === "GASTO"
                        ? categoryHistoryStyles.detailAmountExpense
                        : categoryHistoryStyles.detailAmountIncome,
                    ]}
                  >
                    {selectedTransaction.type === "GASTO" ? "-" : "+"}
                    {selectedTransaction.amount.toLocaleString("es-CO")} COL$
                  </Text>
                </View>

                {/* Cuenta */}
                <View style={categoryHistoryStyles.detailRow}>
                  <Text style={categoryHistoryStyles.detailLabel}>Cuenta</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text
                      style={[
                        categoryHistoryStyles.detailValue,
                        {
                          color: selectedTransaction.accountColor,
                          marginRight: spacing[2],
                        },
                      ]}
                    >
                      {selectedTransaction.accountSymbol}
                    </Text>
                    <Text style={categoryHistoryStyles.detailValue}>
                      {selectedTransaction.accountName}
                    </Text>
                  </View>
                </View>

                {/* Categoría */}
                <View style={categoryHistoryStyles.detailRow}>
                  <Text style={categoryHistoryStyles.detailLabel}>
                    Categoría
                  </Text>
                  <View style={categoryHistoryStyles.detailValueContainer}>
                    <Text style={categoryHistoryStyles.detailValue}>
                      {selectedTransaction.categoryName}
                    </Text>
                    <View
                      style={[
                        categoryHistoryStyles.transactionIcon,
                        {
                          backgroundColor: selectedTransaction.categoryColor,
                          width: 24,
                          height: 24,
                          marginLeft: spacing[2],
                        },
                      ]}
                    >
                      {(() => {
                        const IconComponent = ICON_COMPONENTS[selectedTransaction.categoryIcon] || ListOutlineIcon;
                        return (
                          <IconComponent
                            width={12}
                            height={12}
                            color={colors.neutral.white}
                          />
                        );
                      })()}
                    </View>
                  </View>
                </View>

                {/* Fecha */}
                <View
                  style={[
                    categoryHistoryStyles.detailRow,
                    { borderBottomWidth: 1 },
                  ]}
                >
                  <Text style={categoryHistoryStyles.detailLabel}>Fecha</Text>
                  <Text style={categoryHistoryStyles.detailValue}>
                    {formatDate(selectedTransaction.date)}
                  </Text>
                </View>

                {/* Nota (si existe) */}
                {selectedTransaction.note && (
                  <View
                    style={[
                      categoryHistoryStyles.detailRow,
                      { borderBottomWidth: 0, marginTop: spacing[2] },
                    ]}
                  >
                    <Text style={categoryHistoryStyles.detailLabel}>Nota</Text>
                    <Text
                      style={[
                        categoryHistoryStyles.detailValue,
                        { textAlign: "right", flex: 1 },
                      ]}
                    >
                      {selectedTransaction.note}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Botones de acción */}
            <View style={categoryHistoryStyles.modalActions}>
              <TouchableOpacity
                style={[
                  categoryHistoryStyles.actionButton,
                  categoryHistoryStyles.cancelButton,
                ]}
                onPress={() => setShowTransactionModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cerrar modal"
                accessibilityHint="Cierra el modal de detalles de transacción"
              >
                <Text style={categoryHistoryStyles.cancelButtonText}>
                  Cerrar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  categoryHistoryStyles.actionButton,
                  categoryHistoryStyles.deleteButton,
                ]}
                onPress={() => {
                  console.log(
                    "🔴 Delete button pressed, selectedTransaction:",
                    selectedTransaction,
                  );
                  if (selectedTransaction) {
                    handleDeleteTransaction(selectedTransaction.id);
                  } else {
                    console.log("🔴 No selectedTransaction found");
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel="Eliminar transacción"
                accessibilityHint="Elimina esta transacción permanentemente"
              >
                <Text style={categoryHistoryStyles.deleteButtonText}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
