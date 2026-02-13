import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { AuthButton } from '../../../components/Button/AuthButton';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'FinishAuth'>;

const FinishAuthScreen: React.FC<Props> = ({ navigation, route }) => {
    const params = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <AuthHeader
                title='You’re all set!'
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.content}>

                <Text style={styles.contentText}>
                    That’s it! You’re ready to Tangle and meet new people in your society. Let’s get this party started! 🎉
                </Text>
                <View style={styles.buttonContainer}>
                    <AuthButton
                        title='Start Exploring'
                        onPress={() => navigation.navigate('FindBuddy', params)}
                        style={{ backgroundColor: Colors.darkgreen }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: verticalScale(10),
    },
    contentText: {
        fontSize: Theme.fontSize.xs + scale(1),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        lineHeight: moderateScale(16),
    },
    buttonContainer: {
        marginTop: '40%',
        marginHorizontal: scale(45)
    }
});

export default FinishAuthScreen;
