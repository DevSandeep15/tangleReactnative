import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Platform,
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { IMAGES } from '../../../constants/images';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ICONS } from '../../../constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '../../../components/TextField/TextField';
import { AuthButton } from '../../../components/Button/AuthButton';
import { login, clearError } from '../../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Toast from 'react-native-toast-message';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailLogin'>;

const EmailLoginScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { loading, error: authError } = useAppSelector(state => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please enter both email and password',
            });
            return;
        }

        const loginData = {
            email: email.trim(),
            password: password.trim(),
        };

        const resultAction = await dispatch(login(loginData));

        if (login.fulfilled.match(resultAction)) {
            const result = resultAction.payload;
            if (result.success || result.token) {
                Toast.show({
                    type: 'success',
                    text1: 'Welcome Back!',
                    text2: 'Login successful',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: result.message || 'Something went wrong',
                });
            }
        } else if (login.rejected.match(resultAction)) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: (resultAction.payload as string) || 'Something went wrong',
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
                    title="Log in with Email"
                    subtitle="Enter your credentials to continue"
                    onBackPress={() => navigation.goBack()}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.inputContainer}>
                            <TextField
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextField
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                                secureTextEntry
                            />

                            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <AuthButton
                                title="Login"
                                onPress={handleLogin}
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
        gap: verticalScale(10),
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: verticalScale(5),
    },
    forgotPasswordText: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    footer: {
        marginTop: verticalScale(40),
        alignItems: 'center',
    },
});

export default EmailLoginScreen;
