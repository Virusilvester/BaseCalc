import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../common/Button';

interface StandardKeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onDecimal: () => void;
}

export const StandardKeypad: React.FC<StandardKeypadProps> = ({
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onClearEntry,
  onBackspace,
  onToggleSign,
  onPercentage,
  onDecimal,
}) => {
  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        <Button label="AC" onPress={onClear} type="danger" />
        <Button label="±" onPress={onToggleSign} type="function" />
        <Button label="%" onPress={onPercentage} type="function" />
        <Button label="÷" onPress={() => onOperator('÷')} type="operator" />
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <Button label="7" onPress={() => onNumber('7')} />
        <Button label="8" onPress={() => onNumber('8')} />
        <Button label="9" onPress={() => onNumber('9')} />
        <Button label="×" onPress={() => onOperator('×')} type="operator" />
      </View>

      {/* Row 3 */}
      <View style={styles.row}>
        <Button label="4" onPress={() => onNumber('4')} />
        <Button label="5" onPress={() => onNumber('5')} />
        <Button label="6" onPress={() => onNumber('6')} />
        <Button label="-" onPress={() => onOperator('-')} type="operator" />
      </View>

      {/* Row 4 */}
      <View style={styles.row}>
        <Button label="1" onPress={() => onNumber('1')} />
        <Button label="2" onPress={() => onNumber('2')} />
        <Button label="3" onPress={() => onNumber('3')} />
        <Button label="+" onPress={() => onOperator('+')} type="operator" />
      </View>

      {/* Row 5 */}
      <View style={styles.row}>
        <Button label="0" onPress={() => onNumber('0')} span={2} />
        <Button label="." onPress={onDecimal} />
        <Button label="=" onPress={onEquals} type="equals" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
