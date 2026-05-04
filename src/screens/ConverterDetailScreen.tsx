import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../theme/typography";
import { spacing } from "../theme/spacing";
import { ConverterCard } from "../components/converter/ConverterCard";
import { conversionData } from "../converters/data/conversionData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ConverterStackParamList } from "../navigation/types";

type ConverterDetailScreenProps = NativeStackScreenProps<
  ConverterStackParamList,
  "ConverterDetail"
>;

export const ConverterDetailScreen: React.FC<ConverterDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors, isDark } = useTheme();
  const { categoryId } = route.params;
  const category = conversionData[categoryId];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: colors.text }]}>
            {category?.label || "Converter"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {category?.units.length || 0} units available
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ConverterCard categoryId={categoryId} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128,128,128,0.1)",
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    ...typography.headline,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
});
