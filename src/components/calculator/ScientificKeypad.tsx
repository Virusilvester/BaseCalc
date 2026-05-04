import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button } from "../common/Button";

interface ScientificKeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onDecimal: () => void;
  onScientific: (op: string) => void;
  angleMode: "deg" | "rad" | "grad";
  onToggleAngleMode: () => void;
  inverseMode: boolean;
  onToggleInverse: () => void;
  hyperbolicMode: boolean;
  onToggleHyperbolic: () => void;
  onMemoryStore: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryClear: () => void;
  memoryHasValue: boolean;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onToggleSign,
  onPercentage,
  onDecimal,
  onScientific,
  angleMode,
  onToggleAngleMode,
  inverseMode,
  onToggleInverse,
  hyperbolicMode,
  onToggleHyperbolic,
  onMemoryStore,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryClear,
  memoryHasValue,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <Button
            label="MC"
            onPress={onMemoryClear}
            type="memory"
            fontSize={12}
            disabled={!memoryHasValue}
            columns={5}
          />
          <Button
            label="MR"
            onPress={onMemoryRecall}
            type="memory"
            fontSize={12}
            disabled={!memoryHasValue}
            columns={5}
          />
          <Button
            label="M+"
            onPress={onMemoryAdd}
            type="memory"
            fontSize={12}
            columns={5}
          />
          <Button
            label="M-"
            onPress={onMemorySubtract}
            type="memory"
            fontSize={12}
            columns={5}
          />
          <Button
            label="MS"
            onPress={onMemoryStore}
            type="memory"
            fontSize={12}
            columns={5}
          />
        </View>

        <View style={styles.row}>
          <Button
            label={angleMode.toUpperCase()}
            onPress={onToggleAngleMode}
            type={angleMode !== "deg" ? "active" : "function"}
            fontSize={13}
            columns={5}
          />
          <Button
            label="INV"
            onPress={onToggleInverse}
            type={inverseMode ? "active" : "function"}
            fontSize={13}
            columns={5}
          />
          <Button
            label="HYP"
            onPress={onToggleHyperbolic}
            type={hyperbolicMode ? "active" : "function"}
            fontSize={13}
            columns={5}
          />
          <Button
            label="2ˣ"
            onPress={() => onScientific("2ˣ")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label="log₂"
            onPress={() => onScientific("log2")}
            type="function"
            fontSize={12}
            columns={5}
          />
        </View>

        <View style={styles.row}>
          <Button
            label={inverseMode ? "sin⁻¹" : "sin"}
            onPress={() => onScientific("sin")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label={inverseMode ? "cos⁻¹" : "cos"}
            onPress={() => onScientific("cos")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label={inverseMode ? "tan⁻¹" : "tan"}
            onPress={() => onScientific("tan")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label="π"
            onPress={() => onScientific("π")}
            type="function"
            fontSize={18}
            columns={5}
          />
          <Button
            label="e"
            onPress={() => onScientific("e")}
            type="function"
            fontSize={18}
            columns={5}
          />
        </View>

        <View style={styles.row}>
          <Button
            label={inverseMode ? "eˣ" : "ln"}
            onPress={() => onScientific(inverseMode ? "eˣ" : "ln")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label={inverseMode ? "10ˣ" : "log"}
            onPress={() => onScientific(inverseMode ? "10ˣ" : "log")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label={inverseMode ? "x²" : "√"}
            onPress={() => onScientific("√")}
            type="function"
            fontSize={16}
            columns={5}
          />
          <Button
            label="∛x"
            onPress={() => onScientific("∛")}
            type="function"
            fontSize={15}
            columns={5}
          />
          <Button
            label="xʸ"
            onPress={() => onOperator("^")}
            type="function"
            fontSize={14}
            columns={5}
          />
        </View>

        <View style={styles.row}>
          <Button
            label="x²"
            onPress={() => onScientific("x²")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label="x³"
            onPress={() => onScientific("x³")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label="1/x"
            onPress={() => onScientific("1/x")}
            type="function"
            fontSize={13}
            columns={5}
          />
          <Button
            label="x!"
            onPress={() => onScientific("x!")}
            type="function"
            fontSize={14}
            columns={5}
          />
          <Button
            label="|x|"
            onPress={() => onScientific("|x|")}
            type="function"
            fontSize={14}
            columns={5}
          />
        </View>

        <View style={styles.row}>
          <Button label="AC" onPress={onClear} type="danger" columns={5} />
          <Button
            label="⌫"
            onPress={onBackspace}
            type="function"
            columns={5}
          />
          <Button
            label="%"
            onPress={onPercentage}
            type="function"
            columns={5}
          />
          <Button
            label="±"
            onPress={onToggleSign}
            type="function"
            columns={5}
          />
          <Button
            label="÷"
            onPress={() => onOperator("÷")}
            type="operator"
            columns={5}
          />
        </View>

        <View style={styles.row}>
          <Button label="7" onPress={() => onNumber("7")} columns={4} />
          <Button label="8" onPress={() => onNumber("8")} columns={4} />
          <Button label="9" onPress={() => onNumber("9")} columns={4} />
          <Button
            label="×"
            onPress={() => onOperator("×")}
            type="operator"
            columns={4}
          />
        </View>

        <View style={styles.row}>
          <Button label="4" onPress={() => onNumber("4")} columns={4} />
          <Button label="5" onPress={() => onNumber("5")} columns={4} />
          <Button label="6" onPress={() => onNumber("6")} columns={4} />
          <Button
            label="-"
            onPress={() => onOperator("-")}
            type="operator"
            columns={4}
          />
        </View>

        <View style={styles.row}>
          <Button label="1" onPress={() => onNumber("1")} columns={4} />
          <Button label="2" onPress={() => onNumber("2")} columns={4} />
          <Button label="3" onPress={() => onNumber("3")} columns={4} />
          <Button
            label="+"
            onPress={() => onOperator("+")}
            type="operator"
            columns={4}
          />
        </View>

        <View style={styles.row}>
          <Button
            label="rand"
            onPress={() => onScientific("rand")}
            type="function"
            fontSize={12}
            columns={4}
          />
          <Button label="0" onPress={() => onNumber("0")} columns={4} />
          <Button label="." onPress={onDecimal} columns={4} />
          <Button label="=" onPress={onEquals} type="equals" columns={4} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 8,
  },
  container: {
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
});

