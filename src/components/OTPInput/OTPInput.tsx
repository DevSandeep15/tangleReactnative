import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface OTPInputProps {
    code: string;
    setCode: (code: string) => void;
    maximumLength: number;
    setIsPinReady: (ready: boolean) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    code,
    setCode,
    maximumLength,
    setIsPinReady
}) => {
    const boxArray = new Array(maximumLength).fill(0);
    const inputRef = useRef<TextInput>(null);

    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setIsPinReady(code.length === maximumLength);
        return () => setIsPinReady(false);
    }, [code]);

    const handleOnPress = () => {
        setIsFocused(true);
        inputRef.current?.focus();
    };

    const handleOnBlur = () => {
        setIsFocused(false);
    };

    const boxDigit = (_: any, index: number) => {
        const emptyInput = '';
        const digit = code[index] || emptyInput;

        const isCurrentDigit = index === code.length;
        const isLastDigit = index === maximumLength - 1;
        const isCodeFull = code.length === maximumLength;

        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        return (
            <View
                key={index}
                style={[
                    styles.box,
                    isFocused && isDigitFocused && styles.boxFocused,
                    !!digit && styles.boxFilled
                ]}
            >
                <Text style={styles.text}>{digit}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.boxContainer} onPress={handleOnPress}>
                {boxArray.map(boxDigit)}
            </Pressable>
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={setCode}
                maxLength={maximumLength}
                keyboardType="number-pad" // or "numeric"
                returnKeyType="done"
                textContentType="oneTimeCode" // Important for iOS autofill
                onBlur={handleOnBlur}
                onFocus={() => setIsFocused(true)}
                style={styles.hiddenInput}
                autoFocus={true} // Optional: Auto focus when mounted
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: scale(10),
    },
    box: {
        width: moderateScale(45),
        height: moderateScale(55),
        borderRadius: moderateScale(45 / 2),
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },
    boxFocused: {
        borderColor: Colors.black,
        backgroundColor: Colors.backgroundSecondary,
        elevation: 2,
    },
    boxFilled: {
        borderColor: Colors.text,
    },
    text: {
        fontSize: moderateScale(20),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
});
