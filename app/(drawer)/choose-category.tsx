import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { buttonStyles, buttonTextStyles } from "../../src/shared/styles/components";
import { chooseCategoryStyles } from "../../src/shared/styles/components/choose-category";
import { colors, spacing } from "../../src/shared/styles/tokens";
import { TransactionType } from "../../types/transaction";

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
import GameControllerOutlineIcon from "../../assets/icons/game-controller-outline.svg";
import GiftOutlineIcon from "../../assets/icons/gift-outline.svg";
import HomeOutlineIcon from "../../assets/icons/home-outline.svg";
import LaptopOutlineIcon from "../../assets/icons/laptop-outline.svg";
import ListOutlineIcon from "../../assets/icons/list-outline.svg";
import MedicalOutlineIcon from "../../assets/icons/medical-outline.svg";
import ReceiptOutlineIcon from "../../assets/icons/receipt-outline.svg";
import RestaurantOutlineIcon from "../../assets/icons/restaurant-outline.svg";
import SchoolOutlineIcon from "../../assets/icons/school-outline.svg";
import SchoolIcon from "../../assets/icons/school.svg";
import TrendingUpOutlineIcon from "../../assets/icons/trending-up-outline.svg";
import WalletOutlineIcon from "../../assets/icons/wallet-outline.svg";

export default function ChooseCategory() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { categories, addTransaction, currentAccount } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mapa de componentes SVG
  const ICON_COMPONENTS: Record<string, any> = {
    "arrow-back": ArrowBackIcon,
    "checkmark-circle": CheckmarkCircleIcon,
    "add-circle-outline": AddCircleOutlineIcon,
    checkmark: CheckmarkIcon,
    "wallet-outline": WalletOutlineIcon,
    "cart-outline": CartOutlineIcon,
    "car-outline": CarOutlineIcon,
    "home-outline": HomeOutlineIcon,
    "restaurant-outline": RestaurantOutlineIcon,
    "medical-outline": MedicalOutlineIcon,
    "bus-outline": BusOutlineIcon,
    "airplane-outline": AirplaneOutlineIcon,
    "list-outline": ListOutlineIcon,
    school: SchoolIcon,
    "school-outline": SchoolOutlineIcon,
    "game-controller-outline": GameControllerOutlineIcon,
    "receipt-outline": ReceiptOutlineIcon,
    "briefcase-outline": BriefcaseOutlineIcon,
    "laptop-outline": LaptopOutlineIcon,
    "trending-up-outline": TrendingUpOutlineIcon,
    "gift-outline": GiftOutlineIcon,
  };

  // Obtener parámetros de la pantalla anterior
  const transactionType = params.type as TransactionType;
  const amount = params.amount as string;
  const date = params.date as string;
  const note = params.note as string;
  const accountId = params.accountId as string;

  // Filtrar categorías según el tipo (usando datos reales de la base de datos)
  const filteredCategories = categories.filter(
    (category) => category.type === transactionType,
  );

  const goBack = () => {
    // Regresar a add-transaction con los datos preservados
    router.push({
      pathname: "/(drawer)/add-transaction",
      params: {
        type: transactionType,
        amount: amount,
        date: date,
        note: note,
        accountId: accountId,
      },
    });
  };

  // Add this function to handle navigation to create category
  const handleCreateCategory = () => {
    router.push({
      pathname: "/(drawer)/create-category",
      params: {
        type: transactionType,
        amount,
        date,
        note,
        accountId,
        returnPath: "/(drawer)/choose-category",
      },
    });
  };

  // Modify handleConfirm to ensure proper navigation
  const handleConfirm = async () => {
    if (!selectedCategory) {
      Alert.alert("Error", "Por favor selecciona una categoría");
      return;
    }

    if (!currentAccount) {
      Alert.alert("Error", "No hay cuenta seleccionada");
      return;
    }

    setIsLoading(true);
    try {
      await addTransaction({
        accountId: accountId,
        categoryId: selectedCategory,
        type: transactionType,
        amount: parseFloat(amount),
        date: date,
        note: note || undefined,
      });

      const categoryName = filteredCategories.find(
        (c) => c.id === selectedCategory,
      )?.name;

      // Replace the Alert with immediate navigation and then show the alert
      router.replace("/(drawer)/");
      setTimeout(() => {
        Alert.alert(
          "¡Transacción guardada!",
          `${transactionType}: ${parseFloat(amount).toLocaleString("es-CO")} ${currentAccount.currency}\nCategoría: ${categoryName}${note ? `\nNota: ${note}` : ""}`,
        );
      }, 100);
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar la transacción. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryItem = (category: any) => {
    const IconComponent = ICON_COMPONENTS[category.icon as string] || ListOutlineIcon;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          chooseCategoryStyles.categoryItem,
          selectedCategory === category.id &&
            chooseCategoryStyles.selectedCategoryItem,
        ]}
        onPress={() => setSelectedCategory(category.id)}
      >
        <View
          style={[
            chooseCategoryStyles.categoryIcon,
            { backgroundColor: category.color },
          ]}
        >
          <IconComponent
            width={28}
            height={28}
            color={colors.neutral.white}
          />
        </View>
        <Text style={chooseCategoryStyles.categoryName}>{category.name}</Text>
        {selectedCategory === category.id && (
          <CheckmarkCircleIcon
            width={24}
            height={24}
            color={colors.primary[500]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={chooseCategoryStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View
        style={[chooseCategoryStyles.statusBarArea, { height: insets.top }]}
      />

      {/* Header */}
      <View style={chooseCategoryStyles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={chooseCategoryStyles.backButton}
        >
          <ArrowBackIcon
            width={28}
            height={28}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={chooseCategoryStyles.headerCenter}>
          <Text style={chooseCategoryStyles.headerTitle}>
            {transactionType === "GASTO" ? "Categoría de Gasto" : "Categoría de Ingreso"}
          </Text>
        </View>
        <View style={chooseCategoryStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={chooseCategoryStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        {/* Resumen de la transacción */}
        <View style={chooseCategoryStyles.summaryContainer}>
          <View style={chooseCategoryStyles.summaryRow}>
            <Text style={chooseCategoryStyles.summaryLabel}>Tipo:</Text>
            <Text
              style={[
                chooseCategoryStyles.summaryValue,
                {
                  color:
                    transactionType === "GASTO"
                      ? colors.semantic.error
                      : colors.semantic.success,
                },
              ]}
            >
              {transactionType}
            </Text>
          </View>
          <View style={chooseCategoryStyles.summaryRow}>
            <Text style={chooseCategoryStyles.summaryLabel}>Monto:</Text>
            <Text style={chooseCategoryStyles.summaryValue}>
              {parseFloat(amount).toLocaleString("es-CO")}{" "}
              {currentAccount?.currency || "COP"}
            </Text>
          </View>
        </View>

        <ScrollView
          style={chooseCategoryStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Título de sección */}
          <Text style={chooseCategoryStyles.sectionTitle}>
            Selecciona una categoría:
          </Text>

          {/* Grid de categorías */}
          <View style={chooseCategoryStyles.categoriesGrid}>
            {filteredCategories.map(renderCategoryItem)}
          </View>

          {/* Opción de crear nueva categoría */}
          <TouchableOpacity
            style={[buttonStyles.outline, { marginBottom: spacing[2] }]}
            onPress={handleCreateCategory}
          >
            <AddCircleOutlineIcon
              width={20}
              height={20}
              color={colors.primary[500]}
              style={{ marginRight: spacing[2] }}
            />
            <Text style={buttonTextStyles.outline}>Crear nueva categoría</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Botón Confirmar */}
        <TouchableOpacity
          style={[
            chooseCategoryStyles.confirmButton,
            (!selectedCategory || isLoading) &&
              chooseCategoryStyles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!selectedCategory || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.neutral.white} />
          ) : (
            <>
              <Text
                style={[
                  chooseCategoryStyles.confirmButtonText,
                  (!selectedCategory || isLoading) &&
                    chooseCategoryStyles.disabledButtonText,
                ]}
              >
                Confirmar
              </Text>
              <CheckmarkIcon
                width={20}
                height={20}
                color={colors.neutral.white}
              />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
