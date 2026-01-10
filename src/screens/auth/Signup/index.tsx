import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
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
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { TextField } from '../../../components/TextField/TextField';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = () => {
        Keyboard.dismiss();
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email address.',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address.',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        // Proceed to next step
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Email validated successfully!',
            position: 'top',
            visibilityTime: 3000,
        });
        // navigation.navigate('NextStep');
        navigation.navigate('Verification', { email });
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
                    subtitle="We only use email to make sure everyone on tangle is real"
                    onBackPress={() => navigation.goBack()}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        {/* Input Section */}
                        <View style={styles.inputContainer}>
                            <TextField
                                label="Your Email"
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
                            <TouchableOpacity
                                style={[styles.button]}
                                activeOpacity={0.8}
                                onPress={handleNext}
                            >
                                <Text style={[styles.buttonText, { color: email ? Colors.white : Colors.text }]}>Next</Text>
                            </TouchableOpacity>
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
        color: Colors.text,
    },
});

export default SignupScreen;
