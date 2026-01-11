import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    title,
    onPress,
    disabled = false,
    style,
    textStyle,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabledButton, style]}
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, disabled && styles.disabledButtonText, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: moderateScale(45),
        paddingHorizontal: moderateScale(20),
        borderRadius: moderateScale(25),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.skyBlue,
        borderWidth: 1,
        borderColor: Colors.border
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    disabledButtonText: {
        color: Colors.textSecondary,
    },
});
