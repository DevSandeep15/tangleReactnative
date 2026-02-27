import React, { useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    DeviceEventEmitter,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import type { HomeScreenProps } from '../../../navigation/types';
import DashHeader from '../../../components/dashHeader/DashHeader';
import RecommendedCard from './RecommendedCard';
import CategoryFilters from './CategoryFilters';
import PostCard from './PostCard';
import { moderateScale } from 'react-native-size-matters';
import { IMAGES } from '../../../constants/images';
import { getPosts } from '../../../store/slices/postSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRecommendedUsers } from '../../../store/slices/authSlice';
import { createChatroom } from '../../../store/slices/chatSlice';
import socketService from '../../../services/socketService';
import Toast from 'react-native-toast-message';

// Recommended users will be fetched from Redux state


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const { user, recommendedUsers } = useAppSelector(state => state.auth);
    const { posts, loading, } = useAppSelector(state => state.post);

    useEffect(() => {
        dispatch(getRecommendedUsers())
        dispatch(getPosts());
    }, [dispatch]);

    useEffect(() => {
        if (recommendedUsers?.length > 0) {
            console.log('--- Recommended Users at Home ---', recommendedUsers);
        }
    }, [recommendedUsers]);

    const onRefresh = useCallback(() => {
        dispatch(getPosts());
        dispatch(getRecommendedUsers());
    }, [dispatch]);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        if (selectedCategory === 'All') return posts;
        return posts.filter(post =>
            post.post_type?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }, [posts, selectedCategory]);

    const handleCommentPress = useCallback((postId: string) => {
        DeviceEventEmitter.emit('OPEN_COMMENTS', { postId });
    }, []);

    const handleCreateChatroom = useCallback(async (targetUserId: string, name: string, avatar: string) => {
        try {
            console.log('--- Creating Chatroom with UserID:', targetUserId);
            const resultAction = await dispatch(createChatroom(targetUserId));

            if (createChatroom.fulfilled.match(resultAction)) {
                // response structure is resultAction.payload
                // roomId is in resultAction.payload.data._id
                const chatData = resultAction.payload?.data;
                const roomId = chatData?._id;
                const currentUserId = user?._id;

                if (roomId && currentUserId) {
                    console.log('--- Joining Room via Socket ---', { roomId, userId: currentUserId });

                    // Emit joinRoom
                    socketService.emit('joinRoom', { roomId, userId: currentUserId });

                    // Listen for status event
                    const onStatusUpdate = (status: any) => {
                        console.log('--- Socket Status Received ---', status);
                        // Cleanup listener
                        socketService.off('status', onStatusUpdate);

                        // Navigate to ChatDetail
                        navigation.navigate('ChatDetail', {
                            name: name,
                            avatar: avatar,
                            roomId: roomId,
                            receiverId: targetUserId
                        });
                    };

                    socketService.on('status', onStatusUpdate);

                    // Add a failsafe timeout just in case socket status never comes
                    setTimeout(() => {
                        socketService.off('status', onStatusUpdate);
                    }, 5000);

                } else {
                    console.warn('--- RoomID or UserID missing ---', { roomId, currentUserId });
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed to initialize chat connection'
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: resultAction.payload as string || 'Failed to create chatroom'
                });
            }
        } catch (error) {
            console.error('--- Unexpected Error in handleCreateChatroom ---', error);
        }
    }, [dispatch, navigation, user, createChatroom]);

    const keyExtractor = useCallback((item: any) => item._id, []);

    const renderHeader = useCallback(() => (
        <View>
            {/* <View style={styles.sectionHeader}>
                <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommended 👥</Text>
                </View>
            </View>

            <FlatList
                data={recommendedUsers}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <RecommendedCard
                        name={item.name}
                        role={item.preferred_interest?.join(', ') || 'Community Member'}
                        image={item.emoji || IMAGES.dummyAvatar}
                        onChatPress={() => handleCreateChatroom(item._id, item.name, item.emoji || IMAGES.dummyAvatar)}
                        onPress={() => navigation.navigate('Profile', { userId: item._id })}
                    />
                )}
                contentContainerStyle={styles.recommendedList}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={3}
            /> */}

            <CategoryFilters
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />
        </View>
    ), [selectedCategory]);

    const renderEmpty = useCallback(() => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts found</Text>
            </View>
        );
    }, [loading]);

    const renderPost = useCallback(({ item }: { item: any }) => (
        <PostCard
            postId={item._id}
            authorName={item.user?.name || 'User'}
            authorId={item.user?._id}
            authorAvatar={item.user?.emoji || 'https://i.pravatar.cc/150?u=' + item.user?._id}
            timeAgo={new Date(item.createdAt).toLocaleDateString()}
            tag={item.post_type?.charAt(0).toUpperCase() + item.post_type?.slice(1)}
            content={item.desc}
            hashtags={item.tags || []}
            postImages={item.image}
            views={item.views || 0}
            likes={item.total_likes || 0}
            comments={item.total_comments || 0}
            initialIsLiked={item.is_liked}
            onCommentPress={() => handleCommentPress(item._id)}
            onProfilePress={() => navigation.navigate('Profile', { userId: item.user?._id })}
        />
    ), [handleCommentPress, navigation, user]);

    const listFooter = useMemo(() => <View style={{ height: moderateScale(20) }} />, []);

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <DashHeader
                userName={user?.name || "User"}
                userAvatar={user?.emoji}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onChatPress={() => navigation.navigate('Inbox')}
            />

            <FlatList
                data={filteredPosts}
                keyExtractor={keyExtractor}
                renderItem={renderPost}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                    />
                }
                contentContainerStyle={styles.listContent}
                ListFooterComponent={listFooter}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
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
        backgroundColor: Colors.background,
    },
    sectionHeader: {
        paddingHorizontal: Theme.spacing.md,
        marginTop: Theme.spacing.sm,
        marginBottom: Theme.spacing.sm,
    },
    recommendedBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.borderRadius.md,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: Colors.white,
    },
    recommendedText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    recommendedList: {
        paddingHorizontal: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
    },
    emptyContainer: {
        padding: Theme.spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
});

export default HomeScreen;
