import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../common/Button';

interface ScientificKeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onDecimal: () => void;
  onScientific: (op: string) => void;
  angleMode: 'deg' | 'rad';
  onToggleAngleMode: () => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onToggleSign,
  onPercentage,
  onDecimal,
  onScientific,
  angleMode,
  onToggleAngleMode,
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Scientific Functions Row 1 */}
        <View style={styles.row}>
          <Button label="sin" onPress={() => onScientific('sin')} type="function" fontSize={16} />
          <Button label="cos" onPress={() => onScientific('cos')} type="function" fontSize={16} />
          <Button label="tan" onPress={() => onScientific('tan')} type="function" fontSize={16} />
          <Button label={angleMode.toUpperCase()} onPress={onToggleAngleMode} type="function" fontSize={14} />
        </View>

        {/* Scientific Functions Row 2 */}
        <View style={styles.row}>
          <Button label="ln" onPress={() => onScientific('ln')} type="function" fontSize={16} />
          <Button label="log" onPress={() => onScientific('log')} type="function" fontSize={16} />
          <Button label="1/x" onPress={() => onScientific('1/x')} type="function" fontSize={16} />
          <Button label="x²" onPress={() => onScientific('x²')} type="function" fontSize={16} />
        </View>

        {/* Scientific Functions Row 3 */}
        <View style={styles.row}>
          <Button label="√" onPress={() => onScientific('√')} type="function" fontSize={18} />
          <Button label="x³" onPress={() => onScientific('x³')} type="function" fontSize={16} />
          <Button label="xʸ" onPress={() => onOperator('^')} type="function" fontSize={16} />
          <Button label="π" onPress={() => onScientific('π')} type="function" fontSize={18} />
        </View>

        {/* Standard Row 1 */}
        <View style={styles.row}>
          <Button label="AC" onPress={onClear} type="danger" />
          <Button label="±" onPress={onToggleSign} type="function" />
          <Button label="%" onPress={onPercentage} type="function" />
          <Button label="÷" onPress={() => onOperator('÷')} type="operator" />
        </View>

        {/* Standard Row 2 */}
        <View style={styles.row}>
          <Button label="7" onPress={() => onNumber('7')} />
          <Button label="8" onPress={() => onNumber('8')} />
          <Button label="9" onPress={() => onNumber('9')} />
          <Button label="×" onPress={() => onOperator('×')} type="operator" />
        </View>

        {/* Standard Row 3 */}
        <View style={styles.row}>
          <Button label="4" onPress={() => onNumber('4')} />
          <Button label="5" onPress={() => onNumber('5')} />
          <Button label="6" onPress={() => onNumber('6')} />
          <Button label="-" onPress={() => onOperator('-')} type="operator" />
        </View>

        {/* Standard Row 4 */}
        <View style={styles.row}>
          <Button label="1" onPress={() => onNumber('1')} />
          <Button label="2" onPress={() => onNumber('2')} />
          <Button label="3" onPress={() => onNumber('3')} />
          <Button label="+" onPress={() => onOperator('+')} type="operator" />
        </View>

        {/* Standard Row 5 */}
        <View style={styles.row}>
          <Button label="0" onPress={() => onNumber('0')} span={2} />
          <Button label="." onPress={onDecimal} />
          <Button label="=" onPress={onEquals} type="equals" />
        </View>
      </View>
    </ScrollView>
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
