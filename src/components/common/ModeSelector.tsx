import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  interpolateColor,
  useSharedValue,
  withTiming 
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useHaptics } from '../../hooks/useHaptics';

interface ModeSelectorProps {
  modes: { id: string; label: string }[];
  activeMode: string;
  onSelect: (mode: string) => void;
  compact?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  modes, 
  activeMode, 
  onSelect,
  compact = false,
}) => {
  const { colors } = useTheme();
  const { lightImpact } = useHaptics();

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        { backgroundColor: colors.surface },
      ]}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          compact && styles.scrollContentCompact,
        ]}
      >
        {modes.map((mode) => (
          <ModeButton
            key={mode.id}
            mode={mode}
            isActive={activeMode === mode.id}
            onPress={() => {
              lightImpact();
              onSelect(mode.id);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const ModeButton: React.FC<{
  mode: { id: string; label: string };
  isActive: boolean;
  onPress: () => void;
}> = ({ mode, isActive, onPress }) => {
  const { colors } = useTheme();
  const progress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', colors.primary]
    ),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [colors.textSecondary, '#FFFFFF']
    ),
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <Animated.Text style={[styles.label, textAnimatedStyle]}>
          {mode.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  containerCompact: {
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  scrollContentCompact: {
    paddingHorizontal: 0,
    gap: 8,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
});
