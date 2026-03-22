import React, { useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Text, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/commonHeader/Header';
import PostCard from '../Home/PostCard';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getPosts } from '../../../store/slices/postSlice';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { postId } = route.params;
    const dispatch = useAppDispatch();
    const { posts, loading } = useAppSelector(state => state.post);

    const post = useMemo(() => {
        return posts.find((p: any) => p._id === postId);
    }, [posts, postId]);

    useEffect(() => {
        if (!post && !loading) {
            dispatch(getPosts());
        }
    }, [post, loading, dispatch]);

    const handleCommentPress = useCallback((id: string) => {
        DeviceEventEmitter.emit('OPEN_COMMENTS', { postId: id });
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="Post Detail" showBack onBackPress={() => navigation.goBack()} />
            
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {post ? (
                    <PostCard
                        postId={post._id}
                        authorName={post.user?.name || 'User'}
                        authorId={post.user?._id}
                        authorAvatar={post.user?.emoji || 'https://i.pravatar.cc/150?u=' + post.user?._id}
                        timeAgo={new Date(post.createdAt).toLocaleDateString()}
                        tag={post.post_type?.charAt(0).toUpperCase() + post.post_type?.slice(1)}
                        content={post.desc}
                        hashtags={post.tags || []}
                        postImages={post.image}
                        views={post.views || 0}
                        likes={post.total_likes || 0}
                        comments={post.total_comments || 0}
                        initialIsLiked={post.is_liked}
                        onCommentPress={() => handleCommentPress(post._id)}
                    />
                ) : (
                    <View style={styles.notFoundContainer}>
                        <Text style={styles.notFoundText}>
                            {loading ? 'Loading post...' : 'Post not found.'}
                        </Text>
                    </View>
                )}
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
        paddingTop: 10,
        paddingBottom: 40,
    },
    notFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    notFoundText: {
        fontSize: 16,
        color: Colors.textSecondary,
    }
});

export default PostDetailScreen;
