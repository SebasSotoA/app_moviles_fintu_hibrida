import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';
import { useStyles } from '../../src/shared/hooks';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

// Mapa de íconos locales (SVG) siguiendo el patrón de add-transaction.tsx
const ICONS_MAP: Record<string, any> = {
  'arrow-back': require('../../assets/icons/arrow-back.svg'),
  'checkmark': require('../../assets/icons/checkmark.svg'),
  'wallet-outline': require('../../assets/icons/wallet-outline.svg'),
  'cart-outline': require('../../assets/icons/cart-outline.svg'),
  'car-outline': require('../../assets/icons/car-outline.svg'),
  'home-outline': require('../../assets/icons/home-outline.svg'),
  'restaurant-outline': require('../../assets/icons/restaurant-outline.svg'),
  'medical-outline': require('../../assets/icons/medical-outline.svg'),
  'bus-outline': require('../../assets/icons/bus-outline.svg'),
  'airplane-outline': require('../../assets/icons/airplane-outline.svg'),
  'list-outline': require('../../assets/icons/list-outline.svg'),
};

const COLORS = ['#FF6B6B', '#4CAF50', '#3A7691', '#FF9F43', '#845EC2', '#30353D'];

export default function CreateCategory() {
  // Traer funciones desde el AppProvider, contexto de la aplicación.
  const { addCategory, updateCategory, deleteCategory, categories } = useApp();
  
  const styles = useStyles(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    statusBarArea: {
      backgroundColor: colors.background.dark,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background.dark,
    },
    backButton: {
      padding: 8,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
    },
    placeholder: {
      width: 44,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      padding: spacing[4],
    },
    section: {
      marginBottom: spacing[6],
    },
    sectionTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.secondary,
      marginBottom: spacing[2],
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 12,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      fontSize: typography.fontSize.base,
      backgroundColor: colors.neutral.white,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background.light,
      borderRadius: 12,
      padding: 4,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: spacing[3],
      alignItems: 'center',
      borderRadius: 8,
    },
    activeToggleButton: {
      backgroundColor: colors.primary[500],
    },
    toggleText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.tertiary,
    },
    activeToggleText: {
      color: colors.neutral.white,
    },
    iconList: {
      flexDirection: 'row',
    },
    iconButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background.light,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[2],
    },
    selectedIconButton: {
      backgroundColor: colors.primary[500],
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    colorButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    createButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
      borderRadius: 25,
      alignItems: 'center',
      marginHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    disabledButton: {
      backgroundColor: colors.text.tertiary,
    },
    createButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
    deleteButton: {
      backgroundColor: colors.semantic.error,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
      borderRadius: 25,
      alignItems: 'center',
      marginHorizontal: spacing[4],
      marginBottom: spacing[4],
    },
    deleteButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
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
    confirmModal: {
      backgroundColor: colors.neutral.white,
      borderRadius: 20,
      padding: spacing[6],
      margin: spacing[4],
      maxWidth: 400,
      width: '90%',
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing[4],
    },
    confirmText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      marginBottom: spacing[4],
    },
    confirmInstruction: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
      marginBottom: spacing[4],
    },
    confirmInput: {
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 12,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      fontSize: typography.fontSize.base,
      backgroundColor: colors.neutral.white,
      marginBottom: spacing[4],
    },
    confirmActions: {
      flexDirection: 'row',
      gap: spacing[3],
    },
    confirmButton: {
      flex: 1,
      paddingVertical: spacing[3],
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.background.light,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    cancelButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
    },
    deleteConfirmButton: {
      backgroundColor: colors.semantic.error,
    },
    disabledDeleteButton: {
      backgroundColor: colors.text.tertiary,
    },
    deleteConfirmButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.neutral.white,
    },
  }));
  
  const params = useLocalSearchParams();
  
  // Obtener paddings para una pantalla de celular.
  const insets = useSafeAreaInsets();
  
  // Inicialización de estados para el formulario
  const [name, setName] = useState('');
  const [type, setType] = useState(params.type as 'GASTO' | 'INGRESO' || 'GASTO');
  const [selectedIcon, setSelectedIcon] = useState<'wallet-outline' | string>('wallet-outline');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const editingId = params.categoryId as string | undefined;

  // Alerta multiplataforma.
  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      showAlert('Error', 'El nombre de la categoría es obligatorio');
      return false;
    }
    
    // No permitir duplicados de categorías en el mismo tipo.
    const normalizedName = name.trim().toLowerCase();
    const duplicate = categories.some((c) =>
      c.type === type && c.name.trim().toLowerCase() === normalizedName && c.id !== editingId
    );
    if (duplicate) {
      showAlert('Nombre duplicado', `Ya existe una categoría ${type === 'GASTO' ? 'de gasto' : 'de ingreso'} con ese nombre.`);
      return false;
    }

    return true;
  };

  useEffect(() => {
    setType((params.type as 'GASTO' | 'INGRESO') || 'GASTO');
  }, [params.type]);

  // Actualiza estados de los parámetros en caso de cambiar de ingreso a gasto, y otros contextos
  useEffect(() => {
    const editingId = params.categoryId as string | undefined;
    if (editingId) {
      if (typeof params.name === 'string') setName(params.name);
      if (typeof params.icon === 'string') setSelectedIcon(params.icon);
      if (typeof params.color === 'string') setSelectedColor(params.color);
      if (typeof params.type === 'string') setType(params.type as 'GASTO' | 'INGRESO');
    }
  }, [
    params.categoryId,
    params.name,
    params.icon,
    params.color,
    params.type,
  ]);

  const resetForm = useCallback(() => {
    setName('');
    setType((params.type as 'GASTO' | 'INGRESO') || 'GASTO');
    setSelectedIcon('wallet-outline');
    setSelectedColor(COLORS[0]);
  }, [params.type]);

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const newCategory = {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type
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
        if (returnPath === '/(drawer)/choose-category') {
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
      console.error('Error creando o actualizando categoría:', error);
      showAlert('Error', 'No se pudo guardar la categoría');
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;
    
    try {
      setIsDeleting(true);
      await deleteCategory(editingId);
      setShowDeleteConfirm(false);
      showAlert('Éxito', 'Categoría creada correctamente')
      router.back();
    
    } catch (error) {
      console.error('Error deleting category:', error);
      showAlert('Éxito', 'Categoría creada correctamente')
    
    } finally {
      setIsDeleting(false);
      setDeleteConfirmInput('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header de la aplicación */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={ICONS_MAP['arrow-back']}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{params.categoryId ? 'Editar Categoría' : 'Crear Categoría'}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content}>
          {/* Nombre de categoría */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre de la categoría"
            />
          </View>

          {/* Two-state tipo de categoría */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'GASTO' && styles.activeToggleButton]}
                onPress={() => setType('GASTO')}
              >
                <Text style={[styles.toggleText, type === 'GASTO' && styles.activeToggleText]}>
                  GASTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'INGRESO' && styles.activeToggleButton]}
                onPress={() => setType('INGRESO')}
              >
                <Text style={[styles.toggleText, type === 'INGRESO' && styles.activeToggleText]}>
                  INGRESO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seleccionar ícono de categoría */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ícono</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconList}>
            {(
              [
                'wallet-outline',
                'cart-outline',
                'car-outline',
                'home-outline',
                'restaurant-outline',
                'medical-outline',
                'bus-outline',
                'airplane-outline',
              ] as string[]
            ).map((icon: string) => (
              <TouchableOpacity
                key={icon}
                style={[styles.iconButton, selectedIcon === icon && styles.selectedIconButton]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Image
                  source={ICONS_MAP[icon] || ICONS_MAP['list-outline']}
                  style={{ width: 24, height: 24, tintColor: selectedIcon === icon ? colors.neutral.white : colors.background.dark }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          </View>

          {/* Color de categoría */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorButton, { backgroundColor: color }]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Image
                      source={ICONS_MAP['checkmark']}
                      style={{ width: 24, height: 24, tintColor: colors.neutral.white }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Botón crear categoría */}
        <TouchableOpacity 
          style={[styles.createButton, !name && styles.disabledButton]}
          onPress={handleCreate}
          disabled={!name}
        >
          <Text style={styles.createButtonText}>{params.categoryId ? 'Guardar Cambios' : 'Crear Categoría'}</Text>
        </TouchableOpacity>

        {/* Botón eliminar categoría en caso de que se esté editando*/}
        {editingId && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteConfirm(true)}
          >
            <Text style={styles.deleteButtonText}>Eliminar categoría</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* Modal de confirmación de eliminación de categoría */}
      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.modalTitle}>Eliminar categoría</Text>
            <Text style={styles.confirmText}>
              Esta acción eliminará la categoría y todo su historial de transacciones asociadas. Esta acción no se puede deshacer.
            </Text>
            <Text style={styles.confirmInstruction}>
              Para confirmar, escribe exactamente: DE ACUERDO
            </Text>
            <TextInput
              style={styles.confirmInput}
              placeholder="DE ACUERDO"
              placeholderTextColor={colors.text.tertiary}
              value={deleteConfirmInput}
              onChangeText={setDeleteConfirmInput}
              autoCapitalize="characters"
            />
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => { setShowDeleteConfirm(false); setDeleteConfirmInput(''); }}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.deleteConfirmButton,
                  (deleteConfirmInput.trim().toUpperCase() !== 'DE ACUERDO' || isDeleting) && styles.disabledDeleteButton
                ]}
                onPress={handleDelete}
                disabled={deleteConfirmInput.trim().toUpperCase() !== 'DE ACUERDO' || isDeleting}
              >
                <Text style={styles.deleteConfirmButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

