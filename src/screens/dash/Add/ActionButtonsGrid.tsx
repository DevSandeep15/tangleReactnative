import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { ICONS } from '../../../constants/icons';

interface ActionItem {
    id: string;
    label: string;
    icon: any;
    onPress: () => void;
}

interface Props {
    onPhotoPress: () => void;
    onLocationPress: () => void;
    onTagPeoplePress: () => void;
    onEventDatePress: () => void;
}

const ActionButtonsGrid: React.FC<Props> = ({
    onPhotoPress,
    onLocationPress,
    onTagPeoplePress,
    onEventDatePress,
}) => {
    const actions: ActionItem[] = [
        { id: 'photo', label: 'Photo', icon: ICONS.gallery, onPress: onPhotoPress },
        { id: 'location', label: 'Location', icon: ICONS.location, onPress: onLocationPress },
        { id: 'tag', label: 'Tag People', icon: ICONS.tagpeople, onPress: onTagPeoplePress },
        { id: 'date', label: 'Event Date', icon: ICONS.eventDate, onPress: onEventDatePress },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Add to your post</Text>
            <View style={styles.grid}>
                {actions.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        style={styles.button}
                        onPress={item.onPress}
                    >
                        <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                        <Text style={styles.buttonText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Theme.spacing.md,
        marginBottom: Theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        marginBottom: Theme.spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Theme.spacing.sm,
    },
    button: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: verticalScale(9),
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
        ...Theme.shadow.sm,
    },
    icon: {
        width: scale(19),
        height: scale(19),
        marginRight: Theme.spacing.sm,
    },
    buttonText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
    },
});

import { scale } from 'react-native-size-matters';

export default ActionButtonsGrid;
