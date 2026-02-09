import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, StatusBar, TextInput, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../../../constants/images';
import { useAppDispatch } from '../../../store/hooks';
import { getAvatars } from '../../../store/slices/authSlice';


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


type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAvatar'>;

const CreateAvatarScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch()
    const { email, name, age, gender, password, society_name, flat_number, preferred_interest } = route.params;
    const [avatars, setAvatars] = useState<any>([])
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | number | null>('1');

    const selectedAvatar = avatars.find((a: any) => (a._id || a.id) === selectedAvatarId) || avatars[0];
    const currentAvatarImage = selectedAvatar?.image;
    const currentAvatarBg = selectedAvatar?.backgroundColor;

    useEffect(() => {
        const fetchavatar = async () => {
            const data = await dispatch(getAvatars()).unwrap()
            console.log('dfsdgfsd', data)
            // Ensure each avatar has a background color, either from API or random
            const dataWithColors = data.map((item: any) => ({
                ...item,
                backgroundColor: item.backgroundColor || item.background_color || getRandomColor()
            }));
            setAvatars(dataWithColors)
            if (dataWithColors.length > 0) {
                const firstId = dataWithColors[0]._id || dataWithColors[0].id;
                setSelectedAvatarId(firstId)
            }
        }
        fetchavatar()
    }, []);
    const handleNext = () => {
        if (!selectedAvatar) return;
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
            emoji_name: selectedAvatar.name || 'Avatar',
            emoji: selectedAvatar.emoji || '',
            emoji_url: selectedAvatar.image || '',
        });
    };

    const renderItem = ({ item }: { item: any }) => {
        const itemId = item._id || item.id;
        const isSelected = selectedAvatarId === itemId;
        return (
            <TouchableOpacity
                style={[
                    styles.gridItem,
                    isSelected && styles.gridItemSelected
                ]}
                onPress={() => setSelectedAvatarId(itemId)}
                activeOpacity={0.8}
            >

                <View style={[styles.avatarWrapper, { backgroundColor: item.backgroundColor }]}>
                    <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="cover" />
                </View>
            </TouchableOpacity>
        );
    };

    if (avatars.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
                <View style={styles.header}>
                    <AuthHeader
                        title="Time to Create Your Emoji! 🙄"
                        subtitle="Loading your vibe... 😎"
                        onBackPress={() => navigation.goBack()}
                    />
                </View>
                {/* You could add an ActivityIndicator here */}
            </SafeAreaView>
        );
    }

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
                        {currentAvatarImage && (
                            <Image source={{ uri: currentAvatarImage }} style={styles.previewImage} resizeMode="contain" />
                        )}
                    </View>
                </View>

                {/* Avatar Grid */}
                <View style={styles.gridContainer}>
                    <FlatList
                        data={avatars}
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
