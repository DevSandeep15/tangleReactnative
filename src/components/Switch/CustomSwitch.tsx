import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../constants/colors';
import { moderateScale } from 'react-native-size-matters';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (newValue: boolean) => void;
    activeColor?: string;
    inactiveColor?: string;
    thumbColor?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
    value,
    onValueChange,
    activeColor = '#FFCCB6',
    inactiveColor = Colors.backgroundSecondary,
    thumbColor = Colors.white,
}) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveColor, activeColor],
    });

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => onValueChange(!value)}
            style={styles.container}
        >
            <Animated.View style={[styles.track, { backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: thumbColor,
                            transform: [{ translateX }],
                        },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    track: {
        width: moderateScale(50),
        height: moderateScale(28),
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        paddingHorizontal: moderateScale(2),
    },
    thumb: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 1.5,
    },
});
