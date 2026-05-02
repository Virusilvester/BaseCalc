import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/spacing';
import { Card } from '../common/Card';
import { ConverterEngine } from '../../converters/engine/ConverterEngine';
import { conversionData } from '../../converters/data/conversionData';
import { useHaptics } from '../../hooks/useHaptics';

interface ConverterCardProps {
  categoryId: string;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({ categoryId }) => {
  const { colors } = useTheme();
  const { lightImpact, mediumImpact } = useHaptics();
  const [engine] = useState(() => new ConverterEngine(categoryId, '', ''));
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const category = conversionData[categoryId];
  const units = category?.units || [];

  useEffect(() => {
    if (units.length > 0) {
      setFromUnit(units[0].id);
      setToUnit(units[1]?.id || units[0].id);
      engine.setCategory(categoryId);
      engine.setFromUnit(units[0].id);
      engine.setToUnit(units[1]?.id || units[0].id);
    }
  }, [categoryId]);

  useEffect(() => {
    if (fromUnit && toUnit && fromValue) {
      engine.setFromUnit(fromUnit);
      engine.setToUnit(toUnit);
      const numValue = parseFloat(fromValue);
      if (!isNaN(numValue)) {
        const result = engine.convert(numValue);
        setToValue(formatResult(result));
      }
    }
  }, [fromValue, fromUnit, toUnit]);

  const formatResult = (value: number): string => {
    if (isNaN(value)) return '0';
    if (Math.abs(value) < 0.000001 || Math.abs(value) > 1e9) {
      return value.toExponential(6);
    }
    return parseFloat(value.toPrecision(10)).toString();
  };

  const handleSwap = () => {
    mediumImpact();
    engine.swapUnits();
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const getUnitSymbol = (unitId: string) => {
    return units.find(u => u.id === unitId)?.symbol || unitId;
  };

  const getUnitLabel = (unitId: string) => {
    return units.find(u => u.id === unitId)?.label || unitId;
  };

  const UnitPicker: React.FC<{
    visible: boolean;
    selectedUnit: string;
    onSelect: (unitId: string) => void;
    onClose: () => void;
  }> = ({ visible, selectedUnit, onSelect, onClose }) => {
    if (!visible) return null;

    return (
      <View style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.pickerHeader}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>
              Select Unit
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.pickerItem,
                  selectedUnit === unit.id && { backgroundColor: colors.primaryLight }
                ]}
                onPress={() => {
                  lightImpact();
                  onSelect(unit.id);
                  onClose();
                }}
              >
                <View style={styles.pickerItemContent}>
                  <Text style={[styles.pickerItemSymbol, { color: colors.primary }]}>
                    {unit.symbol}
                  </Text>
                  <Text style={[styles.pickerItemLabel, { color: colors.text }]}>
                    {unit.label}
                  </Text>
                </View>
                {selectedUnit === unit.id && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* From Card */}
      <Card style={styles.conversionCard}>
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>From</Text>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={fromValue}
          onChangeText={setFromValue}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          selectTextOnFocus
        />
        <TouchableOpacity
          style={[styles.unitSelector, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => setShowFromPicker(true)}
        >
          <Text style={[styles.unitSymbol, { color: colors.primary }]}>
            {getUnitSymbol(fromUnit)}
          </Text>
          <Text style={[styles.unitLabel, { color: colors.textSecondary }]} numberOfLines={1}>
            {getUnitLabel(fromUnit)}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>

      {/* Swap Button */}
      <TouchableOpacity
        style={[styles.swapButton, { backgroundColor: colors.primary }]}
        onPress={handleSwap}
      >
        <Ionicons name="swap-vertical" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* To Card */}
      <Card style={styles.conversionCard}>
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>To</Text>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={toValue}
          editable={false}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity
          style={[styles.unitSelector, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => setShowToPicker(true)}
        >
          <Text style={[styles.unitSymbol, { color: colors.secondary }]}>
            {getUnitSymbol(toUnit)}
          </Text>
          <Text style={[styles.unitLabel, { color: colors.textSecondary }]} numberOfLines={1}>
            {getUnitLabel(toUnit)}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>

      {/* Quick Conversions */}
      <Card style={styles.quickCard}>
        <Text style={[styles.quickTitle, { color: colors.textMuted }]}>
          Quick Reference
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[0.5, 1, 5, 10, 50, 100].map((val) => {
            engine.setFromUnit(fromUnit);
            engine.setToUnit(toUnit);
            const result = engine.convert(val);
            return (
              <View key={val} style={[styles.quickItem, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.quickValue, { color: colors.text }]}>
                  {val} {getUnitSymbol(fromUnit)}
                </Text>
                <Text style={[styles.quickEquals, { color: colors.textMuted }]}>=</Text>
                <Text style={[styles.quickResult, { color: colors.primary }]}>
                  {formatResult(result)} {getUnitSymbol(toUnit)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </Card>

      <UnitPicker
        visible={showFromPicker}
        selectedUnit={fromUnit}
        onSelect={setFromUnit}
        onClose={() => setShowFromPicker(false)}
      />

      <UnitPicker
        visible={showToPicker}
        selectedUnit={toUnit}
        onSelect={setToUnit}
        onClose={() => setShowToPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  conversionCard: {
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    ...typography.title,
    fontSize: 36,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  unitSymbol: {
    ...typography.headline,
    minWidth: 40,
  },
  unitLabel: {
    ...typography.bodySmall,
    flex: 1,
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickCard: {
    marginTop: spacing.md,
  },
  quickTitle: {
    ...typography.caption,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quickItem: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    minWidth: 120,
    alignItems: 'center',
  },
  quickValue: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  quickEquals: {
    ...typography.caption,
    marginVertical: 2,
  },
  quickResult: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  pickerContainer: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  pickerTitle: {
    ...typography.headline,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.05)',
  },
  pickerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pickerItemSymbol: {
    ...typography.headline,
    minWidth: 50,
  },
  pickerItemLabel: {
    ...typography.body,
  },
});
