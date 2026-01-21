import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ViewStyle, TextStyle, KeyboardTypeOptions, TextInputProps, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface TextFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    isPassword?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    value,
    placeholder,
    onChangeText,
    secureTextEntry,
    isPassword,
    keyboardType,
    error,
    containerStyle,
    inputStyle,
    labelStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(!secureTextEntry);
    const hasValue = value && value.length > 0;
    const isActive = isFocused || hasValue;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                </Text>
            )}
            <View style={[
                styles.inputWrapper,
                { backgroundColor: isActive ? Colors.backgroundSecondary : Colors.white, borderColor: isActive ? Colors.black : Colors.border },
                error ? styles.inputError : null
            ]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={isPassword ? !showPassword : secureTextEntry}
                    keyboardType={keyboardType}
                    style={[styles.input, inputStyle]}
                    cursorColor={Colors.primary}
                    selectionColor={Colors.primary}
                    autoCapitalize="none"
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus && props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur && props.onBlur(e);
                    }}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
                        <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(15),
    },
    label: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        marginBottom: verticalScale(2),
        marginLeft: moderateScale(4),
    },
    inputWrapper: {
        borderRadius: moderateScale(22),
        paddingHorizontal: moderateScale(15),
        height: verticalScale(40),
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        ...Theme.shadow?.sm,
    },
    inputError: {
        borderColor: 'red',
    },
    input: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        padding: 0,
        flex: 1,
    },
    eyeButton: {
        paddingHorizontal: moderateScale(5),
    },
    eyeText: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.textSecondary,
    },
    errorText: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        color: 'red',
        marginTop: verticalScale(4),
        marginLeft: moderateScale(4),
    }
});
