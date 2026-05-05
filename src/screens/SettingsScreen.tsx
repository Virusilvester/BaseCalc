import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { Card } from '../components/common/Card';
import { useHaptics } from '../hooks/useHaptics';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { mediumImpact } = useHaptics();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticsEnabled, setHapticsEnabled] = React.useState(true);
  const [decimalPlaces, setDecimalPlaces] = React.useState(10);

  const SettingItem: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
    showArrow?: boolean;
  }> = ({ icon, title, subtitle, value, onToggle, onPress, showArrow }) => {
    return (
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={onPress}
        disabled={!onPress && !onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
          )}
        </View>
        {onToggle && (
          <Switch
            value={value}
            onValueChange={() => {
              mediumImpact();
              onToggle();
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFF"
          />
        )}
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
          <Card padding={0}>
            <SettingItem
              icon={isDark ? 'moon' : 'sunny'}
              title="Dark Mode"
              subtitle={isDark ? 'Currently enabled' : 'Currently disabled'}
              value={isDark}
              onToggle={toggleTheme}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PREFERENCES</Text>
          <Card padding={0}>
            <SettingItem
              icon="volume-high"
              title="Sound Effects"
              value={soundEnabled}
              onToggle={() => setSoundEnabled(!soundEnabled)}
            />
            <SettingItem
              icon="phone-portrait"
              title="Haptic Feedback"
              value={hapticsEnabled}
              onToggle={() => setHapticsEnabled(!hapticsEnabled)}
            />
            <SettingItem
              icon="options"
              title="Decimal Places"
              subtitle={`${decimalPlaces} places`}
              showArrow
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ABOUT</Text>
          <Card padding={0}>
            <SettingItem
              icon="information-circle"
              title="Version"
              subtitle="1.0.0"
            />
            <SettingItem
              icon="star"
              title="Rate App"
              showArrow
            />
            <SettingItem
              icon="share"
              title="Share App"
              showArrow
            />
          </Card>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Powerful Calculator v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.title,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '500',
  },
  settingSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.caption,
  },
});
