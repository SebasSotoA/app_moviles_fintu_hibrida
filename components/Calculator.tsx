import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CalculatorState } from '../types/transaction';

const { width } = Dimensions.get('window');

interface CalculatorProps {
  onAmountChange: (amount: string) => void;
  initialValue?: string;
}

export default function Calculator({ onAmountChange, initialValue = '0' }: CalculatorProps) {
  const [state, setState] = useState<CalculatorState>({
    display: initialValue,
    previousValue: null,
    currentOperation: null,
    waitingForOperand: false,
  });

  const calculate = (firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        return secondOperand !== 0 ? firstOperand / secondOperand : firstOperand;
      default:
        return secondOperand;
    }
  };

  const handleNumber = (digit: string) => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: String(digit),
        waitingForOperand: false,
      }));
    } else {
      const newDisplay = state.display === '0' ? String(digit) : state.display + digit;
      setState(prev => ({ ...prev, display: newDisplay }));
    }
  };

  const handleOperation = (nextOperation: string) => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState(prev => ({
        ...prev,
        previousValue: inputValue,
        currentOperation: nextOperation,
        waitingForOperand: true,
      }));
    } else if (state.currentOperation) {
      const currentValue = state.previousValue || 0;
      const newValue = calculate(currentValue, inputValue, state.currentOperation);

      setState(prev => ({
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
      const newValue = calculate(state.previousValue, inputValue, state.currentOperation);
      setState({
        display: String(newValue),
        previousValue: null,
        currentOperation: null,
        waitingForOperand: true,
      });
      onAmountChange(String(newValue));
    }
  };

  const handleDecimal = () => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: '0.',
        waitingForOperand: false,
      }));
    } else if (state.display.indexOf('.') === -1) {
      setState(prev => ({
        ...prev,
        display: prev.display + '.',
      }));
    }
  };

  const handleClear = () => {
    setState({
      display: '0',
      previousValue: null,
      currentOperation: null,
      waitingForOperand: false,
    });
    onAmountChange('0');
  };

  // Actualizar el valor cuando cambie el display
  React.useEffect(() => {
    if (!state.waitingForOperand) {
      onAmountChange(state.display);
    }
  }, [state.display, state.waitingForOperand, onAmountChange]);

  const CalculatorButton = ({ 
    onPress, 
    title, 
    style, 
    textStyle 
  }: { 
    onPress: () => void; 
    title: string; 
    style?: any; 
    textStyle?: any; 
  }) => (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Display del resultado */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{state.display}</Text>
      </View>

      {/* Teclado */}
      <View style={styles.keypad}>
        {/* Primera fila */}
        <View style={styles.row}>
          <CalculatorButton onPress={() => handleNumber('1')} title="1" />
          <CalculatorButton onPress={() => handleNumber('2')} title="2" />
          <CalculatorButton onPress={() => handleNumber('3')} title="3" />
          <CalculatorButton 
            onPress={() => handleOperation('+')} 
            title="+" 
            style={styles.operationButton}
            textStyle={styles.operationText}
          />
        </View>

        {/* Segunda fila */}
        <View style={styles.row}>
          <CalculatorButton onPress={() => handleNumber('4')} title="4" />
          <CalculatorButton onPress={() => handleNumber('5')} title="5" />
          <CalculatorButton onPress={() => handleNumber('6')} title="6" />
          <CalculatorButton 
            onPress={() => handleOperation('-')} 
            title="-" 
            style={styles.operationButton}
            textStyle={styles.operationText}
          />
        </View>

        {/* Tercera fila */}
        <View style={styles.row}>
          <CalculatorButton onPress={() => handleNumber('7')} title="7" />
          <CalculatorButton onPress={() => handleNumber('8')} title="8" />
          <CalculatorButton onPress={() => handleNumber('9')} title="9" />
          <CalculatorButton 
            onPress={() => handleOperation('×')} 
            title="×" 
            style={styles.operationButton}
            textStyle={styles.operationText}
          />
        </View>

        {/* Cuarta fila */}
        <View style={styles.row}>
          <CalculatorButton onPress={handleDecimal} title="." />
          <CalculatorButton onPress={() => handleNumber('0')} title="0" />
          <CalculatorButton 
            onPress={handleEquals} 
            title="=" 
            style={styles.equalsButton}
            textStyle={styles.equalsText}
          />
          <CalculatorButton 
            onPress={() => handleOperation('÷')} 
            title="÷" 
            style={styles.operationButton}
            textStyle={styles.operationText}
          />
        </View>
      </View>
    </View>
  );
}

const buttonSize = (width - 80) / 4 - 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
  },
  displayContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'flex-end',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  displayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#30353D',
  },
  keypad: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#30353D',
  },
  operationButton: {
    backgroundColor: '#3A7691',
  },
  operationText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  equalsButton: {
    backgroundColor: '#30353D',
  },
  equalsText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
});

