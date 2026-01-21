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
import { verifySignupOtp, clearError } from '../../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const VerificationScreen: React.FC<Props> = ({ navigation, route }) => {

    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { loading, error: authError } = useAppSelector(state => state.auth);
    const [otpCode, setOtpCode] = useState('');
    const [isPinReady, setIsPinReady] = useState(false);

    const { email } = route?.params || {};

    const handleNext = async () => {
        Keyboard.dismiss();
        if (!isPinReady) {
            Toast.show({
                type: 'error',
                text1: 'Incomplete Code',
                text2: 'Please fill the code sent on your email',
            });
            return;
        }

        try {
            const result = await dispatch(verifySignupOtp({
                email: email,
                otp: otpCode,
            })).unwrap();

            console.log('--- Verify OTP Result ---', result);

            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Verified',
                    text2: 'Email verified successfully!',
                });
                navigation.replace('SetupProfile', { email });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Verification Failed',
                    text2: result.message || 'Verification failed',
                });
            }
        } catch (error: any) {
            console.log('--- Verify OTP Error ---', error);
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error || 'An unexpected error occurred',
            });
        }
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
                                loading={loading}
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
    bottom: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        marginHorizontal: scale(20)
    }
});

export default VerificationScreen;
