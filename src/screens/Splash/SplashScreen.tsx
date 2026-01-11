import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Welcome');
        }, 2500);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/spashImage.png')}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white || '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
    },
});

export default SplashScreen;
