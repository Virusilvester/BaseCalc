import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { useHaptics } from "../../hooks/useHaptics";
import type { CalculatorMode } from "../../utils/constants";

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  mode: CalculatorMode;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  visible: boolean;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { lightImpact } = useHaptics();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>History</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  { backgroundColor: colors.surfaceElevated },
                ]}
                onPress={() => {
                  lightImpact();
                  onClear();
                }}
                activeOpacity={0.7}
                disabled={history.length === 0}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={history.length === 0 ? colors.textMuted : colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  { backgroundColor: colors.surfaceElevated },
                ]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {history.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="time-outline"
                size={28}
                color={colors.textMuted}
              />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No history yet
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    { backgroundColor: colors.surfaceElevated },
                  ]}
                  onPress={() => {
                    lightImpact();
                    onSelect(item);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.expr, { color: colors.textMuted }]}
                    numberOfLines={1}
                  >
                    {item.expression}
                  </Text>
                  <Text
                    style={[styles.result, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.result}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "70%",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.title2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    padding: spacing.lg,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    ...typography.body,
  },
  listContent: {
    padding: spacing.md,
    gap: 8,
  },
  item: {
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  expr: {
    ...typography.bodySmall,
  },
  result: {
    ...typography.headline,
    fontSize: 18,
    marginTop: 4,
  },
});
