import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "../common/Button";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

interface ProgrammerKeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onBitwiseNot: () => void;
  currentBase: number;
  currentBitWidth: 64 | 32 | 16 | 8;
  allBases: { base: number; label: string; value: string }[];
  onBaseChange: (base: number) => void;
  onBitWidthChange: (width: 64 | 32 | 16 | 8) => void;
}

const BIT_WIDTHS: Array<{ label: string; value: 64 | 32 | 16 | 8 }> = [
  { label: "64", value: 64 },
  { label: "32", value: 32 },
  { label: "16", value: 16 },
  { label: "8", value: 8 },
];

export const ProgrammerKeypad: React.FC<ProgrammerKeypadProps> = ({
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onBitwiseNot,
  currentBase,
  currentBitWidth,
  allBases,
  onBaseChange,
  onBitWidthChange,
}) => {
  const { colors } = useTheme();

  const getValidKeys = () => {
    switch (currentBase) {
      case 2:
        return ["0", "1"];
      case 8:
        return ["0", "1", "2", "3", "4", "5", "6", "7"];
      case 10:
        return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      case 16:
        return [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ];
      default:
        return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }
  };

  const validKeys = getValidKeys();
  const isHex = currentBase === 16;

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.container}>
        {/* Base Display Panel */}
        <View
          style={[
            styles.basePanel,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          {allBases.map((b) => (
            <TouchableOpacity
              key={b.base}
              style={[
                styles.baseItem,
                currentBase === b.base && [
                  styles.baseItemActive,
                  {
                    backgroundColor: colors.primary + "20",
                    borderColor: colors.primary,
                  },
                ],
              ]}
              onPress={() => onBaseChange(b.base)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.baseLabel,
                  {
                    color:
                      currentBase === b.base
                        ? colors.primary
                        : colors.textMuted,
                  },
                ]}
              >
                {b.label}
              </Text>
              <Text
                style={[
                  styles.baseValue,
                  {
                    color:
                      currentBase === b.base
                        ? colors.text
                        : colors.textSecondary,
                  },
                  currentBase === b.base && styles.baseValueActive,
                ]}
                numberOfLines={1}
              >
                {b.value || "0"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bit Width Selector */}
        <View
          style={[
            styles.bitWidthRow,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <Text style={[styles.bitWidthLabel, { color: colors.textMuted }]}>
            Bit Width:
          </Text>
          {BIT_WIDTHS.map((bw) => (
            <TouchableOpacity
              key={bw.value}
              style={[
                styles.bitWidthBtn,
                currentBitWidth === bw.value && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => onBitWidthChange(bw.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.bitWidthText,
                  {
                    color:
                      currentBitWidth === bw.value
                        ? "#FFF"
                        : colors.textSecondary,
                  },
                ]}
              >
                {bw.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bitwise Operations Row 1 */}
        <View style={styles.row}>
          <Button
            label="AND"
            onPress={() => onOperator("AND")}
            type="function"
            fontSize={12}
          />
          <Button
            label="OR"
            onPress={() => onOperator("OR")}
            type="function"
            fontSize={12}
          />
          <Button
            label="XOR"
            onPress={() => onOperator("XOR")}
            type="function"
            fontSize={12}
          />
          <Button
            label="NOT"
            onPress={onBitwiseNot}
            type="function"
            fontSize={12}
          />
        </View>

        {/* Bitwise Operations Row 2 */}
        <View style={styles.row}>
          <Button
            label="NAND"
            onPress={() => onOperator("NAND")}
            type="function"
            fontSize={11}
          />
          <Button
            label="NOR"
            onPress={() => onOperator("NOR")}
            type="function"
            fontSize={11}
          />
          <Button
            label="<<"
            onPress={() => onOperator("<<")}
            type="function"
            fontSize={14}
          />
          <Button
            label=">>"
            onPress={() => onOperator(">>")}
            type="function"
            fontSize={14}
          />
        </View>

        {/* Clear + Control */}
        <View style={styles.row}>
          <Button
            label="MOD"
            onPress={() => onOperator("MOD")}
            type="function"
            fontSize={12}
          />
          <Button
            label=">>>"
            onPress={() => onOperator(">>>")}
            type="function"
            fontSize={12}
          />
          <Button label="AC" onPress={onClear} type="danger" />
          <Button label="⌫" onPress={onBackspace} type="danger" />
        </View>

        {/* Hex Letters Row */}
        <View style={styles.row}>
          <Button
            label="A"
            onPress={() => onNumber("A")}
            type="number"
            disabled={!isHex}
          />
          <Button
            label="B"
            onPress={() => onNumber("B")}
            type="number"
            disabled={!isHex}
          />
          <Button
            label="C"
            onPress={() => onNumber("C")}
            type="number"
            disabled={!isHex}
          />
          <Button label="÷" onPress={() => onOperator("÷")} type="operator" />
        </View>

        <View style={styles.row}>
          <Button
            label="D"
            onPress={() => onNumber("D")}
            type="number"
            disabled={!isHex}
          />
          <Button
            label="E"
            onPress={() => onNumber("E")}
            type="number"
            disabled={!isHex}
          />
          <Button
            label="F"
            onPress={() => onNumber("F")}
            type="number"
            disabled={!isHex}
          />
          <Button label="×" onPress={() => onOperator("×")} type="operator" />
        </View>

        <View style={styles.row}>
          <Button
            label="7"
            onPress={() => onNumber("7")}
            disabled={!validKeys.includes("7")}
          />
          <Button
            label="8"
            onPress={() => onNumber("8")}
            disabled={!validKeys.includes("8")}
          />
          <Button
            label="9"
            onPress={() => onNumber("9")}
            disabled={!validKeys.includes("9")}
          />
          <Button label="-" onPress={() => onOperator("-")} type="operator" />
        </View>

        <View style={styles.row}>
          <Button
            label="4"
            onPress={() => onNumber("4")}
            disabled={!validKeys.includes("4")}
          />
          <Button
            label="5"
            onPress={() => onNumber("5")}
            disabled={!validKeys.includes("5")}
          />
          <Button
            label="6"
            onPress={() => onNumber("6")}
            disabled={!validKeys.includes("6")}
          />
          <Button label="+" onPress={() => onOperator("+")} type="operator" />
        </View>

        <View style={styles.row}>
          <Button label="1" onPress={() => onNumber("1")} />
          <Button
            label="2"
            onPress={() => onNumber("2")}
            disabled={!validKeys.includes("2")}
          />
          <Button
            label="3"
            onPress={() => onNumber("3")}
            disabled={!validKeys.includes("3")}
          />
          <Button label="=" onPress={onEquals} type="equals" />
        </View>

        <View style={styles.row}>
          <Button label="0" onPress={() => onNumber("0")} span={3} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  basePanel: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
  },
  baseItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    marginHorizontal: 2,
  },
  baseItemActive: {
    borderWidth: 1,
  },
  baseLabel: {
    ...typography.caption,
    fontSize: 10,
    marginBottom: 2,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  baseValue: {
    ...typography.mono,
    fontSize: 12,
  },
  baseValueActive: {
    fontWeight: "600",
  },
  bitWidthRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    gap: 4,
  },
  bitWidthLabel: {
    ...typography.caption,
    fontSize: 11,
    marginRight: 4,
  },
  bitWidthBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bitWidthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 7,
  },
});
