import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';

// ✅ Define types
type ChipProps = {
  title: string;
  onPress: () => void;
  active?: boolean;
};

const Chip = ({ title, onPress, active }: ChipProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.active]}>
    <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
  </TouchableOpacity>
);

type Category = {
  key: string;
  label: string;
};

type Props = {
  categories?: Category[];
  selected: string;
  onSelect: (key: string) => void;
};

export default function CategoryChips({ categories = [], selected, onSelect }: Props) {
  return (
    <View style={{ marginVertical: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((c) => (
          <Chip
            key={c.key}
            title={c.label}
            onPress={() => onSelect(c.key)}
            active={selected === c.key}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  text: { color: colors.text },
  active: { backgroundColor: colors.primary },
  activeText: { color: '#fffefeff' },
});
