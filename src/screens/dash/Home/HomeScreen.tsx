import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
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

const RECOMMENDED_DATA = [
    { id: '1', name: 'Suresh', role: 'Science Teacher', image: IMAGES.dummyAvatar },
    { id: '2', name: 'Apoorva', role: 'Dance Teacher', image: IMAGES.dummyAvatar },
    { id: '3', name: 'Joshep', role: 'Software Engineer', image: IMAGES.dummyAvatar },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const { user } = useAppSelector(state => state.auth);
    const { posts, loading } = useAppSelector(state => state.post);

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        dispatch(getPosts());
    }, [dispatch]);

    const filteredPosts = React.useMemo(() => {
        if (!posts) return [];
        // Filter by category (post_type is 'discussion' in API, while UI uses Title Case)
        if (selectedCategory === 'All') return posts;
        return posts.filter(post =>
            post.post_type?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }, [posts, selectedCategory]);

    const handleCommentPress = useCallback((postId: string) => {
        DeviceEventEmitter.emit('OPEN_COMMENTS', { postId });
    }, []);

    const renderHeader = () => (
        <View>
            {/* Recommended Section */}
            <View style={styles.sectionHeader}>
                <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommended 👥</Text>
                </View>
            </View>

            <FlatList
                data={RECOMMENDED_DATA}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RecommendedCard
                        name={item.name}
                        role={item.role}
                        image={item.image}
                    />
                )}
                contentContainerStyle={styles.recommendedList}
            />

            {/* Categories */}
            <CategoryFilters
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />
        </View>
    );

    const renderPost = ({ item }: { item: any }) => {
        // Map API data to PostCard props
        return (
            <PostCard
                postId={item._id}
                authorName={item.user?.name || 'User'}
                authorAvatar={item.user?.emoji || 'https://i.pravatar.cc/150?u=' + item.user?._id}
                timeAgo={new Date(item.createdAt).toLocaleDateString()} // Basic formatting
                tag={item.post_type?.charAt(0).toUpperCase() + item.post_type?.slice(1)}
                content={item.desc}
                hashtags={item.tags || []}
                postImages={item.image}
                views={item.views || 0}
                likes={item.total_likes || 0}
                comments={item.total_comments || 0}
                initialIsLiked={item.is_liked}
                onCommentPress={() => handleCommentPress(item._id)}
            />
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <DashHeader
                userName={user?.name || "User"}
                userAvatar={user?.emoji}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onChatPress={() => navigation.navigate('Inbox')}
            />

            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item._id}
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
                ListFooterComponent={<View style={{ height: moderateScale(20) }} />}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
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
        // No flex: 1 here
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
