import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/spacing';
import { CONVERTER_CATEGORIES } from '../../utils/constants';
import { useHaptics } from '../../hooks/useHaptics';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

interface CategoryGridProps {
  onSelect: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelect }) => {
  const { colors } = useTheme();
  const { lightImpact } = useHaptics();

  const renderItem = ({ item }: { item: typeof CONVERTER_CATEGORIES[number] }) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          backgroundColor: colors.cardBg,
        },
      ]}
      onPress={() => {
        lightImpact();
        onSelect(item.id);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={28} color={item.color} />
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={CONVERTER_CATEGORIES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  item: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
});
