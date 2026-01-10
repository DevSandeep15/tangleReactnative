import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { ICONS } from '../../../constants/icons';
interface PostCardProps {
    authorName: string;
    authorAvatar: string;
    timeAgo: string;
    tag: string;
    content: string;
    hashtags: string[];
    postImage?: string;
    views: number;
    likes: number;
    comments: number;
    onCommentPress?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
    authorName,
    authorAvatar,
    timeAgo,
    tag,
    content,
    hashtags,
    postImage,
    views,
    likes: initialLikes,
    comments: initialCommentsCount,
    onCommentPress,
}) => {
    const [isLiked, setIsLiked] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(initialLikes);
    const lastTap = React.useRef<number>(0);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleImagePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
            if (!isLiked) {
                handleLike();
            }
        }
        lastTap.current = now;
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.authorInfo}>
                    <Image source={{ uri: authorAvatar }} style={styles.avatar} />
                    <View>
                        <Text style={styles.authorName}>{authorName}</Text>
                        <Text style={styles.timeAgo}>{timeAgo}</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                    <TouchableOpacity style={styles.menuIconContainer}>
                        <Image source={ICONS.menu} style={styles.menuIcon} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.content}>{content}</Text>
                <Text style={styles.hashtags}>
                    {hashtags.map(item => `#${item} `)}
                </Text>
            </View>

            {postImage && (
                <TouchableOpacity activeOpacity={0.9} onPress={handleImagePress}>
                    <Image source={{ uri: postImage }} style={styles.postImage} />
                </TouchableOpacity>
            )}

            <View style={styles.footer}>
                <View style={styles.stat}>
                    <Text style={styles.statIcon}>👁️</Text>
                    <Text style={styles.statValue}>{views}</Text>
                </View>
                <TouchableOpacity style={styles.stat} onPress={handleLike}>
                    <Text style={[styles.statIcon, isLiked && { color: 'red' }]}>{isLiked ? '❤️' : '🤍'}</Text>
                    <Text style={styles.statValue}>{likeCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stat} onPress={onCommentPress}>
                    <Text style={styles.statIcon}>💬</Text>
                    <Text style={styles.statValue}>{initialCommentsCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Theme.borderRadius.xl,
        marginHorizontal: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
        padding: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Theme.shadow.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        marginRight: Theme.spacing.sm,
    },
    authorName: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.semiBold,
        color: Colors.text,
    },
    timeAgo: {
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagBadge: {
        backgroundColor: '#FFE5E5',
        paddingHorizontal: Theme.spacing.sm + 1,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.borderRadius.lg,
        marginRight: Theme.spacing.xs,
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    tagText: {
        fontSize: moderateScale(10),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
    },
    menuIconContainer: {
        marginLeft: Theme.spacing.sm,
    },
    menuIcon: {
        width: moderateScale(15),
        height: moderateScale(15),
    },
    body: {
        marginBottom: Theme.spacing.sm,
    },
    content: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.text,
        lineHeight: 20,
    },
    hashtags: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.primary,
        marginTop: Theme.spacing.xs,
    },
    postImage: {
        width: '100%',
        height: moderateScale(200),
        borderRadius: Theme.borderRadius.lg,
        marginBottom: Theme.spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Theme.spacing.xs,
        borderTopWidth: 0.5,
        borderTopColor: '#F0F0F0',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Theme.spacing.lg,
    },
    statIcon: {
        fontSize: moderateScale(14),
        marginRight: Theme.spacing.xs,
    },
    statValue: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
});

export default PostCard;
