import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import type { ProfileScreenProps } from '../../../navigation/types';
import Header from '../../../components/commonHeader/Header';
import { ICONS } from '../../../constants/icons';
import { IMAGES } from '../../../constants/images';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout, getProfile } from '../../../store/slices/authSlice';

const INTERESTS = [
    { id: '1', label: 'Sports', icon: '🎾', color: Colors.skyBlue },
    { id: '2', label: 'Music', icon: '🎵', color: Colors.pink },
    { id: '3', label: 'Cooking', icon: '🍳', color: Colors.darkgreen },
    { id: '4', label: 'Reading', icon: '📚', color: Colors.skyBlue },
];

interface SettingOption {
    id: string;
    label: string;
    icon: any;
    isDestructive?: boolean;
    onPress: () => void;
}

interface StatCardProps {
    label: string;
    value: string;
    icon: any;
    backgroundColor: string;
    onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, backgroundColor, onPress }) => (
    <TouchableOpacity
        style={[styles.statCard, { backgroundColor }]}
        activeOpacity={0.7}
        onPress={onPress}
    >
        <Image source={icon} style={styles.statIcon} resizeMode="contain" />
        <Text style={styles.statNumber}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user, loading } = useAppSelector(state => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProfileData = useCallback(async () => {
        try {
            await dispatch(getProfile()).unwrap();
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchProfileData();
        setRefreshing(false);
    }, [fetchProfileData]);

    const handleLogout = () => {
        dispatch(logout());
    };

    const SETTINGS_OPTIONS: SettingOption[] = [
        {
            id: '1',
            label: 'Notifications',
            icon: ICONS.noti,
            onPress: () => console.log('Notifications pressed'),
        },
        {
            id: '2',
            label: 'Account Settings',
            icon: ICONS.setting,
            onPress: () => console.log('Account Settings pressed'),
        },
        {
            id: '3',
            label: 'Privacy & Security',
            icon: ICONS.setting,
            onPress: () => console.log('Privacy & Security pressed'),
        },
        {
            id: '4',
            label: 'Logout',
            icon: ICONS.logout,
            isDestructive: true,
            onPress: handleLogout,
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="My Profile" />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                    />
                }
            >
                {loading && !refreshing && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator color={Colors.primary} />
                    </View>
                )}
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {user?.emoji ? (
                            <Image source={{ uri: user.emoji }} style={styles.avatar} resizeMode="cover" />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: Colors.lightPink, justifyContent: 'center', alignItems: 'center' }]}>
                                <Image source={ICONS.profileTab} style={{ width: moderateScale(40), height: moderateScale(40), tintColor: Colors.textSecondary }} />
                            </View>
                        )}
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>

                    <View style={styles.infoRow}>
                        <Image source={ICONS.location} style={styles.infoIcon} resizeMode="contain" />
                        <Text style={styles.infoText}>{user?.society_name || 'Society Not Set'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Image source={ICONS.location} style={styles.infoIcon} resizeMode="contain" />
                        <Text style={styles.infoText}>Flat {user?.flat_number || 'N/A'}</Text>
                    </View>
                </View>

                {/* Stats Row - Using the common StatCard component manually three times */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="Posts"
                        value={user?.total_posts?.toString() || "0"}
                        icon={ICONS.book}
                        backgroundColor="#D1E4FF"
                        onPress={() => console.log('Posts pressed')}
                    />
                    <StatCard
                        label="Connections"
                        value={user?.total_connections?.toString() || "0"}
                        icon={ICONS.handShake}
                        backgroundColor="#FFD1D1"
                        onPress={() => console.log('Connections pressed')}
                    />
                    <StatCard
                        label="Circles"
                        value={user?.total_circles?.toString() || "0"}
                        icon={ICONS.star}
                        backgroundColor={Colors.darkgreen}
                        onPress={() => console.log('Circles pressed')}
                    />
                </View>

                {/* My Interests Area */}
                <Text style={styles.sectionTitle}>My Interests</Text>
                <View style={styles.interestsContainer}>
                    {user?.preferred_interest?.length > 0 ? (
                        user.preferred_interest.map((interest: string, index: number) => (
                            <View key={index} style={[styles.interestPill, { backgroundColor: Colors.skyBlue }]}>
                                <Text style={styles.interestText}>{interest}</Text>
                            </View>
                        ))
                    ) : (
                        INTERESTS.map((interest) => (
                            <View key={interest.id} style={[styles.interestPill, { backgroundColor: interest.color }]}>
                                <Text style={styles.interestText}>{interest.icon} {interest.label}</Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Settings Section */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.settingsGroup}>
                    {SETTINGS_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.settingItem,
                                option.isDestructive && styles.destructiveSettingItem
                            ]}
                            onPress={option.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.settingLeft}>
                                <Image
                                    source={option.icon}
                                    style={[
                                        styles.settingIconImage,
                                        option.isDestructive && styles.destructiveIcon
                                    ]}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={[
                                        styles.settingLabel,
                                        option.isDestructive && styles.destructiveLabel
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </View>
                            {!option.isDestructive && <Text style={styles.chevron}>›</Text>}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Padding */}
                <View style={{ height: verticalScale(20) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: Theme.spacing.xl,
    },
    loaderContainer: {
        paddingVertical: Theme.spacing.md,
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: Colors.white,
        borderRadius: Theme.borderRadius.xl,
        padding: Theme.spacing.md + scale(2),
        alignItems: 'center',
        marginTop: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.md,
    },
    avatarContainer: {
        marginBottom: Theme.spacing.sm,
    },
    avatar: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(50),
    },
    userName: {
        fontSize: moderateScale(20),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        marginBottom: Theme.spacing.xs,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    infoIcon: {
        width: moderateScale(14),
        height: moderateScale(14),
        marginRight: Theme.spacing.xs,
        tintColor: Colors.textSecondary,
    },
    infoText: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Theme.spacing.lg,
    },
    statCard: {
        width: '31%',
        paddingVertical: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.sm,
    },
    statIcon: {
        width: moderateScale(30),
        height: moderateScale(30),
        marginBottom: Theme.spacing.xs,
    },
    statNumber: {
        fontSize: moderateScale(18),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    statLabel: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        marginTop: Theme.spacing.xl,
        marginBottom: Theme.spacing.md,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Theme.spacing.sm,
    },
    interestPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs + scale(3),
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.sm,
    },
    interestText: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
    },
    settingsGroup: {
        gap: Theme.spacing.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.sm,
    },
    destructiveSettingItem: {
        borderColor: '#FF5252',
        marginTop: Theme.spacing.md,
        justifyContent: 'center',
        borderWidth: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIconImage: {
        width: moderateScale(22),
        height: moderateScale(22),
        marginRight: Theme.spacing.md,
    },
    destructiveIcon: {
        tintColor: '#FF5252',
        marginRight: Theme.spacing.sm,
        width: moderateScale(20),
        height: moderateScale(20),
    },
    settingLabel: {
        fontSize: moderateScale(15),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
    },
    destructiveLabel: {
        color: '#FF5252',
        fontFamily: Theme.fontFamily.semiBold,
        fontSize: moderateScale(16),
    },
    chevron: {
        fontSize: moderateScale(24),
        color: Colors.textSecondary,
    },
});

export default ProfileScreen;
