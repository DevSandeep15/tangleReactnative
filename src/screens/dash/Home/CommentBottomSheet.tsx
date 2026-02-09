import React, { useMemo, useCallback, useState, forwardRef, useImperativeHandle, memo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetTextInput,
    BottomSheetFooter,
    BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addComment, getComments } from '../../../store/slices/postSlice';

interface Comment {
    id: string;
    author: string;
    text: string;
    avatar: string;
    time: string;
}

interface Props {
    postId: string | null;
    onClose: () => void;
}

export type CommentBottomSheetRef = {
    open: () => void;
    close: () => void;
};

// Memoized footer component to prevent remounting on every character
const CommentFooter = memo(({ onPost, userAvatar, ...props }: any) => {
    const insets = useSafeAreaInsets();
    const [text, setText] = useState('');

    const handlePost = () => {
        if (text.trim()) {
            onPost(text.trim());
            setText('');
            // Removed Keyboard.dismiss() to keep user in flow
        }
    };

    return (
        <BottomSheetFooter {...props} bottomInset={insets.bottom}>
            <View style={styles.footerContainer}>
                <Image
                    source={{ uri: userAvatar || 'https://i.pravatar.cc/150?u=me' }}
                    style={styles.inputAvatar}
                />
                <View style={styles.inputOuterContainer}>
                    <BottomSheetTextInput
                        style={styles.input as any}
                        placeholder="Add a comment..."
                        placeholderTextColor={Colors.textSecondary}
                        value={text}
                        onChangeText={setText}
                        multiline
                        maxLength={500}
                    />
                </View>
                <TouchableOpacity
                    style={styles.postButton}
                    onPress={handlePost}
                    disabled={!text.trim()}
                >
                    <Text
                        style={[
                            styles.postButtonText,
                            !text.trim() && styles.postButtonDisabled,
                        ]}
                    >
                        Post
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomSheetFooter>
    );
});

const CommentBottomSheet = forwardRef<CommentBottomSheetRef, Props>(({ postId, onClose }, ref) => {
    const dispatch = useAppDispatch();
    const sheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '95%'], []);
    const { user } = useAppSelector(state => state.auth);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [isPosting, setIsPosting] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // Fetch and sync comments
    useEffect(() => {
        if (postId) {
            const fetchComments = async () => {
                setIsLoading(true);
                try {
                    const result = await dispatch(getComments(postId)).unwrap();
                    // Transform API comments to our local UI interface
                    const transformed = (result.comments || []).map((c: any) => ({
                        id: c._id,
                        author: c.user_id?.name || 'User',
                        text: c.comment,
                        avatar: c.user_id?.profile_image || 'https://i.pravatar.cc/150?u=' + c.user_id?._id,
                        time: new Date(c.createdAt).toLocaleDateString(),
                    }));
                    setLocalComments(transformed);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchComments();
        } else {
            setLocalComments([]);
        }
    }, [postId, dispatch]);

    useImperativeHandle(ref, () => ({
        open: () => sheetRef.current?.snapToIndex(0),
        close: () => sheetRef.current?.close(),
    }));

    const handleAddComment = useCallback(async (text: string) => {
        if (!postId) return;

        setIsPosting(true);

        // Optimistic UI Update
        const newComment: Comment = {
            id: Date.now().toString(),
            author: user?.name || 'You',
            text: text,
            avatar: user?.emoji || 'https://i.pravatar.cc/150?u=me',
            time: 'Just now',
        };
        setLocalComments((prev) => [newComment, ...prev]);

        try {
            await dispatch(addComment({ postId, comment: text })).unwrap();
            console.log('Comment added successfully');
        } catch (error) {
            console.error('Failed to add comment:', error);
            // Optionally remove the optimistic comment on failure
        } finally {
            setIsPosting(false);
        }
    }, [postId, user, dispatch]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                onPress={onClose}
            />
        ),
        [onClose]
    );

    const renderComment = useCallback(({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{item.author}</Text>
                    <Text style={styles.commentTime}>{item.time}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    ), []);

    // Stabilized footer callback
    const renderFooter = useCallback(
        (props: any) => (
            <CommentFooter
                onPost={handleAddComment}
                userAvatar={user?.emoji || user?.profile_image}
                {...props}
            />
        ),
        [handleAddComment, user]
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={onClose}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            footerComponent={renderFooter}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Comments</Text>
                    {isLoading && <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 5 }} />}
                </View>

                <BottomSheetFlatList
                    data={localComments}
                    keyExtractor={(item: Comment) => item.id}
                    renderItem={renderComment}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            </View>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        alignItems: 'center',
        paddingVertical: Theme.spacing.md,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    listContent: {
        padding: Theme.spacing.md,
        paddingBottom: verticalScale(120),
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: Theme.spacing.lg,
    },
    commentAvatar: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        marginRight: Theme.spacing.sm,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    commentAuthor: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
        marginRight: Theme.spacing.xs,
    },
    commentTime: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    commentText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        lineHeight: 20,
    },
    footerContainer: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderTopWidth: 0.5,
        borderTopColor: '#F0F0F0',
    },
    inputAvatar: {
        width: moderateScale(34),
        height: moderateScale(34),
        borderRadius: moderateScale(17),
        marginRight: Theme.spacing.sm,
    },
    inputOuterContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: Theme.borderRadius.xl,
        paddingHorizontal: Theme.spacing.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        minHeight: moderateScale(40),
    },
    input: {
        flex: 1,
        maxHeight: moderateScale(100),
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        paddingVertical: moderateScale(8),
        paddingHorizontal: 0,
        textAlignVertical: 'center',
    },
    postButton: {
        paddingLeft: Theme.spacing.sm,
    },
    postButtonText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.primary || '#000',
    },
    postButtonDisabled: {
        opacity: 0.4,
    },
});

export default CommentBottomSheet;