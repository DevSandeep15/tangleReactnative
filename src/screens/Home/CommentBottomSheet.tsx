import React, { useMemo, useCallback, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
    BottomSheetTextInput,
    BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';

interface Comment {
    id: string;
    author: string;
    text: string;
    avatar: string;
    time: string;
}

interface CommentBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet>;
    onClose: () => void;
}

const CommentBottomSheet: React.FC<CommentBottomSheetProps> = ({
    bottomSheetRef,
    onClose,
}) => {
    // Instagram behavior: starts at 50%, expands to 90% when keyboard opens
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            author: 'Suresh Singh',
            text: 'Great capture! The lighting is perfect.',
            avatar: 'https://i.pravatar.cc/150?u=suresh',
            time: '10m',
        },
        {
            id: '2',
            author: 'Apoorva',
            text: 'Looks like fun!',
            avatar: 'https://i.pravatar.cc/150?u=apoorva',
            time: '5m',
        },
        {
            id: '3',
            author: 'Vikram',
            text: 'Where was this taken?',
            avatar: 'https://i.pravatar.cc/150?u=vikram',
            time: '2m',
        },
    ]);

    const handleAddComment = useCallback(() => {
        if (commentText.trim()) {
            const newComment: Comment = {
                id: Date.now().toString(),
                author: 'You',
                text: commentText.trim(),
                avatar: 'https://i.pravatar.cc/150?u=me',
                time: 'Just now',
            };
            setComments((prev) => [newComment, ...prev]);
            setCommentText('');
            Keyboard.dismiss();
        }
    }, [commentText]);

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

    const renderComment = ({ item }: { item: Comment }) => (
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
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={onClose}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
        >
            <BottomSheetView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Comments</Text>
                </View>

                {/* Comments List - Use BottomSheetFlatList for better keyboard handling */}
                <BottomSheetFlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderComment}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />

                {/* Input Footer - Fixed at bottom, follows keyboard */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <View style={styles.footerContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?u=me' }}
                            style={styles.inputAvatar}
                        />
                        <View style={styles.inputOuterContainer}>
                            <BottomSheetTextInput
                                style={styles.input}
                                placeholder="Add a comment..."
                                placeholderTextColor={Colors.textSecondary}
                                value={commentText}
                                onChangeText={setCommentText}
                                multiline
                                maxLength={500}
                                returnKeyType="default"
                                blurOnSubmit={false}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.postButton}
                            onPress={handleAddComment}
                            disabled={!commentText.trim()}
                        >
                            <Text
                                style={[
                                    styles.postButtonText,
                                    !commentText.trim() && styles.postButtonDisabled,
                                ]}
                            >
                                Post
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </BottomSheetView>
        </BottomSheet>
    );
};

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
        paddingBottom: Theme.spacing.xl,
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
        paddingTop: Theme.spacing.sm,
        paddingBottom: Platform.OS === 'ios' ? moderateScale(25) : moderateScale(10),
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
    },
    postButton: {
        paddingLeft: Theme.spacing.sm,
    },
    postButtonText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.primary,
    },
    postButtonDisabled: {
        opacity: 0.4,
    },
});

export default CommentBottomSheet;