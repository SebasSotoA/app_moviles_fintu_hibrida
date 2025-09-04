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
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// Removido DateTimePicker - no compatible con Expo Go
import Calculator from '../../components/Calculator';
import { useApp } from '../../src/shared/context/AppProvider';
import { TransactionType } from '../../types/transaction';
import styles from '@/src/shared/styles/components/add-transaction';
import colors from '@/src/shared/styles/themes';

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

    // Mapa de íconos locales (SVG) - misma lógica que en _layout.tsx
    const ICONS: Record<string, any> = {
      'arrow-back': require('../../assets/icons/arrow-back.svg'),
      'calendar-outline': require('../../assets/icons/calendar-outline.svg'),
      'chevron-down': require('../../assets/icons/chevron-down.svg'),
      'arrow-forward': require('../../assets/icons/arrow-forward.svg'),
      'close': require('../../assets/icons/close.svg'),
      'checkmark-circle': require('../../assets/icons/checkmark-circle.svg'),
    };  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.grayDark} />
      
      {/* Área superior con color del header */}
      <View style={[styles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 28, height: 28, tintColor: colors.white }}
            resizeMode="contain"
          />
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
              <Image
                source={ICONS['calendar-outline']}
                style={{ width: 24, height: 24, tintColor: colors.primary }}
                resizeMode="contain"
              />
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
              <Image
                source={ICONS['chevron-down']}
                style={{ width: 20, height: 20, tintColor: colors.white }}
                resizeMode="contain"
              />
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
          <Image
            source={ICONS['arrow-forward']}
            style={{ width: 20, height: 20, tintColor: colors.white }}
            resizeMode="contain"
          />
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
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: colors.grayMedium }}
                  resizeMode="contain"
                />
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
                    <Image
                      source={ICONS['checkmark-circle']}
                      style={{ width: 24, height: 24, tintColor: colors.primary }}
                      resizeMode="contain"
                    />
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