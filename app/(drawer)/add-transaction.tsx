import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
// Removido DateTimePicker - no compatible con Expo Go
import Calculator from "../../components/Calculator";
import { useApp } from "../../src/shared/context/AppProvider";
import { formStyles } from "../../src/shared/styles/components";
import { addTransactionStyles } from "../../src/shared/styles/components/add-transaction";
import { singleDateCalendarStyles } from "../../src/shared/styles/components/single-date-calendar";
import { colors, spacing } from "../../src/shared/styles/tokens";
import { TransactionType } from "../../types/transaction";

// Importar SVGs
import ArrowBackIcon from "../../assets/icons/arrow-back.svg";
import ArrowForwardIcon from "../../assets/icons/arrow-forward.svg";
import CalendarOutlineIcon from "../../assets/icons/calendar-outline.svg";
import CheckmarkCircleIcon from "../../assets/icons/checkmark-circle.svg";
import ChevronDownIcon from "../../assets/icons/chevron-down.svg";
import CloseIcon from "../../assets/icons/close.svg";

// Componente para renderizar un mes del calendario
const CalendarMonth = React.memo(
  ({
    month,
    selectedDate,
    onDateSelection,
  }: {
    month: Date;
    selectedDate: Date;
    onDateSelection: (date: Date) => void;
  }) => {
    const getCalendarDaysFor = React.useCallback(
      (baseDate: Date) => {
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
            isSelected:
              selectedDate && date.getTime() === selectedDate.getTime(),
          });
        }

        // Días del mes actual
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
          const date = new Date(year, month, day);
          days.push({
            date,
            isCurrentMonth: true,
            isSelected:
              selectedDate && date.getTime() === selectedDate.getTime(),
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
            isSelected:
              selectedDate && date.getTime() === selectedDate.getTime(),
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
            isSelected:
              selectedDate && nextDate.getTime() === selectedDate.getTime(),
          });
        }

        return days;
      },
      [selectedDate],
    );

    return (
      <View style={singleDateCalendarStyles.calendarContainer}>
        <View style={singleDateCalendarStyles.calendarHeader}>
          <Text style={singleDateCalendarStyles.calendarMonthYear}>
            {month.toLocaleDateString("es-CO", {
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={singleDateCalendarStyles.calendarDaysHeader}>
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <Text key={day} style={singleDateCalendarStyles.calendarDayHeader}>
              {day}
            </Text>
          ))}
        </View>

        <View style={singleDateCalendarStyles.calendarGrid}>
          {getCalendarDaysFor(month).map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                singleDateCalendarStyles.calendarDay,
                day.isCurrentMonth &&
                  singleDateCalendarStyles.calendarDayCurrentMonth,
                day.isSelected && singleDateCalendarStyles.calendarDaySelected,
              ]}
              onPress={() => {
                if (day.isCurrentMonth) {
                  onDateSelection(day.date);
                }
              }}
              disabled={!day.isCurrentMonth}
            >
              <Text
                style={[
                  singleDateCalendarStyles.calendarDayText,
                  day.isCurrentMonth &&
                    singleDateCalendarStyles.calendarDayTextCurrentMonth,
                  day.isSelected &&
                    singleDateCalendarStyles.calendarDayTextSelected,
                ]}
              >
                {day.date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  },
);

CalendarMonth.displayName = "CalendarMonth";

// Componente para calendario de selección de fecha única
const SingleDateCalendar = React.memo(
  ({
    selectedDate,
    onDateSelection,
  }: {
    selectedDate: Date;
    onDateSelection: (date: Date) => void;
  }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);

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

    // Encontrar el índice del mes actual (centro de la lista)
    const currentMonthIndex = React.useMemo(() => {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      return monthsForScroll.findIndex(
        (month) =>
          month.getFullYear() === currentMonth.getFullYear() &&
          month.getMonth() === currentMonth.getMonth(),
      );
    }, [monthsForScroll]);

    // Scroll automático al mes actual cuando se monta el componente
    React.useEffect(() => {
      if (scrollViewRef.current && currentMonthIndex !== -1) {
        // Calcular la altura aproximada de un mes (header + grid de días)
        const monthHeight = 280; // Ajusta este valor según la altura real de tu calendario
        const scrollToY = currentMonthIndex * monthHeight;

        // Usar setTimeout para asegurar que el ScrollView esté renderizado
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: scrollToY,
            animated: false, // Sin animación para que se abra directamente en el mes correcto
          });
        }, 100);
      }
    }, [currentMonthIndex]);

    return (
      <ScrollView
        ref={scrollViewRef}
        style={singleDateCalendarStyles.calendarScrollView}
        showsVerticalScrollIndicator={false}
      >
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
  },
);

SingleDateCalendar.displayName = "SingleDateCalendar";

export default function AddTransaction() {
  const { currentAccount, accounts } = useApp();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactionType, setTransactionType] =
    useState<TransactionType>("GASTO");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(currentAccount);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [calcResetKey, setCalcResetKey] = useState(0);

  // Restaurar datos cuando se regrese desde choose-category (solo si hay parámetros)
  useEffect(() => {
    const { type, amount, date, note, accountId } = params;

    const hasTransactionParams = type || amount || date || note || accountId;

    if (hasTransactionParams) {
      if (type) setTransactionType(type as TransactionType);
      if (amount) setAmount(amount as string);
      if (date) setSelectedDate(new Date(date as string));
      if (note) setNote(note as string);
      if (accountId) {
        const account = accounts.find(acc => acc.id === accountId);
        if (account) setSelectedAccount(account);
      }
    } else {
      // reset al venir del home
      setAmount("0");
      setNote("");
      setSelectedDate(new Date());
      setTransactionType("GASTO");
      setCalcResetKey(prev => prev + 1);
    }
  }, [params.type, params.amount, params.date, params.note, params.accountId, accounts]);

  // Actualizar cuenta seleccionada cuando cambie la cuenta actual
  useEffect(() => {
    if (selectedAccount?.id !== currentAccount?.id) {
      setSelectedAccount(currentAccount);
    }
  }, [currentAccount, selectedAccount?.id]);

  const formatDate = (date: Date) => {
    const days = [
      "DOMINGO",
      "LUNES",
      "MARTES",
      "MIÉRCOLES",
      "JUEVES",
      "VIERNES",
      "SÁBADO",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
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
      Alert.alert("Error", "El monto debe ser mayor a 0");
      return;
    }

    if (!selectedAccount) {
      Alert.alert("Error", "No hay cuenta seleccionada");
      return;
    }

    // Navegar a la pantalla de elegir categoría
    // Pasamos los datos como parámetros
    router.push({
      pathname: "/(drawer)/choose-category",
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
      router.push("/(drawer)/");
    }
  };


  return (
    <View style={addTransactionStyles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.dark}
      />

      {/* Área superior con color del header */}
      <View
        style={[addTransactionStyles.statusBarArea, { height: insets.top }]}
      />

      {/* Header */}
      <View style={addTransactionStyles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={addTransactionStyles.backButton}
        >
          <ArrowBackIcon
            width={24}
            height={24}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={addTransactionStyles.headerCenter}>
          <Text style={addTransactionStyles.headerTitle}>
            Añadir Transacción
          </Text>
        </View>
        <View style={addTransactionStyles.placeholder} />
      </View>

      {/* Contenido principal */}
      <SafeAreaView
        style={addTransactionStyles.contentContainer}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView
          style={addTransactionStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Selector de fecha */}
          <View style={[formStyles.fieldGroup, { marginTop: spacing[2] }]}>
            <Text style={formStyles.label}>Fecha</Text>
            <TouchableOpacity
              style={addTransactionStyles.dateSelector}
              onPress={showDatepicker}
            >
              <Text style={addTransactionStyles.dateText}>
                {formatDate(selectedDate)}
              </Text>
              <CalendarOutlineIcon
                width={20}
                height={20}
                color={colors.primary[500]}
              />
            </TouchableOpacity>
          </View>

          {/* Selector de cuenta */}
          <View style={formStyles.fieldGroup}>
            <Text style={formStyles.label}>Cuenta</Text>
            <TouchableOpacity
              style={addTransactionStyles.accountSelector}
              onPress={() => setShowAccountSelector(true)}
            >
              <View style={addTransactionStyles.accountSelectorLeft}>
                <Text style={addTransactionStyles.accountSelectorSymbol}>
                  {selectedAccount?.symbol || "💰"}
                </Text>
                <View style={addTransactionStyles.accountSelectorInfo}>
                  <Text style={addTransactionStyles.accountSelectorName}>
                    {selectedAccount?.name || "Seleccionar cuenta"}
                  </Text>
                  <Text style={addTransactionStyles.accountSelectorBalance}>
                    Balance:{" "}
                    {selectedAccount?.balance?.toLocaleString("es-CO") || "0"}{" "}
                    {selectedAccount?.currency || "COP"}
                  </Text>
                </View>
              </View>
              <ChevronDownIcon
                width={16}
                height={16}
                color={colors.neutral.white}
              />
            </TouchableOpacity>
          </View>

          {/* Toggle tipo de transacción */}
          <View style={formStyles.fieldGroup}>
            <Text style={formStyles.label}>Tipo</Text>
            <View style={addTransactionStyles.toggleContainer}>
              <TouchableOpacity
                style={[
                  addTransactionStyles.toggleButton,
                  transactionType === "GASTO" &&
                    addTransactionStyles.activeToggleButton,
                ]}
                onPress={() => setTransactionType("GASTO")}
              >
                <Text
                  style={[
                    addTransactionStyles.toggleText,
                    transactionType === "GASTO" &&
                      addTransactionStyles.activeToggleText,
                  ]}
                >
                  GASTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  addTransactionStyles.toggleButton,
                  transactionType === "INGRESO" &&
                    addTransactionStyles.activeToggleButton,
                ]}
                onPress={() => setTransactionType("INGRESO")}
              >
                <Text
                  style={[
                    addTransactionStyles.toggleText,
                    transactionType === "INGRESO" &&
                      addTransactionStyles.activeToggleText,
                  ]}
                >
                  INGRESO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de nota */}
          <View style={formStyles.fieldGroup}>
            <Text style={formStyles.label}>Nota (opcional)</Text>
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
        </ScrollView>
        {/* Calculadora al inicio */}
        <View style={addTransactionStyles.calculatorSection}>
          <Calculator
            key={calcResetKey}
            onAmountChange={setAmount}
            initialValue={amount}
          />
        </View>
        {/* Botón Continuar Flotante */}
        <View style={addTransactionStyles.floatingButtonContainer}>
          <TouchableOpacity
            style={[
              addTransactionStyles.floatingButton,
              parseFloat(amount) <= 0 && addTransactionStyles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={parseFloat(amount) <= 0}
          >
            <Text
              style={[
                addTransactionStyles.floatingButtonText,
                parseFloat(amount) <= 0 &&
                  addTransactionStyles.disabledButtonText,
              ]}
            >
              Continuar
            </Text>
            <ArrowForwardIcon
              width={20}
              height={20}
              color={colors.neutral.white}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Date Picker Modal con Calendario */}
      {showDatePicker && (
        <View style={addTransactionStyles.datePickerOverlay}>
          <View style={addTransactionStyles.datePickerModal}>
            <View style={addTransactionStyles.datePickerHeader}>
              <Text style={addTransactionStyles.datePickerTitle}>
                Seleccionar Fecha
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={addTransactionStyles.closeButton}
              >
                <CloseIcon
                  width={24}
                  height={24}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>

            <SingleDateCalendar
              selectedDate={selectedDate}
              onDateSelection={setSelectedDate}
            />

            <View style={addTransactionStyles.datePickerActions}>
              <TouchableOpacity
                style={[
                  addTransactionStyles.datePickerActionButton,
                  addTransactionStyles.todayButton,
                ]}
                onPress={() => {
                  setSelectedDate(new Date());
                  setShowDatePicker(false);
                }}
              >
                <Text style={addTransactionStyles.todayButtonText}>Hoy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  addTransactionStyles.datePickerActionButton,
                  addTransactionStyles.confirmButton,
                ]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={addTransactionStyles.confirmButtonText}>
                  Confirmar
                </Text>
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
              <Text style={addTransactionStyles.modalTitle}>
                Seleccionar Cuenta
              </Text>
              <TouchableOpacity
                onPress={() => setShowAccountSelector(false)}
                style={addTransactionStyles.closeButton}
              >
                <CloseIcon
                  width={24}
                  height={24}
                  color={colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={addTransactionStyles.accountsList}
              showsVerticalScrollIndicator={false}
            >
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    addTransactionStyles.accountItem,
                    selectedAccount?.id === account.id &&
                      addTransactionStyles.selectedAccountItem,
                  ]}
                  onPress={() => {
                    setSelectedAccount(account);
                    setShowAccountSelector(false);
                  }}
                >
                  <View style={addTransactionStyles.accountItemLeft}>
                    <Text style={addTransactionStyles.accountItemSymbol}>
                      {account.symbol}
                    </Text>
                    <View style={addTransactionStyles.accountItemInfo}>
                      <Text style={addTransactionStyles.accountItemName}>
                        {account.name}
                      </Text>
                      <Text style={addTransactionStyles.accountItemBalance}>
                        Balance: {account.balance.toLocaleString("es-CO")}{" "}
                        {account.currency}
                      </Text>
                    </View>
                  </View>
                  {selectedAccount?.id === account.id && (
                    <CheckmarkCircleIcon
                      width={24}
                      height={24}
                      color={colors.primary[500]}
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
