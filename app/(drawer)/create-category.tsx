import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/shared/context/AppProvider';

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
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header de la aplicación */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={ICONS_MAP['arrow-back']}
            style={{ width: 28, height: 28, tintColor: '#FFFFFF' }}
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
                  style={{ width: 24, height: 24, tintColor: selectedIcon === icon ? '#FFFFFF' : '#30353D' }}
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
                      style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
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
              placeholderTextColor="#ADADAD"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#30353D',
  },
  statusBarArea: {
    backgroundColor: '#30353D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#30353D',
    borderBottomWidth: 1,
    borderBottomColor: '#101215',
  },
  backButton: {
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
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
  iconList: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedIconButton: {
    backgroundColor: '#3A7691',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthlyExpenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switch: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: '#E9ECEF',
    padding: 3,
  },
  switchActive: {
    backgroundColor: '#3A7691',
  },
  switchKnob: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFFFFF',
  },
  switchKnobActive: {
    transform: [{ translateX: 20 }],
  },
  createButton: {
    backgroundColor: '#3A7691',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#ADADAD',
  },
  deleteButton: {
    backgroundColor: '#FCE7E9',
    borderWidth: 1,
    borderColor: '#F28B94',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#D7263D',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#30353D',
  },
  confirmText: {
    fontSize: 14,
    color: '#30353D',
    marginTop: 8,
    marginBottom: 12,
  },
  confirmInstruction: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  confirmInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 14,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#ECECEC',
  },
  cancelButtonText: {
    color: '#30353D',
    fontWeight: '600',
  },
  deleteConfirmButton: {
    backgroundColor: '#D7263D',
  },
  disabledDeleteButton: {
    backgroundColor: '#F5A5B0',
  },
  deleteConfirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});