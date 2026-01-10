import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import type { WelcomeScreenProps } from '../../../navigation/types';
import { IMAGES } from '../../../constants/images';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const handleStart = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Hey, welcome to{"\n"}Tangle!</Text>
                    <Text style={styles.subtitle}>
                        Ready to find your squad in the society?{"\n"}
                        Let’s set up your profile real quick! 😎
                    </Text>
                </View>

                <View style={styles.avatarSection}>
                    {/* Floating Avatars with different colors and positions */}
                    <View style={[styles.avatarWrapper, styles.avatar1,]}>
                        <Image source={IMAGES.welcome2} style={styles.avatarImage} />
                    </View>

                    <View style={[styles.avatarWrapper, styles.avatar2,]}>
                        <Image source={IMAGES.welcome1} style={styles.avatarImage} />
                    </View>

                    <View style={[styles.avatarWrapper, styles.avatar3,]}>
                        <Image source={IMAGES.welcome3} style={styles.avatarImage} />
                    </View>

                    <View style={[styles.avatarWrapper, styles.avatar4,]}>
                        <Image source={IMAGES.welcome4} style={styles.avatarImage} />
                    </View>
                </View>

                <View style={styles.footerSection}>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={handleStart}
                    >
                        <Text style={styles.buttonText}>Let's Go!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: Theme.spacing.xl,
        justifyContent: 'space-between',
        paddingVertical: verticalScale(40),
    },
    headerSection: {
        marginTop: verticalScale(20),
    },
    title: {
        fontSize: Theme.spacing.xl,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        lineHeight: moderateScale(40),
        marginBottom: Theme.spacing.md,
    },
    subtitle: {
        width: '70%',
        fontSize: Theme.spacing.md,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        lineHeight: moderateScale(22),
        marginTop: scale(5)
    },
    avatarSection: {
        flex: 1,
        position: 'relative',
        marginVertical: verticalScale(20),
    },
    avatarWrapper: {
        position: 'absolute',
        borderRadius: moderateScale(100),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        opacity: 0.6,
    },
    avatarImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    avatar1: {
        width: moderateScale(110),
        height: moderateScale(110),
        top: '0%',
        right: '0%',
    },
    avatar2: {
        width: moderateScale(70),
        height: moderateScale(70),
        top: '20%',
        left: '10%',
    },
    avatar3: {
        width: moderateScale(80),
        height: moderateScale(80),
        bottom: '30%',
        right: '6%',
    },
    avatar4: {
        width: moderateScale(130),
        height: moderateScale(130),
        bottom: '2%',
        left: '0%',
    },
    footerSection: {
        position: 'absolute',
        top: '70%',
        left: '45%',
        // alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    button: {
        backgroundColor: '#BFD5CD',
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(25),
        ...Theme.shadow.sm,
    },
    buttonText: {
        fontSize: Theme.spacing.sm + scale(5),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
});

export default WelcomeScreen;
