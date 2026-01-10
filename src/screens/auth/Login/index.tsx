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
    Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { IMAGES } from '../../../constants/images';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ICONS } from '../../../constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
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
                                <View />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                <Image source={ICONS.google} style={styles.socialIcon} resizeMode='contain' />
                                <Text style={styles.buttonText}>Google</Text>
                                <View />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} onPress={() => { /* Navigate to Email Signup flow */ }}>
                                <Image source={ICONS.mail} style={styles.socialIcon} resizeMode='contain' />
                                <Text style={styles.buttonText}>Use Email</Text>
                                <View />
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
        backgroundColor: '#FFF7B8', // This handles the status bar area on iOS
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
        marginLeft: -scale(13)
    },
    socialIcon: {
        width: scale(20),
        height: scale(20),
        marginLeft: scale(13)
    },
    loginLinkContainer: {
        flexDirection: 'row',
        marginTop: verticalScale(30),
        alignItems: 'center',
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
        // marginTop: verticalScale(70),
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