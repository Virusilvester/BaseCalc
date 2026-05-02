import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Card } from '../common/Card';
import { DateEngine, DateResult } from '../../calculator/engine/DateEngine';
import { formatDate } from '../../utils/formatters';
import { useHaptics } from '../../hooks/useHaptics';

export const DateCalculator: React.FC = () => {
  const { colors } = useTheme();
  const { mediumImpact } = useHaptics();

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [result, setResult] = useState<DateResult | null>(null);
  const [mode, setMode] = useState<'diff' | 'add'>('diff');
  const [addDays, setAddDays] = useState(30);

  const [startDateStr, setStartDateStr] = useState(formatDateInput(today));
  const [endDateStr, setEndDateStr] = useState(formatDateInput(nextWeek));

  const engine = new DateEngine();

  function formatDateInput(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseDateInput(str: string): Date | null {
    const parts = str.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1;
    const d = parseInt(parts[2]);
    const date = new Date(y, m, d);
    if (isNaN(date.getTime())) return null;
    return date;
  }

  const calculateDifference = () => {
    const s = parseDateInput(startDateStr);
    const e = parseDateInput(endDateStr);
    if (!s || !e) return;

    mediumImpact();
    setStartDate(s);
    setEndDate(e);
    const res = engine.calculateDifference(s, e);
    setResult(res);
  };

  const calculateAddDays = () => {
    const s = parseDateInput(startDateStr);
    if (!s) return;

    mediumImpact();
    setStartDate(s);
    const res = engine.addDays(s, addDays);
    setEndDate(res);
    setEndDateStr(formatDateInput(res));
    const diff = engine.calculateDifference(s, res);
    setResult(diff);
  };

  return (
    <View style={styles.container}>
      {/* Mode Toggle */}
      <View style={[styles.modeToggle, { backgroundColor: colors.surfaceElevated }]}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'diff' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setMode('diff')}
        >
          <Text style={[
            styles.modeText,
            { color: mode === 'diff' ? '#FFF' : colors.textSecondary }
          ]}>
            Difference
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'add' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setMode('add')}
        >
          <Text style={[
            styles.modeText,
            { color: mode === 'add' ? '#FFF' : colors.textSecondary }
          ]}>
            Add/Subtract
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Inputs */}
      <Card style={styles.dateCard}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <View style={styles.dateInfo}>
            <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
              {mode === 'diff' ? 'Start Date' : 'From Date'}
            </Text>
            <TextInput
              style={[styles.dateInput, { color: colors.text }]}
              value={startDateStr}
              onChangeText={setStartDateStr}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        {mode === 'diff' && (
          <View style={[styles.dateRow, styles.borderTop]}>
            <Ionicons name="calendar" size={20} color={colors.secondary} />
            <View style={styles.dateInfo}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
                End Date
              </Text>
              <TextInput
                style={[styles.dateInput, { color: colors.text }]}
                value={endDateStr}
                onChangeText={setEndDateStr}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        )}

        {mode === 'add' && (
          <View style={[styles.dateRow, styles.borderTop]}>
            <Ionicons name="add-circle-outline" size={20} color={colors.secondary} />
            <View style={styles.dateInfo}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
                Days to Add
              </Text>
              <View style={styles.daysInput}>
                <TouchableOpacity 
                  onPress={() => setAddDays(Math.max(-9999, addDays - 1))}
                  style={[styles.daysButton, { backgroundColor: colors.surfaceElevated }]}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </TouchableOpacity>
                <TextInput
                  style={[styles.daysValue, { color: colors.text }]}
                  value={String(addDays)}
                  onChangeText={(t) => {
                    const n = parseInt(t) || 0;
                    setAddDays(n);
                  }}
                  keyboardType="number-pad"
                  selectTextOnFocus
                />
                <TouchableOpacity 
                  onPress={() => setAddDays(addDays + 1)}
                  style={[styles.daysButton, { backgroundColor: colors.surfaceElevated }]}
                >
                  <Ionicons name="add" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Card>

      {/* Quick Presets */}
      <View style={styles.presetsContainer}>
        {mode === 'add' && [
          { label: '+7 days', val: 7 },
          { label: '+30 days', val: 30 },
          { label: '+90 days', val: 90 },
          { label: '+1 year', val: 365 },
        ].map((preset) => (
          <TouchableOpacity
            key={preset.val}
            style={[styles.presetButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={() => setAddDays(preset.val)}
          >
            <Text style={[styles.presetText, { color: colors.primary }]}>
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calculate Button */}
      <TouchableOpacity
        style={[styles.calculateButton, { backgroundColor: colors.primary }]}
        onPress={mode === 'diff' ? calculateDifference : calculateAddDays}
      >
        <Text style={styles.calculateText}>
          {mode === 'diff' ? 'Calculate Difference' : 'Calculate Date'}
        </Text>
      </TouchableOpacity>

      {/* Results */}
      {result && (
        <Card style={styles.resultCard}>
          <Text style={[styles.resultTitle, { color: colors.textMuted }]}>
            Result
          </Text>
          <Text style={[styles.resultMain, { color: colors.text }]}>
            {result.formatted}
          </Text>
          <View style={styles.resultGrid}>
            <ResultItem label="Total Days" value={result.days.toLocaleString()} />
            <ResultItem label="Weeks" value={result.weeks.toLocaleString()} />
            <ResultItem label="Business Days" value={result.businessDays.toLocaleString()} />
            <ResultItem label="Months" value={result.months.toLocaleString()} />
          </View>
        </Card>
      )}
    </View>
  );
};

const ResultItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.resultItem, { backgroundColor: colors.surfaceElevated }]}>
      <Text style={[styles.resultItemValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.resultItemLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  dateCard: {
    marginBottom: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.1)',
  },
  dateInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  dateLabel: {
    ...typography.caption,
    marginBottom: 4,
  },
  dateInput: {
    ...typography.headline,
    padding: 0,
    minWidth: 120,
  },
  daysInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  daysButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysValue: {
    ...typography.headline,
    minWidth: 60,
    textAlign: 'center',
    padding: 0,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  presetText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  calculateButton: {
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  calculateText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
  resultCard: {
    marginBottom: spacing.md,
  },
  resultTitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultMain: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  resultItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'center',
  },
  resultItemValue: {
    ...typography.title2,
    marginBottom: 4,
  },
  resultItemLabel: {
    ...typography.caption,
  },
});
