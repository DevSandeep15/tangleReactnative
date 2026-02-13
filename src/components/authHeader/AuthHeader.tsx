import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ICONS } from '../../constants/icons';

interface AuthHeaderProps {
    title: string;
    subtitle?: string | React.ReactNode;
    onBackPress?: () => void;
    containerStyle?: ViewStyle;
    titleStyle?: TextStyle;
    subtitleStyle?: TextStyle;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
    title,
    subtitle,
    onBackPress,
    containerStyle,
    titleStyle,
    subtitleStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.header}>
                {onBackPress && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Image source={ICONS.backicon} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
                <Text style={[styles.title, titleStyle]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.subtitle, subtitleStyle]}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Theme.spacing.lg
    },
    header: {
        marginTop: verticalScale(10),
        marginBottom: verticalScale(5),
        alignItems: 'flex-start',
        minHeight: verticalScale(40),
        justifyContent: 'center'
    },
    backButton: {
        padding: moderateScale(5),
        alignSelf: 'flex-end',
    },
    backIcon: {
        width: moderateScale(28),
        height: moderateScale(28),
        tintColor: Colors.text,
    },
    titleContainer: {
        marginBottom: verticalScale(20),
    },
    title: {
        fontSize: moderateScale(30),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        lineHeight: moderateScale(40),
        marginBottom: verticalScale(10),
    },
    subtitle: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
        lineHeight: moderateScale(20),
    },
});
