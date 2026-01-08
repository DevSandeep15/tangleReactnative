import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { verticalScale } from 'react-native-size-matters';

export type PostType = 'Discussion' | 'Event' | 'Vote' | 'Introduction' | 'Announcement';

interface PostTypeOption {
    label: PostType;
    emoji: string;
}

const POST_TYPES: PostTypeOption[] = [
    { label: 'Discussion', emoji: '💬' },
    { label: 'Event', emoji: '📅' },
    { label: 'Vote', emoji: '📊' },
    { label: 'Introduction', emoji: '👋' },
    { label: 'Announcement', emoji: '📢' },
];

interface Props {
    selectedType: PostType;
    onSelect: (type: PostType) => void;
}

const PostTypeSelector: React.FC<Props> = ({ selectedType, onSelect }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Post Type</Text>
            <View style={styles.grid}>
                {POST_TYPES.map((item) => (
                    <TouchableOpacity
                        key={item.label}
                        activeOpacity={0.7}
                        style={[
                            styles.chip,
                            selectedType === item.label && styles.selectedChip,
                        ]}
                        onPress={() => onSelect(item.label)}
                    >
                        <Text style={styles.chipText}>{item.label}</Text>
                        <Text style={styles.emoji}>{item.emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: verticalScale(20),
        marginBottom: Theme.spacing.lg,

    },
    sectionTitle: {
        fontSize: Theme.fontSize.sm + 1,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        marginBottom: Theme.spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Theme.spacing.sm,
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
        ...Theme.shadow.sm,
    },
    selectedChip: {
        backgroundColor: '#f7ddd9ff',
        ...Platform.select({
            ios: { ...Theme.shadow.md },
            android: {
                elevation: 4,
            } as any,
        }),
    },
    chipText: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        marginRight: Theme.spacing.xs,
    },
    emoji: {
        fontSize: Theme.fontSize.sm,
    },
});

export default PostTypeSelector;
