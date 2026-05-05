import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { Card } from "../common/Card";
import { DateEngine, DateResult } from "../../calculator/engine/DateEngine";
import { formatDate } from "../../utils/formatters";
import { useHaptics } from "../../hooks/useHaptics";

export const DateCalculator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { mediumImpact } = useHaptics();
  const tabBarHeight = useBottomTabBarHeight();

  const today = useMemo(() => new Date(), []);
  const nextWeek = useMemo(
    () => new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    [today],
  );

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [result, setResult] = useState<DateResult | null>(null);
  const [mode, setMode] = useState<"diff" | "add">("diff");
  const [addDays, setAddDays] = useState(30);

  const [pickerField, setPickerField] = useState<"start" | "end" | null>(null);

  const engine = useMemo(() => new DateEngine(), []);

  const openPicker = (field: "start" | "end") => {
    setPickerField(field);
  };

  const closePicker = () => {
    setPickerField(null);
  };

  const setDateForField = (field: "start" | "end", date: Date) => {
    if (field === "start") {
      setStartDate(date);
      if (mode === "add") setEndDate(date);
    } else {
      setEndDate(date);
    }
    setResult(null);
  };

  const calculateDifference = () => {
    mediumImpact();
    setResult(engine.calculateDifference(startDate, endDate));
  };

  const calculateAddDays = () => {
    mediumImpact();
    const res = engine.addDays(startDate, addDays);
    setEndDate(res);
    setResult(engine.calculateDifference(startDate, res));
  };

  const pickerValue = pickerField === "end" ? endDate : startDate;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: spacing.xl + tabBarHeight },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Mode Toggle */}
      <View
        style={[styles.modeToggle, { backgroundColor: colors.surfaceElevated }]}
      >
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "diff" && { backgroundColor: colors.primary },
          ]}
          onPress={() => {
            setMode("diff");
            setResult(null);
          }}
        >
          <Text
            style={[
              styles.modeText,
              { color: mode === "diff" ? "#FFF" : colors.textSecondary },
            ]}
          >
            Difference
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "add" && { backgroundColor: colors.primary },
          ]}
          onPress={() => {
            setMode("add");
            setEndDate(startDate);
            setResult(null);
          }}
        >
          <Text
            style={[
              styles.modeText,
              { color: mode === "add" ? "#FFF" : colors.textSecondary },
            ]}
          >
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
              {mode === "diff" ? "Start Date" : "From Date"}
            </Text>
            <TouchableOpacity
              style={[
                styles.datePickerBtn,
                { backgroundColor: colors.surfaceElevated },
              ]}
              onPress={() => openPicker("start")}
              activeOpacity={0.8}
            >
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {formatDate(startDate)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {mode === "diff" && (
          <View style={[styles.dateRow, styles.borderTop]}>
            <Ionicons name="calendar" size={20} color={colors.secondary} />
            <View style={styles.dateInfo}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
                End Date
              </Text>
              <TouchableOpacity
                style={[
                  styles.datePickerBtn,
                  { backgroundColor: colors.surfaceElevated },
                ]}
                onPress={() => openPicker("end")}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateValue, { color: colors.text }]}>
                  {formatDate(endDate)}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
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
        {mode === "add" &&
          [
          { label: '+7 days', val: 7 },
          { label: '+30 days', val: 30 },
          { label: '+90 days', val: 90 },
          { label: '+1 year', val: 365 },
          ].map((preset) => (
            <TouchableOpacity
              key={preset.val}
              style={[
                styles.presetButton,
                { backgroundColor: colors.surfaceElevated },
              ]}
              onPress={() => setAddDays(preset.val)}
              activeOpacity={0.8}
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
        onPress={mode === "diff" ? calculateDifference : calculateAddDays}
        activeOpacity={0.85}
      >
        <Text style={styles.calculateText}>
          {mode === "diff" ? "Calculate Difference" : "Calculate Date"}
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
      {!!pickerField && (
        <>
          {Platform.OS === "ios" ? (
            <Modal transparent animationType="fade" onRequestClose={closePicker}>
              <View
                style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}
              >
                <TouchableOpacity
                  style={styles.pickerBackdrop}
                  activeOpacity={1}
                  onPress={closePicker}
                />
                <View
                  style={[
                    styles.pickerSheet,
                    { backgroundColor: colors.surfaceElevated },
                  ]}
                >
                  <View style={styles.pickerHeader}>
                    <Text style={[styles.pickerTitle, { color: colors.text }]}>
                      Select date
                    </Text>
                    <TouchableOpacity
                      onPress={closePicker}
                      style={[
                        styles.pickerDone,
                        { backgroundColor: colors.primary },
                      ]}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.pickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={pickerValue}
                    mode="date"
                    display="inline"
                    themeVariant={isDark ? "dark" : "light"}
                    onChange={(_, date) => {
                      if (!date || !pickerField) return;
                      setDateForField(pickerField, date);
                    }}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={pickerValue}
              mode="date"
              display="calendar"
              onChange={(event, date) => {
                if (event.type === "dismissed") {
                  closePicker();
                  return;
                }
                if (!date || !pickerField) return;
                setDateForField(pickerField, date);
                closePicker();
              }}
            />
          )}
        </>
      )}
    </ScrollView>
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
  scroll: {
    flex: 1,
  },
  container: {
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
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  dateValue: {
    ...typography.headline,
    fontSize: 16,
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
  pickerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerSheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    paddingBottom: spacing.md,
  },
  pickerHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerTitle: {
    ...typography.title2,
  },
  pickerDone: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pickerDoneText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
