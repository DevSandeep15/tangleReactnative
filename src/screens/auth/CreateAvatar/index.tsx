import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, StatusBar, TextInput, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../../../constants/images';


// Mock Data - Repeating images to simulate the grid
// Define available background colors
const bgColors = [
    Colors.lightPink,
    '#FFE5B4',
    Colors.skyBlue,
    '#D0F0C0',
    Colors.darkgreen,
    '#E6E6FA',
    Colors.pink,
    '#F08080', // Light Coral
];

// Helper to assign random color
const getRandomColor = () => bgColors[Math.floor(Math.random() * bgColors.length)];

// Mock Data - Avatars with assigned random colors
const avatarsData = [
    { id: '1', image: IMAGES.avatar1, backgroundColor: getRandomColor(), name: 'Happy', emoji: '😊' },
    { id: '2', image: IMAGES.avatar2, backgroundColor: getRandomColor(), name: 'Cool', emoji: '😎' },
    { id: '3', image: IMAGES.avatar3, backgroundColor: getRandomColor(), name: 'Wink', emoji: '😉' },
    { id: '4', image: IMAGES.avatar4, backgroundColor: getRandomColor(), name: 'Love', emoji: '😍' },
    { id: '5', image: IMAGES.avatar5, backgroundColor: getRandomColor(), name: 'Excited', emoji: '🤩' },
    { id: '6', image: IMAGES.avatar6, backgroundColor: getRandomColor(), name: 'Laugh', emoji: '😂' },
    { id: '7', image: IMAGES.avatar7, backgroundColor: getRandomColor(), name: 'Calm', emoji: '😌' },
    { id: '8', image: IMAGES.avatar8, backgroundColor: getRandomColor(), name: 'Smart', emoji: '🤓' },
    { id: '9', image: IMAGES.avatar9, backgroundColor: getRandomColor(), name: 'Playful', emoji: '😜' },
    { id: '10', image: IMAGES.avatar10, backgroundColor: getRandomColor(), name: 'Friendly', emoji: '😇' },
    { id: '11', image: IMAGES.avatar11, backgroundColor: getRandomColor(), name: 'Star', emoji: '🌟' },
    { id: '12', image: IMAGES.avatar12, backgroundColor: getRandomColor(), name: 'Strong', emoji: '💪' },
];

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAvatar'>;

const CreateAvatarScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { email, name, age, gender, password, society_name, flat_number, preferred_interest } = route.params;

    const [selectedAvatarId, setSelectedAvatarId] = useState('1');

    const selectedAvatar = avatarsData.find(a => a.id === selectedAvatarId) || avatarsData[0];
    const currentAvatarImage = selectedAvatar.image;
    const currentAvatarBg = selectedAvatar.backgroundColor;

    const handleNext = () => {
        console.log('Selected Avatar:', selectedAvatar.name);

        navigation.navigate('NotificationPreference', {
            email,
            name,
            age,
            gender,
            password,
            society_name,
            flat_number,
            preferred_interest,
            emoji_name: selectedAvatar.name,
            emoji: selectedAvatar.emoji,
        });
    };

    const renderItem = ({ item }: { item: typeof avatarsData[0] }) => {
        const isSelected = selectedAvatarId === item.id;
        return (
            <TouchableOpacity
                style={[
                    styles.gridItem,
                    isSelected && styles.gridItemSelected
                ]}
                onPress={() => setSelectedAvatarId(item.id)}
                activeOpacity={0.8}
            >

                <View style={[styles.avatarWrapper, { backgroundColor: item.backgroundColor }]}>
                    <Image source={item.image} style={styles.gridImage} resizeMode="cover" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            <View style={styles.header}>
                <AuthHeader
                    title="Time to Create Your Emoji! 🙄"
                    subtitle="We get it, not everyone wants to show their real face. So, let's have some fun! Create your own emoji avatar that totally reflects your vibe. 😎"
                    onBackPress={() => navigation.goBack()}
                />
            </View>

            <View style={styles.content}>

                {/* Large Preview */}
                <View style={styles.previewContainer}>
                    <View style={[styles.previewBackground, { backgroundColor: currentAvatarBg }]}>
                        <Image source={currentAvatarImage} style={styles.previewImage} resizeMode="contain" />
                    </View>
                </View>

                {/* Avatar Grid */}
                <View style={styles.gridContainer}>
                    <FlatList
                        data={avatarsData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={4}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                </View>
            </View>

            <View style={[styles.footer, { marginBottom: Platform.OS === 'android' ? verticalScale(20) : 0 }]}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>➔</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
    },
    content: {
        flex: 1,
        paddingHorizontal: Theme.spacing.lg,
    },
    previewContainer: {
        alignItems: 'center',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(20),
    },
    previewBackground: {
        width: '100%',
        height: verticalScale(140),
        backgroundColor: '#FFE5B4',
        borderRadius: moderateScale(20),
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border
    },
    previewImage: {
        width: scale(150),
        height: scale(150),
        marginBottom: -verticalScale(10),
    },
    gridContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: moderateScale(20),
        padding: moderateScale(10),
        backgroundColor: Colors.white,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
    },
    gridItem: {
        width: '23%',
        aspectRatio: 1,
    },
    gridItemSelected: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: moderateScale(12),
    },
    avatarWrapper: {
        flex: 1,
        borderRadius: moderateScale(10),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    footer: {
        alignItems: 'flex-end',
        paddingHorizontal: Theme.spacing.lg,
        paddingBottom: verticalScale(20),
    },
    nextButton: {
        width: moderateScale(50),
        height: moderateScale(50),
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',

    },
    nextButtonText: {
        fontSize: moderateScale(24),
        color: Colors.text,
    }
});

export default CreateAvatarScreen;
