import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// Removido DateTimePicker - no compatible con Expo Go
import Calculator from '../../components/Calculator';
import { useApp } from '../../src/shared/context/AppProvider';
import { TransactionType } from '../../types/transaction';

export default function AddTransaction() {
  const { currentAccount, accounts } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactionType, setTransactionType] = useState<TransactionType>('GASTO');
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(currentAccount);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [calcResetKey, setCalcResetKey] = useState(0);
  


  // Actualizar cuenta seleccionada cuando cambie la cuenta actual
  useEffect(() => {
    setSelectedAccount(currentAccount);
  }, [currentAccount]);

  // Limpiar el formulario cuando cambie la cuenta
  useEffect(() => {
    setSelectedDate(new Date());
    setTransactionType('GASTO');
    setAmount('0');
    setNote('');
    setSelectedAccount(currentAccount);
    setShowDatePicker(false);
    setShowAccountSelector(false);
    setCalcResetKey(prev => prev + 1); // Forzar remount del componente Calculator
  }, [currentAccount?.id]);

  const formatDate = (date: Date) => {
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleContinue = () => {
    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a 0');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Error', 'No hay cuenta seleccionada');
      return;
    }

    // Navegar a la pantalla de elegir categoría
    // Pasamos los datos como parámetros
    router.push({
      pathname: '/(drawer)/choose-category',
      params: {
        type: transactionType,
        amount: amount,
        date: selectedDate.toISOString(),
        note: note,
        accountId: selectedAccount.id,
      },
    });
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(drawer)/');
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30353D" />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Añadir Transacción</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentContainer} edges={['left', 'right', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Selector de fecha */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fecha</Text>
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={showDatepicker}
            >
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              <Ionicons name="calendar-outline" size={24} color="#3A7691" />
            </TouchableOpacity>
          </View>

          {/* Selector de cuenta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <TouchableOpacity 
              style={styles.accountSelector}
              onPress={() => setShowAccountSelector(true)}
            >
              <View style={styles.accountSelectorLeft}>
                <Text style={styles.accountSelectorSymbol}>{selectedAccount?.symbol || '💰'}</Text>
                <View style={styles.accountSelectorInfo}>
                  <Text style={styles.accountSelectorName}>
                    {selectedAccount?.name || 'Seleccionar cuenta'}
                  </Text>
                  <Text style={styles.accountSelectorBalance}>
                    Balance: {selectedAccount?.balance?.toLocaleString('es-CO') || '0'} {selectedAccount?.currency || 'COP'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={24} color="#3A7691" />
            </TouchableOpacity>
          </View>

          {/* Toggle tipo de transacción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionType === 'GASTO' && styles.activeToggleButton,
                ]}
                onPress={() => setTransactionType('GASTO')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    transactionType === 'GASTO' && styles.activeToggleText,
                  ]}
                >
                  GASTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  transactionType === 'INGRESO' && styles.activeToggleButton,
                ]}
                onPress={() => setTransactionType('INGRESO')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    transactionType === 'INGRESO' && styles.activeToggleText,
                  ]}
                >
                  INGRESO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de monto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monto</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>
                {parseFloat(amount).toLocaleString('es-CO')} {selectedAccount?.currency || 'COP'}
              </Text>
            </View>
          </View>

          {/* Campo de nota */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nota (opcional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Agregar una nota..."
              placeholderTextColor="#ADADAD"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>



          {/* Teclado numérico personalizado */}
          <Calculator 
            key={calcResetKey}
            onAmountChange={setAmount}
            initialValue={amount}
          />

        </ScrollView>

        {/* Botón Continuar */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            parseFloat(amount) <= 0 && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={parseFloat(amount) <= 0}
        >
          <Text style={[
            styles.continueButtonText,
            parseFloat(amount) <= 0 && styles.disabledButtonText
          ]}>
            Continuar
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Date Picker Modal Simple */}
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerModal}>
            <Text style={styles.datePickerTitle}>Seleccionar Fecha</Text>
            
            <View style={styles.datePickerControls}>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
              >
                <Text style={styles.datePickerButtonText}>Día Anterior</Text>
              </TouchableOpacity>
              
              <Text style={styles.selectedDateText}>
                {selectedDate.toLocaleDateString('es-CO')}
              </Text>
              
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setSelectedDate(newDate);
                }}
              >
                <Text style={styles.datePickerButtonText}>Día Siguiente</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerActions}>
              <TouchableOpacity 
                style={[styles.datePickerActionButton, styles.todayButton]}
                onPress={() => setSelectedDate(new Date())}
              >
                <Text style={styles.todayButtonText}>Hoy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.datePickerActionButton, styles.confirmButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
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
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountItem,
                    selectedAccount?.id === account.id && styles.selectedAccountItem
                  ]}
                  onPress={() => {
                    setSelectedAccount(account);
                    setShowAccountSelector(false);
                  }}
                >
                  <View style={styles.accountItemLeft}>
                    <Text style={styles.accountItemSymbol}>{account.symbol}</Text>
                    <View style={styles.accountItemInfo}>
                      <Text style={styles.accountItemName}>{account.name}</Text>
                      <Text style={styles.accountItemBalance}>
                        Balance: {account.balance.toLocaleString('es-CO')} {account.currency}
                      </Text>
                    </View>
                  </View>
                  {selectedAccount?.id === account.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#3A7691" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 12,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dateText: {
    fontSize: 16,
    color: '#30353D',
    fontWeight: '500',
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
  amountContainer: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3A7691',
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A7691',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#30353D',
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
    minHeight: 80,
  },

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A7691',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#ADADAD',
  },
  disabledButtonText: {
    color: '#FFFFFF',
  },
  // Date Picker Modal Styles
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#30353D',
    marginBottom: 20,
  },
  datePickerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  datePickerButtonText: {
    fontSize: 14,
    color: '#3A7691',
    fontWeight: '500',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  todayButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  todayButtonText: {
    color: '#3A7691',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#3A7691',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Account Selector Styles
  accountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  accountSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountSelectorSymbol: {
    fontSize: 24,
    marginRight: 12,
  },
  accountSelectorInfo: {
    flex: 1,
  },
  accountSelectorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  accountSelectorBalance: {
    fontSize: 14,
    color: '#666666',
  },
  // Modal Styles (reused from dashboard)
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
  accountSelectorModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '70%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#30353D',
  },
  closeButton: {
    padding: 4,
  },
  accountsList: {
    maxHeight: 300,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  selectedAccountItem: {
    backgroundColor: '#F0F8FF',
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountItemSymbol: {
    fontSize: 24,
    marginRight: 12,
  },
  accountItemInfo: {
    flex: 1,
  },
  accountItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#30353D',
    marginBottom: 2,
  },
  accountItemBalance: {
    fontSize: 14,
    color: '#666666',
  },
});

