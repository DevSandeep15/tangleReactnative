import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { AuthButton } from '../../../components/Button/AuthButton';
import { IMAGES } from '../../../constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerUser, clearError } from '../../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackParamList, 'FindBuddy'>;

// Mock Data
const buddiesData = [
    { id: '65b8f2c9c3a2d45a9b123451', name: 'Suresh Sharma', avatar: IMAGES.avatar1, bgColor: '#FFE5B4' },
    { id: '65b8f2c9c3a2d45a9b123452', name: 'Aditya Kapoor', avatar: IMAGES.avatar2, bgColor: '#E6E6FA' },
    { id: '65b8f2c9c3a2d45a9b123453', name: 'Omkar jha', avatar: IMAGES.avatar3, bgColor: '#FFE5B4' },
    { id: '65b8f2c9c3a2d45a9b123454', name: 'Ayush Singh', avatar: IMAGES.avatar4, bgColor: '#FFFACD' },
    { id: '65b8f2c9c3a2d45a9b123455', name: 'Mehak Sardana', avatar: IMAGES.avatar5, bgColor: '#FFFACD' },
    { id: '65b8f2c9c3a2d45a9b123456', name: 'Navya pratap singh', avatar: IMAGES.avatar6, bgColor: '#FFFACD' },
    { id: '65b8f2c9c3a2d45a9b123457', name: 'Diya Singh', avatar: IMAGES.avatar7, bgColor: '#FFFACD' },
];


const FindBuddyScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { loading, error: authError } = useAppSelector(state => state.auth);
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    const params = route.params;

    const handleSendRequest = (id: string) => {
        setSentRequests([...sentRequests, id]);
    };

    const handleNext = async () => {
        // Construct the payload for complete profile API
        const payload = {
            name: params.name,
            email: params.email,
            password: params.password,
            age: params.age,
            gender: params.gender,
            society_name: params.society_name,
            flat_number: params.flat_number,
            preferred_interest: params.preferred_interest,
            emoji_name: params.emoji_name,
            emoji: params.emoji,
            activity_alerts: params.activity_alerts,
            event_reminders: params.event_reminders,
            chat_notifications: params.chat_notifications,
            buddies: sentRequests.length > 0 ? sentRequests[0] : "65b8f2c9c3a2d45a9b123456" // Mock or first selected buddy
        };
        const resultAction = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(resultAction)) {
            const result = resultAction.payload;
            if (result.success || result.token) {
                Toast.show({
                    type: 'success',
                    text1: 'Welcome!',
                    text2: 'Account created successfully',
                });
                // No need to navigate manually, AppNavigator reacts to state.auth.isAuthenticated
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: result.message || 'Failed to complete profile',
                });
            }
        } else if (registerUser.rejected.match(resultAction)) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: (resultAction.payload as string) || 'Failed to complete profile',
            });
        }
    };

    const renderItem = ({ item }: { item: typeof buddiesData[0] }) => {
        const isRequestSent = sentRequests.includes(item.id);

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSendRequest(item.id)}
                style={[styles.card, isRequestSent && { opacity: 0.7 }]}
            >
                <View style={styles.cardContent}>
                    {/* Avatar */}
                    <View style={[styles.avatarContainer, { backgroundColor: item.bgColor }]}>
                        <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />
                    </View>

                    {/* Name */}
                    <Text style={styles.nameText}>{item.name}</Text>

                    {/* Send Request Button (Icon) */}
                    <View style={styles.actionIconContainer}>
                        <Image
                            source={isRequestSent ? '' : IMAGES.sendRequest}
                            style={styles.actionIcon}
                            resizeMode="contain"
                            tintColor={Colors.black}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <AuthHeader
                title="Find your buddy"
                subtitle="Here are some cool people in your society who share your interests. Tap on their profiles to say hello!"
                onBackPress={() => navigation.goBack()}
            />

            <FlatList
                data={buddiesData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => (
                    <View style={styles.footer}>
                        <AuthButton
                            title="Next"
                            onPress={handleNext}
                            style={styles.nextButton}
                            loading={loading}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(80),
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.yellow,
        alignItems: 'center',
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(20),
        marginBottom: verticalScale(10),
        height: verticalScale(55),
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatarContainer: {
        padding: scale(5),
        borderRadius: moderateScale(50),
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(22.5),
    },
    nameText: {
        flex: 1,
        fontSize: moderateScale(15),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.black,
        marginLeft: moderateScale(15),
    },
    actionIconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(10),
    },
    actionIcon: {
        width: moderateScale(25),
        height: moderateScale(25),
    },
    footer: {
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    nextButton: {
        backgroundColor: Colors.blue,
        minWidth: moderateScale(150),
        height: moderateScale(45)
    }
});

export default FindBuddyScreen;
