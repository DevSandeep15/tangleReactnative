import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { ICONS } from '../../constants/icons';

interface RecommendedCardProps {
    name: string;
    role: string;
    image: any;
}

const RecommendedCard: React.FC<RecommendedCardProps> = ({ name, role, image }) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
            </View>
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.role} numberOfLines={1}>{role}</Text>
                <View style={styles.actionRow}>
                    <TouchableOpacity>
                        <Image source={ICONS.addFriend} style={styles.actionIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={ICONS.messageBlack} style={styles.actionIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: moderateScale(110),
        backgroundColor: Colors.white,
        borderRadius: Theme.borderRadius.lg + 2,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        marginRight: Theme.spacing.sm,
        padding: 2,
    },
    imageContainer: {
        width: '100%',
        height: moderateScale(90),
        backgroundColor: '#FFE5E5',
        borderRadius: Theme.borderRadius.lg,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    content: {
        padding: Theme.spacing.xs,
        alignItems: 'center',
    },
    name: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    role: {
        fontSize: moderateScale(10),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
        marginBottom: Theme.spacing.xs,
    },
    actionRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Theme.spacing.xs,
    },

    actionIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
    },
});

export default RecommendedCard;
