import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { addCommas } from '../../utils/formatters';

interface DisplayProps {
  value: string;
  expression?: string;
  secondaryValue?: string;
  secondaryLabel?: string;
}

export const Display: React.FC<DisplayProps> = ({ 
  value, 
  expression = '',
  secondaryValue,
  secondaryLabel,
}) => {
  const { colors } = useTheme();

  const getFontSize = (text: string) => {
    const len = text.length;
    if (len > 14) return 36;
    if (len > 10) return 44;
    if (len > 7) return 52;
    return 64;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {expression ? (
        <Text style={[styles.expression, { color: colors.textMuted }]}>
          {expression}
        </Text>
      ) : null}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text 
          style={[
            styles.value, 
            { 
              color: colors.displayText,
              fontSize: getFontSize(value),
            }
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {addCommas(value)}
        </Text>
      </ScrollView>

      {secondaryValue && (
        <View style={styles.secondaryContainer}>
          <Text style={[styles.secondaryLabel, { color: colors.textMuted }]}>
            {secondaryLabel}
          </Text>
          <Text style={[styles.secondaryValue, { color: colors.textSecondary }]}>
            {secondaryValue}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 140,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    alignItems: 'center',
  },
  expression: {
    ...typography.body,
    textAlign: 'right',
    marginBottom: 8,
  },
  value: {
    fontWeight: '300',
    textAlign: 'right',
    includeFontPadding: false,
  },
  secondaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  secondaryLabel: {
    ...typography.caption,
  },
  secondaryValue: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
});
