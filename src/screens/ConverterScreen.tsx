import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../theme/typography";
import { spacing } from "../theme/spacing";
import { CategoryGrid } from "../components/converter/CategoryGrid";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ConverterStackParamList } from "../navigation/types";

type ConverterScreenProps = NativeStackScreenProps<
  ConverterStackParamList,
  "ConverterList"
>;

export const ConverterScreen: React.FC<ConverterScreenProps> = ({
  navigation,
}) => {
  const { colors, isDark } = useTheme();

  const handleSelect = (categoryId: string) => {
    navigation.navigate("ConverterDetail", { categoryId });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Converter</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Convert between different units
        </Text>
      </View>

      <CategoryGrid onSelect={handleSelect} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.title,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
  },
});
