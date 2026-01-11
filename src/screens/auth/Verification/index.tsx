import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { OTPInput } from '../../../components/OTPInput/OTPInput';
import { AuthButton } from '../../../components/Button/AuthButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const VerificationScreen: React.FC<Props> = ({ navigation, route }) => {

    const insets = useSafeAreaInsets();
    const [otpCode, setOtpCode] = useState('');
    const [isPinReady, setIsPinReady] = useState(false);

    const { email } = route?.params;

    const handleNext = () => {
        Keyboard.dismiss();
        if (!isPinReady) {
            Toast.show({
                type: 'error',
                text1: 'Incomplete Code',
                text2: 'Please fill the code sent on your email',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        // Verify OTP logic here...
        console.log('Verifying code:', otpCode);
        Toast.show({
            type: 'success',
            text1: 'Verified',
            text2: 'Email verified successfully!',
            position: 'top',
            visibilityTime: 3000,
        });
        navigation.replace('SetupProfile');
        Keyboard.dismiss();
    };

    const handleChangeEmail = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <AuthHeader
                    title="Verify your number"
                    subtitle={
                        <Text>
                            Enter the code we've sent by text to {email}{' '}
                            <Text style={{ fontFamily: Theme.fontFamily.bold, color: Colors.text }} onPress={handleChangeEmail}>Change number</Text>
                        </Text>
                    }
                    onBackPress={() => navigation.goBack()}
                />

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Code</Text>
                            <OTPInput
                                code={otpCode}
                                setCode={setOtpCode}
                                maximumLength={6}
                                setIsPinReady={setIsPinReady}
                            />
                        </View>

                        <View style={styles.footer}>
                            <AuthButton
                                title="Next"
                                onPress={handleNext}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
            <Text style={[styles.bottom, { marginBottom: insets.bottom }]}>Didn’t get a code?{'\n'}
                Check spam or promotions if you don’t see it.</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: Theme.spacing.lg,
        marginTop: verticalScale(20),
    },
    inputContainer: {
        // marginTop: verticalScale(20),
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        marginBottom: verticalScale(5),
        marginLeft: moderateScale(5),
    },
    footer: {
        flex: 1,
        marginBottom: verticalScale(40),
        alignItems: 'center',
        marginTop: verticalScale(50)
    },
    button: {
        width: moderateScale(120),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.skyBlue
    },
    buttonText: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
    bottom: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        marginHorizontal: scale(20)
    }
});

export default VerificationScreen;
