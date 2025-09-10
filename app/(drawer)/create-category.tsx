import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useApp } from "../../src/shared/context/AppProvider";
import { createCategoryStyles } from "../../src/shared/styles/components/create-category";
import { colors } from "../../src/shared/styles/tokens";

// Mapa de íconos locales (SVG) siguiendo el patrón de add-transaction.tsx
const ICONS_MAP: Record<string, any> = {
  "arrow-back": require("../../assets/icons/arrow-back.svg"),
  checkmark: require("../../assets/icons/checkmark.svg"),
  "wallet-outline": require("../../assets/icons/wallet-outline.svg"),
  "cart-outline": require("../../assets/icons/cart-outline.svg"),
  "car-outline": require("../../assets/icons/car-outline.svg"),
  "home-outline": require("../../assets/icons/home-outline.svg"),
  "restaurant-outline": require("../../assets/icons/restaurant-outline.svg"),
  "medical-outline": require("../../assets/icons/medical-outline.svg"),
  "bus-outline": require("../../assets/icons/bus-outline.svg"),
  "airplane-outline": require("../../assets/icons/airplane-outline.svg"),
  "list-outline": require("../../assets/icons/list-outline.svg"),
};

// Colores de categorías.
const COLORS = [
  "#FF6B6B",
  "#4CAF50",
  "#3A7691",
  "#FF9F43",
  "#845EC2",
  "#30353D",
];

export default function CreateCategory() {
  // Traer funciones desde el AppProvider, contexto de la aplicación.
  const { addCategory, updateCategory, deleteCategory, categories } = useApp();
  const params = useLocalSearchParams();

  // Obtener paddings para una pantalla de celular.
  const insets = useSafeAreaInsets();

  // Inicialización de estados para el formulario
  const [name, setName] = useState("");
  const [type, setType] = useState(
    (params.type as "GASTO" | "INGRESO") || "GASTO",
  );
  const [selectedIcon, setSelectedIcon] = useState<"wallet-outline" | string>(
    "wallet-outline",
  );
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const editingId = params.categoryId as string | undefined;

  // Alerta multiplataforma.
  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      showAlert("Error", "El nombre de la categoría es obligatorio");
      return false;
    }

    // No permitir duplicados de categorías en el mismo tipo.
    const normalizedName = name.trim().toLowerCase();
    const duplicate = categories.some(
      (c) =>
        c.type === type &&
        c.name.trim().toLowerCase() === normalizedName &&
        c.id !== editingId,
    );
    if (duplicate) {
      showAlert(
        "Nombre duplicado",
        `Ya existe una categoría ${type === "GASTO" ? "de gasto" : "de ingreso"} con ese nombre.`,
      );
      return false;
    }

    return true;
  };

  useEffect(() => {
    setType((params.type as "GASTO" | "INGRESO") || "GASTO");
  }, [params.type]);

  // Actualiza estados de los parámetros en caso de cambiar de ingreso a gasto, y otros contextos
  useEffect(() => {
    const editingId = params.categoryId as string | undefined;
    if (editingId) {
      if (typeof params.name === "string") setName(params.name);
      if (typeof params.icon === "string") setSelectedIcon(params.icon);
      if (typeof params.color === "string") setSelectedColor(params.color);
      if (typeof params.type === "string")
        setType(params.type as "GASTO" | "INGRESO");
    }
  }, [params.categoryId, params.name, params.icon, params.color, params.type]);

  const resetForm = useCallback(() => {
    setName("");
    setType((params.type as "GASTO" | "INGRESO") || "GASTO");
    setSelectedIcon("wallet-outline");
    setSelectedColor(COLORS[0]);
  }, [params.type]);

  const goBack = useCallback(() => {
    const returnPath = params.returnPath as string | undefined;
    if (returnPath) {
      router.push({ pathname: returnPath });
    } else {
      router.back();
    }
  }, [params.returnPath]);

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const newCategory = {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type,
      };

      if (editingId) {
        await updateCategory(editingId, newCategory);
      } else {
        await addCategory(newCategory);
      }

      // Resetear para evitar el stale state al volver al componente
      resetForm();

      // Parámetro para navegar a la sección correcta al crear categoría.
      const returnPath = params.returnPath as string | undefined;
      if (returnPath) {
        if (returnPath === "/(drawer)/choose-category") {
          router.replace({
            pathname: returnPath,
            params: {
              type: params.type,
              amount: params.amount,
              date: params.date,
              note: params.note,
              accountId: params.accountId,
            },
          });
        } else {
          router.replace({ pathname: returnPath });
        }
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Error creando o actualizando categoría:", error);
      showAlert("Error", "No se pudo guardar la categoría");
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;

    try {
      setIsDeleting(true);
      await deleteCategory(editingId);
      setShowDeleteConfirm(false);
      showAlert("Éxito", "Categoría eliminada correctamente");
      goBack();
    } catch (error) {
      console.error("Error deleting category:", error);
      showAlert("Error", "No se pudo eliminar la categoría");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmInput("");
    }
  };

  return (
    <View style={createCategoryStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />
      <View
        style={[createCategoryStyles.statusBarArea, { height: insets.top }]}
      />

      {/* Header de la aplicación */}
      <View style={createCategoryStyles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={createCategoryStyles.backButton}
        >
          <Image
            source={ICONS_MAP["arrow-back"]}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={createCategoryStyles.headerCenter}>
          <Text style={createCategoryStyles.headerTitle}>
            {params.categoryId ? "Editar Categoría" : "Crear Categoría"}
          </Text>
        </View>
        <View style={createCategoryStyles.placeholder} />
      </View>

      <SafeAreaView
        style={createCategoryStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView style={createCategoryStyles.content}>
          {/* Nombre de categoría */}
          <View style={createCategoryStyles.section}>
            <Text style={createCategoryStyles.sectionTitle}>Nombre</Text>
            <TextInput
              style={createCategoryStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre de la categoría"
            />
          </View>

          {/* Two-state tipo de categoría */}
          <View style={createCategoryStyles.section}>
            <Text style={createCategoryStyles.sectionTitle}>Tipo</Text>
            <View style={createCategoryStyles.toggleContainer}>
              <TouchableOpacity
                style={[
                  createCategoryStyles.toggleButton,
                  type === "GASTO" && createCategoryStyles.activeToggleButton,
                ]}
                onPress={() => setType("GASTO")}
              >
                <Text
                  style={[
                    createCategoryStyles.toggleText,
                    type === "GASTO" && createCategoryStyles.activeToggleText,
                  ]}
                >
                  GASTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  createCategoryStyles.toggleButton,
                  type === "INGRESO" && createCategoryStyles.activeToggleButton,
                ]}
                onPress={() => setType("INGRESO")}
              >
                <Text
                  style={[
                    createCategoryStyles.toggleText,
                    type === "INGRESO" && createCategoryStyles.activeToggleText,
                  ]}
                >
                  INGRESO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seleccionar ícono de categoría */}
          <View style={createCategoryStyles.section}>
            <Text style={createCategoryStyles.sectionTitle}>Ícono</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={createCategoryStyles.iconList}
            >
              {(
                [
                  "wallet-outline",
                  "cart-outline",
                  "car-outline",
                  "home-outline",
                  "restaurant-outline",
                  "medical-outline",
                  "bus-outline",
                  "airplane-outline",
                ] as string[]
              ).map((icon: string) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    createCategoryStyles.iconButton,
                    selectedIcon === icon &&
                      createCategoryStyles.selectedIconButton,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Image
                    source={ICONS_MAP[icon] || ICONS_MAP["list-outline"]}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor:
                        selectedIcon === icon
                          ? colors.neutral.white
                          : colors.background.dark,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Color de categoría */}
          <View style={createCategoryStyles.section}>
            <Text style={createCategoryStyles.sectionTitle}>Color</Text>
            <View style={createCategoryStyles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    createCategoryStyles.colorButton,
                    { backgroundColor: color },
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Image
                      source={ICONS_MAP["checkmark"]}
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: colors.neutral.white,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Contenedor de botones */}
        <View style={createCategoryStyles.buttonsContainer}>
          {/* Botón crear categoría */}
          <TouchableOpacity
            style={[
              createCategoryStyles.createButton,
              !name && createCategoryStyles.disabledButton,
            ]}
            onPress={handleCreate}
            disabled={!name}
          >
            <Text style={createCategoryStyles.createButtonText}>
              {params.categoryId ? "Guardar" : "Crear"}
            </Text>
          </TouchableOpacity>

          {/* Botón eliminar categoría en caso de que se esté editando*/}
          {editingId && (
            <TouchableOpacity
              style={createCategoryStyles.deleteButton}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Text style={createCategoryStyles.deleteButtonText}>
                Eliminar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Modal de confirmación de eliminación de categoría */}
      {showDeleteConfirm && (
        <View style={createCategoryStyles.modalOverlay}>
          <View style={createCategoryStyles.confirmModal}>
            <Text style={createCategoryStyles.modalTitle}>
              Eliminar categoría
            </Text>
            <Text style={createCategoryStyles.confirmText}>
              Esta acción eliminará la categoría y todo su historial de
              transacciones asociadas. Esta acción no se puede deshacer.
            </Text>
            <Text style={createCategoryStyles.confirmInstruction}>
              Para confirmar, escribe exactamente: DE ACUERDO
            </Text>
            <TextInput
              style={createCategoryStyles.confirmInput}
              placeholder="DE ACUERDO"
              placeholderTextColor={colors.text.tertiary}
              value={deleteConfirmInput}
              onChangeText={setDeleteConfirmInput}
              autoCapitalize="characters"
            />
            <View style={createCategoryStyles.confirmActions}>
              <TouchableOpacity
                style={[
                  createCategoryStyles.confirmButton,
                  createCategoryStyles.cancelButton,
                ]}
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmInput("");
                }}
                disabled={isDeleting}
              >
                <Text style={createCategoryStyles.cancelButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  createCategoryStyles.confirmButton,
                  createCategoryStyles.deleteConfirmButton,
                  (deleteConfirmInput.trim().toUpperCase() !== "DE ACUERDO" ||
                    isDeleting) &&
                    createCategoryStyles.disabledDeleteButton,
                ]}
                onPress={handleDelete}
                disabled={
                  deleteConfirmInput.trim().toUpperCase() !== "DE ACUERDO" ||
                  isDeleting
                }
              >
                <Text style={createCategoryStyles.deleteConfirmButtonText}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
