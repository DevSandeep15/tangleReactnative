import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/commonHeader/Header';
import { ICONS } from '../../../constants/icons';
import type { InboxScreenProps } from '../../../navigation/types';
import { IMAGES } from '../../../constants/images';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getChatList } from '../../../store/slices/chatSlice';
import { RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getRandomAvatarColor } from '../../../utils/colorUtils';

const InboxScreen: React.FC<InboxScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { chatrooms, loading } = useAppSelector(state => state.chat);
    const { user } = useAppSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            dispatch(getChatList());
        }, [dispatch])
    );

    const onRefresh = React.useCallback(() => {
        dispatch(getChatList());
    }, [dispatch]);

    const filteredMessages = useMemo(() => {
        if (!chatrooms) return [];
        return chatrooms.filter((item) => {
            const otherUser = item.users.find((u: any) => u._id !== user?._id);
            const name = otherUser?.name || 'Unknown';
            const lastMsg = item.lastMessage?.message || '';
            return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [searchQuery, chatrooms, user?._id]);

    const renderMessageItem = ({ item }: { item: any }) => {
        const otherUser = item.users.find((u: any) => u._id !== user?._id);
        const name = otherUser?.name || 'User';
        const avatar = otherUser?.emoji || IMAGES.dummyAvatar;
        const lastMessage = item.lastMessage?.message || 'No messages yet';
        const time = item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const avatarBgColor = getRandomAvatarColor(otherUser?._id);

        return (
            <TouchableOpacity
                style={styles.messageCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ChatDetail', {
                    name: name,
                    avatar: avatar,
                    roomId: item._id,
                    receiverId: otherUser?._id
                })}
            >
                <View style={styles.cardContent}>
                    {/* Avatar with Online Status */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={typeof avatar === 'string' ? { uri: avatar } : avatar}
                            style={[styles.avatar, { backgroundColor: avatarBgColor }]}
                            resizeMode='contain'
                        />
                        {/* Status indicator can be dynamic if available */}
                        {false && <View style={styles.onlineIndicator} />}
                    </View>

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <View style={styles.nameRow}>
                            <Text style={styles.userName}>{name}</Text>
                            <Text style={styles.timeText}>{time}</Text>
                        </View>
                        <View style={styles.messageRow}>
                            <Text style={styles.lastMessage} numberOfLines={1}>
                                {lastMessage}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="Messages" showBack onBackPress={() => navigation.goBack()} />

            <View style={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchWrapper}>
                        <Image source={ICONS.search} style={styles.searchIcon} resizeMode='contain' />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search conversations..."
                            placeholderTextColor={Colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Messages List */}
                <FlatList
                    data={filteredMessages}
                    keyExtractor={(item) => item._id}
                    renderItem={renderMessageItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            colors={[Colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No conversations found</Text>
                        </View>
                    }
                />
            </View>
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
    },
    searchContainer: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        marginTop: verticalScale(4),
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Theme.spacing.md,
        height: verticalScale(43),
    },
    searchIcon: {
        width: scale(17),
        height: scale(17),
        resizeMode: 'contain'
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        paddingVertical: 0,
    },
    listContent: {
        paddingHorizontal: Theme.spacing.md,
        paddingBottom: Theme.spacing.xl,
        paddingTop: Theme.spacing.sm,
    },
    messageCard: {
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
    avatarContainer: {
        position: 'relative',
        marginRight: Theme.spacing.md,
    },
    avatar: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
        backgroundColor: '#F0F0F0',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: scale(2),
        right: scale(2),
        width: scale(12),
        height: scale(12),
        borderRadius: scale(6),
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    infoSection: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(2),
    },
    userName: {
        fontSize: Theme.fontSize.sm + scale(1),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
    },
    timeText: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.regular,
        color: Colors.textSecondary,
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
        flex: 1,
        marginRight: Theme.spacing.sm,
    },
    unreadBadge: {
        backgroundColor: Colors.blue,
        width: scale(18),
        height: scale(18),
        borderRadius: scale(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        fontSize: moderateScale(10),
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.black,
    },
    emptyContainer: {
        marginTop: verticalScale(50),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
});

export default InboxScreen;
