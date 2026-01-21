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

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        Keyboard.dismiss();
        if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please fill all fields',
            });
            return;
        }

        if (newPassword.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password should be at least 6 characters',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Mismatch',
                text2: 'Passwords do not match',
            });
            return;
        }

        try {
            setLoading(true);
            const response = await postRequest<any>(URLS.AUTH.RESET_PASSWORD, {
                email: email,
                otp: otp.trim(),
                password: newPassword.trim(),
            });

            console.log('Reset Password Response:', response);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Password has been reset successfully',
            });
            navigation.navigate('EmailLogin');
        } catch (error: any) {
            console.error('Reset Password Error:', error);
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
                    title="Reset Password 🔐"
                    subtitle="Enter the OTP sent to your email and your new password."
                    onBackPress={() => navigation.goBack()}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <TextField
                            label="OTP Code"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                        />
                        <TextField
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            isPassword
                            secureTextEntry
                        />
                        <TextField
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPassword
                            secureTextEntry
                        />

                        <View style={styles.footer}>
                            <AuthButton
                                title="Reset Password"
                                onPress={handleReset}
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

export default ResetPasswordScreen;
