import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale, scale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICONS } from '../../constants/icons';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    onBackPress,
    rightComponent,
}) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={onBackPress}
                            style={styles.backButton}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Image source={ICONS.backicon} style={styles.backIcon} resizeMode='contain' />
                        </TouchableOpacity>
                    )}
                    {title && <Text style={styles.title}>{title}</Text>}
                </View>

                <View style={styles.rightSection}>
                    {rightComponent}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    content: {
        height: moderateScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.md,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: Theme.spacing.sm,
    },
    backIcon: {
        width: Theme.spacing.lg,
        height: Theme.spacing.lg,
    },
    title: {
        fontSize: moderateScale(22),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
});

export default Header;
