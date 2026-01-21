import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { TextField } from '../../../components/TextField/TextField';
import { AuthButton } from '../../../components/Button/AuthButton';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'Location'>;

const LocationScreen: React.FC<Props> = ({ navigation, route }) => {
    console.log(route.params);
    const { email, name, age, gender, password } = route.params;
    const [societyName, setSocietyName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');

    const validate = (): string | null => {
        if (!societyName.trim()) {
            return "Please enter your society's name";
        }
        if (!flatNumber.trim()) {
            return "Please enter your flat number";
        }
        return null;
    };

    const handleNext = () => {
        const error = validate();
        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Incomplete Details',
                text2: error,
            });
            return;
        }

        console.log({ societyName, flatNumber });

        navigation.navigate('Interests', {
            email,
            name,
            age,
            gender,
            password,
            society_name: societyName.trim(),
            flat_number: flatNumber.trim(),
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={{ flex: 1 }}
            >
                <AuthHeader
                    title="Where do you live 🏢"
                    subtitle="We'll only show up if there's free food involved 🍕"
                    onBackPress={() => navigation.goBack()}
                />

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.content}>
                            <TextField
                                label="Your society's name?"
                                placeholder="Society Name"
                                value={societyName}
                                onChangeText={setSocietyName}
                            />

                            <TextField
                                label="Flat Number"
                                placeholder="Don't worry, it's safe with us"
                                value={flatNumber}
                                onChangeText={setFlatNumber}
                            />

                            <View style={styles.footer}>
                                <AuthButton title="Next" onPress={handleNext} />
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: verticalScale(20),
    },
    content: {
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: verticalScale(10),
    },
    footer: {
        marginTop: verticalScale(25),
        alignItems: 'center',
    },
});

export default LocationScreen;
