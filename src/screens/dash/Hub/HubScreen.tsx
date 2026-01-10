import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import type { HubScreenProps } from '../../../navigation/types';
import Header from '../../../components/commonHeader/Header';
import { IMAGES } from '../../../constants/images';

const { width } = Dimensions.get('window');

interface HubButtonProps {
    title: string;
    emoji: string;
    onPress?: () => void;
}

const HubButton: React.FC<HubButtonProps> = ({ title, emoji, onPress }) => (
    <TouchableOpacity style={styles.hubButton} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.hubButtonText}>{title} {emoji}</Text>
    </TouchableOpacity>
);

interface HubCardProps {
    title: string;
    description: string;
    onPress?: () => void;
    children?: React.ReactNode;
}

const HubCard: React.FC<HubCardProps> = ({ title, description, onPress, children }) => (
    <TouchableOpacity style={styles.hubCard} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.hubCardTitle}>{title}</Text>
        <Text style={styles.hubCardDescription}>{description}</Text>
        <View style={styles.cardFooter}>
            {children}
        </View>
    </TouchableOpacity>
);

const HubScreen: React.FC<HubScreenProps> = ({ navigation }) => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Tangle needs access to your location to show it on the map.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    console.log("Location permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            },
            (error) => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Hub" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Top Row Buttons */}
                <View style={styles.buttonRow}>
                    <HubButton title="Search" emoji="🔎" />
                    <HubButton title="Polls & Voting" emoji="📊" />
                </View>

                {/* Second Row Buttons */}
                <View style={styles.buttonRow}>
                    <HubButton title="Issue Reporting" emoji="🚨" />
                    <HubButton title="Maintenance" emoji="🗓️" />
                </View>

                {/* Top Grid Cards */}
                <View style={styles.cardRow}>
                    <HubCard
                        title="Interest Circles"
                        description="Find your people without awkward small talk"
                    >
                        <View style={styles.avatarOverlap}>
                            <Image source={IMAGES.dummyAvatar} style={styles.avatar} />
                            <Image source={IMAGES.dummyAvatar} style={[styles.avatar, { marginLeft: -10 }]} />
                            <Image source={IMAGES.dummyAvatar} style={[styles.avatar, { marginLeft: -10 }]} />
                        </View>
                    </HubCard>
                    <HubCard
                        title="Community Events"
                        description="Find your people without awkward small talk"
                    >
                        <View style={styles.avatarOverlap}>
                            <Image source={IMAGES.dummyAvatar} style={styles.avatar} />
                            <Image source={IMAGES.dummyAvatar} style={[styles.avatar, { marginLeft: -10 }]} />
                            <Image source={IMAGES.dummyAvatar} style={[styles.avatar, { marginLeft: -10 }]} />
                        </View>
                    </HubCard>
                </View>

                {/* Map Section */}
                <View style={styles.mapContainer}>
                    {location ? (
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            initialRegion={location}
                            showsUserLocation={true}
                        >
                            <Marker coordinate={location} />
                        </MapView>
                    ) : (
                        <View style={[styles.map, styles.mapPlaceholder]}>
                            <Text>Loading Map...</Text>
                        </View>
                    )}
                    <View style={styles.mapBadge}>
                        <Text style={styles.mapBadgeText}>From 562/11-A</Text>
                    </View>
                </View>

                {/* Bottom Grid Cards */}
                <View style={styles.cardRow}>
                    <HubCard
                        title="Local Marketplace"
                        description="Find your people without awkward small talk"
                    >
                        <View style={styles.emojiContainer}>
                            <Text style={styles.footerEmoji}>🛍️</Text>
                            <Text style={styles.footerEmoji}>🛒</Text>
                            <Text style={styles.footerEmoji}>💸</Text>
                        </View>
                    </HubCard>
                    <HubCard
                        title="Notices Board"
                        description="Find your people without awkward small talk"
                    >
                        <View style={styles.emojiContainer}>
                            <Text style={{ fontSize: moderateScale(30) }}>📢</Text>
                        </View>
                    </HubCard>
                </View>

                <View style={{ height: verticalScale(40) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        paddingHorizontal: Theme.spacing.md,
        paddingTop: Theme.spacing.sm,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.md,
    },
    hubButton: {
        backgroundColor: Colors.white,
        paddingVertical: moderateScale(12),
        width: '48%',
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.lightGray,
        ...Theme.shadow.sm,
    },
    hubButtonText: {
        fontFamily: Theme.fontFamily.medium,
        fontSize: moderateScale(14),
        color: Colors.text,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.md,
    },
    hubCard: {
        backgroundColor: Colors.white,
        padding: Theme.spacing.md,
        width: '48%',
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        ...Theme.shadow.sm,
        minHeight: moderateScale(150),
    },
    hubCardTitle: {
        fontFamily: Theme.fontFamily.bold,
        fontSize: moderateScale(16),
        color: Colors.text,
        textAlign: 'center',
        marginBottom: Theme.spacing.xs,
    },
    hubCardDescription: {
        fontFamily: Theme.fontFamily.medium,
        fontSize: moderateScale(10),
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: moderateScale(14),
    },
    cardFooter: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    avatarOverlap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Theme.spacing.sm,
    },
    avatar: {
        width: moderateScale(35),
        height: moderateScale(35),
        borderRadius: moderateScale(17.5),
        borderWidth: 2,
        borderColor: Colors.white,
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Theme.spacing.sm,
    },
    footerEmoji: {
        fontSize: moderateScale(24),
        marginHorizontal: 2,
    },
    mapContainer: {
        height: moderateScale(180),
        borderRadius: Theme.borderRadius.xl,
        overflow: 'hidden',
        marginBottom: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapPlaceholder: {
        backgroundColor: Colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapBadge: {
        position: 'absolute',
        top: moderateScale(10),
        right: moderateScale(10),
        backgroundColor: Colors.white,
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.borderRadius.sm,
        ...Theme.shadow.sm,
    },
    mapBadgeText: {
        fontFamily: Theme.fontFamily.medium,
        fontSize: moderateScale(12),
        color: Colors.textSecondary,
    }
});

export default HubScreen;
