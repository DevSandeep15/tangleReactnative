import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Platform, DeviceEventEmitter } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { AuthButton } from '../../../components/Button/AuthButton';
import { IMAGES } from '../../../constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'FindBuddy'>;

// Mock Data
const buddiesData = [
    { id: '1', name: 'Suresh Sharma', avatar: IMAGES.avatar1, bgColor: '#FFE5B4' },
    { id: '2', name: 'Aditya Kapoor', avatar: IMAGES.avatar2, bgColor: '#E6E6FA' },
    { id: '3', name: 'Omkar jha', avatar: IMAGES.avatar3, bgColor: '#FFE5B4' },
    { id: '4', name: 'Ayush Singh', avatar: IMAGES.avatar4, bgColor: '#FFFACD' },
    { id: '5', name: 'Mehak Sardana', avatar: IMAGES.avatar5, bgColor: '#FFFACD' },
    { id: '6', name: 'Navya pratap singh', avatar: IMAGES.avatar6, bgColor: '#FFFACD' },
    { id: '7', name: 'Diya Singh', avatar: IMAGES.avatar7, bgColor: '#FFFACD' },
];


const FindBuddyScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    const handleSendRequest = (id: string) => {
        setSentRequests([...sentRequests, id]);
    };

    const handleNext = () => {
        // Emit login event to switch to MainNavigator
        DeviceEventEmitter.emit('LOGIN');
    };

    const renderItem = ({ item }: { item: typeof buddiesData[0] }) => {
        const isRequestSent = sentRequests.includes(item.id);

        return (
            <View style={[styles.card]}>
                <View style={styles.cardContent}>
                    {/* Avatar */}
                    <View style={[styles.avatarContainer, { backgroundColor: item.bgColor }]}>
                        <Image source={item.avatar} style={styles.avatar} resizeMode="cover" />
                    </View>

                    {/* Name */}
                    <Text style={styles.nameText}>{item.name}</Text>

                    {/* Send Request Button (Icon) */}
                    {!isRequestSent ? (
                        <TouchableOpacity onPress={() => handleSendRequest(item.id)} activeOpacity={0.7} style={styles.actionIconContainer}>
                            <Image source={IMAGES.sendRequest} style={styles.actionIcon} resizeMode="contain" tintColor={Colors.black} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.actionIconContainer} />
                    )}
                </View>
            </View>
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
        paddingBottom: verticalScale(80), // Space for footer
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
        tintColor: Colors.white,
    },
    footer: {
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    nextButton: {
        backgroundColor: Colors.blue,
        width: moderateScale(150),
        height: moderateScale(45)
    }
});

export default FindBuddyScreen;
