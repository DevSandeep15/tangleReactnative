import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { ICONS } from '../../../constants/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = Theme.spacing.md;
const CARD_PADDING = Theme.spacing.md;
const IMAGE_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2) - (CARD_PADDING * 2);

import { useAppDispatch } from '../../../store/hooks';
import { toggleLike } from '../../../store/slices/postSlice';

interface PostCardProps {
    postId: string;
    authorName: string;
    authorAvatar: string;
    timeAgo: string;
    tag: string;
    content: string;
    hashtags: string[];
    postImage?: string;
    postImages?: string[];
    views: number;
    likes: number;
    comments: number;
    initialIsLiked?: boolean;
    onCommentPress?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
    postId,
    authorName,
    authorAvatar,
    timeAgo,
    tag,
    content,
    hashtags,
    postImage,
    postImages,
    views,
    likes: initialLikes,
    comments: initialCommentsCount,
    initialIsLiked = false,
    onCommentPress,
}) => {
    const dispatch = useAppDispatch();
    const [isLiked, setIsLiked] = React.useState(initialIsLiked);
    const [likeCount, setLikeCount] = React.useState(initialLikes);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const lastTap = React.useRef<number>(0);

    // Sync state with props if they change externally (e.g. refresh or global update)
    React.useEffect(() => {
        setLikeCount(initialLikes);
    }, [initialLikes]);

    React.useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    const images = postImages || (postImage ? [postImage] : []);

    const handleLike = () => {
        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

        // API Call
        dispatch(toggleLike(postId));
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

    const handleScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setActiveIndex(Math.round(index));
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

            {images.length > 0 && (
                <View style={styles.imageSliderContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleImagePress}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={styles.postImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        scrollEventThrottle={16}
                    />

                    {images.length > 1 && (
                        <View style={styles.indicatorContainer}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        activeIndex === index && styles.activeIndicator
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>
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
        marginHorizontal: CARD_MARGIN,
        marginBottom: Theme.spacing.md,
        padding: CARD_PADDING,
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
    imageSliderContainer: {
        width: IMAGE_WIDTH,
        height: moderateScale(350),
        borderRadius: Theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: Theme.spacing.sm,
    },
    postImage: {
        width: IMAGE_WIDTH,
        height: moderateScale(350),
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: Theme.spacing.sm,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: Theme.spacing.xs,
        paddingVertical: 4,
        borderRadius: 10,
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 3,
    },
    activeIndicator: {
        backgroundColor: Colors.white,
        width: 12,
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
