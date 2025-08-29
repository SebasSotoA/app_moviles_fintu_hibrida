import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Reminder {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default function ModernReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', title: '¡Recordatorio!', completed: true, createdAt: new Date() },
    { id: '2', title: '¡Comprar ropa!', completed: false, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [newReminderText, setNewReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Eliminar recordatorio',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setReminders(prev => prev.filter(reminder => reminder.id !== id));
          }
        }
      ]
    );
  };

  const addReminder = () => {
    if (newReminderText.trim()) {
      if (isEditMode && editingReminder) {
        // Editar recordatorio existente
        setReminders(prev => 
          prev.map(reminder => 
            reminder.id === editingReminder.id 
              ? { ...reminder, title: newReminderText.trim(), createdAt: selectedDate }
              : reminder
          )
        );
      } else {
        // Crear nuevo recordatorio
        const newReminder: Reminder = {
          id: Date.now().toString(),
          title: newReminderText.trim(),
          completed: false,
          createdAt: selectedDate,
        };
        setReminders(prev => [newReminder, ...prev]);
      }
      resetModal();
    }
  };

  const editReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setNewReminderText(reminder.title);
    setSelectedDate(reminder.createdAt);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const resetModal = () => {
    setNewReminderText('');
    setSelectedDate(new Date());
    setIsEditMode(false);
    setEditingReminder(null);
    setIsModalVisible(false);
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) return 'Hoy';
    if (isYesterday) return 'Ayer';
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderItem}>
      <TouchableOpacity
        style={styles.reminderContent}
        onPress={() => toggleReminder(item.id)}
        accessibilityLabel={`${item.completed ? 'Marcar como pendiente' : 'Marcar como completado'}: ${item.title}`}
        accessibilityRole="button"
      >
        <View style={styles.checkboxContainer}>
          <View style={[
            styles.checkbox,
            item.completed && styles.checkboxCompleted
          ]}>
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </View>
        <View style={styles.reminderTextContainer}>
          <Text style={[
            styles.reminderText,
            item.completed && styles.reminderTextCompleted
          ]}>
            {item.title}
          </Text>
          {item.createdAt && (
            <Text style={styles.reminderDate}>
              {formatDate(item.createdAt)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editReminder(item)}
          accessibilityLabel={`Editar recordatorio: ${item.title}`}
          accessibilityRole="button"
        >
          <Ionicons name="pencil-outline" size={18} color="#3A7691" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteReminder(item.id)}
          accessibilityLabel={`Eliminar recordatorio: ${item.title}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recordatorios</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsModalVisible(true)}
          accessibilityLabel="Crear nuevo recordatorio"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reminders.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reminders.filter(r => !r.completed).length}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reminders.filter(r => r.completed).length}</Text>
          <Text style={styles.statLabel}>Completados</Text>
        </View>
      </View>

      {/* Reminders List */}
      <View style={styles.listContainer}>
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={80} color="#E0E0E0" />
            <Text style={styles.emptyStateTitle}>No hay recordatorios</Text>
            <Text style={styles.emptyStateText}>Crea tu primer recordatorio tocando el botón "Crear"</Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            renderItem={renderReminder}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Create Reminder Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditMode ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
              </Text>
              <TouchableOpacity
                onPress={resetModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu recordatorio..."
              value={newReminderText}
              onChangeText={setNewReminderText}
              multiline
              maxLength={200}
              autoFocus
            />
            
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#3A7691" />
              <Text style={styles.dateSelectorText}>
                {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  style={styles.datePicker}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.datePickerActions}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.datePickerButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={[styles.datePickerButtonText, styles.datePickerConfirmText]}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !newReminderText.trim() && styles.saveButtonDisabled
                ]}
                onPress={addReminder}
                disabled={!newReminderText.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Actualizar' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#30353D',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#30353D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A7691',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderText: {
    fontSize: 16,
    color: '#30353D',
    fontWeight: '500',
    marginBottom: 2,
  },
  reminderTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  reminderDate: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#30353D',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#30353D',
  },
  closeButton: {
    padding: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#30353D',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3A7691',
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  dateSelectorText: {
    fontSize: 16,
    color: '#30353D',
    fontWeight: '500',
  },
  datePickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E1E5E9',
  },
  datePicker: {
    backgroundColor: 'transparent',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  datePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F1F3F4',
  },
  datePickerConfirmButton: {
    backgroundColor: '#3A7691',
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
  },
  datePickerConfirmText: {
    color: '#FFFFFF',
  },
});
