import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { iconStyles } from "../src/shared/styles/components";
import { calculatorStyles } from "../src/shared/styles/components/calculator";
import { colors } from "../src/shared/styles/tokens";
import { CalculatorState } from "../types/transaction";

// Importar SVGs
import BackspaceOutlineIcon from "../assets/icons/backspace-outline.svg";

const { width } = Dimensions.get("window");

const isTablet = width >= 768;

interface CalculatorProps {
  onAmountChange: (amount: string) => void;
  initialValue?: string;
}

export default function Calculator({
  onAmountChange,
  initialValue = "0",
}: CalculatorProps) {
  const [state, setState] = useState<CalculatorState>({
    display: initialValue,
    previousValue: null,
    currentOperation: null,
    waitingForOperand: false,
  });

  const calculate = (
    firstOperand: number,
    secondOperand: number,
    operation: string,
  ): number => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "×":
        return firstOperand * secondOperand;
      case "÷":
        return secondOperand !== 0
          ? firstOperand / secondOperand
          : firstOperand;
      default:
        return secondOperand;
    }
  };

  const handleNumber = (digit: string) => {
    if (state.waitingForOperand) {
      setState((prev) => ({
        ...prev,
        display: String(digit),
        waitingForOperand: false,
      }));
    } else {
      const newDisplay =
        state.display === "0" ? String(digit) : state.display + digit;
      setState((prev) => ({ ...prev, display: newDisplay }));
    }
  };

  const handleOperation = (nextOperation: string) => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState((prev) => ({
        ...prev,
        previousValue: inputValue,
        currentOperation: nextOperation,
        waitingForOperand: true,
      }));
    } else if (state.currentOperation) {
      const currentValue = state.previousValue || 0;
      const newValue = calculate(
        currentValue,
        inputValue,
        state.currentOperation,
      );

      setState((prev) => ({
        ...prev,
        display: String(newValue),
        previousValue: newValue,
        currentOperation: nextOperation,
        waitingForOperand: true,
      }));
      onAmountChange(String(newValue));
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue !== null && state.currentOperation) {
      const newValue = calculate(
        state.previousValue,
        inputValue,
        state.currentOperation,
      );
      setState({
        display: String(newValue),
        previousValue: null,
        currentOperation: null,
        waitingForOperand: false, // Cambiamos a false para permitir edición
      });
      onAmountChange(String(newValue));
    }
  };

  const handleDecimal = () => {
    if (state.waitingForOperand) {
      setState((prev) => ({
        ...prev,
        display: "0.",
        waitingForOperand: false,
      }));
    } else if (state.display.indexOf(".") === -1) {
      setState((prev) => ({
        ...prev,
        display: prev.display + ".",
      }));
    }
  };

  const handleBackspace = () => {
    if (state.waitingForOperand) return;
    setState((prev) => ({
      ...prev,
      display: prev.display.length > 1 ? prev.display.slice(0, -1) : "0",
    }));
  };

  // Sincronizar el estado interno con initialValue cuando cambie
  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      display: initialValue,
      previousValue: null,
      currentOperation: null,
      waitingForOperand: false,
    }));
  }, [initialValue]);

  // Actualizar el valor cuando cambie el display
  React.useEffect(() => {
    if (!state.waitingForOperand) {
      onAmountChange(state.display);
    }
  }, [state.display, state.waitingForOperand]);

  const CalculatorButton = ({
    onPress,
    title,
    style,
    textStyle,
  }: {
    onPress: () => void;
    title: string;
    style?: any;
    textStyle?: any;
  }) => (
    <TouchableOpacity
      style={[calculatorStyles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[calculatorStyles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        calculatorStyles.container,
        isTablet && calculatorStyles.calculatorContainer,
      ]}
    >
      {/* Display del resultado */}
      <View style={calculatorStyles.displayContainer}>
        <Text
          style={calculatorStyles.displayText}
          numberOfLines={1}
          ellipsizeMode="head"
        >
          {state.display}
        </Text>
        <TouchableOpacity
          onPress={handleBackspace}
          style={calculatorStyles.backspaceButton}
        >
          <BackspaceOutlineIcon
            width={iconStyles.medium.width}
            height={iconStyles.medium.height}
            fill={colors.border.dark}
          />
        </TouchableOpacity>
      </View>

      {/* Teclado */}
      <View style={calculatorStyles.keypad}>
        {/* Primera fila */}
        <View style={calculatorStyles.row}>
          <CalculatorButton onPress={() => handleNumber("1")} title="1" />
          <CalculatorButton onPress={() => handleNumber("2")} title="2" />
          <CalculatorButton onPress={() => handleNumber("3")} title="3" />
          <CalculatorButton
            onPress={() => handleOperation("+")}
            title="+"
            style={calculatorStyles.operationButton}
            textStyle={calculatorStyles.operationText}
          />
        </View>

        {/* Segunda fila */}
        <View style={calculatorStyles.row}>
          <CalculatorButton onPress={() => handleNumber("4")} title="4" />
          <CalculatorButton onPress={() => handleNumber("5")} title="5" />
          <CalculatorButton onPress={() => handleNumber("6")} title="6" />
          <CalculatorButton
            onPress={() => handleOperation("-")}
            title="-"
            style={calculatorStyles.operationButton}
            textStyle={calculatorStyles.operationText}
          />
        </View>

        {/* Tercera fila */}
        <View style={calculatorStyles.row}>
          <CalculatorButton onPress={() => handleNumber("7")} title="7" />
          <CalculatorButton onPress={() => handleNumber("8")} title="8" />
          <CalculatorButton onPress={() => handleNumber("9")} title="9" />
          <CalculatorButton
            onPress={() => handleOperation("×")}
            title="×"
            style={calculatorStyles.operationButton}
            textStyle={calculatorStyles.operationText}
          />
        </View>

        {/* Cuarta fila */}
        <View style={calculatorStyles.row}>
          <CalculatorButton onPress={handleDecimal} title="." />
          <CalculatorButton onPress={() => handleNumber("0")} title="0" />
          <CalculatorButton
            onPress={handleEquals}
            title="="
            style={calculatorStyles.equalsButton}
            textStyle={calculatorStyles.equalsText}
          />
          <CalculatorButton
            onPress={() => handleOperation("÷")}
            title="÷"
            style={calculatorStyles.operationButton}
            textStyle={calculatorStyles.operationText}
          />
        </View>
      </View>
    </View>
  );
}
