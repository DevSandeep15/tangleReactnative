import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { AuthHeader } from '../../../components/authHeader/AuthHeader';
import { AuthButton } from '../../../components/Button/AuthButton';
import Toast from 'react-native-toast-message';
import { IMAGES } from '../../../constants/images';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'Interests'>;

interface InterestItem {
    id: string;
    name: string;
    image: any;
}

const interestsData: InterestItem[] = [
    { id: '1', name: 'Arts & Dance', image: IMAGES.artImg },
    { id: '2', name: 'Food & Drinks', image: IMAGES.foodImg },
    { id: '3', name: 'Gaming', image: IMAGES.gameImg },
    { id: '4', name: 'Music', image: IMAGES.musicImg },
    { id: '5', name: 'Nature', image: IMAGES.natureImg },
    { id: '6', name: 'Football', image: IMAGES.footballImg },
    { id: '7', name: 'Gym', image: IMAGES.gymImg },
    { id: '8', name: 'Technology', image: IMAGES.techImg },
    { id: '9', name: 'Travel', image: IMAGES.travelImg },
    { id: '10', name: 'Cricket', image: IMAGES.cricketImg },
    { id: '11', name: 'Fashion', image: IMAGES.fashionImg },
    { id: '12', name: 'Tennis', image: IMAGES.tennisImg },
];

const InterestsScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { email, name, age, gender, password, society_name, flat_number } = route.params;
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (name: string) => {
        if (selectedInterests.includes(name)) {
            setSelectedInterests(selectedInterests.filter(item => item !== name));
        } else {
            setSelectedInterests([...selectedInterests, name]);
        }
    };

    const handleDone = () => {
        if (selectedInterests.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Pick a few!',
                text2: 'Select at least one interest to proceed.',
            });
            return;
        }
        console.log('Selected Interests names:', selectedInterests);

        navigation.navigate('CreateAvatar', {
            email,
            name,
            age,
            gender,
            password,
            society_name,
            flat_number,
            preferred_interest: selectedInterests,
        });
    };

    const renderItem = ({ item }: { item: InterestItem }) => {
        const isSelected = selectedInterests.includes(item.name);
        return (
            <TouchableOpacity
                style={[
                    styles.itemContainer,
                    { backgroundColor: isSelected ? Colors.skyBlue : Colors.backgroundSecondary }
                ]}
                onPress={() => toggleInterest(item.name)}
                activeOpacity={0.8}
            >
                <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.headerContainer}>
                <AuthHeader
                    title="Choose your interests"
                    subtitle="Pick a few things you love so we can match you with people who share your vibe!"
                    onBackPress={() => navigation.goBack()}
                />
            </View>
            <FlatList
                data={interestsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={[styles.footer,]}>
                        <AuthButton title="Done with this!" onPress={handleDone} style={{ backgroundColor: Colors.pink }} />
                    </View>
                }
            />
            <Text style={[styles.footerNote, { marginBottom: insets.bottom }]}>
                No judgment if you pick 'Pets' over 'Fitness' 🐶💪
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
    },
    listContent: {
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: verticalScale(20),
        paddingTop: verticalScale(10),
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
    },
    itemContainer: {
        width: '32%',
        aspectRatio: 0.77,
        borderRadius: moderateScale(15),
        padding: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: scale(30),
        height: scale(30),
        marginBottom: verticalScale(10),
    },
    itemText: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
        textAlign: 'center',
    },
    footer: {
        marginTop: verticalScale(30),
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
    },
    footerNote: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        textAlign: 'center',
        paddingTop: scale(10)
    },
});

export default InterestsScreen;
