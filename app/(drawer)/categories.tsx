import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
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

import {
    badgeStyles,
    badgeTextStyles,
    buttonStyles,
    buttonTextStyles,
    cardStyles,
    categoriesStyles,
    formStyles,
    layoutStyles,
    textStyles,
} from "../../src/shared/styles/components";
import { colors, spacing } from "../../src/shared/styles/tokens";

// Importar SVGs
import AddCircleOutlineIcon from "../../assets/icons/add-circle-outline.svg";
import AirplaneOutlineIcon from "../../assets/icons/airplane-outline.svg";
import ArrowBackIcon from "../../assets/icons/arrow-back.svg";
import BriefcaseOutlineIcon from "../../assets/icons/briefcase-outline.svg";
import BusOutlineIcon from "../../assets/icons/bus-outline.svg";
import CarOutlineIcon from "../../assets/icons/car-outline.svg";
import CartOutlineIcon from "../../assets/icons/cart-outline.svg";
import CheckmarkCircleIcon from "../../assets/icons/checkmark-circle.svg";
import CheckmarkIcon from "../../assets/icons/checkmark.svg";
import ChevronForwardIcon from "../../assets/icons/chevron-forward.svg";
import GameControllerOutlineIcon from "../../assets/icons/game-controller-outline.svg";
import GiftOutlineIcon from "../../assets/icons/gift-outline.svg";
import HomeOutlineIcon from "../../assets/icons/home-outline.svg";
import LaptopOutlineIcon from "../../assets/icons/laptop-outline.svg";
import ListOutlineIcon from "../../assets/icons/list-outline.svg";
import MedicalOutlineIcon from "../../assets/icons/medical-outline.svg";
import MenuIcon from "../../assets/icons/menu.svg";
import ReceiptOutlineIcon from "../../assets/icons/receipt-outline.svg";
import RemoveCircleOutlineIcon from "../../assets/icons/remove-circle-outline.svg";
import RestaurantOutlineIcon from "../../assets/icons/restaurant-outline.svg";
import TrendingUpOutlineIcon from "../../assets/icons/trending-up-outline.svg";
import WalletOutlineIcon from "../../assets/icons/wallet-outline.svg";

export default function Categories() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { categories, isLoading } = useApp();

  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);

  // Mapa de componentes SVG
  const ICON_COMPONENTS: Record<string, any> = {
    "list-outline": ListOutlineIcon,
    menu: MenuIcon,
    "chevron-forward": ChevronForwardIcon,
    "add-circle-outline": AddCircleOutlineIcon,
    "remove-circle-outline": RemoveCircleOutlineIcon,
    "arrow-back": ArrowBackIcon,
    "checkmark-circle": CheckmarkCircleIcon,
    "game-controller-outline": GameControllerOutlineIcon,
    "receipt-outline": ReceiptOutlineIcon,
    "briefcase-outline": BriefcaseOutlineIcon,
    "laptop-outline": LaptopOutlineIcon,
    "trending-up-outline": TrendingUpOutlineIcon,
    "gift-outline": GiftOutlineIcon,
    checkmark: CheckmarkIcon,
    "wallet-outline": WalletOutlineIcon,
    "cart-outline": CartOutlineIcon,
    "car-outline": CarOutlineIcon,
    "home-outline": HomeOutlineIcon,
    "restaurant-outline": RestaurantOutlineIcon,
    "medical-outline": MedicalOutlineIcon,
    "bus-outline": BusOutlineIcon,
    "airplane-outline": AirplaneOutlineIcon,
  };

  useEffect(() => {
    // Separar categorías por tipo
    const expenses = categories.filter((cat) => cat.type === "GASTO");
    const incomes = categories.filter((cat) => cat.type === "INGRESO");

    setExpenseCategories(expenses);
    setIncomeCategories(incomes);
  }, [categories]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCreateCategory = (type: "GASTO" | "INGRESO") => {
    router.push({
      pathname: "/(drawer)/create-category",
      params: { type, returnPath: "/(drawer)/categories" },
    });
  };

  const handleEditCategory = (category: any) => {
    router.push({
      pathname: "/(drawer)/create-category",
      params: {
        categoryId: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        isMonthlyExpense: String(!!category.isMonthlyExpense),
        monthlyAmount:
          category.monthlyAmount !== undefined &&
          category.monthlyAmount !== null
            ? String(category.monthlyAmount)
            : "",
        returnPath: "/(drawer)/categories",
      },
    });
  };

  const renderCategoryItem = (category: any, isLast: boolean = false) => {
    const IconComponent = ICON_COMPONENTS[category.icon] || ListOutlineIcon;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[categoriesStyles.categoryItem]}
        onPress={() => handleEditCategory(category)}
      >
        <View
          style={[
            categoriesStyles.categoryIcon,
            { backgroundColor: category.color },
          ]}
        >
          <IconComponent
            width={24}
            height={24}
            color={colors.neutral.white}
          />
        </View>

        <View style={categoriesStyles.categoryInfo}>
          <Text style={categoriesStyles.categoryName}>{category.name}</Text>
          {category.isMonthlyExpense && category.monthlyAmount && (
            <Text style={formStyles.helperText}>
              {category.monthlyAmount.toLocaleString("es-CO")} COP/mes
            </Text>
          )}
        </View>

        <View style={layoutStyles.row}>
          {category.isMonthlyExpense && (
            <View style={badgeStyles.primary}>
              <Text style={badgeTextStyles.primary}>Mensual</Text>
            </View>
          )}
          <ChevronForwardIcon
            width={16}
            height={16}
            color={colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategorySection = (
    title: string,
    categories: any[],
    type: "GASTO" | "INGRESO",
  ) => (
    <View style={categoriesStyles.section}>
      <View style={layoutStyles.sectionHeader}>
        <Text style={categoriesStyles.sectionTitle}>{title}</Text>
        <Text style={formStyles.helperText}>
          {categories.length} categorías
        </Text>
      </View>

      {categories.length > 0 ? (
        <View>
          {categories.map((category, index) =>
            renderCategoryItem(category, index === categories.length - 1),
          )}

          {/* Botón crear categoría */}
          <TouchableOpacity
            style={[buttonStyles.outline, { marginTop: spacing[2] }]}
            onPress={() => handleCreateCategory(type)}
          >
            <AddCircleOutlineIcon
              width={20}
              height={20}
              color={colors.primary[500]}
              style={{ marginRight: spacing[2] }}
            />
            <Text style={buttonTextStyles.outline}>Crear nueva categoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={categoriesStyles.emptyState}>
          {type === "GASTO" ? (
            <RemoveCircleOutlineIcon
              width={60}
              height={60}
              color={colors.text.tertiary}
            />
          ) : (
            <AddCircleOutlineIcon
              width={60}
              height={60}
              color={colors.text.tertiary}
            />
          )}
          <Text style={categoriesStyles.emptyStateText}>
            No tienes categorías de {type.toLowerCase()} creadas
          </Text>
          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={() => handleCreateCategory(type)}
          >
            <Text style={buttonTextStyles.primary}>
              Crear primera categoría
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={categoriesStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={categoriesStyles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={categoriesStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View style={[categoriesStyles.statusBarArea, { height: insets.top }]} />

      {/* Header */}
      <View style={categoriesStyles.header}>
        <TouchableOpacity
          onPress={openDrawer}
          style={categoriesStyles.menuButton}
        >
          <MenuIcon
            width={35}
            height={35}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={categoriesStyles.headerCenter}>
          <Text style={categoriesStyles.headerTitle}>Categorías</Text>
        </View>
        <View style={categoriesStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={categoriesStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={categoriesStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Resumen de categorías */}
          <View style={[cardStyles.summary, { marginBottom: spacing[6] }]}>
            <Text style={textStyles.sectionTitle}>Gestión de Categorías</Text>
            <Text style={textStyles.description}>
              Organiza tus gastos e ingresos en categorías personalizadas
            </Text>
            <View style={layoutStyles.centerRow}>
              <View style={layoutStyles.centerColumn}>
                <Text style={textStyles.statNumber}>
                  {expenseCategories.length}
                </Text>
                <Text style={formStyles.helperText}>Gastos</Text>
              </View>
              <View style={layoutStyles.divider} />
              <View style={layoutStyles.centerColumn}>
                <Text style={textStyles.statNumber}>
                  {incomeCategories.length}
                </Text>
                <Text style={formStyles.helperText}>Ingresos</Text>
              </View>
            </View>
          </View>

          {/* Sección GASTOS */}
          {renderCategorySection("GASTOS", expenseCategories, "GASTO")}

          {/* Sección INGRESOS */}
          {renderCategorySection("INGRESOS", incomeCategories, "INGRESO")}

          {/* Espacio inferior */}
          <View style={layoutStyles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
