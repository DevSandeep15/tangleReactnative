import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { IMAGES } from '../../../constants/images';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ICONS } from '../../../constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { googleLogin } from '../../../store/slices/authSlice';
import GoogleSigninService from '../../../services/GoogleSigninService';
import FCMService from '../../../services/FCMService';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    const handleGoogleLogin = async () => {
        try {
            const userInfo = await GoogleSigninService.signIn();
            const idToken = userInfo.data?.idToken;
            const googleEmail = userInfo.data?.user?.email;

            if (idToken) {
                const deviceToken = await FCMService.getDeviceToken();
                const deviceType = FCMService.getDeviceType();
                const payload = {
                    idToken,
                    device_token: deviceToken || 'no_token',
                    device_type: deviceType
                };

                console.log('--- Google Login UI Payload ---', payload);
                const resultAction = await dispatch(googleLogin(payload));

                if (googleLogin.fulfilled.match(resultAction)) {
                    const data = resultAction.payload.data || resultAction.payload;
                    console.log('--- Google Login UI Response ---', data);

                    // SUCCESS CASE
                    if (data.success || data.token) {
                        // ROBUST CHECK: Is this a new user who needs to set up their profile?
                        // We check for isNewUser flag, or a missing society_name (which means setup wasn't finished)
                        const needsSetup = data.isNewUser || data.newUser || !data.user?.society_name || !data.token;

                        if (needsSetup) {
                            console.log('--- Onboarding Flow Triggered ---');
                            navigation.replace('SetupProfile', { email: googleEmail || '', social_type: 'google' });
                            Toast.show({
                                type: 'info',
                                text1: 'Welcome to Tangle!',
                                text2: 'Let’s finish setting up your profile.'
                            });
                        } else {
                            // Success - user already exists
                            Toast.show({
                                type: 'success',
                                text1: 'Login Success',
                                text2: 'Welcome back to Tangle!'
                            });
                        }
                    } else {
                        // SERVER RETURNED ERROR (like the 500 you saw)
                        Toast.show({
                            type: 'error',
                            text1: 'Login Error',
                            text2: data.message || 'Server error during Google Login'
                        });
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Login Failed',
                        text2: resultAction.payload as string || 'An error occurred'
                    });
                }
            }
        } catch (error: any) {
            // Silence cancellation and in-progress (handled by service)
            const isCancelled = error.code === '12501' || error.message?.includes('cancelled');
            const isInProgress = error.code === '12502' || error.message?.includes('in progress');

            if (!isCancelled && !isInProgress) {
                console.error('--- Google Login UI Error ---', error);
                Toast.show({
                    type: 'error',
                    text1: 'Sign-in Error',
                    text2: error.message || 'Something went wrong with Google Sign-In'
                });
            }
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <Image source={IMAGES.headerimage} style={styles.headerImage} resizeMode="contain" />
            </View>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Main Content */}
                    <View style={styles.contentContainer}>
                        {/* Logo Placeholder */}
                        <View style={styles.logoContainer}>
                            <Image source={ICONS.thumb} style={styles.logo} resizeMode='contain' />
                        </View>

                        <Text style={styles.title}>Log in</Text>

                        {/* Social Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                <Image source={ICONS.apple} style={styles.socialIcon} resizeMode='contain' />
                                <Text style={styles.buttonText}>Apple</Text>
                                <View style={styles.placeholder} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.socialButton, loading && { opacity: 0.7 }]}
                                activeOpacity={0.7}
                                onPress={handleGoogleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <ActivityIndicator color={Colors.primary} size="small" />
                                    </View>
                                ) : (
                                    <>
                                        <Image source={ICONS.google} style={styles.socialIcon} resizeMode='contain' />
                                        <Text style={styles.buttonText}>Google</Text>
                                        <View style={styles.placeholder} />
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.socialButton, loading && { opacity: 0.7 }]}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('EmailLogin')}
                                disabled={loading}
                            >
                                <Image source={ICONS.mail} style={styles.socialIcon} resizeMode='contain' />
                                <Text style={styles.buttonText}>Use Email</Text>
                                <View style={styles.placeholder} />
                            </TouchableOpacity>
                        </View>

                        {/* Signup Link */}
                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.loginLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={[styles.footerContainer, { marginBottom: insets.bottom + verticalScale(8) }]}>
                        <Text style={styles.footerText}>hello@notadatingapp.co</Text>
                        <Text style={styles.footerSubText}>© You can use this :)</Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF7B8',
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: '#FFF7B8',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: verticalScale(20),
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
        height: verticalScale(90),
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        width: '100%',
        paddingHorizontal: Theme.spacing.xl,
        alignItems: 'center',
        marginTop: verticalScale(30)
    },
    logoContainer: {
        marginBottom: verticalScale(25),
        marginTop: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: scale(70),
        height: scale(70)
    },
    title: {
        fontSize: Theme.fontSize.xxl,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        marginBottom: verticalScale(20),
    },
    buttonContainer: {
        width: '100%',
        gap: verticalScale(10),
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(30),
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
    },
    buttonText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
    },
    socialIcon: {
        width: scale(20),
        height: scale(20),
        marginLeft: scale(13)
    },
    placeholder: {
        width: scale(20),
        marginRight: scale(13)
    },
    loginLinkContainer: {
        flexDirection: 'row',
        marginTop: verticalScale(30),
        alignItems: 'center',
        marginBottom: verticalScale(100),
    },
    loginText: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    loginLink: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        textDecorationLine: 'underline',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    footerText: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
    },
    footerSubText: {
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        color: Colors.textSecondary,
        marginTop: verticalScale(5),
    }
});

export default LoginScreen;
