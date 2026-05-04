import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Display } from "../components/common/Display";
import { ModeSelector } from "../components/common/ModeSelector";
import { StandardKeypad } from "../components/calculator/StandardKeypad";
import { ScientificKeypad } from "../components/calculator/ScientificKeypad";
import { ProgrammerKeypad } from "../components/calculator/ProgrammerKeypad";
import { DateCalculator } from "../components/calculator/DateCalculator";
import {
  HistoryPanel,
  HistoryItem,
} from "../components/calculator/HistoryPanel";
import { StandardEngine } from "../calculator/engine/StandardEngine";
import { ScientificEngine } from "../calculator/engine/ScientificEngine";
import { ProgrammerEngine } from "../calculator/engine/ProgrammerEngine";
import { CALCULATOR_MODES, CalculatorMode } from "../utils/constants";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export const CalculatorScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [mode, setMode] = useState<CalculatorMode>("standard");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const standardEngine = useRef(new StandardEngine()).current;
  const scientificEngine = useRef(new ScientificEngine()).current;
  const programmerEngine = useRef(new ProgrammerEngine()).current;

  const [displayValue, setDisplayValue] = useState("0");
  const [expression, setExpression] = useState("");
  const [programmerBases, setProgrammerBases] = useState<
    { base: number; label: string; value: string }[]
  >([]);
  const [angleMode, setAngleMode] = useState<"deg" | "rad" | "grad">("deg");
  const [memoryHasValue, setMemoryHasValue] = useState(false);
  const [inverseMode, setInverseMode] = useState(false);
  const [hyperbolicMode, setHyperbolicMode] = useState(false);

  const hapticFeedback = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const updateDisplay = useCallback(() => {
    switch (mode) {
      case "standard":
        setDisplayValue(standardEngine.display);
        setExpression(standardEngine.expression);
        setMemoryHasValue(standardEngine.hasMemory);
        break;
      case "scientific":
        setDisplayValue(scientificEngine.display);
        setExpression(scientificEngine.expression);
        setAngleMode(scientificEngine.angleModeValue);
        setInverseMode(scientificEngine.inverseMode);
        setHyperbolicMode(scientificEngine.hyperbolicMode);
        setMemoryHasValue(scientificEngine.hasMemory);
        break;
      case "programmer":
        setDisplayValue(programmerEngine.display);
        setExpression(programmerEngine.expression);
        setProgrammerBases(programmerEngine.getAllBases());
        break;
    }
  }, [mode, standardEngine, scientificEngine, programmerEngine]);

  const addToHistory = useCallback(
    (expr: string, result: string) => {
      if (!expr.trim() || !result.trim() || result === "Error") return;
      const item: HistoryItem = {
        id: Date.now().toString(),
        expression: expr,
        result,
        timestamp: new Date(),
        mode,
      };
      setHistory((prev) => [item, ...prev].slice(0, 100));
    },
    [mode],
  );

  const handleNumber = useCallback(
    (num: string) => {
      hapticFeedback();
      if (mode === "standard") standardEngine.input(num);
      else if (mode === "scientific") scientificEngine.input(num);
      else if (mode === "programmer") programmerEngine.input(num);
      updateDisplay();
    },
    [
      mode,
      standardEngine,
      scientificEngine,
      programmerEngine,
      updateDisplay,
      hapticFeedback,
    ],
  );

  const handleOperator = useCallback(
    (op: string) => {
      hapticFeedback();
      if (mode === "standard") {
        standardEngine.setOperator(op);
      } else if (mode === "scientific") {
        scientificEngine.setOperator(op);
      } else if (mode === "programmer") {
        programmerEngine.setOperator(op);
      }
      updateDisplay();
    },
    [
      mode,
      standardEngine,
      scientificEngine,
      programmerEngine,
      updateDisplay,
      hapticFeedback,
    ],
  );

  const handleEquals = useCallback(() => {
    hapticFeedback();
    let expr = "";
    let result = "";

    if (mode === "standard") {
      expr = standardEngine.expression
        ? `${standardEngine.expression} ${standardEngine.display}`
        : standardEngine.display;
      standardEngine.calculate();
      result = standardEngine.display;
    } else if (mode === "scientific") {
      expr = scientificEngine.expression
        ? `${scientificEngine.expression} ${scientificEngine.display}`
        : scientificEngine.display;
      scientificEngine.calculate();
      result = scientificEngine.display;
    } else if (mode === "programmer") {
      expr = programmerEngine.expression
        ? `${programmerEngine.expression} ${programmerEngine.display}`
        : programmerEngine.display;
      programmerEngine.calculate();
      result = programmerEngine.display;
    }

    updateDisplay();
    addToHistory(expr, result);
  }, [
    mode,
    standardEngine,
    scientificEngine,
    programmerEngine,
    updateDisplay,
    addToHistory,
    hapticFeedback,
  ]);

  const handleClear = useCallback(() => {
    hapticFeedback();
    if (mode === "standard") standardEngine.clear();
    else if (mode === "scientific") scientificEngine.clear();
    else if (mode === "programmer") programmerEngine.clear();
    updateDisplay();
  }, [
    mode,
    standardEngine,
    scientificEngine,
    programmerEngine,
    updateDisplay,
    hapticFeedback,
  ]);

  const handleClearEntry = useCallback(() => {
    hapticFeedback();
    if (mode === "standard") standardEngine.clearEntry();
    else if (mode === "scientific") scientificEngine.clearEntry();
    else if (mode === "programmer") programmerEngine.clearEntry();
    updateDisplay();
  }, [
    mode,
    standardEngine,
    scientificEngine,
    programmerEngine,
    updateDisplay,
    hapticFeedback,
  ]);

  const handleBackspace = useCallback(() => {
    hapticFeedback();
    if (mode === "standard") standardEngine.backspace();
    else if (mode === "scientific") scientificEngine.backspace();
    else if (mode === "programmer") programmerEngine.backspace();
    updateDisplay();
  }, [
    mode,
    standardEngine,
    scientificEngine,
    programmerEngine,
    updateDisplay,
    hapticFeedback,
  ]);

  const handleToggleSign = useCallback(() => {
    hapticFeedback();
    if (mode === "standard") standardEngine.toggleSign();
    else if (mode === "scientific") scientificEngine.toggleSign();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay, hapticFeedback]);

  const handlePercentage = useCallback(() => {
    hapticFeedback();
    if (mode === "standard") standardEngine.percentage();
    else if (mode === "scientific") scientificEngine.percentage();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay, hapticFeedback]);

  const handleDecimal = useCallback(() => {
    handleNumber(".");
  }, [handleNumber]);

  const handleScientific = useCallback(
    (op: string) => {
      hapticFeedback();
      const expr = scientificEngine.display;
      scientificEngine.scientificOperation(op);
      updateDisplay();
      if (
        ["π", "e", "φ", "rand", "Ï€", "Ï†"].includes(op) === false &&
        scientificEngine.display !== "Error"
      ) {
        addToHistory(`${op}(${expr})`, scientificEngine.display);
      }
    },
    [scientificEngine, updateDisplay, addToHistory, hapticFeedback],
  );

  const handleToggleAngleMode = useCallback(() => {
    scientificEngine.toggleAngleMode();
    updateDisplay();
  }, [scientificEngine, updateDisplay]);

  const handleToggleInverse = useCallback(() => {
    scientificEngine.toggleInverse();
    updateDisplay();
  }, [scientificEngine, updateDisplay]);

  const handleToggleHyperbolic = useCallback(() => {
    scientificEngine.toggleHyperbolic();
    updateDisplay();
  }, [scientificEngine, updateDisplay]);

  const handleBitwiseNot = useCallback(() => {
    hapticFeedback();
    programmerEngine.bitwiseNot();
    updateDisplay();
  }, [programmerEngine, updateDisplay, hapticFeedback]);

  const handleBaseChange = useCallback(
    (base: number) => {
      programmerEngine.setBase(base);
      updateDisplay();
    },
    [programmerEngine, updateDisplay],
  );

  const handleBitWidthChange = useCallback(
    (width: 64 | 32 | 16 | 8) => {
      programmerEngine.setBitWidth(width);
      updateDisplay();
    },
    [programmerEngine, updateDisplay],
  );

  // Memory handlers (standard + scientific)
  const handleMemoryStore = useCallback(() => {
    if (mode === "standard") standardEngine.memoryStore();
    else if (mode === "scientific") scientificEngine.memoryStore();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay]);

  const handleMemoryRecall = useCallback(() => {
    if (mode === "standard") standardEngine.memoryRecall();
    else if (mode === "scientific") scientificEngine.memoryRecall();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay]);

  const handleMemoryAdd = useCallback(() => {
    if (mode === "standard") standardEngine.memoryAdd();
    else if (mode === "scientific") scientificEngine.memoryAdd();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay]);

  const handleMemorySubtract = useCallback(() => {
    if (mode === "standard") standardEngine.memorySubtract();
    else if (mode === "scientific") scientificEngine.memorySubtract();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay]);

  const handleMemoryClear = useCallback(() => {
    if (mode === "standard") standardEngine.memoryClear();
    else if (mode === "scientific") scientificEngine.memoryClear();
    updateDisplay();
  }, [mode, standardEngine, scientificEngine, updateDisplay]);

  const handleHistorySelect = useCallback(
    (item: HistoryItem) => {
      if (mode === "standard") {
        standardEngine.clearEntry();
        // Feed the result value into display
        for (const char of item.result) standardEngine.input(char);
      }
      updateDisplay();
      setShowHistory(false);
    },
    [mode, standardEngine, updateDisplay],
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleModeChange = useCallback((newMode: string) => {
    setMode(newMode as CalculatorMode);
    setDisplayValue("0");
    setExpression("");
    setShowHistory(false);
  }, []);

  const renderKeypad = () => {
    switch (mode) {
      case "standard":
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
            onMemoryStore={handleMemoryStore}
            onMemoryRecall={handleMemoryRecall}
            onMemoryAdd={handleMemoryAdd}
            onMemorySubtract={handleMemorySubtract}
            onMemoryClear={handleMemoryClear}
            memoryHasValue={memoryHasValue}
          />
        );
      case "scientific":
        return (
          <ScientificKeypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onToggleSign={handleToggleSign}
            onPercentage={handlePercentage}
            onDecimal={handleDecimal}
            onScientific={handleScientific}
            angleMode={angleMode}
            onToggleAngleMode={handleToggleAngleMode}
            inverseMode={inverseMode}
            onToggleInverse={handleToggleInverse}
            hyperbolicMode={hyperbolicMode}
            onToggleHyperbolic={handleToggleHyperbolic}
            onMemoryStore={handleMemoryStore}
            onMemoryRecall={handleMemoryRecall}
            onMemoryAdd={handleMemoryAdd}
            onMemorySubtract={handleMemorySubtract}
            onMemoryClear={handleMemoryClear}
            memoryHasValue={memoryHasValue}
          />
        );
      case "programmer":
        return (
          <ProgrammerKeypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onBitwiseNot={handleBitwiseNot}
            currentBase={programmerEngine.currentBase}
            currentBitWidth={
              programmerEngine.currentBitWidth as 64 | 32 | 16 | 8
            }
            allBases={programmerBases}
            onBaseChange={handleBaseChange}
            onBitWidthChange={handleBitWidthChange}
          />
        );
      case "date":
        return <DateCalculator />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={18}
            color={colors.text}
          />
        </TouchableOpacity>

        <ModeSelector
          modes={CALCULATOR_MODES.map((m) => ({ id: m.id, label: m.label }))}
          activeMode={mode}
          onSelect={handleModeChange}
        />

        <TouchableOpacity
          onPress={() => setShowHistory(!showHistory)}
          style={[
            styles.iconBtn,
            {
              backgroundColor: showHistory
                ? colors.primary
                : colors.surfaceElevated,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="time-outline"
            size={18}
            color={showHistory ? "#FFF" : colors.text}
          />
        </TouchableOpacity>
      </View>

      {mode !== "date" && (
        <Display value={displayValue} expression={expression} />
      )}

      <View style={styles.keypadContainer}>{renderKeypad()}</View>

      <HistoryPanel
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
        visible={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 4,
  },
});
