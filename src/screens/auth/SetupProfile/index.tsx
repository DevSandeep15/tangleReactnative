import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { TextField } from '../../../components/TextField/TextField';
import { AuthButton } from '../../../components/Button/AuthButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetupProfile'>;

const SetupProfileScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);

    const genderOptions = ['Men', 'Women', 'Other'];

    const toggleGenderDropdown = () => {
        setShowGenderDropdown(!showGenderDropdown);
    };

    const handleSelectGender = (selectedGender: string) => {
        setGender(selectedGender);
        setShowGenderDropdown(false);
    };

    const validate = (): string | null => {
        if (!name.trim()) {
            return 'Please enter your name';
        }

        if (!age.trim()) {
            return 'Please enter your age';
        } else if (isNaN(Number(age)) || Number(age) < 13) {
            return 'Please enter a valid age (13+)';
        }

        if (!gender.trim()) {
            return 'Please select your gender';
        }

        return null; // No errors
    };


    const handleNext = () => {
        const error = validate();
        if (!error) {
            console.log({ name, age, gender });
            // Proceed to next screen (or backend logic)
            Toast.show({
                type: 'success',
                text1: 'Profile Setup',
                text2: 'Profile details saved successfully!',
            });
            navigation.navigate('Location');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Incomplete Details',
                text2: error, // Show the specific validation error here
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={{ flex: 1 }}
            >
                <AuthHeader
                    title="Set up your profile ✍️"
                    subtitle="Let's start with the basics"
                    onBackPress={() => navigation.goBack()}
                />

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.content}>
                            <TextField
                                label="What's your name or nickname?"
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                            />

                            <TextField
                                label="How young are you"
                                placeholder="Age"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                            />

                            {/* Gender Selection */}
                            <TouchableOpacity onPress={toggleGenderDropdown} activeOpacity={0.8}>
                                <View pointerEvents="none">
                                    <TextField
                                        label="Gender"
                                        placeholder="Select your gender"
                                        value={gender}
                                        editable={false}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* Custom Dropdown / Radio Options */}
                            {showGenderDropdown && (
                                <View style={styles.dropdownContainer}>
                                    {genderOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.radioOption}
                                            onPress={() => handleSelectGender(option)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.radioCircle, gender === option && styles.radioCircleSelected]}>
                                                {gender === option && <View style={styles.radioInnerCircle} />}
                                            </View>
                                            <Text style={styles.radioLabel}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}


                            <View style={styles.footer}>
                                <AuthButton title="Next" onPress={handleNext} />
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>


            </KeyboardAvoidingView>

            <Text style={[styles.footerText, { marginBottom: insets.bottom + verticalScale(10) }]}>
                Don't worry, we won't ask for your{'\n'}blood type... yet 😜
            </Text>
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
    dropdownContainer: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(15),
        padding: moderateScale(15),
        marginTop: verticalScale(-10), // Overlap visually or adjust spacing
        marginBottom: verticalScale(15),
        ...Theme.shadow.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(10),
    },
    radioCircle: {
        height: moderateScale(20),
        width: moderateScale(20),
        borderRadius: moderateScale(10),
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(10),
    },
    radioCircleSelected: {
        borderColor: Colors.primary,
    },
    radioInnerCircle: {
        height: moderateScale(10),
        width: moderateScale(10),
        borderRadius: moderateScale(5),
        backgroundColor: Colors.primary,
    },
    radioLabel: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        marginLeft: moderateScale(10),
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
    footerText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        lineHeight: moderateScale(18),
        marginHorizontal: scale(20)
    },
});

export default SetupProfileScreen;
