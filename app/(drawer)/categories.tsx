import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
  iconStyles,
  layoutStyles,
  textStyles,
} from "../../src/shared/styles/components";
import { colors, spacing } from "../../src/shared/styles/tokens";

export default function Categories() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { categories, isLoading } = useApp();

  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);

  // Mapa de íconos locales
  const ICONS: Record<string, any> = {
    "list-outline": require("../../assets/icons/list-outline.svg"),
    menu: require("../../assets/icons/menu.svg"),
    "chevron-forward": require("../../assets/icons/chevron-forward.svg"),
    "add-circle-outline": require("../../assets/icons/add-circle-outline.svg"),
    "remove-circle-outline": require("../../assets/icons/remove-circle-outline.svg"),
    "arrow-back": require("../../assets/icons/arrow-back.svg"),
    "checkmark-circle": require("../../assets/icons/checkmark-circle.svg"),
    "game-controller-outline": require("../../assets/icons/game-controller-outline.svg"),
    "receipt-outline": require("../../assets/icons/receipt-outline.svg"),
    "briefcase-outline": require("../../assets/icons/briefcase-outline.svg"),
    "laptop-outline": require("../../assets/icons/laptop-outline.svg"),
    "trending-up-outline": require("../../assets/icons/trending-up-outline.svg"),
    "gift-outline": require("../../assets/icons/gift-outline.svg"),
    checkmark: require("../../assets/icons/checkmark.svg"),
    "wallet-outline": require("../../assets/icons/wallet-outline.svg"),
    "cart-outline": require("../../assets/icons/cart-outline.svg"),
    "car-outline": require("../../assets/icons/car-outline.svg"),
    "home-outline": require("../../assets/icons/home-outline.svg"),
    "restaurant-outline": require("../../assets/icons/restaurant-outline.svg"),
    "medical-outline": require("../../assets/icons/medical-outline.svg"),
    "bus-outline": require("../../assets/icons/bus-outline.svg"),
    "airplane-outline": require("../../assets/icons/airplane-outline.svg"),
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

  const renderCategoryItem = (category: any, isLast: boolean = false) => (
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
        <Image
          source={ICONS[category.icon] || ICONS["list-outline"]}
          style={[iconStyles.white, { tintColor: colors.neutral.white }]}
          resizeMode="contain"
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
        <Image
          source={ICONS["chevron-forward"]}
          style={[iconStyles.tertiary, { tintColor: colors.text.tertiary }]}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

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
            <Image
              source={ICONS["add-circle-outline"]}
              style={[iconStyles.primary, { marginRight: spacing[2] }]}
              resizeMode="contain"
            />
            <Text style={buttonTextStyles.outline}>Crear nueva categoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={categoriesStyles.emptyState}>
          <Image
            source={
              type === "GASTO"
                ? ICONS["remove-circle-outline"]
                : ICONS["add-circle-outline"]
            }
            style={[iconStyles.large, { tintColor: colors.text.tertiary }]}
            resizeMode="contain"
          />
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
          <Image
            source={ICONS["menu"]}
            style={[
              iconStyles.medium,
              { width: 35, height: 35, tintColor: colors.neutral.white },
            ]}
            resizeMode="contain"
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
