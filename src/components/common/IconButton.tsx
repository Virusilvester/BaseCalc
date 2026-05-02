import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress: () => void;
  style?: any;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  size = 24, 
  color,
  onPress,
  style,
}) => {
  const { colors } = useTheme();
  const { lightImpact } = useHaptics();
  const scale = useSharedValue(1);

  const handlePress = () => {
    lightImpact();
    scale.value = withSpring(0.85, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={size} 
        color={color || colors.text} 
      />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 12,
  },
});
