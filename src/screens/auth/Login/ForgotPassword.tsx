import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { TextField } from '../../../components/TextField/TextField';
import { AuthButton } from '../../../components/Button/AuthButton';
import Toast from 'react-native-toast-message';
import { postRequest } from '../../../services/api/apiMethods';
import { URLS } from '../../../services/api/urls';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSend = async () => {
        Keyboard.dismiss();
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please enter your email',
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address',
            });
            return;
        }

        try {
            setLoading(true);
            const response = await postRequest<any>(URLS.AUTH.FORGET_PASSWORD, { email: email.trim() });

            console.log('Forgot Password Response:', response);

            if (response.success || response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'OTP Sent',
                    text2: 'Password reset OTP has been sent to your email',
                });
                navigation.navigate('ResetPassword', { email: email.trim() });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.message || 'Something went wrong',
                });
            }
        } catch (error: any) {
            console.error('Forgot Password Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || error.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
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
                    title="Forgot Password? 🔑"
                    subtitle="Enter your email address and we'll send you an OTP to reset your password."
                    onBackPress={() => navigation.goBack()}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <TextField
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.footer}>
                            <AuthButton
                                title="Send OTP"
                                onPress={handleSend}
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
        marginTop: verticalScale(20),
    },
    footer: {
        marginTop: verticalScale(40),
        alignItems: 'center',
    },
});

export default ForgotPasswordScreen;
