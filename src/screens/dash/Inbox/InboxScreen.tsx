import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Header from '../../../components/commonHeader/Header';
import { ICONS } from '../../../constants/icons';
import type { InboxScreenProps } from '../../../navigation/types';
import { IMAGES } from '../../../constants/images';

interface Message {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    avatar: any;
    isOnline: boolean;
    unreadCount?: number;
}

const MESSAGES_DATA: Message[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        lastMessage: 'Thanks for the plumber contact! 🙏',
        time: '10m',
        avatar: IMAGES.dummyImage,
        isOnline: true,
        unreadCount: 2,
    },
    {
        id: '2',
        name: 'Rahul Kumar',
        lastMessage: 'Are you coming to the event tomorrow?',
        time: '1h',
        avatar: IMAGES.dummyImage,
        isOnline: false,
        unreadCount: 1,
    },
    {
        id: '3',
        name: 'Anjali Verma',
        lastMessage: 'Perfect! See you at 6 PM then',
        time: '2h',
        avatar: IMAGES.dummyImage,
        isOnline: true,
    },
    {
        id: '4',
        name: 'Vikram Singh',
        lastMessage: 'The cook you recommended is excellent!',
        time: '5h',
        avatar: IMAGES.dummyImage,
        isOnline: false,
    },
    {
        id: '5',
        name: 'Neha Joshi',
        lastMessage: 'Count me in for badminton 🏸',
        time: '1d',
        avatar: IMAGES.dummyImage,
        isOnline: true,
    },
    {
        id: '6',
        name: 'Amit Patel',
        lastMessage: 'Thanks for organizing the Diwali event!',
        time: '2d',
        avatar: IMAGES.dummyImage,
        isOnline: false,
    },
    {
        id: '7',
        name: 'Amit Patel',
        lastMessage: 'Thanks for organizing the Diwali event!',
        time: '2d',
        avatar: IMAGES.dummyImage,
        isOnline: false,
    }, {
        id: '8',
        name: 'Amit Patel',
        lastMessage: 'Thanks for organizing the Diwali event!',
        time: '2d',
        avatar: IMAGES.dummyImage,
        isOnline: false,
    },
];

const InboxScreen: React.FC<InboxScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMessages = useMemo(() => {
        return MESSAGES_DATA.filter((msg) =>
            msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const renderMessageItem = ({ item }: { item: Message }) => (
        <TouchableOpacity
            style={styles.messageCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ChatDetail', {
                name: item.name,
                avatar: item.avatar
            })}
        >
            <View style={styles.cardContent}>
                {/* Avatar with Online Status */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar}
                        style={styles.avatar}
                        resizeMode='contain'
                    />
                    {item.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.nameRow}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <View style={styles.messageRow}>
                        <Text style={styles.lastMessage} numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                        {item.unreadCount && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessageItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
