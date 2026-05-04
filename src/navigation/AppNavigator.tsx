import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { CalculatorScreen } from "../screens/CalculatorScreen";
import { ConverterScreen } from "../screens/ConverterScreen";
import { ConverterDetailScreen } from "../screens/ConverterDetailScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import type { ConverterStackParamList } from "./types";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<ConverterStackParamList>();

const ConverterStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConverterList" component={ConverterScreen} />
      <Stack.Screen name="ConverterDetail" component={ConverterDetailScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "calculator";

            if (route.name === "Calculator") {
              iconName = focused ? "calculator" : "calculator-outline";
            } else if (route.name === "Converter") {
              iconName = focused ? "sync" : "sync-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{ tabBarLabel: "Calculator" }}
        />
        <Tab.Screen
          name="Converter"
          component={ConverterStack}
          options={{ tabBarLabel: "Converter" }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: "Settings" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
