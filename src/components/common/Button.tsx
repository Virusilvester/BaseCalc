import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { useHaptics } from "../../hooks/useHaptics";

const { width } = Dimensions.get("window");

interface ButtonProps {
  label: string;
  onPress: () => void;
  type?:
    | "number"
    | "operator"
    | "function"
    | "equals"
    | "danger"
    | "memory"
    | "active";
  span?: number;
  fontSize?: number;
  disabled?: boolean;
  columns?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  type = "number",
  span = 1,
  fontSize,
  disabled = false,
  columns = 4,
}) => {
  const { colors } = useTheme();
  const { lightImpact } = useHaptics();
  const scale = useSharedValue<number>(1);

  const getColors = () => {
    switch (type) {
      case "operator":
        return { bg: colors.operatorBg, text: colors.operator };
      case "function":
        return { bg: colors.functionBg, text: colors.function };
      case "memory":
        return { bg: colors.primaryLight, text: colors.primary };
      case "active":
        return { bg: colors.primary, text: "#FFFFFF" };
      case "equals":
        return { bg: colors.equalsBg, text: colors.equals };
      case "danger":
        return { bg: colors.error + "20", text: colors.error };
      default:
        return { bg: colors.numberBg, text: colors.number };
    }
  };

  const btnColors = getColors();
  const clampedColumns = Math.max(1, Math.min(6, columns));
  const buttonSize = (width - 48) / clampedColumns;
  const buttonWidth =
    span > 1 ? buttonSize * span + (span - 1) * 8 : buttonSize;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }] as any,
    };
  });

  const handlePress = () => {
    if (disabled) return;
    lightImpact();
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        {
          width: buttonWidth,
          height: buttonSize,
          backgroundColor: btnColors.bg,
          opacity: disabled ? 0.4 : 1,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text
        style={[
          styles.label,
          {
            color: btnColors.text,
            fontSize: fontSize || (type === "number" ? 28 : 24),
          },
        ]}
      >
        {label}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: "500",
  },
});
