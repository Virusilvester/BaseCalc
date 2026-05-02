import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Display } from '../components/common/Display';
import { ModeSelector } from '../components/common/ModeSelector';
import { IconButton } from '../components/common/IconButton';
import { StandardKeypad } from '../components/calculator/StandardKeypad';
import { ScientificKeypad } from '../components/calculator/ScientificKeypad';
import { ProgrammerKeypad } from '../components/calculator/ProgrammerKeypad';
import { DateCalculator } from '../components/calculator/DateCalculator';
import { HistoryPanel, HistoryItem } from '../components/calculator/HistoryPanel';
import { StandardEngine } from '../calculator/engine/StandardEngine';
import { ScientificEngine } from '../calculator/engine/ScientificEngine';
import { ProgrammerEngine } from '../calculator/engine/ProgrammerEngine';
import { CALCULATOR_MODES, CalculatorMode } from '../utils/constants';

export const CalculatorScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const standardEngine = useRef(new StandardEngine()).current;
  const scientificEngine = useRef(new ScientificEngine()).current;
  const programmerEngine = useRef(new ProgrammerEngine()).current;

  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [programmerBases, setProgrammerBases] = useState<{ base: number; label: string; value: string }[]>([]);

  const updateDisplay = useCallback(() => {
    switch (mode) {
      case 'standard':
        setDisplayValue(standardEngine.display);
        setExpression(standardEngine.expression);
        break;
      case 'scientific':
        setDisplayValue(scientificEngine.display);
        setExpression(scientificEngine.expression);
        break;
      case 'programmer':
        setDisplayValue(programmerEngine.display);
        setExpression(programmerEngine.expression);
        setProgrammerBases(programmerEngine.getAllBases());
        break;
    }
  }, [mode, standardEngine, scientificEngine, programmerEngine]);

  const addToHistory = useCallback((expr: string, result: string) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      expression: expr,
      result,
      timestamp: new Date(),
      mode,
    };
    setHistory(prev => [item, ...prev].slice(0, 100));
  }, [mode]);

  const handleNumber = useCallback((num: string) => {
    if (mode === 'standard') {
      standardEngine.input(num);
    } else if (mode === 'scientific') {
      scientificEngine.input(num);
    } else if (mode === 'programmer') {
      programmerEngine.input(num);
    }
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, programmerEngine, updateDisplay]);

  const handleOperator = useCallback((op: string) => {
    if (mode === 'standard') {
      if (standardEngine.expression) {
        addToHistory(standardEngine.expression + ' ' + standardEngine.display, standardEngine.display);
      }
      standardEngine.setOperator(op);
    } else if (mode === 'scientific') {
      if (op === '^') {
        scientificEngine.power(parseFloat(scientificEngine.display));
      } else {
        scientificEngine.setOperator(op);
      }
    } else if (mode === 'programmer') {
      programmerEngine.setOperator(op);
    }
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, programmerEngine, updateDisplay, addToHistory]);

  const handleEquals = useCallback(() => {
    let expr = '';
    let result = '';

    if (mode === 'standard') {
      expr = standardEngine.expression + ' ' + standardEngine.display;
      standardEngine.calculate();
      result = standardEngine.display;
    } else if (mode === 'scientific') {
      expr = scientificEngine.expression + ' ' + scientificEngine.display;
      scientificEngine.calculate();
      result = scientificEngine.display;
    } else if (mode === 'programmer') {
      expr = programmerEngine.expression + ' ' + programmerEngine.display;
      programmerEngine.calculate();
      result = programmerEngine.display;
    }

    updateDisplay();
    if (expr && result) {
      addToHistory(expr, result);
    }
  }, [mode, standardEngine, scientificEngine, programmerEngine, updateDisplay, addToHistory]);

  const handleClear = useCallback(() => {
    if (mode === 'standard') standardEngine.clear();
    else if (mode === 'scientific') scientificEngine.clear();
    else if (mode === 'programmer') programmerEngine.clear();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, programmerEngine, updateDisplay]);

  const handleClearEntry = useCallback(() => {
    if (mode === 'standard') standardEngine.clearEntry();
    updateDisplay();
  }, [mode, standardEngine, updateDisplay]);

  const handleBackspace = useCallback(() => {
    if (mode === 'standard') standardEngine.backspace();
    else if (mode === 'scientific') scientificEngine.backspace();
    else if (mode === 'programmer') programmerEngine.backspace();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, programmerEngine, updateDisplay]);

  const handleToggleSign = useCallback(() => {
    if (mode === 'standard') standardEngine.toggleSign();
    else if (mode === 'scientific') scientificEngine.toggleSign();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay]);

  const handlePercentage = useCallback(() => {
    if (mode === 'standard') standardEngine.percentage();
    updateDisplay();
  }, [mode, standardEngine, updateDisplay]);

  const handleDecimal = useCallback(() => {
    handleNumber('.');
  }, [handleNumber]);

  const handleScientific = useCallback((op: string) => {
    scientificEngine.scientificOperation(op);
    updateDisplay();
  }, [scientificEngine, updateDisplay]);

  const handleToggleAngleMode = useCallback(() => {
    scientificEngine.toggleAngleMode();
    updateDisplay();
  }, [scientificEngine, updateDisplay]);

  const handleBitwiseNot = useCallback(() => {
    programmerEngine.bitwiseNot();
    updateDisplay();
  }, [programmerEngine, updateDisplay]);

  const handleBaseChange = useCallback((base: number) => {
    programmerEngine.setBase(base);
    updateDisplay();
  }, [programmerEngine, updateDisplay]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setDisplayValue(item.result);
    setShowHistory(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleModeChange = useCallback((newMode: string) => {
    setMode(newMode as CalculatorMode);
    setDisplayValue('0');
    setExpression('');
  }, []);

  const renderKeypad = () => {
    switch (mode) {
      case 'standard':
        return (
          <StandardKeypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onClearEntry={handleClearEntry}
            onBackspace={handleBackspace}
            onToggleSign={handleToggleSign}
            onPercentage={handlePercentage}
            onDecimal={handleDecimal}
          />
        );
      case 'scientific':
        return (
          <ScientificKeypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onToggleSign={handleToggleSign}
            onPercentage={handlePercentage}
            onDecimal={handleDecimal}
            onScientific={handleScientific}
            angleMode={scientificEngine.angleModeValue}
            onToggleAngleMode={handleToggleAngleMode}
          />
        );
      case 'programmer':
        return (
          <ProgrammerKeypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onBitwiseNot={handleBitwiseNot}
            currentBase={programmerEngine.currentBase}
            allBases={programmerBases}
            onBaseChange={handleBaseChange}
          />
        );
      case 'date':
        return <DateCalculator />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <IconButton 
          icon={isDark ? 'sunny-outline' : 'moon-outline'} 
          onPress={() => {}} 
          color={colors.text}
        />
        <ModeSelector
          modes={CALCULATOR_MODES.map(m => ({ id: m.id, label: m.label }))}
          activeMode={mode}
          onSelect={handleModeChange}
        />
        <IconButton 
          icon="time-outline" 
          onPress={() => setShowHistory(!showHistory)} 
          color={colors.text}
        />
      </View>

      {mode !== 'date' && (
        <Display 
          value={displayValue} 
          expression={expression}
        />
      )}

      <View style={styles.keypadContainer}>
        {renderKeypad()}
      </View>

      <HistoryPanel
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
        visible={showHistory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  keypadContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
