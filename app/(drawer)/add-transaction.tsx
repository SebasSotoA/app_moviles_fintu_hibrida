import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// Removido DateTimePicker - no compatible con Expo Go
import Calculator from '../../components/Calculator';
import { useApp } from '../../src/shared/context/AppProvider';
import { useStyles } from '../../src/shared/hooks';
import { colors, shadows, spacing, typography } from '../../src/shared/styles/tokens';
import { TransactionType } from '../../types/transaction';

// Componente para renderizar un mes del calendario
const CalendarMonth = React.memo(({ 
  month, 
  selectedDate, 
  onDateSelection 
}: {
  month: Date;
  selectedDate: Date;
  onDateSelection: (date: Date) => void;
}) => {
  const calendarStyles = useStyles(() => ({
    calendarContainer: {
      marginBottom: spacing[4],
    },
    calendarHeader: {
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    calendarMonthYear: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
    },
    calendarDaysHeader: {
      flexDirection: 'row',
      marginBottom: spacing[2],
    },
    calendarDayHeader: {
      flexBasis: '14.285714%',
      textAlign: 'center',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
      paddingVertical: spacing[2],
    } as any,
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    calendarDay: {
      flexBasis: '14.285714%',
      flexGrow: 0,
      flexShrink: 0,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      padding: spacing[1],
    },
    calendarDayCurrentMonth: {
      backgroundColor: colors.neutral.white,
    },
    calendarDaySelected: {
      backgroundColor: colors.primary[500],
    },
    calendarDayText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
    } as any,
    calendarDayTextCurrentMonth: {
      color: colors.text.primary,
    } as any,
    calendarDayTextSelected: {
      color: colors.neutral.white,
    } as any,
  }));

  const getCalendarDaysFor = React.useCallback((baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const dayNumber = daysInPrevMonth - i;
      const date = new Date(year, month - 1, dayNumber);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: selectedDate && date.getTime() === selectedDate.getTime(),
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isSelected: selectedDate && date.getTime() === selectedDate.getTime(),
      });
    }
    
    // Días del mes siguiente para completar exactamente 42 días
    const totalDaysSoFar = days.length;
    const remainingDays = 42 - totalDaysSoFar;
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: selectedDate && date.getTime() === selectedDate.getTime(),
      });
    }
    
    // Asegurar que siempre tengamos exactamente 42 días
    while (days.length < 42) {
      const lastDate: Date = days[days.length - 1].date;
      const nextDate: Date = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isSelected: selectedDate && nextDate.getTime() === selectedDate.getTime(),
      });
    }
    
    return days;
  }, [selectedDate]);

  return (
    <View style={calendarStyles.calendarContainer}>
      <View style={calendarStyles.calendarHeader}>
        <Text style={calendarStyles.calendarMonthYear}>
          {month.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <View style={calendarStyles.calendarDaysHeader}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <Text key={day} style={calendarStyles.calendarDayHeader}>{day}</Text>
        ))}
      </View>

      <View style={calendarStyles.calendarGrid}>
        {getCalendarDaysFor(month).map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              calendarStyles.calendarDay,
              day.isCurrentMonth && calendarStyles.calendarDayCurrentMonth,
              day.isSelected && calendarStyles.calendarDaySelected,
            ]}
            onPress={() => {
              if (day.isCurrentMonth) {
                onDateSelection(day.date);
              }
            }}
            disabled={!day.isCurrentMonth}
          >
            <Text style={[
              calendarStyles.calendarDayText,
              day.isCurrentMonth && calendarStyles.calendarDayTextCurrentMonth,
              day.isSelected && calendarStyles.calendarDayTextSelected,
            ]}>
              {day.date.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

CalendarMonth.displayName = 'CalendarMonth';

// Componente para calendario de selección de fecha única
const SingleDateCalendar = React.memo(({ 
  selectedDate, 
  onDateSelection 
}: {
  selectedDate: Date;
  onDateSelection: (date: Date) => void;
}) => {
  // Generar lista de meses alrededor del mes actual para scroll continuo
  const monthsForScroll = React.useMemo(() => {
    const center = new Date();
    const list: Date[] = [];
    // 6 meses atrás, 6 meses adelante
    for (let i = -6; i <= 6; i++) {
      const d = new Date(center);
      d.setDate(1);
      d.setMonth(center.getMonth() + i);
      list.push(d);
    }
    return list;
  }, []);

  const calendarStyles = useStyles(() => ({
    calendarScrollView: {
      maxHeight: 400,
    },
  }));

  return (
    <ScrollView style={calendarStyles.calendarScrollView} showsVerticalScrollIndicator={false}>
      {monthsForScroll.map((month, idx) => (
        <CalendarMonth
          key={`${month.getFullYear()}-${month.getMonth()}`}
          month={month}
          selectedDate={selectedDate}
          onDateSelection={onDateSelection}
        />
      ))}
    </ScrollView>
  );
});

SingleDateCalendar.displayName = 'SingleDateCalendar';

export default function AddTransaction() {
  const { currentAccount, accounts } = useApp();
  const insets = useSafeAreaInsets();
  
  const addTransactionStyles = useStyles(() => ({
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
      justifyContent: 'space-between',
      paddingHorizontal: spacing.layout.screenPadding,
      paddingVertical: spacing[3],
      backgroundColor: colors.background.dark,
      borderBottomWidth: 1,
      borderBottomColor: colors.background.dark,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
    },
    backButton: {
      padding: spacing[1],
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
    },
    placeholder: {
      width: 38,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.layout.screenPadding,
    },
    calculatorSection: {
      backgroundColor: colors.neutral.white,
      paddingHorizontal: spacing.layout.screenPadding,
      paddingVertical: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    calculatorTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.secondary,
      marginBottom: spacing[3],
    },
    floatingButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.neutral.white,
      paddingHorizontal: spacing.layout.screenPadding,
      paddingVertical: spacing[4],
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      ...shadows.specific.card,
    },
    floatingButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary[500],
      paddingVertical: spacing.component.buttonPadding,
      borderRadius: 25,
      ...shadows.specific.button,
    },
    floatingButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
      marginRight: spacing[2],
    },
    dateSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.component.inputPadding,
      backgroundColor: colors.neutral.gray[100],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.light,
      marginBottom: spacing[4],
    },
    dateText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    amountContainer: {
      padding: spacing[5],
      backgroundColor: colors.neutral.gray[100],
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primary[500],
      marginBottom: spacing[4],
    },
    amountText: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.primary[500],
    },
    noteInput: {
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 12,
      padding: spacing.component.inputPadding,
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      backgroundColor: colors.neutral.gray[100],
      textAlignVertical: 'top',
      minHeight: 80,
      marginBottom: spacing[4],
    },
    continueButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary[500],
      marginHorizontal: spacing.layout.screenPadding,
      marginBottom: spacing.layout.screenPadding,
      paddingVertical: spacing.component.buttonPadding,
      borderRadius: 25,
      ...shadows.specific.button,
    },
    continueButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.white,
      marginRight: spacing[2],
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.neutral.gray[100],
      borderRadius: 25,
      padding: spacing[1],
      marginBottom: spacing[4],
    },
    toggleButton: {
      flex: 1,
      paddingVertical: spacing[3],
      alignItems: 'center',
      borderRadius: 25,
    },
    activeToggleButton: {
      backgroundColor: colors.primary[500],
    },
    toggleText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.tertiary,
    },
    activeToggleText: {
      color: colors.neutral.white,
    },
    accountSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.component.inputPadding,
      backgroundColor: colors.neutral.gray[100],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.light,
      marginBottom: spacing[4],
    },
    accountSelectorInfo: {
      flex: 1,
    },
    accountSelectorName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.secondary,
      marginBottom: spacing[0],
    },
    accountSelectorBalance: {
      fontSize: typography.fontSize.sm,
      color: colors.text.tertiary,
    },
    accountSelectorLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    accountSelectorSymbol: {
      fontSize: typography.fontSize['2xl'],
      marginRight: spacing[3],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing[12],
    },
         loadingText: {
       marginTop: spacing[4],
       fontSize: typography.fontSize.base,
       color: colors.text.secondary,
     },
     section: {
       marginBottom: spacing[4],
     },
     sectionTitle: {
       fontSize: typography.fontSize.sm,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       marginBottom: spacing[2],
     },
     disabledButton: {
       backgroundColor: colors.neutral.gray[300],
     },
     disabledButtonText: {
       color: colors.neutral.gray[500],
     },
     datePickerOverlay: {
       position: 'absolute',
       top: 0,
       left: 0,
       right: 0,
       bottom: 0,
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
       justifyContent: 'center',
       alignItems: 'center',
       zIndex: 1000,
     },
     datePickerModal: {
       backgroundColor: colors.neutral.white,
       borderRadius: 12,
       padding: spacing[6],
       margin: spacing[4],
       minWidth: 300,
     },
     datePickerTitle: {
       fontSize: typography.fontSize.lg,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.primary,
       textAlign: 'center',
       marginBottom: spacing[4],
     },
     datePickerControls: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       marginBottom: spacing[4],
     },
     datePickerButton: {
       backgroundColor: colors.neutral.gray[100],
       paddingHorizontal: spacing[3],
       paddingVertical: spacing[2],
       borderRadius: 8,
     },
     datePickerButtonText: {
       fontSize: typography.fontSize.sm,
       color: colors.text.secondary,
     },
     selectedDateText: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.primary,
     },
     datePickerActions: {
       flexDirection: 'row',
       gap: spacing[2],
     },
     datePickerActionButton: {
       flex: 1,
       paddingVertical: spacing[3],
       borderRadius: 8,
       alignItems: 'center',
     },
     todayButton: {
       backgroundColor: colors.neutral.gray[100],
     },
     todayButtonText: {
       fontSize: typography.fontSize.base,
       color: colors.text.secondary,
     },
     confirmButton: {
       backgroundColor: colors.primary[500],
     },
     confirmButtonText: {
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
       zIndex: 1000,
     },
     accountSelectorModal: {
       backgroundColor: colors.neutral.white,
       borderRadius: 12,
       margin: spacing[4],
       maxHeight: '80%',
       minWidth: 300,
     },
     modalHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: spacing[4],
       borderBottomWidth: 1,
       borderBottomColor: colors.border.light,
     },
     modalTitle: {
       fontSize: typography.fontSize.lg,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.primary,
     },
         closeButton: {
      padding: spacing[1],
    },
    datePickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[4],
    },
    calendarScrollView: {
      maxHeight: 400,
      marginBottom: spacing[4],
    },
     accountsList: {
       maxHeight: 400,
     },
     accountItem: {
       flexDirection: 'row',
       alignItems: 'center',
       padding: spacing[4],
       borderBottomWidth: 1,
       borderBottomColor: colors.border.light,
     },
     selectedAccountItem: {
       backgroundColor: colors.secondary[50],
     },
     accountItemLeft: {
       flexDirection: 'row',
       alignItems: 'center',
       flex: 1,
     },
     accountItemSymbol: {
       fontSize: typography.fontSize['2xl'],
       marginRight: spacing[3],
     },
     accountItemInfo: {
       flex: 1,
     },
     accountItemName: {
       fontSize: typography.fontSize.base,
       fontWeight: typography.fontWeight.semibold,
       color: colors.text.secondary,
       marginBottom: spacing[0],
     },
     accountItemBalance: {
       fontSize: typography.fontSize.sm,
       color: colors.text.tertiary,
     },
   }));
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
  }, [currentAccount]);

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
    <View style={addTransactionStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />
      
      {/* Área superior con color del header */}
      <View style={[addTransactionStyles.statusBarArea, { height: insets.top }]} />
      
      {/* Header */}
      <View style={addTransactionStyles.header}>
        <TouchableOpacity onPress={goBack} style={addTransactionStyles.backButton}>
          <Image
            source={ICONS['arrow-back']}
            style={{ width: 28, height: 28, tintColor: colors.neutral.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={addTransactionStyles.headerCenter}>
          <Text style={addTransactionStyles.headerTitle}>Añadir Transacción</Text>
        </View>
        <View style={addTransactionStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView style={addTransactionStyles.contentContainer} edges={['left', 'right', 'bottom']}>
        {/* Calculadora al inicio */}
        <View style={addTransactionStyles.calculatorSection}>
          <Text style={addTransactionStyles.calculatorTitle}>Monto</Text>
          <Calculator 
            key={calcResetKey}
            onAmountChange={setAmount}
            initialValue={amount}
          />
        </View>

        <ScrollView style={addTransactionStyles.content} showsVerticalScrollIndicator={false}>
          {/* Selector de fecha */}
          <View style={{ marginBottom: spacing[4] }}>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, marginBottom: spacing[2] }}>Fecha</Text>
            <TouchableOpacity 
              style={addTransactionStyles.dateSelector}
              onPress={showDatepicker}
            >
              <Text style={addTransactionStyles.dateText}>{formatDate(selectedDate)}</Text>
              <Image
                source={ICONS['calendar-outline']}
                style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Selector de cuenta */}
          <View style={{ marginBottom: spacing[4] }}>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, marginBottom: spacing[2] }}>Cuenta</Text>
            <TouchableOpacity 
              style={addTransactionStyles.accountSelector}
              onPress={() => setShowAccountSelector(true)}
            >
              <View style={addTransactionStyles.accountSelectorLeft}>
                <Text style={addTransactionStyles.accountSelectorSymbol}>{selectedAccount?.symbol || '💰'}</Text>
                <View style={addTransactionStyles.accountSelectorInfo}>
                  <Text style={addTransactionStyles.accountSelectorName}>
                    {selectedAccount?.name || 'Seleccionar cuenta'}
                  </Text>
                  <Text style={addTransactionStyles.accountSelectorBalance}>
                    Balance: {selectedAccount?.balance?.toLocaleString('es-CO') || '0'} {selectedAccount?.currency || 'COP'}
                  </Text>
                </View>
              </View>
              <Image
                source={ICONS['chevron-down']}
                style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Toggle tipo de transacción */}
          <View style={{ marginBottom: spacing[4] }}>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, marginBottom: spacing[2] }}>Tipo</Text>
            <View style={addTransactionStyles.toggleContainer}>
              <TouchableOpacity
                style={[
                  addTransactionStyles.toggleButton,
                  transactionType === 'GASTO' && addTransactionStyles.activeToggleButton,
                ]}
                onPress={() => setTransactionType('GASTO')}
              >
                <Text
                  style={[
                    addTransactionStyles.toggleText,
                    transactionType === 'GASTO' && addTransactionStyles.activeToggleText,
                  ]}
                >
                  GASTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  addTransactionStyles.toggleButton,
                  transactionType === 'INGRESO' && addTransactionStyles.activeToggleButton,
                ]}
                onPress={() => setTransactionType('INGRESO')}
              >
                <Text
                  style={[
                    addTransactionStyles.toggleText,
                    transactionType === 'INGRESO' && addTransactionStyles.activeToggleText,
                  ]}
                >
                  INGRESO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de nota */}
          <View style={{ marginBottom: spacing[4] }}>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, marginBottom: spacing[2] }}>Nota (opcional)</Text>
            <TextInput
              style={addTransactionStyles.noteInput}
              placeholder="Agregar una nota..."
              placeholderTextColor="#ADADAD"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Espacio para el botón flotante */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botón Continuar Flotante */}
        <View style={addTransactionStyles.floatingButtonContainer}>
          <TouchableOpacity 
            style={[
              addTransactionStyles.floatingButton,
              parseFloat(amount) <= 0 && addTransactionStyles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={parseFloat(amount) <= 0}
          >
            <Text style={[
              addTransactionStyles.floatingButtonText,
              parseFloat(amount) <= 0 && addTransactionStyles.disabledButtonText
            ]}>
              Continuar
            </Text>
            <Image
              source={ICONS['arrow-forward']}
              style={{ width: 20, height: 20, tintColor: colors.neutral.white }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Date Picker Modal con Calendario */}
      {showDatePicker && (
        <View style={addTransactionStyles.datePickerOverlay}>
          <View style={addTransactionStyles.datePickerModal}>
            <View style={addTransactionStyles.datePickerHeader}>
              <Text style={addTransactionStyles.datePickerTitle}>Seleccionar Fecha</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(false)}
                style={addTransactionStyles.closeButton}
              >
                <Image
                  source={require('../../assets/icons/close.svg')}
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <SingleDateCalendar
              selectedDate={selectedDate}
              onDateSelection={setSelectedDate}
            />
            
            <View style={addTransactionStyles.datePickerActions}>
              <TouchableOpacity 
                style={[addTransactionStyles.datePickerActionButton, addTransactionStyles.todayButton]}
                onPress={() => setSelectedDate(new Date())}
              >
                <Text style={addTransactionStyles.todayButtonText}>Hoy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[addTransactionStyles.datePickerActionButton, addTransactionStyles.confirmButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={addTransactionStyles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal Selector de Cuenta */}
      {showAccountSelector && (
        <View style={addTransactionStyles.modalOverlay}>
          <View style={addTransactionStyles.accountSelectorModal}>
            <View style={addTransactionStyles.modalHeader}>
              <Text style={addTransactionStyles.modalTitle}>Seleccionar Cuenta</Text>
              <TouchableOpacity 
                onPress={() => setShowAccountSelector(false)}
                style={addTransactionStyles.closeButton}
              >
                <Image
                  source={ICONS['close']}
                  style={{ width: 24, height: 24, tintColor: colors.text.tertiary }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={addTransactionStyles.accountsList} showsVerticalScrollIndicator={false}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    addTransactionStyles.accountItem,
                    selectedAccount?.id === account.id && addTransactionStyles.selectedAccountItem
                  ]}
                  onPress={() => {
                    setSelectedAccount(account);
                    setShowAccountSelector(false);
                  }}
                >
                  <View style={addTransactionStyles.accountItemLeft}>
                    <Text style={addTransactionStyles.accountItemSymbol}>{account.symbol}</Text>
                    <View style={addTransactionStyles.accountItemInfo}>
                      <Text style={addTransactionStyles.accountItemName}>{account.name}</Text>
                      <Text style={addTransactionStyles.accountItemBalance}>
                        Balance: {account.balance.toLocaleString('es-CO')} {account.currency}
                      </Text>
                    </View>
                  </View>
                  {selectedAccount?.id === account.id && (
                    <Image
                      source={ICONS['checkmark-circle']}
                      style={{ width: 24, height: 24, tintColor: colors.primary[500] }}
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