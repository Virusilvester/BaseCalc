import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withTiming,
  interpolate 
} from 'react-native-reanimated';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  mode: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  visible: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
  visible,
}) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(visible ? 0 : 300);

  React.useEffect(() => {
    translateX.value = withTiming(visible ? 0 : 300, { duration: 300 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(translateX.value, [0, 300], [1, 0]),
  }));

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={[styles.historyItem, { borderBottomColor: colors.border }]}
      onPress={() => onSelect(item)}
    >
      <Text style={[styles.expression, { color: colors.textMuted }]}>
        {item.expression}
      </Text>
      <Text style={[styles.result, { color: colors.text }]}>
        = {item.result}
      </Text>
      <Text style={[styles.timestamp, { color: colors.textMuted }]}>
        {item.timestamp.toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surface }, animatedStyle]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No calculations yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  title: {
    ...typography.headline,
  },
  clearText: {
    ...typography.bodySmall,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  historyItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  expression: {
    ...typography.bodySmall,
    marginBottom: 4,
  },
  result: {
    ...typography.headline,
    marginBottom: 2,
  },
  timestamp: {
    ...typography.caption,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
  },
});
