import React, { useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../../components/commonHeader/Header';
import type { NotificationScreenProps } from '../../../navigation/types';
import { ICONS } from '../../../constants/icons';
import { IMAGES } from '../../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRandomAvatarColor } from '../../../utils/colorUtils';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getNotifications } from '../../../store/slices/notificationSlice';

// Types for handling different notification visuals
export interface NotificationItem {
    _id: string;
    type: string;
    sender_id?: {
        _id: string;
        name: string;
        emoji?: string;
    };
    message?: string;
    post_id?: {
        _id: string;
        desc?: string;
        image?: string[];
    };
    createdAt: string;
    read: boolean;
}

const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}hr`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return date.toLocaleDateString();
};

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { notifications: apiNotifications, loading } = useAppSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);


    const notifications = (apiNotifications && apiNotifications.length > 0) ? (apiNotifications as NotificationItem[]) : [];
    const sections = useMemo(() => {
        if (!notifications.length) return [];
        return [
            { title: 'New', data: notifications.filter((n: NotificationItem) => !n.read) },
            { title: 'Earlier', data: notifications.filter((n: NotificationItem) => n.read) },
        ].filter(section => section.data.length > 0);
    }, [notifications]);

    const handleNotificationPress = (item: NotificationItem) => {
        if (item.post_id?._id) {
            navigation.navigate('PostDetail', { postId: item.post_id._id });
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const isSocial = item.type === 'follow' || item.type === 'like';
        const hasLeftContent = isSocial || ['event', 'alert', 'booking'].includes(item.type);
        const postImage = item.post_id?.image?.[0];
        const hasRightContent = item.type === 'follow' || (item.type === 'like' && postImage);

        return (
            <TouchableOpacity 
                style={styles.notificationCard} 
                activeOpacity={0.7} 
                onPress={() => handleNotificationPress(item)}
            >
                <View style={styles.cardContent}>
                    {/* Left side: Avatar or Icon */}
                    {hasLeftContent && (
                        <View style={styles.leftContainer}>
                            {isSocial ? (
                                <Image
                                    source={{ uri: item.sender_id?.emoji }}
                                    style={[styles.avatar, { backgroundColor: getRandomAvatarColor(item.sender_id?.name) }]}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.typeIconContainer}>
                                    {item.type === 'event' ? (
                                        <Image source={IMAGES.calendar} style={styles.cardImageIcon} resizeMode="contain" />
                                    ) : (
                                        <Image
                                            source={item.type === 'alert' ? IMAGES.warning : IMAGES.check}
                                            style={styles.cardImageIcon}
                                            resizeMode="contain"
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Middle: Content */}
                    <View style={styles.textContainer}>
                        <Text style={styles.messageText}>
                            {isSocial ? (
                                <Text>
                                    <Text style={styles.boldText}>{item.sender_id?.name}</Text>
                                    {' '}{item.message || (item.type === 'follow' ? 'started following you.' : 'liked your post.')}
                                </Text>
                            ) : (
                                <Text>
                                    <Text style={styles.boldText}>{item.type} </Text>
                                    {item.message || ''}
                                </Text>
                            )}
                            <Text style={styles.timeText}> {timeAgo(item.createdAt)}</Text>
                        </Text>
                    </View>

                    {/* Right side: Action Area */}
                    {hasRightContent && (
                        <View style={styles.rightContainer}>
                            {item.type === 'follow' && (
                                <TouchableOpacity style={styles.followButton} activeOpacity={0.8}>
                                    <Text style={styles.followButtonText}>Follow back</Text>
                                </TouchableOpacity>
                            )}
                            {item.type === 'like' && postImage && (
                                <Image source={{ uri: postImage }} style={styles.postThumbnail} />
                            )}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="Notification" showBack onBackPress={() => navigation.goBack()} />

            <SectionList
                sections={sections as any}
                keyExtractor={(item: any, index) => item.id || item._id || index.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={() => dispatch(getNotifications())}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    listContent: {
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: Theme.spacing.xl,
    },
    sectionHeader: {
        fontSize: Theme.fontSize.lg,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        marginTop: Theme.spacing.sm,
        marginBottom: Theme.spacing.sm,
        paddingLeft: Theme.spacing.xs,
    },
    notificationCard: {
        backgroundColor: Colors.white,
        borderRadius: Theme.borderRadius.xl + 4,
        padding: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.md,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContainer: {
        marginRight: Theme.spacing.sm,
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(24),
        backgroundColor: '#F0F0F0',
    },
    typeIconContainer: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(12),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImageIcon: {
        width: moderateScale(32),
        height: moderateScale(32),
    },
    typeEmoji: {
        fontSize: moderateScale(28),
    },
    textContainer: {
        flex: 1,
        // paddingRight: Theme.spacing.,
    },
    messageText: {
        fontSize: Theme.fontSize.xs + scale(1),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        lineHeight: moderateScale(20),
    },
    boldText: {
        fontSize: Theme.fontSize.xs + scale(2),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.black,
    },
    timeText: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.regular,
        color: Colors.textSecondary,
    },
    rightContainer: {
        marginLeft: Theme.spacing.xs,
        alignItems: 'flex-end',
    },
    followButton: {
        backgroundColor: Colors.blue,
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: verticalScale(5),
        borderWidth: scale(0.5),
        borderColor: Colors.border,
        borderRadius: scale(10),
    },
    followButtonText: {
        fontSize: moderateScale(10),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.white,
    },
    postThumbnail: {
        width: moderateScale(55),
        height: moderateScale(45),
        borderRadius: Theme.borderRadius.sm,
        backgroundColor: '#F0F0F0',
    },
});

export default NotificationScreen;
