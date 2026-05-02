import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ProgrammerKeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onBitwiseNot: () => void;
  currentBase: number;
  allBases: { base: number; label: string; value: string }[];
  onBaseChange: (base: number) => void;
}

export const ProgrammerKeypad: React.FC<ProgrammerKeypadProps> = ({
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onBitwiseNot,
  currentBase,
  allBases,
  onBaseChange,
}) => {
  const { colors } = useTheme();

  const getValidKeys = () => {
    switch (currentBase) {
      case 2: return ['0', '1'];
      case 8: return ['0', '1', '2', '3', '4', '5', '6', '7'];
      case 10: return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      case 16: return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
      default: return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    }
  };

  const validKeys = getValidKeys();
  const isHex = currentBase === 16;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Base Display */}
        <View style={[styles.baseContainer, { backgroundColor: colors.surfaceElevated }]}>
          {allBases.map((b) => (
            <TouchableBase
              key={b.base}
              base={b}
              isActive={currentBase === b.base}
              onPress={() => onBaseChange(b.base)}
            />
          ))}
        </View>

        {/* Bitwise Operations */}
        <View style={styles.row}>
          <Button label="AND" onPress={() => onOperator('AND')} type="function" fontSize={14} />
          <Button label="OR" onPress={() => onOperator('OR')} type="function" fontSize={14} />
          <Button label="XOR" onPress={() => onOperator('XOR')} type="function" fontSize={14} />
          <Button label="NOT" onPress={onBitwiseNot} type="function" fontSize={14} />
        </View>

        <View style={styles.row}>
          <Button label="<<" onPress={() => onOperator('<<')} type="function" fontSize={16} />
          <Button label=">>" onPress={() => onOperator('>>')} type="function" fontSize={16} />
          <Button label="AC" onPress={onClear} type="danger" />
          <Button label="⌫" onPress={onBackspace} type="danger" />
        </View>

        {/* Number Pad */}
        <View style={styles.row}>
          <Button label="D" onPress={() => onNumber('D')} type="number" disabled={!isHex} />
          <Button label="E" onPress={() => onNumber('E')} type="number" disabled={!isHex} />
          <Button label="F" onPress={() => onNumber('F')} type="number" disabled={!isHex} />
          <Button label="÷" onPress={() => onOperator('÷')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button label="A" onPress={() => onNumber('A')} type="number" disabled={!isHex} />
          <Button label="B" onPress={() => onNumber('B')} type="number" disabled={!isHex} />
          <Button label="C" onPress={() => onNumber('C')} type="number" disabled={!isHex} />
          <Button label="×" onPress={() => onOperator('×')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button label="7" onPress={() => onNumber('7')} disabled={!validKeys.includes('7')} />
          <Button label="8" onPress={() => onNumber('8')} disabled={!validKeys.includes('8')} />
          <Button label="9" onPress={() => onNumber('9')} disabled={!validKeys.includes('9')} />
          <Button label="-" onPress={() => onOperator('-')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button label="4" onPress={() => onNumber('4')} />
          <Button label="5" onPress={() => onNumber('5')} />
          <Button label="6" onPress={() => onNumber('6')} />
          <Button label="+" onPress={() => onOperator('+')} type="operator" />
        </View>

        <View style={styles.row}>
          <Button label="1" onPress={() => onNumber('1')} />
          <Button label="2" onPress={() => onNumber('2')} />
          <Button label="3" onPress={() => onNumber('3')} />
          <Button label="=" onPress={onEquals} type="equals" />
        </View>

        <View style={styles.row}>
          <Button label="0" onPress={() => onNumber('0')} span={3} />
        </View>
      </View>
    </ScrollView>
  );
};

const TouchableBase: React.FC<{
  base: { base: number; label: string; value: string };
  isActive: boolean;
  onPress: () => void;
}> = ({ base, isActive, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.baseItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.baseLabel, { color: colors.textMuted }]}>
        {base.label}
      </Text>
      <Text 
        style={[
          styles.baseValue, 
          { 
            color: isActive ? colors.primary : colors.textSecondary,
            fontWeight: isActive ? '700' : '400',
          }
        ]}
        numberOfLines={1}
      >
        {base.value}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  baseContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  baseItem: {
    flex: 1,
    alignItems: 'center',
  },
  baseLabel: {
    ...typography.caption,
    marginBottom: 4,
  },
  baseValue: {
    ...typography.mono,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
