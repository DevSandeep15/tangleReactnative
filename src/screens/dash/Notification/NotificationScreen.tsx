import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../../components/commonHeader/Header';
import type { NotificationScreenProps } from '../../../navigation/types';
import { ICONS } from '../../../constants/icons';
import { IMAGES } from '../../../constants/images';

// Types for handling different notification visuals
export type NotificationType = 'follow' | 'like' | 'event' | 'alert' | 'booking';

export interface NotificationItem {
    id: string;
    type: NotificationType;
    user?: {
        name: string;
        avatar: string;
    };
    postImage?: string;
    title?: string;
    description?: string;
    time: string;
    isNew: boolean;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
    // Dynamic data structure - mimics an API response
    const notifications: NotificationItem[] = [
        {
            id: '1',
            type: 'follow',
            user: {
                name: 'Ajay talwar',
                avatar: 'https://i.pravatar.cc/150?u=ajay',
            },
            time: '34m',
            isNew: true,
        },
        {
            id: '2',
            type: 'follow',
            user: {
                name: 'Nikki',
                avatar: 'https://i.pravatar.cc/150?u=nikki',
            },
            time: '1hr',
            isNew: true,
        },
        {
            id: '3',
            type: 'like',
            user: {
                name: 'Tiya',
                avatar: 'https://i.pravatar.cc/150?u=tiya',
            },
            postImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=200',
            time: '1hr',
            isNew: true,
        },
        {
            id: '4',
            type: 'event',
            title: 'Event Reminder:',
            description: 'Diwali Celebration tomorrow 6 PM',
            time: '1hr',
            isNew: true,
        },
        {
            id: '5',
            type: 'alert',
            title: 'Society Alert:',
            description: 'Water supply disruption Sunday 9 AM',
            time: '1hr',
            isNew: false,
        },
        {
            id: '6',
            type: 'like',
            user: {
                name: 'Tiya',
                avatar: 'https://i.pravatar.cc/150?u=tiya',
            },
            postImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=200',
            time: '1hr',
            isNew: false,
        },
        {
            id: '7',
            type: 'booking',
            title: 'Booking Confirmed:',
            description: 'Sunita Devi will arrive tomorrow 10 AM',
            time: '1hr',
            isNew: false,
        },
    ];

    // Prepare sections for grouped rendering
    const sections = useMemo(() => [
        { title: 'New', data: notifications.filter(n => n.isNew) },
        { title: 'Earlier', data: notifications.filter(n => !n.isNew) },
    ], [notifications]);

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const isSocial = item.type === 'follow' || item.type === 'like';
        const hasLeftContent = isSocial || ['event', 'alert', 'booking'].includes(item.type);
        const hasRightContent = item.type === 'follow' || (item.type === 'like' && item.postImage);

        return (
            <View style={styles.notificationCard}>
                <View style={styles.cardContent}>
                    {/* Left side: Avatar or Icon */}
                    {hasLeftContent && (
                        <View style={styles.leftContainer}>
                            {isSocial ? (
                                <Image source={{ uri: item.user?.avatar }} style={styles.avatar} />
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
                                    <Text style={styles.boldText}>{item.user?.name}</Text>
                                    {item.type === 'follow' ? ' started following you.' : ' liked your post.'}
                                </Text>
                            ) : (
                                <Text>
                                    <Text style={styles.boldText}>{item.title} </Text>
                                    {item.description}
                                </Text>
                            )}
                            <Text style={styles.timeText}> {item.time}</Text>
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
                            {item.type === 'like' && item.postImage && (
                                <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
                            )}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="Notification" showBack onBackPress={() => navigation.goBack()} />

            <SectionList
                sections={sections as any}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
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
