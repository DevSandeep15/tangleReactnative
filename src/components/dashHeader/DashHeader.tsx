import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { ICONS } from '../../constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DashHeaderProps {
    userName: string;
    userAvatar?: any;
    onNotificationPress?: () => void;
    onChatPress?: () => void;
}

const DashHeader: React.FC<DashHeaderProps> = ({
    userName,
    userAvatar,
    onNotificationPress,
    onChatPress,
}) => {
    const insets = useSafeAreaInsets();

    const renderAvatar = () => {
        if (!userAvatar) {
            return (
                <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Image source={ICONS.profileTab} style={[styles.icon, { tintColor: Colors.textSecondary }]} />
                </View>
            );
        }

        const source = typeof userAvatar === 'string' ? { uri: userAvatar } : userAvatar;

        return (
            <Image
                source={source}
                style={styles.avatar}
                resizeMode="cover"
            />
        );
    };

    return (
        <View style={[styles.container]}>
            <View style={styles.leftSection}>
                {renderAvatar()}
                <View style={styles.textContainer}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userNameText}>{userName}</Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress} activeOpacity={0.8}>
                    <Image source={ICONS.bell} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onChatPress} activeOpacity={0.8}>
                    <Image source={ICONS.message} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.md + 1,
        paddingVertical: Theme.spacing.sm,
        backgroundColor: Colors.background,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: moderateScale(18),
        height: moderateScale(18),
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(25),
        backgroundColor: Colors.lightPink, // Default background if image fails
    },
    textContainer: {
        marginLeft: Theme.spacing.sm,
    },
    welcomeText: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    userNameText: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    rightSection: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: Theme.spacing.sm,
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(22),
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        ...Theme.shadow.md,
    },

});

export default DashHeader;
