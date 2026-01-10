import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale } from 'react-native-size-matters';

interface CategoryFiltersProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}

const categories = [
    { label: 'All', emoji: '🧭' },
    { label: 'Introduction', emoji: '👋' },
    { label: 'Vote', emoji: '📊' },
    { label: 'Discussion', emoji: '💬' },
    { label: 'Event', emoji: '📅' },
];

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ selectedCategory, onSelect }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {categories.map((cat) => (
                <TouchableOpacity
                    key={cat.label}
                    activeOpacity={0.7}
                    onPress={() => onSelect(cat.label)}
                    style={[
                        styles.chip,
                        selectedCategory === cat.label && styles.selectedChip,
                    ]}
                >
                    <Text style={styles.label}>{cat.label}</Text>
                    <Text style={styles.emoji}>{cat.emoji}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Theme.spacing.md,
    },
    contentContainer: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: moderateScale(10),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs + 2,
        borderRadius: Theme.borderRadius.lg,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: Theme.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3.57 },
        shadowRadius: 3.57,
        shadowOpacity: 0.1,
        elevation: 5,
    },
    selectedChip: {
        backgroundColor: Colors.skyBlue,
        borderColor: Colors.border,
    },
    emoji: {
        fontSize: Theme.fontSize.sm,
    },
    label: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        marginRight: Theme.spacing.xs,
    },
});

export default CategoryFilters;
