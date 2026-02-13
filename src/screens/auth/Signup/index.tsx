import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { TextField } from '../../../components/TextField/TextField';
import { AuthButton } from '../../../components/Button/AuthButton';
import { sendSignupOtp, clearError } from '../../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { loading, error: authError } = useAppSelector(state => state.auth);
    const [email, setEmail] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = async () => {
        Keyboard.dismiss();
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email address.',
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address.',
            });
            return;
        }

        const resultAction = await dispatch(sendSignupOtp(email.trim()));

        if (sendSignupOtp.fulfilled.match(resultAction)) {
            const result = resultAction.payload;
            if (result.success || result.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'OTP Sent',
                    text2: 'Verification code sent to your email',
                });
                navigation.navigate('Verification', { email: email.trim() });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result.message || 'Failed to send OTP',
                });
            }
        } else if (sendSignupOtp.rejected.match(resultAction)) {
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: (resultAction.payload as string) || 'Failed to send OTP',
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <AuthHeader
                    title="Can we get your email, please?"
                    subtitle="We use your email to keep your account secure and send important community updates."
                    onBackPress={() => navigation.goBack()}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        {/* Input Section */}
                        <View style={styles.inputContainer}>
                            <TextField
                                label="Email Id"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                returnKeyType="done"
                            />
                        </View>

                        {/* Next Button */}
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
        marginTop: verticalScale(20)
    },
    inputContainer: {
        // marginTop: verticalScale(20),
    },
    footer: {
        flex: 1,
        marginBottom: verticalScale(40),
        alignItems: 'center',
        marginTop: verticalScale(20)
    },
});

export default SignupScreen;
